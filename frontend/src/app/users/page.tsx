"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Toast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { UserViewDrawer } from "@/components/users/UserViewDrawer";
import { UserFormModal } from "@/components/users/UserFormModal";
import { deleteUser, fetchUserById, type UserDTO } from "@/lib/api";
import { AppShell } from "@/components/layout/AppShell";
import { fetchUsers, type UsersListResponse } from "@/lib/api";
import "@/styles/users.css";

function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}

export default function UsersPage() {
  // UI state
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  // ✅ novo: depois do primeiro foco, mantém a tabela aberta
  const [opened, setOpened] = useState(false);

  // server paging state (source of truth)
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // data state
  const [data, setData] = useState<UsersListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "warning">("success");
  const [toastMsg, setToastMsg] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewUser, setViewUser] = useState<UserDTO | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserDTO | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserDTO | null>(null);

  // ✅ regra final:
  // - abre ao focar na pesquisa
  // - continua aberta depois (opened), mesmo clicando em ações/fora
  const showTable = opened || query.trim().length > 0;

  // debounce para não bater no backend a cada tecla
  const debouncedQuery = useDebouncedValue(query, 300);

  // controle de abort pra evitar corrida
  const abortRef = useRef<AbortController | null>(null);

  // Quando muda perPage ou query, reseta pra página 1
  useEffect(() => {
    setPage(1);
  }, [perPage, debouncedQuery]);

  // Fetch: só busca quando showTable for true
  useEffect(() => {
    if (!showTable) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setErrorMsg(null);

    fetchUsers({
      search: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      page,
      limit: perPage,
      signal: controller.signal,
    })
      .then((res) => setData(res))
      .catch((err) => {
        if (String(err?.name) === "AbortError") return; // abort não é erro real
        setErrorMsg(err?.message ?? "Erro ao buscar usuários.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [showTable, debouncedQuery, page, perPage]);

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const safePage = useMemo(() => Math.min(page, totalPages), [page, totalPages]);

  function goTo(p: number) {
    const next = Math.max(1, Math.min(totalPages, p));
    setPage(next);
  }

  function showToast(type: "success" | "warning", msg: string) {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  }

  async function reloadUsers() {
    const controller = new AbortController();
    const res = await fetchUsers({
      search: debouncedQuery.trim() ? debouncedQuery.trim() : undefined,
      page,
      limit: perPage,
      signal: controller.signal,
    });
    setData(res);
  }

  async function handleView(u: any) {
    try {
      const full = await fetchUserById(u.id);
      setViewUser(full);
      setViewOpen(true);
    } catch (e: any) {
      alert(e?.message ?? "Erro ao carregar usuário.");
    }
  }

  async function handleEdit(u: any) {
    try {
      const full = await fetchUserById(u.id);
      setEditUser(full);
      setEditOpen(true);
    } catch (e: any) {
      alert(e?.message ?? "Erro ao carregar usuário.");
    }
  }

  function handleDeleteClick(u: any) {
    setDeleteTarget(u);
    setConfirmDeleteOpen(true);
  }

  async function confirmDeleteYes() {
    try {
      if (!deleteTarget) return;
      await deleteUser(deleteTarget.id);

      showToast("success", "Usuário excluído com sucesso!");
      setConfirmDeleteOpen(false);
      setDeleteTarget(null);

      await reloadUsers();
    } catch (e: any) {
      alert(e?.message ?? "Erro ao excluir usuário.");
    }
  }

  function confirmDeleteNo() {
    setConfirmDeleteOpen(false);
    setDeleteTarget(null);
    showToast("warning", "Exclusão cancelada");
  }

  return (
    <AppShell>
      <div className="usersHeaderRow">
        <h1 className="usersTitle">Usuários</h1>

        <Link className="usersAddBtn" href="/users/new">
          <span className="plus">＋</span> Cadastrar Usuário
        </Link>
      </div>

      <div className="usersToolbar">
        <div className="searchBox">
          <span className="searchIcon">🔍</span>
          <input
            className="searchInput"
            placeholder="Pesquisa"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setFocused(true);
              setOpened(true); // ✅ mantém tabela aberta após o primeiro foco
            }}
            onBlur={() => setFocused(false)}
          />
        </div>
      </div>

      <section className="usersCard">
        {!showTable ? (
          <div className="emptyState">
            <div className="emptyTitle">Nenhum Usuário Registrado</div>
            <div className="emptyDesc">
              Clique em “Cadastrar Usuário” para começar a cadastrar.
            </div>
          </div>
        ) : (
          <>
            <div className="tableHead">
              <div className="thName">Nome</div>
              <div className="thActions">Ações</div>
            </div>

            <div className="tableBody">
              {loading && <div className="statusMsg">Carregando...</div>}

              {!loading && errorMsg && (
                <div className="statusMsg errorMsg">{errorMsg}</div>
              )}

              {!loading && !errorMsg && (data?.data?.length ?? 0) === 0 && (
                <div className="noResults">Nenhum resultado encontrado.</div>
              )}

              {!loading &&
                !errorMsg &&
                (data?.data ?? []).map((u) => (
                  <div key={u.id} className="row">
                    <div className="cellName">{u.name}</div>

                    <div className="cellActions">
                      <button
                        className="iconBtn"
                        type="button"
                        title="Ver"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleView(u);
                        }}
                      >
                        👁
                      </button>

                      <button
                        className="iconBtn"
                        type="button"
                        title="Editar"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEdit(u);
                        }}
                      >
                        ✏
                      </button>

                      <button
                        className="iconBtn"
                        type="button"
                        title="Excluir"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteClick(u);
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            <div className="tableFooter">
              <div className="footerLeft">Total de itens: {total}</div>

              <div className="footerRight">
                <div className="perPage">
                  Itens por página&nbsp;
                  <select
                    className="perPageSelect"
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                </div>

                <div className="pager">
                  <button
                    className="pagerBtn"
                    onClick={() => goTo(1)}
                    type="button"
                    disabled={safePage <= 1}
                  >
                    {"|<"}
                  </button>
                  <button
                    className="pagerBtn"
                    onClick={() => goTo(safePage - 1)}
                    type="button"
                    disabled={safePage <= 1}
                  >
                    {"<"}
                  </button>

                  <div className="pageChip">{safePage}</div>
                  <div className="pageOf">de {totalPages}</div>

                  <button
                    className="pagerBtn"
                    onClick={() => goTo(safePage + 1)}
                    type="button"
                    disabled={safePage >= totalPages}
                  >
                    {">"}
                  </button>
                  <button
                    className="pagerBtn"
                    onClick={() => goTo(totalPages)}
                    type="button"
                    disabled={safePage >= totalPages}
                  >
                    {">|"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <UserViewDrawer
        open={viewOpen}
        user={viewUser}
        onClose={() => {
          setViewOpen(false);
          setViewUser(null);
        }}
      />

      <UserFormModal
        open={editOpen}
        mode="edit"
        initialUser={editUser}
        onClose={() => {
          setEditOpen(false);
          setEditUser(null);
        }}
        onCancelConfirmed={() => showToast("warning", "Edição cancelada")}
        onSuccess={async () => {
          showToast("success", "Edição realizada!");
          await reloadUsers();
        }}
      />

      <ConfirmModal
        open={confirmDeleteOpen}
        title="Deseja excluir?"
        description="O usuário será excluído."
        onCancel={confirmDeleteNo}
        onConfirm={confirmDeleteYes}
      />

      <Toast
        open={toastOpen}
        type={toastType}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />
    </AppShell>
  );
}
