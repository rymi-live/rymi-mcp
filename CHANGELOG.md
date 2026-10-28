# @rymi/mcp

## 2.9.0

Requires `@rymi/node` 2.7.2 or later.

- Every tool carries MCP annotations: `readOnlyHint` for reads, `destructiveHint` for deletes, removals and `end_call`.
- Adds `mcpName` (`io.github.rymi-live/rymi-mcp`) and `server.json` for the official MCP Registry.
- Managed agents: stack, fallback and language fields are documented as locked to the managed plan (opt out to custom to edit).
- **Breaking:** `place_task_call` now requires an `agent_id` parameter and places calls only through an agent that has `features.task_calls_enabled: true`. It no longer creates or publishes agents automatically, and no longer takes a `language` parameter (the agent's stack determines the language).
- `wait_for_call` waits up to `timeout_s` (5 to 240, default 90) for a call and its post-call results, then returns status, summary and fields.

## 2.8.2

Requires `@rymi/node` 2.7.2 or later.

- `apply_agent_changes` supports `background_sound`, `background_sound_volume`, `background_sound_url`, and `voice_focus` (`AGENT_CONFIG_SCHEMA_VERSION = '2026-10-23'`).

## 2.8.1

Requires `@rymi/node` 2.7.0 or later.

- `add_call_participant` describes dialing and adding a participant to a live call. PSTN additions are billable.

## 2.8.0

Requires `@rymi/node` 2.7.0 or later (`keys.self()`).

- **Breaking:** `set_auto_recharge` and `set_spend_alerts` are no longer listed, because the API returns `403` to every API key for billing changes. Top up and change billing in Studio.
- **Breaking:** workspace roles no longer include `owner`. `add_workspace_member` takes `admin`, `editor`, `client` or `viewer`; `list_workspaces` shows `role: null` for a Billing member with no workspace role.
- Accounts and scoped keys: `list_accounts`, `list_account_members`, `add_account_member`, `remove_account_member`. A secret key lists only the tools its scopes allow: a tool needs the scope of every route it calls (`get_usage_summary` needs `billing:read`; `list_workspaces` and `list_accounts` need none).
- If `GET /v1/keys/self` fails at startup, the server retries twice, then starts with the read-only tools and a warning on stderr instead of exiting.

## 2.7.0

Requires `@rymi/node` 2.6.0.

- New tool `delete_workspace`: deletes an empty workspace. Owner only, never your first workspace; answers `workspace_not_empty` with the `blockers` that remain.

## 2.6.0

Requires `@rymi/node` 2.5.0.

- `get_compliance_settings` and `update_compliance_settings` read and change a workspace's calling rules.
- Every tool takes an optional `workspace` argument, so one connection can act in any workspace it can reach (an agency's client workspaces, for example).
- New tools `update_workspace` (name, operating country, a client workspace's monthly spend cap), `list_workspace_members`, `add_workspace_member` and `remove_workspace_member`.

## 2.5.0

Requires `@rymi/node` 2.4.0.

- `create_workspace` takes `parent` to make a client workspace that the agency pays for.
- New tool `get_workspace_usage`: calls, minutes and credits for one workspace in a month.

## 2.4.0

Requires `@rymi/node` 2.3.0.

- New tools `list_workspaces` and `create_workspace`. Set `RYMI_WORKSPACE` in the server's
  environment to act in another workspace you can reach.

## 2.3.0

Requires `@rymi/node` 2.2.0.

- New tool `set_agent_tools`: switch built-in tools on or off for one agent by tool id
  or the groups `calendar` and `tickets`. Connected-app tools (calendar, CRM lookup,
  Freshdesk, WhatsApp, Telegram, shareable assets) are now opt-in per agent, so this is
  how an agent gets them outside Studio.

## 2.2.0

Requires `@rymi/node` 2.2.0.

- New tools for a campaign's lead-intake URL: `get_campaign_intake`, `set_campaign_intake`
  (create it, or set `assume_voice_consent` / `default_country`), `rotate_campaign_intake`
  and `disable_campaign_intake`.
- `create_agent` / `update_agent` now describe `name` as the Studio label and
  `persona.name` as the name the agent speaks.

## 2.1.0

Requires `@rymi/node` 2.1.0.

- New tools for an agent's public share link: `get_share_link`, `set_share_link`
  (create, switch on/off, set the minute pool and per-call / concurrency / per-IP limits)
  and `regenerate_share_link` (new URL, old one stops working).
- New tools to manage an agent's API tools (`call_webhook` bindings) by name:
  `list_agent_tools`, `add_agent_tool`, `update_agent_tool`, `remove_agent_tool`,
  plus `list_tool_secrets` / `set_tool_secret` for `{{secrets.NAME}}` header refs.
  Bindings are validated like Studio does (https public URL, method, 1000–10000 ms
  timeout, field names) and credential headers must be secret references.
- Literal tool-header values are redacted as `[redacted]` in every tool result.

## 2.0.0

### Breaking: `--transport http` removed — this package is stdio-only

`--transport http` and `RYMI_MCP_PORT` are gone, along with the container image
that ran them. Passing `--transport http` now exits 1 with a pointer rather than
silently falling back to stdio.

**If you were running it:** use the hosted endpoint, `https://mcp.rymi.live/mcp`.
It is the same tool catalog, and strictly better on auth:

- **OAuth** — add it as a custom connector and sign in. No API key to place in a
  config file.
- **API keys still work** — pass a `rymi_` secret key as a Bearer token to the
  same host, exactly as before.
- **Tools are now filtered by tenant role**, on both credentials. The removed
  HTTP server had no per-key gating at all: any valid key reached every tool,
  and the only lever was a process-wide `RYMI_MCP_READONLY` set by whoever
  started the server — which never restrained a key you handed to someone else.

Nothing changes for stdio users (`npx @rymi/mcp`), which is how this package is
normally run. `RYMI_MCP_READONLY=1` is unaffected.

## 1.1.0

- `estimate_call_cost` no longer takes a `tier` argument (the four-tier role
  pricing is removed). It now accepts `{ stt_model, llm_model, tts_model,
  duration_seconds }` and returns the custom-stack rate (component cost +
  $0.02/min platform fee). The old `tier` argument was already ignored by the
  server.
