---
title: "Hermes Agent Bot Mode: how I split work across three specialist bots"
description: "How I run Hermes Agent Bot Mode with three specialist bots (Blogi, Nuxti, Aspi): what a Bot is, how they message each other, and what still feels unfinished."
image:
  src: /images/hermes-bot-mode.svg
authors:
  - name: Made Y
    to: /
    avatar:
      src: /images/profile2.jpg
date: 2026-08-19
seo:
  keywords: hermes agent bot mode, hermes agent teammates, multi-agent setup, bot-to-bot messaging, hermes profiles
badge:
  label: AI Agents
sitemap:
  lastmod: 2026-08-19
schemaOrg:
  - type: "BlogPosting"
    headline: "Hermes Agent Bot Mode: how I split work across three specialist bots"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-08-19"
---

<div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;margin:1.5rem 0 2rem;">
  <img src="https://res.cloudinary.com/fpfvgqrg/image/upload/v1785599903/logo_w9akfu.png" alt="Hermes Agent" style="height:4rem;width:auto;max-width:40%;object-fit:contain;" />
</div>

I used to keep one Hermes profile for everything: blog drafts, Nuxt pages, ASP.NET APIs. Same memory, same skill dump, same MCP list. The chat got noisy, and the agent kept reaching for the wrong conventions.

[Hermes Agent Bot Mode](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode) is how I split that into named teammates. The docs put it in one line: Bot Mode turns your Hermes profiles into a roster of named Bots. Each Bot is still a profile. It shows up with a role and a face, plus a canonical Bot Chat that stays the relationship instead of forking into a scratch session every time you type `/new`.

I now run **Blogi** for writing, **Nuxti** for Nuxt UI, and **Aspi** for ASP.NET. This is the setup, the messaging flow, and the parts that still annoy me. If you want the earlier single-agent loop (skills, MCP, Flash-0731), that's in my [Hermes + DeepSeek lab note](/blog/ai-agent-workflow-deepseek-hermes).

## What Bot Mode is

A Bot is a Hermes profile. Isolated config, memory, skills, credentials, and chat history live under `~/.hermes/profiles/<name>/`. Bot Mode is a UI over that primitive. Chat with the same agent from the desktop roster or from a shell:

```bash
hermes -p blogi chat
```

Routines on a Bot are ordinary Hermes cron jobs. They show up in `hermes cron list`. Nothing extra is stored, and there's no background daemon that only Bot Mode understands.

On the desktop it appears as a Bots tab next to Sessions. The roster is one row per profile: avatar, latest-message preview, timestamp. Click a Bot and you land in its canonical Bot Chat, created and pinned the moment the Bot exists. Sessions still exist (the context menu filters the last 200 stored conversations on that profile). The difference is the click-to-chat path always returns to the same forever chat.

That forever chat is the part I care about. Typing `/new` or `/reset` inside the canonical Bot Chat would fork the relationship. The composer reroutes those to `/compact` instead: fresh working context, same conversation. Regular sessions on the same profile still get a real `/new`.

You can pin a model per Bot, write a custom `SOUL.md`, and tick skills, toolsets, and MCP servers so a specialist only loads what it needs. Shared keys are the default, so refreshing a token on one Bot doesn't invalidate the others. Older gateways copy credentials instead; that still works, it's just forked.

The words I use come from the [official Bot Mode page](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode): Bot, profile, teammate, roster, Bot Chat, handoff, group chat. "Handoff" here means an `@mention` or a CLI message into another Bot's Bot Chat, not a workflow engine.

Bot Mode ships built into the desktop app and is on by default. No plugin install. Flip it off in Settings → Plugins → Bots if you want the old session list back. Profiles, sessions, and cron jobs stay put either way. Bot Mode never owns the data; it only renders it.

## Why I split the work

I'm a [fullstack .NET and Nuxt developer](/services). Most weeks that's minimal APIs, EF Core, PostgreSQL, Nuxt pages, and the occasional blog post about the same stack. One profile can do all of that. It just does it with a bloated prompt.

Skills in Hermes are `SKILL.md` files. The agent keeps a light index and pulls full rules when a skill is invoked, which helps with token burn. Even so, a profile that holds writing skills, Nuxt UI skills, and ASP.NET skills will grab the wrong house style. Coding turns start sounding like blog intros, and writing turns invent Nuxt prop names.

Splitting by domain is the boring fix. Blogi never sees `aspnetcore-minimal-api`. Aspi never loads `humanizer`. Nuxti can hammer Nuxt UI MCP without also carrying Prima accounting rules.

That's how my week actually splits. If I added a Unity-heavy stretch I might give that its own Bot. I didn't, yet. Aspi already has the Unity MCP listed, which is leftover surface I should probably turn off.

## The bots

<div style="display:flex;align-items:center;justify-content:center;gap:1.5rem;margin:1.5rem 0 2rem;">
  <img src="https://res.cloudinary.com/fpfvgqrg/image/upload/v1787128571/Hermes_2026-08-19_16-33-04_nk7jrp.jpg" alt="Hermes Agent Bot mode" style="height:24rem;width:auto;max-width:40%;object-fit:contain;" />
</div>

Each one is a named profile with a tight skill list and the MCPs that profile actually uses. I created them from the New Agent dialog (name, title, description) and then trimmed capabilities in Edit Profile.

### Blogi

Content writer. That's the profile I use for posts like this.

Skills: `blog-seo-writer`, `humanizer`.

MCPs: Nuxt, GitHub (HTTP), Nuxt UI, X search.

The Nuxt and Nuxt UI MCPs look odd on a writer until you remember the blog is a Nuxt Content site. Blogi needs to know how posts are shaped (YAML frontmatter, `content/blog/<slug>.md`, the same author block as the other entries) without also knowing how I map a minimal API. GitHub is there so it can open a PR when I ask. X search is optional; I rarely need it for a lab note.

I keep Blogi's `SOUL.md` short: first person, no em dashes, no "robust / seamless / showcase", match the existing posts. The humanizer skill is the checklist. The SEO skill is the structure (one primary keyword, meta around 155 characters, keyword in the first 100 words). Neither skill should leak into Aspi's commit messages.

### Nuxti

Nuxt UI engineer. Nuxt 3/4, Nuxt UI 4, Nuxt Content 3, Tailwind.

Skills: `nuxt-development`, `nuxt-ui`, `hermes-agent`, plus the shared software-dev skills I keep on coding profiles (git/PR habits, the usual debugging loop).

MCPs: Nuxt, nuxtui, github-http, mcp-server-git.

This is the bot I want in the repo when the task is a page, a `UButton` variant, or a content collection quirk. Live docs MCP is the same trick I wrote about in the [DeepSeek lab note](/blog/ai-agent-workflow-deepseek-hermes): without it, a cheap model invents prop names; with it, the UI glue stays boring.

Nuxti is allowed to touch `app/` and the Vue files. I still don't want it "fixing" an EF Core migration because it noticed a YAML typo and kept going.

### Aspi

Backend bot. ASP.NET Core Web APIs, EF Core, PostgreSQL.

Skills: `aspnetcore-minimal-api`, `dotnet-ecosystem`, `farmora-backend`, `farmora-accounting`, `commit-changes`, `systematic-debugging`, `requesting-code-review`, `plan`, plus `hermes-agent` and the github-* skills.

MCPs: Nuxt, nuxtui, mcp-server-git, github-http.

The Nuxt MCPs on a backend bot are the messy part. Some weeks Aspi has to read a frontend contract. Most weeks they're noise. Unity is sitting there for a different experiment. I haven't cleaned that list yet, which is a good example of Bot Mode not magically enforcing discipline. You still have to tick the boxes.

Aspi is the profile I'd hand [AuthEndpoints](/projects/authendpoints) work, or a feature slice on a client API. The `aspnetcore-minimal-api` skill is the same house layout I published in the earlier lab note: feature folders, static Map* extension methods, no controller soup. When the task is "announce a release," I don't use Aspi. That's Blogi's job, as in the [AuthEndpoints 3.0 RC post](/blog/authendpoints-3-0-rc).

## How they message each other

Two paths matter for me: `@mention` from a chat I'm already in, and a headless CLI drop into a teammate's Bot Chat.

In any chat, `@aspi have a look at this` makes the active Bot hand the message off, wait for a reply, and report back. Mention names are checked against the live roster, so an email address or an unknown `@` is left alone. If the teammate lives on another registered connection, you use `@name-device` when names collide. I run everything on one machine, so I haven't needed that yet.

Direct messages are the same CLI you'd run yourself. The Bot writes the body to a temp file (so quotes, `$(...)`, and backticks aren't shell-interpreted), then:

```bash
hermes -p nuxti chat --in ~ -c "Bot Chat" --create-if-missing -Q --query-file /tmp/msg.txt
```

The file starts with an attribution prefix like `Message from 🤖 blogi (@blogi):`. The receiving Bot sees it the next time it runs. The messaging protocol is injected into the canonical Bot Chat system prompt at prompt-build time, including when a teammate opens that chat headlessly. Regular sessions and `SOUL.md` stay untouched.

That's a config flag, on by default:

```yaml
agent:
  bot_mode_protocol: true
```

Delivery is per-invocation. If Nuxti is mid-turn, Blogi's message waits. Live interrupt of a Bot that's already talking is listed as future work in the docs. In practice I don't fire a handoff and walk away. I check the other Bot Chat.

Group chats exist too: 2 to 6 Bots, Open chat on a group row, up to three serial rounds, 10 messages per send. `@name` pulls a quiet member in. `@user` pings you, and the group row gets a needs-you badge. Each member keeps its own `Group: <name>` session. I haven't made Blogi, Nuxti, and Aspi a standing room. For a portfolio post, Blogi asking Nuxti "does this frontmatter still parse?" is enough.

Same agents from a shell: `hermes -p blogi chat` opens Blogi's profile, `hermes cron list` shows routines (jobs named `[bot:<name>]`), and `hermes profile list` / `hermes profile create` inspect or add profiles. The files sit in `~/.hermes/profiles/<name>/`.

## What worked and what's still rough

The split helps on the tasks I actually repeat. Blogi stays in `content/blog/` and doesn't "helpfully" rewrite a Vue component. Nuxti can answer Nuxt UI questions with current component metadata. Aspi stays closer to feature-folder APIs. Switching bots is a click (or `-p <name>`), which is less friction than I expected.

What's still rough:

Handoffs are not a pipeline. Per-invocation delivery means I am the scheduler. If I `@mention` Aspi from Blogi and then keep talking to Blogi, I can miss the reply until I open Aspi's Bot Chat.

Capability lists drift. Aspi still has Nuxt and Unity MCPs. Blogi has X search. None of that is Bot Mode's fault. The New Agent dialog makes it easy to clone too much, and I haven't gone back through every checkbox.

Group chats have hard caps for a reason. I don't want three models politely passing in a circle while I wait. For my use, DM and `@mention` are the whole workflow.

I still hop to Cursor or a stronger model when a turn gets gnarly. Bot Mode didn't change that. It changed how much junk sits in the prompt while the cheap loop does mechanical work.

Hidden Bots are display-only. `@mentions` still resolve, routines keep running, unread activity piles up behind an eye toggle. That's easy to forget if you "hide" a Bot you meant to retire. Delete Profile is the actual removal, and the default profile can't be deleted.

## FAQ

### What is Hermes Agent Bot Mode?

A desktop roster over Hermes profiles. Each Bot has a role, model, memory, skills, and avatar. Bots can run routines, sit in group chats, and message each other. The underlying object is still a profile.

### Do I need a separate plugin?

Not on current desktop builds. Bot Mode is bundled and on by default. Settings → Plugins → Bots turns the UI off without deleting profiles.

### How do teammates talk?

`@mention` from a chat, or `hermes -p <name> chat --in ~ -c "Bot Chat" --query-file <file>` into the canonical Bot Chat. The protocol is injected into that Bot Chat only.

### Should I copy this three-bot split?

Only if your week splits that way. One specialist is already a win over a single overloaded profile. Start with the domain that keeps polluting the others.

## Where this sits for me

This is the setup on my machine today: three named Bots, domain-split skills, MCP still a bit messy, handoffs that I watch. Cheap enough to keep. Unfinished on purpose.

If you're already on Hermes, the Bots tab is probably sitting next to Sessions. The docs to read first: [Bot Mode](https://hermes-agent.nousresearch.com/docs/user-guide/bot-mode). The prior experiment, before I split the roster, is the [Hermes Agent + DeepSeek lab note](/blog/ai-agent-workflow-deepseek-hermes).
