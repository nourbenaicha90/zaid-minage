import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDZD } from "@/lib/utils";
import { AuthForms } from "@/components/storefront/auth-forms";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage({ params: { locale } }: { params: { locale: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <AuthForms locale={locale} />
      </div>
    );
  }

  const userId = (session.user as any).id;
  const [orders, addresses] = await Promise.all([
    prisma.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.address.findMany({ where: { userId } }),
  ]);

  const isAr = locale === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="font-heading text-2xl">{isAr ? `مرحباً، ${session.user.name}` : `Bonjour, ${session.user.name}`}</h1>
        <p className="text-charcoal/60 text-sm">{(session.user as any).phone}</p>
      </div>

      <section>
        <h2 className="font-medium text-lg mb-4">{isAr ? "طلباتي" : "Mes commandes"}</h2>
        {orders.length === 0 ? (
          <p className="text-charcoal/60 text-sm">{isAr ? "لا توجد طلبات بعد." : "Aucune commande pour le moment."}</p>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="flex justify-between items-center border border-sand rounded-lg p-3 text-sm">
                <div>
                  <p className="font-medium">{o.orderNumber}</p>
                  <p className="text-charcoal/50">{new Date(o.createdAt).toLocaleDateString("en-GB")}</p>
                </div>
                <div className="text-end">
                  <p>{formatDZD(o.total, isAr ? "ar" : "fr")}</p>
                  <p className="text-xs text-terracotta">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-medium text-lg mb-4">{isAr ? "عناويني" : "Mes adresses"}</h2>
        {addresses.length === 0 ? (
          <p className="text-charcoal/60 text-sm">{isAr ? "لا توجد عناوين محفوظة." : "Aucune adresse enregistrée."}</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {addresses.map((a) => (
              <div key={a.id} className="border border-sand rounded-lg p-3 text-sm">
                <p className="font-medium">{a.label} {a.isDefault && "★"}</p>
                <p>{a.fullName} — {a.phone}</p>
                <p className="text-charcoal/60">{a.street}, {a.city}, {a.wilaya}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <Link href={`/${locale}/account/wishlist`} className="text-terracotta text-sm underline">
          {isAr ? "قائمة الرغبات" : "Ma liste de souhaits"}
        </Link>
      </section>
    </div>
  );
}
