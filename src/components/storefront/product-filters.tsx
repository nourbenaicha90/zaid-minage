"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

type Category = { slug: string; nameAr: string; nameFr: string };

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale() as "ar" | "fr";

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-6 sticky top-24">
      <div>
        <h3 className="font-medium mb-2">{locale === "ar" ? "الفئة" : "Catégorie"}</h3>
        <div className="space-y-1 text-sm">
          <button
            onClick={() => updateParam("category", "")}
            className={`block w-full text-start ${!searchParams.get("category") ? "text-terracotta font-medium" : ""}`}
          >
            {locale === "ar" ? "الكل" : "Tout"}
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateParam("category", c.slug)}
              className={`block w-full text-start ${searchParams.get("category") === c.slug ? "text-terracotta font-medium" : ""}`}
            >
              {locale === "ar" ? c.nameAr : c.nameFr}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">{locale === "ar" ? "السعر (د.ج)" : "Prix (DZD)"}</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={locale === "ar" ? "من" : "Min"}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={() => updateParam("minPrice", minPrice)}
            className="w-1/2 border border-sand rounded px-2 py-1 text-sm"
          />
          <input
            type="number"
            placeholder={locale === "ar" ? "إلى" : "Max"}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={() => updateParam("maxPrice", maxPrice)}
            className="w-1/2 border border-sand rounded px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">{locale === "ar" ? "الترتيب" : "Trier par"}</h3>
        <select
          defaultValue={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full border border-sand rounded px-2 py-1 text-sm"
        >
          <option value="newest">{locale === "ar" ? "الأحدث" : "Nouveautés"}</option>
          <option value="price_asc">{locale === "ar" ? "السعر: من الأقل" : "Prix croissant"}</option>
          <option value="price_desc">{locale === "ar" ? "السعر: من الأعلى" : "Prix décroissant"}</option>
          <option value="popular">{locale === "ar" ? "الأكثر شعبية" : "Popularité"}</option>
        </select>
      </div>
    </div>
  );
}
