"use client";

import { useState } from "react";

type Review = {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isVerified: boolean;
  productName: string;
  customerName: string;
  createdAt: string;
};

export function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function setApproval(id: string, approved: boolean) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, isApproved: approved } : r)));
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: approved }),
    });
  }

  async function bulkApprove(approved: boolean) {
    await Promise.all(Array.from(selected).map((id) => setApproval(id, approved)));
    setSelected(new Set());
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const pending = reviews.filter((r) => !r.isApproved);

  return (
    <div className="space-y-8">
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-medium">Pending review ({pending.length})</h2>
          {selected.size > 0 && (
            <div className="flex gap-2">
              <button onClick={() => bulkApprove(true)} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-full">Approve selected</button>
              <button onClick={() => bulkApprove(false)} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-full">Reject selected</button>
            </div>
          )}
        </div>
        <div className="space-y-3">
          {pending.map((r) => (
            <div key={r.id} className="bg-white rounded-xl2 shadow-premium p-4 flex gap-3">
              <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="mt-1" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{r.productName} — {r.customerName}</p>
                  <span className="text-gold text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                </div>
                <p className="text-sm text-charcoal/70 mt-1">{r.comment}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setApproval(r.id, true)} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">Approve</button>
                  <button onClick={() => setApproval(r.id, false)} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">Reject</button>
                </div>
              </div>
            </div>
          ))}
          {pending.length === 0 && <p className="text-sm text-charcoal/50">No pending reviews.</p>}
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-3">All reviews</h2>
        <table className="w-full text-sm bg-white rounded-xl2 shadow-premium">
          <thead>
            <tr className="text-charcoal/60 text-left border-b border-sand">
              <th className="p-3">Product</th><th>Customer</th><th>Rating</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id} className="border-b border-sand/50">
                <td className="p-3">{r.productName}</td>
                <td>{r.customerName}</td>
                <td>{r.rating}★</td>
                <td>{r.isApproved ? "Approved" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
