FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN npx prisma generate --schema=./src/prisma/schema.prisma
EXPOSE 4000
CMD ["node", "src/index.js"]