---
title: "AuthEndpoints 4.0: what changed"
description: "AuthEndpoints 4.0 is on NuGet. A new password facade, one sign-in completer, email-code step-up, and JWT refresh in the body. AddAuthEndpoints stays as it was."
authors:
  - name: Made Y
    to: /
    avatar:
      src: https://media.harten.id/images/madeyoga-avatar.webp
date: 2026-10-19
seo:
  keywords: AuthEndpoints, AuthEndpoints 4.0, ASP.NET Core authentication, ASP.NET Core Identity, .NET 10, JWT refresh token, sign-in completer, NuGet
badge:
  label: Open Source
sitemap:
  lastmod: 2026-10-19
schemaOrg:
  - type: "BlogPosting"
    headline: "AuthEndpoints 4.0: what changed"
    author:
      type: "Person"
      name: "Made Yoga"
    datePublished: "2026-10-19"
---

AuthEndpoints 4.0 is on NuGet. 4.0.0 shipped on 15 October 2026 and 4.0.1 followed on 18 October. It still targets .NET 10, and it is still a facade over ASP.NET Core Identity. Identity owns the users, passwords, and lockout. AuthEndpoints maps the HTTP endpoints on top.

```bash
dotnet add package AuthEndpoints --version 4.0.1
```

## If you already use AddAuthEndpoints

`AddAuthEndpoints` and `MapAuthEndpoints` stay the 3.4.1 facade. Same options, same routes, and they are not obsolete. A few small changes reach them, mostly around JWT refresh. Most of the breaking changes hit the smaller building-block maps, not the facade.

## What's new

There is a second facade for new projects. `AddPasswordAuth` and `MapPasswordAuth` give you one password session under `/auth`. Cookie is the default, and JWT is the other option.

```cs
builder.Services.AddPasswordAuth<AppUser, AppDbContext>();

app.UseAuthEndpoints();
app.MapPasswordAuth<AppUser>();
```

Identity bearer tokens stay on `AddAuthEndpoints`. Pick one facade per host. The startup check fails if you call both.

Sign-in now finishes in one place. You implement `ISignInCompleter<TUser>` and register it with `AddSignInCompleter`. The 3.x completers for email code, passkeys, and external logins still work in 4.0. They are marked obsolete and go away in 5.0.

Users who only sign in with an email code can now pass step-up. `POST /confirmIdentity/emailCode/send` sends a "confirm it's you" code to accounts that have no password, authenticator, or passkey. `MapAuthEndpoints` doesn't map it.

Simple JWT can return the refresh token in the JSON body. That's for native apps and CLIs that have no cookie jar. Cookie transport is still the default. Refresh token families also get an absolute lifetime now, 14 days by default, and rotating the token doesn't extend it.

`POST /manage/password` lets an account with no password set its first one. It needs a ReAuth proof first. `MapPasswordAuth` maps it and `MapAuthEndpoints` doesn't.

GitHub and Google sign-in moved into the main package. Upgrade the provider packages to 4.0.0 and drop `AuthEndpoints.External.OAuth`. A version of that package below 4.0.0 fails the build with `AE4000`.

## Before you upgrade

Two setups need a database migration:

- If you call `UseEmailCodes()`, add one for the new `Purpose` column.
- If you call `UseRefreshToken()`, add one for `AbsoluteExpiresAt`.

`MapGitHubAuthEndpoints` and `MapGoogleAuthEndpoints` are gone. Use `MapExternalAuthProvider` or `MapExternalAuthEndpoints`. Every `Map*` also throws at startup now when its `Add*` is missing, so a broken setup fails before the first request.

The full list, with a migration step for every breaking change, is in the [upgrade guide](https://authendpoints.harten.id/guides/upgrading-to-4/). Read it before you bump the version.

## Links

- [Upgrade to 4.0](https://authendpoints.harten.id/guides/upgrading-to-4/)
- [Password auth](https://authendpoints.harten.id/getting-started/password-auth/)
- [Changelog](https://authendpoints.harten.id/changelog/)
- [NuGet](https://www.nuget.org/packages/AuthEndpoints/4.0.1)
- [GitHub](https://github.com/madeyoga/AuthEndpoints)

If something in the upgrade breaks for you, [open an issue](https://github.com/madeyoga/AuthEndpoints/issues).
