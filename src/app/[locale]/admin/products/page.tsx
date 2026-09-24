import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDZD } from "@/lib/utils";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; stock?: string };
}) {
  const products = await prisma.product.findMany({
    where: {
      ...(searchParams.q
        ? { OR: [{ nameFr: { contains: searchParams.q, mode: "insensitive" } }, { sku: { contains: searchParams.q, mode: "insensitive" } }] }
        : {}),
      ...(searchParams.category ? { category: { slug: searchParams.category } } : {}),
      ...(searchParams.stock === "low" ? { stock: { lt: 5 } } : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-heading text-2xl">Products</h1>
        <Link href="/admin/products/new" className="flex items-center gap-1 px-4 py-2 bg-terracotta text-white rounded-full text-sm">
          <Plus size={16} /> New Product
        </Link>
      </div>

      <form className="flex gap-3 mb-4">
        <input name="q" defaultValue={searchParams.q} placeholder="Search by name or SKU" className="border border-sand rounded px-3 py-1.5 text-sm flex-1" />
        <select name="stock" defaultValue={searchParams.stock} className="border border-sand rounded px-3 py-1.5 text-sm">
          <option value="">All stock</option>
          <option value="low">Low stock (&lt;5)</option>
        </select>
        <button className="px-4 py-1.5 border border-sand rounded text-sm">Filter</button>
      </form>

      <div className="bg-white rounded-xl2 shadow-premium overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-charcoal/60 text-left border-b border-sand">
              <th className="p-3">Name (FR)</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={`border-b border-sand/50 ${p.stock < 5 ? "bg-amber-50" : ""}`}>
                <td className="p-3">{p.nameFr}</td>
                <td>{p.sku}</td>
                <td>{p.category.nameFr}</td>
                <td>{formatDZD(p.price, "fr")}</td>
                <td className={p.stock < 5 ? "text-amber-700 font-medium" : ""}>{p.stock}</td>
                <td>{p.isFeatured ? "✓" : ""}</td>
                <td>{p.isActive ? "✓" : "—"}</td>
                <td>
                  <Link href={`/admin/products/${p.id}`} className="text-terracotta text-xs underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
