import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductPurchasePanel } from "@/components/storefront/product-purchase-panel";
import { ProductCard } from "@/components/storefront/product-card";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations("product");

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!product || !product.isActive) notFound();

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    take: 4,
  });

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery images={product.images} name={locale === "ar" ? product.nameAr : product.nameFr} />
        <ProductPurchasePanel
          product={{
            id: product.id,
            nameAr: product.nameAr,
            nameFr: product.nameFr,
            price: product.price,
            comparePrice: product.comparePrice,
            stock: product.stock,
            images: product.images,
            variants: product.variants,
          }}
          avgRating={avgRating}
          reviewCount={product.reviews.length}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-10 mt-16">
        <div>
          <h2 className="font-heading text-xl mb-3">{t("description")}</h2>
          <p className="text-charcoal/80 whitespace-pre-line">
            {locale === "ar" ? product.descriptionAr : product.descriptionFr}
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xl mb-3">{t("specifications")}</h2>
          <table className="w-full text-sm">
            <tbody>
              {product.material && (
                <tr className="border-b border-sand">
                  <td className="py-2 text-charcoal/60">{locale === "ar" ? "الخامة" : "Matériau"}</td>
                  <td className="py-2">{product.material}</td>
                </tr>
              )}
              {product.color && (
                <tr className="border-b border-sand">
                  <td className="py-2 text-charcoal/60">{locale === "ar" ? "اللون" : "Couleur"}</td>
                  <td className="py-2">{product.color}</td>
                </tr>
              )}
              <tr className="border-b border-sand">
                <td className="py-2 text-charcoal/60">SKU</td>
                <td className="py-2">{product.sku}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-heading text-xl mb-3">{t("reviews")}</h2>
        {product.reviews.length === 0 ? (
          <p className="text-charcoal/60 text-sm">
            {locale === "ar" ? "لا توجد تقييمات حتى الآن." : "Aucun avis pour le moment."}
          </p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="border border-sand rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                  {r.isVerified && (
                    <span className="text-xs text-terracotta bg-terracotta-50 px-2 py-0.5 rounded-full">
                      {locale === "ar" ? "عملية شراء موثقة" : "Achat vérifié"}
                    </span>
                  )}
                </div>
                <p className="text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-heading text-xl mb-3">{t("relatedProducts")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={{ ...p, createdAt: p.createdAt.toISOString() }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
