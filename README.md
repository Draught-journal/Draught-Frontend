# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Static production deployment

The frontend uses `@sveltejs/adapter-static` with strict checking and no SPA
fallback. All routes inherit `prerender = true` from the root layout:

- `/`
- `/accessibility`
- `/article/[slug]`, with entries generated from every article in the CMS site response

Run `pnpm build` with `KIRBY_BASE_URL` and `KIRBY_API_TOKEN` configured and the CMS
reachable. CMS request failures stop the build instead of publishing fallback
content. Article entries also reject missing or invalid slugs.

Deploy only the `build/` directory to a static host. Configure the host to serve
`/accessibility.html` for `/accessibility` and `/article/<slug>.html` for
`/article/<slug>`, and return 404 for unknown paths. Rebuild when CMS content changes.

SvelteKit rendering remains enabled to generate complete HTML at build time.
The `+*.server.ts` loaders and server hook run during prerendering; the deployed
frontend has no request-time rendering server. `.svelte-kit/output/server` is an
intermediate build directory, not the deployment output. Browser JavaScript still
hydrates the pages for interactions. The separate Kirby PHP CMS remains a server
application.
