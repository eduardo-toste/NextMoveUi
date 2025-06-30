# 🚀 NextMove Frontend

Uma aplicação React moderna para a plataforma NextMove, com sistema de autenticação completo e dashboard responsivo, configurada para trabalhar com arquitetura de microservices.

## 🚀 Características

- **Autenticação Completa**: Login/registro/logout com JWT tokens
- **Dashboard Moderno**: Interface elegante com métricas e atividades
- **Design Responsivo**: Funciona perfeitamente em mobile e desktop
- **TypeScript**: Código tipado para maior segurança
- **Context API**: Gerenciamento de estado global
- **Validação**: Formulários com validação em tempo real
- **Microservices Ready**: Configurado para API Gateway
- **Status de Conexão**: Indicador visual de conectividade
- **Tema Escuro/Claro**: Suporte automático para preferências do sistema

## 📋 Sobre o Projeto

O NextMove é uma aplicação React/TypeScript que oferece:
- 🔐 **Autenticação Segura** - Sistema de login e registro com validação
- 📊 **Dashboard Inteligente** - Métricas e atividades em tempo real
- 💼 **Gestão de Transações** - Interface para gerenciar operações
- 👥 **Ações Rápidas** - Acesso rápido às funcionalidades principais

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool rápida e moderna
- **CSS Customizado** - Estilos modernos com variáveis CSS

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- API Gateway NextMove rodando em localhost:8082

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd nextmove-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
# Crie um arquivo .env na raiz do projeto
VITE_API_URL=http://localhost:8082
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 🔐 Sistema de Autenticação

### Login
- **Email**: Qualquer email válido (ex: `teste@email.com`)
- **Senha**: Mínimo 6 caracteres (ex: `123456`)
- **Validação**: Em tempo real com feedback visual
- **Acessibilidade**: Suporte completo para leitores de tela

### Registro
- **Nome**: Nome completo do usuário
- **Email**: Email válido e único
- **Senha**: Mínimo 6 caracteres
- **Confirmação**: Senha deve ser igual

### Funcionalidades
- ✅ Validação de email e senha
- ✅ Mostrar/ocultar senha
- ✅ Estados de loading com spinner
- ✅ Mensagens de erro específicas
- ✅ Design responsivo e moderno
- ✅ Animações suaves e interativas
- ✅ Efeitos de glassmorphism
- ✅ Gradientes e sombras elegantes

## 🎨 Design System

### Características Visuais
- 🎭 **Glassmorphism** - Efeitos de vidro com blur
- 🌈 **Gradientes** - Transições suaves de cores
- ✨ **Animações** - Micro-interações fluidas
- 📱 **Responsivo** - Adaptação perfeita para todos os dispositivos
- 🎯 **Acessível** - Suporte completo para leitores de tela
- 🌙 **Tema Escuro** - Suporte automático para preferências do sistema

### Animações
- **Fade-in**: Aparição suave de elementos
- **Slide-up**: Deslizamento para cima
- **Bounce-in**: Efeito de quicar na entrada
- **Float**: Partículas flutuantes no background
- **Pulse**: Indicadores de status animados

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── LoginForm.tsx    # Formulário de login moderno
│   ├── RegisterForm.tsx # Formulário de registro
│   ├── Dashboard.tsx    # Dashboard principal
│   └── TransactionView.tsx # Modal de detalhes de transação
├── contexts/
│   └── AuthContext.tsx  # Contexto de autenticação
├── services/
│   └── api.ts          # Serviços de API
├── config/
│   └── environment.ts  # Configurações de ambiente
├── App.tsx             # Componente principal
├── index.css           # Estilos customizados
└── main.tsx            # Ponto de entrada
```

## 🎨 Funcionalidades

### Telas Principais

1. **Tela de Login** - Interface moderna e interativa
   - Formulário com validação em tempo real
   - Animações de entrada e transições
   - Efeitos de glassmorphism
   - Background animado com partículas flutuantes

2. **Tela de Registro** - Formulário de cadastro
   - Validação completa dos campos
   - Feedback visual em tempo real
   - Design consistente com o login

3. **Dashboard** - Interface principal elegante
   - Métricas principais com tendências
   - Atividades recentes
   - Ações rápidas
   - Resumo financeiro
   - Status do sistema

### Componentes Principais

1. **LoginForm** - Formulário de login responsivo
2. **RegisterForm** - Formulário de registro
3. **Dashboard** - Interface principal com métricas
4. **TransactionView** - Modal de detalhes de transação
5. **AuthContext** - Gerenciamento de estado de autenticação

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- **Desktop** (1200px+) - Layout completo com todos os efeitos
- **Tablet** (768px - 1199px) - Adaptação automática
- **Mobile** (até 767px) - Layout otimizado para touch

## 🌙 Tema Escuro/Claro

- **Detecção Automática**: Baseada nas preferências do sistema
- **Transições Suaves**: Mudança automática entre temas
- **Cores Consistentes**: Paleta harmonizada para ambos os temas
- **Acessibilidade**: Contraste adequado em ambos os modos

## 🔒 Segurança

- Validação de entrada no frontend
- Sanitização de dados
- Proteção contra ataques XSS
- Validação de email e senha
- Estados de erro seguros
- Tokens JWT para autenticação

## 🎯 Próximos Passos

- [x] Implementar tela de login moderna
- [x] Implementar tela de registro
- [x] Criar dashboard responsivo
- [x] Adicionar suporte a tema escuro
- [x] Implementar modal de detalhes de transação
- [x] Integrar dashboard com backend real (sem mocks)
- [ ] Adicionar sistema de busca
- [ ] Criar perfil de usuário
- [ ] Implementar notificações
- [ ] Adicionar testes automatizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através do formulário na aplicação ou envie um email para [contato@nextmove.com](mailto:contato@nextmove.com).

---

Desenvolvido com ❤️ para a comunidade de desenvolvedores

## 🔧 Configuração para Microservices

### API Gateway (Porta 8082)

O frontend está configurado para se conectar ao seu API Gateway em `localhost:8082`. Certifique-se de que:

1. **API Gateway está rodando** na porta 8082
2. **CORS está configurado** para aceitar requisições do frontend
3. **Roteamento está configurado** para os microservices

### Configuração do API Gateway

```yaml
# Exemplo de configuração do API Gateway (Spring Cloud Gateway)
spring:
  cloud:
    gateway:
      routes:
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/auth-service/**
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/user-service/**
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
```

### Endpoints dos Microservices

O frontend faz chamadas para os seguintes endpoints através do API Gateway:

#### Auth Service (`/auth-service/*`)
- `POST /auth-service/auth/login` → Login do usuário
- `POST /auth-service/auth/logout` → Logout do usuário
- `GET /auth-service/auth/validate` → Validação de token

#### User Service (`/user-service/*`)
- `GET /user-service/user/profile` → Perfil do usuário

#### Health Check
- `GET /health` → Gateway Health Check

## 🏗️ Estrutura de Microservices

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │  Microservices  │
│   (5173)        │◄──►│   (8082)        │◄──►│                 │
└─────────────────┘    └─────────────────┘    │  • Auth Service │
                                              │  • User Service │
                                              │  • Other...     │
                                              └─────────────────┘
```

## 🔐 Autenticação com Microservices

### Fluxo de Autenticação

1. **Login**: Frontend → API Gateway → Auth Service
2. **Token**: Auth Service → API Gateway → Frontend
3. **Requests**: Frontend → API Gateway → Microservice (com token)
4. **Validation**: API Gateway → Auth Service (valida token)

### Headers Configurados

O frontend envia automaticamente:
- `Authorization: Bearer <token>`
- `Content-Type: application/json`
- `Accept: application/json`
- `X-Requested-With: XMLHttpRequest`

### Exemplo de Requisição de Login

```javascript
// Frontend faz requisição para:
POST http://localhost:8082/auth-service/auth/login

// Com payload:
{
  "email": "user@example.com",
  "password": "password123"
}

// Resposta esperada:
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "jwt_token_aqui",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "Nome do Usuário"
  }
}
```

## 🎯 Funcionalidades

- ✅ Login com validação
- ✅ Logout
- ✅ Persistência de sessão
- ✅ Validação de formulários
- ✅ Loading states
- ✅ Tratamento de erros
- ✅ Design responsivo
- ✅ Animações suaves
- ✅ Dashboard dinâmico com dados reais do backend
- ✅ Modal de detalhes de transação
- ✅ Status visual do sistema
- ✅ Logs de debug em desenvolvimento

## 🚀 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza o build de produção

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# URL da API Gateway (sem /api no final)
VITE_API_URL=http://localhost:8082

# Nome da aplicação
VITE_APP_NAME=NextMove

# Versão da aplicação
VITE_APP_VERSION=1.0.0
```

### Debug e Logs

Em modo de desenvolvimento, o frontend mostra:
- Logs de todas as requisições para o API Gateway
- Logs de todas as respostas
- Logs de erros detalhados
- Status de conexão em tempo real

### CORS no API Gateway

Certifique-se de que seu API Gateway está configurado para aceitar requisições do frontend:

```yaml
# Spring Cloud Gateway
spring:
  cloud:
    gateway:
      globalcors:
        corsConfigurations:
          '[/**]':
            allowedOrigins: "http://localhost:5173"
            allowedMethods: "*"
            allowedHeaders: "*"
            allowCredentials: true
```

```javascript
// Express Gateway
cors:
  enabled: true
  origin: 'http://localhost:5173'
  credentials: true
```

## 🎨 Estrutura do Projeto

```
src/
├── components/              # Componentes React
│   ├── LoginForm.tsx       # Formulário de login
│   ├── Dashboard.tsx       # Dashboard principal
│   └── TransactionView.tsx # Modal de detalhes de transação
├── contexts/               # Contextos React
│   └── AuthContext.tsx     # Contexto de autenticação
├── services/               # Serviços
│   └── api.ts             # Serviço de API (microservices ready)
├── config/                # Configurações
│   └── environment.ts     # Variáveis de ambiente
├── App.tsx                # Componente principal
└── main.tsx               # Ponto de entrada
```

## 🔍 Troubleshooting

### Problemas de Conexão

1. **Verifique se o API Gateway está rodando**:
   ```bash
   curl http://localhost:8082/health
   ```

2. **Teste um endpoint específico**:
   ```bash
   curl -X POST http://localhost:8082/auth-service/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456"}'
   ```

3. **Verifique CORS**:
   - Abra o DevTools (F12)
   - Vá na aba Network
   - Verifique se há erros de CORS

4. **Verifique logs do Gateway**:
   - Olhe os logs do seu API Gateway
   - Verifique se as rotas estão configuradas corretamente

### Logs de Debug

Em desenvolvimento, você verá no console:
- Todas as requisições para o API Gateway
- Todas as respostas
- Status de conexão
- Erros detalhados

### Endpoints Testados

O frontend faz chamadas para:
- `POST http://localhost:8082/auth-service/auth/login`
- `POST http://localhost:8082/auth-service/auth/logout`
- `GET http://localhost:8082/auth-service/auth/validate`
- `GET http://localhost:8082/user-service/user/profile`
- `GET http://localhost:8082/health`

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório.

## 📱 Responsividade

O projeto foi totalmente otimizado para dispositivos móveis com:

- **Viewport Dinâmico**: Suporte para `100dvh` (dynamic viewport height)
- **Safe Areas**: Suporte para dispositivos com notch (iPhone, etc.)
- **Touch Targets**: Todos os elementos interativos têm pelo menos 44px
- **Font Size**: Previne zoom automático no iOS (16px mínimo)
- **Orientation**: Suporte para orientação landscape e portrait
- **High DPI**: Otimizado para telas de alta densidade

## 📱 Acesso Mobile

### Via Rede Local

1. Certifique-se de que o backend está configurado para aceitar CORS do IP da rede local
2. Acesse `http://192.168.100.85:5173` no seu dispositivo móvel
3. O sistema detectará automaticamente que é um dispositivo móvel e otimizará a interface

### Como PWA

1. Abra a aplicação no Chrome/Safari mobile
2. Toque em "Adicionar à Tela Inicial" ou "Instalar App"
3. A aplicação funcionará como um app nativo

## 🎨 Design System

### Cores Principais
- **Primária**: `#667eea` (azul)
- **Secundária**: `#764ba2` (roxo)
- **Erro**: `#ef4444` (vermelho)
- **Sucesso**: `#22c55e` (verde)

### Tipografia
- **Família**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Tamanhos**: 0.75rem a 1.75rem (escala responsiva)

### Breakpoints
- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🔧 Configuração do Backend

Para que o frontend funcione corretamente, o backend deve ter CORS configurado para aceitar requisições do IP da rede local:

```java
// Exemplo de configuração CORS
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://192.168.100.85:5173",
    "capacitor://localhost",
    "ionic://localhost"
})
```

## 📋 Funcionalidades

### Autenticação
- ✅ Login com email/senha
- ✅ Registro de novos usuários
- ✅ Validação de token JWT
- ✅ Logout seguro

### Interface
- ✅ Design responsivo para todos os dispositivos
- ✅ Animações suaves e feedback visual
- ✅ Indicador de status da API Gateway
- ✅ Modo escuro automático
- ✅ Suporte para PWA

### Acessibilidade
- ✅ Navegação por teclado
- ✅ Foco visual claro
- ✅ Contraste adequado
- ✅ Redução de movimento (prefers-reduced-motion)

## 🧹 Manutenção e Código Limpo

- O projeto não utiliza mais dados mockados: todas as informações do dashboard e histórico vêm do backend real.
- Não há componentes ou arquivos não utilizados no código-fonte.
- O código segue boas práticas de tipagem, organização e lint.
- Recomenda-se rodar `npm run lint` antes de cada commit para garantir a qualidade.

## 🎯 Próximos Passos

- [x] Implementar tela de login moderna
- [x] Implementar tela de registro
- [x] Criar dashboard responsivo
- [x] Adicionar suporte a tema escuro
- [x] Implementar modal de detalhes de transação
- [x] Integrar dashboard com backend real (sem mocks)
- [ ] Adicionar sistema de busca
- [ ] Criar perfil de usuário
- [ ] Implementar notificações
- [ ] Adicionar testes automatizados

---

**NextMove** - Transformando a gestão imobiliária com tecnologia moderna e responsiva! 🏠✨
