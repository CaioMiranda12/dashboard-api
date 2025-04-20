# 📊 Dashboard API

API para gerenciamento de usuários com autenticação, utilizando Node.js, Prisma e PostgreSQL via Docker.

---

## 🚀 Como iniciar o projeto

```bash
# Clone o repositório
git clone https://github.com/CaioMiranda12/dashboard-api.git

# Acesse a pasta
cd dashboard-api

# Abra no VSCode (opcional)
code .

# Instale as dependências
npm install

# Suba o container do banco de dados
docker-compose up -d

# Rode as migrations do Prisma
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🧪 Tecnologias utilizadas
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL (via Docker)
- Yup (validações)
- UUID
- Bcrypt
- HTTP Status Codes

## 📚 Rotas da API

### 📦 Usuários
