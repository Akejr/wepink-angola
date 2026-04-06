"use client";

import { useState, useEffect } from "react";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY <= 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-[60] text-center py-2 px-4 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ backgroundColor: "#FE4B8E" }}
    >
      <p className="text-white text-[11px] font-bold tracking-widest uppercase font-[family-name:var(--font-label)]">
        Bem-vindo à Wepink Angola · Garanta agora o seu produto antes que esgote
      </p>
    </div>
  );
}
