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

A orquestração dos contêineres do nosso **Frontend** é feita com **Docker Compose**.

### 1. Preparar a API (Backend)

Para rodar para avaliação, **primeiramente inicie a API do professor (Backend)** na sua máquina, garantindo que ela fique rodando na porta padrão `3000`.

### 2. Iniciar os Containers do Frontend

Com a API rodando, inicie o nosso ecossistema a partir da raiz deste projeto:

```bash
docker compose up --build
```

### O que o Docker Compose faz:

- Sobe a nossa interface principal no contêiner `home` e a expõe na porta **`http://localhost:3333`**.
- Sobe o microfrontend interno no contêiner `dashboard`.
- Configura a rede (`host.docker.internal` ou `network_mode: host`) para permitir que os frontends dentro do Docker se comuniquem com a API do professor que está rodando na sua máquina host de forma transparente.

---

## 💻 Como Rodar o Projeto Manualmente (Fora do Docker)

Caso prefira rodar o ambiente de desenvolvimento localmente sem o Docker:

### 1. Preparar e rodar a API

Certifique-se de que a API Backend do professor já esteja rodando na porta `3000`.

### 2. Instalar dependências do Frontend

Na raiz deste projeto:

```bash
npm install
```

### 3. Executar o projeto (todas as zonas frontends)

```bash
npm run dev
```

A aplicação frontend estará disponível em:
👉 **http://localhost:3333**

_(Obs: mantivemos a credencial `admin@vault.com` / `admin123` chumbada no código como fallback para facilitar os testes, caso não queira criar um novo registro)._
