import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const schema = z.object({
  rates: z.array(
    z.object({
      wilaya: z.string(),
      homeFee: z.number().int().nonnegative(),
      deskFee: z.number().int().nonnegative(),
    })
  ),
});

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  await Promise.all(
    parsed.data.rates.map((r) =>
      prisma.shippingRate.upsert({
        where: { wilaya: r.wilaya },
        update: { homeFee: r.homeFee, deskFee: r.deskFee },
        create: { wilaya: r.wilaya, homeFee: r.homeFee, deskFee: r.deskFee },
      })
    )
  );

  return NextResponse.json({ success: true });
}
