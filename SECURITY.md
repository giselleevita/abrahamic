# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for a security vulnerability.

Instead, report it privately via [GitHub Security Advisories](../../security/advisories/new) for this repository, or email the maintainer directly at yusaftareen@gmail.com with:

- A description of the issue and its potential impact
- Steps to reproduce (a minimal repro is ideal)
- Any relevant logs, requests, or screenshots

You should get an acknowledgment within a few days. This is a small demo project maintained outside of full-time work, so response times aren't guaranteed on an SLA, but reports are taken seriously and fixes for confirmed issues are prioritized.

## Scope

This is a public-facing demo application (see the [live deployment](https://abrahamic.vercel.app)). In scope:

- Authentication/authorization bypass in the admin area (`/admin`, `src/lib/auth.ts`, `middleware.ts`)
- Data exposure that violates the [public-demo translation policy](docs/LICENSING.md) (i.e. licensed translation text becoming visible on the public deployment)
- Injection, SSRF, or other classic web vulnerabilities in API routes (`src/app/api/**`)
- Abuse of the AI-backed endpoints (`src/app/api/ai/**`) beyond the documented rate limits

Out of scope: issues that only affect a locally-run, self-hosted instance with credentials or environment variables the reporter controls; denial-of-service via raw traffic volume against the free-tier hosting.

## Supported versions

This project does not maintain multiple release branches; only the code on `main` / the current production deployment is supported.
