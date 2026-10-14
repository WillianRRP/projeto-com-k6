# 🐊 Testes de Carga com K6

Projeto simples com 4 scripts de teste usando [K6](https://k6.io/) para praticar consultas em APIs, cadastro e login de usuários.

---

## 📁 Arquivos

| Arquivo | O que faz |
|---------|-----------|
| `consulta-crocodilos.js` | Consulta crocodilos aleatórios na API `test-api.k6.io` |
| `consulta-crocodilos-ID.js` | Dois cenários (listar + buscar) com relatório HTML |
| `realizar-cadastro.js` | Cadastra usuários na API `serverest.dev` |
| `realizar-login.js` | Faz login usando uma massa de e-mails do CSV |
| `dados.json` | Lista de crocodilos (ids) |
| `usuarios.csv` | Lista de e-mails e senhas |

---

## ▶️ Como rodar

Instale o K6 e execute:

```bash
k6 run consulta-crocodilos.js
k6 run realizar-cadastro.js
k6 run realizar-login.js

# Este precisa da variável URL:
k6 run consulta-crocodilos-ID.js -e URL=https://test-api.k6.io/public
```

---

## ⚙️ O que cada script faz

**consulta-crocodilos.js**
- 10 VUs subindo, mantendo e descendo (10s cada etapa).
- Pega um id aleatório do `dados.json` e faz `GET` no crocodilo.
- Valida status 200 e tempo de resposta abaixo de 200ms.

**consulta-crocodilos-ID.js**
- Roda 2 cenários ao mesmo tempo: `listar` (200 req/s por 30s) e `buscar` (50 VUs x 20 iterações).
- Gera um `summary.html` no final.

**realizar-cadastro.js**
- Sobe até 10 VUs em 10s.
- Gera e-mail aleatório e cadastra em `serverest.dev/usuarios`.
- Valida status 201.

**realizar-login.js**
- Sobe em estágios até 50 VUs.
- Sorteia um e-mail do `usuarios.csv` e faz login.
- Valida status 200 e presença do token.

---

## 📊 Validações (thresholds)

Os testes checam coisas como:

- **Taxa de sucesso dos checks** (ex: > 95%)
- **Taxa de falha das requisições** (ex: < 1%)
- **Tempo de resposta** (ex: p95 < 500ms)

Se algum critério falhar, o K6 retorna erro — ótimo para usar em CI.

---

## 📄 Relatório HTML

Só o `consulta-crocodilos-ID.js` gera relatório. Depois de rodar, abre o `summary.html` no navegador.

---

## 📝 Dicas

- Os arquivos `dados.json` e `usuarios.csv` devem ficar na **mesma pasta** dos scripts.
- Os usuários do `usuarios.csv` precisam existir na API antes do login — cadastre-os primeiro ou rode o `realizar-cadastro.js`.
- As APIs usadas são públicas e para estudo.
