"use client";

const WHATSAPP_NUMBER = "213558700448"; // no leading + or 0, per wa.me format

export function WhatsAppButton({ message }: { message?: string }) {
  const text = encodeURIComponent(message ?? "مرحباً، أرغب في الاستفسار عن منتج من ZAID Minage");
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-5 end-5 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-premium flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.87.5 3.63 1.44 5.16L2 22l5.09-1.53a9.87 9.87 0 0 0 4.95 1.33c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm0 17.85c-1.65 0-3.2-.48-4.5-1.32l-.32-.2-3.15.95.94-3.06-.21-.32a7.9 7.9 0 0 1-1.24-4.27c0-4.37 3.55-7.92 7.92-7.92s7.92 3.55 7.92 7.92-3.55 7.92-7.92 7.92zm4.34-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.17-.7-.62-1.17-1.39-1.31-1.63-.14-.24-.02-.37.1-.49.12-.12.28-.32.42-.48.14-.16.18-.28.28-.46.1-.18.04-.34-.04-.46-.08-.12-.5-1.2-.68-1.64-.18-.44-.36-.38-.5-.38-.12-.02-.28-.02-.42-.02-.14 0-.38.06-.58.28-.2.22-.78.76-.78 1.86 0 1.1.8 2.16.92 2.32.12.16 1.58 2.42 3.84 3.3 2.26.88 2.26.58 2.66.54.4-.04 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
      </svg>
    </a>
  );
}
