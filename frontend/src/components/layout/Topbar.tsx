"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/layout.css";

export function Topbar() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <header className="topbar">
      <div className="topbarRight" ref={ref}>
        <button
          type="button"
          className="avatarBtn"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <span className="avatar">MS</span>
        </button>

        {open && (
          <div className="userMenu" role="menu">
            <div className="userMenuHeader">
              <div className="userMenuAvatar">MS</div>
              <div className="userMenuInfo">
                <div className="userMenuName">Milena Santana Borges</div>
                <div className="userMenuEmail">milena.santana@energy.org.br</div>
              </div>
            </div>

            <button className="userMenuItem" type="button">
              ↩ Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
