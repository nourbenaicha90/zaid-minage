import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { OrdersTable } from "@/components/admin/orders-table";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string; wilaya?: string; payment?: string };
}) {
  const where: Prisma.OrderWhereInput = {
    ...(searchParams.status ? { status: searchParams.status as any } : {}),
    ...(searchParams.wilaya ? { wilaya: searchParams.wilaya } : {}),
    ...(searchParams.payment ? { paymentMethod: searchParams.payment as any } : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true, variant: true } } },
    take: 100,
  });

  return (
    <div>
      <h1 className="font-heading text-2xl mb-6">Orders</h1>
      <OrdersTable orders={orders} />
    </div>
  );
}
