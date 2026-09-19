# Vestir — Jogo de Vestir Avatares

Joguinho web de "dress up": personalize um avatar (tom de pele, cabelo) e vista-o com roupas de categorias fixas (vestido, blusa, calça, short, sapato, acessório), em estilo 2D "funko/chibi". O progresso é salvo automaticamente no navegador, sem necessidade de login.

Documentação completa da feature em [`specs/001-avatar-dress-up/`](specs/001-avatar-dress-up/) (spec, plano técnico, modelo de dados, contratos e guia de validação).

## Requisitos

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev
```

Abra a URL impressa pelo Vite (tipicamente `http://localhost:5173`).

## Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build` | Type-check + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente |
| `npm test` | Roda os testes unitários e de integração (Vitest) |
| `npm run test:watch` | Vitest em modo watch |
| `npm run test:e2e` | Roda os testes end-to-end (Playwright), incluindo build + preview |
| `npm run lint` | ESLint |

## Stack

React 18 + TypeScript + Vite, sem backend. Estado do avatar em Context + `useReducer`, persistido em `localStorage`. Detalhes e alternativas consideradas em [`specs/001-avatar-dress-up/research.md`](specs/001-avatar-dress-up/research.md).
