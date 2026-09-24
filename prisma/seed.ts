import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { WILAYAS, SHIPPING_MATRIX } from "../src/lib/wilayas";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ZAID Minage database...");

  // --- Shipping rates per wilaya ---
  for (const w of WILAYAS) {
    const rates = SHIPPING_MATRIX[w.tier];
    await prisma.shippingRate.upsert({
      where: { wilaya: w.code },
      update: { homeFee: rates.home, deskFee: rates.stopDesk },
      create: { wilaya: w.code, homeFee: rates.home, deskFee: rates.stopDesk },
    });
  }

  // --- Categories ---
  const categories = [
    { nameAr: "أدوات المطبخ", nameFr: "Ustensiles de cuisine", slug: "kitchenware", sortOrder: 1 },
    { nameAr: "ديكور المنزل", nameFr: "Décoration maison", slug: "decor", sortOrder: 2 },
    { nameAr: "أكواب وأدوات زجاجية", nameFr: "Tasses & Verrerie", slug: "cups-glassware", sortOrder: 3 },
  ];

  const createdCategories = [];
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: c,
      create: c,
    });
    createdCategories.push(cat);
  }
  const [kitchenware, decor, cups] = createdCategories;

  // --- Products (bilingual, DZD pricing) ---
  const products = [
    {
      nameAr: "طقم أواني طبخ فاخر (5 قطع)",
      nameFr: "Set de casseroles premium (5 pièces)",
      slug: "premium-cookware-set-5pc",
      descriptionAr: "طقم أواني طبخ من الستانلس ستيل عالي الجودة، مقاوم للصدأ ومناسب لجميع أنواع المواقد بما في ذلك الإندكشن.",
      descriptionFr: "Set de casseroles en acier inoxydable haute qualité, résistant à la rouille, compatible avec toutes les plaques y compris induction.",
      price: 12500,
      comparePrice: 15900,
      categoryId: kitchenware.id,
      stock: 24,
      sku: "ZM-KW-001",
      images: ["/placeholder-products/cookware-1.jpg", "/placeholder-products/cookware-2.jpg"],
      material: "Stainless Steel",
      color: "Silver",
      isFeatured: true,
    },
    {
      nameAr: "سكاكين مطبخ ياباني الصنع (طقم 3 قطع)",
      nameFr: "Couteaux de cuisine japonais (set de 3)",
      slug: "japanese-knife-set-3pc",
      descriptionAr: "سكاكين حادة للغاية بمقبض خشبي أنيق، مثالية لتقطيع الخضار واللحوم بدقة.",
      descriptionFr: "Couteaux extrêmement tranchants avec manche en bois élégant, parfaits pour une découpe précise.",
      price: 8900,
      categoryId: kitchenware.id,
      stock: 3,
      sku: "ZM-KW-002",
      images: ["/placeholder-products/knives-1.jpg"],
      material: "Carbon Steel",
      isFeatured: false,
    },
    {
      nameAr: "مزهرية سيراميك مزخرفة",
      nameFr: "Vase en céramique décoratif",
      slug: "decorative-ceramic-vase",
      descriptionAr: "مزهرية سيراميك بتصميم عصري، تضيف لمسة أنيقة إلى أي غرفة.",
      descriptionFr: "Vase en céramique au design moderne, ajoute une touche élégante à toute pièce.",
      price: 3200,
      categoryId: decor.id,
      stock: 40,
      sku: "ZM-DC-001",
      images: ["/placeholder-products/vase-1.jpg"],
      material: "Ceramic",
      color: "Beige",
      isFeatured: true,
    },
    {
      nameAr: "شمعدان ذهبي أنيق",
      nameFr: "Chandelier doré élégant",
      slug: "elegant-gold-candle-holder",
      descriptionAr: "شمعدان معدني بطلاء ذهبي، يضيف لمسة من الفخامة لطاولتك.",
      descriptionFr: "Chandelier métallique à finition dorée, apporte une touche de luxe à votre table.",
      price: 2400,
      categoryId: decor.id,
      stock: 18,
      sku: "ZM-DC-002",
      images: ["/placeholder-products/candle-1.jpg"],
      material: "Metal",
      color: "Gold",
      isFeatured: false,
    },
    {
      nameAr: "طقم أكواب قهوة تركية (6 قطع)",
      nameFr: "Set de tasses à café turc (6 pièces)",
      slug: "turkish-coffee-cup-set",
      descriptionAr: "أكواب قهوة أنيقة مع صحون مذهبة، مثالية للضيوف والمناسبات الخاصة.",
      descriptionFr: "Tasses à café élégantes avec soucoupes dorées, parfaites pour recevoir vos invités.",
      price: 4500,
      comparePrice: 5500,
      categoryId: cups.id,
      stock: 60,
      sku: "ZM-CG-001",
      images: ["/placeholder-products/coffeecups-1.jpg"],
      material: "Porcelain",
      isFeatured: true,
    },
    {
      nameAr: "أكواب زجاجية مزخرفة (طقم 4)",
      nameFr: "Verres décoratifs (set de 4)",
      slug: "decorative-glass-cups-4pc",
      descriptionAr: "أكواب زجاجية بتصميم مميز مناسبة للعصائر والمشروبات الباردة.",
      descriptionFr: "Verres au design unique, parfaits pour les jus et boissons fraîches.",
      price: 2900,
      categoryId: cups.id,
      stock: 4,
      sku: "ZM-CG-002",
      images: ["/placeholder-products/glasscups-1.jpg"],
      material: "Glass",
      isFeatured: false,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }

  // --- Admin user ---
  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { phone: "+213558700448" },
    update: {},
    create: {
      name: "ZAID Minage Admin",
      phone: "+213558700448",
      email: "admin@zaidminage.dz",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed complete. Admin login: +213558700448 / ChangeMe123! (change immediately)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
