FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

# Create app directory
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

EXPOSE 3000

# Start application
CMD [ "npm", "run", "start-prod" ]