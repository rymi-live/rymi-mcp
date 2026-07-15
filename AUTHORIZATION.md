# `@rymi/mcp` — Authorization Spec

Status: **draft**. Describes what the server does today, the gaps, and the
target model. Normative keywords (MUST/SHOULD/MAY) apply to the target model in
§4–§7, not to current behaviour.

## 1. Scope

Covers authorization for every way a client reaches Rymi's MCP tools:

| Transport | How the caller authenticates | Who runs it | Status |
|---|---|---|---|
| `stdio` (default) | `RYMI_API_KEY` env var, read once at boot | The end user, locally | ships today |
| `http` (`--transport http`) | `Authorization: Bearer <key>` per request | Rymi, or a self-hoster | ships today |
| **hosted `/mcp`** (§7) | **OAuth 2.1, Supabase as authorization server** | **Rymi (`apps/api`)** | **target** |

The hosted endpoint is what makes "add a custom connector in Claude" work
without pasting a key. It lives in `apps/api`, not this package — see §7.1.

The MCP server is a **thin binding**, not a policy engine: it constructs a
`@rymi/node` SDK client from the caller's key and hands it to every tool in
`@rymi/ops-tools`. Actual tenant resolution and enforcement happen downstream in
`apps/api/src/middleware/auth.ts`. This spec exists because "the API checks it"
is only true for *tenant isolation* — it is not true for *tool-level authority*.

## 2. Current behaviour

**stdio** — `src/index.ts:16` requires `RYMI_API_KEY`; empty means exit 1. The
key is never validated locally; the first tool call is what discovers a bad key.

**http** — `src/transport/http.ts` serves `/health` unauthenticated (deliberate:
it must answer before the auth gate for load-balancer probes), then requires
`Authorization: Bearer <token>`. Any non-empty token is accepted and passed
straight into `createServer(apiKey)`. A fresh `McpServer` + transport are built
per request.

**Tool gating** — `src/server.ts:15` reads `RYMI_MCP_READONLY=1` and, when set,
registers only tools with `risk === 'read'`. This is a *process-wide env flag*.

**Downstream** — the API resolves `rymi_` secret keys by SHA-256 hash against
`developer_api_keys` (`revoked_at is null`), yielding `userId` + `tenantId`.
Publishable keys (`rymi_pk_`, `sb_publishable_`) resolve against
`developer_publishable_keys` and carry real restrictions (agent binding,
`allowed_channels`, `audience`).

## 3. Gaps

**G1 — Every secret key is a root key.** `developer_api_keys` has no scope,
role, or capability column (`supabase/migrations/20260424000000_developer_api_keys.sql:12`).
Any valid `rymi_` key can reach every tool in the catalog, including `risk:
'sensitive'` ones — `batch_call`, `publish_agent`, `add_dnc_batch`,
`set_auto_recharge`. The only lever is a server-wide env var the *caller* sets,
which means in the stdio case the entity being restricted is the entity applying
the restriction. It is a footgun guard, not a security control.

**G2 — The README documents a control that doesn't exist.**
`packages/mcp/README.md:103` says "pass `RYMI_MCP_READONLY=1` **or use a
read-only key**". There is no such thing as a read-only key. Either build G4 or
delete the clause.

**G3 — `resolveToolDisposition` is bypassed.** `packages/ops-tools/src/policy.ts`
already encodes the intended model: `read → execute`, `write → propose`,
`sensitive → confirm`, and `account`-scoped writes `→ deny` for non-owner/admin.
The studio harness honours it. The MCP binding never calls it and has no notion
of `TenantRole`, so every tool is effectively `execute` for everyone. Two
bindings of the same catalog disagree on authority — the MCP one is the loose one.

**G4 — HTTP accepts any bearer shape.** `http.ts:20` checks only for
non-emptiness. A publishable key (browser-safe, intentionally weak) is forwarded
happily; so is `Bearer x`. Every invalid token costs a full round trip to the API
before failing, and the 401 surfaces as a tool error rather than a transport
error.

**G5 — Not conformant with MCP authorization (2025-06-18).** For HTTP transport
the spec requires an unauthenticated 401 to carry `WWW-Authenticate` pointing at
`/.well-known/oauth-protected-resource`, so clients can discover how to
authenticate. Rymi returns a bare JSON 401. Standard MCP clients cannot
onboard without an out-of-band, hand-pasted key.

**G6 — No DNS-rebinding protection.** `StreamableHTTPServerTransport` is
constructed without `enableDnsRebindingProtection` / `allowedHosts` /
`allowedOrigins`. A local HTTP server is reachable from any web page the user
visits; the browser attaches no `Authorization` header, so §4's gate still
rejects it — but this is one config mistake away from being live, and the MCP
spec calls for it explicitly.

**G7 — Per-request server leak.** Each request builds an `McpServer` and
transport and never closes them. Not an authz bug; it sits in the authz path and
makes an unauthenticated flood cheap to mount. Fix alongside §4.

## 4. Target: transport gate

The HTTP transport MUST reject before constructing a server:

1. `/health` stays open. It MUST NOT reveal version, tenant, or tool list.
2. Missing/malformed `Authorization` → `401` **with**
   `WWW-Authenticate: Bearer resource_metadata="<base>/.well-known/oauth-protected-resource"`.
3. Token not matching `^rymi_[A-Za-z0-9_-]{16,}$` → `401`, no upstream call.
   Publishable prefixes (`rymi_pk_`, `sb_publishable_`) MUST be rejected with a
   distinct message: publishable keys are browser-delivered and MUST NOT confer
   MCP tool access.
4. Server + transport MUST be closed when the request completes.
5. `enableDnsRebindingProtection: true` with an explicit `allowedHosts` allowlist.

The gate is a syntactic pre-filter. It MUST NOT be treated as authentication —
that remains the API's hash lookup.

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

The endpoint belongs in `apps/api`, not `packages/mcp`: the API already holds
the Supabase clients, tenant resolution, and Railway deploy. `packages/mcp`
stays the stdio/npm path and keeps §4's bearer gate.

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
which the `openid` scope needs. **This is a project-wide change** — every
existing Supabase session, every RLS check, and `auth.getUser()` in
`apps/api/src/middleware/auth.ts:180` are downstream of the signing key. Do it
as its own change, via Supabase's key rotation (both keys valid during
overlap), and verify studio login + an API call under the new key **before**
touching OAuth. Do not bundle it with the MCP work.

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
Supabase project configuration, in this order:

1. **§7.3 asymmetric signing** (RS256/ES256) on the Supabase project.
   Project-wide blast radius — land and soak on its own first.
2. **Enable the OAuth server** (Authentication → OAuth Server), set
   `authorization_url_path = /oauth/consent`, turn on dynamic registration
   (§7.7). Confirmed still off as of 2026-07-15: the consent page renders
   Supabase's own `OAuth server is disabled` error, which is the exact signal
   this step is outstanding.
3. Set `RYMI_MCP_RESOURCE_URL` to the exact public URL and verify
   `/.well-known/oauth-protected-resource/mcp` serves it byte-identically.
4. Add `https://studio.rymi.live/oauth/consent` to the project's allowed
   redirect list if the login round-trip is rejected.

Then: Claude → Settings → Connectors → Add custom connector →
`https://api.rymi.live/mcp`.

## 8. Non-goals

Rate limiting, per-tool quotas, and audit-log shape. Impersonation tokens
(`rymi_imp_`) are out of scope — they MUST be rejected by §4's prefix check.

## 9. Sequencing

1. ✅ **§7.2 + §7.5 + §7.8 `/mcp` endpoint + metadata** — landed in
   `apps/api/src/routes/mcp.ts`, with `client_id` validation and role-based tool
   gating. Covered by `apps/api/test/mcp-oauth-gate.test.ts` and
   `mcp-zod-bridge.test.ts`.
2. ✅ **§7.4 consent screen** — landed in
   `apps/studio/src/pages/OAuthConsentPage.tsx`, covered by
   `OAuthConsentPage.test.tsx`.
3. **§7.3 asymmetric signing + dashboard enablement** — the only thing left
   before a user can install, and not a code change. See §7.9.
4. **§4 transport gate** — self-contained in `packages/mcp/src/transport/http.ts`,
   unblocks nothing, do it whenever. G2 is a one-line README fix.
5. **§5/§6 scopes + dispositions** — improves the API-key path. Note §7.5: it
   does not contain an OAuth token, so it is not a security fix.
