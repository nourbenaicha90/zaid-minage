"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthForms({ locale }: { locale: string }) {
  const isAr = locale === "ar";
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "register") {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error ?? "Registration failed");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      phone: form.phone,
      password: form.password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      toast.error(isAr ? "بيانات الدخول غير صحيحة" : "Identifiants incorrects");
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <div className="flex mb-6 border-b border-sand">
        <button
          onClick={() => setMode("login")}
          className={`flex-1 py-2 text-sm font-medium ${mode === "login" ? "border-b-2 border-terracotta text-terracotta" : "text-charcoal/50"}`}
        >
          {isAr ? "تسجيل الدخول" : "Connexion"}
        </button>
        <button
          onClick={() => setMode("register")}
          className={`flex-1 py-2 text-sm font-medium ${mode === "register" ? "border-b-2 border-terracotta text-terracotta" : "text-charcoal/50"}`}
        >
          {isAr ? "إنشاء حساب" : "Créer un compte"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <input
            required
            placeholder={isAr ? "الاسم الكامل" : "Nom complet"}
            className="w-full border border-sand rounded px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}
        <input
          required
          placeholder={isAr ? "رقم الهاتف" : "Téléphone"}
          className="w-full border border-sand rounded px-3 py-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          required
          type="password"
          placeholder={isAr ? "كلمة المرور" : "Mot de passe"}
          className="w-full border border-sand rounded px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-terracotta text-white rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "..." : mode === "login" ? (isAr ? "دخول" : "Se connecter") : (isAr ? "إنشاء الحساب" : "S'inscrire")}
        </button>
      </form>

      <button
        onClick={() => signIn("facebook")}
        className="w-full mt-3 py-3 border border-sand rounded-full font-medium"
      >
        {isAr ? "الدخول عبر فيسبوك" : "Continuer avec Facebook"}
      </button>
    </div>
  );
}
