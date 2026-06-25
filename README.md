<div align="center">

# @rymi/mcp

### The [**Rymi**](https://rymi.live) MCP server — create and manage AI voice agents from any MCP-capable client.

Point Claude Desktop, Claude Code, Cursor, or a Rymi voice agent at this server and manage your entire voice-agent fleet — agents, calls, numbers, knowledge, and usage — without writing a line of HTTP code.

[![npm version](https://img.shields.io/npm/v/@rymi/mcp?color=6366f1&label=npm&logo=npm)](https://www.npmjs.com/package/@rymi/mcp)
[![npm downloads](https://img.shields.io/npm/dm/@rymi/mcp?color=8b5cf6&logo=npm)](https://www.npmjs.com/package/@rymi/mcp)
[![MCP](https://img.shields.io/badge/Model_Context_Protocol-compatible-8b5cf6)](https://modelcontextprotocol.io)
[![license](https://img.shields.io/badge/license-MIT-22d3ee)](./LICENSE)

[**Documentation**](https://docs.rymi.live/api/mcp) · [**Dashboard**](https://rymi.live) · [**Node SDK**](https://www.npmjs.com/package/@rymi/node) · [**Python SDK**](https://pypi.org/project/rymi/)

</div>

---

## 🚀 Two ways to run it

### ☁️ Hosted — no install

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

### 💻 Local — via npx

Run the server on your own machine — it speaks **stdio** by default and talks to the Rymi REST API directly. The key is read from the `RYMI_API_KEY` environment variable.

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

> **Options:** `RYMI_MCP_READONLY=1` hides every mutating tool (including `create_call`, `batch_call`, `publish_agent`). `--transport http` + `RYMI_MCP_PORT` serve over HTTP instead of stdio.

## 🧰 Tools

<table>
<tr><th>Group</th><th>Tools</th></tr>
<tr>
<td><b>Agents</b></td>
<td><code>list_agents</code> · <code>get_agent</code> · <code>create_agent</code> · <code>update_agent</code> · <code>delete_agent</code> · <code>clone_agent</code> · <code>apply_agent_changes</code> · <code>generate_agent_draft</code> · <code>enrich_company</code> · <code>validate_agent_publish</code> · <code>preview_stack</code></td>
</tr>
<tr>
<td><b>Discovery</b></td>
<td><code>list_llm_options</code> · <code>list_voices</code></td>
</tr>
<tr>
<td><b>Knowledge & history</b></td>
<td><code>list_knowledge_sources</code> · <code>add_knowledge_source</code> · <code>delete_knowledge_source</code> · <code>list_agent_changes</code> · <code>undo_agent_change</code></td>
</tr>
<tr>
<td><b>Insight</b></td>
<td><code>get_usage_summary</code> (minutes-based) · <code>list_agent_templates</code> · <code>run_evals</code> · <code>list_eval_runs</code> · <code>get_eval_run</code></td>
</tr>
<tr>
<td><b>Calls</b> <sub>(read-only)</sub></td>
<td><code>list_calls</code> · <code>list_active_calls</code> · <code>get_call</code> · <code>get_call_summary</code> · <code>get_call_transcript</code> · <code>get_call_recording</code> · <code>get_call_queue_stats</code> · <code>reprocess_call</code> · <code>list_calls_for_agent</code></td>
</tr>
<tr>
<td><b>Numbers</b></td>
<td><code>list_numbers</code> · <code>register_number</code> · <code>attach_number</code> · <code>remove_number</code></td>
</tr>
<tr>
<td><b>Telephony</b> <sub>(read-only)</sub></td>
<td><code>telephony_status</code> · <code>list_telephony_numbers</code></td>
</tr>
<tr>
<td><b>Keys</b> <sub>(read-only)</sub></td>
<td><code>list_publishable_keys</code></td>
</tr>
</table>

### ⚠️ Gated tools

`create_call` and `batch_call` place **real, billable** outbound calls; `publish_agent` flips an agent **live** to end users.

- **Hosted** `mcp.rymi.live` — disabled by default; enable per API key from the dashboard.
- **Local** `@rymi/mcp` — enabled by default; pass `RYMI_MCP_READONLY=1` (or use a read-only key) to hide all mutating tools.

> Carrier connect/disconnect and publishable-key creation/revocation are intentionally **not** exposed over MCP (they enter credentials and change standing configuration) — do those from the dashboard.

## ⚙️ Configuring an agent

`create_agent` and `update_agent` accept the full agent configuration surface. Always call `list_llm_options` first to get valid model and voice IDs.

<details>
<summary><b>Configuration reference</b></summary>

<br>

- **Multi-language / bilingual** — set `supported_languages` to every BCP-47 tag the agent should handle, e.g. `["hi-IN","en-US"]`. The primary `language` is merged in automatically. The server resolves the per-language model stack for you; some languages may require a higher `agent_role`.
- **Model stack** — pin `llm_provider` + `llm_model`, and optionally `stt_provider`/`stt_model` and `tts_provider`/`tts_model`. Realtime LLMs (and Deepgram TTS) carry their own voice, so leave `voice` empty for those.
- **Fallbacks** — `llm_fallback_*`, `stt_fallback_*`, `tts_fallback_*` set a secondary provider/model per channel. Pass `null` to clear.
- **Self-hosted endpoints** (Enterprise) — `custom_llm_url`, `custom_voice_url` (+ `custom_voice_mode`), `custom_transcriber_url`. `https://` or `wss://` only; `null` clears.
- **`agent_role`** — the pricing tier (`operator` → `concierge`) for a Rymi-Curated agent, and the seed for default model selection. It no longer gates which models you can pick — any model is allowed on any role. Custom agents are billed by component cost + a flat $0.02/min fee regardless of role.
- **`persona`** — note that `callerPersonas` entries are objects of shape `{ type, approach, detectedWhen }`, not plain strings.

`provider_config` is server-derived (recomputed from role + supported languages on every write) and is not accepted as an input.

</details>

## 📖 Documentation

Full reference and guides: [**docs.rymi.live/api/mcp**](https://docs.rymi.live/api/mcp)

## 📄 License

[MIT](./LICENSE) © Rymi
