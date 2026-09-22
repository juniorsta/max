# Arquitetura Oficial

## Fluxo principal

WhatsApp
↓
Evolution API
↓
Express Backend
↓
PostgreSQL
Redis
FreeLLMAPI
↓
Next.js

## Camadas

### Frontend

- Next.js 16
- React
- Tailwind

### Backend

- Express
- Prisma

### Infra

- Docker
- Apache Reverse Proxy
- HTTPS

### Banco

- PostgreSQL
- Redis

## Eventos

Webhook → Backend → IA → Banco → Resposta.
