import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getShippingFee } from "@/lib/wilayas";
import { generateOrderNumber, isValidAlgerianPhone } from "@/lib/utils";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const orderItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().int().positive(),
});

const createOrderSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().refine(isValidAlgerianPhone, "Invalid Algerian phone number"),
  email: z.string().email().optional().or(z.literal("")),
  wilaya: z.string(), // wilaya code, e.g. "39"
  city: z.string().min(1),
  address: z.string().min(3),
  deliveryMethod: z.enum(["HOME", "STOP_DESK"]),
  paymentMethod: z.enum(["COD", "STRIPE"]),
  notes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
});

// GET /api/orders — current user's order history (auth required)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true, variant: true } } },
  });

  return NextResponse.json({ orders });
}

// POST /api/orders — create a new order (COD or Stripe). Stock is deducted
// only once the order is created here (never on cart add), inside a
// transaction so stock checks and deduction are atomic.
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const session = await getServerSession(authOptions);

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Re-fetch live product/variant data & validate stock server-side.
      let subtotal = 0;
      const lineItems: {
        productId: string;
        variantId?: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[] = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
        if (!product || !product.isActive) {
          throw new Error(`PRODUCT_UNAVAILABLE:${item.productId}`);
        }

        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : undefined;

        const availableStock = variant ? variant.stock : product.stock;
        if (availableStock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.nameFr}`);
        }

        const unitPrice = product.price + (variant?.priceAdjustment ?? 0);
        const totalPrice = unitPrice * item.quantity;
        subtotal += totalPrice;

        lineItems.push({
          productId: product.id,
          variantId: variant?.id,
          quantity: item.quantity,
          unitPrice,
          totalPrice,
        });

        // Deduct stock now (order confirmed at creation for COD flow;
        // for Stripe this still reserves stock, released by the 30-min
        // auto-cancel cron job on non-payment).
        if (variant) {
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stock: { decrement: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: product.id },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      const shippingFee = getShippingFee(data.wilaya, data.deliveryMethod, subtotal);
      const total = subtotal + shippingFee;

      const orderCount = await tx.order.count();
      const orderNumber = generateOrderNumber(orderCount + 1);

      return tx.order.create({
        data: {
          orderNumber,
          userId: (session?.user as any)?.id,
          status: "PENDING",
          subtotal,
          shippingFee,
          total,
          paymentMethod: data.paymentMethod,
          deliveryMethod: data.deliveryMethod,
          wilaya: data.wilaya,
          city: data.city,
          address: data.address,
          fullName: data.fullName,
          phone: data.phone,
          email: data.email || undefined,
          notes: data.notes,
          items: { create: lineItems },
        },
        include: { items: true },
      });
    });

    // Stripe branch: create a Checkout Session and return its URL.
    if (data.paymentMethod === "STRIPE") {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
        apiVersion: "2024-06-20",
      });
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd", // Stripe doesn't support DZD; convert at checkout or bill in USD/EUR
              product_data: { name: `ZAID Minage order ${order.orderNumber}` },
              unit_amount: order.total, // NOTE: convert DZD->minor currency unit before production use
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order=${order.orderNumber}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
        metadata: { orderId: order.id },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({ order, stripeUrl: checkoutSession.url });
    }

    // COD branch — order is PENDING until admin confirms (phone verification).
    return NextResponse.json({ order });
  } catch (err: any) {
    console.error(err);
    if (typeof err.message === "string" && err.message.startsWith("INSUFFICIENT_STOCK")) {
      return NextResponse.json(
        { error: `Insufficient stock: ${err.message.split(":")[1]}` },
        { status: 409 }
      );
    }
    if (typeof err.message === "string" && err.message.startsWith("PRODUCT_UNAVAILABLE")) {
      return NextResponse.json({ error: "One or more products are no longer available" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
