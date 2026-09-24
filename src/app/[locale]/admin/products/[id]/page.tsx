import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id }, include: { variants: true } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Edit Product</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id,
          nameAr: product.nameAr,
          nameFr: product.nameFr,
          slug: product.slug,
          descriptionAr: product.descriptionAr,
          descriptionFr: product.descriptionFr,
          price: product.price,
          comparePrice: product.comparePrice,
          categoryId: product.categoryId,
          stock: product.stock,
          sku: product.sku,
          images: product.images,
          material: product.material ?? "",
          color: product.color ?? "",
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          variants: product.variants.map((v) => ({
            id: v.id, name: v.name, value: v.value, priceAdjustment: v.priceAdjustment, stock: v.stock,
          })),
        }}
      />
    </div>
  );
}
