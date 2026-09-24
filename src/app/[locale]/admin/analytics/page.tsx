import { prisma } from "@/lib/prisma";
import { formatDZD } from "@/lib/utils";
import { WilayaBarChart } from "@/components/admin/wilaya-bar-chart";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const orders = await prisma.order.findMany({
    where: { status: { not: "CANCELLED" } },
    include: { items: { include: { product: { include: { category: true } } } } },
  });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const aov = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  // Orders by wilaya
  const byWilaya: Record<string, number> = {};
  for (const o of orders) byWilaya[o.wilaya] = (byWilaya[o.wilaya] ?? 0) + 1;
  const wilayaData = Object.entries(byWilaya)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([wilaya, count]) => ({ wilaya, count }));

  // Repeat customer rate
  const ordersByUser: Record<string, number> = {};
  for (const o of orders) {
    if (!o.userId) continue;
    ordersByUser[o.userId] = (ordersByUser[o.userId] ?? 0) + 1;
  }
  const totalCustomers = Object.keys(ordersByUser).length;
  const repeatCustomers = Object.values(ordersByUser).filter((c) => c > 1).length;
  const repeatRate = totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  // Top categories by revenue
  const byCategory: Record<string, number> = {};
  for (const o of orders) {
    for (const item of o.items) {
      const catName = item.product.category.nameFr;
      byCategory[catName] = (byCategory[catName] ?? 0) + item.totalPrice;
    }
  }
  const topCategories = Object.entries(byCategory).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Total revenue" value={formatDZD(totalRevenue, "fr")} />
        <KpiCard label="Average order value" value={formatDZD(aov, "fr")} />
        <KpiCard label="Repeat customer rate" value={`${repeatRate}%`} />
        <KpiCard label="Total orders" value={String(orders.length)} />
      </div>

      <div className="bg-white rounded-xl2 shadow-premium p-4">
        <h2 className="font-medium mb-4">Orders by wilaya (top 10)</h2>
        <WilayaBarChart data={wilayaData} />
      </div>

      <div className="bg-white rounded-xl2 shadow-premium p-4">
        <h2 className="font-medium mb-4">Top categories by revenue</h2>
        <div className="space-y-2">
          {topCategories.map(([name, revenue]) => (
            <div key={name} className="flex justify-between text-sm border-b border-sand/50 py-2">
              <span>{name}</span>
              <span className="font-medium">{formatDZD(revenue, "fr")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-premium p-4">
        <h2 className="font-medium mb-2">Conversion funnel</h2>
        <p className="text-sm text-charcoal/60">
          Visits → Add to Cart → Checkout → Purchase requires client-side analytics (GA4 / Meta Pixel)
          event tracking wired up — see the Integrations section of the README for setup.
        </p>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl2 shadow-premium p-4">
      <p className="text-xs text-charcoal/60 mb-1">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
