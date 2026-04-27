# 🚀 GUIA DE INICIALIZAÇÃO NO NOTEBOOK NOVO (APRESENTAÇÃO)

Siga estes passos exatos no notebook do seu amigo para que o projeto rode perfeitamente.

## ⚠️ PASSO 1: O ARQUIVO SECRETO
O arquivo mais importante do projeto é o `.env`. Ele fica oculto na maioria das vezes.
- Certifique-se de que o arquivo `.env` (com as chaves da Aiven, Stripe, etc) foi copiado do seu computador e colocado dentro desta mesma pasta `match-js` no notebook do seu amigo.
- Sem ele, o sistema não conecta no banco de dados e vai ficar dando erro!

## ⚙️ PASSO 2: INSTALAR AS DEPENDÊNCIAS
Abra o terminal no VS Code do seu amigo (garanta que está na pasta `match-js`) e rode o comando:
`npm install`

*(Isso pode demorar um minutinho, vai baixar a pasta node_modules e tudo que o projeto precisa para rodar).*

## 🗃️ PASSO 3: CONECTAR O BANCO DE DADOS (PRISMA)
Ainda no terminal, rode esse comando. Ele é **OBRIGATÓRIO** para que o projeto consiga conectar na nuvem e ler as vagas e os usuários:
`npx prisma generate`

## ▶️ PASSO 4: RODAR O PROJETO
Agora é só iniciar o servidor local:
`npm run dev`

Pronto! Abra o navegador e acesse: **http://localhost:3000**

---

### 👤 CONTAS DE TESTE PRONTAS PARA AVALIAÇÃO DO PROFESSOR:

**Área da Empresa (Com vagas já criadas):**
- Login: `rh@nubank.br`
- Login: `vagas@ifood.br`
- Senha: `123456`

**Área do Candidato (Com currículo e candidaturas prontas):**
- Login: `maria@devjobs.br` (Engenheira de Dados)
- Login: `carlos@devjobs.br` (Dev Mobile)
- Login: `ana@devjobs.br` (Estudante)
- Senha de todos: `123456`

Boa apresentação! Vai dar tudo certo! 🚀
