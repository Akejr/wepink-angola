"use client";

import { useEffect, useState } from "react";
import { getMessages, markMessageRead, deleteMessage, ContactMessage } from "@/lib/messages";

export default function AdminMensagensPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getMessages().then((data) => { setMessages(data); setLoading(false); });
  }, []);

  const handleRead = async (id: string) => {
    await markMessageRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar esta mensagem?")) return;
    const result = await deleteMessage(id);
    if (result.success) setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-[family-name:var(--font-headline)] text-on-surface mb-1">Mensagens</h1>
        <p className="text-secondary text-sm">{unread > 0 ? `${unread} não lida${unread !== 1 ? "s" : ""}` : "Todas lidas"}</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (<div key={i} className="h-16 bg-surface-container-low rounded-lg animate-pulse" />))}
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">mail</span>
            <p className="text-secondary">Nenhuma mensagem recebida.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-container-high/30">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              return (
                <div key={msg.id}>
                  <button
                    onClick={() => { setExpandedId(isExpanded ? null : msg.id); if (!msg.read) handleRead(msg.id); }}
                    className="w-full px-6 py-5 flex items-center gap-4 hover:bg-surface-container-low/50 transition-colors text-left"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${msg.read ? "bg-transparent" : "bg-primary"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm truncate ${msg.read ? "text-on-surface" : "text-on-surface font-bold"}`}>{msg.name}</p>
                        <span className="text-xs text-secondary">· {msg.phone}</span>
                      </div>
                      <p className="text-xs text-secondary truncate">{msg.subject}</p>
                    </div>
                    <span className="text-xs text-secondary flex-shrink-0">
                      {new Date(msg.created_at).toLocaleDateString("pt-AO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span className={`material-symbols-outlined text-secondary transition-transform ${isExpanded ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4 animate-fade-up">
                      <div className="p-5 bg-surface-container-low rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Nome</p>
                            <p className="text-sm text-on-surface">{msg.name}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Telefone</p>
                            <p className="text-sm text-on-surface">{msg.phone}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Assunto</p>
                          <p className="text-sm text-on-surface font-medium">{msg.subject}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">Mensagem</p>
                          <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => handleDelete(msg.id)}
                          className="px-4 py-2 rounded-lg text-error text-sm font-medium hover:bg-error/10 transition-all flex items-center gap-1">
                          <span className="material-symbols-outlined text-lg">delete</span> Apagar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
