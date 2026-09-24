import { LegalPage } from "@/components/storefront/legal-page";

export default function ReturnsPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <LegalPage
      locale={locale}
      titleAr="سياسة الاستبدال والاسترجاع"
      titleFr="Politique de retour et remboursement"
      sectionsAr={[
        { heading: "مدة الاسترجاع", body: "يمكنك طلب استبدال أو استرجاع أي منتج خلال 7 أيام من تاريخ الاستلام." },
        { heading: "شروط القبول", body: "يجب أن يكون المنتج في حالته الأصلية، غير مستعمل، وبتغليفه الأصلي." },
        { heading: "كيفية الطلب", body: "تواصل معنا عبر واتساب على +213 558 70 04 48 مع ذكر رقم الطلب وسبب الاسترجاع." },
        { heading: "المنتجات غير القابلة للاسترجاع", body: "لا يمكن استرجاع المنتجات المخفضة بشكل نهائي أو المصنوعة حسب الطلب." },
        { heading: "استرداد المبلغ", body: "بالنسبة لطلبات الدفع عند الاستلام، يتم الاسترداد عبر تحويل بنكي أو استبدال بمنتج آخر." },
      ]}
      sectionsFr={[
        { heading: "Délai de retour", body: "Vous pouvez demander un échange ou un retour dans les 7 jours suivant la réception." },
        { heading: "Conditions d'acceptation", body: "Le produit doit être dans son état d'origine, non utilisé, et dans son emballage d'origine." },
        { heading: "Comment procéder", body: "Contactez-nous sur WhatsApp au +213 558 70 04 48 en précisant le numéro de commande et le motif du retour." },
        { heading: "Produits non retournables", body: "Les produits soldés définitivement ou fabriqués sur commande ne peuvent pas être retournés." },
        { heading: "Remboursement", body: "Pour les commandes payées à la livraison, le remboursement se fait par virement bancaire ou par échange." },
      ]}
    />
  );
}
