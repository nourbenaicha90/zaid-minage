import { prisma } from "@/lib/prisma";
import { formatDZD } from "@/lib/utils";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { OrderStatusDonut } from "@/components/admin/order-status-donut";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    todayOrders,
    pendingCount,
    totalProducts,
    lowStockCount,
    recentOrders,
    ordersLast30,
    statusCounts,
  ] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lt: 5 } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { total: true, createdAt: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  // Bucket revenue by day for the chart
  const revenueByDay: Record<string, number> = {};
  for (const o of ordersLast30) {
    const key = o.createdAt.toISOString().slice(0, 10);
    revenueByDay[key] = (revenueByDay[key] ?? 0) + o.total;
  }
  const chartData = Object.entries(revenueByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, revenue]) => ({ date, revenue }));

  const donutData = statusCounts.map((s) => ({ name: s.status, value: s._count }));

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard label="Today's Revenue" value={formatDZD(todayRevenue, "fr")} />
        <KpiCard label="Orders Today" value={String(todayOrders.length)} />
        <KpiCard label="Pending Orders" value={String(pendingCount)} highlight={pendingCount > 0} />
        <KpiCard label="Total Products" value={String(totalProducts)} />
        <KpiCard label="Low Stock Items" value={String(lowStockCount)} highlight={lowStockCount > 0} />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl2 shadow-premium p-4">
          <h2 className="font-medium mb-4">Revenue — last 30 days</h2>
          <RevenueChart data={chartData} />
        </div>
        <div className="bg-white rounded-xl2 shadow-premium p-4">
          <h2 className="font-medium mb-4">Order status distribution</h2>
          <OrderStatusDonut data={donutData} />
        </div>
      </div>

      <div className="bg-white rounded-xl2 shadow-premium p-4">
        <h2 className="font-medium mb-4">Recent orders</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-charcoal/60 text-left border-b border-sand">
              <th className="py-2">Order #</th>
              <th>Customer</th>
              <th>Wilaya</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-sand/50">
                <td className="py-2 font-medium">{o.orderNumber}</td>
                <td>{o.fullName}</td>
                <td>{o.wilaya}</td>
                <td>{formatDZD(o.total, "fr")}</td>
                <td>{o.paymentMethod}</td>
                <td>
                  <StatusPill status={o.status} />
                </td>
                <td>{o.createdAt.toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl2 shadow-premium p-4 ${highlight ? "bg-terracotta-50" : "bg-white"}`}>
      <p className="text-xs text-charcoal/60 mb-1">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-indigo-100 text-indigo-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${colors[status] ?? "bg-gray-100"}`}>{status}</span>
  );
}
