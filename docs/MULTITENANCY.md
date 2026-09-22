# Multi-Tenant

Cada empresa possui:

- usuários próprios
- WhatsApp próprio
- banco lógico separado
- leads próprios

## Identificação

Todo request deve conter tenant.

Fluxo:

Webhook
↓
Instance
↓
Tenant
↓
Banco

Nunca permitir acesso cruzado.
