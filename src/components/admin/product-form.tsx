"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Category = { id: string; nameAr: string; nameFr: string };
type Variant = { id?: string; name: string; value: string; priceAdjustment: number; stock: number };

type ProductFormData = {
  id?: string;
  nameAr: string;
  nameFr: string;
  slug: string;
  descriptionAr: string;
  descriptionFr: string;
  price: number;
  comparePrice: number | null;
  categoryId: string;
  stock: number;
  sku: string;
  images: string[];
  material: string;
  color: string;
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
};

const empty: ProductFormData = {
  nameAr: "", nameFr: "", slug: "", descriptionAr: "", descriptionFr: "",
  price: 0, comparePrice: null, categoryId: "", stock: 0, sku: "",
  images: [], material: "", color: "", isFeatured: false, isActive: true, variants: [],
};

export function ProductForm({ categories, initial }: { categories: Category[]; initial?: ProductFormData }) {
  const router = useRouter();
  const [tab, setTab] = useState<"ar" | "fr">("ar");
  const [form, setForm] = useState<ProductFormData>(initial ?? empty);
  const [saving, setSaving] = useState(false);

  function slugify(text: string) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function addVariant() {
    setForm({ ...form, variants: [...form.variants, { name: "Color", value: "", priceAdjustment: 0, stock: 0 }] });
  }
  function removeVariant(i: number) {
    setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) });
  }
  function updateVariant(i: number, patch: Partial<Variant>) {
    setForm({ ...form, variants: form.variants.map((v, idx) => (idx === i ? { ...v, ...patch } : v)) });
  }

  function addImageUrl() {
    const url = prompt("Cloudinary image URL (drag & drop upload wired via next-cloudinary in production):");
    if (url) setForm({ ...form, images: [...form.images, url] });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(form.id ? `/api/admin/products/${form.id}` : "/api/admin/products", {
        method: form.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Product saved");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex gap-2 border-b border-sand">
        <button onClick={() => setTab("ar")} className={`px-4 py-2 text-sm ${tab === "ar" ? "border-b-2 border-terracotta font-medium" : ""}`}>العربية</button>
        <button onClick={() => setTab("fr")} className={`px-4 py-2 text-sm ${tab === "fr" ? "border-b-2 border-terracotta font-medium" : ""}`}>Français</button>
      </div>

      {tab === "ar" ? (
        <div className="space-y-3" dir="rtl">
          <LabeledInput label="اسم المنتج" value={form.nameAr} onChange={(v) => setForm({ ...form, nameAr: v, slug: form.slug || slugify(v) })} />
          <LabeledTextarea label="الوصف" value={form.descriptionAr} onChange={(v) => setForm({ ...form, descriptionAr: v })} />
        </div>
      ) : (
        <div className="space-y-3">
          <LabeledInput label="Product name" value={form.nameFr} onChange={(v) => setForm({ ...form, nameFr: v, slug: form.slug || slugify(v) })} />
          <LabeledTextarea label="Description" value={form.descriptionFr} onChange={(v) => setForm({ ...form, descriptionFr: v })} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <LabeledInput label="Slug" value={form.slug} onChange={(v) => setForm({ ...form, slug: v })} />
        <LabeledInput label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
        <LabeledInput label="Price (DZD)" type="number" value={String(form.price)} onChange={(v) => setForm({ ...form, price: Number(v) })} />
        <LabeledInput label="Compare price (DZD)" type="number" value={String(form.comparePrice ?? "")} onChange={(v) => setForm({ ...form, comparePrice: v ? Number(v) : null })} />
        <LabeledInput label="Stock" type="number" value={String(form.stock)} onChange={(v) => setForm({ ...form, stock: Number(v) })} />
        <div>
          <label className="text-sm font-medium block mb-1">Category</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-sand rounded px-3 py-2">
            <option value="">Select...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.nameFr}</option>)}
          </select>
        </div>
        <LabeledInput label="Material" value={form.material} onChange={(v) => setForm({ ...form, material: v })} />
        <LabeledInput label="Color" value={form.color} onChange={(v) => setForm({ ...form, color: v })} />
      </div>

      <div>
        <label className="text-sm font-medium block mb-1">Images</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative w-16 h-16 bg-sand-light rounded overflow-hidden">
              <img src={img} className="w-full h-full object-cover" />
              <button onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })} className="absolute top-0 right-0 bg-black/60 text-white text-xs px-1">×</button>
            </div>
          ))}
        </div>
        <button onClick={addImageUrl} className="text-sm px-3 py-1.5 border border-sand rounded">+ Add image (Cloudinary)</button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium">Variants</label>
          <button onClick={addVariant} className="text-xs px-2 py-1 border border-sand rounded">+ Add variant</button>
        </div>
        {form.variants.map((v, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 mb-2 items-center">
            <input placeholder="Name (e.g. Color)" value={v.name} onChange={(e) => updateVariant(i, { name: e.target.value })} className="border border-sand rounded px-2 py-1 text-sm" />
            <input placeholder="Value (e.g. Gold)" value={v.value} onChange={(e) => updateVariant(i, { value: e.target.value })} className="border border-sand rounded px-2 py-1 text-sm" />
            <input type="number" placeholder="Price adj." value={v.priceAdjustment} onChange={(e) => updateVariant(i, { priceAdjustment: Number(e.target.value) })} className="border border-sand rounded px-2 py-1 text-sm" />
            <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })} className="border border-sand rounded px-2 py-1 text-sm" />
            <button onClick={() => removeVariant(i)} className="text-red-500 text-xs">Remove</button>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
        </label>
      </div>

      <button onClick={save} disabled={saving} className="px-6 py-3 bg-terracotta text-white rounded-full font-medium disabled:opacity-50">
        {saving ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}

function LabeledInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-sand rounded px-3 py-2" />
    </div>
  );
}

function LabeledTextarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm font-medium block mb-1">{label}</label>
      <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-sand rounded px-3 py-2" />
    </div>
  );
}
