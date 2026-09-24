import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Configure as a Vercel Cron Job (vercel.json) hitting this route every 5-10 minutes.
// Protect with CRON_SECRET so only Vercel's scheduler (or you) can trigger it.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 30 * 60 * 1000);

  const staleOrders = await prisma.order.findMany({
    where: {
      paymentMethod: "STRIPE",
      status: "PENDING",
      createdAt: { lt: cutoff },
    },
    include: { items: true },
  });

  for (const order of staleOrders) {
    await prisma.$transaction(async (tx) => {
      // Restock every line item since payment never completed.
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { increment: item.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }
      await tx.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } });
    });
  }

  return NextResponse.json({ cancelled: staleOrders.length });
}
