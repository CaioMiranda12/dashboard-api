# Usa imagem oficial do Node
FROM node:18

# Cria diretório da app
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do projeto
COPY . .

# Garante que Prisma gere os clientes
RUN npx prisma generate

# Porta exposta (ajuste se necessário)
EXPOSE 3000

# Comando para rodar o projeto
CMD ["npm", "run", "dev"]
