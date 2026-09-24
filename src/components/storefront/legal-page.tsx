export function LegalPage({
  titleAr,
  titleFr,
  locale,
  sectionsAr,
  sectionsFr,
}: {
  titleAr: string;
  titleFr: string;
  locale: string;
  sectionsAr: { heading: string; body: string }[];
  sectionsFr: { heading: string; body: string }[];
}) {
  const isAr = locale === "ar";
  const sections = isAr ? sectionsAr : sectionsFr;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="font-heading text-3xl mb-8">{isAr ? titleAr : titleFr}</h1>
      <div className="space-y-6">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-medium text-lg mb-2">{s.heading}</h2>
            <p className="text-charcoal/70 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
