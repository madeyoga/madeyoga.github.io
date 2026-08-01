---
title: "AuthEndpoints 3.0 RC: a composable auth endpoints library for ASP.NET Core"
description: "Announcing AuthEndpoints 3.0 RC, a developer productivity library for ASP.NET Core. Composable auth endpoints on top of ASP.NET Core Identity: registration, login, 2FA, password reset, and passkeys bootstrapped in minutes."
image:
  src: /images/authendpoints-3-0-rc.png
authors:
  - name: Made Y
    to: /
    avatar:
      src: /images/profile2.jpg
date: 2026-08-01
seo:
  keywords: AuthEndpoints, ASP.NET Core authentication, .NET 10, passkeys, WebAuthn, JWT, ASP.NET Core Identity, NuGet, developer productivity
badge:
  label: Open Source
sitemap:
  lastmod: 2026-08-01
schemaOrg:
  - type: "BlogPosting"
    headline: "AuthEndpoints 3.0 RC: a composable auth endpoints library for ASP.NET Core"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-08-01"
---

Today I'm releasing AuthEndpoints 3.0 RC: a developer productivity library for ASP.NET Core that turns auth setup from a project phase into a setup step.

If you build ASP.NET Core backends or web apis, you may have written this before. Register, login, email confirmation, password reset, 2FA, session management. Same code in every project, different user model each time. AuthEndpoints packages that work into a library on top of ASP.NET Core Identity, so a secure auth layer takes minutes to stand up instead of a week of copy-paste.

## Why it's good for developer productivity

Two design decisions drive most of the value.

### Opinionated options.

Auth comes with a lot of decisions, and most of them have one right answer for a SPA served by a single API. AuthEndpoints bakes those in: rate limiting, antiforgery, lockout-aware login, and hashed refresh tokens with reuse detection are on by default. The hardened path is the default path, so you don't have to know the pitfalls to avoid them.

### Composable endpoints.

AuthEndpoints is organized as endpoints and modules you can compose manually. Need email/password with JWT? Cookie sessions with passkeys? 2FA on top of that? You pick the pieces, and the routes and validation stay consistent across the whole setup.

## The quick start

Three extension methods and a few lines:

```cs
builder.Services.AddDbContext<AppDbContext>(/* your provider */);

builder.Services.AddAuthEndpoints<AppUser, AppDbContext>(o =>
{
    o.Passkeys.ServerDomain = "example.com"; // required in Production
});

builder.Services.AddTransient<IEmailSender<AppUser>, MyEmailSender>();

var app = builder.Build();

app.UseAuthEndpoints();
app.MapAuthEndpoints<AppUser>();

app.Run();
```

That maps the whole account lifecycle: register, confirm email, forgot and reset password, manage info and 2FA, plus step-up re-authentication for sensitive actions. You bring the DbContext and an email sender. The library handles the rest, including your choice of cookie sessions, Identity bearer tokens, or Simple JWT, and passkeys (WebAuthn) for passwordless sign-in.

## What's in 3.0

- **Sign-in stacks you pick**: cookie sessions, Identity bearer tokens, or Simple JWT. The endpoints stay the same; the token strategy is configuration.
- **Passkeys (WebAuthn)** for passwordless register and login, working alongside email/password rather than replacing it.
- **Hardening on by default**: rate limiting, antiforgery, lockout-aware login, and hashed JWT refresh tokens with reuse detection.
- **GitHub and Google OAuth** through an optional separate package, `AuthEndpoints.External.OAuth`.

## Help shape the final API

3.0 is a rewrite, and the API isn't frozen yet. An RC is the last moment to change things cheaply; once 3.0 ships stable, breaking changes cost everyone who adopted it. 
So if you try it and something feels awkward, breaks, or is missing, please open an issue and say so. Your feedback decides what the API looks like when it ships.

## Try it

```bash
dotnet add package AuthEndpoints --version 3.0.0-rc.3
```

- **Demo app**: [madeyoga/AuthEndpointsDemo](https://github.com/madeyoga/AuthEndpointsDemo), an ASP.NET Core API plus a Nuxt 4 / Nuxt UI playground, so you can click through the flows without writing a frontend first.
- **Docs**: [madeyoga.github.io/AuthEndpoints](https://madeyoga.github.io/AuthEndpoints/) with configuration, composable modules, route tables, and production guidance.
- **Repository**: [AuthEndpoints](https://github.com/madeyoga/AuthEndpoints)
- **Feedback**: open an issue on [madeyoga/AuthEndpoints](https://github.com/madeyoga/AuthEndpoints/issues). No template required, but say which stack you used (cookies, JWT, passkeys) and what you were trying to do.

The library is MIT licensed and free.
