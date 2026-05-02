FROM node:18-alpine

# Create app directory
WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

# Start application
CMD [ "npm", "run", "start-prod" ]
