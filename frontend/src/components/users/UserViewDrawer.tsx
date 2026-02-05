"use client";

import type { UserDTO } from "@/lib/api";
import "@/styles/user-drawer.css";

function formatDateBR(iso: string) {
  if (!iso) return "Nenhuma";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Nenhuma";
  return d.toLocaleDateString("pt-BR");
}

export function UserViewDrawer({
  open,
  user,
  onClose,
}: {
  open: boolean;
  user: UserDTO | null;
  onClose: () => void;
}) {
  if (!open || !user) return null;

  // Se o backend não tiver "updatedAt" diferente do created, mostramos "Nenhuma"
  const updatedLabel =
    user.updatedAt && user.updatedAt !== user.createdAt
      ? formatDateBR(user.updatedAt)
      : "Nenhuma";

  return (
    <div className="drawerOverlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawerTop">
          <h2 className="drawerTitle">Visualizar Usuário</h2>
          <button className="drawerClose" onClick={onClose} aria-label="Fechar">
            ✕
          </button>
        </div>

        <div className="drawerSection">
          <div className="drawerSectionTitle">Dados do Usuário</div>
          <div className="drawerHr" />

          <div className="drawerGrid2">
            <div>
              <div className="drawerLabel">Nome</div>
              <div className="drawerValue">{user.name}</div>
            </div>
            <div>
              <div className="drawerLabel">Matrícula</div>
              <div className="drawerValue">{user.registration}</div>
            </div>
          </div>

          <div className="drawerGrid1">
            <div>
              <div className="drawerLabel">E-mail</div>
              <div className="drawerValue">{user.email}</div>
            </div>
          </div>
        </div>

        <div className="drawerSection">
          <div className="drawerSectionTitle">Detalhes</div>
          <div className="drawerHr" />

          <div className="drawerGrid2">
            <div>
              <div className="drawerLabel">Data de criação</div>
              <div className="drawerValue">{formatDateBR(user.createdAt)}</div>
            </div>
            <div>
              <div className="drawerLabel">Última edição</div>
              <div className="drawerValue">{updatedLabel}</div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
