"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { formatDZD } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  slug: string;
  nameAr: string;
  nameFr: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  stock: number;
  isFeatured?: boolean;
  createdAt?: string;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const locale = useLocale() as "ar" | "fr";
  const t = useTranslations("product");
  const name = locale === "ar" ? product.nameAr : product.nameFr;

  const isNew =
    product.createdAt && Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 14;
  const isLowStock = product.stock > 0 && product.stock < 5;
  const isOut = product.stock === 0;

  return (
    <Link
      href={`/${locale}/products/${product.slug}`}
      className="group block rounded-xl2 overflow-hidden bg-white shadow-premium hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="relative aspect-square bg-sand-light">
        <Image
          src={product.images[0] ?? "/placeholder-products/default.jpg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 start-2 flex flex-col gap-1">
          {isNew && <Badge color="bg-gold">{t("new")}</Badge>}
          {product.isFeatured && <Badge color="bg-terracotta">{t("bestseller")}</Badge>}
          {isLowStock && <Badge color="bg-red-500">{t("limitedStock")}</Badge>}
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium line-clamp-2">{name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-terracotta font-semibold">{formatDZD(product.price, locale)}</span>
          {product.comparePrice && (
            <span className="text-xs text-charcoal/40 line-through">
              {formatDZD(product.comparePrice, locale)}
            </span>
          )}
        </div>
        {isOut && <p className="text-xs text-red-500 mt-1">{t("outOfStock")}</p>}
      </div>
    </Link>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`${color} text-white text-[10px] px-2 py-0.5 rounded-full`}>{children}</span>
  );
}
