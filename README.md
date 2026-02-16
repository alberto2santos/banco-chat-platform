<div align="center">

# 💬 Sistema de Comunicação Bancária

### Plataforma de Chat em Tempo Real para Atendimento Bancário

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen.svg)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black.svg)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Demonstração](#-demonstração) •
[Instalação](#-instalação) •
[Documentação](#-documentação) •
[Deploy](#-deploy)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API Documentation](#-api-documentation)
- [Demonstração](#-demonstração)
- [Deploy](#-deploy)
- [Testes](#-testes)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Autor](#-autor)

---

## 🎯 Sobre o Projeto

Sistema completo de comunicação em tempo real desenvolvido para facilitar o atendimento entre **clientes** e **gerentes bancários**. A plataforma oferece chat instantâneo via WebSocket, notificações em tempo real e interface moderna e responsiva.

### 🎥 Demonstração

> _Em breve: GIF ou vídeo demonstrativo_

### ⭐ Destaques

- ⚡ **Chat em Tempo Real** - WebSocket com Socket.io
- 🔐 **Autenticação Segura** - JWT com tokens
- 📱 **Design Responsivo** - Mobile-first com Material-UI
- 🌐 **API RESTful** - Documentação completa com Swagger
- ☁️ **Cloud Database** - MongoDB Atlas
- 🐳 **Docker Ready** - Containerização completa
- 🎨 **UX Moderna** - Animações e transições suaves

---

## ✨ Funcionalidades

### Para Clientes
- ✅ Registro e autenticação de usuários
- ✅ Criar novos atendimentos
- ✅ Enviar mensagens em tempo real
- ✅ Visualizar histórico de conversas
- ✅ Receber notificações instantâneas
- ✅ Status online/offline dos gerentes

### Para Gerentes
- ✅ Visualizar todos os atendimentos
- ✅ Responder mensagens em tempo real
- ✅ Gerenciar status dos chats (aberto/em atendimento/fechado)
- ✅ Dashboard com métricas
- ✅ Filtrar chats por status e assunto

### Recursos Técnicos
- ✅ Autenticação JWT
- ✅ Rate limiting e segurança
- ✅ Validação de dados
- ✅ Error handling robusto
- ✅ Logging estruturado
- ✅ WebSocket para mensagens instantâneas
- ✅ Indicador "digitando..."
- ✅ Timestamps e formatação de datas
- ✅ Agrupamento de mensagens por data

---

## 🛠️ Tecnologias

### Backend
- **Node.js** `18.x` - Runtime JavaScript
- **Express** `4.x` - Framework web
- **MongoDB** `6.x` - Banco de dados NoSQL
- **Mongoose** `8.x` - ODM para MongoDB
- **Socket.io** `4.x` - WebSocket em tempo real
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Swagger** - Documentação de API
- **Express Rate Limit** - Rate limiting
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Segurança HTTP headers
- **Morgan** - Logger HTTP

### Frontend
- **React** `18.x` - Biblioteca UI
- **Material-UI (MUI)** `5.x` - Componentes React
- **React Router** `6.x` - Roteamento
- **Axios** - Cliente HTTP
- **Socket.io Client** - WebSocket client
- **React Toastify** - Notificações
- **date-fns** - Manipulação de datas

### DevOps & Ferramentas
- **Docker** & **Docker Compose** - Containerização
- **Git** - Controle de versão
- **ESLint** - Linting JavaScript
- **Nodemon** - Hot reload (desenvolvimento)

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pages     │  │ Components  │  │  Services   │        │
│  │ - Login     │  │ - ChatRoom  │  │ - API       │        │
│  │ - Dashboard │  │ - MessageList│ │ - Socket    │        │
│  │ - ChatList  │  │ - Header    │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            ↕️ HTTP/WS
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Controllers │  │ Middlewares │  │  Services   │        │
│  │ - Auth      │  │ - JWT Auth  │  │ - Socket.io │        │
│  │ - Chat      │  │ - Validator │  │ - Email     │        │
│  │ - Message   │  │ - RateLimit │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                          ↕️                                  │
│  ┌─────────────────────────────────────────────┐           │
│  │              Models (Mongoose)              │           │
│  │  - User   - Chat   - Message                │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
                            ↕️
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE (MongoDB Atlas)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │  users   │  │  chats   │  │ messages │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios

```
banco-chat-platform/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   └── messageController.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── validator.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Chat.js
│   │   └── Message.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chats.js
│   │   └── messages.js
│   ├── services/
│   │   ├── socketService.js
│   │   └── emailService.js
│   ├── utils/
│   │   └── logger.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/
│   │   │   │   ├── ChatHeader.jsx
│   │   │   │   ├── ChatRoom.jsx
│   │   │   │   ├── MessageList.jsx
│   │   │   │   └── MessageInput.jsx
│   │   │   ├── Layout/
│   │   │   │   └── MainLayout.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── Configuracoes.jsx
│   │   │   ├── Ajuda.jsx
│   │   │   ├── Sobre.jsx
│   │   │   ├── Relatorios.jsx
│   │   │   └── Contatos.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
├── .gitignore
├── LICENSE
└── README.md
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** `>= 18.x` - [Download](https://nodejs.org/)
- **npm** `>= 9.x` (vem com Node.js)
- **MongoDB Atlas Account** (ou MongoDB local) - [Criar conta](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

**Opcional:**
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/)

---

## 🚀 Instalação

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/alberto2santos/banco-chat-platform.git
cd banco-chat-platform
```

### 2️⃣ Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
# (veja seção Configuração)
```

### 3️⃣ Frontend

```bash
cd ../frontend

# Instalar dependências
npm install

# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env
```

---

## ⚙️ Configuração

### Backend (.env)

```env
# ==========================================
# SERVIDOR
# ==========================================
NODE_ENV=development
PORT=3000

# ==========================================
# MONGODB
# ==========================================
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/banco_chat?retryWrites=true&w=majority

# ==========================================
# JWT
# ==========================================
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=7d

# ==========================================
# SESSÃO
# ==========================================
SESSION_SECRET=sua_chave_sessao_secreta_aqui
SESSION_MAX_AGE=604800000

# ==========================================
# CORS
# ==========================================
FRONTEND_URL=http://localhost:3001

# ==========================================
# RATE LIMITING
# ==========================================
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_WS_URL=http://localhost:3000
```

### MongoDB Atlas Setup

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie um cluster gratuito
3. Configure Network Access:
   - Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
4. Crie um Database User
5. Obtenha a Connection String
6. Cole no `.env` do backend

---

## 💻 Uso

### Desenvolvimento Local

#### Opção 1: Manualmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

#### Opção 2: Com Docker

```bash
# Na raiz do projeto
docker-compose up
```

### Acessar a Aplicação

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api-docs

### Criar Primeiro Usuário

1. Acesse http://localhost:3001/registro
2. Preencha:
   - **Nome:** João Silva
   - **Email:** joao@exemplo.com
   - **Senha:** senha123
   - **Tipo:** Gerente
3. Clique em "Registrar"

4. Crie um segundo usuário (Cliente):
   - **Nome:** Maria Santos
   - **Email:** maria@exemplo.com
   - **Senha:** senha123
   - **Tipo:** Cliente

### Testar Chat em Tempo Real

1. Abra 2 navegadores (ou aba normal + aba anônima)
2. **Navegador 1:** Login como Cliente (maria@exemplo.com)
3. **Navegador 2:** Login como Gerente (joao@exemplo.com)
4. Cliente cria um novo chat
5. Gerente vê o chat aparecer
6. Ambos trocam mensagens em tempo real! 🎉

---

## 📚 API Documentation

### Endpoints Principais

#### Autenticação

```http
POST /api/auth/registro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "senha123",
  "tipo": "gerente"
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

#### Chats

```http
GET /api/chats
Authorization: Bearer {token}
```

```http
POST /api/chats
Authorization: Bearer {token}
Content-Type: application/json

{
  "gerenteId": "id_do_gerente",
  "assunto": "duvidas",
  "prioridade": "media"
}
```

#### Mensagens

```http
GET /api/chats/{chatId}/mensagens
Authorization: Bearer {token}
```

### Documentação Completa

Acesse a documentação interativa em:
```
http://localhost:3000/api-docs
```

---

## 🎨 Demonstração

### Screenshots

> _Em desenvolvimento: Adicione screenshots aqui_

**Tela de Login**
```
[Screenshot da tela de login]
```

**Dashboard**
```
[Screenshot do dashboard]
```

**Chat em Tempo Real**
```
[Screenshot do chat]
```

---

## 🚢 Deploy

### Backend (Railway/Render)

1. Faça commit do código no GitHub
2. Acesse [Railway](https://railway.app/) ou [Render](https://render.com/)
3. Crie novo projeto a partir do repositório
4. Configure variáveis de ambiente
5. Deploy automático! 🚀

### Frontend (Vercel/Netlify)

```bash
# Fazer build
cd frontend
npm run build

# Deploy no Vercel
npx vercel

# Ou no Netlify
npx netlify deploy --prod
```

### Variáveis de Ambiente (Produção)

Lembre-se de configurar:
- `NODE_ENV=production`
- `MONGODB_URI` (MongoDB Atlas)
- `JWT_SECRET` (gere um novo)
- `FRONTEND_URL` (URL do frontend em produção)

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o padrão de código do projeto
- Escreva testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits descritivos

---

## 📝 Roadmap

- [ ] Upload de arquivos (imagens, PDFs)
- [ ] Emojis e GIFs
- [ ] Mensagens de voz
- [ ] Videochamadas
- [ ] Notificações push
- [ ] Dark mode
- [ ] Internacionalização (i18n)
- [ ] App mobile (React Native)
- [ ] Dashboard com analytics
- [ ] Exportar conversas (PDF)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2025 Alberto Luiz dos Santos Peixoto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👨‍💻 Autor

**Alberto Luiz dos Santos Peixoto**
- GitHub: [@alberto2santos](https://github.com/alberto2santos)
- Email: alberto.dos.santos93@gmail.com

---

## 🙏 Agradecimentos

- [Node.js](https://nodejs.org/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Material-UI](https://mui.com/)
- Comunidade Open Source

---

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:

- Abra uma [Issue](https://github.com/alberto2santos/banco-chat-platform/issues)
- Entre em contato: alberto.dos.santos93@gmail.com

---

<div align="center">

### ⭐ Se este projeto foi útil, considere dar uma estrela!

**Feito com ❤️ por Alberto Luiz**

[⬆ Voltar ao topo](#-sistema-de-comunicação-bancária)

</div>
