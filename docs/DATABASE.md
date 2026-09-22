# Banco de Dados

## Empresa

- id
- nome
- plano
- status
- created_at

## Usuario

- id
- empresa_id
- nome
- email
- senha_hash
- role

## Lead

- id
- empresa_id
- telefone
- nome
- veiculo
- etapa

## Conversa

- id
- lead_id
- direction
- mensagem
- timestamp

## Agendamento

- id
- lead_id
- data
- status

## Índices

- empresa_id
- telefone
- created_at
- etapa
