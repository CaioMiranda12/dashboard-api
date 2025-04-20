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

```
# 🔐 AUTH

POST    /auth                  # Login (Retorna token JWT)

# 🔐 USERS

GET     /users                 # Busca por todos os usuários
GET     /users/:id             # Buscar usuário por ID
POST    /users                 # Criar novo usuário
PATCH   /users/:id             # Atualizar usuário (requer token)
DELETE  /users/:id             # Deletar usuário (requer token)

# 💰 TRANSACTIONS

GET     /transactions          # Listar todas as transações do usuário (requer token)
POST    /transactions          # Criar nova transação (requer token)
GET     /transactions/:id      # Buscar transação por ID (requer token)
PATCH   /transactions/:id      # Atualizar transação (requer token)
DELETE  /transactions/:id      # Deletar transação (requer token)

# 🌟 CATEGORY

GET     /category          # Listar todas as categorias do usuário (requer token)
POST    /category          # Criar nova categoria (requer token)
PATCH   /category/:id      # Atualizar categoria (requer token)
DELETE  /category/:id      # Deletar categoria (requer token)

# ℹ️ SUMMARY

GET     /summary?month=X&year=Y           # Mostra o resumo das receitas, despesas e saldo do usuário por mês/ano (requer token)
```



