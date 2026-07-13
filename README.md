# Tech Challenge - Sistema de Gestão Financeira

Este projeto é uma aplicação de gestão de transações financeiras, desenvolvida como parte do Tech Challenge (POSTECH).

A solução foi construída com foco em UI/UX moderna, acessibilidade e internacionalização (i18n), proporcionando uma experiência fluida e intuitiva para diferentes perfis de usuários.

---

## Arquitetura de Microfrontends

A aplicação é dividida em **microfrontends independentes**, usando [Multi-Zones do Next.js](https://nextjs.org/docs/app/guides/multi-zones) em um monorepo com npm workspaces + Turborepo. Cada módulo pode ser desenvolvido, atualizado e deployado de forma isolada.

```text
├── apps/
│   ├── home/        # Zona padrão (porta 3000): login, autenticação e roteamento
│   └── dashboard/   # Zona dashboard (porta 3001): transações + API mock
└── packages/
    ├── ui/          # Design system compartilhado (componentes, tema, providers)
    └── shared/      # Tipos, utilitários, mensagens i18n e configuração de rotas
```

### Como funciona

- **`apps/home`** é a zona padrão: serve a página de login (`/` e `/en`) e roteia, via `rewrites`, os paths `/dashboard`, `/dashboard-static` e `/api/transactions` para a zona dashboard.
- **`apps/dashboard`** serve as rotas `/dashboard` (PT-BR) e `/en/dashboard`, além da API mock de transações. Usa `assetPrefix: "/dashboard-static"` para que seus assets não conflitem com os das outras zonas.
- Para o usuário, tudo é servido sob **um único domínio** (`localhost:3000` em dev); a navegação entre zonas é uma navegação completa (hard navigation), como recomendado pela documentação do Next.js.
- Cada zona tem seu próprio build, deploy e servidor — atualizar um módulo não exige rebuild dos demais.
- O código comum (design system, tipos, i18n) vive em `packages/`, versionado junto mas consumido como dependência por cada zona.

### Desenvolvimento isolado

Cada microfrontend pode rodar sozinho:

```bash
npm run dev:home        # somente a zona de login (porta 3000)
npm run dev:dashboard   # somente a zona do dashboard (porta 3001)
```

Em produção, a URL da zona dashboard é configurável pela variável de ambiente `DASHBOARD_URL` na zona home (default: `http://localhost:3001`).

---

## Docker

Cada microfrontend tem seu próprio `Dockerfile` (multi-stage, com `output: "standalone"` do Next.js, gerando imagens mínimas que rodam como usuário não-root). A orquestração dos contêineres é feita com **Docker Compose**:

```bash
docker compose up --build
```

- **home** — exposto em `http://localhost:3000` (ponto de entrada da aplicação)
- **dashboard** — contêiner independente; a zona home o alcança pela rede interna do Compose (`http://dashboard:3001`)

Cada imagem pode também ser buildada e deployada isoladamente:

```bash
docker build -f apps/home/Dockerfile -t vault-home .
docker build -f apps/dashboard/Dockerfile -t vault-dashboard .
```

---

## Sobre o Projeto

O sistema permite que o usuário gerencie suas finanças pessoais de forma simples e eficiente.

### Funcionalidades

- **Gestão de Transações**
  - Adição de transações
  - Edição (opcional)
  - Exclusão

- **Visualização de Dados**
  - Listagem clara de entradas e saídas

- **Modo Claro/Escuro**
  - Alternância dinâmica entre temas (Light/Dark Mode)

- **Internacionalização (i18n)**
  - Suporte para:
    - Português (PT-BR)
    - Inglês (EN)

- **Mock de Dados**
  - Utilização de dados simulados (JSON / Frontend) para facilitar testes e demonstração

---

## Tecnologias Utilizadas

- Next.js (Framework React) com Multi-Zones
- Turborepo + npm workspaces (monorepo)
- Tailwind CSS (Estilização e temas)
- Lucide React (Ícones acessíveis)
- next-intl (Internacionalização)

---

## Como Rodar o Projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/haramoni/tech-challenge.git
cd tech-challenge
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Executar o projeto (todas as zonas)

```bash
npm run dev
```

A aplicação estará disponível em:

http://localhost:3000

Credenciais de demonstração: `admin@vault.com` / `admin123`
