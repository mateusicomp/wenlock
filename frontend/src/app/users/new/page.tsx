"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toast } from "@/components/ui/Toast";
import { createUser } from "@/lib/api";
import "@/styles/user-form.css";

function onlyLettersSpaces(value: string) {
  return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
}
function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

// Regras:
// 1) Nome - apenas letras (permitindo espaços) e máx 30
// 2) Email válido e máx 40
// 3) Matrícula - apenas números, min 4, max 10
// 4) Senha - alfanumérico, tamanho 6
// 5) Repetir senha igual
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^[A-Za-z0-9]{6}$/;

export default function NewUserPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registration, setRegistration] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const [confirmCancel, setConfirmCancel] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "warning">("success");
  const [toastMsg, setToastMsg] = useState("");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    const n = name.trim();
    if (!n) e.name = "Nome é obrigatório.";
    else if (n.length > 30) e.name = "Máx. 30 caracteres.";
    else if (onlyLettersSpaces(n) !== n) e.name = "Apenas letras.";

    const em = email.trim();
    if (!em) e.email = "E-mail é obrigatório.";
    else if (em.length > 40) e.email = "Máx. 40 caracteres.";
    else if (!emailRegex.test(em)) e.email = "E-mail inválido.";

    const reg = registration.trim();
    if (!reg) e.registration = "Matrícula é obrigatória.";
    else if (!/^\d+$/.test(reg)) e.registration = "Apenas números.";
    else if (reg.length < 4) e.registration = "Min. 4 caracteres.";
    else if (reg.length > 10) e.registration = "Máx. 10 caracteres.";

    if (!password) e.password = "Senha é obrigatória.";
    else if (!passwordRegex.test(password))
      e.password = "Senha deve ter 6 caracteres alfanuméricos.";

    if (!password2) e.password2 = "Repita a senha.";
    else if (password2 !== password) e.password2 = "Senhas não conferem.";

    return e;
  }, [name, email, registration, password, password2]);

  const isValid = Object.keys(errors).length === 0;

  function markTouched(key: string) {
    setTouched((t) => ({ ...t, [key]: true }));
  }

  function showToast(type: "success" | "warning", msg: string) {
    setToastType(type);
    setToastMsg(msg);
    setToastOpen(true);
  }

  async function handleSubmit() {
    setTouched({
      name: true,
      email: true,
      registration: true,
      password: true,
      password2: true,
    });
    if (!isValid) return;

    try {
      setLoading(true);
      await createUser({
        name: name.trim(),
        email: email.trim(),
        registration: registration.trim(),
        password,
      });

      showToast("success", "Cadastro Realizado!");
      // volta pra lista após um pequeno delay para o user ver o toast
      setTimeout(() => router.push("/users"), 600);
    } catch (err: any) {
      // mensagem simples (depois a gente melhora pra mapear 409 etc.)
      alert(err?.message ?? "Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  }

  function handleCancelClick() {
    // se tiver algo preenchido, confirmar
    const dirty =
      name.trim() || email.trim() || registration.trim() || password || password2;

    if (dirty) setConfirmCancel(true);
    else {
      showToast("warning", "Cadastro cancelado");
      setTimeout(() => router.push("/users"), 400);
    }
  }

  function confirmCancelYes() {
    setConfirmCancel(false);
    showToast("warning", "Cadastro cancelado");
    setTimeout(() => router.push("/users"), 400);
  }

  return (
    <AppShell>
      <div className="breadcrumb">Usuários &nbsp;&gt;&nbsp; Cadastro de Usuário</div>

      <div className="formTitleRow">
        <button className="backBtn" type="button" onClick={() => router.back()}>
          ‹
        </button>
        <h1 className="formTitle">Cadastro de Usuário</h1>
      </div>

      <section className="formCard">
        <div className="sectionTitle">Dados do Usuário</div>

        <div className="grid2">
          {/* Nome */}
          <div className={`field ${touched.name && errors.name ? "fieldError" : ""}`}>
            <div className="label">Nome Completo</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="Insira o nome completo*"
                value={name}
                onChange={(e) => setName(onlyLettersSpaces(e.target.value).slice(0, 30))}
                onBlur={() => markTouched("name")}
              />
            </div>
            <div className="helper">• Máx. 30 caracteres</div>
            {touched.name && errors.name && <div className="errorText">{errors.name}</div>}
          </div>

          {/* Matrícula */}
          <div
            className={`field ${
              touched.registration && errors.registration ? "fieldError" : ""
            }`}
          >
            <div className="label">Matrícula</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="Insira o Nº da matrícula"
                value={registration}
                onChange={(e) =>
                  setRegistration(onlyDigits(e.target.value).slice(0, 10))
                }
                onBlur={() => markTouched("registration")}
              />
            </div>
            <div className="helper">• Min. 4 | Máx. 10 caracteres</div>
            {touched.registration && errors.registration && (
              <div className="errorText">{errors.registration}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="grid1">
          <div className={`field ${touched.email && errors.email ? "fieldError" : ""}`}>
            <div className="label">E-mail</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="Insira o E-mail*"
                value={email}
                onChange={(e) => setEmail(e.target.value.slice(0, 40))}
                onBlur={() => markTouched("email")}
              />
            </div>
            <div className="helper">• Máx. 40 caracteres</div>
            {touched.email && errors.email && <div className="errorText">{errors.email}</div>}
          </div>
        </div>

        <div className="hr" />

        <div className="sectionTitle">Dados de acesso</div>

        <div className="grid2">
          {/* Senha */}
          <div
            className={`field ${touched.password && errors.password ? "fieldError" : ""}`}
          >
            <div className="label">Senha</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="Senha"
                value={password}
                type={showPass1 ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))}
                onBlur={() => markTouched("password")}
              />
              <button
                className="eyeBtn"
                type="button"
                onClick={() => setShowPass1((v) => !v)}
                aria-label="Mostrar/ocultar senha"
              >
                👁
              </button>
            </div>
            {touched.password && errors.password && (
              <div className="errorText">{errors.password}</div>
            )}
          </div>

          {/* Repetir Senha */}
          <div
            className={`field ${
              touched.password2 && errors.password2 ? "fieldError" : ""
            }`}
          >
            <div className="label">Repetir Senha</div>
            <div className="inputRow">
              <input
                className="input"
                placeholder="Repetir Senha"
                value={password2}
                type={showPass2 ? "text" : "password"}
                onChange={(e) =>
                  setPassword2(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 6))
                }
                onBlur={() => markTouched("password2")}
              />
              <button
                className="eyeBtn"
                type="button"
                onClick={() => setShowPass2((v) => !v)}
                aria-label="Mostrar/ocultar repetir senha"
              >
                👁
              </button>
            </div>
            {touched.password2 && errors.password2 && (
              <div className="errorText">{errors.password2}</div>
            )}
          </div>
        </div>

        <div className="actionsRow">
          <button className="btnCancel" type="button" onClick={handleCancelClick}>
            Cancelar
          </button>

          <button
            className="btnSave"
            type="button"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </section>

      <ConfirmModal
        open={confirmCancel}
        title="Deseja cancelar?"
        description="Os dados inseridos não serão salvos"
        onCancel={() => setConfirmCancel(false)}
        onConfirm={confirmCancelYes}
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
