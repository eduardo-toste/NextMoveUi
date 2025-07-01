# 🚀 NextMove Frontend

Uma plataforma moderna de gestão financeira, desenvolvida em React + TypeScript, com autenticação segura, dashboard interativo, relatórios em PDF e design profissional.

---

## ✨ Visão Geral

O **NextMove** é um dashboard financeiro completo para controle de receitas e despesas, com foco em experiência do usuário, performance e integração com arquitetura de microservices.

- **Autenticação JWT** (login, registro, logout seguro)
- **Dashboard com métricas, histórico e resumo financeiro**
- **Gestão de transações**: criar, editar, excluir, filtrar e alterar status
- **Relatório mensal em PDF** (download com um clique)
- **Design responsivo, tema escuro/claro e animações modernas**

---

## 🛠️ Tecnologias

- React 19 + TypeScript
- Vite (build ultra-rápido)
- Context API para autenticação
- jsPDF para geração de relatórios
- CSS customizado e responsivo

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend NextMove rodando (API Gateway em `localhost:8082` por padrão)

### Instalação

```bash
git clone [url-do-repositorio]
cd nextmove-frontend
npm install
```

### Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_API_URL=http://localhost:8082
VITE_APP_NAME=NextMove
VITE_APP_VERSION=1.0.0
```

> Consulte `env.example` para mais detalhes.

### Rodando o Projeto

```bash
npm run dev
```
Acesse: [http://localhost:5173](http://localhost:5173)

---

## 🔐 Autenticação

- **Login**: email e senha (mín. 6 caracteres)
- **Registro**: nome, email único, senha e confirmação
- **Logout seguro**: token sempre removido, mesmo com falha de rede
- **Validação em tempo real** e feedback visual
- **Proteção contra XSS e dados inválidos**

---

## 💸 Gestão de Transações

- **Criar, editar e excluir** transações
- **Campos**: título, descrição, valor, data de vencimento, tipo (receita/despesa), status
- **Filtros avançados**: por tipo, status e busca textual
- **Alteração de status**: conclua, pendencie ou cancele transações com dropdown customizado
- **Visualização detalhada**: modal com informações completas e ações rápidas
- **Ordenação decrescente por data de vencimento**

---

## 📊 Dashboard & Relatórios

- **Resumo financeiro**: receitas, despesas e saldo do mês
- **Métricas rápidas**: totais, pendências e tendências
- **Histórico de transações**: últimas movimentações com navegação rápida
- **Relatório mensal em PDF**: gere e baixe um relatório profissional com todas as transações do mês, incluindo totais e balança

---

## 🎨 Experiência Visual

- **Design moderno**: glassmorphism, gradientes e micro-animações
- **Responsivo**: perfeito em desktop, tablet e mobile
- **Tema escuro/claro**: detecção automática e transições suaves
- **Acessibilidade**: contraste, navegação por teclado e leitores de tela

---

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis (Dashboard, TransactionList, Modais)
├── contexts/            # Contexto global de autenticação
├── services/            # Integração com API REST
├── config/              # Configurações de ambiente
├── App.tsx              # Componente raiz
└── main.tsx             # Ponto de entrada
```

---

## 📦 Scripts

- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera build de produção
- `npm run preview` — Visualiza build de produção
- `npm run lint` — Executa linter

---

## 📄 Exemplo de Uso

### 1. Login/Registro
- Acesse `/` e faça login ou registre-se
- Campos validados em tempo real

### 2. Dashboard
- Visualize métricas, histórico e resumo financeiro
- Acesse ações rápidas: criar transação, visualizar todas, gerar relatório

### 3. Transações
- Crie, edite, exclua e filtre transações
- Altere status facilmente pelo dropdown
- Visualize detalhes em modal

### 4. Relatório Mensal
- Clique em "Relatório Mensal" no dashboard
- Baixe um PDF com todas as transações do mês, totais e saldo

---

## 🔒 Segurança & Boas Práticas

- Tokens JWT armazenados com segurança
- Logout forçado em caso de falha de rede
- Timeout e tratamento de erros de API
- Validação e sanitização de dados
- Código limpo, tipado e modular

---

## 🖼️ Logo & Identidade Visual

- Logo SVG incluso em `/public/Logo NextMove.svg`
- Paleta de cores: azul, verde, cinza e gradientes

---

## 🤝 Contribuição

Pull requests são bem-vindos! Siga o padrão de código, escreva commits claros e mantenha a experiência do usuário como prioridade.

---

## 📄 Licença

Este projeto é open-source sob a licença MIT.
