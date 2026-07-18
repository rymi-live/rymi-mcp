#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
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

// ../ops-tools/dist/index.js
var require_dist = __commonJS({
  "../ops-tools/dist/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export = (target, all) => {
      for (var name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    var __copyProps2 = (to, from, except, desc) => {
      if (from && typeof from === "object" || typeof from === "function") {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
      }
      return to;
    };
    var __toCommonJS = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export(index_exports, {
      defineTool: () => defineTool,
      opsToolCatalog: () => opsToolCatalog2,
      resolveToolDisposition: () => resolveToolDisposition
    });
    module2.exports = __toCommonJS(index_exports);
    function defineTool(def) {
      return def;
    }
    var PRIVILEGED = /* @__PURE__ */ new Set(["owner", "admin"]);
    function resolveToolDisposition(p) {
      if (p.risk === "read") return "execute";
      if (p.scope === "account" && !PRIVILEGED.has(p.role)) return "deny";
      return p.risk === "write" ? "propose" : "confirm";
    }
    var import_zod = require("zod");
    var agentConfigFields = {
      system_prompt: import_zod.z.string().optional().describe("Full system prompt for the agent. If given without persona/playbook, the server auto-structures it."),
      voice: import_zod.z.string().optional().describe('Voice ID (e.g. "Aoede", "Charon"). Call list_llm_options for valid values. Leave empty for realtime LLMs and Deepgram TTS, which carry their own voice.'),
      language: import_zod.z.string().optional().describe('Primary BCP-47 language tag (e.g. "hi-IN", "en-US").'),
      supported_languages: import_zod.z.array(import_zod.z.string()).optional().describe('All BCP-47 languages the agent should handle, e.g. ["hi-IN","en-US"] for a bilingual agent. The primary `language` is added automatically if omitted here.'),
      llm_provider: import_zod.z.enum(["gemini", "openai", "anthropic", "sarvam"]).optional(),
      llm_model: import_zod.z.string().optional().describe('LLM model id from list_llm_options (e.g. "gemini-2.5-flash", "sarvam-105b").'),
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
    function foldPromptMode(params) {
      const { prompt_mode, ...rest } = params;
      if (!prompt_mode) return rest;
      return { ...rest, advanced: { ...rest.advanced || {}, prompt_mode } };
    }
    var agentTools = [
      defineTool({
        name: "list_agents",
        description: "List all your Rymi AI voice agents.",
        scope: "agent",
        risk: "read",
        input: {
          limit: import_zod.z.number().int().min(1).max(500).optional().describe("Max agents to return (default 50)"),
          offset: import_zod.z.number().int().min(0).optional().describe("Pagination offset")
        },
        run: (client, { limit, offset }) => client.agents.list({ limit, offset })
      }),
      defineTool({
        name: "get_agent",
        description: "Retrieve a single Rymi voice agent by ID.",
        scope: "agent",
        risk: "read",
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.retrieve(agent_id)
      }),
      defineTool({
        name: "list_llm_options",
        description: "Fetch all available LLM models and voices you can use when creating or updating an agent. Always call this before create_agent to pick valid values.",
        scope: "agent",
        risk: "read",
        input: {},
        run: (client) => client.agents.llmOptions()
      }),
      defineTool({
        name: "list_voices",
        description: "List available agent/TTS voices, optionally filtered by provider or model. Much smaller payload than list_llm_options \u2014 use this to pick a `voice` value for create_agent/update_agent.",
        scope: "agent",
        risk: "read",
        input: {
          provider: import_zod.z.string().optional().describe('Filter to one voice provider, e.g. "elevenlabs", "sarvam", "gemini", "cartesia", "deepgram".'),
          model_id: import_zod.z.string().optional().describe("Filter to voices compatible with a given model id (matched against the voice's supported_model_ids).")
        },
        run: async (client, { provider, model_id }) => {
          const { voices } = await client.agents.llmOptions();
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
          return { voices: trimmed, total: trimmed.length };
        }
      }),
      defineTool({
        name: "preview_stack",
        description: "Preview the resolved per-language model stack (STT/LLM/TTS), blockers, warnings, and model diffs for a set of supported languages \u2014 without saving. Use before create/update to confirm a multi-language setup is valid.",
        scope: "agent",
        risk: "read",
        input: {
          supported_languages: import_zod.z.array(import_zod.z.string()).min(1).describe('BCP-47 languages to resolve a stack for, e.g. ["hi-IN","en-US"].'),
          language: import_zod.z.string().optional().describe("Primary BCP-47 language (defaults to the first supported language)."),
          current_provider_config: import_zod.z.record(import_zod.z.any()).optional().describe("Existing provider_config to diff against, if any.")
        },
        run: (client, params) => client.agents.previewStack(params)
      }),
      defineTool({
        name: "list_calls_for_agent",
        description: "List calls made with a specific agent.",
        scope: "agent",
        risk: "read",
        input: {
          agent_id: import_zod.z.string().uuid(),
          limit: import_zod.z.number().int().min(1).max(200).optional(),
          offset: import_zod.z.number().int().min(0).optional(),
          status: import_zod.z.string().optional().describe("Filter by call status")
        },
        run: (client, { agent_id, ...params }) => client.agents.listCalls(agent_id, params)
      }),
      defineTool({
        name: "validate_agent_publish",
        description: "Check whether an agent is ready to go live. Returns a validation report without persisting any changes.",
        scope: "agent",
        risk: "read",
        input: {
          agent_id: import_zod.z.string().uuid().optional().describe("Merge validation with a persisted agent"),
          name: import_zod.z.string().optional(),
          voice: import_zod.z.string().optional(),
          persona: import_zod.z.record(import_zod.z.any()).optional(),
          playbook: import_zod.z.record(import_zod.z.any()).optional()
        },
        run: (client, params) => client.agents.validatePublish(params)
      }),
      defineTool({
        name: "apply_agent_changes",
        description: "Validate and resolve a flat key/value change-set against the AgentConfig field registry. Does NOT persist \u2014 follow up with update_agent.",
        scope: "agent",
        risk: "read",
        input: {
          agent_id: import_zod.z.string().uuid().describe("Agent to load currentConfig from (recommended)"),
          changes: import_zod.z.array(import_zod.z.object({ key: import_zod.z.string(), value: import_zod.z.any() })).describe("Array of {key, value} field changes"),
          mode: import_zod.z.enum(["create", "edit"]).describe("create = new agent, edit = updating existing"),
          lenient: import_zod.z.boolean().optional().describe("Skip unknown-field hard-fail (not recommended)")
        },
        run: async (client, { agent_id, changes, mode, lenient }) => {
          const current = await client.agents.retrieve(agent_id);
          const normalizedChanges = changes.map(({ key, value }) => ({ key, value }));
          return client.agents.applyChanges({
            currentConfig: current,
            changes: normalizedChanges,
            mode,
            lenient
          });
        }
      }),
      defineTool({
        name: "enrich_company",
        description: "Use AI + Google Search grounding to auto-generate a company description from a website URL, suitable for an agent's persona.",
        scope: "agent",
        risk: "read",
        input: {
          company_name: import_zod.z.string().min(1),
          website_url: import_zod.z.string().url()
        },
        run: (client, { company_name, website_url }) => client.agents.enrichCompany({ companyName: company_name, websiteUrl: website_url })
      }),
      defineTool({
        name: "generate_agent_draft",
        description: "Use AI to generate an agent configuration draft from a plain-text description.",
        scope: "agent",
        risk: "read",
        input: {
          prompt: import_zod.z.string().min(1).describe("Description of the agent you want to create"),
          mode: import_zod.z.enum(["create", "edit"]).optional().default("create"),
          current_config: import_zod.z.record(import_zod.z.any()).optional().describe("Existing config when editing"),
          options: import_zod.z.record(import_zod.z.any()).optional().describe("Override hints e.g. {voice, llm_provider}")
        },
        run: (client, params) => client.agents.generate({ prompt: params.prompt, options: params.options })
      }),
      defineTool({
        name: "create_agent",
        description: 'Create a new Rymi AI voice agent. Call list_llm_options first to discover valid voice and model values. For a multi-language agent, set supported_languages (e.g. ["hi-IN","en-US"]).',
        scope: "agent",
        risk: "write",
        input: {
          name: import_zod.z.string().min(1).describe("Agent display name"),
          ...agentConfigFields
        },
        run: (client, params) => client.agents.create(foldPromptMode(params))
      }),
      defineTool({
        name: "update_agent",
        description: "Update an existing Rymi voice agent's configuration. Only the fields you pass are changed; nullable fields accept null to clear them.",
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod.z.string().uuid().describe("The agent UUID to update"),
          name: import_zod.z.string().optional(),
          ...agentConfigFields,
          chat_summary: import_zod.z.string().nullable().optional()
        },
        run: (client, { agent_id, ...params }) => client.agents.update(agent_id, foldPromptMode(params))
      }),
      defineTool({
        name: "delete_agent",
        description: "Permanently delete a Rymi voice agent.",
        scope: "agent",
        risk: "sensitive",
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID to delete") },
        run: (client, { agent_id }) => client.agents.delete(agent_id)
      }),
      defineTool({
        name: "clone_agent",
        description: 'Duplicate an existing agent. The copy gets " (Copy)" appended to its name.',
        scope: "agent",
        risk: "write",
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID to clone") },
        run: (client, { agent_id }) => client.agents.clone(agent_id)
      })
    ];
    var import_zod2 = require("zod");
    var callTools = [
      defineTool({
        name: "list_calls",
        description: "List previous and active calls across your account.",
        scope: "agent",
        risk: "read",
        input: {
          limit: import_zod2.z.number().int().min(1).max(200).optional().describe("Max calls to return"),
          offset: import_zod2.z.number().int().min(0).optional().describe("Pagination offset"),
          cursor: import_zod2.z.string().optional().describe("Opaque cursor for keyset pagination"),
          status: import_zod2.z.string().optional().describe("Filter by call status (e.g. completed, in_progress, failed)")
        },
        run: (client, params) => client.calls.list(params)
      }),
      defineTool({
        name: "list_active_calls",
        description: "List calls currently in progress.",
        scope: "agent",
        risk: "read",
        input: {
          limit: import_zod2.z.number().int().min(1).max(200).optional(),
          offset: import_zod2.z.number().int().min(0).optional()
        },
        run: (client, params) => client.calls.active(params)
      }),
      defineTool({
        name: "get_call",
        description: "Retrieve details, participants, status, duration, and cost for a single call.",
        scope: "agent",
        risk: "read",
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.retrieve(call_id)
      }),
      defineTool({
        name: "get_call_summary",
        description: "Retrieve the post-call summary for a call.",
        scope: "agent",
        risk: "read",
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.summary(call_id)
      }),
      defineTool({
        name: "get_call_transcript",
        description: "Retrieve the full transcript for a call. May contain personal data \u2014 handle accordingly.",
        scope: "agent",
        risk: "read",
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.transcript(call_id)
      }),
      defineTool({
        name: "get_call_recording",
        description: "Retrieve recording metadata (e.g. playback URL) for a call, when recording is enabled.",
        scope: "agent",
        risk: "read",
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.recording(call_id)
      }),
      defineTool({
        name: "get_call_queue_stats",
        description: "Retrieve current outbound call queue statistics.",
        scope: "agent",
        risk: "read",
        input: {},
        run: (client) => client.calls.queueStats()
      }),
      defineTool({
        name: "reprocess_call",
        description: "Re-run post-call intelligence (summary, extraction, evaluation) for a call.",
        scope: "agent",
        risk: "write",
        input: { call_id: import_zod2.z.string().describe("The call ID to reprocess") },
        run: (client, { call_id }) => client.calls.reprocess(call_id)
      }),
      defineTool({
        name: "create_call",
        description: "WARNING: places a real, billable PSTN call. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account \u2014 omit it to use the agent's attached number. `identity` is the destination in strict E.164 (e.g. +15555550123).",
        scope: "agent",
        risk: "sensitive",
        input: {
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
        run: (client, params) => client.calls.create(params)
      }),
      defineTool({
        name: "batch_call",
        description: "Queue up to 500 outbound PSTN recipients in one request. WARNING: places real phone calls and incurs per-minute charges. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account.",
        scope: "agent",
        risk: "sensitive",
        input: {
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
        run: (client, params) => client.calls.batch(params)
      }),
      defineTool({
        name: "end_call",
        description: "WARNING: immediately terminates an in-progress call. The call transitions to completed and post-call processing runs.",
        scope: "agent",
        risk: "sensitive",
        input: { call_id: import_zod2.z.string().describe("The call ID to end") },
        run: (client, { call_id }) => client.calls.end(call_id)
      }),
      defineTool({
        name: "add_call_participant",
        description: "WARNING: dials/adds participants to a live call (warm transfer / conference). PSTN additions are billable.",
        scope: "agent",
        risk: "sensitive",
        input: {
          call_id: import_zod2.z.string().describe("The in-progress call ID"),
          participants: import_zod2.z.array(import_zod2.z.object({
            transport: import_zod2.z.enum(["webrtc", "pstn"]),
            identity: import_zod2.z.string().describe("Destination phone number (pstn, E.164) or participant identity (webrtc)"),
            from_number: import_zod2.z.string().optional().describe("Caller ID for pstn"),
            metadata: import_zod2.z.record(import_zod2.z.any()).optional()
          })).min(1)
        },
        run: (client, { call_id, participants }) => client.calls.addParticipants(call_id, { participants })
      })
    ];
    var import_zod3 = require("zod");
    var numberTools = [
      defineTool({
        name: "list_numbers",
        description: "List all phone numbers on your Rymi account and which agent each is attached to.",
        scope: "account",
        risk: "read",
        input: {
          limit: import_zod3.z.number().int().min(1).max(500).optional(),
          offset: import_zod3.z.number().int().min(0).optional()
        },
        run: (client, params) => client.numbers.list(params)
      }),
      defineTool({
        name: "register_number",
        description: "Register a phone number on your account, optionally attaching it to an agent.",
        scope: "account",
        risk: "write",
        input: {
          number: import_zod3.z.string().describe("Phone number in E.164 format (e.g. +14155550123)"),
          agent_id: import_zod3.z.string().uuid().optional().describe("Agent to attach the number to on registration")
        },
        run: (client, { number, agent_id }) => client.numbers.register(number, agent_id ? { agent_id } : {})
      }),
      defineTool({
        name: "attach_number",
        description: "Attach an existing number to an agent so inbound calls route to it.",
        scope: "account",
        risk: "write",
        input: {
          number: import_zod3.z.string().describe("Phone number in E.164 format"),
          agent_id: import_zod3.z.string().uuid().describe("Agent to route this number to")
        },
        run: (client, { number, agent_id }) => client.numbers.attach(number, agent_id)
      }),
      defineTool({
        name: "remove_number",
        description: "Remove a phone number from your account. The number stops routing to any agent.",
        scope: "account",
        risk: "sensitive",
        input: { number: import_zod3.z.string().describe("Phone number in E.164 format") },
        run: (client, { number }) => client.numbers.remove(number)
      })
    ];
    var telephonyTools = [
      defineTool({
        name: "telephony_status",
        description: "Report whether a telephony carrier is connected, and which provider/account.",
        scope: "account",
        risk: "read",
        input: {},
        run: (client) => client.telephony.status()
      }),
      defineTool({
        name: "list_telephony_numbers",
        description: "List numbers available on the connected telephony carrier account.",
        scope: "account",
        risk: "read",
        input: {},
        run: (client) => client.telephony.numbers()
      })
    ];
    var keyTools = [
      defineTool({
        name: "list_publishable_keys",
        description: "List publishable (browser-safe) keys and which agent/channels each is scoped to. Returns key prefixes only, never full secrets.",
        scope: "account",
        risk: "read",
        input: {},
        run: (client) => client.keys.listPublishable()
      })
    ];
    var import_zod4 = require("zod");
    var knowledgeTools = [
      defineTool({
        name: "list_knowledge_sources",
        description: "List the knowledge sources (RAG context) attached to an agent.",
        scope: "agent",
        risk: "read",
        input: { agent_id: import_zod4.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.listKnowledgeSources(agent_id)
      }),
      defineTool({
        name: "list_agent_changes",
        description: "List recorded configuration changes for an agent (for auditing or before an undo).",
        scope: "agent",
        risk: "read",
        input: {
          agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
          since: import_zod4.z.string().optional().describe("ISO timestamp \u2014 only return changes after this time")
        },
        run: (client, { agent_id, since }) => client.agents.listChanges(agent_id, since ? { since } : {})
      }),
      defineTool({
        name: "add_knowledge_source",
        description: "Add a knowledge source to an agent from raw text or a URL (the URL is fetched and ingested).",
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
          kind: import_zod4.z.enum(["text", "url"]).describe("Source type"),
          title: import_zod4.z.string().min(1).describe("Human-readable title for the source"),
          text: import_zod4.z.string().optional().describe('Required when kind="text": the raw content to ingest'),
          url: import_zod4.z.string().url().optional().describe('Required when kind="url": the page to fetch and ingest')
        },
        run: (client, { agent_id, kind, title, text, url }) => {
          const data = kind === "text" ? { kind: "text", title, text: text ?? "" } : { kind: "url", title, url: url ?? "" };
          return client.agents.addKnowledgeSource(agent_id, data);
        }
      }),
      defineTool({
        name: "delete_knowledge_source",
        description: "Delete a knowledge source from an agent.",
        scope: "agent",
        risk: "sensitive",
        input: {
          agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
          source_id: import_zod4.z.string().describe("The knowledge source ID to delete")
        },
        run: (client, { agent_id, source_id }) => client.agents.deleteKnowledgeSource(agent_id, source_id)
      }),
      defineTool({
        name: "undo_agent_change",
        description: "Undo a single recorded configuration change, reverting that field to its previous value.",
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod4.z.string().uuid().describe("The agent UUID"),
          change_id: import_zod4.z.string().describe("The change_id to undo (from list_agent_changes)")
        },
        run: (client, { agent_id, change_id }) => client.agents.undoChange(agent_id, change_id)
      })
    ];
    var import_zod5 = require("zod");
    var insightTools = [
      defineTool({
        name: "get_usage_summary",
        description: "Get this account's usage summary: remaining voice-runtime MINUTES, Studio AI unit usage, and post-call intelligence usage. Voice balance is reported in minutes, not dollars.",
        scope: "account",
        risk: "read",
        input: {},
        run: (client) => client.billing.usageSummary()
      }),
      defineTool({
        name: "list_agent_templates",
        description: "List published agent templates. Use a template's `defaults` as the starting config for create_agent.",
        scope: "agent",
        risk: "read",
        input: {},
        run: (client) => client.templates.list()
      }),
      defineTool({
        name: "list_eval_runs",
        description: "List previous evaluation runs for an agent.",
        scope: "agent",
        risk: "read",
        input: { agent_id: import_zod5.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.listEvalRuns(agent_id)
      }),
      defineTool({
        name: "get_eval_run",
        description: "Retrieve a single evaluation run, including per-scenario scores.",
        scope: "agent",
        risk: "read",
        input: {
          agent_id: import_zod5.z.string().uuid().describe("The agent UUID"),
          run_id: import_zod5.z.string().describe("The evaluation run ID")
        },
        run: (client, { agent_id, run_id }) => client.agents.getEvalRun(agent_id, run_id)
      }),
      defineTool({
        name: "run_evals",
        description: 'Run the evaluation suite for an agent. mode="synthetic" (default) uses the offline scorer; mode="live" runs the model-driven runner (consumes Studio AI units). Set judge=true to supplement the synthetic heuristics with an opt-in LLM judge (requires a Gemini key; consumes Studio AI units).',
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod5.z.string().uuid().describe("The agent UUID to evaluate"),
          mode: import_zod5.z.enum(["synthetic", "live"]).optional().describe("Evaluation mode (default synthetic)"),
          judge: import_zod5.z.boolean().optional().describe("Supplement synthetic heuristics with the LLM judge (default false)")
        },
        run: (client, { agent_id, mode, judge }) => {
          const params = {};
          if (mode) params.mode = mode;
          if (judge) params.judge = judge;
          return client.agents.runEvals(agent_id, params);
        }
      }),
      defineTool({
        name: "run_eval_suite",
        description: "Run the eval SUITE across many agents at once (agents \xD7 seeded scenarios) with bounded concurrency. One eval run is persisted per agent (visible in the per-agent eval UI); the aggregate report is returned. Set judge=true to add the LLM judge (requires a Gemini key; consumes Studio AI units).",
        scope: "agent",
        risk: "write",
        input: {
          agent_ids: import_zod5.z.array(import_zod5.z.string().uuid()).min(1).describe("Agent UUIDs to evaluate"),
          scenario_ids: import_zod5.z.array(import_zod5.z.string()).optional().describe("Optional subset of seeded scenario ids; omit to run all"),
          concurrency: import_zod5.z.number().int().positive().optional().describe("Max agents evaluated in parallel (clamped to a safe ceiling)"),
          judge: import_zod5.z.boolean().optional().describe("Supplement synthetic heuristics with the LLM judge (default false)")
        },
        run: (client, { agent_ids, scenario_ids, concurrency, judge }) => client.agents.runEvalSuite({
          agentIds: agent_ids,
          ...scenario_ids ? { scenarioIds: scenario_ids } : {},
          ...concurrency ? { concurrency } : {},
          ...judge ? { judge } : {}
        })
      })
    ];
    var import_zod6 = require("zod");
    var publishTools = [
      defineTool({
        name: "publish_agent",
        description: "Publish a Rymi voice agent to make its current saved configuration live. IMPORTANT: this immediately makes the agent callable by end users. Returns published:false with a blockers list when the config has unresolved issues.",
        scope: "agent",
        risk: "sensitive",
        input: {
          agent_id: import_zod6.z.string().uuid().describe("The agent UUID to publish")
        },
        // Returns the raw { published, blockers? } result. Unlike the old MCP
        // handler, a published:false-with-blockers response is NOT flagged as a
        // protocol error — blockers are valid data every consumer (MCP client,
        // studio harness) reads from the result directly.
        run: (client, { agent_id }) => client.agents.publish(agent_id)
      })
    ];
    var import_zod7 = require("zod");
    var dncTools = [
      defineTool({
        name: "list_dnc",
        description: "List all numbers on your Do-Not-Call registry.",
        scope: "account",
        risk: "read",
        input: {
          limit: import_zod7.z.number().int().min(1).max(500).optional(),
          offset: import_zod7.z.number().int().min(0).optional()
        },
        run: (client, params) => client.dnc.list(params)
      }),
      defineTool({
        name: "check_dnc",
        description: "Check whether phone numbers are on the Do-Not-Call registry. Read-only \u2014 adds nothing.",
        scope: "account",
        risk: "read",
        input: { phone_numbers: import_zod7.z.array(import_zod7.z.string()).min(1).max(500).describe("E.164 numbers to check") },
        run: (client, { phone_numbers }) => client.dnc.check({ phone_numbers })
      }),
      defineTool({
        name: "add_dnc",
        description: "Add a phone number to the Do-Not-Call registry so outbound calls to it are blocked.",
        scope: "account",
        risk: "write",
        input: {
          phone_number: import_zod7.z.string().describe("Phone number (any format; normalized to E.164)"),
          reason: import_zod7.z.string().optional()
        },
        run: (client, { phone_number, reason }) => client.dnc.add({ phone_number, reason })
      }),
      defineTool({
        name: "add_dnc_batch",
        description: "Add up to 1000 numbers to the Do-Not-Call registry. Invalid numbers are skipped and returned in `invalid`.",
        scope: "account",
        risk: "write",
        input: {
          phone_numbers: import_zod7.z.array(import_zod7.z.string()).min(1).max(1e3),
          reason: import_zod7.z.string().optional()
        },
        run: (client, { phone_numbers, reason }) => client.dnc.addBatch({ phone_numbers, reason })
      }),
      defineTool({
        name: "remove_dnc",
        description: "WARNING: removes a number from the Do-Not-Call registry, re-enabling outbound calls to it.",
        scope: "account",
        risk: "sensitive",
        input: { phone: import_zod7.z.string().describe("Phone number to remove") },
        run: (client, { phone }) => client.dnc.remove(phone)
      })
    ];
    var import_zod8 = require("zod");
    var import_crypto = require("crypto");
    var webhookTools = [
      defineTool({
        name: "list_webhooks",
        description: "List your registered webhook endpoints. Signing secrets are never returned.",
        scope: "account",
        risk: "read",
        input: {
          limit: import_zod8.z.number().int().min(1).max(500).optional(),
          offset: import_zod8.z.number().int().min(0).optional()
        },
        run: (client, params) => client.webhooks.list(params)
      }),
      defineTool({
        name: "create_webhook",
        description: "Register a webhook to receive call lifecycle events (e.g. call.completed, transcript.ready). URL must be public https. If you omit `secret`, one is generated and shown ONCE in the response \u2014 store it to verify signatures.",
        scope: "account",
        risk: "write",
        input: {
          url: import_zod8.z.string().url().describe("Public https endpoint"),
          events: import_zod8.z.array(import_zod8.z.string()).min(1).describe("Event names to subscribe to"),
          secret: import_zod8.z.string().min(16).max(256).optional().describe("Signing secret; auto-generated if omitted"),
          alert_email: import_zod8.z.string().email().optional()
        },
        run: async (client, { url, events, secret, alert_email }) => {
          const finalSecret = secret ?? (0, import_crypto.randomBytes)(24).toString("hex");
          const result = await client.webhooks.create({ url, events, secret: finalSecret, alert_email });
          return secret ? result : { ...result, secret: finalSecret, secret_notice: "Store this secret now \u2014 it cannot be retrieved later." };
        }
      }),
      defineTool({
        name: "update_webhook",
        description: "Update a webhook endpoint. Only provided fields change. Pass `secret` to rotate it.",
        scope: "account",
        risk: "write",
        input: {
          id: import_zod8.z.string(),
          url: import_zod8.z.string().url().optional(),
          events: import_zod8.z.array(import_zod8.z.string()).min(1).optional(),
          secret: import_zod8.z.string().min(16).max(256).optional(),
          alert_email: import_zod8.z.string().email().nullable().optional()
        },
        run: (client, { id, ...rest }) => client.webhooks.update(id, rest)
      }),
      defineTool({
        name: "delete_webhook",
        description: "WARNING: stops event delivery to this endpoint.",
        scope: "account",
        risk: "sensitive",
        input: { id: import_zod8.z.string() },
        run: (client, { id }) => client.webhooks.delete(id)
      })
    ];
    var import_zod9 = require("zod");
    var billingTools = [
      defineTool({
        name: "estimate_call_cost",
        description: "Estimate how much balance a call will consume for a custom model stack and duration. Results are usage estimates; surface remaining balance to customers in minutes.",
        scope: "account",
        risk: "read",
        input: {
          stt_model: import_zod9.z.string().optional(),
          llm_model: import_zod9.z.string().optional(),
          tts_model: import_zod9.z.string().optional(),
          duration_seconds: import_zod9.z.number().min(0).optional()
        },
        run: (client, params) => client.billing.estimate(params)
      }),
      defineTool({
        name: "set_auto_recharge",
        description: "Configure auto-recharge. `pack_usd` must exceed `threshold_usd` or the API rejects it (recharge-loop guard).",
        scope: "account",
        risk: "sensitive",
        input: {
          enabled: import_zod9.z.boolean().optional(),
          pack_usd: import_zod9.z.number().min(1).max(1e3).optional(),
          threshold_usd: import_zod9.z.number().min(0).max(100).optional()
        },
        run: (client, params) => client.billing.setAutoRecharge(params)
      }),
      defineTool({
        name: "set_spend_alerts",
        description: "Configure spend-alert thresholds and low-balance / email preferences.",
        scope: "account",
        risk: "write",
        input: {
          thresholds_usd: import_zod9.z.array(import_zod9.z.number()).max(10).optional(),
          low_balance_pct: import_zod9.z.number().min(0).max(100).optional(),
          email_enabled: import_zod9.z.boolean().optional()
        },
        run: (client, params) => client.billing.setAlerts(params)
      })
    ];
    var import_zod10 = require("zod");
    var campaignTools = [
      // ─── reads ───────────────────────────────────────────────────────────────
      defineTool({
        name: "list_campaigns",
        description: "List campaigns for the authenticated tenant, paginated.",
        scope: "agent",
        risk: "read",
        input: {
          limit: import_zod10.z.number().int().min(1).max(200).optional().describe("Max campaigns to return"),
          offset: import_zod10.z.number().int().min(0).optional().describe("Pagination offset"),
          status: import_zod10.z.enum(["draft", "scheduled", "running", "paused", "completed", "failed", "archived"]).optional().describe("Filter by campaign status"),
          type: import_zod10.z.enum(["outbound", "inbound"]).optional().describe("Filter by campaign type"),
          agent_id: import_zod10.z.string().uuid().optional().describe("Filter by agent")
        },
        run: (client, params) => client.campaigns.list(params)
      }),
      defineTool({
        name: "get_campaign",
        description: "Retrieve a single campaign by id, including its goal, policies, status, and stat counters.",
        scope: "agent",
        risk: "read",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.get(campaign_id)
      }),
      defineTool({
        name: "get_campaign_report",
        description: "Retrieve the campaign report: stat_* summary counters plus outcome/sentiment/hourly/snapshot distributions. Cost is reported in credits, durations in minutes.",
        scope: "agent",
        risk: "read",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.report(campaign_id)
      }),
      defineTool({
        name: "list_campaign_attempts",
        description: "List a campaign's dial attempts, paginated.",
        scope: "agent",
        risk: "read",
        input: {
          campaign_id: import_zod10.z.string().describe("The campaign ID"),
          limit: import_zod10.z.number().int().min(1).max(200).optional(),
          offset: import_zod10.z.number().int().min(0).optional(),
          status: import_zod10.z.string().optional().describe("Filter by attempt status (e.g. completed, failed, skipped)")
        },
        run: (client, { campaign_id, ...params }) => client.campaigns.attempts(campaign_id, params)
      }),
      defineTool({
        name: "list_campaign_suggestions",
        description: "List a campaign's improvement suggestions (from the detectors + LLM proposal engine), paginated.",
        scope: "agent",
        risk: "read",
        input: {
          campaign_id: import_zod10.z.string().describe("The campaign ID"),
          limit: import_zod10.z.number().int().min(1).max(200).optional(),
          offset: import_zod10.z.number().int().min(0).optional(),
          status: import_zod10.z.string().optional().describe("Filter by suggestion status (proposed, accepted, dismissed)")
        },
        run: (client, { campaign_id, ...params }) => client.campaigns.suggestions(campaign_id, params)
      }),
      defineTool({
        name: "list_contacts",
        description: "List tenant-level contacts, paginated.",
        scope: "agent",
        risk: "read",
        input: {
          limit: import_zod10.z.number().int().min(1).max(200).optional(),
          offset: import_zod10.z.number().int().min(0).optional()
        },
        run: (client, params) => client.contacts.list(params)
      }),
      // ─── writes ──────────────────────────────────────────────────────────────
      defineTool({
        name: "create_campaign",
        description: "Create a new campaign in draft status against a published agent. Does not launch it or place any calls.",
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod10.z.string().uuid().describe("The agent that will handle campaign calls"),
          type: import_zod10.z.enum(["outbound", "inbound"]).describe("Campaign type"),
          name: import_zod10.z.string().describe("Human-readable campaign name"),
          goal: import_zod10.z.object({
            goal_type: import_zod10.z.string(),
            success_field: import_zod10.z.string(),
            success_when: import_zod10.z.record(import_zod10.z.any()),
            secondary_fields: import_zod10.z.array(import_zod10.z.string()).optional(),
            human_label: import_zod10.z.string()
          }).optional().describe("The success goal this campaign is measured against"),
          schedule_policy: import_zod10.z.record(import_zod10.z.any()).optional(),
          retry_policy: import_zod10.z.record(import_zod10.z.any()).optional(),
          concurrency_policy: import_zod10.z.record(import_zod10.z.any()).optional(),
          automation_policy: import_zod10.z.record(import_zod10.z.any()).optional(),
          reporting_policy: import_zod10.z.record(import_zod10.z.any()).optional(),
          metadata: import_zod10.z.record(import_zod10.z.any()).optional()
        },
        run: (client, params) => client.campaigns.create(params)
      }),
      defineTool({
        name: "import_campaign_contacts",
        description: "Import inline contact rows (JSON or CSV) into a campaign: creates/merges contacts and attaches them as campaign members in one call.",
        scope: "agent",
        risk: "write",
        input: {
          campaign_id: import_zod10.z.string().describe("The campaign ID"),
          contacts: import_zod10.z.array(import_zod10.z.record(import_zod10.z.any())).optional().describe("Inline contact rows as JSON objects"),
          csv: import_zod10.z.string().optional().describe("Contact rows as CSV text")
        },
        run: (client, { campaign_id, ...data }) => client.campaigns.members.import(campaign_id, data)
      }),
      defineTool({
        name: "launch_campaign",
        description: "WARNING: launches a campaign, which places real outbound PSTN calls at scale and incurs per-minute charges for every recipient dialed. Validates launch blockers first (published snapshot, valid members, caller ID, DNC, credits, follow-up connectors); if blockers fail, no calls are placed.",
        scope: "agent",
        risk: "sensitive",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to launch") },
        run: (client, { campaign_id }) => client.campaigns.launch(campaign_id)
      }),
      defineTool({
        name: "pause_campaign",
        description: "Pause a running campaign. In-flight calls finish naturally; no new attempts are scheduled until resumed.",
        scope: "agent",
        risk: "write",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to pause") },
        run: (client, { campaign_id }) => client.campaigns.pause(campaign_id)
      }),
      defineTool({
        name: "resume_campaign",
        description: "Resume a paused campaign. WARNING: resuming re-enables outbound dialing and will incur further per-minute charges as attempts continue.",
        scope: "agent",
        risk: "sensitive",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to resume") },
        run: (client, { campaign_id }) => client.campaigns.resume(campaign_id)
      }),
      defineTool({
        name: "accept_campaign_suggestion",
        description: "Accept an improvement suggestion. Agent-editing suggestions create an agent-changes draft for review; campaign-policy suggestions patch the campaign directly.",
        scope: "agent",
        risk: "write",
        input: {
          campaign_id: import_zod10.z.string().describe("The campaign ID"),
          suggestion_id: import_zod10.z.string().describe("The suggestion ID to accept")
        },
        run: (client, { campaign_id, suggestion_id }) => client.campaigns.acceptSuggestion(campaign_id, suggestion_id)
      })
    ];
    var opsToolCatalog2 = [
      ...agentTools,
      ...callTools,
      ...numberTools,
      ...telephonyTools,
      ...keyTools,
      ...knowledgeTools,
      ...insightTools,
      ...publishTools,
      ...dncTools,
      ...webhookTools,
      ...billingTools,
      ...campaignTools
    ];
    var names = /* @__PURE__ */ new Set();
    for (const tool of opsToolCatalog2) {
      if (names.has(tool.name)) throw new Error(`Duplicate ops tool name: ${tool.name}`);
      names.add(tool.name);
    }
  }
});

// src/server.ts
var import_mcp = require("@modelcontextprotocol/sdk/server/mcp.js");
var import_node = __toESM(require("@rymi/node"));
var import_ops_tools = __toESM(require_dist());

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

// package.json
var package_default = {
  name: "@rymi/mcp",
  version: "2.0.0",
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
    "@rymi/ops-tools": "workspace:*",
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
function createServer(apiKey2) {
  const rymi = new import_node.default({ apiKey: apiKey2 });
  const server2 = new import_mcp.McpServer({
    name: "rymi",
    version: package_default.version
  });
  const isReadOnly = process.env.RYMI_MCP_READONLY === "1";
  for (const tool of import_ops_tools.opsToolCatalog) {
    if (isReadOnly && tool.risk !== "read") continue;
    server2.tool(
      tool.name,
      tool.description,
      tool.input,
      withToolErrors(async (params) => {
        const result = await tool.run(rymi, params);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      })
    );
  }
  return server2;
}

// src/transport/stdio.ts
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
async function runStdio(server2) {
  const transport2 = new import_stdio.StdioServerTransport();
  await server2.connect(transport2);
}

// src/index.ts
var transport = process.argv.includes("--transport") ? process.argv[process.argv.indexOf("--transport") + 1] : "stdio";
if (transport !== "stdio") {
  process.stderr.write(
    `Error: --transport ${transport} was removed in @rymi/mcp 2.0.0; this package is stdio-only.
For an HTTP endpoint use the hosted one: https://mcp.rymi.live/mcp
  \u2014 add it as a custom connector (OAuth, no key), or pass a rymi_ secret key as a Bearer token.
See https://docs.rymi.live/api/mcp
`
  );
  process.exit(1);
}
var apiKey = process.env.RYMI_API_KEY || "";
if (!apiKey) {
  process.stderr.write("Error: RYMI_API_KEY environment variable is required.\n");
  process.exit(1);
}
var server = createServer(apiKey);
runStdio(server).catch((err) => {
  process.stderr.write(`Fatal: ${err.message}
`);
  process.exit(1);
});
