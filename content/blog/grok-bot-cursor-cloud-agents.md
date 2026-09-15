---
title: "Remote AI coding from any device with Grok Bot and Cursor cloud agents"
description: "How I moved from babysitting local Cursor agents to Grok Bot plus Cursor cloud agents, then closed the trust gap with pstack verification: proof screenshots, command output, and video from the cloud agent's computer."
image:
  src: /images/grok-bot-cursor-cloud-agents-cover.png
  alt: "Multi-device remote coding connected to cloud agents with a verification proof card"
authors:
  - name: Made Y
    to: /
    avatar:
      src: /images/profile2.jpg
date: 2026-09-15
seo:
  keywords: Grok Bot, Cursor cloud agents, remote AI coding, multi-device agent workflow, pstack, poteto-mode, create-verification-skill, GitHub issue automation, verification skill, walk-away coding
badge:
  label: AI Agents
sitemap:
  lastmod: 2026-09-15
schemaOrg:
  - type: "BlogPosting"
    headline: "Remote AI coding from any device with Grok Bot and Cursor cloud agents"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-09-15"
---

I used to treat the laptop as the only place coding agents could run. Open Cursor. Start a local agent. Stay near the machine until the run finished.

That is no longer how walk-away work starts. **Grok Bot** is the front door. **Cursor cloud agents** implement on the repo. Scheduled GitHub checks surface issues while I am away. **pstack** is how I decide whether to trust the result without opening the IDE.

This is a lab note on that arc. It is not a product pitch. Earlier notes covered [Hermes Bot Mode](/blog/hermes-bot-mode) and [Hermes + DeepSeek](/blog/ai-agent-workflow-deepseek-hermes). For pstack verification I follow Lauren Tan's guide, [The Complete Guide to pstack Pt. 1: Verification is all you need](https://x.com/poteto/status/2094457600259842065).

## Before: local Cursor agents on the laptop

I worked as a backend engineer on a shared product repo with a frontend teammate. Most agent time was **Cursor agents in the local IDE**: ASP.NET-style backend work, same machine, same desk.

That loop works when you are already sitting there. It failed as soon as the day left the desk.

What broke in practice:

- Bad or flaky internet killed the local agent mid-tool-call. The chat stalled. 
- It felt like micromanaging the agent. I stayed next to the PC to unblock prompts and approve steps.
- The PC had to stay on and unlocked. 
- The agent was tied to that open workspace. Another device could not continue the same local run.

I was not avoiding agents. I was babysitting a local loop that only worked while I stayed in the chair.

## How Grok Bot and Cursor cloud agents fixed the ops problem

The operational fix is a split.

**Grok Bot** takes the ask from any device I can reach: Windows PC, MacBook, or Android. It can start or steer **Cursor cloud agents** on a repository. Cloud agents run on Cursor's infrastructure. They do not need my desktop left unlocked.

**Before:** local Cursor agent on my laptop. My presence was part of the runtime.

**After:** Grok Bot is the control plane. Cloud agents implement. The laptop is optional for walk-away work.

That covers AFK team chat too. If a task lands in a team channel or chat and I am not at the PC, I can tell Grok Bot from the phone to spawn a Cursor cloud agent on the repo. No turning the PC on. No opening an IDE.

Grok Bot also runs on a schedule against active GitHub repos. The useful shape is a weekday digest and issue watch, not a firehose of every notification.

What I want from that loop:

- Issues filed on shared work, including issues from a frontend teammate or partner on shared repos
- Issues assigned to me or marked blocking
- Open PRs that need a review or a rebase
- CI that failed on a branch I care about
- A short summary I can act on

Typical outcome: a frontend teammate files an issue on a shared repo. The digest surfaces it. I read it on Android, decide it is cloud-agent work, kick a Cursor cloud agent from Grok Bot, and come back later for the PR. Intake does not need the laptop.

Exact cron times and repo lists change. The design does not. Cloud agents implement when I say so. They do not auto-merge my release branches.

This solved the babysitting problem. It did not answer the trust problem.

## The trust gap that was still open

Once cloud agents could build while I was away, a different question showed up.

How do I trust the work?

Do I still pull the branch locally, open the IDE, and run the app myself? What if the cloud agent broke something that CI did not catch? A green check and a confident summary are not the same as proof that the feature works for a user.

Ops was fixed. Trust was not. Reading every line of every agent diff does not scale, and "it compiles" is not enough.

## pstack is the answer: verification, not vibes

<div style="display:flex;align-items:center;justify-content:center;margin:1.5rem 0 0.5rem;">
  <img src="/images/pstack-pt1-guide-cover.jpg" alt="Cover art from poteto's Complete Guide to pstack Pt. 1: workshop with agents verifying a build" style="width:100%;max-width:48rem;height:auto;border-radius:0.5rem;" />
</div>

<p style="text-align:center;font-size:0.875rem;opacity:0.8;margin:0 0 1.5rem;"><em>Cover art from <a href="https://x.com/poteto/status/2094457600259842065">poteto's Complete Guide to pstack Pt. 1</a>.</em></p>

I follow poteto's pstack guide for this part: [Verification is all you need](https://x.com/poteto/status/2094457600259842065). The guide's claim is specific. A high-quality **verification skill** lets an agent prove its own work and close the loop without you as the bottleneck. poteto's own shipping volume is poteto's story in that post. What I took from it is the method.

### First step: install pstack, then `/create-verification-skill`

Install pstack. Run `/create-verification-skill` on the project.

That generates a project-local verification skill (under `.cursor/skills/verify-<app>/`) that can:

- Launch the real app
- Health-check the instance (`doctor`)
- Drive features the way a user would
- Capture evidence
- Clean up without deleting the proof
- Seed a **Feature Map**: markdown that lists user-facing features, how to reach them, how to drive them, and what observable end state proves they work

The skill is for the next agent, not a human tutorial. It has to work cold, mid-task.

### Build the Lever

pstack's **Build the Lever** principle applies here. Prefer a small CLI that scripts interaction and debugging over throwaway scripts the agent rewrites every run. Agents spend fewer tokens. The check is reproducible. A reviewer can rerun the same command.

### Keep the map sharp

`/maintain-verification-skill` is the upkeep loop. It re-reads the feature map against source, drives features live, and ships at most one PR of proven corrections when the map drifts. poteto recommends running it often enough that agents do not navigate a stale app. I treat that as optional cadence, not a vanity metric.

### Cloud agents have a real computer

This is why the ops fix and the trust fix fit together.

Cursor cloud agents run on a real computer. They can install dependencies, run the app, take screenshots and video, and interact like a user. That matches poteto's cloud-agent section in the same guide. Local babysitting is optional for verification too, once the verification skill and cloud environment exist.

In Grok Bot, the pattern I echo from that guide is coordinator, not do-it-all chat: tell Grok Bot to spawn a cloud agent, run `/poteto-mode` to build, and use the project verification skill to verify with video and screenshots as proof. Grok Bot stays free for other work. The cloud agent has its own machine.

## Trust redefined: proof artifacts, not local re-runs

Trust, for me, is no longer "I opened the IDE and clicked through it myself."

Trust is: `/poteto-mode` builds the change, and the cloud agent returns **proof** from its computer before I merge.

Proof means concrete artifacts:

- Screenshots of the real user path
- Command or harness output from the verification CLI
- Video of the cloud agent driving the app

I review those artifacts from Grok Bot or the PR. I do **not** need to open a local agent, open the IDE, or run the project locally just to smoke-test the change.

If verification fails, or there is no proof, I do not trust the merge. CI still matters. Proof sits on top of CI, not instead of it. Secrets, production deploys, and coordinated disclosure stay human-gated.

## What I would tell another freelancer

1. If local Cursor agents only work while you babysit the PC, separate intake from implementation.
2. Use Grok Bot as the front door. Spawn Cursor cloud agents for repository work.
3. Add one scheduled GitHub issue digest. Include teammate-filed issues on shared repos.
4. Practice one AFK path: task in team chat → phone → Grok Bot → cloud agent, with the PC off.
5. Install pstack. Run `/create-verification-skill`. Treat verification as infrastructure.
6. Prefer a small verification CLI (Build the Lever) over throwaway scripts.
7. Redefine trust as proof from the cloud agent's computer: screenshots, command output, or video. No proof, no merge.

I am still tuning which work stays local. The arc is stable. Grok Bot takes the ask and the digest. Cloud agents build on a real computer. pstack verification supplies the proof. I merge when the proof is there.
