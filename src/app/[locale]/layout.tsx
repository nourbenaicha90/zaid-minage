import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
// import { getMessages } from "next-intl/server";
import { getMessages, setRequestLocale } from "next-intl/server";

import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/storefront/whatsapp-button";
import { Toaster } from "sonner";
import { AuthSessionProvider } from "@/components/layout/auth-session-provider";
import { Analytics } from "@/components/layout/analytics";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "ZAID Minage | ديكور منزلي وأدوات مطبخ فاخرة",
  description:
    "متجر ZAID Minage - قمار، الجزائر. أدوات مطبخ وديكور منزلي فاخر بتوصيل سريع لكل الولايات.",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as Locale)) notFound();
  setRequestLocale(locale);


  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen flex flex-col bg-offwhite text-charcoal">
        <Analytics />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthSessionProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <WhatsAppButton />
            <Toaster position={dir === "rtl" ? "top-left" : "top-right"} richColors />
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
