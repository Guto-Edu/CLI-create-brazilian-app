# create-brazilian-app

CLI para criar projetos Next.js com o [Next.js Brazilian Starter](https://github.com/Guto-Edu/Next.js_Brazilian_Starter) já configurado.

[![npm version](https://img.shields.io/npm/v/create-brazilian-app?style=flat-square&color=4f7ef8)](https://npmjs.com/package/create-brazilian-app)
[![License](https://img.shields.io/github/license/Guto-Edu/create-brazilian-app?style=flat-square)](LICENSE)

## Uso

```bash
npx create-brazilian-app meu-projeto
```

Ou sem passar o nome (o CLI pergunta):

```bash
npx create-brazilian-app
```

## O que o CLI faz

1. Clona o [Next.js Brazilian Starter](https://github.com/Guto-Edu/Next.js_Brazilian_Starter)
2. Configura o `package.json` com o nome do seu projeto
3. Cria o `.env.local` baseado no `.env.example`
4. Configura os helpers de banco de dados escolhido
5. Faz `git init` com commit inicial limpo
6. Instala as dependências com o gerenciador escolhido

## O que vem no starter

- **Next.js 16** com App Router
- **React 19** + **TypeScript**
- **Tailwind CSS 4** + **shadcn/ui**
- **TanStack Query** para server state
- **React Hook Form** + **Zod** para formulários
- **Sonner** para notificações toast
- **next-themes** para modo claro/escuro
- **Formatters brasileiros**: CPF, CNPJ, telefone, CEP, moeda, datas...
- **Máscaras de input** para formulários BR
- **Route groups** separando área pública, auth e dashboard
- Estrutura preparada para **Supabase** ou banco local

## Desenvolvimento local

```bash
# Clone este repositório
git clone https://github.com/Guto-Edu/create-brazilian-app.git
cd create-brazilian-app

# Instale as dependências
npm install

# Build
npm run build

# Teste localmente
node dist/index.js meu-teste
```

## Publicando no npm

```bash
npm run build
npm publish
```

## Licença

MIT © [Guto-Edu](https://github.com/Guto-Edu)
