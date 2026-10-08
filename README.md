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

### ☁️ Hosted — no install, no API key

Add `https://mcp.rymi.live/mcp` as a custom connector and sign in. In Claude:
**Settings → Connectors → Add custom connector**. Paste the URL exactly — no
trailing slash, since OAuth identifies the server by that string.

Signing in grants the connector everything **you** can do in Rymi, acting as
you. Revoke any time from Settings.

Clients without OAuth (and CI) can pass a secret key against the same host
instead:

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

> **Options:** `RYMI_MCP_READONLY=1` hides every mutating tool (including `create_call`, `batch_call`, `publish_agent`). `RYMI_WORKSPACE` makes the local server act in that workspace (sent as the `Rymi-Workspace` header). On the hosted endpoint, send the `Rymi-Workspace` header on the HTTP request instead.
>
> This package speaks **stdio** only. `--transport http` was removed in 2.0.0 — use the hosted endpoint above, which the local server could never match on auth (it has no OAuth, and no per-key tool gating).

## 🧰 Tools

<table>
<tr><th>Group</th><th>Tools</th></tr>
<tr>
<td><b>Agents</b></td>
<td><code>list_agents</code> · <code>get_agent</code> · <code>create_agent</code> · <code>update_agent</code> · <code>delete_agent</code> · <code>clone_agent</code> · <code>apply_agent_changes</code> · <code>generate_agent_draft</code> · <code>enrich_company</code> · <code>validate_agent_publish</code> · <code>preview_stack</code> · <code>publish_agent</code></td>
</tr>
<tr>
<td><b>Agent tools & secrets</b></td>
<td><code>set_agent_tools</code> · <code>list_agent_tools</code> · <code>add_agent_tool</code> · <code>update_agent_tool</code> · <code>remove_agent_tool</code> · <code>list_tool_secrets</code> · <code>set_tool_secret</code></td>
</tr>
<tr>
<td><b>Share link</b></td>
<td><code>get_share_link</code> · <code>set_share_link</code> · <code>regenerate_share_link</code></td>
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
<td><code>get_usage_summary</code> (minutes-based) · <code>list_agent_templates</code> · <code>run_evals</code> · <code>run_eval_suite</code> · <code>list_eval_runs</code> · <code>get_eval_run</code></td>
</tr>
<tr>
<td><b>Calls</b> <sub>(read-only)</sub></td>
<td><code>list_calls</code> · <code>list_active_calls</code> · <code>get_call</code> · <code>get_call_summary</code> · <code>get_call_transcript</code> · <code>get_call_recording</code> · <code>get_call_queue_stats</code> · <code>reprocess_call</code> · <code>list_calls_for_agent</code></td>
</tr>
<tr>
<td><b>Call control</b></td>
<td><code>create_call</code> · <code>batch_call</code> · <code>end_call</code> · <code>add_call_participant</code></td>
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
<tr>
<td><b>Campaigns</b></td>
<td><code>list_campaigns</code> · <code>get_campaign</code> · <code>get_campaign_report</code> · <code>list_campaign_attempts</code> · <code>list_campaign_suggestions</code> · <code>list_contacts</code> · <code>create_campaign</code> · <code>import_campaign_contacts</code> · <code>launch_campaign</code> · <code>pause_campaign</code> · <code>resume_campaign</code> · <code>accept_campaign_suggestion</code></td>
</tr>
<tr>
<td><b>Lead intake</b></td>
<td><code>get_campaign_intake</code> · <code>set_campaign_intake</code> · <code>rotate_campaign_intake</code> · <code>disable_campaign_intake</code></td>
</tr>
<tr>
<td><b>Do-Not-Call</b></td>
<td><code>list_dnc</code> · <code>check_dnc</code> · <code>add_dnc</code> · <code>add_dnc_batch</code> · <code>remove_dnc</code></td>
</tr>
<tr>
<td><b>Webhooks</b></td>
<td><code>list_webhooks</code> · <code>create_webhook</code> · <code>update_webhook</code> · <code>delete_webhook</code></td>
</tr>
<tr>
<td><b>Billing & cost</b></td>
<td><code>estimate_call_cost</code> · <code>set_auto_recharge</code> · <code>set_spend_alerts</code></td>
</tr>
<tr>
<td><b>Workspaces</b></td>
<td><code>list_workspaces</code> · <code>create_workspace</code></td>
</tr>
</table>

### ⚠️ Gated tools

`create_call` and `batch_call` place **real, billable** outbound calls; `publish_agent` flips an agent **live** to end users.

What restrains them depends on which server you're talking to.

- **Hosted** `mcp.rymi.live` — tools are filtered by your **tenant role**, on both OAuth and API keys. An `owner`/`admin` sees everything; a `member` gets agent-scoped tools only, with account-scoped writes (billing, keys, numbers, DNC) never registered. `RYMI_MCP_READONLY` does not apply there.
- **Local** `@rymi/mcp` — no role filtering. Full write surface unless you start it with `RYMI_MCP_READONLY=1`, which hides every mutating tool at once. That flag is set by whoever *starts* the server, so it guards a local run you configure, not a key you hand out.

Either way, role filtering bounds the **tool surface**, not the credential: a key or token stays valid against the REST API directly. Treat MCP access as equivalent to handing over your own account access.

> Carrier connect/disconnect and publishable-key creation/revocation are intentionally **not** exposed over MCP (they enter credentials and change standing configuration) — do those from the dashboard.

## ⚙️ Configuring an agent

`create_agent` and `update_agent` accept the full agent configuration surface. Always call `list_llm_options` first to get valid model and voice IDs.

<details>
<summary><b>Configuration reference</b></summary>

<br>

Agents created over MCP are **custom** agents — you choose the model stack and they're billed at component cost + a flat $0.02/min platform fee. (Managed "Rymi-Curated" SKUs are picked from the dashboard.)

- **Multi-language / bilingual** — set `supported_languages` to every BCP-47 tag the agent should handle, e.g. `["hi-IN","en-US"]`. The primary `language` is merged in automatically. The server resolves the per-language model stack for you; some languages may fall back to a different provider.
- **Model stack** — pin `llm_provider` + `llm_model`, and optionally `stt_provider`/`stt_model` and `tts_provider`/`tts_model`. Realtime LLMs (and Deepgram TTS) carry their own voice, so leave `voice` empty for those.
- **Fallbacks** — `llm_fallback_*`, `stt_fallback_*`, `tts_fallback_*` set a secondary provider/model per channel. Pass `null` to clear.
- **Self-hosted endpoints** (Enterprise) — `custom_llm_url`, `custom_voice_url` (+ `custom_voice_mode`), `custom_transcriber_url`. `https://` or `wss://` only; `null` clears.
- **`persona`** — note that `callerPersonas` entries are objects of shape `{ type, approach, detectedWhen }`, not plain strings.

`provider_config` is server-derived (recomputed from the resolved stack + supported languages on every write) and is not accepted as an input.

</details>

## 📖 Documentation

Full reference and guides: [**docs.rymi.live/api/mcp**](https://docs.rymi.live/api/mcp)

## 📄 License

[MIT](./LICENSE) © Rymi
