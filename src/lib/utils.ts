import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an integer DZD amount with thousands separators, locale-aware digits (Western numerals per spec). */
export function formatDZD(amount: number, locale: "ar" | "fr" = "ar") {
  const formatted = new Intl.NumberFormat("en-US").format(amount); // en-US forces Western digits
  return locale === "ar" ? `${formatted} د.ج` : `${formatted} DZD`;
}

/** Validate Algerian phone numbers: 0X XX XX XX XX or +213 X XX XX XX XX */
export function isValidAlgerianPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s|-/g, "");
  return /^(?:\+213|0)(5|6|7)[0-9]{8}$/.test(cleaned);
}

/** Generate a human order number like ZM-2026-0001 */
export function generateOrderNumber(sequence: number) {
  const year = new Date().getFullYear();
  return `ZM-${year}-${String(sequence).padStart(4, "0")}`;
}
