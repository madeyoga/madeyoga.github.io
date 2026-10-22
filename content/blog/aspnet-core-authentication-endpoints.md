---
title: "ASP.NET Core Authentication Endpoints: Why I Built AuthEndpoints"
description: "In 2022 I came to ASP.NET Core from Django and found auth middleware but no endpoints to log in. So I built AuthEndpoints. Version 4 makes it composable."
authors:
  - name: Made Y
    to: /
    avatar:
      src: https://media.harten.id/images/madeyoga-avatar.webp
date: 2026-10-22
seo:
  title: "ASP.NET Core Auth Endpoints: Why I Built AuthEndpoints"
  description: "ASP.NET Core wires up auth middleware but no login, register, refresh or 2FA endpoints. AuthEndpoints 4 adds them with cookies, JWT and passkeys."
  keywords: dotnet, aspnetcore, authentication, csharp
badge:
  label: Open Source
sitemap:
  lastmod: 2026-10-22
schemaOrg:
  - type: "BlogPosting"
    headline: "ASP.NET Core Authentication Endpoints: Why I Built AuthEndpoints"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-10-22"
---

`AddAuthentication`. `AddAuthorization`. `AddCookie`. `AddJwtBearer`. `UseAuthentication`. `UseAuthorization`.

In 2022 I started using ASP.NET Core for new projects. I came from Django, where you create a project and auth is already there: a user model, login, logout, password reset, and an admin. However, in aspnetcore I wrote those six lines, ran the app, and had nowhere to log in. There were no aspnetcore authentication endpoints, only the plumbing for them.

## The problem: no endpoints

It took me a while to understand why. I read the aspnetcore source and a lot of blog samples. The `Add*` and `Use*` calls register the auth services and middleware. They don't give you a single endpoint. Register, login, refresh, 2FA and password reset are all yours to write. To write them, you first have to learn `UserManager`, `SignInManager`, token providers and authentication schemes. That's a lot for a beginner. ASP.NET Core is unopinionated on purpose, and auth is where you feel it most.

So I wrote the endpoints once and turned them into a library. I started AuthEndpoints in April 2022. I've used it ever since in every client project, including POS systems, CRMs and internal apps. 


![David Fowler forked AuthEndpoints](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/eqxf4ut8ytbcp3hub50i.png)


That July the repo got a fork from [David Fowler](https://github.com/davidfowl), one of the engineers behind aspnetcore. Stars started coming in. When I looked into why, I found out it wasn't just me. A month earlier someone had opened [dotnet/aspnetcore#42158](https://github.com/dotnet/aspnetcore/issues/42158), asking for simple auth options in the SPA templates. The thread grew into a long back-and-forth discussions. 

![ASP.NET Core auth discussions](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/k6if70zn83s3podtx1hm.png)

The opening post quoted developers saying "I'm learning authentication by trial-and-error" and called it frightening. A consultant wrote that a team new to .NET couldn't get auth working for a month and gave up for a while. Others pointed to Laravel, where this part just works. David Fowler was replying in that thread too. At the time, aspnetcore had no built-in auth endpoints at all. `MapIdentityApi` didn't come until .NET 8, in November 2023.

The more I learned about auth (while building client projects), the more I saw how opinionated it is. Cookies or tokens. Passwords, email codes, passkeys, social logins, oauth, oidc, step ups, two factor authentication. Every app picks a different mix depending on their needs. I also think maybe that's why aspnetcore left the endpoints out. A framework that stays unopinionated can't pick one for you. Even with `MapIdentityApi`, it is, in my opinion an opinionated solution that can't fit on every apps out there. 

That gave me the idea for AuthEndpoints: a set of minimal API endpoints where you pick the ones you need. However, the execution was really bad. I didn't have the experience yet, so the early versions gave you no real choice. You got one opinionated way of doing auth, password auth, and that was it.

Later, AI tools helped me reshape the idea and the code, so each piece stands on its own. You pick your sign-in method, your session type and the extras you want, and map only those. The idea became composable authentication.

AuthEndpoints 4 is the result. The version I want other developers to try. It is free and MIT licensed. The main goal is to simplify aspnetcore authentication. Whether you're new to aspnetcore or have used it for years, please give it a try!

## AuthEndpoints 4: an ASP.NET Core auth library on top of Identity

![AuthEndpoints](https://dev-to-uploads.s3.us-east-2.amazonaws.com/uploads/articles/tg7c759evwsat58yei5a.png)

AuthEndpoints is an aspnetcore auth library. It doesn't replace aspnetcore Identity. Identity still owns your users, password hashing and lockout. AuthEndpoints maps the HTTP endpoints on top of it. Opinionated recipes ready for different auth types, while remain flexible, allowing users to compose their own auth stack.

Version 4.0.0 shipped on 15 October 2026. Two patch releases followed, and 4.0.2 is the current one on NuGet. It targets .NET 10 and uses EF Core for the user store.

The big change in 4 is a new entry point for new projects, `AddPasswordAuth` and `MapPasswordAuth`. It is a Password auth recipe (or I call it facade). One pair of calls gives you password sign-up, sign-in, recovery, email confirmation, account management and one session, all under `/auth`. Cookie is the default session. Jwt is the other one.

## Quick start

This comes from the [quick start](https://authendpoints.harten.id/getting-started/quick-start/) in the docs. You need the .NET 10 SDK.

```bash
dotnet new web -n AuthDemo
cd AuthDemo
dotnet add package AuthEndpoints
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

Then `Program.cs`:

```csharp
using AuthEndpoints;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlite("Data Source=app.db"));
builder.Services.AddPasswordAuth<AppUser, AppDbContext>();
builder.Services.AddTransient<IEmailSender<AppUser>, ConsoleEmailSender>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
}

app.UseAuthEndpoints();
app.MapPasswordAuth<AppUser>();

app.MapGet("/me", (System.Security.Claims.ClaimsPrincipal user) => new { email = user.Identity!.Name })
    .RequireAuthorization();

app.Run();

public class AppUser : IdentityUser { }

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<AppUser>(options) { }
```

The quick start also has a `ConsoleEmailSender` that writes confirmation and reset links to the log. I left it out here to keep the sample short. You need some `IEmailSender<AppUser>` for the app to send those links.

Three calls do the work. `AddPasswordAuth` registers Identity, the password endpoints, account management and the cookie session. `UseAuthEndpoints` adds authentication, authorization, rate limiting and antiforgery middleware. `MapPasswordAuth` maps the routes under `/auth`.

Run it, and you have `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/confirmEmail`, `POST /auth/forgotPassword`, `POST /auth/resetPassword`, `/auth/manage/2fa` and more. Accounts need a confirmed email before they can log in. That's the default.

## What you get

**Sessions.** Cookie sessions for browser apps. JWT with a rotating refresh token for clients that need a bearer token. Identity bearer tokens for mobile apps, on the 3.x facade. In 4, the JWT refresh token can also come back in the JSON body for native apps and CLIs that have no cookie. Cookie transport stays the default.

**2FA.** Authenticator codes and recovery codes through `/auth/manage/2fa`.

**Passkeys.** Set `Passkeys.ServerDomain` and the password facade maps passkey sign-in and passkey management under `/auth/passkeys`. Users can add, rename and remove them.

**Step-up (ReAuth).** Before a sensitive change, the user proves who they are again with a password, an authenticator code, a recovery code, a passkey, or an email code. You can require it on your own routes too.

**Other sign-in options.** Emailed one-time codes, plus GitHub and Google sign-in (currently plain oauth flow, not oidc). 

**Protection.** Rate limits, CSRF checks on cookie routes that change state, lockout, and checks at startup. Every `Map*` call throws at startup when its `Add*` call is missing, so a broken setup fails before the first request.

**Modules.** If the facade maps more than you want, you can compose smaller modules and map only the routes you need on your own prefixes.

If you already use the 3.x `AddAuthEndpoints` and `MapAuthEndpoints`, they still work in 4. Some setups need a database migration, and a few smaller APIs changed. Read the [upgrade guide](https://authendpoints.harten.id/getting-started/upgrading-to-4/) before you bump the version.

## AuthEndpoints vs MapIdentityApi

If you're looking for a `MapIdentityApi` alternative, this is the honest comparison in dotnet10.

[`MapIdentityApi`](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization) maps ten routes: register, login, refresh, confirm email, resend confirmation, forgot password, reset password, 2FA, and get or update account info. Login returns Identity bearer tokens by default, or a cookie if you pass `useCookies`. Microsoft's docs say those tokens are not standard JWTs. It's a good start, and both libraries use the same Identity user store.

Here is what it doesn't do:

- It maps no logout route. The Microsoft docs tell you to write your own.
- It has no passkey endpoints.
- It maps no CSRF token route for cookie clients.
- It has no step-up check for host endpoints.
- You can't leave out routes like `/register`. It maps all ten.
- Rate limiting, antiforgery and CORS are yours to wire up.

The docs have a [full comparison](https://authendpoints.harten.id/concepts/compare/) with the routes side by side.

## Try it

I built AuthEndpoints to simplify authentication in ASP.NET Core web apis. Four years later it runs in every project I ship.

- Docs: [authendpoints.harten.id](https://authendpoints.harten.id/)
- Quick start: [authendpoints.harten.id/getting-started/quick-start](https://authendpoints.harten.id/getting-started/quick-start/)
- NuGet: [nuget.org/packages/AuthEndpoints](https://www.nuget.org/packages/AuthEndpoints)
- GitHub: [github.com/madeyoga/AuthEndpoints](https://github.com/madeyoga/AuthEndpoints)

If something breaks or a doc is unclear, please open an issue and let me know!
