# `@rymi/mcp` — Authorization Spec

Status: **draft**. Describes what the server does today, the gaps, and the
target model. Normative keywords (MUST/SHOULD/MAY) apply to the target model in
§4–§7, not to current behaviour.

## 1. Scope

Covers authorization for every way a client reaches Rymi's MCP tools. There are
now exactly two:

| Transport | How the caller authenticates | Who runs it |
|---|---|---|
| `stdio` (`npx @rymi/mcp`) | `RYMI_API_KEY` env var, read once at boot | The end user, locally |
| hosted `mcp.rymi.live` (§7) | OAuth 2.1 (Supabase AS), **or** a `rymi_` secret key | Rymi (`apps/api`) |

The hosted endpoint is what makes "add a custom connector in Claude" work
without pasting a key. It lives in `apps/api`, not this package — see §7.1.

**`--transport http` was removed in 2.0.0** (with its Dockerfile), which is why
§4 below is struck rather than planned: the gaps it described belonged to that
server, and deleting it closed them outright. `apps/api` now serves both
credentials on one host, both role-gated.

The MCP server is a **thin binding**, not a policy engine: it constructs a
`@rymi/node` SDK client from the caller's key and hands it to every tool in
`@rymi/ops-tools`. Actual tenant resolution and enforcement happen downstream in
`apps/api/src/middleware/auth.ts`. This spec exists because "the API checks it"
is only true for *tenant isolation* — it is not true for *tool-level authority*.

## 2. Current behaviour

**stdio** (`packages/mcp`) — `src/index.ts` requires `RYMI_API_KEY`; empty means
exit 1. The key is never validated locally; the first tool call is what discovers
a bad key. Tool gating is `src/server.ts:15` reading `RYMI_MCP_READONLY=1`, which
registers only `risk === 'read'` tools. That is a *process-wide env flag*, set by
whoever starts the process — in stdio the entity being restricted is the entity
applying the restriction, so it is a footgun guard, not a security control.

**hosted `mcp.rymi.live`** (`apps/api/src/routes/mcp.ts`) — accepts an OAuth
token (§7.5) or a `rymi_` secret key, resolved by SHA-256 against
`developer_api_keys` (`revoked_at is null`). Publishable keys are rejected.
Either way it resolves a tenant + role and filters the catalog through
`resolveToolDisposition`. `POST /` is the same handler, gated on the MCP
hostname, preserving the pre-2.0 API-key contract.

## 3. Gaps

**G1 — Every secret key carries its owner's full authority.**
`developer_api_keys` has no scope column
(`supabase/migrations/20260424000000_developer_api_keys.sql:12`), so a key cannot
be narrower than the person who made it. On the hosted endpoint a key is now at
least bounded by that person's **role** — an owner's key still reaches
`batch_call`, `publish_agent`, `set_auto_recharge`. Over stdio there is no
gating at all. §5 is the fix.

**G3 — `resolveToolDisposition` is bypassed over stdio.**
`packages/ops-tools/src/policy.ts` encodes the intended model: `read → execute`,
`write → propose`, `sensitive → confirm`, `account`-scoped writes `→ deny` for
non-owner/admin. The studio harness honours it, and as of the consolidation so
does the hosted endpoint. `packages/mcp` still doesn't — it has no notion of
`TenantRole`, so every registered tool is effectively `execute`. Fixing it needs
`/v1/me` (§5); the blast radius is one local user holding their own key.

~~**G2 — The README documents a control that doesn't exist.**~~ Fixed. It
claimed a "read-only key" and per-API-key gating of billable tools on the hosted
endpoint. Neither existed.

~~**G4 — HTTP accepts any bearer shape.**~~ Closed by deleting that server.
`apps/api` validates the credential before building anything and rejects
publishable keys explicitly.

**G5 — Not conformant with MCP authorization (2025-06-18).** For HTTP transport
the spec requires an unauthenticated 401 to carry `WWW-Authenticate` pointing at
`/.well-known/oauth-protected-resource`, so clients can discover how to
authenticate. Rymi returns a bare JSON 401. Standard MCP clients cannot
onboard without an out-of-band, hand-pasted key.

~~**G6 — No DNS-rebinding protection.**~~ Closed. The deleted server had none;
`apps/api` validates `Origin` against an allowlist in the route. (The transport's
own `enableDnsRebindingProtection` option is deprecated in favour of exactly
that.)

~~**G7 — Per-request server leak.**~~ Closed. `apps/api` closes the `McpServer`
and transport on `reply.raw` close.

## 4. ~~Target: transport gate~~ — resolved by deletion

This section specified hardening for `packages/mcp --transport http`: reject
before constructing a server, refuse publishable keys, close the transport, add
DNS-rebinding protection. That server no longer exists (removed in 2.0.0, along
with its Dockerfile), and `apps/api/src/routes/mcp.ts` does all of it.

Kept as a record of why the removal was the fix rather than the workaround: it
was the only code path with these gaps, Rymi was the only deployer, and it could
never have served OAuth without reimplementing what `apps/api` already had.

## 5. Target: per-key scopes

Add to `developer_api_keys`:

```sql
alter table public.developer_api_keys
  add column if not exists scopes text[] not null default '{read,write,sensitive}';
```

Values reuse the existing `ToolRisk` axis (`packages/ops-tools/src/types.ts:20`)
rather than inventing a second vocabulary. `default '{read,write,sensitive}'`
preserves today's behaviour for existing keys — narrowing them is a separate,
announced change, not a silent migration.

A key's scopes MUST be enforced **at the API**, not only at tool registration.
Registration-time filtering is UX (the model shouldn't see tools it can't call);
the API check is the control. A key with `scopes = '{read}'` calling
`POST /v1/calls` MUST get `403`, whatever client it came from.

The MCP server learns scopes from a new `GET /v1/me` returning
`{ tenant_id, role, scopes }`, called once at server construction. `RYMI_MCP_READONLY=1`
survives as a client-side convenience that can only ever *narrow* the key's
scopes — never widen them.

## 6. Target: honour `resolveToolDisposition`

With `role` from `/v1/me`, the MCP binding MUST filter the catalog through
`resolveToolDisposition({ scope, risk, role })` exactly as the harness does, and
skip any tool resolving to `deny`.

`propose` and `confirm` have no native MCP equivalent — the protocol has no
approval card, and MCP clients apply their own tool-approval UX which Rymi cannot
depend on. Therefore: tools resolving to `propose`/`confirm` MUST still be
registered, but their descriptions MUST state the side effect in the first
sentence ("Places real outbound calls and bills the wallet."), since the
description is the only signal reaching the client's approval prompt. A
`sensitive` tool MUST NOT be registered for a key lacking the `sensitive` scope —
that is the real gate; the description is advisory.

## 7. Target: OAuth install in Claude

**Goal.** A user pastes `https://api.rymi.live/mcp` into Claude → *Add custom
connector* → is bounced to a Rymi consent screen → approves → Claude holds a
token. No key pasting, ever.

Supabase Auth ships an OAuth 2.1 server (beta, free during beta) with PKCE and
Dynamic Client Registration, built for exactly this. Rymi is the **resource
server**; Supabase is the **authorization server**. We do not write token
issuance, refresh, or DCR.

### 7.1 Roles

| Piece | Who serves it | Status |
|---|---|---|
| Authorization server (`/oauth/authorize`, `/oauth/token`, DCR, JWKS) | Supabase, `https://<ref>.supabase.co/auth/v1` | exists, **needs enabling in dashboard** — verified 2026-07-15: the project answers `OAuth server is disabled` |
| Asymmetric JWT signing (§7.3) | Supabase project | **prerequisite, not done** |
| Protected resource metadata | `apps/api` | ✅ `src/routes/mcp.ts` |
| MCP Streamable HTTP endpoint (`/mcp`) | `apps/api` | ✅ `src/routes/mcp.ts` |
| Consent UI (`/oauth/consent`) | `apps/studio` | ✅ `src/pages/OAuthConsentPage.tsx` |

The endpoint belongs in `apps/api`, not `packages/mcp`: the API already holds the
Supabase clients, tenant resolution, and Railway deploy — and `createInProcessOpsClient`
reaches them through `app.inject()`, with no network hop. A separate MCP service
had to make real HTTP calls back to the app it was proxying. `packages/mcp` stays
the stdio/npm path.

### 7.2 Discovery

`apps/api` MUST serve, unauthenticated (add to the `auth.ts:36` skip list):

```jsonc
// GET /.well-known/oauth-protected-resource/mcp   → RFC 9728
{
  "resource": "https://api.rymi.live/mcp",
  "authorization_servers": ["https://<ref>.supabase.co/auth/v1"],
  "bearer_methods_supported": ["header"]
}
```

`resource` MUST byte-match the URL the user types in Claude, path included. Pick
`https://api.rymi.live/mcp` as canonical and put it in the docs verbatim; a
trailing slash is a different resource and the flow will fail.

Unauthenticated `/mcp` MUST return `401` with:

```
WWW-Authenticate: Bearer resource_metadata="https://api.rymi.live/.well-known/oauth-protected-resource/mcp"
```

Claude falls back to probing `/.well-known/oauth-protected-resource/<path>` and
`/.well-known/oauth-protected-resource` if the header is absent, so serve the
header *and* both paths — it costs one route and removes the most common
failure.

### 7.3 Prerequisite: asymmetric JWT signing

Supabase requires RS256/ES256 (not the HS256 default) to issue OIDC ID tokens,
which the `openid` scope needs.

**Audited 2026-07-15 — the blast radius is smaller than it looks.** Rotation is
zero-downtime by design: existing non-expired JWTs, plus the `anon` and
`service_role` keys, stay valid and accepted. The documented ways to break an
app on rotation are (a) code that verifies Supabase JWTs locally against the
shared secret, and (b) Edge Functions with `verify_jwt`. Findings for this repo:

- **No local verification anywhere.** Zero references to `SUPABASE_JWT_SECRET`.
  `apps/api/src/middleware/auth.ts` uses `supabase.auth.getUser(token)`, a
  network call that always validates against whatever key is current. The only
  `jwt.verify` in the tree is `packages/telephony/src/providers/vonage.ts:97`,
  against Vonage's own webhook secret — unrelated. Impersonation and LiveKit
  use their own secrets.
- **8 Edge Functions have `verify_jwt: true`** (`initiate-call`, `enqueue-calls`,
  `pause-campaign`, `process-next-call`, `resume-campaign`,
  `manage-dead-letter-queue`, `process-batch-calls`, `queue-health-monitor`) —
  but they are **orphaned**: nothing in `apps/` or `packages/` invokes them, and
  the three `cron.job` entries call plain SQL functions, not edge functions.
  That work moved into `apps/api` + BullMQ.
- PostgREST, Realtime, and GoTrue are platform-managed and follow the rotation.

⚠️ **Never revoke the legacy JWT secret.** `anon` and `service_role` are not
just API keys — they are JWTs signed by that secret, so revoking it kills
`SUPABASE_SERVICE_KEY` (the whole API's DB access) and the browser anon key at
once. Revocation is **not** required for OAuth; rotation alone is enough.
Retiring the legacy secret means first migrating to `sb_publishable_` /
`sb_secret_` keys — a separate project, unrelated to this one.

### 7.4 Consent screen

Built: `apps/studio/src/pages/OAuthConsentPage.tsx`. Set
`authorization_url_path = "/oauth/consent"` so Supabase sends the user there
with `?authorization_id=…`.

This screen is the **only** human gate in the flow, so it names the real blast
radius (§7.6) instead of echoing `openid email profile`. Those scope strings are
a lie by omission here: they describe the ID token, not what the connector can
do, and are deliberately **not** rendered.

Two things worth knowing before editing it:

- **It must not be wrapped in `<ProtectedRoute>`.** That redirects via
  `state.from`, which `LoginPage` ignores — it reads `?returnTo=`. Going through
  it silently drops `authorization_id` and dead-ends the authorization. The page
  gates auth itself and hands `/login` a full `returnTo`.
- **`getAuthorizationDetails` returns one of two shapes.** If the user already
  consented to these scopes, it returns `{ redirect_url }` rather than consent
  details, and the page must follow it rather than asking again.

`approveAuthorization()` / `denyAuthorization()` redirect to the client
themselves; code after them only runs on failure. The installed `auth-js`
(2.98.0) exposes all three — no dependency bump.

### 7.5 Token validation at `/mcp`

Supabase OAuth access tokens are ordinary Supabase user JWTs with `aud:
"authenticated"`, plus a **`client_id`** claim identifying the OAuth client.

The MCP endpoint MUST require the `client_id` claim to be present. Without that
check, any studio session JWT — a value that lives in the browser's local
storage — is a valid MCP credential. Verify via JWKS, then resolve `sub` →
`tenantId` through the existing `ensureTenantContextForUser`.

⚠️ **Audience binding is not achievable today.** RFC 8707 resource indicators
and the MCP spec both want a token scoped to `https://api.rymi.live/mcp` and
rejected everywhere else. Supabase's token is not audience-bound to the
resource, so an MCP connector token is *also* a valid credential against the
entire Rymi REST API. Consequence: **a token minted for Claude bypasses every
tool-level control in §5/§6** by calling the API directly. Tool gating in the
MCP binding is therefore UX, not containment. Accept this knowingly or don't
ship the OAuth path. Revisit when Supabase supports resource indicators.

### 7.6 Authority: role, not scope

Supabase does not support custom scopes ("planned for a future release"), so
`read`/`write`/`sensitive` (§5) **cannot** be expressed as OAuth scopes. Do not
invent parallel scope strings the AS won't enforce.

Instead the OAuth path derives authority from the user's `TenantRole` and runs
the catalog through `resolveToolDisposition` (§6) — the same function the
harness uses. Practical consequences, which the consent screen MUST state
plainly:

- Consent is **all-or-nothing**: approving grants Claude the user's full
  authority. There is no read-only Claude connector until custom scopes land.
- An `owner`/`admin` approving gives Claude account-scoped power — billing,
  keys, numbers, DNC.
- Because of §7.5, this holds even for tools we don't register.

### 7.7 Dynamic Client Registration

Claude self-registers via DCR. Enabling it means *any* client can register with
the project — Supabase says so explicitly. The consent screen (§7.4) is the
compensating control, which is why it must show the client name: it is the only
place a user can notice an unexpected client. Enable DCR; alternatively
pre-register a client and have users paste the client ID under Claude's
*Advanced settings*, which kills the frictionless install this section exists to
deliver.

### 7.8 Implementation notes

Settled while building `apps/api/src/routes/mcp.ts`:

- **The Fastify body trap has a cleaner fix than expected.** No raw-body parser
  needed: `handleRequest(req, res, parsedBody)` takes Fastify's already-parsed
  body as a third argument. `reply.hijack()` is required so Fastify stops
  managing the response while the transport writes to the raw socket.
- **zod v3/v4 split is real and load-bearing.** `@rymi/ops-tools` pins zod 3;
  `apps/api` is on zod 4, so pnpm builds this app's SDK copy as
  `sdk@1.29.0_zod@4.3.6` while the tool shapes are zod 3 instances. The SDK's
  `zod-compat` bridges them at runtime (it detects v3 schemas and routes them
  through zod's `v3` subpath), but the generic signature can't reconcile them
  and overflows instantiation depth (TS2589). The shape is cast to `any` at the
  call site, so **the compiler no longer checks this** —
  `test/mcp-zod-bridge.test.ts` is what stands behind it. Do not delete that
  test to make a refactor pass.
- **The transport's own DNS-rebinding options are deprecated** in favour of
  external middleware, so host/origin validation is done in the route.
- One `McpServer` + transport per request (stateless, `sessionIdGenerator:
  undefined`), both closed on `reply.raw` close (G7).
- `apps/api` has no `supabase/config.toml` — OAuth server settings land in the
  dashboard for the hosted project; config.toml only matters once a local stack
  exists.

### 7.9 What remains before a user can install

**All the code is landed. Nothing else here is a code change** — what remains is
Supabase project configuration on `oplhypjwdjnpxsjfaukm`, in this order.

**Step 1 — asymmetric signing** (§7.3). Dashboard → Settings → JWT Keys
(`/project/oplhypjwdjnpxsjfaukm/settings/jwt`).

1. **Migrate JWT secret** — imports the legacy secret into the signing-keys
   system and creates an asymmetric key in **standby**. Nothing is issued with
   it yet; safe to stop here.
2. **Rotate keys** — new JWTs start being signed with the asymmetric key. Old
   tokens keep working until they expire; nobody is signed out.
3. Verify: log into studio, load Calls (a real API + RLS round trip).
4. **Do not touch "Revoke"** — see the warning in §7.3.

**Step 2 — enable the OAuth server.** Dashboard → Authentication → OAuth Server:

- Enable it. Confirmed still off as of 2026-07-15: the consent page renders
  Supabase's own `OAuth server is disabled` error — which is the exact signal
  that this step is outstanding, and doubles as the check that it worked.
- Set the authorization URL path to `/oauth/consent` on the studio origin.
- Enable **dynamic client registration** (§7.7) so Claude can self-register.

**Step 3 — point the resource identifier at the real URL.** Set
`RYMI_MCP_RESOURCE_URL` to the exact public URL and confirm
`/.well-known/oauth-protected-resource/mcp` echoes it byte-identically. A
trailing slash is a different resource and the flow will fail.

Then: Claude → Settings → Connectors → Add custom connector →
`https://api.rymi.live/mcp`.

## 8. Non-goals

Rate limiting, per-tool quotas, and audit-log shape.

Impersonation tokens (`rymi_imp_`) are out of scope. Note they **do** match the
`rymi_` prefix, so `authenticate()` sends them down the secret-key branch — they
are rejected because their SHA-256 has no row in `developer_api_keys`, not
because of the prefix check. That is the correct outcome, but it rests on the
hash lookup. If MCP ever needs to accept impersonation, give it an explicit
branch rather than relaxing the prefix test.

## 9. Sequencing

1. ✅ **§7.2 + §7.5 + §7.8 `/mcp` endpoint + metadata** — landed in
   `apps/api/src/routes/mcp.ts`, with `client_id` validation and role-based tool
   gating. Covered by `apps/api/test/mcp-oauth-gate.test.ts` and
   `mcp-zod-bridge.test.ts`.
2. ✅ **§7.4 consent screen** — landed in
   `apps/studio/src/pages/OAuthConsentPage.tsx`, covered by
   `OAuthConsentPage.test.tsx`.
3. ✅ **§4 — resolved by deleting the HTTP transport** (2.0.0). G2/G4/G6/G7
   closed; G1/G3 now bounded by role on the hosted endpoint.
4. **§7.3 asymmetric signing + dashboard enablement + the domain move** — all
   that stands between here and a working install, and none of it is code.
   See §7.9.
5. **§5/§6 scopes + dispositions** — narrows a key below its owner's authority
   (G1) and closes G3 for stdio. Note §7.5: it does not contain an OAuth token,
   so it is not a security fix.
