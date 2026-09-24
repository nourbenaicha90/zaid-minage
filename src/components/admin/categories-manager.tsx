"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

type Category = {
  id: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
};

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function CategoriesManager({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [nameAr, setNameAr] = useState("");
  const [nameFr, setNameFr] = useState("");
  const [creating, setCreating] = useState(false);

  async function create() {
    if (!nameAr || !nameFr) return;
    setCreating(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameAr, nameFr, slug: slugify(nameFr), sortOrder: categories.length,
        }),
      });
      if (!res.ok) throw new Error();
      const { category } = await res.json();
      setCategories([...categories, category]);
      setNameAr(""); setNameFr("");
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    } finally {
      setCreating(false);
    }
  }

  async function update(id: string, patch: Partial<Category>) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
  }

  async function remove(id: string) {
    if (!confirm("Delete this category? Products in it will need reassignment.")) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...categories];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    next.forEach((c, i) => (c.sortOrder = i));
    setCategories(next);
    next.forEach((c) => update(c.id, { sortOrder: c.sortOrder }));
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl2 shadow-premium p-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">الاسم (عربي)</label>
          <input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className="w-full border border-sand rounded px-3 py-2" />
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium block mb-1">Nom (Français)</label>
          <input value={nameFr} onChange={(e) => setNameFr(e.target.value)} className="w-full border border-sand rounded px-3 py-2" />
        </div>
        <button onClick={create} disabled={creating} className="px-4 py-2 bg-terracotta text-white rounded-full text-sm">
          Add category
        </button>
      </div>

      <div className="bg-white rounded-xl2 shadow-premium divide-y divide-sand">
        {categories.map((c, i) => (
          <div key={c.id} className="flex items-center gap-4 p-4">
            <div className="flex flex-col">
              <button onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp size={14} /></button>
              <button onClick={() => move(i, 1)} disabled={i === categories.length - 1}><ArrowDown size={14} /></button>
            </div>
            <div className="flex-1">
              <p className="font-medium">{c.nameFr} / {c.nameAr}</p>
              <p className="text-xs text-charcoal/50">/{c.slug}</p>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={c.isActive} onChange={(e) => update(c.id, { isActive: e.target.checked })} />
              Active
            </label>
            <button onClick={() => remove(c.id)} className="text-red-500"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
