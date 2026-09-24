export default function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === "ar";
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl mb-8">{isAr ? "اتصل بنا" : "Contact"}</h1>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <ContactRow label={isAr ? "الهاتف / واتساب" : "Téléphone / WhatsApp"} value="+213 558 70 04 48" href="https://wa.me/213558700448" />
          <ContactRow label="Instagram" value="@zaidminage" href="https://instagram.com/zaidminage" />
          <ContactRow label="Facebook" value="@ZAID Minage" href="https://facebook.com/ZAIDMinage" />
          <ContactRow label={isAr ? "الموقع" : "Adresse"} value={isAr ? "قمار، ولاية الوادي، الجزائر" : "Guemar, El Oued, Algérie"} />
        </div>

        <div className="rounded-xl2 overflow-hidden shadow-premium h-72">
          <iframe
            title="ZAID Minage — Guemar location"
            src="https://www.google.com/maps?q=Guemar,+El+Oued,+Algeria&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

function ContactRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="text-sm text-charcoal/50">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-terracotta font-medium">
          {value}
        </a>
      ) : (
        <p className="font-medium">{value}</p>
      )}
    </div>
  );
}
