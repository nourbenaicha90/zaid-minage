import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://zaidminage.dz";
  const products = await prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } });

  const staticPaths = ["", "/products", "/about", "/contact", "/faq", "/returns", "/privacy", "/terms"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of staticPaths) {
      entries.push({ url: `${baseUrl}/${locale}${path}`, lastModified: new Date() });
    }
    for (const p of products) {
      entries.push({ url: `${baseUrl}/${locale}/products/${p.slug}`, lastModified: p.updatedAt });
    }
  }

  return entries;
}
