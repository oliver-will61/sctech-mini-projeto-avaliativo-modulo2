# Imagem de desenvolvimento da API
# O código-fonte é montado como volume pelo docker-compose.yml, com hot reload via ts-node-dev

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000
# --poll garante o hot reload em volumes montados no Windows/macOS
CMD ["npx", "ts-node-dev", "--respawn", "--poll", "src/server.ts"]
