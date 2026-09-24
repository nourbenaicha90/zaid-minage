import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  value: z.string(),
  priceAdjustment: z.number().int(),
  stock: z.number().int().nonnegative(),
});

const productSchema = z.object({
  nameAr: z.string().min(1),
  nameFr: z.string().min(1),
  slug: z.string().min(1),
  descriptionAr: z.string(),
  descriptionFr: z.string(),
  price: z.number().int().nonnegative(),
  comparePrice: z.number().int().nonnegative().nullable().optional(),
  categoryId: z.string().min(1),
  stock: z.number().int().nonnegative(),
  sku: z.string().min(1),
  images: z.array(z.string()),
  material: z.string().optional(),
  color: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  variants: z.array(variantSchema).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { variants, ...productData } = parsed.data;

  try {
    // Replace variants wholesale — simplest consistent approach for admin edits.
    await prisma.productVariant.deleteMany({ where: { productId: params.id } });

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...productData,
        variants: variants && variants.length > 0
          ? { create: variants.map(({ id, ...v }) => v) }
          : undefined,
      },
      include: { variants: true },
    });
    return NextResponse.json({ product });
  } catch (err: any) {
    if (err.code === "P2002") {
      return NextResponse.json({ error: "Slug or SKU already exists" }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
