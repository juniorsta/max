FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN apk add --no-cache openssl1.1-compat
RUN npx prisma generate --schema=./src/prisma/schema.prisma
EXPOSE 4000
CMD ["node", "src/index.js"]