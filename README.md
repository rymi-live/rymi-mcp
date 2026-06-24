# @rymi/mcp

MCP server for [Rymi](https://rymi.live) — lets any MCP-capable AI client (Claude Desktop, Claude Code, Cursor, or a Rymi voice agent) create and manage AI voice agents without writing HTTP code.

## Two ways to run it

### Hosted (no install)

Point your client at `https://mcp.rymi.live` and pass your API key as a Bearer token.

```json
{
  "mcpServers": {
    "rymi": {
      "type": "http",
      "url": "https://mcp.rymi.live/",
      "headers": {
        "Authorization": "Bearer rymi_your_secret_key"
      }
    }
  }
}
```

### Local (npm)

Run the server on your own machine with `npx` — it speaks **stdio** by default and talks to the Rymi REST API directly. The key is read from the `RYMI_API_KEY` environment variable.

```json
{
  "mcpServers": {
    "rymi": {
      "command": "npx",
      "args": ["-y", "@rymi/mcp"],
      "env": {
        "RYMI_API_KEY": "rymi_your_secret_key"
      }
    }
  }
}
```

**Options:** `RYMI_MCP_READONLY=1` hides every mutating tool (including `create_call`, `batch_call`, `publish_agent`); `--transport http` + `RYMI_MCP_PORT` serve over HTTP instead of stdio.

## Tools

**Agents:** `list_agents` · `get_agent` · `create_agent` · `update_agent` · `delete_agent` · `clone_agent` · `apply_agent_changes` · `generate_agent_draft` · `enrich_company` · `validate_agent_publish` · `preview_stack`

**Discovery:** `list_llm_options` · `list_voices`

**Knowledge & history:** `list_knowledge_sources` · `add_knowledge_source` · `delete_knowledge_source` · `list_agent_changes` · `undo_agent_change`

**Insight:** `get_usage_summary` (minutes-based) · `list_agent_templates` · `run_evals` · `list_eval_runs` · `get_eval_run`

**Calls (read-only):** `list_calls` · `list_active_calls` · `get_call` · `get_call_summary` · `get_call_transcript` · `get_call_recording` · `get_call_queue_stats` · `reprocess_call` · `list_calls_for_agent`

**Numbers:** `list_numbers` · `register_number` · `attach_number` · `remove_number`

**Telephony (read-only):** `telephony_status` · `list_telephony_numbers`

**Keys (read-only):** `list_publishable_keys`

**Gated tools** (`create_call`, `batch_call` place real, billable outbound calls; `publish_agent` flips an agent live to end users):

- **Hosted** `mcp.rymi.live` — disabled by default; enable per API key from the dashboard.
- **Local** `@rymi/mcp` — enabled by default; pass `RYMI_MCP_READONLY=1` (or use a read-only key) to hide all mutating tools.

> Carrier connect/disconnect and publishable-key creation/revocation are intentionally **not** exposed over MCP (they enter credentials and change standing configuration) — do those from the dashboard.

## Configuring an agent

`create_agent` and `update_agent` accept the full agent configuration surface. Always call `list_llm_options` first to get valid model and voice IDs.

- **Multi-language / bilingual** — set `supported_languages` to every BCP-47 tag the agent should handle, e.g. `["hi-IN","en-US"]`. The primary `language` is merged in automatically. The server resolves the per-language model stack for you; some languages may require a higher `agent_role`.
- **Model stack** — pin `llm_provider` + `llm_model`, and optionally `stt_provider`/`stt_model` and `tts_provider`/`tts_model`. Realtime LLMs (and Deepgram TTS) carry their own voice, so leave `voice` empty for those.
- **Fallbacks** — `llm_fallback_*`, `stt_fallback_*`, `tts_fallback_*` set a secondary provider/model per channel. Pass `null` to clear.
- **Self-hosted endpoints** (Enterprise) — `custom_llm_url`, `custom_voice_url` (+ `custom_voice_mode`), `custom_transcriber_url`. `https://` or `wss://` only; `null` clears.
- **`agent_role`** — the pricing tier (`operator` → `concierge`) for a Rymi-Curated agent, and the seed for default model selection. It no longer gates which models you can pick — any model is allowed on any role. Custom agents are billed by component cost + a flat $0.02/min fee regardless of role.
- **`persona`** — note that `callerPersonas` entries are objects of shape `{ type, approach, detectedWhen }`, not plain strings.

`provider_config` is server-derived (recomputed from role + supported languages on every write) and is not accepted as an input.

## Documentation

[docs.rymi.live/api/mcp](https://docs.rymi.live/api/mcp)
