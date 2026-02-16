# Multi-stage build para otimizar tamanho da imagem

# Stage 1: Build
FROM node:18-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências (incluindo devDependencies para build)
RUN npm ci --only=production && \
    npm cache clean --force

# Copia código fonte
COPY . .

# Stage 2: Production
FROM node:18-alpine

# Metadados
LABEL maintainer="ti@banco.com"
LABEL description="API de Comunicação Bancária - Backend"
LABEL version="1.0.0"

# Cria usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Define diretório de trabalho
WORKDIR /app

# Copia node_modules do stage anterior
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copia código fonte
COPY --chown=nodejs:nodejs . .

# Muda para usuário não-root
USER nodejs

# Expõe porta
EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando de inicialização
CMD ["node", "server.js"]