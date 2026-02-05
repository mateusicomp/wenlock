"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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

  // server paging state (source of truth)
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);

  // data state
  const [data, setData] = useState<UsersListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // regra do XD: quando foca em pesquisar, já mostra a lista (mesmo sem digitar)
  const showTable = focused || query.trim().length > 0;

  // debounce para não bater no backend a cada tecla
  const debouncedQuery = useDebouncedValue(query, 300);

  // controle de abort pra evitar corrida
  const abortRef = useRef<AbortController | null>(null);

  // Quando muda perPage ou query, reseta pra página 1
  useEffect(() => {
    setPage(1);
  }, [perPage, debouncedQuery]);

  // Fetch: só busca quando showTable for true (foco ou texto)
  useEffect(() => {
    if (!showTable) {
      setData(null);
      setErrorMsg(null);
      setLoading(false);
      return;
    }

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
        // abort não é erro real
        if (String(err?.name) === "AbortError") return;
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
            onFocus={() => setFocused(true)}
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
                      <button className="iconBtn" type="button" title="Ver">
                        👁
                      </button>
                      <button className="iconBtn" type="button" title="Editar">
                        ✏
                      </button>
                      <button className="iconBtn" type="button" title="Excluir">
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
    </AppShell>
  );
}
