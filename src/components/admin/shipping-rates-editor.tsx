"use client";

import { useState } from "react";
import { toast } from "sonner";

type Row = { code: string; nameAr: string; nameFr: string; homeFee: number; deskFee: number };

export function ShippingRatesEditor({ rows: initialRows }: { rows: Row[] }) {
  const [rows, setRows] = useState(initialRows);
  const [saving, setSaving] = useState(false);

  function update(code: string, key: "homeFee" | "deskFee", value: number) {
    setRows((prev) => prev.map((r) => (r.code === code ? { ...r, [key]: value } : r)));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/shipping-rates", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rates: rows.map((r) => ({ wilaya: r.code, homeFee: r.homeFee, deskFee: r.deskFee })) }),
    });
    setSaving(false);
    if (res.ok) toast.success("Shipping rates saved");
    else toast.error("Failed to save");
  }

  return (
    <div>
      <div className="max-h-96 overflow-y-auto border border-sand rounded-lg">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-sand-light">
            <tr className="text-left">
              <th className="p-2">Wilaya</th>
              <th className="p-2">Home fee (DZD)</th>
              <th className="p-2">Stop desk fee (DZD)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.code} className="border-t border-sand/50">
                <td className="p-2">{r.code} — {r.nameFr}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={r.homeFee}
                    onChange={(e) => update(r.code, "homeFee", Number(e.target.value))}
                    className="w-24 border border-sand rounded px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    value={r.deskFee}
                    onChange={(e) => update(r.code, "deskFee", Number(e.target.value))}
                    className="w-24 border border-sand rounded px-2 py-1"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={save}
        disabled={saving}
        className="mt-4 px-4 py-2 bg-terracotta text-white rounded-full text-sm disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save shipping rates"}
      </button>
    </div>
  );
}
