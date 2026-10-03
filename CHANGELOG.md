# @rymi/mcp

## Unreleased

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
