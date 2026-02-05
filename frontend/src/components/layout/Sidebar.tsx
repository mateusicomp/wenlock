"use client";

import Link from "next/link";
import "@/styles/layout.css";

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebarCollapsed" : ""}`}>
      <div className="sidebarTop">
        <div className="brandRow">
          <div className="brand">
            WenLock<span className="dot">.</span>
          </div>

          <button
            type="button"
            className="collapseBtn"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
            title={collapsed ? "Expandir" : "Recolher"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>
      </div>

      <nav className="nav" aria-label="Menu">
        <Link className="navItem navItemActive" href="/">
          <span className="navIcon">🏠</span>
          <span className="navLabel">Home</span>
        </Link>

        <div className="navGroup">
          <button className="navItem navItemGroup" type="button">
            <span className="navIcon">▾</span>
            <span className="navLabel">Controle de Acesso</span>
          </button>

          <Link className="navItem navItemSub" href="/users">
            <span className="navIcon">👤</span>
            <span className="navLabel">Usuários</span>
          </Link>
        </div>
      </nav>

      <div className="sidebarFooter">
        <div>© WenLock</div>
        <div className="powered">Powered by Conecthus</div>
      </div>
    </aside>
  );
}
