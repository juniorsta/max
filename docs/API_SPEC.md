# API

Base:

/api/v1

## Empresas

POST /companies

GET /companies

GET /companies/:id

PATCH /companies/:id

DELETE /companies/:id

## Leads

GET /leads

POST /leads

PATCH /leads/:id

## Conversas

GET /conversations/:leadId

POST /webhooks/whatsapp

Headers

x-webhook-secret
