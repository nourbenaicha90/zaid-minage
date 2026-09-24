import { LegalPage } from "@/components/storefront/legal-page";

export default function PrivacyPage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <LegalPage
      locale={locale}
      titleAr="سياسة الخصوصية"
      titleFr="Politique de confidentialité"
      sectionsAr={[
        { heading: "البيانات التي نجمعها", body: "نجمع اسمك، رقم هاتفك، عنوانك، وبريدك الإلكتروني عند إنشاء حساب أو إتمام طلب." },
        { heading: "كيفية استخدام بياناتك", body: "نستخدم بياناتك لمعالجة طلباتك، التواصل معك بخصوص التوصيل، وتحسين خدماتنا." },
        { heading: "مشاركة البيانات", body: "لا نشارك بياناتك مع أطراف ثالثة إلا في حدود ما يلزم لتنفيذ التوصيل (شركات الشحن) أو الدفع (Stripe)." },
        { heading: "أمان البيانات", body: "نستخدم تشفير HTTPS وإجراءات أمان قياسية لحماية معلوماتك." },
        { heading: "حقوقك", body: "يمكنك طلب الاطلاع على بياناتك أو حذفها في أي وقت عبر التواصل معنا." },
      ]}
      sectionsFr={[
        { heading: "Données collectées", body: "Nous collectons votre nom, téléphone, adresse et e-mail lors de la création d'un compte ou d'une commande." },
        { heading: "Utilisation des données", body: "Nous utilisons vos données pour traiter vos commandes, communiquer sur la livraison et améliorer nos services." },
        { heading: "Partage des données", body: "Nous ne partageons vos données qu'avec les prestataires nécessaires (livraison, paiement Stripe)." },
        { heading: "Sécurité", body: "Nous utilisons le chiffrement HTTPS et des mesures de sécurité standard pour protéger vos informations." },
        { heading: "Vos droits", body: "Vous pouvez demander l'accès ou la suppression de vos données à tout moment en nous contactant." },
      ]}
    />
  );
}
