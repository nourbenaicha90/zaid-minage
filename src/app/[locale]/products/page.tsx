import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SearchParams = {
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "popular";
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  page?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = Number(searchParams.page ?? "1");

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(searchParams.category ? { category: { slug: searchParams.category } } : {}),
    ...(searchParams.q
      ? {
          OR: [
            { nameAr: { contains: searchParams.q, mode: "insensitive" } },
            { nameFr: { contains: searchParams.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(searchParams.minPrice || searchParams.maxPrice
      ? {
          price: {
            ...(searchParams.minPrice ? { gte: Number(searchParams.minPrice) } : {}),
            ...(searchParams.maxPrice ? { lte: Number(searchParams.maxPrice) } : {}),
          },
        }
      : {}),
  };

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    searchParams.sort === "price_asc"
      ? { price: "asc" }
      : searchParams.sort === "price_desc"
      ? { price: "desc" }
      : searchParams.sort === "popular"
      ? { isFeatured: "desc" }
      : { createdAt: "desc" };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ where: { isActive: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1">
        <ProductFilters categories={categories} />
      </aside>

      <section className="md:col-span-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={{ ...p, createdAt: p.createdAt.toISOString() }} />
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-charcoal/60 py-16">No products match these filters.</p>
        )}

        {totalPages > 1 && (
          <nav className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <a
                key={n}
                href={`?page=${n}`}
                className={`w-9 h-9 flex items-center justify-center rounded-full border ${
                  n === page ? "bg-terracotta text-white border-terracotta" : "border-sand"
                }`}
              >
                {n}
              </a>
            ))}
          </nav>
        )}
      </section>
    </div>
  );
}
