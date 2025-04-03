# Usa uma imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package.json package-lock.json ./
RUN npm install

# Copia o restante dos arquivos para dentro do container
COPY . .

# Define a porta que o container vai expor
EXPOSE 80

# Comando para rodar a aplicação
CMD ["node", "--experimental-json-modules", "server.js"]

HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD wget --spider -q http://localhost:80 || exit 1