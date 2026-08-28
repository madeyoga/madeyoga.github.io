# My Developer Portfolio

This is my personal portfolio website, built using [Nuxt 4](https://nuxt.com/). The public site is GitHub Pages; a Cloudflare Workers deploy exists as a duplicate and is noindex.

The site showcases techstack, selected projects, work experience, and contact information.

🔗 **Live site:** [https://madeyoga.github.io](https://madeyoga.github.io)

Feel free to fork and customize.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

### Production

Generate the static site:

```bash
pnpm generate
```

CI deploys on every push to `main`:

- GitHub Pages (public / indexable)
- Cloudflare Workers at `webporto.m26416083.workers.dev` (noindex duplicate)

Add a GitHub Actions secret named `CLOUDFLARE_API_TOKEN` with **Edit Cloudflare Workers** permission to keep the Workers copy in sync.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
