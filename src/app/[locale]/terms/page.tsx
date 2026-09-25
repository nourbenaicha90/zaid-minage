import { setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/storefront/legal-page";

export default function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return (
    <LegalPage
      locale={locale}
      titleAr="الشروط والأحكام"
      titleFr="Conditions d'utilisation"
      sectionsAr={[
        { heading: "قبول الشروط", body: "باستخدامك موقع ZAID Minage فإنك توافق على هذه الشروط والأحكام." },
        { heading: "الطلبات والأسعار", body: "جميع الأسعار معروضة بالدينار الجزائري وقابلة للتغيير دون إشعار مسبق." },
        { heading: "التوصيل", body: "نبذل قصارى جهدنا لتوصيل الطلبات ضمن المدة المعلنة، لكن قد تحدث تأخيرات خارجة عن إرادتنا." },
        { heading: "الدفع", body: "نقبل الدفع عند الاستلام والدفع الإلكتروني عبر Stripe." },
        { heading: "الملكية الفكرية", body: "جميع المحتويات والصور على الموقع ملك لـ ZAID Minage ولا يجوز استخدامها دون إذن." },
      ]}
      sectionsFr={[
        { heading: "Acceptation des conditions", body: "En utilisant le site ZAID Minage, vous acceptez les présentes conditions d'utilisation." },
        { heading: "Commandes et prix", body: "Tous les prix sont affichés en dinars algériens et peuvent être modifiés sans préavis." },
        { heading: "Livraison", body: "Nous mettons tout en œuvre pour livrer dans les délais annoncés, mais des retards indépendants de notre volonté peuvent survenir." },
        { heading: "Paiement", body: "Nous acceptons le paiement à la livraison et le paiement en ligne via Stripe." },
        { heading: "Propriété intellectuelle", body: "Tout le contenu et les images du site appartiennent à ZAID Minage et ne peuvent être utilisés sans autorisation." },
      ]}
    />
  );
}
