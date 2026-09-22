# Kera - Fase 1
Projeto SaaS multi-tenant para estética automotiva.

## Estrutura
/docker-compose.yml
/backend - Express + Prisma + PostgreSQL
/frontend - Next.js 16
/docs - documentação

## Desenvolvimento
docker compose up -d
backend: http://localhost:4000/health
frontend: http://localhost:3000

## Domínios
app.kera.stazak.com.br
api.kera.stazak.com.br

Configure Apache reverse proxy na Hostinger apontando para os containers expostos.
