# 🚀 NextMove Frontend

Plataforma moderna e robusta de gestão financeira, desenvolvida em React + TypeScript, com autenticação segura, dashboard interativo, relatórios em PDF e design profissional. Foco total em experiência do usuário, performance, segurança e integração com arquitetura de microservices.

---

## ✨ Visão Geral

O **NextMove** é um sistema completo para controle de receitas e despesas, pensado para máxima produtividade e confiabilidade:

- **Autenticação JWT** (login, registro, logout seguro e resiliente)
- **Dashboard dinâmico** com métricas, histórico e resumo financeiro
- **Gestão de transações**: criar, editar, excluir, filtrar, alterar status
- **Relatório mensal em PDF** (download profissional com um clique)
- **Design responsivo, tema escuro/claro, acessibilidade e micro-animações**

---

## 🛠️ Tecnologias & Arquitetura

- **React 19** + **TypeScript**
- **Vite** (build ultra-rápido)
- **Context API** para autenticação global
- **jsPDF** para geração de relatórios
- **CSS customizado** e responsivo (Glassmorphism, gradientes)
- **Integração com microservices** (API Gateway)

---

## 📦 Instalação & Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Backend NextMove rodando (API Gateway padrão: `http://localhost:8082`)

### Passos

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

## 🔐 Autenticação & Segurança

- **Login**: email e senha (mín. 6 caracteres, validação em tempo real)
- **Registro**: nome, email único, senha e confirmação
- **Logout seguro**: token sempre removido, mesmo com falha de rede (timeout, fallback e limpeza local garantida)
- **Proteção contra XSS e dados inválidos**
- **Timeouts e tratamento de erros de API**
- **Tokens JWT armazenados com segurança**

#### 🔄 Diferencial: Logout Resiliente
- Timeout automático nas requisições
- Limpeza local garantida mesmo com falha de rede
- Fallback manual para garantir remoção do token
- Sem necessidade de intervenção do usuário

---

## 💸 Gestão de Transações

- **Criar, editar, excluir** transações
- **Campos**: título, descrição, valor, data de vencimento, tipo (receita/despesa), status
- **Filtros avançados**: por tipo, status e busca textual
- **Alteração de status**: conclua, pendencie ou cancele transações via dropdown
- **Visualização detalhada**: modal com informações completas e ações rápidas
- **Ordenação decrescente por data de vencimento**

---

## 📊 Dashboard & Relatórios

- **Resumo financeiro**: receitas, despesas e saldo do mês
- **Métricas rápidas**: totais, pendências, tendências
- **Histórico de transações**: últimas movimentações com navegação rápida
- **Relatório mensal em PDF**: gere e baixe um relatório profissional com todas as transações do mês, incluindo totais e balanço

---

## 🎨 Experiência Visual & Acessibilidade

- **Design moderno**: glassmorphism, gradientes, micro-animações
- **Responsivo**: perfeito em desktop, tablet e mobile
- **Tema escuro/claro**: detecção automática e transições suaves
- **Acessibilidade**: contraste, navegação por teclado, leitores de tela

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

## 📦 Scripts Disponíveis

- `npm run dev` — Inicia o servidor de desenvolvimento
- `npm run build` — Gera build de produção
- `npm run preview` — Visualiza build de produção
- `npm run lint` — Executa linter

---

## 📄 Exemplos de Uso

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

## 🖼️ Identidade Visual

- Logo SVG incluso em `/public/Logo NextMove.svg`
- Paleta de cores: azul, verde, cinza e gradientes

---

## 🤝 Contribuição

Pull requests são bem-vindos! Siga o padrão de código, escreva commits claros e mantenha a experiência do usuário como prioridade.

1. Fork este repositório
2. Crie sua branch: `git checkout -b feature/nome-da-feature`
3. Commit suas alterações: `git commit -m 'feat: minha feature'`
4. Push na branch: `git push origin feature/nome-da-feature`
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é open-source sob a licença MIT.

---

## 📬 Contato

Dúvidas, sugestões ou parcerias? Entre em contato pelo [LinkedIn](https://www.linkedin.com/in/eduardo-toste/) ou abra uma issue.
