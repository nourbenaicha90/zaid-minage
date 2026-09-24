import { prisma } from "@/lib/prisma";
import { formatDZD } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const customers = await prisma.user.findMany({
    where: {
      role: "CLIENT",
      ...(searchParams.q
        ? {
            OR: [
              { name: { contains: searchParams.q, mode: "insensitive" } },
              { phone: { contains: searchParams.q, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { orders: true, addresses: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Customers</h1>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Search by name or phone"
          className="border border-sand rounded px-3 py-1.5 text-sm w-72"
        />
      </form>

      <div className="bg-white rounded-xl2 shadow-premium overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-charcoal/60 text-left border-b border-sand">
              <th className="p-3">Name</th>
              <th>Phone</th>
              <th>Wilaya</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const totalSpent = c.orders.reduce((s, o) => s + o.total, 0);
              const lastOrder = c.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
              return (
                <tr key={c.id} className="border-b border-sand/50">
                  <td className="p-3">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.addresses[0]?.wilaya ?? "—"}</td>
                  <td>{c.orders.length}</td>
                  <td>{formatDZD(totalSpent, "fr")}</td>
                  <td>{lastOrder ? lastOrder.createdAt.toLocaleDateString("en-GB") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
