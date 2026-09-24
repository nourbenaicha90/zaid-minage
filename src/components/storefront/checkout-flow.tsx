"use client";

import { useState, useMemo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { formatDZD, isValidAlgerianPhone } from "@/lib/utils";
import { WILAYAS, getShippingFee } from "@/lib/wilayas";
import { CheckCircle2 } from "lucide-react";

type CustomerInfo = {
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  city: string;
  address: string;
};

export function CheckoutFlow() {
  const t = useTranslations("checkout");
  const locale = useLocale() as "ar" | "fr";
  const { items, subtotal, clear } = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    wilaya: "39", // El Oued default (home base region)
    city: "",
    address: "",
  });
  const [deliveryMethod, setDeliveryMethod] = useState<"HOME" | "STOP_DESK">("HOME");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "STRIPE">("COD");
  const [orderResult, setOrderResult] = useState<{ orderNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const sub = subtotal();
  const shippingFee = useMemo(
    () => getShippingFee(customer.wilaya, deliveryMethod, sub),
    [customer.wilaya, deliveryMethod, sub]
  );
  const total = sub + shippingFee;

  const errors = {
    fullName: customer.fullName.trim().length < 2,
    phone: !isValidAlgerianPhone(customer.phone),
    city: customer.city.trim().length === 0,
    address: customer.address.trim().length < 3,
  };
  const step1Valid = !errors.fullName && !errors.phone && !errors.city && !errors.address;

  async function submitOrder() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: customer.fullName,
          phone: customer.phone,
          email: customer.email || undefined,
          wilaya: customer.wilaya,
          city: customer.city,
          address: customer.address,
          deliveryMethod,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        setSubmitting(false);
        return;
      }

      if (data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }

      setOrderResult({ orderNumber: data.order.orderNumber });
      clear();
      setStep(4);
    } catch (e) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && step !== 4) {
    return <p className="text-center py-16 text-charcoal/60">{locale === "ar" ? "سلتك فارغة." : "Votre panier est vide."}</p>;
  }

  return (
    <div>
      <Stepper step={step} />

      {step === 1 && (
        <div className="space-y-4 mt-8">
          <h2 className="font-heading text-xl">{t("step1Title")}</h2>
          <Field label={t("fullName")} error={errors.fullName && customer.fullName !== ""}>
            <input
              className="w-full border border-sand rounded px-3 py-2"
              value={customer.fullName}
              onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
            />
          </Field>
          <Field label={t("phone")} error={errors.phone && customer.phone !== ""} hint="0X XX XX XX XX / +213 X XX XX XX XX">
            <input
              className="w-full border border-sand rounded px-3 py-2"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              placeholder="0558700448"
            />
          </Field>
          <Field label={t("email")}>
            <input
              type="email"
              className="w-full border border-sand rounded px-3 py-2"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            />
          </Field>
          <Field label={t("wilaya")}>
            <select
              className="w-full border border-sand rounded px-3 py-2"
              value={customer.wilaya}
              onChange={(e) => setCustomer({ ...customer, wilaya: e.target.value })}
            >
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} — {locale === "ar" ? w.nameAr : w.nameFr}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("city")} error={errors.city && customer.city !== ""}>
            <input
              className="w-full border border-sand rounded px-3 py-2"
              value={customer.city}
              onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
            />
          </Field>
          <Field label={t("address")} error={errors.address && customer.address !== ""}>
            <textarea
              className="w-full border border-sand rounded px-3 py-2"
              rows={2}
              value={customer.address}
              onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            />
          </Field>

          <NextButton disabled={!step1Valid} onClick={() => setStep(2)} />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 mt-8">
          <h2 className="font-heading text-xl">{t("step2Title")}</h2>
          <DeliveryOption
            label={t("homeDelivery")}
            fee={getShippingFee(customer.wilaya, "HOME", sub)}
            selected={deliveryMethod === "HOME"}
            onSelect={() => setDeliveryMethod("HOME")}
            locale={locale}
          />
          <DeliveryOption
            label={t("stopDesk")}
            fee={getShippingFee(customer.wilaya, "STOP_DESK", sub)}
            selected={deliveryMethod === "STOP_DESK"}
            onSelect={() => setDeliveryMethod("STOP_DESK")}
            locale={locale}
          />
          <div className="flex gap-3 mt-4">
            <BackButton onClick={() => setStep(1)} locale={locale} />
            <NextButton onClick={() => setStep(3)} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 mt-8">
          <h2 className="font-heading text-xl">{t("step3Title")}</h2>
          <div className="space-y-3">
            <PaymentOption
              label={t("cod")}
              selected={paymentMethod === "COD"}
              onSelect={() => setPaymentMethod("COD")}
            />
            <PaymentOption
              label={t("stripe")}
              selected={paymentMethod === "STRIPE"}
              onSelect={() => setPaymentMethod("STRIPE")}
            />
          </div>

          <div className="border border-sand rounded-lg p-4 space-y-2">
            <h3 className="font-medium mb-2">{t("reviewOrder")}</h3>
            {items.map((i) => (
              <div key={`${i.productId}-${i.variantId ?? "b"}`} className="flex justify-between text-sm">
                <span>{(locale === "ar" ? i.nameAr : i.nameFr)} × {i.quantity}</span>
                <span>{formatDZD(i.unitPrice * i.quantity, locale)}</span>
              </div>
            ))}
            <div className="border-t border-sand pt-2 flex justify-between text-sm">
              <span>{locale === "ar" ? "المجموع الفرعي" : "Sous-total"}</span>
              <span>{formatDZD(sub, locale)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{locale === "ar" ? "التوصيل" : "Livraison"}</span>
              <span>{shippingFee === 0 ? (locale === "ar" ? "مجاني" : "Gratuit") : formatDZD(shippingFee, locale)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
              <span>{formatDZD(total, locale)}</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3">
            <BackButton onClick={() => setStep(2)} locale={locale} />
            <button
              onClick={submitOrder}
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-terracotta text-white font-medium disabled:opacity-50"
            >
              {submitting ? "..." : t("placeOrder")}
            </button>
          </div>
        </div>
      )}

      {step === 4 && orderResult && (
        <div className="text-center py-12">
          <CheckCircle2 className="mx-auto text-green-500 mb-4" size={56} />
          <h2 className="font-heading text-2xl mb-2">{t("step4Title")}</h2>
          <p className="text-charcoal/70 mb-1">
            {t("orderNumber")}: <span className="font-semibold">{orderResult.orderNumber}</span>
          </p>
          <p className="text-charcoal/70 mb-6">
            {t("estimatedDelivery")}: {estimatedDeliveryLabel(locale)}
          </p>
          <a
            href={`https://wa.me/213558700448?text=${encodeURIComponent(
              `${locale === "ar" ? "طلبي رقم" : "Ma commande n°"} ${orderResult.orderNumber}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#25D366] text-white rounded-full font-medium"
          >
            {locale === "ar" ? "تأكيد عبر واتساب" : "Confirmer sur WhatsApp"}
          </a>
        </div>
      )}
    </div>
  );
}

function estimatedDeliveryLabel(locale: "ar" | "fr") {
  const d = new Date();
  d.setDate(d.getDate() + 4);
  const formatted = d.toLocaleDateString("en-GB"); // DD/MM/YYYY, Western numerals per spec
  return formatted;
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className="flex-1 flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              n <= step ? "bg-terracotta text-white" : "bg-sand text-charcoal/50"
            }`}
          >
            {n}
          </div>
          {n < 4 && <div className={`flex-1 h-0.5 ${n < step ? "bg-terracotta" : "bg-sand"}`} />}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-charcoal/50 mt-1">{hint}</p>}
      {error && <p className="text-xs text-red-500 mt-1">Invalid value</p>}
    </div>
  );
}

function NextButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-3 rounded-full bg-terracotta text-white font-medium disabled:opacity-40"
    >
      Next →
    </button>
  );
}

function BackButton({ onClick, locale }: { onClick: () => void; locale: "ar" | "fr" }) {
  return (
    <button onClick={onClick} className="flex-1 py-3 rounded-full border border-sand font-medium">
      {locale === "ar" ? "رجوع" : "Retour"}
    </button>
  );
}

function DeliveryOption({
  label,
  fee,
  selected,
  onSelect,
  locale,
}: {
  label: string;
  fee: number;
  selected: boolean;
  onSelect: () => void;
  locale: "ar" | "fr";
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full flex justify-between items-center p-4 rounded-lg border-2 ${
        selected ? "border-terracotta bg-terracotta-50" : "border-sand"
      }`}
    >
      <span>{label}</span>
      <span className="font-medium">{fee === 0 ? (locale === "ar" ? "مجاني" : "Gratuit") : formatDZD(fee, locale)}</span>
    </button>
  );
}

function PaymentOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-start p-4 rounded-lg border-2 ${
        selected ? "border-terracotta bg-terracotta-50" : "border-sand"
      }`}
    >
      {label}
    </button>
  );
}
