# Multi-stage build

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências
RUN npm ci && npm cache clean --force

# Copia código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Nginx para servir
FROM nginx:alpine

# Copia build do React
COPY --from=builder /app/build /usr/share/nginx/html

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Inicia nginx
CMD ["nginx", "-g", "daemon off;"]