#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../shared-types/dist/safeUrl.js
var safeUrl_exports = {};
__export(safeUrl_exports, {
  isSafeUrl: () => isSafeUrl
});
function unmapIpv4(v6) {
  const dotted = /^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(v6);
  if (dotted)
    return dotted[1];
  const hex = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/.exec(v6);
  if (!hex)
    return null;
  const high = parseInt(hex[1], 16);
  const low = parseInt(hex[2], 16);
  return [high >> 8, high & 255, low >> 8, low & 255].join(".");
}
function isBlockedHost(host) {
  const bare = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  if (bare === "localhost" || bare === "0.0.0.0" || bare === "::")
    return true;
  if (bare.endsWith(".local") || bare.endsWith(".internal") || bare.endsWith(".localhost"))
    return true;
  if (/^127\./.test(bare))
    return true;
  if (/^10\./.test(bare))
    return true;
  if (/^192\.168\./.test(bare))
    return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(bare))
    return true;
  if (/^169\.254\./.test(bare))
    return true;
  const v6 = bare.toLowerCase();
  if (v6 === "::1")
    return true;
  if (/^f[cd][0-9a-f]{2}:/.test(v6))
    return true;
  if (/^fe[89ab][0-9a-f]:/.test(v6))
    return true;
  const mapped = unmapIpv4(v6);
  if (mapped)
    return isBlockedHost(mapped);
  return false;
}
function isSafeUrl(raw, options = {}) {
  const protocols = options.protocols ?? ["http:", "https:"];
  let url;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (!protocols.includes(url.protocol))
    return false;
  return !isBlockedHost(url.hostname.toLowerCase());
}
var init_safeUrl = __esm({
  "../shared-types/dist/safeUrl.js"() {
    "use strict";
  }
});

// ../shared-types/dist/agentTools.js
var agentTools_exports = {};
__export(agentTools_exports, {
  API_SECRETS_PROVIDER: () => API_SECRETS_PROVIDER,
  API_TOOL_AUTH_HEADER_PATTERN: () => API_TOOL_AUTH_HEADER_PATTERN,
  API_TOOL_NAME_PATTERN: () => API_TOOL_NAME_PATTERN,
  API_TOOL_RESERVED_FIELD_NAMES: () => API_TOOL_RESERVED_FIELD_NAMES,
  API_TOOL_SECRET_REF_PATTERN: () => API_TOOL_SECRET_REF_PATTERN,
  BUILTIN_TOOL_CATALOG: () => BUILTIN_TOOL_CATALOG,
  MCP_CONNECT_TIMEOUT_MS: () => MCP_CONNECT_TIMEOUT_MS,
  MCP_SERVER_TOOL_ID: () => MCP_SERVER_TOOL_ID,
  SECRET_NAME_PATTERN: () => SECRET_NAME_PATTERN,
  connectionStatus: () => connectionStatus,
  isAgentToolEnabled: () => isAgentToolEnabled,
  readMcpServerBinding: () => readMcpServerBinding,
  toToolCapabilitySafeView: () => toToolCapabilitySafeView
});
function readMcpServerBinding(binding) {
  const raw = binding?.provider_settings ?? {};
  const url = typeof raw.url === "string" ? raw.url.trim() : "";
  if (!isSafeUrl(url, { protocols: ["https:"] }))
    return null;
  const allowlist = Array.isArray(raw.allowlist) ? [...new Set(raw.allowlist.filter((t) => typeof t === "string" && t.trim() !== "").map((t) => t.trim()))].slice(0, MAX_MCP_ALLOWLIST) : [];
  if (allowlist.length === 0)
    return null;
  const headers = {};
  if (raw.headers && typeof raw.headers === "object" && !Array.isArray(raw.headers)) {
    for (const [key, value] of Object.entries(raw.headers)) {
      if (key.trim() && typeof value === "string")
        headers[key.trim()] = value;
    }
  }
  const name = typeof raw.name === "string" && raw.name.trim() ? raw.name.trim() : new URL(url).hostname;
  return { name, url, headers, allowlist };
}
function toToolCapabilitySafeView(state) {
  return {
    toolId: state.toolId,
    available: state.authorized && state.runtimeRegistered,
    unavailableReason: state.unavailableReason,
    sideEffect: state.sideEffect
  };
}
function isAgentToolEnabled(bindings, defaultOn) {
  if (bindings?.some((binding) => binding.enabled === true))
    return true;
  if (bindings?.some((binding) => binding.enabled === false))
    return false;
  return defaultOn;
}
function connectionStatus(row) {
  if (row.is_active === false)
    return "error";
  const creds = row.credentials || {};
  const hasRefreshToken = typeof creds.refresh_token === "string" && creds.refresh_token.trim().length > 0;
  const expiresAt = typeof creds.expires_at === "string" ? new Date(creds.expires_at) : null;
  const accessTokenExpired = expiresAt && !isNaN(expiresAt.getTime()) && expiresAt.getTime() < Date.now();
  return accessTokenExpired && !hasRefreshToken ? "expired" : "connected";
}
var API_TOOL_NAME_PATTERN, SECRET_NAME_PATTERN, API_SECRETS_PROVIDER, API_TOOL_RESERVED_FIELD_NAMES, API_TOOL_AUTH_HEADER_PATTERN, API_TOOL_SECRET_REF_PATTERN, MCP_SERVER_TOOL_ID, MCP_CONNECT_TIMEOUT_MS, MAX_MCP_ALLOWLIST, BUILTIN_TOOL_CATALOG;
var init_agentTools = __esm({
  "../shared-types/dist/agentTools.js"() {
    "use strict";
    init_safeUrl();
    API_TOOL_NAME_PATTERN = /^[a-z][a-z0-9_]{2,40}$/;
    SECRET_NAME_PATTERN = /^[A-Z][A-Z0-9_]{1,63}$/;
    API_SECRETS_PROVIDER = "api_secrets";
    API_TOOL_RESERVED_FIELD_NAMES = /* @__PURE__ */ new Set([
      "False",
      "None",
      "True",
      "and",
      "as",
      "assert",
      "async",
      "await",
      "break",
      "class",
      "continue",
      "def",
      "del",
      "elif",
      "else",
      "except",
      "finally",
      "for",
      "from",
      "global",
      "if",
      "import",
      "in",
      "is",
      "lambda",
      "nonlocal",
      "not",
      "or",
      "pass",
      "raise",
      "return",
      "try",
      "while",
      "with",
      "yield",
      "params"
    ]);
    API_TOOL_AUTH_HEADER_PATTERN = /^(authorization|x-api-key|api[-_]?key|.*token.*|.*secret.*)$/i;
    API_TOOL_SECRET_REF_PATTERN = /\{\{\s*secrets\.[A-Z][A-Z0-9_]{1,63}\s*\}\}/;
    MCP_SERVER_TOOL_ID = "mcp_server";
    MCP_CONNECT_TIMEOUT_MS = 3e3;
    MAX_MCP_ALLOWLIST = 50;
    BUILTIN_TOOL_CATALOG = [
      {
        tool_id: "handoff_to_human",
        label: "Human handoff",
        description: "Transfer the live call to the configured human destination when escalation is required.",
        category: "call_control",
        side_effect: "write",
        default_timeout_ms: 1e3,
        requires_credential: false
      },
      {
        tool_id: "schedule_callback",
        label: "Scheduled callbacks",
        description: "Let the agent schedule a call back to the caller at a time they choose, and place it itself at that time (Indian mobile numbers, 9 am to 9 pm IST). Needs a phone number attached to the agent or the workspace; no calendar or messaging connection is required.",
        category: "call_control",
        side_effect: "write",
        default_timeout_ms: 4e3,
        requires_credential: false
      },
      {
        tool_id: "check_calendar_availability",
        label: "Check calendar availability",
        description: "Look up open slots in the configured calendar provider.",
        category: "calendar",
        side_effect: "read",
        default_timeout_ms: 4e3,
        requires_credential: true
      },
      {
        tool_id: "list_calendar_events",
        label: "List calendar events",
        description: "Read scheduled events from the configured calendar provider.",
        category: "calendar",
        side_effect: "read",
        default_timeout_ms: 4e3,
        requires_credential: true
      },
      {
        tool_id: "create_calendar_event",
        label: "Create calendar event",
        description: "Create a calendar event after the caller explicitly confirms the details.",
        category: "calendar",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "update_calendar_event",
        label: "Update calendar event",
        description: "Move or edit an existing calendar event after explicit caller confirmation.",
        category: "calendar",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "delete_calendar_event",
        label: "Delete calendar event",
        description: "Cancel an existing calendar event after explicit caller confirmation.",
        category: "calendar",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "lookup_customer",
        label: "Look up customer",
        description: "Find a customer record by phone, email, or external id.",
        category: "crm",
        side_effect: "read",
        default_timeout_ms: 4e3,
        requires_credential: true
      },
      {
        tool_id: "send_whatsapp_message",
        label: "Send WhatsApp message",
        description: "Send a WhatsApp message to the caller mid-call (e.g. confirmation link, address, brochure URL). Outside the 24h customer-care window an approved template must be configured.",
        category: "messaging",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "send_telegram_message",
        label: "Send Telegram message",
        description: "Send a Telegram bot message to the caller mid-call. Requires the caller to have an established chat_id with the tenant's bot (no cold-send by phone).",
        category: "messaging",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "send_asset",
        label: "Send asset",
        description: "Send a configured shareable asset to the caller when they explicitly request a document, brochure, or guide.",
        category: "messaging",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "lookup_ticket",
        label: "Look up ticket",
        description: "Find a support ticket by its number, or the caller's most recent ticket, and read back its status.",
        category: "ticketing",
        side_effect: "read",
        default_timeout_ms: 4e3,
        requires_credential: true
      },
      {
        tool_id: "create_ticket",
        label: "Create ticket",
        description: "Raise a support ticket from the call after the caller confirms the details, and read the ticket number back to them.",
        category: "ticketing",
        side_effect: "write",
        default_timeout_ms: 6e3,
        requires_credential: true
      },
      {
        tool_id: "call_webhook",
        label: "API request",
        description: "Call your own HTTPS API mid-call, to look something up or to send details. Each API tool has its own name, purpose, typed parameters and headers; header secrets stay encrypted.",
        category: "webhook",
        side_effect: "read",
        default_timeout_ms: 6e3,
        // The endpoint lives in the binding's provider_settings and its secrets in
        // the tenant's api_secrets row — nothing to connect in Settings → Connectors.
        requires_credential: false
      },
      {
        tool_id: "mcp_server",
        label: "MCP server",
        description: "Give the agent tools from your own MCP server. Only the tools you allowlist are offered; header secrets stay encrypted and are sent only to that server.",
        category: "webhook",
        side_effect: "write",
        default_timeout_ms: MCP_CONNECT_TIMEOUT_MS,
        requires_credential: false
      }
    ];
  }
});

// ../ops-tools/dist/index.js
var require_dist = __commonJS({
  "../ops-tools/dist/index.js"(exports2, module2) {
    "use strict";
    var __defProp2 = Object.defineProperty;
    var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    var __getOwnPropNames2 = Object.getOwnPropertyNames;
    var __hasOwnProp2 = Object.prototype.hasOwnProperty;
    var __export2 = (target, all) => {
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
    var __toCommonJS2 = (mod) => __copyProps2(__defProp2({}, "__esModule", { value: true }), mod);
    var index_exports = {};
    __export2(index_exports, {
      defineTool: () => defineTool,
      opsToolCatalog: () => opsToolCatalog2,
      resolveToolDisposition: () => resolveToolDisposition
    });
    module2.exports = __toCommonJS2(index_exports);
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
    var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    var norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    async function resolveAgentId(client, agentId) {
      const raw = String(agentId ?? "").trim();
      if (UUID_RE.test(raw)) return raw;
      const { agents } = await client.agents.list({ limit: 500 });
      const target = norm(raw);
      const matches = agents.filter((a) => norm(a.name ?? "") === target);
      if (matches.length === 1) return matches[0].id;
      if (matches.length > 1) {
        throw new Error(`"${raw}" matches ${matches.length} agents \u2014 call list_agents and pass the exact agent UUID.`);
      }
      throw new Error(`No agent named "${raw}" found \u2014 call list_agents to get a valid agent UUID.`);
    }
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
      persona: import_zod.z.record(import_zod.z.any()).optional().describe("Persona object. persona.name is the name the agent speaks and introduces itself as (also shown on share/tester pages); it defaults to the label when omitted. Note: callerPersonas must be objects of shape {type, approach, detectedWhen}, NOT plain strings."),
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
    var LLM_PROVIDER_ALIASES = {
      google: "gemini",
      googleai: "gemini",
      "google-genai": "gemini",
      "google-ai": "gemini",
      vertex: "gemini",
      vertexai: "gemini",
      "vertex-ai": "gemini",
      claude: "anthropic",
      gpt: "openai",
      "azure-openai": "openai",
      azure: "openai"
    };
    function normalizeLlmProvider(params) {
      const p = params.llm_provider;
      if (!p) return params;
      const alias = LLM_PROVIDER_ALIASES[p.toLowerCase()];
      return alias ? { ...params, llm_provider: alias } : params;
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
          name: import_zod.z.string().min(1).describe("Studio label: the name shown in the sidebar/agent list only. The name the agent speaks is persona.name."),
          ...agentConfigFields
        },
        run: (client, params) => client.agents.create(normalizeLlmProvider(foldPromptMode(params)))
      }),
      defineTool({
        name: "update_agent",
        description: "Update an existing Rymi voice agent's configuration. Only the fields you pass are changed; nullable fields accept null to clear them.",
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod.z.string().uuid().describe("The agent UUID to update"),
          name: import_zod.z.string().optional().describe("Studio label (sidebar/agent list only). To change the spoken name, set persona.name."),
          ...agentConfigFields,
          chat_summary: import_zod.z.string().nullable().optional()
        },
        run: async (client, { agent_id, ...params }) => client.agents.update(await resolveAgentId(client, agent_id), normalizeLlmProvider(foldPromptMode(params)))
      }),
      defineTool({
        name: "delete_agent",
        description: "Permanently delete a Rymi voice agent.",
        scope: "agent",
        risk: "sensitive",
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID to delete") },
        run: async (client, { agent_id }) => client.agents.delete(await resolveAgentId(client, agent_id))
      }),
      defineTool({
        name: "clone_agent",
        description: 'Duplicate an existing agent. The copy gets " (Copy)" appended to its name.',
        scope: "agent",
        risk: "write",
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID to clone") },
        run: async (client, { agent_id }) => client.agents.clone(await resolveAgentId(client, agent_id))
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
        run: async (client, { agent_id }) => client.agents.publish(await resolveAgentId(client, agent_id))
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
      }),
      defineTool({
        name: "get_campaign_intake",
        description: "Get a campaign's lead-intake URL settings (consent and default-country handling, last used). Returns intake: null if none. The URL itself is only shown when created or rotated.",
        scope: "agent",
        risk: "read",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.intake.get(campaign_id)
      }),
      defineTool({
        name: "set_campaign_intake",
        description: 'Create a lead-intake URL for a campaign, or update its settings. Lead sources (website forms, Typeform, Google Apps Script, Zapier/Make) POST leads to the URL with no API key; a running campaign dials them within its calling window. The URL is returned ONCE on create (url: null on later updates) and anyone holding it can add numbers to the campaign. assume_voice_consent=true treats every posted lead as consenting to calls; default_country (e.g. "IN") makes local numbers without +<code> dialable.',
        scope: "agent",
        risk: "sensitive",
        input: {
          campaign_id: import_zod10.z.string().describe("The campaign ID"),
          assume_voice_consent: import_zod10.z.boolean().optional().describe("Treat every posted lead as having voice consent"),
          default_country: import_zod10.z.string().regex(/^[A-Z]{2}$/).nullable().optional().describe('ISO-3166 alpha-2 country for numbers posted without +<code>, e.g. "IN"')
        },
        run: (client, { campaign_id, ...settings }) => client.campaigns.intake.set(campaign_id, settings)
      }),
      defineTool({
        name: "rotate_campaign_intake",
        description: "Issue a new lead-intake URL for a campaign. The old URL stops accepting leads immediately, so every lead source must be updated.",
        scope: "agent",
        risk: "sensitive",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.intake.rotate(campaign_id)
      }),
      defineTool({
        name: "disable_campaign_intake",
        description: "Remove a campaign's lead-intake URL. Leads already accepted stay in the campaign.",
        scope: "agent",
        risk: "write",
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: async (client, { campaign_id }) => {
          await client.campaigns.intake.disable(campaign_id);
          return { status: "disabled", campaign_id };
        }
      })
    ];
    var import_zod11 = require("zod");
    var import_agentTools = (init_agentTools(), __toCommonJS(agentTools_exports));
    var import_safeUrl2 = (init_safeUrl(), __toCommonJS(safeUrl_exports));
    var DEFAULT_NAME = "call_webhook";
    var METHODS = ["GET", "POST", "PUT", "PATCH"];
    var FIELD_NAME = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    var RESERVED_HEADERS = /* @__PURE__ */ new Set(["host", "content-length", "connection", "transfer-encoding"]);
    var LIVE_NOTE = "Saved to the live agent row: the voice runtime uses it from the next call. There is no separate draft; publish_agent is not required. Undo with list_agent_changes \u2192 undo_agent_change.";
    var fieldSchema = import_zod11.z.object({
      name: import_zod11.z.string().describe('Argument name the agent fills in: letters, digits, underscores; not a Python keyword or "params".'),
      type: import_zod11.z.enum(["string", "number", "integer", "boolean"]).optional().describe('Default "string".'),
      description: import_zod11.z.string().optional().describe("What the value is, for the agent."),
      required: import_zod11.z.boolean().optional(),
      enum: import_zod11.z.array(import_zod11.z.string()).optional().describe("Allowed values, if fixed.")
    });
    var settingsShape = {
      url: import_zod11.z.string().describe("Public https endpoint. Private, loopback and non-https hosts are refused."),
      method: import_zod11.z.enum(METHODS).optional().describe("Default POST. GET sends fields as query parameters."),
      purpose: import_zod11.z.string().optional().describe("When the agent should call this tool. Without it the agent rarely fires it."),
      fields: import_zod11.z.array(fieldSchema).optional().describe("Arguments the agent supplies. Replaces the whole list on update."),
      headers: import_zod11.z.record(import_zod11.z.string()).optional().describe("Request headers. Credentials must be a {{secrets.NAME}} reference (see set_tool_secret), never a literal key."),
      send_metadata: import_zod11.z.boolean().optional().describe("Include call metadata (call id, agent id, caller phone). Default true."),
      response_fields: import_zod11.z.array(import_zod11.z.string()).optional().describe("Dot paths kept from the JSON response; default keeps the (truncated) body."),
      timeout_ms: import_zod11.z.number().int().min(1e3).max(1e4).optional().describe("Per-request timeout, 1000\u201310000 ms. Default 6000."),
      enabled: import_zod11.z.boolean().optional().describe("Default true.")
    };
    function bindingName(b) {
      const n = b?.provider_settings?.name;
      return typeof n === "string" && n.trim() ? n.trim() : DEFAULT_NAME;
    }
    var isApiTool = (b) => b?.tool_id === "call_webhook";
    function webhookBindingErrors(b, opts) {
      const errors = [];
      const s = b.provider_settings ?? {};
      const name = bindingName(b);
      if (!import_agentTools.API_TOOL_NAME_PATTERN.test(name)) errors.push(`name "${name}": lowercase letters, digits and underscores, starting with a letter, 3\u201341 characters.`);
      if (opts.otherNames.includes(name)) errors.push(`name "${name}" is already used by another API tool on this agent.`);
      const url = typeof s.url === "string" ? s.url.trim() : "";
      if (!url) errors.push("url is required.");
      else if (!/^https:\/\//i.test(url)) errors.push("url must be https \u2014 the request carries caller details.");
      else if (!(0, import_safeUrl2.isSafeUrl)(url, { protocols: ["https:"] })) errors.push("url must be a valid public host; private and loopback addresses are refused at call time.");
      if (!METHODS.includes(s.method)) errors.push(`method must be one of ${METHODS.join(", ")}.`);
      if (!Number.isInteger(b.timeout_ms) || b.timeout_ms < 1e3 || b.timeout_ms > 1e4) errors.push("timeout_ms must be an integer from 1000 to 10000.");
      const seen = /* @__PURE__ */ new Set();
      for (const f of Array.isArray(s.fields) ? s.fields : []) {
        const fname = typeof f?.name === "string" ? f.name.trim() : "";
        if (!FIELD_NAME.test(fname)) errors.push(`field "${fname}": letters, digits and underscores only, not starting with a digit.`);
        else if (import_agentTools.API_TOOL_RESERVED_FIELD_NAMES.has(fname)) errors.push(`field "${fname}" is reserved; use e.g. ${fname}_value.`);
        else if (seen.has(fname)) errors.push(`field "${fname}" is duplicated.`);
        seen.add(fname);
      }
      const headers = s.headers ?? {};
      for (const key of opts.checkHeaders) {
        const value = headers[key];
        if (RESERVED_HEADERS.has(key.trim().toLowerCase())) errors.push(`header "${key}" is set by the runtime and cannot be overridden.`);
        else if (typeof value !== "string") errors.push(`header "${key}" must be a string.`);
        else if (import_agentTools.API_TOOL_AUTH_HEADER_PATTERN.test(key.trim()) && !import_agentTools.API_TOOL_SECRET_REF_PATTERN.test(value)) {
          errors.push(`header "${key}" holds a literal credential. Store it with set_tool_secret and use "{{secrets.NAME}}" instead.`);
        }
      }
      return errors;
    }
    function assertValid(b, tools, self, checkHeaders) {
      const otherNames = tools.filter((t) => isApiTool(t) && t !== self).map(bindingName);
      const errors = webhookBindingErrors(b, { otherNames, checkHeaders });
      if (errors.length) throw new Error(`Invalid API tool binding: ${errors.join(" ")}`);
    }
    async function writeTools(client, agentRef, mutate) {
      const agentId = await resolveAgentId(client, agentRef);
      const agent = await client.agents.retrieve(agentId);
      if (!Array.isArray(agent.tools)) throw new Error("The API did not return this agent's tool bindings, so a write could delete them. Refusing.");
      const tools = mutate(agent.tools);
      await client.agents.update(agentId, { tools });
      return { agentId, tools };
    }
    function findApiTool(tools, name) {
      const found = tools.find((t) => isApiTool(t) && bindingName(t) === name);
      if (!found) {
        const names2 = tools.filter(isApiTool).map(bindingName);
        throw new Error(`No API tool named "${name}" on this agent. Existing: ${names2.length ? names2.join(", ") : "none"}.`);
      }
      return found;
    }
    var ALWAYS_ON_TOOL_IDS = ["datetime_now", "knowledge_search", "end_call", "get_caller_history", "forget_me"];
    var SWITCHABLE_CATALOG = import_agentTools.BUILTIN_TOOL_CATALOG.filter((t) => t.tool_id !== "call_webhook" && t.tool_id !== "mcp_server");
    var TOOL_GROUPS = {
      calendar: [
        "check_calendar_availability",
        "list_calendar_events",
        "create_calendar_event",
        "update_calendar_event",
        "delete_calendar_event"
      ],
      tickets: ["lookup_ticket", "create_ticket"]
    };
    var SWITCHABLE_IDS = [...ALWAYS_ON_TOOL_IDS, ...SWITCHABLE_CATALOG.map((t) => t.tool_id)];
    function expandToolIds(requested) {
      const ids = /* @__PURE__ */ new Set();
      const unknown = [];
      for (const raw of requested) {
        const name = raw.trim();
        if (TOOL_GROUPS[name]) TOOL_GROUPS[name].forEach((id) => ids.add(id));
        else if (SWITCHABLE_IDS.includes(name)) ids.add(name);
        else unknown.push(name);
      }
      if (unknown.length) {
        throw new Error(`Unknown tool ${unknown.map((u) => `"${u}"`).join(", ")}. Use one of: ${[...Object.keys(TOOL_GROUPS), ...SWITCHABLE_IDS].join(", ")}. API tools use add/update/remove_agent_tool.`);
      }
      return [...ids];
    }
    function setToolsEnabled(tools, toolIds, enabled) {
      const next = tools.map((t) => toolIds.includes(t.tool_id) ? { ...t, enabled } : t);
      for (const toolId of toolIds) {
        if (next.some((t) => t.tool_id === toolId)) continue;
        const entry = SWITCHABLE_CATALOG.find((t) => t.tool_id === toolId);
        next.push({
          tool_id: toolId,
          enabled,
          credential_ref: null,
          timeout_ms: entry?.default_timeout_ms ?? 3e3,
          side_effect: entry?.side_effect ?? (toolId === "end_call" || toolId === "forget_me" ? "write" : "read"),
          provider_settings: {}
        });
      }
      return next;
    }
    var addShape = { agent_id: import_zod11.z.string().describe("The agent UUID"), name: import_zod11.z.string().describe('LLM-facing tool name, e.g. "lookup_reservation". Unique per agent.'), ...settingsShape };
    var updateShape = {
      agent_id: import_zod11.z.string().describe("The agent UUID"),
      name: import_zod11.z.string().describe("Current name of the API tool to change."),
      new_name: import_zod11.z.string().optional().describe("Rename the tool."),
      ...settingsShape,
      url: settingsShape.url.optional(),
      headers: import_zod11.z.record(import_zod11.z.string().nullable()).optional().describe("Merged into the existing headers by name; null removes one. Headers you omit \u2014 including ones shown as [redacted] \u2014 are kept unchanged.")
    };
    var agentToolBindingTools = [
      defineTool({
        name: "list_agent_tools",
        description: "List an agent's tool bindings (API tools / call_webhook, handoff, calendar, \u2026). Header values are shown only as {{secrets.NAME}} references; literal values are [redacted].",
        scope: "agent",
        risk: "read",
        input: { agent_id: import_zod11.z.string().describe("The agent UUID") },
        run: async (client, { agent_id }) => {
          const agentId = await resolveAgentId(client, agent_id);
          const agent = await client.agents.retrieve(agentId);
          return { agent_id: agentId, tools: agent.tools ?? [] };
        }
      }),
      defineTool({
        name: "add_agent_tool",
        description: `Add an API tool (call_webhook) to an agent, keeping its existing tools. The agent can then call the endpoint mid-call with the fields you define. ${LIVE_NOTE}`,
        scope: "agent",
        risk: "write",
        input: addShape,
        run: async (client, params) => {
          const p = import_zod11.z.object(addShape).parse(params);
          const binding = {
            tool_id: "call_webhook",
            enabled: p.enabled ?? true,
            credential_ref: null,
            timeout_ms: p.timeout_ms ?? 6e3,
            side_effect: (p.method ?? "POST") === "GET" ? "read" : "write",
            provider_settings: {
              name: p.name.trim(),
              url: p.url.trim(),
              method: p.method ?? "POST",
              send_metadata: p.send_metadata ?? true,
              ...p.purpose ? { purpose: p.purpose } : {},
              ...p.fields?.length ? { fields: p.fields } : {},
              ...p.headers && Object.keys(p.headers).length ? { headers: p.headers } : {},
              ...p.response_fields?.length ? { response_fields: p.response_fields } : {}
            }
          };
          const { agentId } = await writeTools(client, p.agent_id, (tools) => {
            assertValid(binding, tools, null, Object.keys(p.headers ?? {}));
            return [...tools, binding];
          });
          return { status: "added", agent_id: agentId, tool: binding, note: LIVE_NOTE };
        }
      }),
      defineTool({
        name: "update_agent_tool",
        description: `Change one API tool (call_webhook) on an agent by name. Only the settings you pass change; fields replaces the whole list, headers merge by name. ${LIVE_NOTE}`,
        scope: "agent",
        risk: "write",
        input: updateShape,
        run: async (client, params) => {
          const p = import_zod11.z.object(updateShape).parse(params);
          let updated = null;
          const { agentId } = await writeTools(client, p.agent_id, (tools) => {
            const current = findApiTool(tools, p.name);
            const prev = current.provider_settings ?? {};
            const headers = { ...prev.headers ?? {} };
            for (const [k, v] of Object.entries(p.headers ?? {})) {
              if (v === null) delete headers[k];
              else headers[k] = v;
            }
            const settings = { ...prev, name: (p.new_name ?? bindingName(current)).trim() };
            for (const key of ["url", "method", "purpose", "fields", "send_metadata", "response_fields"]) {
              if (p[key] !== void 0) settings[key] = key === "url" ? p.url.trim() : p[key];
            }
            settings.method ??= "POST";
            if (Object.keys(headers).length) settings.headers = headers;
            else delete settings.headers;
            const next = {
              ...current,
              enabled: p.enabled ?? current.enabled,
              timeout_ms: p.timeout_ms ?? current.timeout_ms,
              side_effect: settings.method === "GET" ? "read" : "write",
              provider_settings: settings
            };
            const touched = Object.entries(p.headers ?? {}).filter(([, v]) => v !== null).map(([k]) => k);
            assertValid(next, tools, current, touched);
            updated = next;
            return tools.map((t) => t === current ? next : t);
          });
          return { status: "updated", agent_id: agentId, tool: updated, note: LIVE_NOTE };
        }
      }),
      defineTool({
        name: "remove_agent_tool",
        description: `Remove one API tool (call_webhook) from an agent by name, keeping its other tools. ${LIVE_NOTE}`,
        scope: "agent",
        risk: "write",
        input: { agent_id: import_zod11.z.string().describe("The agent UUID"), name: import_zod11.z.string().describe("Name of the API tool to remove.") },
        run: async (client, { agent_id, name }) => {
          const { agentId, tools } = await writeTools(client, agent_id, (tools2) => {
            const target = findApiTool(tools2, name);
            return tools2.filter((t) => t !== target);
          });
          return { status: "removed", agent_id: agentId, name, remaining: tools.filter(isApiTool).map(bindingName), note: LIVE_NOTE };
        }
      }),
      defineTool({
        name: "set_agent_tools",
        description: `Switch built-in tools on or off for one agent: calendar (check/list/create/update/delete), lookup_customer, lookup_ticket/create_ticket, send_whatsapp_message, send_telegram_message, send_asset, handoff_to_human, schedule_callback, and the always-on ones (end_call, forget_me, knowledge_search, get_caller_history, datetime_now). Groups: "calendar" (all five calendar tools), "tickets". Connected-app tools are opt-in per agent: connecting the app for the workspace makes them available, and an agent gets one only when switched on here or in Studio; it also needs the app connected (Settings \u2192 Connectors) to work on calls. Other agents are not affected. ${LIVE_NOTE}`,
        scope: "agent",
        risk: "write",
        input: {
          agent_id: import_zod11.z.string().describe("The agent UUID"),
          tools: import_zod11.z.array(import_zod11.z.string()).min(1).describe('Tool ids or groups, e.g. ["calendar"] or ["send_whatsapp_message", "send_asset"].'),
          enabled: import_zod11.z.boolean().describe("true switches them on for this agent, false switches them off.")
        },
        run: async (client, { agent_id, tools: requested, enabled }) => {
          const toolIds = expandToolIds(requested);
          const { agentId } = await writeTools(client, agent_id, (tools) => setToolsEnabled(tools, toolIds, enabled));
          return { status: enabled ? "enabled" : "disabled", agent_id: agentId, tools: toolIds, note: LIVE_NOTE };
        }
      }),
      defineTool({
        name: "list_tool_secrets",
        description: "List the workspace's API-tool secret names and the host each is pinned to. Values are never returned.",
        scope: "account",
        risk: "read",
        input: {},
        run: (client) => client.toolSecrets.list()
      }),
      defineTool({
        name: "set_tool_secret",
        description: 'Create or replace a workspace secret for API-tool headers, referenced as "{{secrets.NAME}}" (e.g. header x-api-key: "{{secrets.RESERVATIONS_API_KEY}}"). The value is encrypted, write-only, and only ever sent to `host`. Replacing an existing name changes it for every agent that references it.',
        scope: "account",
        risk: "sensitive",
        input: {
          name: import_zod11.z.string().describe("UPPER_SNAKE_CASE, 2\u201364 characters."),
          value: import_zod11.z.string().min(1).max(4096).describe("The secret value. Never echoed back."),
          host: import_zod11.z.string().describe('Public hostname the secret may be sent to, e.g. "api.example.com".')
        },
        run: async (client, { name, value, host }) => {
          if (!import_agentTools.SECRET_NAME_PATTERN.test(name)) throw new Error("Secret names are UPPER_SNAKE_CASE, 2\u201364 characters, starting with a letter.");
          await client.toolSecrets.set(name, { value, host });
          return { status: "saved", name, reference: `{{secrets.${name}}}` };
        }
      })
    ];
    var import_zod12 = require("zod");
    var shareLinkTools = [
      defineTool({
        name: "get_share_link",
        description: "Get an agent's public share link (URL, limits, minutes used). Returns link: null if none exists yet.",
        scope: "agent",
        risk: "read",
        input: { agent_id: import_zod12.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.getShareLink(agent_id)
      }),
      defineTool({
        name: "set_share_link",
        description: "Create an agent's public share link, or update its settings. Anyone with the URL can talk to the agent in a browser, billed to this workspace. Defaults on create: 30-minute pool, 300 s per call, 2 concurrent calls, 3 calls per IP per hour. Set enabled=false to switch the link off.",
        scope: "agent",
        risk: "sensitive",
        input: {
          agent_id: import_zod12.z.string().uuid().describe("The agent UUID"),
          enabled: import_zod12.z.boolean().optional().describe("Turn the link on or off"),
          minutes_limit: import_zod12.z.number().int().min(0).max(6e3).optional().describe("Total talk-time pool in minutes"),
          max_call_seconds: import_zod12.z.number().int().min(60).max(1800).optional().describe("Per-call cap in seconds"),
          max_concurrent: import_zod12.z.number().int().min(1).max(10).optional().describe("Simultaneous calls"),
          calls_per_ip_hour: import_zod12.z.number().int().min(1).max(30).optional().describe("Calls per caller IP per hour")
        },
        run: (client, { agent_id, ...settings }) => client.agents.setShareLink(agent_id, settings)
      }),
      defineTool({
        name: "regenerate_share_link",
        description: "Issue a new URL for an agent's share link. The old URL stops working immediately.",
        scope: "agent",
        risk: "sensitive",
        input: { agent_id: import_zod12.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.regenerateShareLink(agent_id)
      })
    ];
    var import_agentTools2 = (init_agentTools(), __toCommonJS(agentTools_exports));
    var REDACTED = "[redacted]";
    function redactToolSecrets(value) {
      if (Array.isArray(value)) return value.map(redactToolSecrets);
      if (!value || typeof value !== "object") return value;
      const out = {};
      for (const [k, v] of Object.entries(value)) out[k] = redactToolSecrets(v);
      const headers = out.tool_id && out.provider_settings?.headers;
      if (headers && typeof headers === "object" && !Array.isArray(headers)) {
        out.provider_settings = {
          ...out.provider_settings,
          headers: Object.fromEntries(Object.entries(headers).map(([k, v]) => [
            k,
            typeof v === "string" && import_agentTools2.API_TOOL_SECRET_REF_PATTERN.test(v) ? v : REDACTED
          ]))
        };
      }
      return out;
    }
    var opsToolCatalog2 = [
      ...agentTools,
      ...agentToolBindingTools,
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
      ...campaignTools,
      ...shareLinkTools
    ].map((t) => ({ ...t, run: async (client, params) => redactToolSecrets(await t.run(client, params)) }));
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
  version: "2.3.0",
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
