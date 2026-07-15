# Tech Challenge - Sistema de Gestão Financeira (The Digital Vault)

Este projeto é uma aplicação de gestão de transações financeiras, desenvolvida como parte do Tech Challenge da pós-graduação.

A solução foi construída com foco em UI/UX moderna, acessibilidade e internacionalização (i18n), proporcionando uma experiência fluida e intuitiva para diferentes perfis de usuários. O frontend agora está integrado de forma real com a API (Backend) fornecida pelos professores para o projeto.

---

## 🚀 Novidades e Funcionalidades do Desafio Implementadas

Todos os requisitos solicitados no Tech Challenge foram implementados com sucesso na aplicação, garantindo uma interface rica e totalmente funcional:

### 1. Dashboard e Análises (Home Page)

- **Gráficos Financeiros:** Inclusão de gráficos e cards de resumo financeiro para oferecer uma visão detalhada do desempenho (receitas vs. despesas) no dashboard principal.

### 2. Plus: Personalização de Dashboard ⭐

- **Widget Manager:** O usuário pode personalizar a exibição do seu dashboard ligando ou desligando widgets de interesse (como _Meta de Economia_, _Alerta de Gastos_ e _Gráficos_). As alterações são salvas e refletidas instantaneamente na interface sem a necessidade de recarregar a página.

### 3. Listagem de Transações Avançada

- **Filtros e Pesquisa:** Implementação de filtros combinados e avançados. É possível realizar busca textual por título/categoria e filtrar por tipo (entrada/saída), categorias específicas, período (data inicial e final) e faixa de valor (mínimo e máximo).
- **Paginação:** Sistema robusto de paginação adicionado na tabela de transações para otimizar o carregamento e visualização de grandes volumes de dados.

### 4. Gestão de Transações

- **Validação Avançada:** Implementação de regras estritas de validação no formulário de adição/edição (ex: o valor deve ser positivo, tamanho mínimo para títulos).
- **Sugestões Automáticas de Categoria:** Ao digitar o título de uma transação (ex: "almoço", "salário", "uber"), o sistema automaticamente detecta a palavra-chave e sugere a categoria correta correspondente.
- **Anexos de Arquivos:** Suporte completo ao upload de arquivos (recibos, PDFs, imagens) ao registrar uma nova transação.

---

## 🏗 Arquitetura de Microfrontends

A aplicação é dividida em **microfrontends independentes**, usando [Multi-Zones do Next.js](https://nextjs.org/docs/app/guides/multi-zones) em um monorepo com npm workspaces + Turborepo. Cada módulo pode ser desenvolvido, atualizado e deployado de forma isolada.

```text
├── apps/
│   ├── home/        # Zona padrão (porta 3333): login, autenticação, registro e roteamento
│   └── dashboard/   # Zona dashboard (porta 3001): painel de transações e integração com a API
└── packages/
    ├── ui/          # Design system compartilhado (componentes, tema, providers)
    └── shared/      # Tipos, utilitários, mensagens i18n e configuração de rotas
```

### Como funciona

- **`apps/home`** é a zona padrão: serve a página de login e registro (`/`, `/register`) e roteia, via `rewrites`, as requisições para a zona dashboard.
- **`apps/dashboard`** serve as rotas `/dashboard` (PT-BR) e `/en/dashboard`, atuando como BFF com a API de transações.
- Para o usuário, tudo é servido sob **um único domínio** (`localhost:3333` em dev); a navegação entre zonas é feita de forma nativa e sem conflito de assets.
- Cada zona tem seu próprio build, deploy e servidor.

---

## 🐳 Como Rodar o Projeto com Docker (Recomendado)

Toda a aplicação — API (Backend), zona home e zona dashboard — é orquestrada pelo **Docker Compose**. Um único comando sobe o ecossistema completo, a partir da raiz do projeto:

```bash
docker compose up --build
```

> ⚠️ Certifique-se de que as portas `3000`, `3001` e `3333` estejam livres (não suba a API manualmente antes — o Compose já faz isso e a porta 3000 entraria em conflito).

### O que o Docker Compose sobe

- **`api`** — a API do professor (Backend), exposta em `http://localhost:3000` (documentação Swagger em `/docs`).
- **`dashboard`** — o microfrontend do painel de transações, na porta `3001`.
- **`home`** — a interface principal (login/registro), exposta em **`http://localhost:3333`** ← ponto de entrada da aplicação.

Os contêineres se comunicam pela rede interna do Compose (`home` → `dashboard` via rewrites, e os frontends → API via `http://api:3000`).

> 💡 A API roda com MongoDB **em memória**: os dados (usuários e transações) são zerados quando os contêineres reiniciam. Crie sua conta em `/register` na primeira utilização.

---

## 💻 Como Rodar o Projeto Manualmente (Fora do Docker)

Caso prefira rodar o ambiente de desenvolvimento localmente sem o Docker:

### 1. Instalar dependências

Na raiz do projeto (instala as dependências de todos os workspaces, incluindo a API):

```bash
npm install
```

### 2. Configurar a URL da API para os BFFs

As rotas de BFF das zonas leem a variável `API_URL`. Crie um arquivo `.env.local` em **`apps/home`** e outro em **`apps/dashboard`**, ambos com o conteúdo:

```bash
API_URL=http://localhost:3000
```

### 3. Executar o projeto

```bash
npm run dev
```

Este comando sobe **tudo de uma vez** via Turborepo: a API na porta `3000` (com MongoDB em memória), a zona dashboard na `3001` e a zona home na `3333`. Não é necessário iniciar a API separadamente.

A aplicação estará disponível em:
👉 **<http://localhost:3333>**

_(Obs: o login exige um usuário cadastrado — crie sua conta pela tela de registro em `/register`. Como o banco de desenvolvimento é em memória, os usuários são zerados a cada reinício da API.)_
