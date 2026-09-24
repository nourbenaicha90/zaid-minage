import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/wilayas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const wilaya = req.nextUrl.searchParams.get("wilaya");
  const subtotal = Number(req.nextUrl.searchParams.get("subtotal") ?? "0");

  if (!wilaya) {
    return NextResponse.json({ error: "wilaya query param is required" }, { status: 400 });
  }

  try {
    const rate = await prisma.shippingRate.findUnique({ where: { wilaya } });
    if (!rate) {
      return NextResponse.json({ error: "Unknown wilaya code" }, { status: 404 });
    }

    const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

    return NextResponse.json({
      wilaya,
      homeFee: freeShipping ? 0 : rate.homeFee,
      deskFee: freeShipping ? 0 : rate.deskFee,
      freeShipping,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch shipping rate" }, { status: 500 });
  }
}
