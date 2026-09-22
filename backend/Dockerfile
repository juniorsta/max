FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npx prisma generate --schema=./src/prisma/schema.prisma
EXPOSE 4000
CMD ["node", "src/index.js"]