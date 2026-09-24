// All 58 Algerian wilayas (provinces) with bilingual names and shipping tiers.
// tier: "local" (El Oued, home base) | "near" | "far" — used to seed ShippingRate.

export type Wilaya = {
  code: string; // official 2-digit code
  nameAr: string;
  nameFr: string;
  tier: "local" | "near" | "far";
};

export const WILAYAS: Wilaya[] = [
  { code: "01", nameAr: "أدرار", nameFr: "Adrar", tier: "far" },
  { code: "02", nameAr: "الشلف", nameFr: "Chlef", tier: "far" },
  { code: "03", nameAr: "الأغواط", nameFr: "Laghouat", tier: "far" },
  { code: "04", nameAr: "أم البواقي", nameFr: "Oum El Bouaghi", tier: "near" },
  { code: "05", nameAr: "باتنة", nameFr: "Batna", tier: "near" },
  { code: "06", nameAr: "بجاية", nameFr: "Béjaïa", tier: "far" },
  { code: "07", nameAr: "بسكرة", nameFr: "Biskra", tier: "near" },
  { code: "08", nameAr: "بشار", nameFr: "Béchar", tier: "far" },
  { code: "09", nameAr: "البليدة", nameFr: "Blida", tier: "far" },
  { code: "10", nameAr: "البويرة", nameFr: "Bouira", tier: "far" },
  { code: "11", nameAr: "تمنراست", nameFr: "Tamanrasset", tier: "far" },
  { code: "12", nameAr: "تبسة", nameFr: "Tébessa", tier: "near" },
  { code: "13", nameAr: "تلمسان", nameFr: "Tlemcen", tier: "far" },
  { code: "14", nameAr: "تيارت", nameFr: "Tiaret", tier: "far" },
  { code: "15", nameAr: "تيزي وزو", nameFr: "Tizi Ouzou", tier: "far" },
  { code: "16", nameAr: "الجزائر", nameFr: "Alger", tier: "far" },
  { code: "17", nameAr: "الجلفة", nameFr: "Djelfa", tier: "far" },
  { code: "18", nameAr: "جيجل", nameFr: "Jijel", tier: "far" },
  { code: "19", nameAr: "سطيف", nameFr: "Sétif", tier: "far" },
  { code: "20", nameAr: "سعيدة", nameFr: "Saïda", tier: "far" },
  { code: "21", nameAr: "سكيكدة", nameFr: "Skikda", tier: "near" },
  { code: "22", nameAr: "سيدي بلعباس", nameFr: "Sidi Bel Abbès", tier: "far" },
  { code: "23", nameAr: "عنابة", nameFr: "Annaba", tier: "near" },
  { code: "24", nameAr: "قالمة", nameFr: "Guelma", tier: "near" },
  { code: "25", nameAr: "قسنطينة", nameFr: "Constantine", tier: "near" },
  { code: "26", nameAr: "المدية", nameFr: "Médéa", tier: "far" },
  { code: "27", nameAr: "مستغانم", nameFr: "Mostaganem", tier: "far" },
  { code: "28", nameAr: "المسيلة", nameFr: "M'Sila", tier: "far" },
  { code: "29", nameAr: "معسكر", nameFr: "Mascara", tier: "far" },
  { code: "30", nameAr: "ورقلة", nameFr: "Ouargla", tier: "near" },
  { code: "31", nameAr: "وهران", nameFr: "Oran", tier: "far" },
  { code: "32", nameAr: "البيض", nameFr: "El Bayadh", tier: "far" },
  { code: "33", nameAr: "إليزي", nameFr: "Illizi", tier: "far" },
  { code: "34", nameAr: "برج بوعريريج", nameFr: "Bordj Bou Arréridj", tier: "far" },
  { code: "35", nameAr: "بومرداس", nameFr: "Boumerdès", tier: "far" },
  { code: "36", nameAr: "الطارف", nameFr: "El Tarf", tier: "near" },
  { code: "37", nameAr: "تندوف", nameFr: "Tindouf", tier: "far" },
  { code: "38", nameAr: "تيسمسيلت", nameFr: "Tissemsilt", tier: "far" },
  { code: "39", nameAr: "الوادي", nameFr: "El Oued", tier: "local" },
  { code: "40", nameAr: "خنشلة", nameFr: "Khenchela", tier: "near" },
  { code: "41", nameAr: "سوق أهراس", nameFr: "Souk Ahras", tier: "near" },
  { code: "42", nameAr: "تيبازة", nameFr: "Tipaza", tier: "far" },
  { code: "43", nameAr: "ميلة", nameFr: "Mila", tier: "near" },
  { code: "44", nameAr: "عين الدفلى", nameFr: "Aïn Defla", tier: "far" },
  { code: "45", nameAr: "النعامة", nameFr: "Naâma", tier: "far" },
  { code: "46", nameAr: "عين تموشنت", nameFr: "Aïn Témouchent", tier: "far" },
  { code: "47", nameAr: "غرداية", nameFr: "Ghardaïa", tier: "near" },
  { code: "48", nameAr: "غليزان", nameFr: "Relizane", tier: "far" },
  { code: "49", nameAr: "المغير", nameFr: "El M'Ghair", tier: "local" },
  { code: "50", nameAr: "المنيعة", nameFr: "El Meniaa", tier: "near" },
  { code: "51", nameAr: "أولاد جلال", nameFr: "Ouled Djellal", tier: "near" },
  { code: "52", nameAr: "برج باجي مختار", nameFr: "Bordj Badji Mokhtar", tier: "far" },
  { code: "53", nameAr: "بني عباس", nameFr: "Béni Abbès", tier: "far" },
  { code: "54", nameAr: "تيميمون", nameFr: "Timimoun", tier: "far" },
  { code: "55", nameAr: "تقرت", nameFr: "Touggourt", tier: "local" },
  { code: "56", nameAr: "جانت", nameFr: "Djanet", tier: "far" },
  { code: "57", nameAr: "المغير سيدي خالد", nameFr: "In Salah", tier: "far" },
  { code: "58", nameAr: "إن قزام", nameFr: "In Guezzam", tier: "far" },
];

// Shipping fee matrix (DZD), per business rules:
// local (El Oued & neighboring, home base Guemar): 400
// near provinces: 600
// far provinces: 800-1000 (using 900 as the flat "far" home rate; stop-desk is cheaper)
export const SHIPPING_MATRIX = {
  local: { home: 400, stopDesk: 300 },
  near: { home: 600, stopDesk: 450 },
  far: { home: 900, stopDesk: 700 },
};

export const FREE_SHIPPING_THRESHOLD = 10000; // DZD

export function getShippingFee(
  wilayaCode: string,
  deliveryMethod: "HOME" | "STOP_DESK",
  subtotal: number
): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  const w = WILAYAS.find((w) => w.code === wilayaCode);
  const tier = w?.tier ?? "far";
  const rates = SHIPPING_MATRIX[tier];
  return deliveryMethod === "HOME" ? rates.home : rates.stopDesk;
}
