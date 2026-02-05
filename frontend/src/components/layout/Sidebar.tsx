import "@/styles/layout.css";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        WenLock<span className="dot">.</span>
      </div>

      <nav className="nav" aria-label="Menu">
        <div className="navItem navItemActive">🏠 Home</div>

        <div className="navItem">▾ Controle de Acesso</div>
        <div className="navItem" style={{ paddingLeft: 28 }}>👤 Usuários</div>
      </nav>

      <div className="sidebarFooter">© WenLock</div>
    </aside>
  );
}
