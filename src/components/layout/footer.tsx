import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Instagram, Facebook, Phone } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  return (
    <footer className="bg-charcoal text-sand mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h3 className="font-heading text-lg text-white mb-3">ZAID Minage</h3>
          <p className="opacity-80">{t("location")}</p>
          <p className="opacity-80 mt-1 flex items-center gap-1">
            <Phone size={14} /> +213 558 70 04 48
          </p>
        </div>

        <div>
          <h4 className="text-white mb-3">{t("aboutUs")}</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link href={`/${locale}/about`}>{t("aboutUs")}</Link></li>
            <li><Link href={`/${locale}/faq`}>{t("faq")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">{t("terms")}</h4>
          <ul className="space-y-2 opacity-80">
            <li><Link href={`/${locale}/returns`}>{t("returns")}</Link></li>
            <li><Link href={`/${locale}/privacy`}>{t("privacy")}</Link></li>
            <li><Link href={`/${locale}/terms`}>{t("terms")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white mb-3">{t("followUs")}</h4>
          <div className="flex gap-3">
            <a href="https://facebook.com/ZAIDMinage" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="https://instagram.com/zaidminage" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs opacity-60 pb-6">
        © {new Date().getFullYear()} ZAID Minage — Guemar, Algeria
      </div>
    </footer>
  );
}
