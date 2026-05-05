FROM node:18-alpine

# 1. Instal pnpm secara global
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

COPY . .

EXPOSE 3000

# Start application menggunakan pnpm
CMD [ "pnpm", "start-prod" ]