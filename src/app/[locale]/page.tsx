import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export const revalidate = 60;

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("home");

  const [newArrivals, bestSellers, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-sand-light">
        <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-8 items-center">
          <div className="reveal">
            <h1 className="font-heading text-4xl md:text-5xl leading-tight text-charcoal mb-4">
              {t("heroTitle")}
            </h1>
            <p className="text-charcoal/70 mb-6 max-w-md">{t("heroSubtitle")}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-block px-6 py-3 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta-700 transition"
            >
              {t("shopNow")}
            </Link>
          </div>
          <div className="relative h-72 md:h-96 rounded-xl2 overflow-hidden shadow-premium">
            <Image src="/placeholder-products/hero.jpg" alt="ZAID Minage" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="font-heading text-2xl mb-6">{t("categories")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/products?category=${cat.slug}`}
              className="relative h-40 rounded-xl2 overflow-hidden bg-sand shadow-premium flex items-end p-4 group"
            >
              <Image
                src={cat.image ?? "/placeholder-products/category-default.jpg"}
                alt={locale === "ar" ? cat.nameAr : cat.nameFr}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 -z-10"
              />
              <span className="relative z-10 text-white font-medium bg-charcoal/50 px-3 py-1 rounded-full text-sm">
                {locale === "ar" ? cat.nameAr : cat.nameFr}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="font-heading text-2xl mb-6">{t("newArrivals")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, createdAt: p.createdAt.toISOString() }}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-14">
          <h2 className="font-heading text-2xl mb-6">{t("bestSellers")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={{ ...p, createdAt: p.createdAt.toISOString() }} />
            ))}
          </div>
        </section>
      )}

      {/* Trust badges */}
      <section className="bg-sand-light py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <TrustBadge icon={<ShieldCheck />} label={t("trustSecure")} />
          <TrustBadge icon={<Truck />} label={t("trustDelivery")} />
          <TrustBadge icon={<BadgeCheck />} label={t("trustQuality")} />
        </div>
      </section>
    </div>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-terracotta">{icon}</div>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
