---
title: "Experimenting with Hermes Agent + DeepSeek-V4-Flash-0731 for ASP.NET Core and Nuxt"
description: Lab notes on running Hermes Agent with DeepSeek-V4-Flash-0731 beta, teaching .NET and Nuxt via skills, wiring Nuxt and Nuxt UI MCPs, and what still feels rough.
image:
  src: https://res.cloudinary.com/fpfvgqrg/image/upload/v1785599903/logo_w9akfu.png
authors:
  - name: Made Y
    to: /
    avatar:
      src: /images/profile2.jpg
date: 2026-08-01
seo:
  keywords: Hermes agent, DeepSeek-V4-Flash-0731, deepseek-v4-flash, AI coding agent, .NET, Nuxt, Nuxt UI, MCP server, skills
badge:
  label: AI Agents
sitemap:
  lastmod: 2026-08-01
schemaOrg:
  - type: "BlogPosting"
    headline: "Experimenting with Hermes Agent + DeepSeek-V4-Flash-0731 for ASP.NET Core and Nuxt"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-08-01"
---

<div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;margin:1.5rem 0 2rem;">
  <img src="https://res.cloudinary.com/fpfvgqrg/image/upload/v1785599903/logo_w9akfu.png" alt="Hermes Agent" style="height:4rem;width:auto;max-width:40%;object-fit:contain;" />
  +
  <img src="https://res.cloudinary.com/fpfvgqrg/image/upload/v1785599605/Uk1zNOj4_400x400_xbxycj.jpg" alt="DeepSeek" style="height:4rem;width:auto;max-width:40%;object-fit:contain;" />
</div>


I've been running **Hermes Agent** against **DeepSeek-V4-Flash-0731** (API id `deepseek-v4-flash`) as a cheap loop for ASP.NET Core and Nuxt work. This is a lab note, not a recommendation to abandon whatever you already use.

My frontend teammates lean on Next.js and Claude Code. Fair, that stack pays for itself when the hard part is UI reasoning. Most of my days look different: minimal APIs, EF Core migrations, PostgreSQL, Nuxt pages, tests. Volume and consistency more than deep creative architecture. I've bounced between Codex CLI, and Cursor. Hermes + Flash-0731 is the combination I'm stress-testing right now because the agent loop is cheap enough that I don't flinch at long sessions, and when it stalls, I still hop to a stronger model for a turn.

Flash-0731 is DeepSeek's public-beta Flash checkpoint (re-post-trained for agent work). I'm on it because that's the beta I'm curious about, not because I've crowned a winner.

## Cost note (why I'm willing to experiment)

Per DeepSeek's API pricing as of this write-up, `deepseek-v4-flash` is about **$0.14 / $0.28** per 1M input/output tokens (cache hits much lower). In practice my Hermes days land roughly in the **pocket-change** range, far below a Max-style subscription or a heavy Opus API day.

I'm also watching DeepSeek's own agent-harness claims for Flash-0731. On their chart it lands **ahead of GLM-5.2** and **close to Claude Opus 4.8** on several agent-style benches, vendor-reported numbers, not my independent re-run, but enough signal that a cheap Flash tier is worth poking for coding-agent work:

![DeepSeek-V4-Flash-0731 benchmark chart vs GLM-5.2, Claude Opus 4.8, and other models (DeepSeek harness)](https://res.cloudinary.com/fpfvgqrg/image/upload/v1785599423/deepseek-v4-flash-0731-benchmark_fddxju.webp)

I'm not going to spreadsheet Claude vs Flash here. The interesting part for me is: can a cheap agent, taught my stack, do enough mechanical .NET and Nuxt work that the experiment is worth keeping?

So far: often yes for scaffolding and docs-aware UI. Still fuzzy on gnarly LINQ and auth-sensitive paths.

## Setup I'm running

### Install Hermes

Official docs: [Hermes Agent Installation](https://hermes-agent.nousresearch.com/docs/getting-started/installation)

### Point it at Flash-0731

```bash
hermes model
```

Select / configure the DeepSeek provider and use model id **`deepseek-v4-flash`** (serves the V4-Flash-0731 checkpoint on the API).

## Teaching Hermes the stack: skills + MCP

Out of the box, the model doesn't know my folder layout, Nuxt UI v4 quirks, or how I want commits and PRs written. Two layers fix that:

- **Skills**: project conventions (APIs, git/PR style)
- **MCP**: live docs and tools (Nuxt/Nuxt UI docs, git + GitHub actions)

### Skills for .NET

Skills are structured `SKILL.md` files (open skill format). Hermes keeps a light index and only pulls full rules when a skill is invoked, which helps with token burn.

I start with [dotnet/skills](https://github.com/dotnet/skills), then teach project-specific patterns with `/learn`.

```
> /learn the project structure and architectural patterns in ./src/backend/MyProject.Api, focus on feature slices and request pipeline
```

Example of the kind of skill Hermes distills (trimmed):

````markdown
---
name: aspnetcore-minimal-api
description: Build ASP.NET Core Web APIs with feature-folder modules.
version: 0.1.0
author: Hermes
metadata:
  hermes:
    tags: [AspNetCore, MinimalApi, EfCore, PostgreSQL, ProjectTemplate]
---

### Feature Module Layout

Each module has three subfolders under a namespace folder:

```
<Module>/
  Apis/<Feature>Api.cs
  Models/<Entity>.cs
  Services/<Feature>Service.cs
```

**Minimal API pattern** — static class + extension method on `IEndpointRouteBuilder`:

```csharp
public static class SomeFeatureApi
{
    public static IEndpointConventionBuilder MapSomeFeatureApi(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/someFeature").WithTags("SomeFeature");

        group.MapGet("/{id}", GetItem)
            .WithName("GetItem")
            .RequireAuthorization("SomeFeature.View");

        return group;
    }

    private static async Task<Results<Ok<ItemResponse>, NotFound>> GetItem(
        long id, AppDbContext db) { /* ... */ }
}
```
````

After that, prompts like "add a feature slice for invoices" land closer to the house style instead of generic controller soup.

### Skills for git / PRs

I want the agent to ship the boring git loop without inventing commit noise. A git skill covers house rules: short why-focused commit messages, `Co-authored-by` lines when Hermes wrote most of the diff, PR title/body shape (summary + test plan), no force-push to main, don't commit secrets.

That way "commit this and open a PR" produces something I'd actually submit, not a wall of AI filler.

### Nuxt + Nuxt UI MCPs (live docs)

Skills teach *my* conventions. MCP teaches *current* framework docs. Hermes needs `--url`, `--command`, or `--preset` on `mcp add` ([docs](https://hermes-agent.nousresearch.com/docs/guides/use-mcp-with-hermes)). For the hosted Nuxt docs servers:

```bash
hermes mcp add nuxt --url "https://nuxt.com/mcp"
hermes mcp add nuxtui --url "https://ui.nuxt.com/mcp"
```

Then `hermes mcp test nuxt` / `hermes mcp test nuxtui` (or `/reload-mcp` in a session).

With those connected, asking "how do I use `UBadge` with an icon in Nuxt UI v4?" can pull real component metadata instead of a confident wrong API. Same for Nuxt routing, content, and module docs.

Day-to-day difference I've noticed: without MCP, Flash will happily invent prop names. With MCP, the UI glue is boring in a good way, which is what I want from a cheap agent.

### Git + GitHub MCPs (stage → commit → push → PR)

Docs MCP is only half the loop. I also connect git and GitHub MCPs so Hermes can actually move the work. Local git via `uvx`, GitHub via the official stdio server (set `GITHUB_PERSONAL_ACCESS_TOKEN` in the server env / Hermes config):

```bash
hermes mcp add git --command uvx --args mcp-server-git --repository /absolute/path/to/repo
hermes mcp add github --command npx --args -y @modelcontextprotocol/server-github
```

With those plus the git skill, a typical close-out looks like: stage the right files → commit with a sane message (and co-author trailer when appropriate) → push the branch → open a PR with a usable description. I'm still babysitting auth and anything destructive, but the mechanical GitHub dance is what I'm trying to automate.


## What's next in the experiment

Working well enough to keep: Hermes + `deepseek-v4-flash`, dotnet + Nuxt + git skills, Nuxt/Nuxt UI MCP for component truth, git/GitHub MCP for the commit→PR path.

Still fuzzy: how far I can push Flash-0731 before I should route hard turns automatically; how much skill surface area is worth maintaining by hand vs regenerating with `/learn`; how much of the GitHub loop I trust without a human glance.

If the beta shifts or Pro's official drop lands, I'll note what changes. For now this is the setup on my machine, cheap, opinionated, and unfinished on purpose.
