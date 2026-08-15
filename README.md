# 💼 My Developer Portfolio

This is my personal portfolio website, built using [Nuxt 4](https://nuxt.com/) and deployed on Cloudflare Workers.

The site showcases techstack, selected projects, work experience, and contact information.

🔗 **Live site:** [https://webporto.m26416083.workers.dev](https://webporto.m26416083.workers.dev)

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

Generate the static site and deploy to Cloudflare Workers:

```bash
pnpm deploy
```

CI deploys on every push to `main`. Add a GitHub Actions secret named `CLOUDFLARE_API_TOKEN` with **Edit Cloudflare Workers** permission.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.
