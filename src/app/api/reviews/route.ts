import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(1000),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const userId = (session.user as any).id;

  // Verified-purchase check: has this user got a DELIVERED order containing this product?
  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId: parsed.data.productId,
      order: { userId, status: "DELIVERED" },
    },
  });

  const review = await prisma.review.create({
    data: {
      productId: parsed.data.productId,
      userId,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      isVerified: Boolean(purchase),
      isApproved: false, // goes into admin moderation queue
    },
  });

  return NextResponse.json({ review }, { status: 201 });
}
