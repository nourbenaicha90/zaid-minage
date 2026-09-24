"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatDZD } from "@/lib/utils";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale() as "ar" | "fr";
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <aside className="absolute top-0 end-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-sand">
          <h2 className="font-heading text-lg">{t("title")}</h2>
          <button onClick={closeCart} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-charcoal/70">{t("empty")}</p>
            <Link
              href={`/${locale}/products`}
              onClick={closeCart}
              className="px-4 py-2 bg-terracotta text-white rounded-full text-sm"
            >
              {t("continueShopping")}
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? "base"}`} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-sand-light flex-shrink-0">
                    <Image src={item.image} alt={locale === "ar" ? item.nameAr : item.nameFr} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{locale === "ar" ? item.nameAr : item.nameFr}</p>
                    <p className="text-terracotta text-sm">{formatDZD(item.unitPrice, locale)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                        className="w-6 h-6 border border-sand rounded flex items-center justify-center"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                        className="w-6 h-6 border border-sand rounded flex items-center justify-center"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        aria-label={t("remove")}
                        className="ms-2 text-charcoal/50 hover:text-terracotta"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-sand space-y-2">
              <div className="flex justify-between text-sm">
                <span>{t("subtotal")}</span>
                <span>{formatDZD(subtotal(), locale)}</span>
              </div>
              <p className="text-xs text-charcoal/60">{t("shipping")}: {locale === "ar" ? "يُحسب عند الدفع" : "calculé au paiement"}</p>
              <Link
                href={`/${locale}/checkout`}
                onClick={closeCart}
                className="block text-center w-full py-3 bg-terracotta text-white rounded-full font-medium mt-2 hover:bg-terracotta-700 transition"
              >
                {t("checkout")}
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
