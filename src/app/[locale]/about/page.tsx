// import { getTranslations } from "next-intl/server";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const isAr = locale === "ar";
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl mb-6">{isAr ? "من نحن" : "À propos de nous"}</h1>
      <div className="prose prose-neutral max-w-none space-y-4 text-charcoal/80 leading-relaxed">
        {isAr ? (
          <>
            <p>
              ZAID Minage هو متجر متخصص في أدوات المطبخ الفاخرة وديكور المنزل، انطلق من قمار،
              ولاية الوادي، ليقدم للعائلة الجزائرية قطعاً مختارة بعناية غير متوفرة عادة في
              الأسواق المحلية.
            </p>
            <p>
              بدأنا كصفحة على فيسبوك وتوسعنا لنصل إلى أكثر من 10,000 متابع، بفضل ثقتكم في جودة
              منتجاتنا وسرعة التوصيل. اليوم، نفخر بتقديم تجربة تسوق إلكترونية كاملة، مع نفس
              الالتزام بالجودة والخدمة التي عرفتمونا بها.
            </p>
            <p>هدفنا بسيط: أن يجد كل بيت جزائري قطعة تُضفي عليه لمسة من الفخامة والأناقة.</p>
          </>
        ) : (
          <>
            <p>
              ZAID Minage est une boutique spécialisée dans les ustensiles de cuisine haut de
              gamme et la décoration d'intérieur, née à Guemar, wilaya d'El Oued, pour offrir aux
              foyers algériens des pièces soigneusement sélectionnées, introuvables sur le marché
              local.
            </p>
            <p>
              Nous avons commencé comme une page Facebook et avons grandi pour atteindre plus de
              10 000 abonnés, grâce à votre confiance dans la qualité de nos produits et la
              rapidité de notre livraison. Aujourd'hui, nous sommes fiers de proposer une
              expérience d'achat en ligne complète, avec le même engagement envers la qualité.
            </p>
            <p>Notre objectif est simple : que chaque foyer algérien trouve une pièce qui lui apporte élégance et raffinement.</p>
          </>
        )}
      </div>
    </div>
  );
}
