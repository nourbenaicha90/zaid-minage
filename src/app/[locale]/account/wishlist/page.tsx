import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/storefront/product-card";

export const dynamic = "force-dynamic";

export default async function WishlistPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/${locale}/account`);

  const items = await prisma.wishlist.findMany({
    where: { userId: (session.user as any).id },
    include: { product: true },
  });

  const isAr = locale === "ar";

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-2xl mb-6">{isAr ? "قائمة الرغبات" : "Liste de souhaits"}</h1>
      {items.length === 0 ? (
        <p className="text-charcoal/60">{isAr ? "قائمتك فارغة." : "Votre liste est vide."}</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((i) => (
            <ProductCard key={i.id} product={{ ...i.product, createdAt: i.product.createdAt.toISOString() }} />
          ))}
        </div>
      )}
    </div>
  );
}
