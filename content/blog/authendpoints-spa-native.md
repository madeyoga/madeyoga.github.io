---
title: "ASP.NET Core auth for SPAs and native clients without the Identity boilerplate"
description: "Identity works. SPA and native auth still meant rewriting endpoints each time. AuthEndpoints is the Identity facade I built for that."
image:
  src: /images/authendpoints-spa-native.svg
  alt: "ASP.NET Core Identity auth endpoints for SPA and native clients"
authors:
  - name: Made Y
    to: /
    avatar:
      src: /images/profile2.jpg
date: 2026-09-18
seo:
  keywords: ASP.NET Core Identity, AuthEndpoints, SPA authentication, Nuxt auth, React auth, JWT, cookie auth, passkeys, MapIdentityApi, .NET 10
badge:
  label: ASP.NET
sitemap:
  lastmod: 2026-09-18
schemaOrg:
  - type: "BlogPosting"
    headline: "ASP.NET Core auth for SPAs and native clients without the Identity boilerplate"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-09-18"
---

I came into .NET as a Django developer. Relatively new to the stack. I started around .NET 5, when top-level statements landed in C# 9. .NET 6 brought minimal APIs soon after. That modern C# / ASP.NET Core direction clicked for me. I have been a fan since.

ASP.NET Core still felt incomplete in places. Auth was the loudest gap. Django ships batteries-included auth. You get register, login, password reset, and session handling without standing up a second product. On ASP.NET Core I had Identity for membership, but the HTTP surface for a first-party web API plus SPA or native clients was thin. `MapIdentityApi` (from .NET 8) covers a password-oriented slice now. You still wire a lot yourself for passkeys, step-up, and a shared SPA plus native shape.

AI coding was not a real option then. I googled articles and docs. Search results kept pointing at IdentityServer, Duende, OpenIddict, and OpenID Connect. Coming from that batteries-included expectation, that stack felt like a lot. I was still new to .NET. I needed register, login, and password reset for a web API and SPA. That material was hard to map onto a simple API plus SPA.

So I filled the gap myself. I kept a reusable set of auth endpoints so every new ASP.NET Core Web API did not start from an empty controller folder. That library became [AuthEndpoints](https://github.com/madeyoga/AuthEndpoints).

## AuthEndpoints as the Identity facade

AuthEndpoints is a NuGet package of ready-made Identity auth endpoints for web and mobile clients. It does not replace ASP.NET Core Identity. Identity still owns membership, lockout, password hashing, and the user store. AuthEndpoints is a composable facade on top of that.

Install:

```bash
dotnet add package AuthEndpoints
```

Requires .NET 10, ASP.NET Core Identity, and EF Core.

Cookie facade (default):

```cs
builder.Services.AddAuthEndpoints<AppUser, AppDbContext>(o =>
{
    o.Passkeys.ServerDomain = "example.com"; // required in Production
});

builder.Services.AddTransient<IEmailSender<AppUser>, MyEmailSender>();

var app = builder.Build();

app.UseAuthEndpoints();
app.MapAuthEndpoints<AppUser>();
```

`AddAuthEndpoints` / `UseAuthEndpoints` / `MapAuthEndpoints` map cookie Identity plus passkeys with secure defaults. Rate limiting, antiforgery for cookie flows, and lockout-aware login come with that path.

Sign-in stacks you choose:

- **Cookie (default).** First-party browser apps. Password login sets the Identity application cookie. Clients send credentials and a CSRF token on unsafe cookie requests.
- **Identity bearer.** Pass `AuthEndpointsSignIn.IdentityBearer` into `AddAuthEndpoints`. Same Program.cs shape. Login returns access and refresh tokens for native / mobile clients.
- **Simple JWT.** When you want JWT access tokens from the library's JWT module instead of Identity bearer.

If the facade is too opinionated, compose modules yourself. The point is you do not rewrite the same register / login / manage surface on every API.

### Core flows

Product outcomes the facade maps for a first-party SPA or native client:

- register and confirm email
- login and logout (cookie or token, depending on the sign-in stack)
- forgot / reset password
- manage account info and 2FA
- passkeys (WebAuthn) for passwordless register and login, plus credential management
- ReAuth for step-up confirmation before sensitive manage actions

Same Identity user store. Same account lifecycle. AuthEndpoints ships the HTTP surface so you are not inventing route names and payloads per project.

### Why SPA and native clients share one API

Browser clients keep cookies and CSRF. Token clients keep bearer or JWT. Account routes stay in one shape, so Nuxt / Vue / React and a mobile app can hit the same backend without two auth stacks.

Passkeys sit on that host. You do not bolt WebAuthn onto a one-off password API later.

ReAuth covers step-up. Change email, change password, or other sensitive manage work can require a fresh confirmation without inventing a second auth protocol.

I still write email senders, pick passkey domains, and choose cookie vs bearer per client. Identity stays the membership system. AuthEndpoints is the endpoints layer I got tired of copying.

Docs: [madeyoga.github.io/AuthEndpoints](https://madeyoga.github.io/AuthEndpoints). Package: [NuGet AuthEndpoints](https://www.nuget.org/packages/AuthEndpoints/). Source: [github.com/madeyoga/AuthEndpoints](https://github.com/madeyoga/AuthEndpoints).

## Summary

I expected Django-shaped auth when I moved to ASP.NET Core. Identity covered membership. The reusable HTTP endpoints for SPA and native clients were the missing piece. AuthEndpoints is that facade so I do not rewrite Identity's HTTP surface on every Web API.

If you are shipping a SPA or native client on Identity and the MapIdentityApi path feels thin, try it:

```bash
dotnet add package AuthEndpoints
```

Read the [quick start](https://madeyoga.github.io/AuthEndpoints/getting-started/quick-start), star the [repo](https://github.com/madeyoga/AuthEndpoints) if it helps, and open an issue when a route does not match your client.
