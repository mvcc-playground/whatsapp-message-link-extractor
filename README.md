# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Ideias (para transformar em tarefas)

- [PRIORIDADE] Conversa com IA simulando um participante do chat: permitir que a pessoa "converse" com a IA como se fosse a outra pessoa da conversa, usando o contexto das mensagens importadas.
- [PRIORIDADE] Perguntas sobre as mensagens com IA: permitir consultas em linguagem natural (ex.: resumo, tópicos, datas, links citados, contradições, sentimento e fatos relevantes).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
bun x sv create --template minimal --types ts --add mcp="ide:other,gemini+setup:remote" --install bun extract-links-whasapp-message
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
