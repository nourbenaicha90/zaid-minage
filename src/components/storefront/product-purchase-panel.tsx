"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDZD } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

type Variant = { id: string; name: string; value: string; priceAdjustment: number; stock: number };

type Props = {
  product: {
    id: string;
    nameAr: string;
    nameFr: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    images: string[];
    variants: Variant[];
  };
  avgRating: number | null;
  reviewCount: number;
};

export function ProductPurchasePanel({ product, avgRating, reviewCount }: Props) {
  const t = useTranslations("product");
  const locale = useLocale() as "ar" | "fr";
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(
    product.variants[0]?.id
  );
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const stock = selectedVariant?.stock ?? product.stock;
  const finalPrice = product.price + (selectedVariant?.priceAdjustment ?? 0);

  const name = locale === "ar" ? product.nameAr : product.nameFr;

  const stockLabel = useMemo(() => {
    if (stock === 0) return { text: t("outOfStock"), color: "text-red-500" };
    if (stock < 5) return { text: t("lowStock"), color: "text-amber-600" };
    return { text: t("inStock"), color: "text-green-600" };
  }, [stock, t]);

  function handleAddToCart(goToCheckout = false) {
    if (stock === 0) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      nameAr: product.nameAr,
      nameFr: product.nameFr,
      image: product.images[0] ?? "/placeholder-products/default.jpg",
      unitPrice: finalPrice,
      quantity,
      stock,
    });
    if (goToCheckout) {
      router.push(`/${locale}/checkout`);
    } else {
      toast.success(locale === "ar" ? "أُضيف إلى السلة" : "Ajouté au panier");
      openCart();
    }
  }

  const waText = encodeURIComponent(
    `${locale === "ar" ? "مهتم بهذا المنتج:" : "Intéressé par ce produit :"} ${name} — ${formatDZD(finalPrice, locale)}`
  );

  return (
    <div>
      <h1 className="font-heading text-2xl mb-2">{name}</h1>

      {avgRating !== null && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          <span className="text-gold">{"★".repeat(Math.round(avgRating))}{"☆".repeat(5 - Math.round(avgRating))}</span>
          <span className="text-charcoal/60">({reviewCount})</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl font-semibold text-terracotta">{formatDZD(finalPrice, locale)}</span>
        {product.comparePrice && (
          <span className="text-charcoal/40 line-through">{formatDZD(product.comparePrice, locale)}</span>
        )}
      </div>

      <p className={`text-sm font-medium mb-4 ${stockLabel.color}`}>{stockLabel.text}</p>

      {product.variants.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">{product.variants[0].name}</p>
          <div className="flex gap-2 flex-wrap">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                className={`px-3 py-1.5 rounded-full border text-sm ${
                  selectedVariantId === v.id
                    ? "border-terracotta bg-terracotta text-white"
                    : "border-sand"
                }`}
              >
                {v.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6">
        <p className="text-sm font-medium">{t("quantity")}</p>
        <div className="flex items-center border border-sand rounded-full">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-1">
            −
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            className="px-3 py-1"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => handleAddToCart(false)}
          disabled={stock === 0}
          className="flex-1 py-3 rounded-full border-2 border-terracotta text-terracotta font-medium disabled:opacity-40"
        >
          {t("addToCart")}
        </button>
        <button
          onClick={() => handleAddToCart(true)}
          disabled={stock === 0}
          className="flex-1 py-3 rounded-full bg-terracotta text-white font-medium disabled:opacity-40"
        >
          {t("buyNow")}
        </button>
      </div>

      <a
        href={`https://wa.me/213558700448?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-green-600 underline"
      >
        {t("shareWhatsApp")}
      </a>
    </div>
  );
}
