#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_mcp = require("@modelcontextprotocol/sdk/server/mcp.js");
var import_node = __toESM(require("@rymi/node"));

// src/tools/agents.ts
var import_zod = require("zod");
var agentConfigFields = {
  system_prompt: import_zod.z.string().optional().describe("Full system prompt for the agent. If given without persona/playbook, the server auto-structures it."),
  voice: import_zod.z.string().optional().describe('Voice ID (e.g. "Aoede", "Charon"). Call list_llm_options for valid values. Leave empty for realtime LLMs and Deepgram TTS, which carry their own voice.'),
  language: import_zod.z.string().optional().describe('Primary BCP-47 language tag (e.g. "hi-IN", "en-US").'),
  supported_languages: import_zod.z.array(import_zod.z.string()).optional().describe('All BCP-47 languages the agent should handle, e.g. ["hi-IN","en-US"] for a bilingual agent. The primary `language` is added automatically if omitted here.'),
  llm_provider: import_zod.z.enum(["gemini", "openai", "anthropic", "sarvam"]).optional(),
  llm_model: import_zod.z.string().optional().describe('LLM model id from list_llm_options (e.g. "gemini-2.5-flash", "sarvam-m").'),
  llm_fallback_provider: import_zod.z.string().nullable().optional().describe("Fallback LLM provider; null clears it."),
  llm_fallback_model: import_zod.z.string().nullable().optional().describe("Fallback LLM model; null clears it."),
  stt_provider: import_zod.z.string().optional().describe('Speech-to-text provider (e.g. "deepgram", "sarvam").'),
  stt_model: import_zod.z.string().optional(),
  stt_fallback_provider: import_zod.z.string().nullable().optional(),
  stt_fallback_model: import_zod.z.string().nullable().optional(),
  tts_provider: import_zod.z.string().optional().describe('Text-to-speech provider (e.g. "elevenlabs", "sarvam", "cartesia").'),
  tts_model: import_zod.z.string().optional(),
  tts_fallback_provider: import_zod.z.string().nullable().optional(),
  tts_fallback_model: import_zod.z.string().nullable().optional(),
  custom_llm_url: import_zod.z.string().nullable().optional().describe("Self-hosted LLM endpoint (https:// or wss://). Enterprise only; null clears."),
  custom_voice_url: import_zod.z.string().nullable().optional().describe("Self-hosted TTS endpoint (https:// or wss://). Enterprise only; null clears."),
  custom_voice_mode: import_zod.z.enum(["rymi", "openai-compat"]).optional().describe("Wire format for custom_voice_url."),
  custom_transcriber_url: import_zod.z.string().nullable().optional().describe("Self-hosted STT endpoint (https:// or wss://). Enterprise only; null clears."),
  prompt_mode: import_zod.z.enum(["builder", "raw"]).optional().describe('How the system prompt is interpreted: "builder" (server structures persona/playbook from system_prompt) or "raw" (use system_prompt verbatim \u2014 requires system_prompt). Defaults to "builder".'),
  persona: import_zod.z.record(import_zod.z.any()).optional().describe("Persona object. Note: callerPersonas must be objects of shape {type, approach, detectedWhen}, NOT plain strings."),
  playbook: import_zod.z.record(import_zod.z.any()).optional().describe("Playbook configuration object"),
  advanced: import_zod.z.record(import_zod.z.any()).optional(),
  features: import_zod.z.record(import_zod.z.any()).optional(),
  post_call: import_zod.z.record(import_zod.z.any()).optional()
};
function ok(result) {
  return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
}
function fail(err) {
  const e = err;
  const body = { error: e?.message || String(err) };
  if (e?.code) body.code = e.code;
  if (e?.status) body.status = e.status;
  return { isError: true, content: [{ type: "text", text: JSON.stringify(body, null, 2) }] };
}
function foldPromptMode(params) {
  const { prompt_mode, ...rest } = params;
  if (!prompt_mode) return rest;
  return { ...rest, advanced: { ...rest.advanced || {}, prompt_mode } };
}
function registerAgentTools(server, rymi, isReadOnly = false) {
  server.tool(
    "list_agents",
    "List all your Rymi AI voice agents.",
    {
      limit: import_zod.z.number().int().min(1).max(500).optional().describe("Max agents to return (default 50)"),
      offset: import_zod.z.number().int().min(0).optional().describe("Pagination offset")
    },
    async ({ limit, offset }) => {
      const result = await rymi.agents.list({ limit, offset });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_agent",
    "Retrieve a single Rymi voice agent by ID.",
    { agent_id: import_zod.z.string().uuid().describe("The agent UUID") },
    async ({ agent_id }) => {
      const result = await rymi.agents.retrieve(agent_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_llm_options",
    "Fetch all available LLM models and voices you can use when creating or updating an agent. Always call this before create_agent to pick valid values.",
    {},
    async () => {
      const result = await rymi.agents.llmOptions();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_voices",
    "List available agent/TTS voices, optionally filtered by provider or model. Much smaller payload than list_llm_options \u2014 use this to pick a `voice` value for create_agent/update_agent.",
    {
      provider: import_zod.z.string().optional().describe('Filter to one voice provider, e.g. "elevenlabs", "sarvam", "gemini", "cartesia", "deepgram".'),
      model_id: import_zod.z.string().optional().describe("Filter to voices compatible with a given model id (matched against the voice's supported_model_ids).")
    },
    async ({ provider, model_id }) => {
      const { voices } = await rymi.agents.llmOptions();
      let filtered = Array.isArray(voices) ? voices : [];
      if (provider) {
        const p = provider.toLowerCase();
        filtered = filtered.filter((v) => String(v?.provider || "").toLowerCase() === p);
      }
      if (model_id) {
        filtered = filtered.filter((v) => Array.isArray(v?.supported_model_ids) && v.supported_model_ids.includes(model_id));
      }
      const trimmed = filtered.map((v) => ({
        id: v?.id,
        provider: v?.provider,
        name: v?.name,
        label: v?.label,
        gender: v?.gender,
        supported_model_ids: v?.supported_model_ids,
        byok_required: v?.byok_required,
        preview_url: v?.preview_url
      }));
      return { content: [{ type: "text", text: JSON.stringify({ voices: trimmed, total: trimmed.length }, null, 2) }] };
    }
  );
  server.tool(
    "preview_stack",
    "Preview the resolved per-language model stack (STT/LLM/TTS), blockers, warnings, and model diffs for a set of supported languages \u2014 without saving. Use before create/update to confirm a multi-language setup is valid.",
    {
      supported_languages: import_zod.z.array(import_zod.z.string()).min(1).describe('BCP-47 languages to resolve a stack for, e.g. ["hi-IN","en-US"].'),
      language: import_zod.z.string().optional().describe("Primary BCP-47 language (defaults to the first supported language)."),
      current_provider_config: import_zod.z.record(import_zod.z.any()).optional().describe("Existing provider_config to diff against, if any.")
    },
    async (params) => {
      const result = await rymi.agents.previewStack(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  if (!isReadOnly) {
    server.tool(
      "create_agent",
      'Create a new Rymi AI voice agent. Call list_llm_options first to discover valid voice and model values. For a multi-language agent, set supported_languages (e.g. ["hi-IN","en-US"]).',
      {
        name: import_zod.z.string().min(1).describe("Agent display name"),
        ...agentConfigFields
      },
      async (params) => {
        try {
          const result = await rymi.agents.create(foldPromptMode(params));
          return ok(result);
        } catch (err) {
          return fail(err);
        }
      }
    );
    server.tool(
      "update_agent",
      "Update an existing Rymi voice agent's configuration. Only the fields you pass are changed; nullable fields accept null to clear them.",
      {
        agent_id: import_zod.z.string().uuid().describe("The agent UUID to update"),
        name: import_zod.z.string().optional(),
        ...agentConfigFields,
        chat_summary: import_zod.z.string().nullable().optional()
      },
      async ({ agent_id, ...params }) => {
        try {
          const result = await rymi.agents.update(agent_id, foldPromptMode(params));
          return ok(result);
        } catch (err) {
          return fail(err);
        }
      }
    );
    server.tool(
      "delete_agent",
      "Permanently delete a Rymi voice agent.",
      { agent_id: import_zod.z.string().uuid().describe("The agent UUID to delete") },
      async ({ agent_id }) => {
        const result = await rymi.agents.delete(agent_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "clone_agent",
      'Duplicate an existing agent. The copy gets " (Copy)" appended to its name.',
      { agent_id: import_zod.z.string().uuid().describe("The agent UUID to clone") },
      async ({ agent_id }) => {
        const result = await rymi.agents.clone(agent_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }
  server.tool(
    "list_calls_for_agent",
    "List calls made with a specific agent.",
    {
      agent_id: import_zod.z.string().uuid(),
      limit: import_zod.z.number().int().min(1).max(200).optional(),
      offset: import_zod.z.number().int().min(0).optional(),
      status: import_zod.z.string().optional().describe("Filter by call status")
    },
    async ({ agent_id, ...params }) => {
      const result = await rymi.agents.listCalls(agent_id, params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "validate_agent_publish",
    "Check whether an agent is ready to go live. Returns a validation report without persisting any changes.",
    {
      agent_id: import_zod.z.string().uuid().optional().describe("Merge validation with a persisted agent"),
      name: import_zod.z.string().optional(),
      voice: import_zod.z.string().optional(),
      persona: import_zod.z.record(import_zod.z.any()).optional(),
      playbook: import_zod.z.record(import_zod.z.any()).optional()
    },
    async (params) => {
      const result = await rymi.agents.validatePublish(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "apply_agent_changes",
    "Validate and resolve a flat key/value change-set against the AgentConfig field registry. Does NOT persist \u2014 follow up with update_agent.",
    {
      agent_id: import_zod.z.string().uuid().describe("Agent to load currentConfig from (recommended)"),
      changes: import_zod.z.array(import_zod.z.object({ key: import_zod.z.string(), value: import_zod.z.any() })).describe("Array of {key, value} field changes"),
      mode: import_zod.z.enum(["create", "edit"]).describe("create = new agent, edit = updating existing"),
      lenient: import_zod.z.boolean().optional().describe("Skip unknown-field hard-fail (not recommended)")
    },
    async ({ agent_id, changes, mode, lenient }) => {
      const current = await rymi.agents.retrieve(agent_id);
      const normalizedChanges = changes.map(({ key, value }) => ({ key, value }));
      const result = await rymi.agents.applyChanges({
        currentConfig: current,
        changes: normalizedChanges,
        mode,
        lenient
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "enrich_company",
    "Use AI + Google Search grounding to auto-generate a company description from a website URL, suitable for an agent's persona.",
    {
      company_name: import_zod.z.string().min(1),
      website_url: import_zod.z.string().url()
    },
    async ({ company_name, website_url }) => {
      const result = await rymi.agents.enrichCompany({ companyName: company_name, websiteUrl: website_url });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "generate_agent_draft",
    "Use AI to generate an agent configuration draft from a plain-text description.",
    {
      prompt: import_zod.z.string().min(1).describe("Description of the agent you want to create"),
      mode: import_zod.z.enum(["create", "edit"]).optional().default("create"),
      current_config: import_zod.z.record(import_zod.z.any()).optional().describe("Existing config when editing"),
      options: import_zod.z.record(import_zod.z.any()).optional().describe("Override hints e.g. {voice, llm_provider}")
    },
    async (params) => {
      const result = await rymi.agents.generate({ prompt: params.prompt, options: params.options });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// src/tools/calls.ts
var import_zod2 = require("zod");

// src/utils/errors.ts
function handleMcpError(err) {
  const e = err;
  const body = { error: e?.message || String(err) };
  if (e?.code) body.code = e.code;
  if (e?.status) body.status = e.status;
  return { isError: true, content: [{ type: "text", text: JSON.stringify(body, null, 2) }] };
}
function withToolErrors(handler) {
  return async (args) => {
    try {
      return await handler(args);
    } catch (err) {
      return handleMcpError(err);
    }
  };
}

// src/tools/calls.ts
function registerCallTools(server, rymi, isReadOnly = false) {
  server.tool(
    "list_calls",
    "List previous and active calls across your account.",
    {
      limit: import_zod2.z.number().int().min(1).max(200).optional().describe("Max calls to return"),
      offset: import_zod2.z.number().int().min(0).optional().describe("Pagination offset"),
      cursor: import_zod2.z.string().optional().describe("Opaque cursor for keyset pagination"),
      status: import_zod2.z.string().optional().describe("Filter by call status (e.g. completed, in_progress, failed)")
    },
    async (params) => {
      const result = await rymi.calls.list(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_active_calls",
    "List calls currently in progress.",
    {
      limit: import_zod2.z.number().int().min(1).max(200).optional(),
      offset: import_zod2.z.number().int().min(0).optional()
    },
    async (params) => {
      const result = await rymi.calls.active(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_call",
    "Retrieve details, participants, status, duration, and cost for a single call.",
    { call_id: import_zod2.z.string().describe("The call ID") },
    async ({ call_id }) => {
      const result = await rymi.calls.retrieve(call_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_call_summary",
    "Retrieve the post-call summary for a call.",
    { call_id: import_zod2.z.string().describe("The call ID") },
    async ({ call_id }) => {
      const result = await rymi.calls.summary(call_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_call_transcript",
    "Retrieve the full transcript for a call. May contain personal data \u2014 handle accordingly.",
    { call_id: import_zod2.z.string().describe("The call ID") },
    async ({ call_id }) => {
      const result = await rymi.calls.transcript(call_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_call_recording",
    "Retrieve recording metadata (e.g. playback URL) for a call, when recording is enabled.",
    { call_id: import_zod2.z.string().describe("The call ID") },
    async ({ call_id }) => {
      const result = await rymi.calls.recording(call_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_call_queue_stats",
    "Retrieve current outbound call queue statistics.",
    {},
    async () => {
      const result = await rymi.calls.queueStats();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  if (!isReadOnly) {
    server.tool(
      "reprocess_call",
      "Re-run post-call intelligence (summary, extraction, evaluation) for a call.",
      { call_id: import_zod2.z.string().describe("The call ID to reprocess") },
      async ({ call_id }) => {
        const result = await rymi.calls.reprocess(call_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }
}
function registerOutboundCallTools(server, rymi) {
  server.tool(
    "create_call",
    "WARNING: places a real, billable PSTN call. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account \u2014 omit it to use the agent's attached number. `identity` is the destination in strict E.164 (e.g. +15555550123).",
    {
      agent_id: import_zod2.z.string().uuid().describe("The agent that will handle the call"),
      participants: import_zod2.z.array(import_zod2.z.object({
        transport: import_zod2.z.enum(["webrtc", "pstn"]),
        identity: import_zod2.z.string().describe("Destination phone number (pstn) or participant identity (webrtc)"),
        from_number: import_zod2.z.string().optional().describe("Caller ID / from number for pstn"),
        metadata: import_zod2.z.record(import_zod2.z.any()).optional()
      })).min(1),
      metadata: import_zod2.z.record(import_zod2.z.any()).optional(),
      variables: import_zod2.z.record(import_zod2.z.any()).optional().describe("Playbook variables to seed the call"),
      post_call: import_zod2.z.record(import_zod2.z.any()).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.calls.create(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "batch_call",
    "Queue up to 500 outbound PSTN recipients in one request. WARNING: places real phone calls and incurs per-minute charges. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account.",
    {
      agent_id: import_zod2.z.string().uuid().describe("The agent that will handle the calls"),
      to: import_zod2.z.array(import_zod2.z.string()).optional().describe("Simple list of destination phone numbers"),
      recipients: import_zod2.z.array(import_zod2.z.object({
        to: import_zod2.z.string().optional(),
        from_number: import_zod2.z.string().optional(),
        metadata: import_zod2.z.record(import_zod2.z.any()).optional()
      })).optional().describe("Per-recipient targets with optional from_number/metadata"),
      from_number: import_zod2.z.string().optional().describe("Default caller ID / from number"),
      batch_id: import_zod2.z.string().optional(),
      metadata: import_zod2.z.record(import_zod2.z.any()).optional(),
      variables: import_zod2.z.record(import_zod2.z.any()).optional(),
      post_call: import_zod2.z.record(import_zod2.z.any()).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.calls.batch(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
}
function registerCallControlTools(server, rymi) {
  server.tool(
    "end_call",
    "WARNING: immediately terminates an in-progress call. The call transitions to completed and post-call processing runs.",
    { call_id: import_zod2.z.string().describe("The call ID to end") },
    withToolErrors(async ({ call_id }) => {
      const result = await rymi.calls.end(call_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "add_call_participant",
    "WARNING: dials/adds participants to a live call (warm transfer / conference). PSTN additions are billable.",
    {
      call_id: import_zod2.z.string().describe("The in-progress call ID"),
      participants: import_zod2.z.array(import_zod2.z.object({
        transport: import_zod2.z.enum(["webrtc", "pstn"]),
        identity: import_zod2.z.string().describe("Destination phone number (pstn, E.164) or participant identity (webrtc)"),
        from_number: import_zod2.z.string().optional().describe("Caller ID for pstn"),
        metadata: import_zod2.z.record(import_zod2.z.any()).optional()
      })).min(1)
    },
    withToolErrors(async ({ call_id, participants }) => {
      const result = await rymi.calls.addParticipants(call_id, { participants });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
}

// src/tools/numbers.ts
var import_zod3 = require("zod");
function registerNumberTools(server, rymi, isReadOnly = false) {
  server.tool(
    "list_numbers",
    "List all phone numbers on your Rymi account and which agent each is attached to.",
    {
      limit: import_zod3.z.number().int().min(1).max(500).optional(),
      offset: import_zod3.z.number().int().min(0).optional()
    },
    async (params) => {
      const result = await rymi.numbers.list(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  if (!isReadOnly) {
    server.tool(
      "register_number",
      "Register a phone number on your account, optionally attaching it to an agent.",
      {
        number: import_zod3.z.string().describe("Phone number in E.164 format (e.g. +14155550123)"),
        agent_id: import_zod3.z.string().uuid().optional().describe("Agent to attach the number to on registration")
      },
      async ({ number, agent_id }) => {
        const result = await rymi.numbers.register(number, agent_id ? { agent_id } : {});
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "attach_number",
      "Attach an existing number to an agent so inbound calls route to it.",
      {
        number: import_zod3.z.string().describe("Phone number in E.164 format"),
        agent_id: import_zod3.z.string().uuid().describe("Agent to route this number to")
      },
      async ({ number, agent_id }) => {
        const result = await rymi.numbers.attach(number, agent_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "remove_number",
      "Remove a phone number from your account. The number stops routing to any agent.",
      { number: import_zod3.z.string().describe("Phone number in E.164 format") },
      async ({ number }) => {
        const result = await rymi.numbers.remove(number);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }
}

// src/tools/telephony.ts
function registerTelephonyTools(server, rymi, isReadOnly = false) {
  server.tool(
    "telephony_status",
    "Report whether a telephony carrier is connected, and which provider/account.",
    {},
    async () => {
      const result = await rymi.telephony.status();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_telephony_numbers",
    "List numbers available on the connected telephony carrier account.",
    {},
    async () => {
      const result = await rymi.telephony.numbers();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// src/tools/keys.ts
function registerKeyTools(server, rymi, isReadOnly = false) {
  server.tool(
    "list_publishable_keys",
    "List publishable (browser-safe) keys and which agent/channels each is scoped to. Returns key prefixes only, never full secrets.",
    {},
    async () => {
      const result = await rymi.keys.listPublishable();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}

// src/tools/knowledge.ts
var import_zod4 = require("zod");
function registerKnowledgeTools(server, rymi, isReadOnly = false) {
  server.tool(
    "list_knowledge_sources",
    "List the knowledge sources (RAG context) attached to an agent.",
    { agent_id: import_zod4.z.string().uuid().describe("The agent UUID") },
    async ({ agent_id }) => {
      const result = await rymi.agents.listKnowledgeSources(agent_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_agent_changes",
    "List recorded configuration changes for an agent (for auditing or before an undo).",
    {
      agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
      since: import_zod4.z.string().optional().describe("ISO timestamp \u2014 only return changes after this time")
    },
    async ({ agent_id, since }) => {
      const result = await rymi.agents.listChanges(agent_id, since ? { since } : {});
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  if (!isReadOnly) {
    server.tool(
      "add_knowledge_source",
      "Add a knowledge source to an agent from raw text or a URL (the URL is fetched and ingested).",
      {
        agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
        kind: import_zod4.z.enum(["text", "url"]).describe("Source type"),
        title: import_zod4.z.string().min(1).describe("Human-readable title for the source"),
        text: import_zod4.z.string().optional().describe('Required when kind="text": the raw content to ingest'),
        url: import_zod4.z.string().url().optional().describe('Required when kind="url": the page to fetch and ingest')
      },
      async ({ agent_id, kind, title, text, url }) => {
        const data = kind === "text" ? { kind: "text", title, text: text ?? "" } : { kind: "url", title, url: url ?? "" };
        const result = await rymi.agents.addKnowledgeSource(agent_id, data);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "delete_knowledge_source",
      "Delete a knowledge source from an agent.",
      {
        agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
        source_id: import_zod4.z.string().describe("The knowledge source ID to delete")
      },
      async ({ agent_id, source_id }) => {
        const result = await rymi.agents.deleteKnowledgeSource(agent_id, source_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "undo_agent_change",
      "Undo a single recorded configuration change, reverting that field to its previous value.",
      {
        agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
        change_id: import_zod4.z.string().describe("The change_id to undo (from list_agent_changes)")
      },
      async ({ agent_id, change_id }) => {
        const result = await rymi.agents.undoChange(agent_id, change_id);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }
}

// src/tools/insights.ts
var import_zod5 = require("zod");
function registerInsightTools(server, rymi, isReadOnly = false) {
  server.tool(
    "get_usage_summary",
    "Get this account's usage summary: remaining voice-runtime MINUTES, Studio AI unit usage, and post-call intelligence usage. Voice balance is reported in minutes, not dollars.",
    {},
    async () => {
      const result = await rymi.billing.usageSummary();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_agent_templates",
    "List published agent templates. Use a template's `defaults` as the starting config for create_agent.",
    {},
    async () => {
      const result = await rymi.templates.list();
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "list_eval_runs",
    "List previous evaluation runs for an agent.",
    { agent_id: import_zod5.z.string().uuid().describe("The agent UUID") },
    async ({ agent_id }) => {
      const result = await rymi.agents.listEvalRuns(agent_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  server.tool(
    "get_eval_run",
    "Retrieve a single evaluation run, including per-scenario scores.",
    {
      agent_id: import_zod5.z.string().uuid().describe("The agent UUID"),
      run_id: import_zod5.z.string().describe("The evaluation run ID")
    },
    async ({ agent_id, run_id }) => {
      const result = await rymi.agents.getEvalRun(agent_id, run_id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
  if (!isReadOnly) {
    server.tool(
      "run_evals",
      'Run the evaluation suite for an agent. mode="synthetic" (default) uses the offline scorer; mode="live" runs the model-driven runner (consumes Studio AI units). Set judge=true to supplement the synthetic heuristics with an opt-in LLM judge (requires a Gemini key; consumes Studio AI units).',
      {
        agent_id: import_zod5.z.string().uuid().describe("The agent UUID to evaluate"),
        mode: import_zod5.z.enum(["synthetic", "live"]).optional().describe("Evaluation mode (default synthetic)"),
        judge: import_zod5.z.boolean().optional().describe("Supplement synthetic heuristics with the LLM judge (default false)")
      },
      async ({ agent_id, mode, judge }) => {
        const params = {};
        if (mode) params.mode = mode;
        if (judge) params.judge = judge;
        const result = await rymi.agents.runEvals(agent_id, params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
    server.tool(
      "run_eval_suite",
      "Run the eval SUITE across many agents at once (agents \xD7 seeded scenarios) with bounded concurrency. One eval run is persisted per agent (visible in the per-agent eval UI); the aggregate report is returned. Set judge=true to add the LLM judge (requires a Gemini key; consumes Studio AI units).",
      {
        agent_ids: import_zod5.z.array(import_zod5.z.string().uuid()).min(1).describe("Agent UUIDs to evaluate"),
        scenario_ids: import_zod5.z.array(import_zod5.z.string()).optional().describe("Optional subset of seeded scenario ids; omit to run all"),
        concurrency: import_zod5.z.number().int().positive().optional().describe("Max agents evaluated in parallel (clamped to a safe ceiling)"),
        judge: import_zod5.z.boolean().optional().describe("Supplement synthetic heuristics with the LLM judge (default false)")
      },
      async ({ agent_ids, scenario_ids, concurrency, judge }) => {
        const result = await rymi.agents.runEvalSuite({
          agentIds: agent_ids,
          ...scenario_ids ? { scenarioIds: scenario_ids } : {},
          ...concurrency ? { concurrency } : {},
          ...judge ? { judge } : {}
        });
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
    );
  }
}

// src/tools/publish.ts
var import_zod6 = require("zod");
function registerPublishTool(server, rymi) {
  server.tool(
    "publish_agent",
    "Publish a Rymi voice agent to make its current saved configuration live. IMPORTANT: this immediately makes the agent callable by end users. Returns published:false with a blockers list when the config has unresolved issues.",
    {
      agent_id: import_zod6.z.string().uuid().describe("The agent UUID to publish")
    },
    async ({ agent_id }) => {
      try {
        const result = await rymi.agents.publish(agent_id);
        return {
          isError: result.published ? void 0 : true,
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err) {
        const e = err;
        const body = { published: false, error: e?.message || String(err) };
        if (e?.code) body.code = e.code;
        if (e?.status) body.status = e.status;
        return { isError: true, content: [{ type: "text", text: JSON.stringify(body, null, 2) }] };
      }
    }
  );
}

// src/tools/dnc.ts
var import_zod7 = require("zod");
function registerDncTools(server, rymi, isReadOnly) {
  server.tool(
    "list_dnc",
    "List all numbers on your Do-Not-Call registry.",
    {
      limit: import_zod7.z.number().int().min(1).max(500).optional(),
      offset: import_zod7.z.number().int().min(0).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.dnc.list(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "check_dnc",
    "Check whether phone numbers are on the Do-Not-Call registry. Read-only \u2014 adds nothing.",
    { phone_numbers: import_zod7.z.array(import_zod7.z.string()).min(1).max(500).describe("E.164 numbers to check") },
    withToolErrors(async ({ phone_numbers }) => {
      const result = await rymi.dnc.check({ phone_numbers });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  if (isReadOnly) return;
  server.tool(
    "add_dnc",
    "Add a phone number to the Do-Not-Call registry so outbound calls to it are blocked.",
    {
      phone_number: import_zod7.z.string().describe("Phone number (any format; normalized to E.164)"),
      reason: import_zod7.z.string().optional()
    },
    withToolErrors(async ({ phone_number, reason }) => {
      const result = await rymi.dnc.add({ phone_number, reason });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "add_dnc_batch",
    "Add up to 1000 numbers to the Do-Not-Call registry. Invalid numbers are skipped and returned in `invalid`.",
    {
      phone_numbers: import_zod7.z.array(import_zod7.z.string()).min(1).max(1e3),
      reason: import_zod7.z.string().optional()
    },
    withToolErrors(async ({ phone_numbers, reason }) => {
      const result = await rymi.dnc.addBatch({ phone_numbers, reason });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "remove_dnc",
    "WARNING: removes a number from the Do-Not-Call registry, re-enabling outbound calls to it.",
    { phone: import_zod7.z.string().describe("Phone number to remove") },
    withToolErrors(async ({ phone }) => {
      const result = await rymi.dnc.remove(phone);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
}

// src/tools/webhooks.ts
var import_zod8 = require("zod");
var import_crypto = require("crypto");
function registerWebhookTools(server, rymi, isReadOnly) {
  server.tool(
    "list_webhooks",
    "List your registered webhook endpoints. Signing secrets are never returned.",
    {
      limit: import_zod8.z.number().int().min(1).max(500).optional(),
      offset: import_zod8.z.number().int().min(0).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.webhooks.list(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  if (isReadOnly) return;
  server.tool(
    "create_webhook",
    "Register a webhook to receive call lifecycle events (e.g. call.completed, transcript.ready). URL must be public https. If you omit `secret`, one is generated and shown ONCE in the response \u2014 store it to verify signatures.",
    {
      url: import_zod8.z.string().url().describe("Public https endpoint"),
      events: import_zod8.z.array(import_zod8.z.string()).min(1).describe("Event names to subscribe to"),
      secret: import_zod8.z.string().min(16).max(256).optional().describe("Signing secret; auto-generated if omitted"),
      alert_email: import_zod8.z.string().email().optional()
    },
    withToolErrors(async ({ url, events, secret, alert_email }) => {
      const finalSecret = secret ?? (0, import_crypto.randomBytes)(24).toString("hex");
      const result = await rymi.webhooks.create({ url, events, secret: finalSecret, alert_email });
      const echoed = secret ? result : { ...result, secret: finalSecret, secret_notice: "Store this secret now \u2014 it cannot be retrieved later." };
      return { content: [{ type: "text", text: JSON.stringify(echoed, null, 2) }] };
    })
  );
  server.tool(
    "update_webhook",
    "Update a webhook endpoint. Only provided fields change. Pass `secret` to rotate it.",
    {
      id: import_zod8.z.string(),
      url: import_zod8.z.string().url().optional(),
      events: import_zod8.z.array(import_zod8.z.string()).min(1).optional(),
      secret: import_zod8.z.string().min(16).max(256).optional(),
      alert_email: import_zod8.z.string().email().nullable().optional()
    },
    withToolErrors(async ({ id, ...rest }) => {
      const result = await rymi.webhooks.update(id, rest);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "delete_webhook",
    "WARNING: stops event delivery to this endpoint.",
    { id: import_zod8.z.string() },
    withToolErrors(async ({ id }) => {
      const result = await rymi.webhooks.delete(id);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
}

// src/tools/billing.ts
var import_zod9 = require("zod");
function registerBillingControlTools(server, rymi, isReadOnly) {
  server.tool(
    "estimate_call_cost",
    "Estimate how much balance a call will consume for a custom model stack and duration. Results are usage estimates; surface remaining balance to customers in minutes.",
    {
      stt_model: import_zod9.z.string().optional(),
      llm_model: import_zod9.z.string().optional(),
      tts_model: import_zod9.z.string().optional(),
      duration_seconds: import_zod9.z.number().min(0).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.billing.estimate(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  if (isReadOnly) return;
  server.tool(
    "set_auto_recharge",
    "Configure auto-recharge. `pack_usd` must exceed `threshold_usd` or the API rejects it (recharge-loop guard).",
    {
      enabled: import_zod9.z.boolean().optional(),
      pack_usd: import_zod9.z.number().min(1).max(1e3).optional(),
      threshold_usd: import_zod9.z.number().min(0).max(100).optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.billing.setAutoRecharge(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
  server.tool(
    "set_spend_alerts",
    "Configure spend-alert thresholds and low-balance / email preferences.",
    {
      thresholds_usd: import_zod9.z.array(import_zod9.z.number()).max(10).optional(),
      low_balance_pct: import_zod9.z.number().min(0).max(100).optional(),
      email_enabled: import_zod9.z.boolean().optional()
    },
    withToolErrors(async (params) => {
      const result = await rymi.billing.setAlerts(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    })
  );
}

// package.json
var package_default = {
  name: "@rymi/mcp",
  version: "1.0.0",
  description: "Rymi MCP server \u2014 manage AI voice agents via Model Context Protocol",
  license: "MIT",
  author: "Rymi AI <engineering@rymi.live>",
  homepage: "https://rymi.live",
  keywords: [
    "mcp",
    "model-context-protocol",
    "voice-ai",
    "voice-agent",
    "claude",
    "cursor",
    "rymi"
  ],
  repository: {
    type: "git",
    url: "git+https://github.com/rymi-live/rymi-mcp.git"
  },
  bugs: {
    url: "https://github.com/rymi-live/rymi-mcp/issues"
  },
  publishConfig: {
    access: "public",
    provenance: true
  },
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  bin: {
    "rymi-mcp": "./dist/index.js"
  },
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      require: "./dist/index.js"
    }
  },
  scripts: {
    build: "tsup src/index.ts --format cjs --dts --clean",
    dev: "tsup src/index.ts --format cjs --watch",
    lint: "tsc --noEmit",
    test: "vitest run"
  },
  dependencies: {
    "@modelcontextprotocol/sdk": "^1.11.1",
    "@rymi/node": "workspace:*",
    zod: "^3.23.0"
  },
  devDependencies: {
    tsup: "^8.0.0",
    typescript: "^5.0.0",
    vitest: "^1.6.0"
  },
  files: [
    "dist",
    "README.md",
    "LICENSE"
  ]
};

// src/server.ts
function createServer(apiKey) {
  const rymi = new import_node.default({ apiKey });
  const server = new import_mcp.McpServer({
    name: "rymi",
    version: package_default.version
  });
  const isReadOnly = process.env.RYMI_MCP_READONLY === "1";
  registerAgentTools(server, rymi, isReadOnly);
  registerCallTools(server, rymi, isReadOnly);
  registerNumberTools(server, rymi, isReadOnly);
  registerTelephonyTools(server, rymi, isReadOnly);
  registerKeyTools(server, rymi, isReadOnly);
  registerKnowledgeTools(server, rymi, isReadOnly);
  registerInsightTools(server, rymi, isReadOnly);
  registerDncTools(server, rymi, isReadOnly);
  registerWebhookTools(server, rymi, isReadOnly);
  registerBillingControlTools(server, rymi, isReadOnly);
  if (!isReadOnly) {
    registerCallControlTools(server, rymi);
    registerOutboundCallTools(server, rymi);
    registerPublishTool(server, rymi);
  }
  return server;
}

// src/transport/stdio.ts
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
async function runStdio(server) {
  const transport2 = new import_stdio.StdioServerTransport();
  await server.connect(transport2);
}

// src/transport/http.ts
var import_streamableHttp = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
var import_http = require("http");
var PORT = parseInt(process.env.RYMI_MCP_PORT || "8787", 10);
async function runHttp() {
  const httpServer = (0, import_http.createServer)(async (req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }
    const authHeader = req.headers["authorization"] || "";
    const apiKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
    if (!apiKey) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing Authorization: Bearer <RYMI_API_KEY>" }));
      return;
    }
    const server = createServer(apiKey);
    const transport2 = new import_streamableHttp.StreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
    await server.connect(transport2);
    await transport2.handleRequest(req, res);
  });
  httpServer.listen(PORT, () => {
    process.stderr.write(`Rymi MCP HTTP server listening on port ${PORT}
`);
  });
}

// src/index.ts
var transport = process.argv.includes("--transport") ? process.argv[process.argv.indexOf("--transport") + 1] : "stdio";
if (transport === "http") {
  runHttp().catch((err) => {
    process.stderr.write(`Fatal: ${err.message}
`);
    process.exit(1);
  });
} else {
  const apiKey = process.env.RYMI_API_KEY || "";
  if (!apiKey) {
    process.stderr.write("Error: RYMI_API_KEY environment variable is required.\n");
    process.exit(1);
  }
  const server = createServer(apiKey);
  runStdio(server).catch((err) => {
    process.stderr.write(`Fatal: ${err.message}
`);
    process.exit(1);
  });
}
