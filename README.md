# WENLOCK — Fullstack CRUD (Users)

Sistema de CRUD para gerenciamento de usuários (cadastro, listagem com busca/paginação, visualização, edição e exclusão).

> **Entrega:** este repositório contém **backend + frontend** e a documentação final em PDF: `WENLOCK-Entrega.pdf`.

---

## Stack

### Backend
- **Node.js + NestJS**
- **Prisma ORM**
- **PostgreSQL**
- **Swagger (OpenAPI)** para documentação automática dos endpoints
- **UUID** como identificador primário
- **Hash de senha** (armazenamento seguro)

### Frontend
- **Next.js (React) + TypeScript**
- Fetch API (integração com backend)

---

## Requisitos
- **Node.js** (recomendado LTS)
- **npm** (ou yarn/pnpm)
- **PostgreSQL**
- **DBeaver** (opcional)

---

## Como rodar (Linux)

### 1) Banco de dados (PostgreSQL)
Crie um banco e habilite UUID (quando aplicável):

```sql
CREATE DATABASE wenlock;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

### 2) Backend

#### 2.1) Variáveis de ambiente (backend)
Crie `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/wenlock?schema=public"
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

#### 2.2) Instalação e migrações
```bash
cd backend
npm install

# gerar client do prisma
npx prisma generate

# criar/rodar migrações
npx prisma migrate dev

# iniciar
npm run start:dev
```

Backend em:
- **API:** `http://localhost:3001`
- **Swagger UI:** `http://localhost:3001/api`

---

### 3) Frontend

#### 3.1) Variáveis de ambiente (frontend)
Crie `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 3.2) Instalação e execução
```bash
cd frontend
npm install
npm run dev
```

Frontend em:
- `http://localhost:3000`

---

## Scripts principais

### Backend (exemplos)
- `npm run start:dev`
- `npx prisma migrate dev`
- `npx prisma studio`

### Frontend (exemplos)
- `npm run dev`
- `npm run build`
- `npm run start`

---

## Backend — Endpoints

Base URL: `http://localhost:3001`

### Users
| Método | Rota | Descrição |
|---|---|---|
| GET | `/users` | Lista usuários com busca e paginação |
| POST | `/users` | Cria usuário |
| GET | `/users/:id` | Busca usuário por ID |
| PUT | `/users/:id` | Atualiza usuário |
| DELETE | `/users/:id` | Remove usuário |

### Query params (lista)
- `search` (opcional): busca por nome
- `page` (opcional): página (default: 1)
- `limit` (opcional): itens por página (default: 10)

---

## Regras de validação

### Backend
- **name:** obrigatório, máximo **30**
- **email:** obrigatório, máximo **40**, formato válido, **único**
- **registration (matrícula):** obrigatória, apenas números, **4–10**, **única**
- **password:** obrigatória no cadastro, persistida como **hash**

### Frontend (UX)
- **Nome:** apenas letras
- **Email:** e-mail válido
- **Matrícula:** apenas números (4–10)
- **Senha:** alfanuméricos com **6** caracteres
- Botão **Salvar** habilita apenas quando todos os campos são válidos

---

## Frontend — Rotas
- `/` — Home
- `/users` — Listagem (busca + paginação + ações)
  - **Cadastrar** (modal)
  - **Visualizar** (drawer)
  - **Editar** (modal)
  - **Excluir** (confirm)

---

## Observações técnicas
- Busca/paginação integradas ao backend
- Validações no front e no back
- Senha com hash
- UUID como ID