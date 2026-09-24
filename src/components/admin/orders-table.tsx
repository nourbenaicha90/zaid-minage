"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDZD } from "@/lib/utils";
import { X, Printer, MessageCircle, Download } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: { nameAr: string; nameFr: string; images: string[] };
  variant: { value: string } | null;
};

type Order = {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  wilaya: string;
  city: string;
  address: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  paymentMethod: string;
  deliveryMethod: string;
  status: string;
  notes: string | null;
  createdAt: string | Date;
  items: OrderItem[];
};

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<Order | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [localOrders, setLocalOrders] = useState(orders);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`?${params.toString()}`);
  }

  async function updateStatus(orderId: string, status: string) {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setLocalOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      if (selected?.id === orderId) setSelected({ ...selected, status });
    }
  }

  async function bulkUpdate(status: string) {
    await Promise.all(Array.from(selectedIds).map((id) => updateStatus(id, status)));
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function exportCsv() {
    const header = ["Order #", "Customer", "Phone", "Wilaya", "Total", "Payment", "Status", "Date"];
    const rows = localOrders.map((o) => [
      o.orderNumber,
      o.fullName,
      o.phone,
      o.wilaya,
      o.total,
      o.paymentMethod,
      o.status,
      new Date(o.createdAt).toLocaleDateString("en-GB"),
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zaid-minage-orders.csv";
    a.click();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          className="border border-sand rounded px-3 py-1.5 text-sm"
          defaultValue={searchParams.get("status") ?? ""}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="border border-sand rounded px-3 py-1.5 text-sm"
          defaultValue={searchParams.get("payment") ?? ""}
          onChange={(e) => updateFilter("payment", e.target.value)}
        >
          <option value="">All payment methods</option>
          <option value="COD">COD</option>
          <option value="STRIPE">Stripe</option>
        </select>

        {selectedIds.size > 0 && (
          <div className="flex gap-2 ms-auto">
            <button onClick={() => bulkUpdate("CONFIRMED")} className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full">
              Confirm ({selectedIds.size})
            </button>
            <button onClick={() => bulkUpdate("SHIPPED")} className="text-xs px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full">
              Mark Shipped
            </button>
            <button onClick={() => bulkUpdate("CANCELLED")} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full">
              Cancel
            </button>
          </div>
        )}

        <button onClick={exportCsv} className="text-sm flex items-center gap-1 ms-auto px-3 py-1.5 border border-sand rounded-full">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl2 shadow-premium overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-charcoal/60 text-left border-b border-sand">
              <th className="p-3"><input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? new Set(localOrders.map(o=>o.id)) : new Set())} /></th>
              <th className="p-3">Order #</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Wilaya</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {localOrders.map((o) => (
              <tr key={o.id} className="border-b border-sand/50 hover:bg-sand-light/40">
                <td className="p-3"><input type="checkbox" checked={selectedIds.has(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                <td className="p-3 font-medium">{o.orderNumber}</td>
                <td>{o.fullName}</td>
                <td>{o.phone}</td>
                <td>{o.wilaya}</td>
                <td>{formatDZD(o.total, "fr")}</td>
                <td>{o.paymentMethod}</td>
                <td>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="text-xs border border-sand rounded px-1 py-0.5"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(o.createdAt).toLocaleDateString("en-GB")}</td>
                <td>
                  <button onClick={() => setSelected(o)} className="text-terracotta text-xs underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <aside className="absolute top-0 end-0 h-full w-full sm:w-[480px] bg-white shadow-2xl overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-lg">{selected.orderNumber}</h2>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>

            <div className="space-y-1 text-sm mb-4">
              <p><strong>{selected.fullName}</strong> — {selected.phone}</p>
              <p>{selected.address}, {selected.city}, wilaya {selected.wilaya}</p>
              <p>{selected.deliveryMethod === "HOME" ? "Home delivery" : "Stop desk"}</p>
            </div>

            <div className="space-y-2 mb-4">
              {selected.items.map((it) => (
                <div key={it.id} className="flex justify-between text-sm border-b border-sand/50 pb-1">
                  <span>{it.product.nameFr} {it.variant ? `(${it.variant.value})` : ""} × {it.quantity}</span>
                  <span>{formatDZD(it.totalPrice, "fr")}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm pt-2">
                <span>Subtotal</span><span>{formatDZD(selected.subtotal, "fr")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span><span>{formatDZD(selected.shippingFee, "fr")}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span><span>{formatDZD(selected.total, "fr")}</span>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g, "")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#25D366] text-white rounded-full text-sm"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
              <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-1 py-2 border border-sand rounded-full text-sm">
                <Printer size={14} /> Print
              </button>
            </div>

            <label className="text-sm font-medium">Internal notes</label>
            <textarea defaultValue={selected.notes ?? ""} rows={3} className="w-full border border-sand rounded p-2 text-sm mt-1" />
          </aside>
        </div>
      )}
    </div>
  );
}
