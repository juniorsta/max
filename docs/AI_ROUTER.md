# FreeLLMAPI Router

Objetivo:

Selecionar automaticamente o melhor modelo.

## Critérios

- disponibilidade
- latência
- custo
- qualidade

## Estratégia

Resposta simples

→ Gemini Flash

Venda

→ Gemini Pro

Resumo

→ Groq

Fallback

→ OpenRouter

## Cache

Redis.

## Timeout

15 segundos.

## Retry

3 tentativas.
