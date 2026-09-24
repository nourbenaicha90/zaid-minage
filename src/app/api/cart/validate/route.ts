import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const schema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().positive(),
    })
  ),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const results = await Promise.all(
    parsed.data.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || !product.isActive) {
        return { ...item, valid: false, reason: "unavailable" as const };
      }

      const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : undefined;
      const stock = variant?.stock ?? product.stock;
      const unitPrice = product.price + (variant?.priceAdjustment ?? 0);

      return {
        ...item,
        valid: stock >= item.quantity,
        reason: stock < item.quantity ? ("insufficient_stock" as const) : undefined,
        availableStock: stock,
        currentUnitPrice: unitPrice,
      };
    })
  );

  const allValid = results.every((r) => r.valid);
  return NextResponse.json({ valid: allValid, items: results });
}
