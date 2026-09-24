import { prisma } from "@/lib/prisma";
import { WILAYAS } from "@/lib/wilayas";
import { ShippingRatesEditor } from "@/components/admin/shipping-rates-editor";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const rates = await prisma.shippingRate.findMany();
  const rateMap = new Map(rates.map((r) => [r.wilaya, r]));

  const rows = WILAYAS.map((w) => ({
    code: w.code,
    nameAr: w.nameAr,
    nameFr: w.nameFr,
    homeFee: rateMap.get(w.code)?.homeFee ?? 0,
    deskFee: rateMap.get(w.code)?.deskFee ?? 0,
  }));

  return (
    <div className="space-y-10 max-w-4xl">
      <h1 className="font-heading text-2xl">Settings</h1>

      <section className="bg-white rounded-xl2 shadow-premium p-5">
        <h2 className="font-medium mb-4">Store info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Store name" defaultValue="ZAID Minage" />
          <Field label="Phone / WhatsApp" defaultValue="+213 558 70 04 48" />
          <Field label="Instagram handle" defaultValue="@zaidminage" />
          <Field label="Facebook page" defaultValue="@ZAID Minage" />
          <Field label="Location" defaultValue="Guemar, El Oued, Algeria" />
        </div>
        <p className="text-xs text-charcoal/50 mt-3">
          Wire this form to a Settings model / key-value store to persist changes in production.
        </p>
      </section>

      <section className="bg-white rounded-xl2 shadow-premium p-5">
        <h2 className="font-medium mb-4">Payment settings</h2>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Enable Cash on Delivery (COD)</label>
          <label className="flex items-center gap-2"><input type="checkbox" /> Enable Stripe card payments</label>
          <Field label="Stripe publishable key" defaultValue="" placeholder="pk_live_..." />
          <p className="text-xs text-charcoal/50">Secret key is set via STRIPE_SECRET_KEY env var, never exposed here.</p>
        </div>
      </section>

      <section className="bg-white rounded-xl2 shadow-premium p-5">
        <h2 className="font-medium mb-4">Shipping fee matrix (per wilaya, DZD)</h2>
        <ShippingRatesEditor rows={rows} />
      </section>
    </div>
  );
}

function Field({ label, defaultValue, placeholder }: { label: string; defaultValue?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block font-medium mb-1">{label}</label>
      <input defaultValue={defaultValue} placeholder={placeholder} className="w-full border border-sand rounded px-3 py-2" />
    </div>
  );
}
