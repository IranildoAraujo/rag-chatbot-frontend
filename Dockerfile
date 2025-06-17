# =================================================================
# STAGE 1: Build - Usando a versão exata do Node.js do projeto
# =================================================================
FROM node:18.19.1-alpine AS build

# Define um argumento de build para a URL da API
ARG VITE_API_BASE_URL

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json* ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código-source do projeto
COPY . .

# Define a variável de ambiente VITE_API_BASE_URL no ambiente do CONTAINER DE BUILD
# Isso garante que o 'npm run build' veja a variável VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Executa o script de build para gerar os arquivos estáticos
RUN npm run build

# =================================================================
# STAGE 2: Serve - Serve os arquivos estáticos com Nginx
# =================================================================
FROM nginx:stable-alpine AS serve

# Copia os arquivos estáticos gerados no estágio de build para o diretório padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expõe a porta 80 (porta padrão do Nginx)
EXPOSE 80

# Comando para iniciar o Nginx quando o container for executado
CMD ["nginx", "-g", "daemon off;"]