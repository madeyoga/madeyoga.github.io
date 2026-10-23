---
title: "MapIdentityApi Alternative for ASP.NET Core: The Gaps I Hit"
description: "MapIdentityApi has no logout route, no way to drop /register, and tokens that aren't JWTs. Here are the gaps I hit and how AuthEndpoints 4 covers them."
authors:
  - name: Made Y
    to: /
    avatar:
      src: https://media.harten.id/images/madeyoga-avatar.webp
date: 2026-10-23
seo:
  keywords: MapIdentityApi, MapIdentityApi alternative, ASP.NET Core Identity, AuthEndpoints, dotnet, aspnetcore, authentication, csharp
badge:
  label: Open Source
sitemap:
  lastmod: 2026-10-23
schemaOrg:
  - type: "BlogPosting"
    headline: "MapIdentityApi Alternative for ASP.NET Core: The Gaps I Hit"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-10-23"
---


MapIdentityApi is a good start, and for many apps it's enough. In my client projects, though, I kept running into the same few gaps. If you're looking for a MapIdentityApi alternative, you may have hit some of them too. Those gaps are why I built AuthEndpoints. This post walks through each one with a short example and shows how AuthEndpoints 4 handles it. The backstory is in [Why I built AuthEndpoints](https://madeyoga.harten.id/blog/aspnet-core-authentication-endpoints/).

The more client projects I built, the more I saw how different auth looks from app to app. A POS in a shop wants cookie sessions and staff logins. A mobile app wants tokens it can refresh. A CRM might need 2FA, passkeys or Google sign-in. The right setup depends on what the app needs, not on one default. MapIdentityApi gives you one fixed set of routes, and that set doesn't always match.

## MapIdentityApi maps ten routes in one call

[MapIdentityApi](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization) came with .NET 8. One call maps ten routes on your Identity user store:

```csharp
builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<AppDbContext>();

var app = builder.Build();
app.MapGroup("/identity").MapIdentityApi<AppUser>();
```

In .NET 10 you get `/register`, `/login`, `/refresh`, `/confirmEmail`, `/resendConfirmationEmail`, `/forgotPassword`, `/resetPassword`, `/manage/2fa`, and `GET /manage/info` and `POST /manage/info`. You add no package and write no handlers. The gaps below are where it stopped working for me.

AuthEndpoints 4 sits on the same Identity and EF Core store and targets .NET 10. The basic setup looks like this:

```csharp
builder.Services.AddPasswordAuth<AppUser, AppDbContext>();
builder.Services.AddTransient<IEmailSender<AppUser>, MyEmailSender>();

var app = builder.Build();
app.UseAuthEndpoints();          // authentication, authorization, rate limiting, antiforgery
app.MapPasswordAuth<AppUser>();  // routes under /auth, cookie session by default
```

## The MapIdentityApi gaps

### 1. No logout route

MapIdentityApi doesn't map logout. Microsoft's docs tell you to write one:

```csharp
app.MapPost("/logout", async (SignInManager<IdentityUser> signInManager, [FromBody] object empty) =>
{
    if (empty != null)
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }
    return Results.Unauthorized();
}).RequireAuthorization();
```

`SignOutAsync()` clears the cookie. It does nothing for bearer tokens. The bearer handler treats sign-out as a no-op, so the access and refresh tokens work until they expire.

**AuthEndpoints:** every sign-in stack maps `POST /auth/logout`. The cookie stack clears the Identity cookies and requires a CSRF token from `GET /auth/csrfToken`. The JWT stack revokes the refresh token family and deletes the refresh cookie. The access JWT still works until it expires, 15 minutes by default. No logout can kill a JWT that's already out there.

### 2. You can't drop routes like /register

You map all ten routes or none. `MapGroup` adds a prefix and conventions. `MapGroup` has no option to leave out `/register` for an invite-only app. In my opinion, once you need to customize MapIdentityApi past that, you end up copying its source and keeping it in sync yourself.

**AuthEndpoints:** if the facade maps too much, compose modules instead. For example, a JWT host without cookie login:

```csharp
var auth = app.MapGroup("/auth");
auth.MapIdentityManagementApi<AppUser>();
auth.MapJwtAuthEndpoints<AppUser>();
```

`MapPasswordEndpoints` with `PasswordLoginMode.None` skips `/login`. `MapCookieSessionEndpoints` maps only logout and the CSRF token. AuthEndpoints doesn't rename segments like `/login` either, and `MapPasswordAuth` always includes `/register`. To leave out sign-up, you compose the modules yourself.

### 3. The bearer tokens aren't JWTs

Call `/login` without query flags and you get `accessToken`, `refreshToken`, `expiresIn` and `tokenType`. Microsoft's docs say the tokens "aren't standard JSON Web Tokens". They are data protection tickets. A second service can only read them with the Identity bearer handler and the same data protection keys. `AddJwtBearer` won't validate them.

**AuthEndpoints:** set the session to JWT.

```csharp
builder.Services.AddPasswordAuth<AppUser, AppDbContext>(o =>
{
    o.Session = AuthEndpointsSession.Jwt;
    o.Jwt = jwt =>
    {
        jwt.Issuer = "https://example.com";
        jwt.Audience = "https://example.com";
        jwt.SigningOptions.SymmetricKey = builder.Configuration["Jwt:SymmetricKey"];
    };
});
```

You also call `modelBuilder.UseRefreshToken()` in your `DbContext` and add a migration. Then you get `/auth/create`, `/auth/refresh`, `/auth/verify`, `/auth/logout` and `/auth/csrfToken`. Any service with the key can validate the access token.

### 4. Cookie or bearer is a query flag

`POST /login?useCookies=true` or `?useSessionCookies=true` returns the application cookie instead of tokens. The client picks the session type on each request. If you use the cookie path, you still add antiforgery, CORS and rate limits yourself, and there is no CSRF token endpoint.

**AuthEndpoints:** you pick the session in code. Cookie is the default, and `UseAuthEndpoints` turns on antiforgery and rate limits. Login, register and password reset don't need a CSRF token. Logout, account changes and passkey calls do.

### 5. Refresh is basic

`POST /refresh` takes the refresh token and returns a new pair. MapIdentityApi has no logout for bearer tokens, so you can't end the old refresh token early.

**AuthEndpoints:** on the JWT stack the refresh token sits in a cookie and the server stores a hash of it. Each refresh rotates it. Per the [AuthEndpoints compare page](https://authendpoints.harten.id/concepts/compare/), if someone reuses an old token, the whole family gets revoked.

### 6. 2FA works, step-up doesn't exist

`POST /manage/2fa` sets up authenticator and recovery codes, and `/login` takes the 2FA code. That part is fine. MapIdentityApi has no way to ask a signed-in user to prove it's them again before a sensitive change.

**AuthEndpoints:** same 2FA flow, plus step-up ReAuth through `/manage/authMethods` and `POST /confirmIdentity`.

### 7. Passkeys are only coming via PR #68198

MapIdentityApi has no passkey routes in .NET 10. The Blazor template has passkey pages, but those belong to the template. [dotnet/aspnetcore#68198](https://github.com/dotnet/aspnetcore/pull/68198), "Add passkey endpoints to MapIdentityApi", was merged into `main` on 22 Sep 2026 with the `12.0-preview1` milestone. Passkey endpoints are coming to MapIdentityApi in a future release.

**AuthEndpoints:** set `o.Passkeys.ServerDomain` and you get `/auth/passkeys/register`, `/auth/passkeys/login`, plus list, add, rename and delete. I wouldn't switch libraries for passkeys alone, since the framework is catching up.

## The gaps at a glance

| Gap | MapIdentityApi (.NET 10) | AuthEndpoints 4 |
|---|---|---|
| Logout | Write your own | `POST /auth/logout` per stack |
| Drop routes | No | Compose modules |
| JWT access token | No. Opaque tickets | Opt-in JWT session |
| Session choice | Query flag per request | Set in code, cookie default |
| Step-up | No | ReAuth |
| Passkeys | PR #68198, future release | Opt-in |

This only covers the gaps. Routes, request bodies and CSRF rules are in the [full AuthEndpoints vs MapIdentityApi comparison](https://authendpoints.harten.id/concepts/compare/#vs-identity-api-endpoints-mapidentityapi).

## When MapIdentityApi is enough

Use MapIdentityApi if the ten routes plus a logout handler you write cover your app. It fits internal tools, prototypes, and a single client that calls a single API with opaque tokens. It ships with the framework, Microsoft maintains it, and you skip a dependency.

I'd move off it when you need a logout that does something, JWTs another service can validate, fewer routes, or sign-in methods past a password, like email codes or GitHub and Google.

## Why a library, when agents can write the code

I write a lot of code with AI agents now. They can generate a login endpoint in seconds, so writing code is cheap. Keeping that code correct and the same across every project is not. Each generated copy is one more place for a bug to hide, and one more version to patch.

Sharing code is still the fastest, easiest and cheapest way I know to cut bugs and keep things consistent. For auth, AuthEndpoints is that shared code for me. I fix a bug once, and every client project gets the fix when it updates the package.

AuthEndpoints also ships a skill for coding agents, so your agent sets it up the way the docs describe instead of guessing. Add it with one command:

```bash
npx skills add madeyoga/AuthEndpoints
```

Then ask your agent to add auth to your API. The [AI agents guide](https://authendpoints.harten.id/getting-started/ai-agents/) has the details.

## FAQ

**What is a good MapIdentityApi alternative?**
If you want to stay on ASP.NET Core Identity and your own database, AuthEndpoints is one option. If you need a full OAuth or OpenID Connect server, OpenIddict is a better fit.

**Does MapIdentityApi have a logout endpoint?**
No. Microsoft's docs show how to write your own `POST /logout` with `SignInManager.SignOutAsync()`. It doesn't revoke bearer tokens.

**Are MapIdentityApi tokens JWTs?**
No. They're data protection tickets. You validate them with the Identity bearer handler and the same keys, not `AddJwtBearer`.

**Can I customize MapIdentityApi routes?**
You can add a prefix and conventions with `MapGroup`. You can't remove or rename a single route.

**Does MapIdentityApi support passkeys?**
Not in .NET 10. PR #68198 adds passkey endpoints. It was merged into `main` in September 2026 with the 12.0-preview1 milestone.

**Can I switch from MapIdentityApi to AuthEndpoints without changing my users table?**
Yes. Both use the same Identity store and request bodies. Your client paths move under `/auth`, and the default login sets a cookie instead of returning tokens.

To try it, the [quick start](https://authendpoints.harten.id/getting-started/quick-start/) builds a small API with register, email confirmation, cookie sign-in and logout using SQLite and curl.
