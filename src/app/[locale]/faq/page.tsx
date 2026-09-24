const FAQ_AR = [
  { q: "ما هي مدة التوصيل؟", a: "يتم التوصيل خلال 2 إلى 5 أيام عمل حسب الولاية، عبر التوصيل للمنزل أو عبر مكتب التوصيل (Stop Desk)." },
  { q: "ما هو الدفع عند الاستلام (COD)؟", a: "تدفع ثمن طلبك نقداً عند استلامه من المندوب أو من مكتب التوصيل، دون الحاجة للدفع المسبق." },
  { q: "هل يمكنني إرجاع أو استبدال منتج؟", a: "نعم، يمكنك طلب الاستبدال أو الاسترجاع خلال 7 أيام من الاستلام، شرط أن يكون المنتج بحالته الأصلية." },
  { q: "هل التوصيل متوفر في جميع الولايات؟", a: "نعم، نوصل إلى جميع الولايات الـ58 في الجزائر، مع رسوم توصيل تختلف حسب المسافة." },
  { q: "كيف أتتبع طلبي؟", a: "بعد تأكيد الطلب، ستحصل على رابط تتبع في صفحة حسابك، وسنؤكد معك الطلب عبر واتساب." },
];

const FAQ_FR = [
  { q: "Quel est le délai de livraison ?", a: "La livraison prend entre 2 et 5 jours ouvrables selon la wilaya, à domicile ou via un bureau de livraison (Stop Desk)." },
  { q: "Qu'est-ce que le paiement à la livraison (COD) ?", a: "Vous payez le montant de votre commande en espèces à la réception, sans paiement anticipé requis." },
  { q: "Puis-je retourner ou échanger un produit ?", a: "Oui, vous pouvez demander un échange ou un retour dans les 7 jours suivant la réception, à condition que le produit soit dans son état d'origine." },
  { q: "La livraison est-elle disponible dans toutes les wilayas ?", a: "Oui, nous livrons dans les 58 wilayas d'Algérie, avec des frais de livraison qui varient selon la distance." },
  { q: "Comment suivre ma commande ?", a: "Après confirmation, vous recevrez un lien de suivi dans votre espace client, et nous confirmerons votre commande par WhatsApp." },
];

export default function FaqPage({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === "ar";
  const items = isAr ? FAQ_AR : FAQ_FR;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl mb-8">{isAr ? "الأسئلة الشائعة" : "Questions fréquentes"}</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <details key={i} className="border border-sand rounded-lg p-4 group">
            <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
              {item.q}
              <span className="text-terracotta group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-charcoal/70 text-sm mt-3">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
