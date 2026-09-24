"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, User, Search } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { CartDrawer } from "@/components/storefront/cart-drawer";

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.openCart);

  function switchLocale(next: "ar" | "fr") {
    // Swap the leading /ar or /fr segment, preserve the rest of the path.
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  }

  return (
    <header className="sticky top-0 z-40 bg-offwhite/95 backdrop-blur border-b border-sand shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="font-heading text-2xl font-semibold text-terracotta">
          ZAID Minage
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href={`/${locale}/products?category=kitchenware`} className="hover:text-terracotta">
            {t("kitchenware")}
          </Link>
          <Link href={`/${locale}/products?category=decor`} className="hover:text-terracotta">
            {t("decor")}
          </Link>
          <Link href={`/${locale}/products?category=cups-glassware`} className="hover:text-terracotta">
            {t("cups")}
          </Link>
          <Link href={`/${locale}/about`} className="hover:text-terracotta">
            {t("about")}
          </Link>
          <Link href={`/${locale}/contact`} className="hover:text-terracotta">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button aria-label={t("search")} className="p-2 hover:text-terracotta">
            <Search size={20} />
          </button>

          <div className="flex text-xs border border-sand rounded-full overflow-hidden">
            <button
              onClick={() => switchLocale("ar")}
              className={`px-2 py-1 ${locale === "ar" ? "bg-terracotta text-white" : ""}`}
            >
              ع
            </button>
            <button
              onClick={() => switchLocale("fr")}
              className={`px-2 py-1 ${locale === "fr" ? "bg-terracotta text-white" : ""}`}
            >
              FR
            </button>
          </div>

          <Link href={`/${locale}/account`} aria-label={t("account")} className="p-2 hover:text-terracotta">
            <User size={20} />
          </Link>

          <button
            onClick={openCart}
            aria-label={t("cart")}
            className="relative p-2 hover:text-terracotta"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -end-1 bg-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
