"use client";

import { useState } from "react";
import { sendMessage } from "@/lib/messages";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.subject || !form.message) {
      setError("Preencha todos os campos.");
      return;
    }
    setError("");
    setSubmitting(true);
    const result = await sendMessage(form.name, form.phone, form.subject, form.message);
    if (result.success) {
      setSubmitted(true);
    } else {
      setError("Erro ao enviar. Tente novamente.");
    }
    setSubmitting(false);
  };

  return (
    <main className="pt-[140px] pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Info */}
          <div className="space-y-8">
            <div>
              <h1 className="font-[family-name:var(--font-headline)] text-4xl md:text-5xl text-primary mb-4">
                Contacto
              </h1>
              <p className="text-on-surface-variant text-base leading-relaxed">
                A Wepink Angola é uma loja <span className="text-primary font-medium">100% online</span>. Não possuímos loja física. Todas as compras são feitas pelo nosso site com entrega ao domicílio em Luanda.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-on-surface text-sm">Instagram</p>
                  <a href="https://www.instagram.com/wepink.ang" target="_blank" rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline underline-offset-4">@wepink.ang</a>
                  <p className="text-xs text-secondary mt-1">O nosso principal canal de comunicação</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">schedule</span>
                </div>
                <div>
                  <p className="font-medium text-on-surface text-sm">Horário de Atendimento</p>
                  <p className="text-secondary text-sm">Segunda a Sábado, 9h — 18h</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div>
                  <p className="font-medium text-on-surface text-sm">Área de Entrega</p>
                  <p className="text-secondary text-sm">Toda a província de Luanda</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div>
            {submitted ? (
              <div className="bg-surface-container-lowest p-10 rounded-2xl text-center space-y-4 animate-scale-in">
                <span className="material-symbols-outlined text-5xl text-primary">mark_email_read</span>
                <h3 className="font-[family-name:var(--font-headline)] text-2xl text-on-surface">
                  Mensagem enviada
                </h3>
                <p className="text-secondary text-sm">
                  Obrigado, {form.name.split(" ")[0]}. Responderemos o mais breve possível.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 rounded-2xl space-y-5">
                <h3 className="font-[family-name:var(--font-headline)] text-xl text-on-surface mb-2">
                  Envie-nos uma mensagem
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                      placeholder=" " id="contact-name"
                      className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent" />
                    <label htmlFor="contact-name"
                      className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                      Nome *
                    </label>
                  </div>
                  <div className="relative">
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)}
                      placeholder=" " id="contact-phone"
                      className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent" />
                    <label htmlFor="contact-phone"
                      className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                      Telefone *
                    </label>
                  </div>
                </div>
                <div className="relative">
                  <input type="text" value={form.subject} onChange={(e) => update("subject", e.target.value)}
                    placeholder=" " id="contact-subject"
                    className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent" />
                  <label htmlFor="contact-subject"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Assunto *
                  </label>
                </div>
                <div className="relative">
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)}
                    placeholder=" " id="contact-message" rows={4}
                    className="peer w-full bg-surface-container-low rounded-xl px-4 pt-6 pb-2 text-sm text-on-surface border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(254,75,142,0.15)] focus:ring-0 transition-all placeholder-transparent resize-none" />
                  <label htmlFor="contact-message"
                    className="absolute left-4 top-2 text-[10px] font-[family-name:var(--font-label)] uppercase tracking-widest text-secondary transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-xs peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:top-2 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary">
                    Mensagem *
                  </label>
                </div>
                {error && <p className="text-error text-xs">{error}</p>}
                <button type="submit" disabled={submitting}
                  className="w-full btn-shine bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? (
                    <><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span> A enviar...</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">send</span> Enviar Mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
