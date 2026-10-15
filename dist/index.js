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

// ../shared-types/dist/core.js
var init_core = __esm({
  "../shared-types/dist/core.js"() {
    "use strict";
  }
});

// ../shared-types/dist/notifications.js
var NOTIFICATION_CHANNELS, NOTIFICATION_QUEUE_NAME;
var init_notifications = __esm({
  "../shared-types/dist/notifications.js"() {
    "use strict";
    NOTIFICATION_CHANNELS = ["in_app", "email", "webhook", "whatsapp"];
    NOTIFICATION_QUEUE_NAME = "rymi_notifications";
  }
});

// ../shared-types/dist/postCall.js
function mergeObject(base, override) {
  if (!override)
    return { ...base };
  const mergedEntries = Object.entries(base).map(([key, value]) => {
    const nextValue = override[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return [key, mergeObject(value, typeof nextValue === "object" ? nextValue : void 0)];
    }
    return [key, nextValue ?? value];
  });
  return Object.fromEntries(mergedEntries);
}
function normalizePostCallConfig(config) {
  const merged = mergeObject(DEFAULT_POST_CALL_CONFIG, config);
  return {
    structured_extraction: {
      prompt: typeof merged.structured_extraction.prompt === "string" && merged.structured_extraction.prompt.trim().length > 0 ? merged.structured_extraction.prompt.trim() : null,
      json_schema: merged.structured_extraction.json_schema && typeof merged.structured_extraction.json_schema === "object" ? merged.structured_extraction.json_schema : null
    },
    summary: {
      enabled: merged.summary.enabled !== false,
      prompt: typeof merged.summary.prompt === "string" && merged.summary.prompt.trim().length > 0 ? merged.summary.prompt.trim() : null
    },
    evaluation: {
      rubric: typeof merged.evaluation.rubric === "string" && merged.evaluation.rubric.trim().length > 0 ? merged.evaluation.rubric.trim() : null
    },
    model: {
      provider: merged.model.provider === "gemini" || merged.model.provider === "openai" ? merged.model.provider : null,
      model: typeof merged.model.model === "string" && merged.model.model.trim().length > 0 ? merged.model.model.trim() : null
    }
  };
}
function mergePostCallConfig(base, override) {
  const normalizedBase = normalizePostCallConfig(base);
  return normalizePostCallConfig(mergeObject(normalizedBase, override));
}
var POST_CALL_RESULT_SCHEMA_VERSION, POST_CALL_QUEUE_NAME, DEFAULT_CALL_RECORDINGS_BUCKET, DEFAULT_POST_CALL_CONFIG;
var init_postCall = __esm({
  "../shared-types/dist/postCall.js"() {
    "use strict";
    POST_CALL_RESULT_SCHEMA_VERSION = "2026-05-20";
    POST_CALL_QUEUE_NAME = "rymi_post_call_intelligence";
    DEFAULT_CALL_RECORDINGS_BUCKET = "call-recordings";
    DEFAULT_POST_CALL_CONFIG = {
      structured_extraction: { prompt: null, json_schema: null },
      summary: { enabled: true, prompt: null },
      evaluation: { rubric: null },
      model: { provider: null, model: null }
    };
  }
});

// ../shared-types/dist/studioCatalog.js
function isRealtimeModel(modelId) {
  if (!modelId)
    return false;
  const id = modelId.toLowerCase();
  return id.includes("realtime") || id.includes("native-audio") || id.includes("-live-") || id.endsWith("-live") || id.startsWith("gemini-live") || id.startsWith("grok-voice") || id.startsWith("ultravox") || id.startsWith("nova-sonic");
}
function deriveLanguageLabel(code) {
  const override = LANGUAGE_LABEL_OVERRIDES[code];
  if (override)
    return override;
  const parts = code.split("-");
  const languageCode = parts[0];
  const regionCode = parts[parts.length - 1];
  const language = new Intl.DisplayNames(["en"], { type: "language" }).of(languageCode) || languageCode;
  const region = regionCode && regionCode.length === 2 ? new Intl.DisplayNames(["en"], { type: "region" }).of(regionCode) : null;
  return region ? `${language} (${region})` : language;
}
var STUDIO_MODEL_PREFERENCE, BASE_STUDIO_SUPPORTED_LANGUAGES, AZURE_SPEECH_LANGUAGE_CODES, LANGUAGE_LABEL_OVERRIDES, BASE_LANGUAGE_CODES, STUDIO_SUPPORTED_LANGUAGES;
var init_studioCatalog = __esm({
  "../shared-types/dist/studioCatalog.js"() {
    "use strict";
    STUDIO_MODEL_PREFERENCE = {
      llm: [
        "gemini-2.5-flash",
        "gpt-4o-mini",
        "gpt-4o",
        "gpt-4.1",
        "gemini-2.5-pro",
        "sarvam-105b-conversations",
        "sarvam-105b",
        "gpt-realtime-mini",
        "gemini-3.1-flash-live-preview",
        "claude-sonnet-4-6",
        "gpt-5.4",
        "gpt-5.4-mini",
        "gpt-5.4-nano",
        "gemini-3.1-pro-preview",
        "claude-haiku-4-5",
        "gemini-2.5-flash-lite",
        "gemini-2.5-flash-native-audio-latest",
        "gemini-3.5-flash",
        "claude-opus-4-8",
        "gpt-realtime-2",
        "gpt-realtime-1.5",
        "gpt-realtime-2.1",
        "gpt-realtime-2.1-mini",
        "gpt-live-1",
        "gemini-3.8-live",
        "grok-voice-3.0",
        "grok-voice-think-fast-2.0",
        "ultravox-v0.7",
        // Additional LLMs
        "claude-haiku-4-5-20251001",
        "claude-sonnet-4-5-20250929",
        "claude-opus-4-5-20251101",
        "claude-opus-4-6",
        "claude-opus-4-7",
        "gpt-4.1-nano",
        "claude-sonnet-5-5",
        "claude-opus-5-5",
        "gpt-6-luna",
        "gemini-3.5-flash-lite",
        "gemini-3.8-flash",
        "gpt-4.1-mini",
        "gpt-5.5",
        "gemini-3-flash-preview",
        "gemini-3.1-flash-lite",
        "gemini-3.1-pro-preview-customtools",
        "gemini-2.5-flash-native-audio-preview-12-2025",
        "nova-sonic-1",
        "nova-sonic-2",
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "qwen/qwen3-32b",
        "openai/gpt-oss-20b",
        "openai/gpt-oss-120b",
        "openai/gpt-oss-safeguard-20b",
        "llama3.1-8b",
        "gpt-oss-120b",
        "qwen-3-235b-a22b-instruct-2507",
        "zai-glm-4.7",
        "llama-4-scout",
        "deepseek-v4-flash",
        "deepseek-v4-pro",
        "grok-4-1-fast",
        "grok-3-mini",
        "grok-3-mini-fast",
        "grok-3-fast",
        "grok-3",
        "grok-2",
        "grok-2-1212",
        "grok-2-vision",
        "ministral-3-3b",
        "ministral-3-8b",
        "mistral-small-4",
        "mistral-medium-3.1",
        "mistral-large-3",
        "codestral",
        "MiniMax-Text-01",
        "minimax-m1",
        "sonar",
        "sonar-pro",
        "glm-4-flash",
        "glm-4-air",
        "glm-4-plus",
        "qwen-turbo",
        "qwen-plus",
        "qwen-max",
        "moonshot-v1-8k",
        "Qwen/Qwen2.5-7B-Instruct",
        "Qwen/Qwen2.5-72B-Instruct",
        "deepseek-ai/DeepSeek-V3"
      ],
      stt: [
        "nova-3-general",
        "nova-2-phonecall",
        "nova-3-multilingual",
        "saaras:v3",
        "saaras:v4",
        "scribe_v2_realtime",
        "chirp",
        "gpt-4o-transcribe",
        "gpt-realtime-whisper",
        // Additional STT
        "universal-3",
        "ink-whisper",
        "nova-2-general",
        "nova-2-medical",
        "nova-2-finance",
        "nova-2-meeting",
        "nova-2-conversationalai",
        "nova-2-voicemail",
        "nova-2-video",
        "nova-2-automotive",
        "nova-2-drivethru",
        "speech-to-text",
        "gpt-4o-mini-transcribe",
        "solaria",
        "stt-rt-preview",
        "flux-general-en",
        "flux-general-multi",
        "nova-3-medical",
        "speechmatics-enhanced",
        "saaras:v2.5"
      ],
      tts: [
        "aura-2",
        "gemini-2.5-pro-preview-tts",
        "sonic-3.5",
        "sonic-turbo",
        "sonic-3.6",
        "eleven_v4_turbo",
        "eleven_flash_v2_5",
        "gemini-2.5-flash-preview-tts",
        "gemini-3.1-flash-tts-preview",
        "tts-1",
        "bulbul:v3",
        "gpt-4o-mini-tts",
        "eleven_multilingual_v2",
        // Additional TTS
        "neural-tts",
        "octave",
        "octave2",
        "arcana",
        "mistv2",
        "blizzard",
        "lightning",
        "inworld-tts-1",
        "speech-1.6",
        "polly-neural",
        "eleven_flash_v2",
        "tts-1-hd",
        "Play3.0-mini",
        "PlayDialog",
        "PlayDialogTurbo",
        "speech-02-turbo",
        "speech-02-hd"
      ]
    };
    BASE_STUDIO_SUPPORTED_LANGUAGES = [
      // English variants
      { code: "en-US", label: "English (US)" },
      { code: "en-GB", label: "English (UK)" },
      { code: "en-IN", label: "English (India)" },
      { code: "en-AU", label: "English (Australia)" },
      { code: "en-NZ", label: "English (New Zealand)" },
      { code: "en-CA", label: "English (Canada)" },
      { code: "en-IE", label: "English (Ireland)" },
      // European
      { code: "es-ES", label: "Spanish (Spain)" },
      { code: "es-419", label: "Spanish (Latin America)" },
      { code: "fr-FR", label: "French" },
      { code: "fr-CA", label: "French (Canada)" },
      { code: "de-DE", label: "German" },
      { code: "de-CH", label: "German (Switzerland)" },
      { code: "it-IT", label: "Italian" },
      { code: "pt-BR", label: "Portuguese (Brazil)" },
      { code: "pt-PT", label: "Portuguese (Portugal)" },
      { code: "nl-NL", label: "Dutch" },
      { code: "pl-PL", label: "Polish" },
      { code: "sv-SE", label: "Swedish" },
      { code: "da-DK", label: "Danish" },
      { code: "fi-FI", label: "Finnish" },
      { code: "no-NO", label: "Norwegian" },
      { code: "cs-CZ", label: "Czech" },
      { code: "sk-SK", label: "Slovak" },
      { code: "ro-RO", label: "Romanian" },
      { code: "hu-HU", label: "Hungarian" },
      { code: "el-GR", label: "Greek" },
      { code: "bg-BG", label: "Bulgarian" },
      { code: "hr-HR", label: "Croatian" },
      { code: "sr-RS", label: "Serbian" },
      { code: "sl-SI", label: "Slovenian" },
      { code: "uk-UA", label: "Ukrainian" },
      // Indic
      { code: "hi-IN", label: "Hindi" },
      { code: "bn-IN", label: "Bengali" },
      { code: "ta-IN", label: "Tamil" },
      { code: "te-IN", label: "Telugu" },
      { code: "kn-IN", label: "Kannada" },
      { code: "ml-IN", label: "Malayalam" },
      { code: "mr-IN", label: "Marathi" },
      { code: "gu-IN", label: "Gujarati" },
      { code: "pa-IN", label: "Punjabi" },
      { code: "od-IN", label: "Odia" },
      { code: "as-IN", label: "Assamese" },
      { code: "ur-IN", label: "Urdu (India)" },
      // Asian
      { code: "zh-CN", label: "Chinese (Simplified)" },
      { code: "zh-TW", label: "Chinese (Traditional)" },
      { code: "zh-HK", label: "Chinese (Cantonese)" },
      { code: "ja-JP", label: "Japanese" },
      { code: "ko-KR", label: "Korean" },
      { code: "vi-VN", label: "Vietnamese" },
      { code: "th-TH", label: "Thai" },
      { code: "id-ID", label: "Indonesian" },
      { code: "ms-MY", label: "Malay" },
      { code: "fil-PH", label: "Filipino" },
      // Middle East
      { code: "ar-AE", label: "Arabic (UAE)" },
      { code: "ar-SA", label: "Arabic (Saudi Arabia)" },
      { code: "ar-EG", label: "Arabic (Egypt)" },
      { code: "he-IL", label: "Hebrew" },
      { code: "fa-IR", label: "Persian" },
      { code: "tr-TR", label: "Turkish" },
      // Global / Other
      { code: "ru-RU", label: "Russian" }
    ];
    AZURE_SPEECH_LANGUAGE_CODES = [
      "af-ZA",
      "am-ET",
      "ar-AE",
      "ar-BH",
      "ar-DZ",
      "ar-EG",
      "ar-IL",
      "ar-IQ",
      "ar-JO",
      "ar-KW",
      "ar-LB",
      "ar-LY",
      "ar-MA",
      "ar-OM",
      "ar-PS",
      "ar-QA",
      "ar-SA",
      "ar-SY",
      "ar-TN",
      "ar-YE",
      "as-IN",
      "az-AZ",
      "bg-BG",
      "bn-BD",
      "bn-IN",
      "bs-BA",
      "ca-ES",
      "cs-CZ",
      "cy-GB",
      "da-DK",
      "de-AT",
      "de-CH",
      "de-DE",
      "el-GR",
      "en-AU",
      "en-CA",
      "en-GB",
      "en-GH",
      "en-HK",
      "en-IE",
      "en-IN",
      "en-KE",
      "en-NG",
      "en-NZ",
      "en-PH",
      "en-SG",
      "en-TZ",
      "en-US",
      "en-ZA",
      "es-AR",
      "es-BO",
      "es-CL",
      "es-CO",
      "es-CR",
      "es-CU",
      "es-DO",
      "es-EC",
      "es-ES",
      "es-GQ",
      "es-GT",
      "es-HN",
      "es-MX",
      "es-NI",
      "es-PA",
      "es-PE",
      "es-PR",
      "es-PY",
      "es-SV",
      "es-US",
      "es-UY",
      "es-VE",
      "et-EE",
      "eu-ES",
      "fa-IR",
      "fi-FI",
      "fil-PH",
      "fr-BE",
      "fr-CA",
      "fr-CH",
      "fr-FR",
      "ga-IE",
      "gl-ES",
      "gu-IN",
      "he-IL",
      "hi-IN",
      "hr-HR",
      "hu-HU",
      "hy-AM",
      "id-ID",
      "is-IS",
      "it-CH",
      "it-IT",
      "iu-Cans-CA",
      "iu-Latn-CA",
      "ja-JP",
      "jv-ID",
      "ka-GE",
      "kk-KZ",
      "km-KH",
      "kn-IN",
      "ko-KR",
      "lo-LA",
      "lt-LT",
      "lv-LV",
      "mk-MK",
      "ml-IN",
      "mn-MN",
      "mr-IN",
      "ms-MY",
      "mt-MT",
      "my-MM",
      "nan-CN",
      "nb-NO",
      "ne-NP",
      "nl-BE",
      "nl-NL",
      "or-IN",
      "pa-IN",
      "pl-PL",
      "ps-AF",
      "pt-BR",
      "pt-PT",
      "ro-RO",
      "ru-RU",
      "si-LK",
      "sk-SK",
      "sl-SI",
      "so-SO",
      "sq-AL",
      "sr-Latn-RS",
      "sr-ME",
      "sr-RS",
      "sr-XK",
      "su-ID",
      "sv-SE",
      "sw-KE",
      "sw-TZ",
      "ta-IN",
      "ta-LK",
      "ta-MY",
      "ta-SG",
      "te-IN",
      "th-TH",
      "tr-TR",
      "uk-UA",
      "ur-IN",
      "ur-PK",
      "uz-UZ",
      "vi-VN",
      "wuu-CN",
      "yue-CN",
      "zh-CN",
      "zh-HK",
      "zh-SG",
      "zh-TW",
      "zu-ZA"
    ];
    LANGUAGE_LABEL_OVERRIDES = {
      "nan-CN": "Chinese (Min Nan)",
      "wuu-CN": "Chinese (Wu)",
      "yue-CN": "Chinese (Cantonese)",
      "iu-Cans-CA": "Inuktitut (Syllabics, Canada)",
      "iu-Latn-CA": "Inuktitut (Latin, Canada)",
      "sr-Latn-RS": "Serbian (Latin, Serbia)",
      "sr-XK": "Serbian (Kosovo)",
      "or-IN": "Odia",
      "nb-NO": "Norwegian Bokmal"
    };
    BASE_LANGUAGE_CODES = new Set(BASE_STUDIO_SUPPORTED_LANGUAGES.map((language) => language.code));
    STUDIO_SUPPORTED_LANGUAGES = [
      ...BASE_STUDIO_SUPPORTED_LANGUAGES,
      ...AZURE_SPEECH_LANGUAGE_CODES.filter((code) => !BASE_LANGUAGE_CODES.has(code)).map((code) => ({ code, label: deriveLanguageLabel(code) }))
    ];
  }
});

// ../shared-types/dist/agent.js
function canonicalizeLlmProvider(provider) {
  if (!provider)
    return null;
  const normalized = provider.toLowerCase();
  if (normalized === "google")
    return "gemini";
  return AGENT_LLM_PROVIDERS.includes(normalized) ? normalized : null;
}
var AGENT_LLM_PROVIDERS;
var init_agent = __esm({
  "../shared-types/dist/agent.js"() {
    "use strict";
    AGENT_LLM_PROVIDERS = ["gemini", "openai", "anthropic", "sarvam", "groq", "xai", "ultravox"];
  }
});

// ../shared-types/dist/publishValidation.js
function buildIssue(severity, section, title, description, fix) {
  return {
    id: `${severity}:${section}:${title}`,
    severity,
    section,
    title,
    description,
    fix
  };
}
function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}
function effectiveCompanyName(cfg) {
  return hasText(cfg.companyName) ? cfg.companyName : cfg.tenantBusinessName;
}
function effectiveCompanyContext(cfg) {
  return hasText(cfg.companyDescription) ? cfg.companyDescription : cfg.businessType;
}
function getConfiguredTtsFallbackProvider(cfg) {
  if (hasText(cfg.tts_fallback_provider))
    return cfg.tts_fallback_provider;
  const providerConfig = cfg.provider_config;
  if (!providerConfig)
    return null;
  if (hasText(providerConfig.tts?.fallback?.provider)) {
    return providerConfig.tts.fallback.provider;
  }
  const activeRole = hasText(providerConfig.active_role) ? providerConfig.active_role : null;
  if (activeRole && hasText(providerConfig.tiers?.[activeRole]?.tts?.fallback?.provider)) {
    return providerConfig.tiers[activeRole]?.tts?.fallback?.provider ?? null;
  }
  for (const tier of Object.values(providerConfig.tiers || {})) {
    if (hasText(tier?.tts?.fallback?.provider)) {
      return tier.tts.fallback.provider;
    }
  }
  return null;
}
function normalizeStringList(values) {
  return (values || []).filter((value) => typeof value === "string" && value.trim().length > 0);
}
function normalizeSuccessCriteria(criteria) {
  return (criteria || []).filter((entry) => typeof entry === "string" ? entry.trim() !== "" : entry?.label?.trim()).map((entry) => typeof entry === "string" ? entry.trim() : entry.label.trim());
}
function normalizeExtractionType(value) {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "number" || normalized === "boolean" || normalized === "array") {
    return normalized;
  }
  return "string";
}
function normalizeExtractionTags(tags) {
  const normalized = [];
  const seen = /* @__PURE__ */ new Set();
  for (const entry of tags || []) {
    const tag = typeof entry === "string" ? entry.trim() : typeof entry?.tag === "string" ? entry.tag.trim() : "";
    if (!tag || seen.has(tag))
      continue;
    normalized.push({
      tag,
      type: normalizeExtractionType(typeof entry === "string" ? "string" : entry?.type),
      description: typeof entry === "string" ? "" : typeof entry?.description === "string" ? entry.description.trim() : ""
    });
    seen.add(tag);
  }
  return normalized;
}
function extractionFieldsFromTags(tags) {
  return tags.map((tag) => tag.tag);
}
function normalizeProviderId(provider) {
  const normalized = String(provider || "").trim().toLowerCase();
  return normalized === "gemini" ? "google" : normalized;
}
function normalizeModelTypes(type) {
  if (Array.isArray(type))
    return type.map((entry) => String(entry).toLowerCase());
  if (typeof type === "string")
    return [type.toLowerCase()];
  return [];
}
function modelSupportsType(model, targetType) {
  return normalizeModelTypes(model?.type).includes(targetType);
}
function findModelById(models, modelId) {
  if (!modelId)
    return null;
  return models.find((model) => model.model_id === modelId) || null;
}
function inferLlmProviderFromModel(models, modelId, fallback = "gemini") {
  if (!modelId)
    return fallback;
  const matchedModel = findModelById(models, modelId);
  const matchedProvider = canonicalizeLlmProvider(matchedModel?.provider);
  if (matchedProvider)
    return matchedProvider;
  const normalizedModelId = modelId.toLowerCase();
  if (normalizedModelId.includes("claude"))
    return "anthropic";
  if (normalizedModelId.includes("sarvam"))
    return "sarvam";
  if (normalizedModelId.includes("gemini"))
    return "gemini";
  if (normalizedModelId.includes("gpt") || normalizedModelId.includes("o1") || normalizedModelId.includes("o3"))
    return "openai";
  return fallback;
}
function inferProviderFromModel(models, modelId, fallback) {
  return findModelById(models, modelId)?.provider || fallback || null;
}
function getEffectiveVoiceProvider(cfg, models) {
  const currentProvider = normalizeProviderId(cfg.tts_provider);
  if (currentProvider)
    return currentProvider;
  if (isRealtimeModel(cfg.llm_model)) {
    return normalizeProviderId(inferLlmProviderFromModel(models, cfg.llm_model, cfg.llm_provider || "gemini"));
  }
  if (cfg.tts_model) {
    return normalizeProviderId(inferProviderFromModel(models, cfg.tts_model, null));
  }
  return null;
}
function pickPreferredVoiceProvider(cfg, voices, models) {
  const currentProvider = getEffectiveVoiceProvider(cfg, models);
  if (currentProvider) {
    return currentProvider;
  }
  for (const provider of VOICE_PROVIDER_PREFERENCE) {
    if (voices.some((voice) => normalizeProviderId(voice.provider) === provider)) {
      return provider;
    }
  }
  return null;
}
function providerRequiresExplicitVoice(provider) {
  const normalized = normalizeProviderId(provider);
  return normalized !== "google" && normalized !== "sarvam" && normalized !== "deepgram";
}
function providerDisplayName(provider) {
  return PROVIDER_DISPLAY_NAME[provider] || provider.charAt(0).toUpperCase() + provider.slice(1);
}
function resolveRuntimeLlmProvider(cfg, models) {
  const explicit = normalizeProviderId(cfg.llm_provider);
  if (explicit)
    return explicit;
  const inferred = normalizeProviderId(inferLlmProviderFromModel(models, cfg.llm_model, ""));
  return inferred || null;
}
function resolveRuntimeSttProvider(cfg, models) {
  const explicit = normalizeProviderId(cfg.stt_provider);
  if (explicit)
    return explicit;
  const inferred = inferProviderFromModel(models, cfg.stt_model, null);
  return inferred ? normalizeProviderId(inferred) : null;
}
function providerKeyUnavailable(provider, availability) {
  if (!provider || CUSTOM_ENDPOINT_PROVIDER_SET.has(provider))
    return false;
  return availability[provider] === false;
}
function voiceMatchesValue(voice, selectedVoice) {
  return voice.id === selectedVoice || voice.name === selectedVoice || voice.label === selectedVoice;
}
function findVoiceByValue(voices, selectedVoice) {
  return voices.find((voice) => voiceMatchesValue(voice, selectedVoice)) || null;
}
function findVoicesByValue(voices, selectedVoice) {
  return voices.filter((voice) => voiceMatchesValue(voice, selectedVoice));
}
function hasVoiceMatch(voices, selectedVoice) {
  return Boolean(findVoiceByValue(voices, selectedVoice));
}
function voiceSupportsModel(voice, modelId) {
  if (!voice.supported_model_ids || voice.supported_model_ids.length === 0)
    return true;
  if (!modelId)
    return true;
  return voice.supported_model_ids.includes(modelId);
}
function hasModelMatch(models, modelId, expectedType) {
  const matchedModel = findModelById(models, modelId);
  return Boolean(matchedModel && modelSupportsType(matchedModel, expectedType));
}
function findUnresolvableOpenerTokens(opener, declaredKeys) {
  const found = /* @__PURE__ */ new Set();
  for (const m of opener.matchAll(/\{\{?\s*([a-zA-Z0-9_]+)\s*\}?\}/g)) {
    const key = m[1];
    if (!OPENER_KNOWN_SYSTEM_TOKENS.has(key) && !declaredKeys.has(key)) {
      found.add(key);
    }
  }
  return [...found];
}
function openerScriptWarning(language, opener) {
  const subtag = (language ?? "").trim().toLowerCase().split(/[-_]/)[0] ?? "";
  const script = NON_LATIN_SCRIPTS[subtag];
  if (!script)
    return null;
  if (script.re.test(opener))
    return null;
  return buildIssue("warning", "Conversation Flow", `Opener is not written in ${script.name}`, `This agent speaks ${language}, but its greeting contains no ${script.name} characters. The opener is spoken word-for-word, so the agent will greet in the wrong language and the caller will usually answer in that language too \u2014 keeping the whole call off-language. Rewrite the opener in ${script.name}, or keep it if you intended a romanized greeting.`, { type: "section", section: "playbook" });
}
function validatePublishConfig(cfg, context) {
  const blockers = [];
  const warnings = [];
  const validKnowledgeBase = normalizeStringList(cfg.knowledgeBase || []);
  const validSuccessCriteria = normalizeSuccessCriteria(cfg.successCriteria || []);
  const validRequiredSlots = normalizeStringList(cfg.requiredSlots || []);
  const validExtractionTags = normalizeExtractionTags(cfg.extractionTags || []);
  const validExtractionFields = normalizeStringList(cfg.postCallExtractionFields || []);
  const resolvedExtractionFields = validExtractionFields.length > 0 ? validExtractionFields : extractionFieldsFromTags(validExtractionTags);
  const usesBundledVoiceStack = isRealtimeModel(cfg.llm_model);
  const effectiveVoiceProvider = pickPreferredVoiceProvider(cfg, context.voices, context.models);
  const validQualificationFlow = (cfg.qualificationFlow || []).filter((step) => hasText(step?.question));
  const validObjections = (cfg.objections || []).filter((objection) => hasText(objection?.trigger) && hasText(objection?.response));
  if (!hasText(cfg.name)) {
    blockers.push(buildIssue("blocker", "Identity", "Add an agent name", "The agent needs a name before it can be published.", { type: "section", section: "business" }));
  }
  if (!hasText(effectiveCompanyName(cfg))) {
    blockers.push(buildIssue("blocker", "Identity", "Add your business name", "The agent needs to know which company it represents.", { type: "section", section: "business" }));
  }
  if (!hasText(cfg.role)) {
    blockers.push(buildIssue("blocker", "Identity", "Define the agent role", "Set a clear role so the compiled prompt knows who the agent is supposed to be.", { type: "section", section: "business" }));
  }
  if (providerRequiresExplicitVoice(effectiveVoiceProvider) && !hasText(cfg.voice)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Choose a voice", "Select a TTS voice for the agent before publishing.", { type: "section", section: "identity" }));
  }
  if (!hasText(cfg.llm_model)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Choose an intelligence model", "Select an active LLM model before publishing.", { type: "settings", panel: "stack" }));
  }
  const llmOption = context.models.find((m) => m.model_id === cfg.llm_model);
  const languageSubtag = String(cfg.language || "").trim().toLowerCase().split(/[-_]/)[0];
  if (llmOption?.languages && languageSubtag && !llmOption.languages.includes(languageSubtag)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Model is not cleared for this language", `${llmOption.label || llmOption.model_id} has only been verified with a native-sounding voice in ${llmOption.languages.join(", ")}. Pick another model for ${cfg.language}.`, { type: "settings", panel: "stack" }));
  }
  if (!usesBundledVoiceStack && !hasText(cfg.stt_model)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Choose a transcription model", "Select the speech-to-text model that will process inbound audio.", { type: "settings", panel: "stack" }));
  }
  if (!usesBundledVoiceStack && !hasText(cfg.tts_model)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Choose a voice rendering model", "Select the text-to-speech model that will synthesize spoken replies.", { type: "settings", panel: "stack" }));
  }
  if (!hasText(cfg.opener)) {
    blockers.push(buildIssue("blocker", "Conversation Flow", "Add an opener", "The call needs a first message or greeting.", { type: "section", section: "playbook" }));
  } else {
    const declaredVariableKeys = new Set((cfg.variables || []).map((v) => v?.key).filter((key) => typeof key === "string" && key.trim().length > 0));
    const scriptWarning = openerScriptWarning(cfg.language, cfg.opener);
    if (scriptWarning)
      warnings.push(scriptWarning);
    const unresolvableTokens = findUnresolvableOpenerTokens(cfg.opener, declaredVariableKeys);
    if (unresolvableTokens.length > 0) {
      blockers.push(buildIssue("blocker", "Conversation Flow", "Opener references an unfilled token", `The greeting references "{{${unresolvableTokens[0]}}}" but nothing ever sets that value, so the caller hears a broken sentence instead of a word. Either fill it in directly, or declare it as an agent variable with a default.`, { type: "section", section: "playbook" }));
    }
  }
  if (!hasText(cfg.primaryCTA)) {
    blockers.push(buildIssue("blocker", "Conversation Flow", "Add a primary CTA", "Define the main action the agent should drive toward.", { type: "section", section: "playbook" }));
  }
  if (validSuccessCriteria.length === 0) {
    blockers.push(buildIssue("blocker", "Conversation Flow", "Define at least one success criterion", "Add at least one measurable success criterion so the agent has a clear outcome.", { type: "section", section: "playbook" }));
  }
  if (cfg.postCallExtractionEnabled && resolvedExtractionFields.length === 0) {
    blockers.push(buildIssue("blocker", "Post-Call", "Add extraction fields", `You turned on "save details from each call" but haven't said what to capture. Add the things you want pulled from every call \u2014 for example: caller name, email, budget, or preferred callback time.`, { type: "section", section: "postCall" }));
  }
  if (cfg.postCallEvaluationEnabled && !hasText(cfg.postCallEvaluationRubric)) {
    blockers.push(buildIssue("blocker", "Post-Call", "Add a call scorecard", `You turned on call scoring but haven't said how a call should be graded. Add a short scorecard describing a good call \u2014 for example: "Did the agent confirm the caller's name, answer their question, and offer a clear next step?"`, { type: "section", section: "postCall" }));
  }
  const anyPostCallIntelligenceEnabled = cfg.postCallSummaryEnabled === true || cfg.postCallEvaluationEnabled === true || cfg.postCallExtractionEnabled === true;
  if (anyPostCallIntelligenceEnabled && cfg.transcriptionEnabled === false) {
    blockers.push(buildIssue("blocker", "Post-Call", "Enable transcription for post-call intelligence", "Post-call summary, evaluation, and extraction all require call transcripts. Turn on transcription in Recording & Transcripts settings before enabling these features.", { type: "settings", panel: "recording" }));
  }
  if (context.models.length > 0 && hasText(cfg.llm_model) && !hasModelMatch(context.models, cfg.llm_model, "llm")) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Selected model is no longer active", "Pick a currently active model from Settings and re-save the agent.", { type: "settings", panel: "stack" }));
  }
  if (!usesBundledVoiceStack && context.models.length > 0 && hasText(cfg.stt_model) && !hasModelMatch(context.models, cfg.stt_model, "stt")) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Selected STT model is unavailable", "Choose an active transcription model from Settings.", { type: "settings", panel: "stack" }));
  }
  if (!usesBundledVoiceStack && context.models.length > 0 && hasText(cfg.tts_model) && !hasModelMatch(context.models, cfg.tts_model, "tts")) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Selected TTS model is unavailable", "Choose an active voice rendering model from Settings.", { type: "settings", panel: "stack" }));
  }
  if (providerRequiresExplicitVoice(effectiveVoiceProvider) && context.voices.length > 0 && hasText(cfg.voice) && !hasVoiceMatch(context.voices, cfg.voice)) {
    blockers.push(buildIssue("blocker", "Voice Stack", "Selected voice is unavailable", "Pick an active voice that exists in the current catalog.", { type: "section", section: "identity" }));
  }
  if (providerRequiresExplicitVoice(effectiveVoiceProvider) && effectiveVoiceProvider && context.voices.length > 0 && hasText(cfg.voice)) {
    const matchedVoices = findVoicesByValue(context.voices, cfg.voice);
    const providerMatched = matchedVoices.some((voice) => normalizeProviderId(voice.provider) === effectiveVoiceProvider);
    if (matchedVoices.length > 0 && !providerMatched) {
      const offending = matchedVoices[0];
      blockers.push(buildIssue("blocker", "Voice Stack", "Voice does not match the TTS provider", `The voice "${offending.label || offending.name}" is a ${offending.provider} voice, but the agent's voice provider is ${effectiveVoiceProvider}. Pick a ${effectiveVoiceProvider} voice, or switch the TTS provider to ${offending.provider}.`, { type: "section", section: "identity" }));
    }
  }
  if (!usesBundledVoiceStack && context.voices.length > 0 && hasText(cfg.voice) && hasText(cfg.tts_model)) {
    const matchedVoice = findVoiceByValue(context.voices, cfg.voice);
    if (matchedVoice && !voiceSupportsModel(matchedVoice, cfg.tts_model)) {
      blockers.push(buildIssue("blocker", "Voice Stack", "Voice is not compatible with the selected model", `The voice "${matchedVoice.label || matchedVoice.name}" can't be used with ${cfg.tts_model}. Choose a voice that supports this model, or switch the TTS model.`, { type: "section", section: "identity" }));
    }
  }
  if (context.models.length > 0) {
    const byokModels = [
      { modelId: cfg.llm_model, channel: "LLM" },
      ...!usesBundledVoiceStack ? [
        { modelId: cfg.stt_model, channel: "STT" },
        { modelId: cfg.tts_model, channel: "TTS" }
      ] : []
    ];
    for (const { modelId, channel } of byokModels) {
      if (!hasText(modelId))
        continue;
      const model = findModelById(context.models, modelId);
      if (model?.byok_required) {
        const providerName = model.provider_name || model.byok_provider_id || model.provider || "this provider";
        const byokProviderId = normalizeProviderId(model.byok_provider_id || model.provider);
        blockers.push(buildIssue("blocker", "Voice Stack", `Connect your ${providerName} API key`, `The selected ${channel} model requires a ${providerName} API key. Go to Settings \u2192 BYOK to connect it.`, byokProviderId ? { type: "byok", provider: byokProviderId } : { type: "settings", panel: "stack" }));
      }
    }
  }
  if (context.providerAvailability) {
    const runtimeChannels = [
      { provider: resolveRuntimeLlmProvider(cfg, context.models), modelId: cfg.llm_model, channel: "LLM" }
    ];
    if (!usesBundledVoiceStack) {
      runtimeChannels.push({ provider: resolveRuntimeSttProvider(cfg, context.models), modelId: cfg.stt_model, channel: "STT" });
      runtimeChannels.push({ provider: getEffectiveVoiceProvider(cfg, context.models), modelId: cfg.tts_model, channel: "TTS" });
    }
    const flaggedProviders = /* @__PURE__ */ new Set();
    for (const { provider, modelId, channel } of runtimeChannels) {
      if (!provider)
        continue;
      if (findModelById(context.models, modelId))
        continue;
      if (!providerKeyUnavailable(provider, context.providerAvailability))
        continue;
      if (flaggedProviders.has(provider))
        continue;
      flaggedProviders.add(provider);
      const providerName = providerDisplayName(provider);
      blockers.push(buildIssue("blocker", "Voice Stack", `Connect your ${providerName} API key`, `The runtime has no API key for ${providerName} (${channel}), so calls will fail at startup with no greeting. Add a ${providerName} key in Settings \u2192 BYOK, or choose a ${channel} provider that's already configured.`, { type: "byok", provider }));
    }
  }
  if (context.customEndpointsAllowed === false) {
    const customUrls = [
      { field: "custom_llm_url", label: "Custom LLM URL" },
      { field: "custom_voice_url", label: "Custom Voice URL" },
      { field: "custom_transcriber_url", label: "Custom Transcriber URL" }
    ];
    for (const { field, label } of customUrls) {
      if (hasText(cfg[field])) {
        blockers.push(buildIssue("blocker", "Voice Stack", `${label} requires Enterprise`, `Custom endpoint URLs are available on Enterprise workspaces. Contact sales or remove the custom URL.`, { type: "settings", panel: "stack" }));
      }
    }
  }
  if (!hasText(cfg.audienceDescription)) {
    warnings.push(buildIssue("warning", "Identity", "Audience is not defined", "Add an audience description so the prompt can adapt its tone and assumptions.", { type: "section", section: "callerContext" }));
  }
  if (!hasText(effectiveCompanyContext(cfg)) && validKnowledgeBase.length === 0) {
    warnings.push(buildIssue("warning", "Knowledge", "No company context is set", "Add a company description or knowledge base entries so the agent has concrete facts to work from.", { type: "section", section: "business" }));
  }
  if (cfg.promptMode !== "raw") {
    if (validQualificationFlow.length === 0) {
      warnings.push(buildIssue("warning", "Conversation Flow", "Qualification flow is empty", "The agent will publish, but it has no qualification questions yet.", { type: "section", section: "playbook" }));
    }
    if (validRequiredSlots.length === 0) {
      warnings.push(buildIssue("warning", "Conversation Flow", "No required slots are configured", "If this agent should collect structured information, add required slots before going live.", { type: "section", section: "playbook" }));
    }
    if (validObjections.length === 0) {
      warnings.push(buildIssue("warning", "Conversation Flow", "No objection handlers are configured", "Add objection handling if the agent is expected to deal with pushback or edge cases.", { type: "section", section: "playbook" }));
    }
    if (!hasText(cfg.fallbackCTA)) {
      warnings.push(buildIssue("warning", "Conversation Flow", "Fallback CTA is empty", "Add a fallback path for callers who are not ready for the primary CTA.", { type: "section", section: "playbook" }));
    }
  }
  if (context.telephonyStatus?.connected === false) {
    warnings.push(buildIssue("warning", "Deployment", "No telephony provider is connected", "Web tests can still work, but the agent will not be able to place or receive phone calls yet.", { type: "numbers" }));
  }
  const effectiveRequireConsent = Boolean(cfg.requireConsent || cfg.recordingEnabled);
  if (cfg.recordingEnabled && !effectiveRequireConsent) {
    warnings.push(buildIssue("warning", "Compliance", "Recording consent is disabled", "You have recording enabled without consent enforcement. Confirm that this matches your compliance requirements.", { type: "settings", panel: "recording" }));
  }
  if (!usesBundledVoiceStack && (hasText(cfg.tts_provider) || hasText(cfg.tts_model)) && !hasText(getConfiguredTtsFallbackProvider(cfg))) {
    warnings.push(buildIssue("warning", "Voice Stack", "No TTS fallback provider configured", "A mid-call TTS provider stall cannot be recovered without a fallback, so the caller will hear dead air. Configure a fallback provider for resilience.", { type: "settings", panel: "stack" }));
  }
  return {
    blockers,
    warnings,
    canPublish: blockers.length === 0
  };
}
var VOICE_PROVIDER_PREFERENCE, CUSTOM_ENDPOINT_PROVIDER_SET, PROVIDER_DISPLAY_NAME, OPENER_KNOWN_SYSTEM_TOKENS, NON_LATIN_SCRIPTS;
var init_publishValidation = __esm({
  "../shared-types/dist/publishValidation.js"() {
    "use strict";
    init_studioCatalog();
    init_agent();
    VOICE_PROVIDER_PREFERENCE = ["openai", "google", "elevenlabs", "cartesia", "sarvam", "hume", "playht", "azure-speech"];
    CUSTOM_ENDPOINT_PROVIDER_SET = /* @__PURE__ */ new Set(["custom-llm", "custom-voice", "custom-transcriber", "ollama"]);
    PROVIDER_DISPLAY_NAME = {
      anthropic: "Anthropic",
      openai: "OpenAI",
      google: "Google",
      gemini: "Google",
      sarvam: "Sarvam",
      deepgram: "Deepgram",
      elevenlabs: "ElevenLabs",
      cartesia: "Cartesia"
    };
    OPENER_KNOWN_SYSTEM_TOKENS = /* @__PURE__ */ new Set([
      "name",
      "email",
      "phone",
      "timezone",
      // BUILTIN_CALLER_VARIABLES
      "agent_name",
      "restaurant_name",
      "business_name",
      "company_name",
      "product_name",
      "brokerage_name",
      "firm_name",
      "hotel_name",
      "institution_name",
      "practice_name"
    ]);
    NON_LATIN_SCRIPTS = {
      hi: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      mr: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      ne: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      sa: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      kok: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      mai: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      doi: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      brx: { name: "Devanagari", re: /[\u0900-\u097F]/ },
      bn: { name: "Bengali", re: /[\u0980-\u09FF]/ },
      as: { name: "Bengali", re: /[\u0980-\u09FF]/ },
      pa: { name: "Gurmukhi", re: /[\u0A00-\u0A7F]/ },
      gu: { name: "Gujarati", re: /[\u0A80-\u0AFF]/ },
      od: { name: "Odia", re: /[\u0B00-\u0B7F]/ },
      or: { name: "Odia", re: /[\u0B00-\u0B7F]/ },
      ta: { name: "Tamil", re: /[\u0B80-\u0BFF]/ },
      te: { name: "Telugu", re: /[\u0C00-\u0C7F]/ },
      kn: { name: "Kannada", re: /[\u0C80-\u0CFF]/ },
      ml: { name: "Malayalam", re: /[\u0D00-\u0D7F]/ },
      ur: { name: "Arabic", re: /[\u0600-\u06FF]/ },
      ks: { name: "Arabic", re: /[\u0600-\u06FF]/ },
      sd: { name: "Arabic", re: /[\u0600-\u06FF]/ }
    };
  }
});

// ../shared-types/dist/transcript.js
function sanitizeTranscriptText(speaker, rawText) {
  const trimmed = rawText.trim();
  if (!trimmed)
    return "";
  if (speaker === "user") {
    return trimmed.replace(EXCESS_WHITESPACE_RE, " ");
  }
  let sanitized = trimmed.replace(THINK_TAG_RE, " ");
  sanitized = sanitized.replace(MARKDOWN_EMPHASIS_RE, "$1");
  sanitized = sanitized.replace(EXCESS_WHITESPACE_RE, " ").trim();
  if (sanitized.startsWith("Initiating ") || sanitized.startsWith("Thinking:")) {
    return "";
  }
  if (isCutOffAgentFragment(sanitized)) {
    return "";
  }
  return sanitized;
}
function isCutOffAgentFragment(text) {
  if (text.length > 32)
    return false;
  return CUT_OFF_AGENT_FRAGMENT_RE.test(text);
}
function estimateSegmentDurationMs(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(700, Math.min(12e3, words * 360));
}
function buildTranscriptText(segments) {
  return segments.map((segment) => `${segment.speaker === "user" ? "User" : "Agent"}: ${segment.text}`).join("\n");
}
function coerceSpeaker(row) {
  if (row?.speaker === "user" || row?.role === "user" || row?.type === "user_input")
    return "user";
  return "agent";
}
function normalizeTranscriptRows(rows) {
  const sorted = [...rows].sort((a, b) => {
    const seqDelta = (a.sequence ?? Number.MAX_SAFE_INTEGER) - (b.sequence ?? Number.MAX_SAFE_INTEGER);
    if (seqDelta !== 0)
      return seqDelta;
    return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
  });
  return sorted.reduce((segments, row, index) => {
    const speaker = coerceSpeaker(row);
    const textValue = typeof row.text === "string" ? row.text : row.response || "";
    const text = sanitizeTranscriptText(speaker, textValue);
    if (!text)
      return segments;
    const endedAt = typeof row.ended_at_ms === "number" ? row.ended_at_ms : typeof row.started_at_ms === "number" ? row.started_at_ms + estimateSegmentDurationMs(text) : estimateSegmentDurationMs(text) * (index + 1);
    const startedAt = typeof row.started_at_ms === "number" ? row.started_at_ms : Math.max(0, endedAt - estimateSegmentDurationMs(text));
    segments.push({
      id: row.id,
      speaker,
      text,
      sequence: typeof row.sequence === "number" ? row.sequence : index,
      started_at_ms: Math.max(0, startedAt),
      ended_at_ms: Math.max(Math.max(0, startedAt), endedAt),
      is_final: row.is_final !== false,
      source: typeof row.source === "string" && row.source.length > 0 ? row.source : "runtime",
      created_at: row.created_at
    });
    return segments;
  }, []);
}
var THINK_TAG_RE, MARKDOWN_EMPHASIS_RE, EXCESS_WHITESPACE_RE, CUT_OFF_AGENT_FRAGMENT_RE, hydrateTranscriptSegments;
var init_transcript = __esm({
  "../shared-types/dist/transcript.js"() {
    "use strict";
    THINK_TAG_RE = /<think>[\s\S]*?<\/think>/gi;
    MARKDOWN_EMPHASIS_RE = /\*\*([^*]+)\*\*/g;
    EXCESS_WHITESPACE_RE = /\s+/g;
    CUT_OFF_AGENT_FRAGMENT_RE = /[.!?][A-Z][a-z]{0,12}$/;
    hydrateTranscriptSegments = normalizeTranscriptRows;
  }
});

// ../shared-types/dist/pronunciations.js
function pronunciationSupport(ttsProvider) {
  switch ((ttsProvider || "").trim().toLowerCase()) {
    case "fish-audio":
    case "sarvam":
    case "openai":
      return "respell";
    case "deepgram":
      return "respell-ipa";
    case "cartesia":
      return "ipa-only";
    default:
      return "none";
  }
}
var MAX_PRONUNCIATIONS;
var init_pronunciations = __esm({
  "../shared-types/dist/pronunciations.js"() {
    "use strict";
    MAX_PRONUNCIATIONS = 100;
  }
});

// ../shared-types/dist/callerMemory.js
var init_callerMemory = __esm({
  "../shared-types/dist/callerMemory.js"() {
    "use strict";
  }
});

// ../shared-types/dist/variables.js
function normalizeVariableAcquisition(v) {
  if (v.acquisition)
    return v.acquisition;
  if (v.extract)
    return "extract";
  return v.required ? "ask" : "none";
}
function deriveRequiredSlots(variables) {
  if (!Array.isArray(variables))
    return [];
  return variables.filter((v) => v && typeof v.key === "string" && v.key !== "" && v.required).map((v) => v.key);
}
function deriveExtractionFields(variables) {
  if (!Array.isArray(variables))
    return [];
  const out = [];
  for (const v of variables) {
    if (!v || typeof v.key !== "string" || v.key === "")
      continue;
    if (normalizeVariableAcquisition(v) === "extract" || v.required)
      out.push(v.key);
  }
  return Array.from(new Set(out));
}
function normalizeKey(raw) {
  return String(raw ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function registerVariable(registry, rawKey, defaults) {
  const list = Array.isArray(registry) ? registry.filter(Boolean) : [];
  const key = normalizeKey(rawKey);
  if (key === "")
    return list;
  if (list.some((v) => v.key === key))
    return list;
  const created = {
    key,
    description: defaults.description ?? "",
    metadataKey: defaults.metadataKey,
    default: defaults.default,
    type: defaults.type,
    enumValues: defaults.enumValues,
    required: defaults.required,
    acquisition: defaults.acquisition,
    origin: defaults.origin
  };
  return [...list, created];
}
function inferCallerMetadataKey(key) {
  const normalized = normalizeKey(key);
  if (NAME_KEYS.has(normalized))
    return "name";
  if (EMAIL_KEYS.has(normalized))
    return "email";
  if (PHONE_KEYS.has(normalized))
    return "phone";
  return void 0;
}
function humanizeKey(key) {
  return normalizeKey(key).split("_").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function variablesFromRequiredSlots(requiredSlots, origin = "playbook") {
  if (!Array.isArray(requiredSlots))
    return [];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const slot of requiredSlots) {
    const rawName = typeof slot === "string" ? slot : slot?.name;
    const key = normalizeKey(rawName || "");
    if (!key || seen.has(key))
      continue;
    seen.add(key);
    const description = typeof slot === "string" ? humanizeKey(key) : slot.description?.trim() || humanizeKey(key);
    const metadataKey = inferCallerMetadataKey(key);
    out.push({
      key,
      description,
      metadataKey,
      required: typeof slot === "string" ? true : slot.required !== false,
      acquisition: "ask",
      origin,
      type: "string"
    });
  }
  return out;
}
var NAME_KEYS, EMAIL_KEYS, PHONE_KEYS;
var init_variables = __esm({
  "../shared-types/dist/variables.js"() {
    "use strict";
    NAME_KEYS = /* @__PURE__ */ new Set([
      "name",
      "full_name",
      "caller_name",
      "customer_name",
      "contact_name",
      "guest_name",
      "patient_name",
      "candidate_name",
      "student_name",
      "claimant_name",
      "employee_name"
    ]);
    EMAIL_KEYS = /* @__PURE__ */ new Set(["email", "email_address", "contact_email"]);
    PHONE_KEYS = /* @__PURE__ */ new Set([
      "phone",
      "phone_number",
      "callback_number",
      "contact_number",
      "mobile",
      "mobile_number"
    ]);
  }
});

// ../../node_modules/.pnpm/dlv@1.1.3/node_modules/dlv/dist/dlv.es.js
function dlv_es_default(t, e, l, n, r) {
  for (e = e.split ? e.split(".") : e, n = 0; n < e.length; n++) t = t ? t[e[n]] : r;
  return t === r ? l : t;
}
var init_dlv_es = __esm({
  "../../node_modules/.pnpm/dlv@1.1.3/node_modules/dlv/dist/dlv.es.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/dset@3.1.4/node_modules/dset/dist/index.mjs
function dset(obj, keys, val) {
  keys.split && (keys = keys.split("."));
  var i = 0, l = keys.length, t = obj, x, k;
  while (i < l) {
    k = "" + keys[i++];
    if (k === "__proto__" || k === "constructor" || k === "prototype") break;
    t = t[k] = i === l ? val : typeof (x = t[k]) === typeof keys ? x : keys[i] * 0 !== 0 || !!~("" + keys[i]).indexOf(".") ? {} : [];
  }
}
var init_dist = __esm({
  "../../node_modules/.pnpm/dset@3.1.4/node_modules/dset/dist/index.mjs"() {
    "use strict";
  }
});

// ../shared-types/dist/agentConfigSchema.js
function getFieldByKey(key) {
  return AGENT_CONFIG_SCHEMA.find((f) => f.key === key);
}
function fieldsBySection(section) {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.section === section);
}
function editableKeysForMode(mode) {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.editableIn === mode || f.editableIn === "both").map((f) => f.key);
}
function clarifyableKeys() {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.clarifyable).map((f) => f.key);
}
function publishRequiredKeys() {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.publishRequired).map((f) => f.key);
}
function readFromPayload(apiData, field) {
  if (!apiData || typeof apiData !== "object")
    return field.default;
  const val = dlv_es_default(apiData, field.apiPath);
  return val !== void 0 ? val : field.default;
}
function writeToPayload(payload, field, value) {
  if (!payload || typeof payload !== "object")
    return;
  dset(payload, field.apiPath, value);
}
function applyDerivedOnSerialize(cfg, payload) {
  for (const rule of DERIVED_SERIALIZE_RULES) {
    const val = rule.compute(cfg);
    if (rule.key === "requireConsent") {
      dset(payload, "features.require_consent", val);
    } else if (rule.key === "voice") {
      dset(payload, "voice", val);
    }
  }
  const pronunciations = dlv_es_default(payload, "advanced.pronunciations");
  if (Array.isArray(pronunciations)) {
    dset(payload, "advanced.pronunciations", pronunciations.filter((p) => p?.word?.trim() && p?.say_as?.trim()));
  }
  const label = typeof cfg.label === "string" ? cfg.label.trim() : "";
  if (!label) {
    const derived = [cfg.name, cfg.role].map((v) => typeof v === "string" ? v.trim() : "").filter(Boolean).join(" \xB7 ");
    dset(payload, "name", derived || cfg.name);
  }
}
function reinitKeys() {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.requiresReinit).map((f) => f.key);
}
function diffRequiresReinit(prev, next) {
  return reinitKeys().filter((key) => {
    const pVal = prev[key];
    const nVal = next[key];
    return pVal !== nVal;
  });
}
function affectsOf(key) {
  return DEPENDENCY_GRAPH[key]?.affects || [];
}
function affectedByOf(key) {
  return DEPENDENCY_GRAPH[key]?.affectedBy || [];
}
function scalarContextKeys() {
  return AGENT_CONFIG_SCHEMA.filter((f) => !CONTEXT_EXCLUDED.has(f.key) && f.type.kind !== "list-string" && f.type.kind !== "list-object").map((f) => f.key);
}
function listContextFields() {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.contextKeywords && f.contextKeywords.length > 0).map((f) => ({ key: f.key, keywords: f.contextKeywords }));
}
function getNestedValue(data, path) {
  let current = data;
  for (const segment of path.split(".")) {
    if (current == null || typeof current !== "object")
      return void 0;
    current = current[segment];
  }
  return current;
}
function hydrateDefaults(data) {
  const result2 = {};
  for (const field of AGENT_CONFIG_SCHEMA) {
    if (HYDRATION_OVERRIDES.has(field.key))
      continue;
    const raw = getNestedValue(data, field.apiPath);
    result2[field.key] = raw ?? field.default;
  }
  return result2;
}
function setNestedValue(obj, path, value) {
  const segments = path.split(".");
  let current = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    if (!(segments[i] in current))
      current[segments[i]] = {};
    current = current[segments[i]];
  }
  current[segments[segments.length - 1]] = value;
}
function serializeSection(config, sectionPrefix) {
  const result2 = {};
  for (const field of AGENT_CONFIG_SCHEMA) {
    if (SERIALIZATION_OVERRIDES.has(field.key))
      continue;
    if (!field.apiPath.startsWith(sectionPrefix + "."))
      continue;
    const subPath = field.apiPath.slice(sectionPrefix.length + 1);
    const val = config[field.key];
    setNestedValue(result2, subPath, val ?? field.default);
  }
  return result2;
}
function fieldsForApiSection(sectionPrefix) {
  return AGENT_CONFIG_SCHEMA.filter((f) => f.apiPath.startsWith(sectionPrefix + ".") && !f.apiPath.slice(sectionPrefix.length + 1).includes(".")).map((f) => ({
    apiField: f.apiPath.slice(sectionPrefix.length + 1),
    type: f.type
  }));
}
function describeFieldType(f) {
  const t = f.type;
  if (t.kind === "boolean")
    return "boolean";
  if (t.kind === "number") {
    const parts = ["number"];
    if (t.min !== void 0)
      parts.push(`min:${t.min}`);
    if (t.max !== void 0)
      parts.push(`max:${t.max}`);
    if (t.unit)
      parts.push(t.unit);
    return parts.join(", ");
  }
  if (t.kind === "string")
    return t.maxLength ? `string (max ${t.maxLength} chars)` : "string";
  if (t.kind === "enum")
    return `enum: ${t.options.map((o) => o.value).join(" | ")}`;
  if (t.kind === "enum-catalog")
    return `enum-catalog: ${t.catalog}`;
  if (t.kind === "list-string")
    return "list of strings";
  if (t.kind === "list-object")
    return "list of objects";
  return "unknown";
}
function renderFieldReference(mode) {
  const editableKeys = new Set(editableKeysForMode(mode));
  const lines = [
    "SECTION ALIASES:",
    ...SECTION_ALIASES.map(({ section, aliases }) => `- ${section}: ${aliases.join(", ")}`),
    "",
    "EDITABLE FIELDS:"
  ];
  for (const f of AGENT_CONFIG_SCHEMA) {
    if (!editableKeys.has(f.key))
      continue;
    const aliases = f.aliases?.length ? `; aliases: ${f.aliases.join(", ")}` : "";
    lines.push(`- ${f.key} / "${f.label}" (${describeFieldType(f)}${aliases}): ${f.description}`);
  }
  return lines.join("\n");
}
var AGENT_CONFIG_SCHEMA_VERSION, CHANGE_SET_VALIDATORS, DERIVED_SERIALIZE_RULES, AGENT_CONFIG_SCHEMA, graph, DEPENDENCY_GRAPH, CONTEXT_EXCLUDED, HYDRATION_OVERRIDES, SERIALIZATION_OVERRIDES, SECTION_ALIASES, FIELD_REFERENCE_CREATE, FIELD_REFERENCE_EDIT;
var init_agentConfigSchema = __esm({
  "../shared-types/dist/agentConfigSchema.js"() {
    "use strict";
    init_dlv_es();
    init_dist();
    AGENT_CONFIG_SCHEMA_VERSION = "2026-05-20";
    CHANGE_SET_VALIDATORS = [
      // Catalog validation for enum-catalog model + language fields.
      // Skips silently when no catalogs are wired (legacy callers / tests).
      (cfg, changes, ctx) => {
        const catalogs = ctx.catalogs;
        if (!catalogs)
          return { valid: true };
        const errors = [];
        const changedKeys = new Set(changes.map((change) => change.key));
        const checkModel = (field, channel) => {
          if (!changedKeys.has(field))
            return;
          const value = cfg[field];
          if (typeof value !== "string" || value.length === 0)
            return;
          const allowed = catalogs.modelIdsByChannel?.[channel];
          if (allowed && allowed.size > 0 && !allowed.has(value)) {
            errors.push({ field, error: `${channel.toUpperCase()} model "${value}" is not available.` });
          }
        };
        checkModel("llm_model", "llm");
        checkModel("stt_model", "stt");
        checkModel("tts_model", "tts");
        if (changedKeys.has("language") && typeof cfg.language === "string" && cfg.language.length > 0) {
          const codes = catalogs.languageCodes;
          if (codes && codes.size > 0 && !codes.has(cfg.language)) {
            errors.push({ field: "language", error: `Language "${cfg.language}" is not supported.` });
          }
        }
        if (changedKeys.has("supported_languages") && Array.isArray(cfg.supported_languages)) {
          if (cfg.supported_languages.length === 0) {
            errors.push({ field: "supported_languages", error: `At least one supported language must be selected.` });
          }
          const codes = catalogs.languageCodes;
          if (codes && codes.size > 0) {
            for (const lang of cfg.supported_languages) {
              if (typeof lang === "string" && !codes.has(lang)) {
                errors.push({ field: "supported_languages", error: `Language "${lang}" is not supported.` });
              }
            }
          }
        }
        return errors.length === 0 ? { valid: true } : { valid: false, errors };
      }
    ];
    DERIVED_SERIALIZE_RULES = [
      { key: "requireConsent", compute: (cfg) => Boolean(cfg.requireConsent || cfg.recordingEnabled) }
    ];
    AGENT_CONFIG_SCHEMA = [
      {
        key: "recordingEnabled",
        label: "Call Recording",
        aliases: ["record calls", "call recording", "recording"],
        description: "Record audio of every call for review and training.",
        default: false,
        type: { kind: "boolean" },
        apiPath: "features.recording_enabled",
        section: "features",
        editableIn: "both",
        clarifyable: true
      },
      {
        key: "recordingFormat",
        label: "Recording Format",
        aliases: ["recording file type", "audio format"],
        description: "File format for new recordings. Changing it applies to future calls; past recordings keep their format.",
        default: "mp3",
        type: { kind: "enum", options: [
          { value: "mp3", label: "MP3", description: "Compressed, plays everywhere. Best default for download." },
          { value: "wav", label: "WAV", description: "Lossless. Largest files \u2014 for compliance or analysis." },
          { value: "opus", label: "Opus", description: "Smallest files, voice-optimized. Modern players." }
        ] },
        apiPath: "features.recording_format",
        section: "features",
        editableIn: "both"
      },
      {
        key: "recordingChannels",
        label: "Recording Channels",
        aliases: ["recording layout", "dual channel recording"],
        description: "Mixed mono, or dual-channel with the caller and agent on separate tracks (left / right).",
        default: "mixed",
        type: { kind: "enum", options: [
          { value: "mixed", label: "Mixed (mono)", description: "Both speakers in one track." },
          { value: "dual", label: "Dual channel", description: "Caller left, agent right \u2014 best for review and per-speaker transcription." }
        ] },
        apiPath: "features.recording_channels",
        section: "features",
        editableIn: "both"
      },
      {
        key: "bargeInEnabled",
        label: "Allow Interruptions",
        aliases: ["interruptions", "barge in", "caller can interrupt"],
        description: "Caller can interrupt the agent mid-sentence.",
        default: true,
        type: { kind: "boolean" },
        apiPath: "persona.voiceConfig.bargeInEnabled",
        section: "advanced",
        editableIn: "create",
        clarifyable: true
      },
      {
        key: "tone",
        label: "Tone",
        aliases: ["personality", "speaking style", "conversation style"],
        description: "The personality of the agent's voice \u2014 shapes every sentence.",
        default: "",
        type: { kind: "enum", options: [
          { value: "Warm & Friendly", label: "Warm & Friendly", description: "Approachable, conversational" },
          { value: "Professional & Direct", label: "Professional & Direct", description: "Clear, efficient" },
          { value: "Casual & Conversational", label: "Casual & Conversational", description: "Relaxed, like a friend" },
          { value: "Empathetic & Patient", label: "Empathetic & Patient", description: "Supportive, takes its time" },
          { value: "Energetic & Confident", label: "Energetic & Confident", description: "Upbeat, assertive" },
          { value: "Formal & Precise", label: "Formal & Precise", description: "Measured, authoritative" }
        ] },
        apiPath: "persona.toneOverride",
        section: "identity",
        editableIn: "both",
        clarifyable: true,
        renderer: "tone-chips",
        normalize: {
          canonical: (v) => typeof v === "string" ? v.trim() || "" : "",
          fuzzy: { threshold: 3, audit: true }
        }
      },
      {
        key: "voice",
        label: "Voice",
        aliases: ["speaker", "tts voice", "voice identity"],
        description: "TTS voice identity. Must match the current agent role.",
        default: "",
        type: { kind: "enum-catalog", catalog: "voice" },
        apiPath: "voice",
        section: "stack",
        editableIn: "both",
        clarifyable: true,
        renderer: "voice-with-preview",
        requiresReinit: true
      },
      {
        key: "language",
        label: "Language",
        aliases: ["locale", "spoken language"],
        description: "The primary language the agent speaks.",
        default: null,
        type: { kind: "enum-catalog", catalog: "language" },
        apiPath: "language",
        section: "identity",
        editableIn: "both",
        clarifyable: true,
        normalize: {
          canonical: (v) => typeof v === "string" ? v.trim() || null : null,
          fuzzy: { threshold: 2, audit: true }
        }
      },
      {
        key: "supported_languages",
        label: "Supported Languages",
        description: "The explicit list of languages this agent can run.",
        default: ["en-US"],
        type: { kind: "list-string" },
        apiPath: "supported_languages",
        section: "identity",
        editableIn: "both"
      },
      {
        key: "silencePromptDelay",
        label: "Silence Prompt Delay",
        aliases: ["silence timeout", "wait before prompting", "dead air prompt"],
        description: "How long the agent waits before prompting on silence.",
        default: 15,
        // max was 2000 while the unit was 'ms'; in seconds that let Studio accept a
        // 33-minute check-in delay. Real agents run 6-15 s.
        type: { kind: "number", min: 1, max: 60, unit: "s" },
        apiPath: "advanced.silencePromptDelay",
        section: "advanced",
        editableIn: "both",
        clarifyable: true,
        renderer: "numeric-preset-chips"
      },
      {
        key: "opener",
        label: "Greeting",
        aliases: ["opening line", "first message", "agent intro"],
        description: "First thing the agent says when the call connects.",
        default: "",
        type: { kind: "string", maxLength: 1e3 },
        apiPath: "playbook.opener",
        section: "playbook",
        editableIn: "both",
        clarifyable: true
      },
      {
        key: "llm_model",
        label: "AI Model",
        aliases: ["model", "llm", "brain"],
        description: "The underlying Large Language Model driving conversations.",
        default: null,
        type: { kind: "enum-catalog", catalog: "llm_model" },
        apiPath: "llm_model",
        section: "stack",
        editableIn: "create",
        // Not editable in edit mode
        clarifyable: true,
        requiresReinit: true
      },
      {
        key: "extractionTags",
        label: "Extraction Tags",
        description: "Fields to extract after the call completes.",
        default: [],
        type: { kind: "list-object", itemShape: [
          { key: "tag", type: { kind: "string" }, required: true },
          { key: "type", type: { kind: "string" }, required: true },
          { key: "description", type: { kind: "string" }, required: false }
        ] },
        apiPath: "persona.extractionTags",
        section: "intelligence",
        editableIn: "both",
        renderer: "extraction-tags"
      },
      // ── Identity / Persona ──────────────────────────────────────────────────
      { key: "name", label: "Agent Name", aliases: ["name", "display name", "persona name"], description: "The name the agent introduces itself with on calls.", default: "Rymi", type: { kind: "string", maxLength: 100 }, apiPath: "persona.name", section: "identity", editableIn: "both", clarifyable: true, publishRequired: true },
      // Studio-only label (sidebar, lists, call logs). Callers never hear it; empty
      // on a new agent means "derive Name · Role" at save.
      { key: "label", label: "Studio Label", aliases: ["studio name", "agent label", "internal name"], description: "Studio-only name shown in the sidebar and lists. Callers never hear it.", default: "", type: { kind: "string", maxLength: 100 }, apiPath: "name", section: "identity", editableIn: "both" },
      { key: "companyName", label: "Company Name", aliases: ["business name", "brand name"], description: "Name of the company the agent represents.", default: "", type: { kind: "string", maxLength: 200 }, apiPath: "persona.companyName", section: "identity", editableIn: "both", clarifyable: true },
      { key: "companyWebsite", label: "Company Website", aliases: ["website", "site url", "business url"], description: "URL of the company website for enrichment.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "persona.companyWebsite", section: "identity", editableIn: "both" },
      { key: "companyDescription", label: "Company Description", aliases: ["business description", "company context"], description: "Brief description injected into the system prompt.", default: "", type: { kind: "string", maxLength: 2e3 }, apiPath: "persona.companyDescription", section: "identity", editableIn: "both" },
      { key: "businessType", label: "Business Type", aliases: ["industry", "vertical", "business category"], description: "Business vertical used to ground the agent. Falls back to the account default.", default: "", type: { kind: "string", maxLength: 200 }, apiPath: "persona.businessType", section: "identity", editableIn: "both" },
      { key: "knowledgeBase", label: "Knowledge Base", aliases: ["knowledge", "facts", "context"], description: "Key facts the agent can reference during calls.", default: [], type: { kind: "list-string" }, apiPath: "persona.knowledgeBase", section: "identity", editableIn: "both", contextKeywords: ["knowledge", "context", "url", "fact"] },
      { key: "role", label: "Role", aliases: ["agent role", "job", "purpose"], description: "The role the agent plays (e.g. Sales Rep, Support Agent).", default: "", type: { kind: "string", maxLength: 200 }, apiPath: "persona.role", section: "identity", editableIn: "both", clarifyable: true, publishRequired: true },
      { key: "audienceDescription", label: "Audience", aliases: ["callers", "customers", "target audience"], description: "Who the agent talks to.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "persona.audienceDescription", section: "identity", editableIn: "both" },
      { key: "accent", label: "Accent", description: "Regional accent hint for TTS.", default: "", type: { kind: "string", maxLength: 50 }, apiPath: "persona.voiceConfig.accent", section: "identity", editableIn: "both" },
      { key: "callerPersonas", label: "Caller Personas", description: "Persona archetypes the agent should handle.", default: [], type: { kind: "list-object", itemShape: [{ key: "type", type: { kind: "string" }, required: true }, { key: "approach", type: { kind: "string" }, required: false }] }, apiPath: "persona.callerPersonas", section: "identity", editableIn: "both" },
      {
        key: "variables",
        label: "Caller Variables",
        aliases: ["caller variables", "metadata", "fields to ask"],
        description: "Variables the agent can read from caller metadata, ask for live, or extract after the call.",
        default: [],
        type: {
          kind: "list-object",
          itemShape: [
            { key: "key", type: { kind: "string" }, required: true },
            { key: "description", type: { kind: "string" }, required: true },
            { key: "metadataKey", type: { kind: "string" }, required: false },
            { key: "required", type: { kind: "boolean" }, required: true },
            { key: "default", type: { kind: "string" }, required: false },
            {
              key: "acquisition",
              type: {
                kind: "enum",
                options: [
                  { value: "ask", label: "Ask" },
                  { value: "extract", label: "Extract" },
                  { value: "none", label: "None" }
                ]
              },
              required: false
            },
            { key: "origin", type: { kind: "string" }, required: false },
            {
              key: "type",
              type: {
                kind: "enum",
                options: [
                  { value: "string", label: "String" },
                  { value: "number", label: "Number" },
                  { value: "boolean", label: "Boolean" },
                  { value: "enum", label: "Enum" }
                ]
              },
              required: false
            },
            { key: "enumValues", type: { kind: "list-string" }, required: false }
          ]
        },
        apiPath: "playbook.variables",
        section: "routing",
        editableIn: "both"
      },
      // ── Playbook ────────────────────────────────────────────────────────────
      { key: "qualificationFlow", label: "Qualification Flow", aliases: ["questions", "discovery questions", "screening flow"], description: "Discovery questions the agent asks sequentially.", default: [], type: { kind: "list-object", itemShape: [{ key: "question", type: { kind: "string" }, required: true }, { key: "listensFor", type: { kind: "string" }, required: false }] }, apiPath: "playbook.qualificationFlow", section: "playbook", editableIn: "both", contextKeywords: ["qualif", "question", "flow", "screen"] },
      { key: "requiredSlots", label: "Required Slots", aliases: ["required data", "fields to collect", "must collect"], description: "Information the agent must collect before closing.", default: [], type: { kind: "list-string" }, apiPath: "playbook.requiredSlots", section: "playbook", editableIn: "both", contextKeywords: ["slot", "field", "capture", "extract", "required"] },
      { key: "primaryCTA", label: "Primary CTA", aliases: ["main goal", "primary goal", "closing action"], description: "Closing call-to-action when qualification succeeds.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "playbook.closingCTA", section: "playbook", editableIn: "both" },
      { key: "fallbackCTA", label: "Backup Goal", aliases: ["backup goal", "fallback action", "secondary cta", "fallback objective", "secondary goal"], description: "Fallback objective when the primary goal cannot be reached.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "playbook.fallbackCTA", section: "playbook", editableIn: "both" },
      { key: "escalationRule", label: "Escalation Rule", aliases: ["handoff rule", "transfer rule", "human escalation"], description: "When and how to escalate to a human.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "playbook.escalationRule", section: "playbook", editableIn: "both" },
      { key: "endCallMessage", label: "End-Call Message", aliases: ["goodbye", "sign off", "closing line"], description: "Final line the agent says right before hanging up a successful call.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "playbook.endCallMessage", section: "playbook", editableIn: "both", clarifyable: true },
      { key: "scripts", label: "Scripts", aliases: ["talk tracks", "call scripts", "situational scripts"], description: "Situational scripts the agent can follow.", default: [], type: { kind: "list-object", itemShape: [{ key: "title", type: { kind: "string" }, required: true }, { key: "when", type: { kind: "string" }, required: false }, { key: "content", type: { kind: "string" }, required: true }] }, apiPath: "playbook.scripts", section: "playbook", editableIn: "both", renderer: "dynamic-array-scripts", contextKeywords: ["script", "closing", "wrap"] },
      { key: "objections", label: "Objection Handlers", aliases: ["objections", "pushback", "rebuttals"], description: "Trigger-response pairs for common objections.", default: [], type: { kind: "list-object", itemShape: [{ key: "trigger", type: { kind: "string" }, required: true }, { key: "response", type: { kind: "string" }, required: true }] }, apiPath: "playbook.objectionHandlers", section: "playbook", editableIn: "both", contextKeywords: ["objection", "rebuttal", "pushback", "handle"] },
      // ── Intelligence ────────────────────────────────────────────────────────
      { key: "successCriteria", label: "Success Criteria", aliases: ["success metrics", "winning outcome", "completion criteria"], description: "Conditions that define a successful call.", default: [], type: { kind: "list-string" }, apiPath: "persona.successCriteria", section: "intelligence", editableIn: "both", contextKeywords: ["goal", "success", "criteria", "metric"] },
      { key: "postCallSchema", label: "Extraction Schema Fields", description: "Fields derived from the post-call extraction schema.", default: [], type: { kind: "list-string" }, apiPath: "post_call.structured_extraction.json_schema", section: "intelligence", editableIn: "both" },
      { key: "restrictedTopics", label: "Restricted Topics", aliases: ["off limits", "avoid topics", "blocked topics"], description: "Topics the agent must avoid discussing.", default: [], type: { kind: "list-string" }, apiPath: "advanced.offLimitsTopics", section: "intelligence", editableIn: "both", contextKeywords: ["restrict", "off limit", "avoid", "topic"] },
      { key: "forbiddenPromises", label: "Forbidden Promises", aliases: ["prohibited claims", "never say", "forbidden claims"], description: "Claims the agent must never make.", default: [], type: { kind: "list-string" }, apiPath: "advanced.prohibitedClaims", section: "intelligence", editableIn: "both", contextKeywords: ["forbidden", "promise", "claim", "prohibit"] },
      { key: "offLimits", label: "Off-Limits (raw)", description: "Comma-separated off-limits topics string.", default: "", type: { kind: "string", maxLength: 2e3 }, apiPath: "advanced.offLimitsTopics", section: "advanced", editableIn: "both" },
      { key: "prohibitedClaims", label: "Prohibited Claims (raw)", description: "Comma-separated prohibited claims string.", default: "", type: { kind: "string", maxLength: 2e3 }, apiPath: "advanced.prohibitedClaims", section: "advanced", editableIn: "both" },
      // ── Stack ───────────────────────────────────────────────────────────────
      { key: "llm_provider", label: "LLM Provider", description: "AI provider powering the agent.", default: "gemini", type: { kind: "enum", options: [{ value: "gemini", label: "Gemini" }, { value: "openai", label: "OpenAI" }, { value: "anthropic", label: "Anthropic" }, { value: "sarvam", label: "Sarvam" }, { value: "groq", label: "Groq" }, { value: "xai", label: "xAI" }, { value: "ultravox", label: "Ultravox" }] }, apiPath: "llm_provider", section: "stack", editableIn: "create" },
      { key: "stt_provider", label: "STT Provider", description: "Speech-to-text provider.", default: void 0, type: { kind: "string" }, apiPath: "stt_provider", section: "stack", editableIn: "both" },
      { key: "stt_model", label: "STT Model", description: "Speech-to-text model.", default: null, type: { kind: "enum-catalog", catalog: "stt_model" }, apiPath: "stt_model", section: "stack", editableIn: "both", clarifyable: true, requiresReinit: true },
      { key: "tts_provider", label: "TTS Provider", description: "Text-to-speech provider.", default: void 0, type: { kind: "string" }, apiPath: "tts_provider", section: "stack", editableIn: "both" },
      { key: "tts_model", label: "TTS Model", description: "Text-to-speech model.", default: null, type: { kind: "enum-catalog", catalog: "tts_model" }, apiPath: "tts_model", section: "stack", editableIn: "both", clarifyable: true, requiresReinit: true },
      // ── Features ────────────────────────────────────────────────────────────
      { key: "transcriptionEnabled", label: "Transcription", description: "Generate text transcripts of calls.", default: true, type: { kind: "boolean" }, apiPath: "features.transcription_enabled", section: "features", editableIn: "both" },
      { key: "requireConsent", label: "Require Consent", description: "Ask caller for recording consent before proceeding.", default: true, type: { kind: "boolean" }, apiPath: "features.require_consent", section: "features", editableIn: "both" },
      { key: "postCallSummaryEnabled", label: "Post-Call Summary", description: "Generate an AI summary after each call.", default: true, type: { kind: "boolean" }, apiPath: "post_call.summary.enabled", section: "features", editableIn: "both" },
      { key: "postCallSummaryPrompt", label: "Summary Prompt", description: "Custom prompt for post-call summary generation.", default: "Summarize the call in a few sentences: the caller's main reason for calling, what was discussed or resolved, and any agreed next steps.", type: { kind: "string", maxLength: 2e3 }, apiPath: "post_call.summary.prompt", section: "features", editableIn: "both" },
      { key: "postCallExtractionEnabled", label: "Post-Call Extraction", description: "Extract structured data from call transcripts.", default: false, type: { kind: "boolean" }, apiPath: "post_call.structured_extraction.prompt", section: "features", editableIn: "both" },
      { key: "postCallExtractionFields", label: "Extraction Fields", description: "Fields to extract from call transcripts.", default: [], type: { kind: "list-string" }, apiPath: "post_call.structured_extraction.json_schema", section: "features", editableIn: "both" },
      { key: "postCallEvaluationEnabled", label: "Post-Call Evaluation", description: "Score calls against a rubric.", default: true, type: { kind: "boolean" }, apiPath: "post_call.evaluation.rubric", section: "features", editableIn: "both" },
      { key: "postCallEvaluationRubric", label: "Evaluation Rubric", description: "Custom rubric for call scoring.", default: "", type: { kind: "string", maxLength: 5e3 }, apiPath: "post_call.evaluation.rubric", section: "features", editableIn: "both" },
      { key: "postCallLlmProvider", label: "Post-Call LLM Provider", description: "Provider for post-call analysis.", default: "", type: { kind: "enum", options: [{ value: "", label: "Default" }, { value: "gemini", label: "Gemini" }, { value: "openai", label: "OpenAI" }] }, apiPath: "post_call.model.provider", section: "features", editableIn: "both" },
      { key: "postCallLlmModel", label: "Post-Call LLM Model", description: "Model for post-call analysis.", default: "", type: { kind: "string" }, apiPath: "post_call.model.model", section: "features", editableIn: "both" },
      {
        key: "tools",
        label: "Tools",
        description: "Per-agent built-in tool bindings.",
        default: [],
        type: {
          kind: "list-object",
          itemShape: [
            { key: "tool_id", type: { kind: "string" }, required: true },
            { key: "enabled", type: { kind: "boolean" }, required: true },
            { key: "credential_ref", type: { kind: "string" }, required: false },
            { key: "timeout_ms", type: { kind: "number", min: 1 }, required: false },
            { key: "side_effect", type: { kind: "string" }, required: false }
          ]
        },
        apiPath: "tools",
        section: "tools",
        editableIn: "both",
        runtimeAffecting: true
      },
      // ── Runtime Timing ──────────────────────────────────────────────────────
      { key: "maxTurnLength", label: "Max Turn Length", description: "Maximum number of conversational turns.", default: 50, type: { kind: "number", min: 1, max: 200 }, apiPath: "advanced.maxTurnLength", section: "advanced", editableIn: "both" },
      { key: "postSilenceHangup", label: "Post-Silence Hangup", description: "Hang up after this many seconds of silence.", default: 30, type: { kind: "number", min: 1, max: 6e4, unit: "s" }, apiPath: "advanced.postSilenceHangup", section: "advanced", editableIn: "both" },
      { key: "silencePromptMaxCount", label: "Silence Check-ins", description: "How many times the agent checks on a silent caller before the silence goodbye.", default: 2, type: { kind: "number", min: 1, max: 3 }, apiPath: "advanced.silencePromptMaxCount", section: "advanced", editableIn: "both" },
      { key: "silenceHangupMessage", label: "Silence Goodbye", description: "Exact line spoken before a silence hangup. Leave empty to let the agent say a short goodbye in the caller's language.", default: "", type: { kind: "string", maxLength: 200 }, apiPath: "advanced.silenceHangupMessage", section: "advanced", editableIn: "both" },
      { key: "maxCallDuration", label: "Max Call Duration", description: "Hard limit on call length.", default: 600, type: { kind: "number", min: 30, max: 7200, unit: "s" }, apiPath: "advanced.maxCallDuration", section: "advanced", editableIn: "both" },
      { key: "startSpeakingThreshold", label: "Start Speaking Threshold", description: "Delay before the agent begins speaking.", default: 0.5, type: { kind: "number", min: 0, max: 5, unit: "s" }, apiPath: "advanced.startSpeakingThreshold", section: "advanced", editableIn: "both" },
      { key: "startSpeakingPhrasing", label: "Start Speaking Mode", description: "Whether the agent greets first or waits.", default: "agent_greets", type: { kind: "enum", options: [{ value: "agent_greets", label: "Agent Greets" }, { value: "wait_for_user", label: "Wait for User" }] }, apiPath: "advanced.startSpeakingPhrasing", section: "advanced", editableIn: "both" },
      { key: "replyDelay", label: "Reply Delay", description: "Artificial pause before agent responds.", default: 0.5, type: { kind: "number", min: 0, max: 5, unit: "s" }, apiPath: "advanced.replyDelay", section: "advanced", editableIn: "both" },
      { key: "stopSpeakingThreshold", label: "Stop Speaking Threshold", description: "How quickly the agent yields when interrupted.", default: 0.25, type: { kind: "number", min: 0, max: 2, unit: "s" }, apiPath: "advanced.stopSpeakingThreshold", section: "advanced", editableIn: "both" },
      { key: "resumeAfterInterruption", label: "Resume After Interruption", description: "Agent resumes its sentence after barge-in.", default: false, type: { kind: "boolean" }, apiPath: "advanced.resumeAfterInterruption", section: "advanced", editableIn: "both" },
      { key: "smartEndpointing", label: "Smart Endpointing", description: "Use NLU-based sentence boundary detection.", default: false, type: { kind: "boolean" }, apiPath: "advanced.smartEndpointing", section: "advanced", editableIn: "both" },
      { key: "turnEndpointer", label: "Turn Endpointer", description: "End-of-turn detection engine: Smart Turn v3 or silence timer only.", default: "smart-turn-v3", type: { kind: "enum", options: [{ value: "smart-turn-v3", label: "Smart Turn v3" }, { value: "timer", label: "Timer" }] }, apiPath: "advanced.turnEndpointer", section: "advanced", editableIn: "both" },
      { key: "waitAfterSentence", label: "Wait After Sentence", description: "Pause after a complete sentence.", default: 0.5, type: { kind: "number", min: 0, max: 5, unit: "s" }, apiPath: "advanced.waitAfterSentence", section: "advanced", editableIn: "both" },
      { key: "waitAfterNoPunctuation", label: "Wait After No Punctuation", description: "Pause after speech with no punctuation.", default: 1, type: { kind: "number", min: 0, max: 5, unit: "s" }, apiPath: "advanced.waitAfterNoPunctuation", section: "advanced", editableIn: "both" },
      { key: "waitAfterNumbers", label: "Wait After Numbers", description: "Extra pause after numeric sequences.", default: 1.5, type: { kind: "number", min: 0, max: 5, unit: "s" }, apiPath: "advanced.waitAfterNumbers", section: "advanced", editableIn: "both" },
      { key: "endpointing_silence_ms", label: "End-of-Turn Silence", aliases: ["silence timeout", "turn timer", "endpointing timer"], description: "Global: how long the caller must pause before the agent treats the turn as finished. Applies to every provider \u2014 it is the silence-timer floor used directly when Smart Endpointing is off, and the fallback when Smart Turn v3 is undecided.", default: 500, type: { kind: "number", min: 200, max: 3e3, unit: "ms" }, apiPath: "advanced.endpointing_silence_ms", section: "advanced", editableIn: "both" },
      // ── LLM Tuning ──────────────────────────────────────────────────────────
      { key: "temperature", label: "Temperature", aliases: ["llm temperature", "creativity", "randomness"], description: "Sampling temperature for the LLM. Lower = more deterministic. 0.5 is a balanced default.", default: 0.5, type: { kind: "number", min: 0, max: 2 }, apiPath: "advanced.temperature", section: "advanced", editableIn: "both", clarifyable: true },
      { key: "maxTokens", label: "Max Response Tokens", aliases: ["max tokens", "response length", "token cap"], description: "Hard cap on the LLM response length per turn. Lower keeps replies short and snappy.", default: 250, type: { kind: "number", min: 1, max: 4096 }, apiPath: "advanced.maxTokens", section: "advanced", editableIn: "both", clarifyable: true },
      // ── STT Tuning ──────────────────────────────────────────────────────────
      { key: "stt_confidence_threshold", label: "STT Confidence Threshold", description: "Minimum confidence score for accepted transcriptions. Transcripts below this score are filtered out.", default: 0.4, type: { kind: "number", min: 0, max: 1 }, apiPath: "advanced.stt_confidence_threshold", section: "advanced", editableIn: "both" },
      { key: "stt_numeral_formatting", label: "Numeral Formatting", description: "Convert spoken numbers to digits in transcripts.", default: true, type: { kind: "boolean" }, apiPath: "advanced.stt_numeral_formatting", section: "advanced", editableIn: "both" },
      { key: "stt_profanity_filter", label: "Profanity Filter", description: "Mask profanity in transcriptions.", default: false, type: { kind: "boolean" }, apiPath: "advanced.stt_profanity_filter", section: "advanced", editableIn: "both" },
      { key: "stt_keywords", label: "STT Keywords", description: "Comma-separated keywords to boost STT accuracy.", default: "", type: { kind: "string", maxLength: 1e3 }, apiPath: "advanced.stt_keywords", section: "advanced", editableIn: "both" },
      { key: "pronunciations", label: "Pronunciations", aliases: ["pronunciation", "pronounce", "say as", "how to say"], description: "Words the agent should say a specific way: each word with how to say it, plus optional IPA where the voice engine reads it.", default: [], type: { kind: "list-object", itemShape: [{ key: "word", type: { kind: "string", maxLength: 64 }, required: true }, { key: "say_as", type: { kind: "string", maxLength: 128 }, required: true }, { key: "ipa", type: { kind: "string", maxLength: 128 }, required: false }] }, apiPath: "advanced.pronunciations", section: "advanced", editableIn: "both" },
      { key: "stt_background_denoising", label: "Background Denoising", aliases: ["denoise", "noise suppression", "background noise"], description: "Server-side noise suppression on the inbound audio (Deepgram smart-format).", default: true, type: { kind: "boolean" }, apiPath: "advanced.stt_background_denoising", section: "advanced", editableIn: "both" },
      { key: "noise_cancellation_krisp", label: "Krisp Noise Cancellation", aliases: ["krisp", "noise cancellation", "inbound denoising", "background voice"], description: "Transport-level inbound noise + background-voice cancellation (LiveKit Krisp). On by default for cloud calls; turn off to feed the raw caller audio to the recognizer.", default: true, type: { kind: "boolean" }, apiPath: "advanced.noise_cancellation_krisp", section: "advanced", editableIn: "both" },
      { key: "stt_eot_confidence", label: "End-of-Turn Confidence", description: "Deepgram Flux: how sure the model must be before deciding you finished speaking.", default: 0.7, type: { kind: "number", min: 0.5, max: 0.9 }, apiPath: "advanced.stt_eot_confidence", section: "advanced", editableIn: "both" },
      { key: "stt_eot_timeout_ms", label: "End-of-Turn Timeout", description: "Deepgram Flux: max silence before end-of-turn is forced.", default: 5e3, type: { kind: "number", min: 500, max: 1e4, unit: "ms" }, apiPath: "advanced.stt_eot_timeout_ms", section: "advanced", editableIn: "both" },
      { key: "stt_min_turn_silence_ms", label: "Min Turn Silence", description: "AssemblyAI: minimum silence before detecting end-of-turn when confident.", default: 160, type: { kind: "number", min: 0, max: 3e3, unit: "ms" }, apiPath: "advanced.stt_min_turn_silence_ms", section: "advanced", editableIn: "both" },
      { key: "stt_max_turn_silence_ms", label: "Max Turn Silence", description: "AssemblyAI: maximum silence before forcing end-of-turn.", default: 400, type: { kind: "number", min: 0, max: 1e4, unit: "ms" }, apiPath: "advanced.stt_max_turn_silence_ms", section: "advanced", editableIn: "both" },
      { key: "stt_strict_language", label: "Strict Language", description: "Soniox: strongly prefer the agent language instead of auto-detecting 60+.", default: false, type: { kind: "boolean" }, apiPath: "advanced.stt_strict_language", section: "advanced", editableIn: "both" },
      { key: "stt_endpoint_delay_ms", label: "Endpoint Delay", description: "Soniox: max delay before confirming a final utterance.", default: 500, type: { kind: "number", min: 500, max: 3e3, unit: "ms" }, apiPath: "advanced.stt_endpoint_delay_ms", section: "advanced", editableIn: "both" },
      { key: "stt_custom_vocabulary", label: "Custom Vocabulary", description: "Soniox: comma-separated terms to bias transcription.", default: "", type: { kind: "string", maxLength: 2e3 }, apiPath: "advanced.stt_custom_vocabulary", section: "advanced", editableIn: "both" },
      { key: "stt_context", label: "Transcription Context", description: 'Soniox: domain hints ("key: value" per line) that guide transcription.', default: "", type: { kind: "string", maxLength: 2e3 }, apiPath: "advanced.stt_context", section: "advanced", editableIn: "both" },
      // ── Telephony ───────────────────────────────────────────────────────────
      { key: "transferNumber", label: "Transfer Number", description: "E.164 number for blind transfer escalation.", default: "", type: { kind: "string", maxLength: 20 }, apiPath: "advanced.transferNumber", section: "telephony", editableIn: "both" },
      { key: "smsContinuationEnabled", label: "SMS Continuation", description: "Send disconnect SMS on unexpected media failure.", default: false, type: { kind: "boolean" }, apiPath: "post_call.sms_continuation.enabled", section: "telephony", editableIn: "both" },
      { key: "smsContinuationReconnectUrl", label: "SMS Reconnect URL", description: "URL embedded in the disconnect SMS.", default: "", type: { kind: "string", maxLength: 500 }, apiPath: "post_call.sms_continuation.reconnect_url", section: "telephony", editableIn: "both" },
      { key: "voicemailBehavior", label: "Voicemail Behavior", description: "What to do when reaching voicemail.", default: "leave_message", type: { kind: "enum", options: [{ value: "leave_message", label: "Leave Message" }, { value: "hangup", label: "Hang Up" }] }, apiPath: "post_call.voicemail.behavior", section: "telephony", editableIn: "both" },
      { key: "voicemailScript", label: "Voicemail Script", description: "Message spoken into voicemail.", default: "", type: { kind: "string", maxLength: 1e3 }, apiPath: "post_call.voicemail.script", section: "telephony", editableIn: "both" },
      { key: "disableCallerMemory", label: "Disable Caller Memory", description: "Skip cross-call memory lookup for this agent.", default: false, type: { kind: "boolean" }, apiPath: "post_call.caller_memory.disabled", section: "telephony", editableIn: "both" }
    ];
    graph = {};
    for (const f of AGENT_CONFIG_SCHEMA) {
      graph[f.key] = { affects: [], affectedBy: [] };
    }
    for (const f of AGENT_CONFIG_SCHEMA) {
      if (f.implies) {
        for (const rule of f.implies) {
          for (const targetKey of Object.keys(rule.set)) {
            if (!graph[targetKey])
              graph[targetKey] = { affects: [], affectedBy: [] };
            if (!graph[f.key])
              graph[f.key] = { affects: [], affectedBy: [] };
            if (!graph[f.key].affects.includes(targetKey)) {
              graph[f.key].affects.push(targetKey);
            }
            if (!graph[targetKey].affectedBy.includes(f.key)) {
              graph[targetKey].affectedBy.push(f.key);
            }
          }
        }
      }
    }
    DEPENDENCY_GRAPH = graph;
    CONTEXT_EXCLUDED = /* @__PURE__ */ new Set(["id", "provider_config", "attached_numbers", "chat_summary", "offLimits", "prohibitedClaims", "postCallSchema", "postCallExtractionFields", "postCallLlmProvider", "postCallLlmModel"]);
    HYDRATION_OVERRIDES = /* @__PURE__ */ new Set([
      "llm_provider",
      "llm_model",
      "stt_provider",
      "stt_model",
      "tts_provider",
      "tts_model",
      "language",
      "supported_languages",
      "callerPersonas",
      "qualificationFlow",
      "requiredSlots",
      "scripts",
      "objections",
      "restrictedTopics",
      "forbiddenPromises",
      "extractionTags",
      "postCallSchema",
      "postCallExtractionFields",
      "postCallSummaryEnabled",
      "postCallExtractionEnabled",
      "postCallEvaluationEnabled",
      "voicemailBehavior"
    ]);
    SERIALIZATION_OVERRIDES = /* @__PURE__ */ new Set([
      "voice",
      "llm_provider",
      "llm_model",
      "stt_provider",
      "stt_model",
      "tts_provider",
      "tts_model",
      "tone",
      "language",
      "supported_languages",
      "accent",
      "knowledgeBase",
      "callerPersonas",
      "successCriteria",
      "extractionTags",
      "qualificationFlow",
      "requiredSlots",
      "scripts",
      "objections",
      "primaryCTA",
      "offLimits",
      "prohibitedClaims",
      "restrictedTopics",
      "forbiddenPromises",
      "postCallSummaryEnabled",
      "postCallSummaryPrompt",
      "postCallExtractionEnabled",
      "postCallExtractionFields",
      "postCallEvaluationEnabled",
      "postCallEvaluationRubric",
      "postCallLlmProvider",
      "postCallLlmModel",
      "smsContinuationReconnectUrl",
      "voicemailBehavior",
      "voicemailScript",
      "postCallSchema"
    ]);
    SECTION_ALIASES = [
      { section: "identity", aliases: ["agent identity", "voice settings", "language", "tone"] },
      { section: "playbook", aliases: ["script", "opening", "discovery", "questions", "objections"] },
      { section: "stack", aliases: ["ai stack", "models", "providers", "voice model"] },
      { section: "features", aliases: ["operations", "recording", "transcription", "post-call"] },
      { section: "intelligence", aliases: ["goals", "safety rules", "data capture", "restricted topics"] },
      { section: "advanced", aliases: ["timing", "turn taking", "conversation flow", "settings"] },
      { section: "routing", aliases: ["caller routing", "caller types", "personas"] },
      { section: "telephony", aliases: ["phone", "sms", "transfer", "voicemail"] }
    ];
    FIELD_REFERENCE_CREATE = renderFieldReference("create");
    FIELD_REFERENCE_EDIT = renderFieldReference("edit");
  }
});

// ../shared-types/dist/businessTypes.js
function isCuratedBusinessType(value) {
  return typeof value === "string" && BUSINESS_TYPES.includes(value);
}
var BUSINESS_TYPES;
var init_businessTypes = __esm({
  "../shared-types/dist/businessTypes.js"() {
    "use strict";
    BUSINESS_TYPES = [
      "Healthcare / Clinic",
      "Real estate",
      "E-commerce / Retail",
      "Education / Coaching",
      "Finance / Lending / NBFC",
      "Insurance",
      "Restaurant / Hospitality",
      "Salon / Spa / Wellness & Fitness",
      "Automotive / Dealership",
      "Home & Local Services",
      "Recruitment / Staffing",
      "Professional services",
      "SaaS / Technology",
      "Travel / Logistics",
      "Non-profit / Government"
    ];
  }
});

// ../shared-types/dist/flatDiff.js
function resolveKey(draftPath) {
  return DRAFT_ALIASES[draftPath] ?? PATH_TO_KEY.get(draftPath);
}
function flattenDraft(draft) {
  const entries = [];
  const seen = /* @__PURE__ */ new Set();
  function emit(key, value) {
    if (value === void 0 || value === null || seen.has(key))
      return;
    seen.add(key);
    entries.push({ key, value });
  }
  function walk(obj, prefix) {
    for (const [field, value] of Object.entries(obj)) {
      if (value === void 0 || value === null)
        continue;
      const path = prefix ? `${prefix}.${field}` : field;
      const key = resolveKey(path);
      if (key) {
        emit(key, value);
      } else if (typeof value === "object" && !Array.isArray(value)) {
        walk(value, path);
      }
    }
  }
  walk(draft, "");
  if (seen.has("label") && !seen.has("name")) {
    emit("name", entries.find((e) => e.key === "label")?.value);
  }
  if (seen.has("offLimits") && !seen.has("restrictedTopics")) {
    const raw = entries.find((e) => e.key === "offLimits")?.value;
    if (typeof raw === "string") {
      emit("restrictedTopics", splitCommaList(raw));
    }
  }
  if (seen.has("prohibitedClaims") && !seen.has("forbiddenPromises")) {
    const raw = entries.find((e) => e.key === "prohibitedClaims")?.value;
    if (typeof raw === "string") {
      emit("forbiddenPromises", splitCommaList(raw));
    }
  }
  return entries;
}
function applyFlatDiff(currentConfig, entries, opts) {
  const config = {
    ...currentConfig,
    knowledgeBase: [...currentConfig.knowledgeBase || []],
    callerPersonas: [...currentConfig.callerPersonas || []],
    qualificationFlow: [...currentConfig.qualificationFlow || []],
    requiredSlots: [...currentConfig.requiredSlots || []],
    scripts: [...currentConfig.scripts || []],
    objections: [...currentConfig.objections || []],
    successCriteria: [...currentConfig.successCriteria || []],
    extractionTags: [...currentConfig.extractionTags || []],
    restrictedTopics: [...currentConfig.restrictedTopics || []],
    forbiddenPromises: [...currentConfig.forbiddenPromises || []],
    postCallSchema: [...currentConfig.postCallSchema || []],
    postCallExtractionFields: [...currentConfig.postCallExtractionFields || []],
    provider_config: currentConfig.provider_config
  };
  const changes = [];
  for (const { key, value } of entries) {
    const schema = getFieldByKey(key);
    if (!schema)
      continue;
    const kind = schema.type.kind;
    if (kind === "string" || kind === "enum" || kind === "enum-catalog") {
      applyString(config, changes, schema, value);
    } else if (kind === "boolean") {
      applyBoolean(config, changes, schema, value);
    } else if (kind === "number") {
      applyNumber(config, changes, schema, value);
    } else if (kind === "list-string" || kind === "list-object") {
      applyList(config, changes, schema, value, opts.appendLists);
    }
  }
  return { config, changes };
}
function applyString(config, changes, schema, value) {
  if (typeof value !== "string")
    return;
  let normalized = value.trim();
  if (schema.key === "voice")
    normalized = normalized.toLowerCase();
  if (!normalized || config[schema.key] === normalized)
    return;
  const from = config[schema.key];
  config[schema.key] = normalized;
  changes.push({ section: schema.section, field: schema.label, from, to: normalized });
}
function applyBoolean(config, changes, schema, value) {
  if (typeof value !== "boolean" || config[schema.key] === value)
    return;
  const from = config[schema.key];
  config[schema.key] = value;
  changes.push({ section: schema.section, field: schema.label, from, to: value });
}
function applyNumber(config, changes, schema, value) {
  if (typeof value !== "number" || Number.isNaN(value) || config[schema.key] === value)
    return;
  const from = config[schema.key];
  config[schema.key] = value;
  changes.push({ section: schema.section, field: schema.label, from, to: value });
}
function applyList(config, changes, schema, value, append) {
  if (!Array.isArray(value) || value.length === 0)
    return;
  let normalized = value;
  if (schema.key === "requiredSlots") {
    normalized = value.map((slot) => typeof slot === "string" ? slot : slot?.name).filter((s) => typeof s === "string" && s.trim().length > 0).map((s) => s.trim());
  }
  const current = Array.isArray(config[schema.key]) ? config[schema.key] : [];
  const next = append ? dedupeList([...current, ...normalized]) : dedupeList(normalized);
  if (sameJson(current, next))
    return;
  config[schema.key] = next;
  changes.push({
    section: schema.section,
    field: schema.label,
    from: current,
    to: { mode: append ? "append" : "replace", changed_items: normalized.length, total_items: next.length, value: next }
  });
}
function splitCommaList(value) {
  return value.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
}
function dedupeList(values) {
  const seen = /* @__PURE__ */ new Set();
  return values.filter((v) => {
    const k = stableKey(v);
    if (seen.has(k))
      return false;
    seen.add(k);
    return true;
  });
}
function stableKey(value) {
  if (typeof value === "string")
    return value.trim().toLowerCase();
  return JSON.stringify(sortObject(value));
}
function sortObject(value) {
  if (Array.isArray(value))
    return value.map(sortObject);
  if (!value || typeof value !== "object")
    return value;
  return Object.keys(value).sort().reduce((acc, key) => {
    acc[key] = sortObject(value[key]);
    return acc;
  }, {});
}
function sameJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
var PATH_TO_KEY, DRAFT_ALIASES;
var init_flatDiff = __esm({
  "../shared-types/dist/flatDiff.js"() {
    "use strict";
    init_agentConfigSchema();
    PATH_TO_KEY = /* @__PURE__ */ new Map();
    for (const f of AGENT_CONFIG_SCHEMA) {
      if (!PATH_TO_KEY.has(f.apiPath))
        PATH_TO_KEY.set(f.apiPath, f.key);
    }
    DRAFT_ALIASES = {
      // persona aliases
      "persona.tone": "tone",
      "persona.tone_override": "tone",
      "persona.audience_description": "audienceDescription",
      "persona.company_name": "companyName",
      "persona.company_website": "companyWebsite",
      "persona.company_description": "companyDescription",
      "persona.knowledge_base": "knowledgeBase",
      "persona.success_criteria": "successCriteria",
      "persona.extraction_tags": "extractionTags",
      "persona.voice_config.language": "language",
      "persona.voice_config.accent": "accent",
      "persona.voice_config.barge_in_enabled": "bargeInEnabled",
      "persona.voiceConfig.language": "language",
      "persona.voiceConfig.accent": "accent",
      "persona.voiceConfig.barge_in_enabled": "bargeInEnabled",
      // playbook aliases
      "playbook.closing_cta": "primaryCTA",
      "playbook.primaryCTA": "primaryCTA",
      "playbook.primary_cta": "primaryCTA",
      "playbook.qualification_flow": "qualificationFlow",
      "playbook.required_slots": "requiredSlots",
      "playbook.fallback_cta": "fallbackCTA",
      "playbook.escalation_rule": "escalationRule",
      "playbook.objection_handlers": "objections",
      // advanced aliases
      "advanced.off_limits_topics": "offLimits",
      "advanced.offLimitsTopics": "offLimits",
      "advanced.prohibited_claims": "prohibitedClaims",
      "advanced.prohibitedClaims": "prohibitedClaims",
      "advanced.max_turn_length": "maxTurnLength",
      "advanced.silence_prompt_delay": "silencePromptDelay",
      "advanced.post_silence_hangup": "postSilenceHangup",
      "advanced.silence_prompt_max_count": "silencePromptMaxCount",
      "advanced.silence_hangup_message": "silenceHangupMessage",
      "advanced.max_call_duration": "maxCallDuration",
      "advanced.start_speaking_threshold": "startSpeakingThreshold",
      "advanced.start_speaking_phrasing": "startSpeakingPhrasing",
      "advanced.reply_delay": "replyDelay",
      "advanced.stop_speaking_threshold": "stopSpeakingThreshold",
      "advanced.resume_after_interruption": "resumeAfterInterruption",
      "advanced.smart_endpointing": "smartEndpointing",
      "advanced.turn_endpointer": "turnEndpointer",
      "advanced.wait_after_sentence": "waitAfterSentence",
      "advanced.wait_after_no_punctuation": "waitAfterNoPunctuation",
      "advanced.wait_after_numbers": "waitAfterNumbers",
      "advanced.transfer_number": "transferNumber",
      "advanced.barge_in_enabled": "bargeInEnabled",
      // stack aliases (LLM uses stack.* section)
      "stack.llm_provider": "llm_provider",
      "stack.llm_model": "llm_model",
      "stack.stt_provider": "stt_provider",
      "stack.stt_model": "stt_model",
      "stack.tts_provider": "tts_provider",
      "stack.tts_model": "tts_model",
      // features aliases (camelCase and snake_case)
      "features.recordingEnabled": "recordingEnabled",
      "features.recording_enabled": "recordingEnabled",
      "features.recordingFormat": "recordingFormat",
      "features.recording_format": "recordingFormat",
      "features.recordingChannels": "recordingChannels",
      "features.recording_channels": "recordingChannels",
      "features.transcriptionEnabled": "transcriptionEnabled",
      "features.transcription_enabled": "transcriptionEnabled",
      "features.requireConsent": "requireConsent",
      "features.require_consent": "requireConsent",
      "features.postCallSummaryEnabled": "postCallSummaryEnabled",
      "features.post_call_summary_enabled": "postCallSummaryEnabled",
      "features.postCallExtractionEnabled": "postCallExtractionEnabled",
      "features.post_call_extraction_enabled": "postCallExtractionEnabled",
      "features.postCallEvaluationEnabled": "postCallEvaluationEnabled",
      "features.post_call_evaluation_enabled": "postCallEvaluationEnabled",
      "features.postCallSummaryPrompt": "postCallSummaryPrompt",
      "features.post_call_summary_prompt": "postCallSummaryPrompt",
      "features.postCallEvaluationRubric": "postCallEvaluationRubric",
      "features.post_call_evaluation_rubric": "postCallEvaluationRubric",
      "features.postCallExtractionFields": "postCallExtractionFields",
      "features.post_call_extraction_fields": "postCallExtractionFields",
      // stt section aliases (LLM uses stt.* section)
      "stt.confidence_threshold": "stt_confidence_threshold",
      "stt.stt_confidence_threshold": "stt_confidence_threshold",
      "stt.numeral_formatting": "stt_numeral_formatting",
      "stt.stt_numeral_formatting": "stt_numeral_formatting",
      "stt.profanity_filter": "stt_profanity_filter",
      "stt.stt_profanity_filter": "stt_profanity_filter",
      "stt.keywords": "stt_keywords",
      "stt.stt_keywords": "stt_keywords",
      "stt.background_denoising": "stt_background_denoising",
      "stt.stt_background_denoising": "stt_background_denoising",
      "stt.eot_confidence": "stt_eot_confidence",
      "stt.stt_eot_confidence": "stt_eot_confidence",
      "stt.eot_timeout_ms": "stt_eot_timeout_ms",
      "stt.stt_eot_timeout_ms": "stt_eot_timeout_ms",
      "stt.min_turn_silence_ms": "stt_min_turn_silence_ms",
      "stt.stt_min_turn_silence_ms": "stt_min_turn_silence_ms",
      "stt.max_turn_silence_ms": "stt_max_turn_silence_ms",
      "stt.stt_max_turn_silence_ms": "stt_max_turn_silence_ms",
      "stt.strict_language": "stt_strict_language",
      "stt.stt_strict_language": "stt_strict_language",
      "stt.endpoint_delay_ms": "stt_endpoint_delay_ms",
      "stt.stt_endpoint_delay_ms": "stt_endpoint_delay_ms",
      "stt.custom_vocabulary": "stt_custom_vocabulary",
      "stt.stt_custom_vocabulary": "stt_custom_vocabulary",
      "stt.context": "stt_context",
      "stt.stt_context": "stt_context",
      "advanced.eot_confidence": "stt_eot_confidence",
      "advanced.stt_eot_confidence": "stt_eot_confidence",
      "advanced.eot_timeout_ms": "stt_eot_timeout_ms",
      "advanced.stt_eot_timeout_ms": "stt_eot_timeout_ms",
      "advanced.min_turn_silence_ms": "stt_min_turn_silence_ms",
      "advanced.stt_min_turn_silence_ms": "stt_min_turn_silence_ms",
      "advanced.max_turn_silence_ms": "stt_max_turn_silence_ms",
      "advanced.stt_max_turn_silence_ms": "stt_max_turn_silence_ms",
      "advanced.strict_language": "stt_strict_language",
      "advanced.stt_strict_language": "stt_strict_language",
      "advanced.endpoint_delay_ms": "stt_endpoint_delay_ms",
      "advanced.stt_endpoint_delay_ms": "stt_endpoint_delay_ms",
      "advanced.custom_vocabulary": "stt_custom_vocabulary",
      "advanced.stt_custom_vocabulary": "stt_custom_vocabulary",
      "advanced.context": "stt_context",
      "advanced.stt_context": "stt_context"
    };
  }
});

// ../shared-types/dist/pricing.js
function stackCostPerMin(c) {
  const rawParts = c.realtimePerMin != null ? [c.realtimePerMin] : [c.sttPerMin, c.llmPerMin, c.ttsPerMin];
  if (rawParts.some((p) => p == null || !Number.isFinite(p)))
    return null;
  const parts = rawParts;
  return Number(parts.reduce((s, p) => s + p, 0).toFixed(8));
}
function buildPlans(webUrl = DEFAULT_WEB_URL) {
  return [
    {
      id: "free",
      displayName: "Free",
      tagline: "For testing",
      monthlyFeeUsd: 0,
      annualFeeUsd: null,
      monthlyCreditUsd: 1,
      workspaceSeats: 1,
      byokAllowed: true,
      byocAllowed: false,
      cardRequired: false,
      support: "Community",
      logRetentionDays: null,
      primaryCta: { label: "Start free", href: `${webUrl}/signup` },
      accent: "neutral",
      studioAiUnitsMonthly: 150,
      studioAiOverageEnabled: false,
      studioAiOverageCentsPerUnit: 0,
      postCallIntelligenceIncluded: true
    },
    {
      id: "enterprise",
      displayName: "Enterprise",
      tagline: "Sales-led, custom deal",
      monthlyFeeUsd: null,
      annualFeeUsd: null,
      monthlyCreditUsd: null,
      workspaceSeats: null,
      byokAllowed: true,
      byocAllowed: true,
      cardRequired: false,
      support: "SLA, dedicated",
      logRetentionDays: 90,
      primaryCta: { label: "Talk to sales", href: "mailto:sales@rymi.live?subject=Rymi%20Enterprise" },
      accent: "enterprise",
      studioAiUnitsMonthly: null,
      studioAiOverageEnabled: true,
      studioAiOverageCentsPerUnit: 1,
      postCallIntelligenceIncluded: true
    }
  ];
}
var CREDIT_CENTS_PER_USD, DEFAULT_CONFIDENCE_THRESHOLD, DEFAULT_COST_QUALITY_MODE, CUSTOM_PLATFORM_FEE_PER_MIN, DEFAULT_WEB_URL, PLANS, ENTERPRISE_UNLOCKS, REALTIME_MODEL_COST_PER_MIN, STANDARD_MODEL_COST_PER_MIN;
var init_pricing = __esm({
  "../shared-types/dist/pricing.js"() {
    "use strict";
    CREDIT_CENTS_PER_USD = 100;
    DEFAULT_CONFIDENCE_THRESHOLD = 0.85;
    DEFAULT_COST_QUALITY_MODE = "balanced";
    CUSTOM_PLATFORM_FEE_PER_MIN = 0.02;
    DEFAULT_WEB_URL = "https://studio.rymi.live";
    PLANS = buildPlans();
    ENTERPRISE_UNLOCKS = [
      {
        commitment: 500,
        title: "HIPAA BAAs",
        description: "HIPAA Business Associate Agreements for compliant health data handling.",
        icon: "shield"
      },
      {
        commitment: 1e3,
        title: "SSO, RBAC & Audit Logs",
        description: "Control access with role-based permissions, single sign-on, and 90-day audit log retention.",
        icon: "logs"
      },
      {
        commitment: 2500,
        title: "SLA & Dedicated Voice Infrastructure",
        description: "99.9% uptime SLA, prioritized support with response-time SLOs, and dedicated voice infrastructure isolated from shared traffic.",
        icon: "support"
      },
      {
        commitment: 5e3,
        title: "BYOC, Custom Regions, Dedicated VMs",
        description: "Bring your own cloud, deploy in custom regions, and run on dedicated VMs with reserved capacity for your workloads.",
        icon: "server"
      }
    ];
    REALTIME_MODEL_COST_PER_MIN = {
      "gemini-3.1-flash-live-preview": 0.035,
      "gemini-2.5-flash-native-audio-latest": 0.045,
      "gemini-2.5-flash-native-audio-preview-12-2025": 0.045,
      "gpt-realtime-mini": 0.03,
      "nova-sonic-1": 0.025,
      "nova-sonic-2": 0.025,
      "gpt-realtime-2": 0.096,
      "gpt-realtime-1.5": 0.096,
      "gpt-realtime-2.1": 0.096,
      "gpt-realtime-2.1-mini": 0.03,
      "gemini-3.8-live": 0.035,
      "gpt-live-1": 0.06,
      // 0.05 voice layer + ~0.01 gpt-5.4-mini delegation backend
      "grok-voice-think-fast-2.0": 0.08,
      "grok-voice-3.0": 0.08,
      "ultravox-v0.7": 0.05
    };
    STANDARD_MODEL_COST_PER_MIN = {
      // STT
      "universal-3": 25e-4,
      "speech-to-text": 0.0167,
      "ink-whisper": 162e-5,
      "flux-general-en": 77e-4,
      "flux-general-multi": 78e-4,
      "nova-2-automotive": 58e-4,
      "nova-2-conversationalai": 58e-4,
      "nova-2-drivethru": 58e-4,
      "nova-2-finance": 58e-4,
      "nova-2-general": 58e-4,
      "nova-2-medical": 58e-4,
      "nova-2-meeting": 58e-4,
      "nova-2-phonecall": 58e-4,
      "nova-2-video": 58e-4,
      "nova-2-voicemail": 58e-4,
      "nova-3-general": 77e-4,
      "nova-3-medical": 77e-4,
      "nova-3-multilingual": 92e-4,
      "chirp": 0.016,
      "gpt-4o-mini-transcribe": 3e-3,
      "gpt-4o-transcribe": 6e-3,
      "solaria": 0.0126,
      "stt-rt-preview": 36e-4,
      "speechmatics-enhanced": 0.017,
      "saaras:v2.5": 526316e-8,
      "saaras:v3": 526316e-8,
      "saaras:v4": 526316e-8,
      "scribe_v2_realtime": 65e-4,
      // LLM
      "claude-3-5-haiku": 96e-4,
      "claude-3-5-sonnet": 0.0347,
      "claude-3-5-sonnet-v2": 0.0347,
      "claude-3-7-sonnet": 0.0347,
      "claude-3-haiku-20240307": 29e-4,
      "claude-3-opus": 0.1734,
      "claude-haiku-4-5": 48e-4,
      "claude-haiku-4-5-20251001": 48e-4,
      "claude-opus-4-1-20250805": 0.1734,
      "claude-opus-4-5-20251101": 0.024,
      "claude-opus-4-6": 0.024,
      "claude-opus-4-7": 0.024,
      "claude-opus-4-8": 0.024,
      "claude-sonnet-4-5-20250929": 0.0144,
      "claude-sonnet-4-6": 0.0144,
      "claude-sonnet-5-5": 96e-4,
      "claude-opus-5-5": 0.0192,
      "gpt-4.1": 8e-3,
      "gpt-4.1-mini": 16e-4,
      "gpt-4.1-nano": 4e-4,
      "gpt-4o": 0.01,
      "gpt-4o-mini": 6e-4,
      "gpt-5.4": 0.014,
      "gpt-5.4-mini": 42e-4,
      "gpt-5.4-nano": 12e-4,
      "gpt-5.5": 0.028,
      "gpt-6-luna": 5e-4,
      "gemini-2.5-flash": 224e-5,
      "gemini-2.5-flash-lite": 4e-4,
      "gemini-2.5-flash-lite-preview-09-2025": 4e-4,
      "gemini-2.5-pro": 9e-3,
      "gemini-3-flash-preview": 28e-4,
      "gemini-3.1-flash-lite": 14e-4,
      "gemini-3.1-flash-lite-preview": 14e-4,
      "gemini-3.1-pro-preview": 0.0112,
      "gemini-3.5-flash": 84e-4,
      "gemini-3.5-flash-lite": 22e-4,
      "gemini-3.8-flash": 72e-4,
      "gemini-3.1-pro-preview-customtools": 0.0112,
      "openai/gpt-oss-20b": 3e-4,
      "openai/gpt-oss-120b": 6e-4,
      "openai/gpt-oss-safeguard-20b": 3e-4,
      "llama-3.1-8b-instant": 1e-4,
      "llama-3.3-70b-versatile": 11e-4,
      "meta-llama/llama-4-scout-17b-16e-instruct": 36e-5,
      "qwen/qwen3-32b": 7e-4,
      "llama3.1-8b": 4e-4,
      "gpt-oss-120b": 88e-5,
      "qwen-3-235b-a22b-instruct-2507": 76e-5,
      "zai-glm-4.7": 4e-3,
      "llama-4-scout": 56e-5,
      "deepseek-v4-flash": 34e-5,
      "deepseek-v4-pro": 418e-5,
      "grok-4-1-fast": 56e-5,
      "grok-3-mini": 64e-5,
      "grok-3-mini-fast": 48e-5,
      "grok-3-fast": 192e-5,
      "grok-3": 0.0144,
      "grok-2": 0.016,
      "grok-2-1212": 0.0128,
      "grok-2-vision": 96e-4,
      "ministral-3-3b": 16e-5,
      "ministral-3-8b": 32e-5,
      "mistral-small-4": 64e-5,
      "mistral-medium-3.1": 256e-5,
      "mistral-large-3": 64e-4,
      "codestral": 64e-5,
      "MiniMax-Text-01": 16e-5,
      "minimax-m1": 2e-3,
      "sonar": 0.032,
      "sonar-pro": 0.05,
      "glm-4-flash": 4e-5,
      "glm-4-air": 49e-5,
      "glm-4-plus": 49e-4,
      "qwen-turbo": 7e-4,
      "qwen-plus": 18e-4,
      "qwen-max": 8e-3,
      "moonshot-v1-8k": 42e-4,
      "Qwen/Qwen2.5-7B-Instruct": 25e-5,
      "Qwen/Qwen2.5-72B-Instruct": 22e-4,
      "deepseek-ai/DeepSeek-V3": 14e-4,
      "sarvam-30b": 10526e-8,
      "sarvam-105b": 77053e-8,
      "sarvam-105b-conversations": 77053e-8,
      // TTS
      "aura-2": 0.027,
      "gemini-2.5-flash-preview-tts": 0.015,
      "gemini-3.1-flash-tts-preview": 0.015,
      "gpt-4o-mini-tts": 0.015,
      "neural-tts": 0.016,
      "octave": 0.01,
      "octave2": 5e-3,
      "arcana": 0.0108,
      "mistv2": 0.0108,
      "lightning": 5e-3,
      "blizzard": 0.02,
      "inworld-tts-1": 5e-3,
      "speech-1.6": 0.015,
      "s2.1-pro": 0.020833,
      "polly-neural": 0.012,
      "sonic-3.5": 0.037594,
      "sonic-3.6": 0.037594,
      "sonic-turbo": 0.0216,
      "tts-1": 0.0225,
      "gemini-2.5-pro-preview-tts": 0.03,
      "eleven_flash_v2": 0.04,
      "eleven_flash_v2_5": 0.04,
      "eleven_turbo_v2": 0.04,
      "eleven_turbo_v2_5": 0.04,
      "eleven_multilingual_v2": 0.08,
      "eleven_v3": 0.08,
      "eleven_v4_turbo": 0.04,
      // list $0.04/1K chars ≈ 1K chars/min of speech
      "tts-1-hd": 0.045,
      "Play3.0-mini": 0.06,
      "PlayDialog": 0.06,
      "PlayDialogTurbo": 0.06,
      "speech-02-turbo": 0.024,
      "speech-02-hd": 0.04,
      "bulbul:v3": 0.02842105
    };
  }
});

// ../shared-types/dist/billing.js
var init_billing = __esm({
  "../shared-types/dist/billing.js"() {
    "use strict";
  }
});

// ../shared-types/dist/knowledge.js
var KNOWLEDGE_INGEST_QUEUE_NAME, KNOWLEDGE_INLINE_TEXT_MAX_BYTES;
var init_knowledge = __esm({
  "../shared-types/dist/knowledge.js"() {
    "use strict";
    KNOWLEDGE_INGEST_QUEUE_NAME = "rymi_knowledge_ingest";
    KNOWLEDGE_INLINE_TEXT_MAX_BYTES = 64 * 1024;
  }
});

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

// ../shared-types/dist/traceId.js
function newTraceId() {
  let body = "";
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.getRandomValues) {
    const bytes = new Uint8Array(TRACE_ID_BODY_LENGTH);
    cryptoApi.getRandomValues(bytes);
    for (let i = 0; i < TRACE_ID_BODY_LENGTH; i++) {
      body += ALPHABET[bytes[i] % ALPHABET.length];
    }
  } else {
    for (let i = 0; i < TRACE_ID_BODY_LENGTH; i++) {
      body += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
  }
  return TRACE_ID_PREFIX + body;
}
function isValidTraceId(value) {
  return typeof value === "string" && TRACE_ID_RE.test(value);
}
function coerceTraceId(value) {
  return isValidTraceId(value) ? value : newTraceId();
}
var ALPHABET, TRACE_ID_PREFIX, TRACE_ID_BODY_LENGTH, TRACE_ID_RE, TRACE_ID_HEADER;
var init_traceId = __esm({
  "../shared-types/dist/traceId.js"() {
    "use strict";
    ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    TRACE_ID_PREFIX = "trc_";
    TRACE_ID_BODY_LENGTH = 24;
    TRACE_ID_RE = new RegExp(`^${TRACE_ID_PREFIX}[A-Za-z0-9]{${TRACE_ID_BODY_LENGTH}}$`);
    TRACE_ID_HEADER = "x-rymi-trace-id";
  }
});

// ../shared-types/dist/phone.js
function normalizeE164(raw) {
  if (typeof raw !== "string")
    return null;
  const trimmed = raw.trim();
  if (!trimmed)
    return null;
  const cleaned = trimmed.replace(ALLOWED_SEPARATOR_RE, "");
  if (!cleaned.startsWith("+"))
    return null;
  const digits = cleaned.slice(1);
  if (!E164_BODY_RE.test(digits))
    return null;
  return `+${digits}`;
}
function assertE164(raw, fieldName = "phone") {
  const result2 = normalizeE164(raw);
  if (!result2) {
    throw new Error(`${fieldName} must be a valid E.164 phone number (e.g. +15551234567)`);
  }
  return result2;
}
function isE164(raw) {
  return normalizeE164(raw) !== null;
}
function equalsE164(a, b) {
  const na = normalizeE164(a);
  const nb = normalizeE164(b);
  return na !== null && na === nb;
}
var E164_BODY_RE, ALLOWED_SEPARATOR_RE;
var init_phone = __esm({
  "../shared-types/dist/phone.js"() {
    "use strict";
    E164_BODY_RE = /^[1-9]\d{6,14}$/;
    ALLOWED_SEPARATOR_RE = /[\s\-().]/g;
  }
});

// ../shared-types/dist/pollUntil.js
function pollUntil(opts) {
  let stopped = false;
  let timer;
  const tick = async () => {
    if (stopped)
      return;
    if (Date.now() > opts.deadline) {
      stopped = true;
      opts.onExpired();
      return;
    }
    let done = false;
    try {
      done = await opts.check();
    } catch {
    }
    if (stopped)
      return;
    if (done) {
      stopped = true;
      opts.onDone();
      return;
    }
    timer = setTimeout(tick, opts.intervalMs);
  };
  timer = setTimeout(tick, opts.intervalMs);
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}
var init_pollUntil = __esm({
  "../shared-types/dist/pollUntil.js"() {
    "use strict";
  }
});

// ../shared-types/dist/runtimeReasonLabels.js
function fallbackLabel(code) {
  return code.replace(/_/g, " ").replace(/\s+/g, " ").trim().replace(/(^|\s)\w/g, (m) => m.toUpperCase());
}
function formatSessionEndReason(code) {
  if (!code)
    return "\u2014";
  if (code in SESSION_END_REASON_LABELS) {
    return SESSION_END_REASON_LABELS[code];
  }
  return fallbackLabel(code);
}
function isKnownSessionEndReason(code) {
  return !!code && code in SESSION_END_REASON_LABELS;
}
var SESSION_END_REASON_LABELS;
var init_runtimeReasonLabels = __esm({
  "../shared-types/dist/runtimeReasonLabels.js"() {
    "use strict";
    SESSION_END_REASON_LABELS = {
      end_call_tool: "Ended by agent",
      handoff_to_human: "Handed off to a person",
      handoff_to_agent: "Handed off to another agent",
      user_disconnect: "Caller hung up",
      provider_disconnect: "Carrier disconnect",
      error: "Ended on error",
      timeout: "Session timed out",
      closed: "Ended"
    };
  }
});

// ../shared-types/dist/apiKeyScopes.js
function isApiKeyScope(value) {
  return typeof value === "string" && ALL_API_KEY_SCOPES.has(value);
}
var ALL_API_KEY_SCOPES, PUBLISHABLE_KEY_ALLOWED_SCOPES, SECRET_KEY_ONLY_SCOPES, SERVER_FLAG_REQUIRED_SCOPES;
var init_apiKeyScopes = __esm({
  "../shared-types/dist/apiKeyScopes.js"() {
    "use strict";
    ALL_API_KEY_SCOPES = /* @__PURE__ */ new Set([
      "agents:read",
      "agents:write",
      "agents:publish",
      "calls:read",
      "calls:start",
      "webhooks:read",
      "webhooks:write",
      "knowledge:read",
      "knowledge:write",
      "tools:read",
      "tools:write",
      "billing:read",
      "admin"
    ]);
    PUBLISHABLE_KEY_ALLOWED_SCOPES = /* @__PURE__ */ new Set([
      "agents:read",
      "calls:start"
    ]);
    SECRET_KEY_ONLY_SCOPES = /* @__PURE__ */ new Set([
      "agents:write",
      "agents:publish",
      "calls:read",
      "webhooks:read",
      "webhooks:write",
      "knowledge:read",
      "knowledge:write",
      "tools:read",
      "tools:write",
      "billing:read",
      "admin"
    ]);
    SERVER_FLAG_REQUIRED_SCOPES = /* @__PURE__ */ new Set([
      "agents:publish",
      "admin"
    ]);
  }
});

// ../shared-types/dist/privacyPolicy.js
function isSuppressedByPolicy(cap) {
  return !cap.enabled && (cap.suppressReason === "policy_disabled" || cap.suppressReason === "not_retained" || cap.suppressReason === "consent_missing" || cap.suppressReason === "plan_gate");
}
var DEFAULT_CALL_PRIVACY_POLICY;
var init_privacyPolicy = __esm({
  "../shared-types/dist/privacyPolicy.js"() {
    "use strict";
    DEFAULT_CALL_PRIVACY_POLICY = {
      recording: { enabled: false },
      transcriptPersistence: { enabled: true },
      callEvents: { enabled: true },
      logsRetained: { enabled: true },
      postCallAnalysis: { enabled: true },
      webhooks: { enabled: true },
      notifications: { enabled: true },
      providerLogsRetained: { enabled: true },
      retentionPeriod: null
    };
  }
});

// ../shared-types/dist/telephonyEvents.js
var MINIMAL_TELEPHONY_CAPABILITIES;
var init_telephonyEvents = __esm({
  "../shared-types/dist/telephonyEvents.js"() {
    "use strict";
    MINIMAL_TELEPHONY_CAPABILITIES = {
      supportsDTMF: false,
      supportsMachineDetection: false,
      supportsVoicemailDetection: false,
      supportsRecordingLifecycle: false,
      supportsTransfer: false,
      supportedEventTypes: /* @__PURE__ */ new Set(["media.connected", "media.disconnected"])
    };
  }
});

// ../shared-types/dist/queueContracts.js
var KNOWLEDGE_INGEST_JOB_VERSION, POST_CALL_JOB_VERSION, NOTIFICATION_JOB_VERSION, WEBHOOK_JOB_VERSION, CALL_FINALIZATION_JOB_VERSION, QUEUE_RETRY_DEFAULTS;
var init_queueContracts = __esm({
  "../shared-types/dist/queueContracts.js"() {
    "use strict";
    KNOWLEDGE_INGEST_JOB_VERSION = "2026-05-20";
    POST_CALL_JOB_VERSION = "2026-05-20";
    NOTIFICATION_JOB_VERSION = "2026-05-20";
    WEBHOOK_JOB_VERSION = "2026-05-20";
    CALL_FINALIZATION_JOB_VERSION = "2026-05-20";
    QUEUE_RETRY_DEFAULTS = {
      knowledge_ingest: { maxAttempts: 3, backoffMs: [2e3, 1e4, 3e4] },
      post_call: { maxAttempts: 3, backoffMs: [5e3, 3e4, 12e4] },
      notifications: { maxAttempts: 5, backoffMs: [1e3, 5e3, 15e3, 6e4, 3e5] },
      webhooks: { maxAttempts: 7, backoffMs: [1e3, 5e3, 15e3, 6e4, 3e5, 9e5, 36e5] },
      call_finalization: { maxAttempts: 3, backoffMs: [2e3, 1e4, 3e4] }
    };
  }
});

// ../shared-types/dist/observability.js
function deriveUsageIdempotencyKey(event) {
  return [event.traceId, event.category, event.callId ?? "", event.provider ?? "", event.model ?? ""].join(":");
}
var USAGE_IDEMPOTENCY_KEY_FIELDS;
var init_observability = __esm({
  "../shared-types/dist/observability.js"() {
    "use strict";
    USAGE_IDEMPOTENCY_KEY_FIELDS = ["traceId", "category", "callId", "provider", "model"];
  }
});

// ../shared-types/dist/sdkParity.js
var SDK_MCP_CAPABILITY_DISCOVERY, REST_OPERATION_COVERAGE;
var init_sdkParity = __esm({
  "../shared-types/dist/sdkParity.js"() {
    "use strict";
    SDK_MCP_CAPABILITY_DISCOVERY = {
      agentFields: true,
      providerCatalog: true,
      toolCapabilities: true,
      knowledgeStatus: true,
      publishValidation: true
    };
    REST_OPERATION_COVERAGE = [
      { operation: "agents.list", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:read"] },
      { operation: "agents.get", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:read"] },
      { operation: "agents.create", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:write"] },
      { operation: "agents.update", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:write"] },
      { operation: "agents.delete", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:write"] },
      {
        operation: "agents.publish",
        nodeSdk: "full",
        mcp: "full",
        requiredScopes: ["agents:publish"],
        requiresServerFlag: true
      },
      { operation: "agents.validate", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:read"] },
      { operation: "calls.list", nodeSdk: "full", mcp: "full", requiredScopes: ["calls:read"] },
      { operation: "calls.get", nodeSdk: "full", mcp: "full", requiredScopes: ["calls:read"] },
      { operation: "calls.start", nodeSdk: "full", mcp: "partial", requiredScopes: ["calls:start"], unsupportedReason: "MCP partial: audio routing not fully exposed via tool interface" },
      { operation: "knowledge.list", nodeSdk: "full", mcp: "full", requiredScopes: ["knowledge:read"] },
      { operation: "knowledge.get", nodeSdk: "full", mcp: "full", requiredScopes: ["knowledge:read"] },
      { operation: "knowledge.create", nodeSdk: "full", mcp: "full", requiredScopes: ["knowledge:write"] },
      { operation: "knowledge.delete", nodeSdk: "full", mcp: "full", requiredScopes: ["knowledge:write"] },
      { operation: "tools.list", nodeSdk: "full", mcp: "full", requiredScopes: ["tools:read"] },
      { operation: "tools.capabilities", nodeSdk: "full", mcp: "full", requiredScopes: ["tools:read"] },
      { operation: "webhooks.list", nodeSdk: "full", mcp: "full", requiredScopes: ["webhooks:read"] },
      { operation: "webhooks.create", nodeSdk: "full", mcp: "full", requiredScopes: ["webhooks:write"] },
      { operation: "webhooks.update", nodeSdk: "full", mcp: "full", requiredScopes: ["webhooks:write"] },
      { operation: "webhooks.delete", nodeSdk: "full", mcp: "full", requiredScopes: ["webhooks:write"] },
      { operation: "billing.balance", nodeSdk: "full", mcp: "unsupported", requiredScopes: ["billing:read"], unsupportedReason: "Billing data not exposed via MCP in MVP" },
      { operation: "billing.invoices", nodeSdk: "full", mcp: "unsupported", requiredScopes: ["billing:read"], unsupportedReason: "Billing data not exposed via MCP in MVP" },
      { operation: "providers.catalog", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:read"] },
      { operation: "publish-validation.run", nodeSdk: "full", mcp: "full", requiredScopes: ["agents:read"] }
    ];
  }
});

// ../shared-types/dist/studioSections.js
function withDefault(value, defaultValue) {
  return value === null || value === void 0 ? defaultValue : value;
}
function deepEqualConfigValue(a, b) {
  if (Object.is(a, b))
    return true;
  if (typeof a !== typeof b)
    return false;
  if (a === null || b === null)
    return false;
  if (typeof a !== "object")
    return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b))
      return false;
    if (a.length !== b.length)
      return false;
    return a.every((item, index) => deepEqualConfigValue(item, b[index]));
  }
  const aRecord = a;
  const bRecord = b;
  const keys = /* @__PURE__ */ new Set([...Object.keys(aRecord), ...Object.keys(bRecord)]);
  for (const key of keys) {
    if (!deepEqualConfigValue(aRecord[key], bRecord[key]))
      return false;
  }
  return true;
}
function readFocusedSectionField(payload, key) {
  const keyString = String(key);
  const field = FIELD_BY_KEY.get(keyString);
  if (!field)
    return payload[keyString];
  switch (keyString) {
    case "voice":
      return withDefault(payload.voice ?? readFromPayload(payload, field), field.default);
    case "tone":
      return withDefault(payload.persona?.toneOverride ?? readFromPayload(payload, field), field.default);
    case "postCallExtractionEnabled":
      return Boolean(payload.post_call?.structured_extraction?.prompt);
    case "postCallExtractionFields":
    case "postCallSchema": {
      const schema = payload.post_call?.structured_extraction?.json_schema;
      const properties = schema?.properties && typeof schema.properties === "object" ? schema.properties : {};
      return Object.keys(properties);
    }
    case "postCallEvaluationEnabled":
      return Boolean(payload.post_call?.evaluation?.rubric);
    case "requiredSlots": {
      const slots = payload.playbook?.requiredSlots;
      return Array.isArray(slots) ? slots.map((slot) => slot?.name ?? slot) : field.default;
    }
    default:
      return withDefault(readFromPayload(payload, field), field.default);
  }
}
function changedFocusedStudioSections(previousPayload, nextPayload) {
  return FOCUSED_STUDIO_SECTION_IDS.filter((section) => FOCUSED_STUDIO_SECTION_FIELDS[section].some((key) => !deepEqualConfigValue(readFocusedSectionField(previousPayload, key), readFocusedSectionField(nextPayload, key))));
}
function hasMeaningfulValue(value) {
  if (value === null || value === void 0)
    return false;
  if (typeof value === "string")
    return value.trim().length > 0;
  if (typeof value === "boolean")
    return value;
  if (Array.isArray(value))
    return value.length > 0;
  if (typeof value === "object")
    return Object.keys(value).length > 0;
  return true;
}
function populatedFocusedStudioSections(payload) {
  return FOCUSED_STUDIO_SECTION_IDS.filter((section) => FOCUSED_STUDIO_SECTION_FIELDS[section].some((key) => hasMeaningfulValue(readFocusedSectionField(payload, key))));
}
var FOCUSED_STUDIO_SECTION_IDS, FOCUSED_STUDIO_SECTION_FIELDS, FIELD_BY_KEY;
var init_studioSections = __esm({
  "../shared-types/dist/studioSections.js"() {
    "use strict";
    init_agentConfigSchema();
    FOCUSED_STUDIO_SECTION_IDS = [
      "business",
      "callerContext",
      "identity",
      "playbook",
      "routing",
      "operations",
      "postCall",
      "tools"
    ];
    FOCUSED_STUDIO_SECTION_FIELDS = {
      business: ["name", "role", "companyName", "companyWebsite", "companyDescription"],
      callerContext: ["audienceDescription", "callerPersonas", "variables"],
      identity: ["language", "tone", "voice", "accent"],
      playbook: [
        "opener",
        "qualificationFlow",
        "requiredSlots",
        "primaryCTA",
        "fallbackCTA",
        "endCallMessage",
        "startSpeakingPhrasing",
        "scripts",
        "objections"
      ],
      routing: [
        "escalationRule",
        "transferNumber",
        "voicemailBehavior",
        "voicemailScript",
        "smsContinuationEnabled",
        "smsContinuationReconnectUrl"
      ],
      operations: ["restrictedTopics", "forbiddenPromises", "offLimits", "prohibitedClaims"],
      postCall: [
        "postCallSummaryEnabled",
        "postCallSummaryPrompt",
        "postCallExtractionEnabled",
        "extractionTags",
        "postCallExtractionFields",
        "postCallEvaluationEnabled",
        "postCallEvaluationRubric",
        "postCallLlmProvider",
        "postCallLlmModel",
        "disableCallerMemory"
      ],
      tools: ["tools"]
    };
    FIELD_BY_KEY = new Map(AGENT_CONFIG_SCHEMA.map((field) => [field.key, field]));
  }
});

// ../shared-types/dist/relativeTime.js
function formatHumanRelativeTime(value, now = /* @__PURE__ */ new Date()) {
  const then = value instanceof Date ? value : new Date(value);
  const timestamp = then.getTime();
  if (!Number.isFinite(timestamp))
    return "";
  const elapsedSeconds = Math.max(0, Math.floor((now.getTime() - timestamp) / 1e3));
  if (elapsedSeconds < 5)
    return "just now";
  if (elapsedSeconds < 60)
    return `${elapsedSeconds} sec ago`;
  const minutes = Math.floor(elapsedSeconds / 60);
  if (minutes < 60)
    return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)
    return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
var init_relativeTime = __esm({
  "../shared-types/dist/relativeTime.js"() {
    "use strict";
  }
});

// ../shared-types/dist/chat.js
var init_chat = __esm({
  "../shared-types/dist/chat.js"() {
    "use strict";
  }
});

// ../shared-types/dist/campaigns.js
function isVoicemailEndReason(endReason) {
  return !!endReason && VOICEMAIL_END_REASONS.includes(endReason);
}
var VOICEMAIL_END_REASONS;
var init_campaigns = __esm({
  "../shared-types/dist/campaigns.js"() {
    "use strict";
    VOICEMAIL_END_REASONS = ["voicemail_detected", "voicemail_message_left"];
  }
});

// ../shared-types/dist/agentTemplate.js
function containsForbiddenWord(text) {
  const lower = text.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word))
      return true;
  }
  return false;
}
function validateAgentTemplate(template) {
  const issues = [];
  const { id, label, description, icon, color, defaults } = template;
  if (!id?.trim())
    issues.push({ path: "id", message: "id is required" });
  if (!label?.trim())
    issues.push({ path: "label", message: "label is required" });
  if (!description?.trim())
    issues.push({ path: "description", message: "description is required" });
  if (!icon?.trim())
    issues.push({ path: "icon", message: "icon is required" });
  if (!color?.trim())
    issues.push({ path: "color", message: "color is required" });
  if (!defaults.role?.trim())
    issues.push({ path: "defaults.role", message: "role is required" });
  if (!defaults.audienceDescription?.trim())
    issues.push({ path: "defaults.audienceDescription", message: "audienceDescription is required" });
  if (!defaults.tone?.trim())
    issues.push({ path: "defaults.tone", message: "tone is required" });
  if (!defaults.opener?.trim())
    issues.push({ path: "defaults.opener", message: "opener is required" });
  if (!defaults.primaryCTA?.trim())
    issues.push({ path: "defaults.primaryCTA", message: "primaryCTA is required" });
  if (!defaults.fallbackCTA?.trim())
    issues.push({ path: "defaults.fallbackCTA", message: "fallbackCTA is required" });
  if (label && containsForbiddenWord(label)) {
    issues.push({ path: "label", message: "label contains forbidden marketing word" });
  }
  if (description && containsForbiddenWord(description)) {
    issues.push({ path: "description", message: "description contains forbidden marketing word" });
  }
  if (defaults.primaryCTA && containsForbiddenWord(defaults.primaryCTA)) {
    issues.push({ path: "defaults.primaryCTA", message: "primaryCTA contains forbidden marketing word" });
  }
  if (defaults.fallbackCTA && containsForbiddenWord(defaults.fallbackCTA)) {
    issues.push({ path: "defaults.fallbackCTA", message: "fallbackCTA contains forbidden marketing word" });
  }
  for (const [i, step] of (defaults.qualificationFlow ?? []).entries()) {
    if (!step.question?.trim()) {
      issues.push({ path: `defaults.qualificationFlow[${i}].question`, message: "question is required" });
    }
    if (!step.listens_for?.trim()) {
      issues.push({ path: `defaults.qualificationFlow[${i}].listens_for`, message: "listens_for is required" });
    }
  }
  for (const [i, v] of (defaults.variables ?? []).entries()) {
    if (!v.key?.trim()) {
      issues.push({ path: `defaults.variables[${i}].key`, message: "variable key is required" });
    }
    if (!v.description?.trim()) {
      issues.push({ path: `defaults.variables[${i}].description`, message: "variable description is required" });
    }
    if (v.required === void 0 || v.required === null) {
      issues.push({ path: `defaults.variables[${i}].required`, message: "variable required is required" });
    }
    if (!v.acquisition) {
      issues.push({ path: `defaults.variables[${i}].acquisition`, message: "variable acquisition is required" });
    }
    if (v.metadataKey === "phone" && v.key) {
      const k = v.key.toLowerCase();
      if (!/phone|callback|contact/.test(k)) {
        issues.push({ path: `defaults.variables[${i}].metadataKey`, message: "phone metadataKey must be on phone-like variable keys" });
      }
    }
  }
  if (defaults.variables && defaults.variables.length > 0) {
    const requiredKeys = defaults.variables.filter((v) => v.required).map((v) => v.key);
    if (JSON.stringify(defaults.requiredSlots) !== JSON.stringify(requiredKeys)) {
      issues.push({ path: "defaults.requiredSlots", message: "requiredSlots must equal required variable keys" });
    }
    const extractionSet = new Set(defaults.postCallExtractionFields ?? []);
    for (const v of defaults.variables) {
      if (v.required || v.acquisition === "extract") {
        if (!extractionSet.has(v.key)) {
          issues.push({ path: "defaults.postCallExtractionFields", message: `missing ${v.key} in postCallExtractionFields` });
        }
      }
    }
  }
  for (const [i, q] of (defaults.setupQuestions ?? []).entries()) {
    for (const w of q.writes) {
      if (w.kind === "replace" && w.key === "requiredSlots") {
        issues.push({ path: `defaults.setupQuestions[${i}]`, message: "setup question must not replace requiredSlots" });
      }
    }
    for (const [j, opt] of (q.options ?? []).entries()) {
      if (opt.label && containsForbiddenWord(opt.label)) {
        issues.push({ path: `defaults.setupQuestions[${i}].options[${j}].label`, message: "option label contains forbidden word" });
      }
    }
    if (q.question && containsForbiddenWord(q.question)) {
      issues.push({ path: `defaults.setupQuestions[${i}].question`, message: "question contains forbidden word" });
    }
  }
  for (const [i, script] of (defaults.scripts ?? []).entries()) {
    if (script.content && containsForbiddenWord(script.content)) {
      issues.push({ path: `defaults.scripts[${i}].content`, message: "script content contains forbidden word" });
    }
  }
  for (const [i, obj] of (defaults.objections ?? []).entries()) {
    if (obj.response && containsForbiddenWord(obj.response)) {
      issues.push({ path: `defaults.objections[${i}].response`, message: "objection response contains forbidden word" });
    }
  }
  for (const [i, sc] of (defaults.successCriteria ?? []).entries()) {
    if (sc && containsForbiddenWord(sc)) {
      issues.push({ path: `defaults.successCriteria[${i}]`, message: "success criteria contains forbidden word" });
    }
  }
  return issues;
}
var FORBIDDEN_WORDS;
var init_agentTemplate = __esm({
  "../shared-types/dist/agentTemplate.js"() {
    "use strict";
    FORBIDDEN_WORDS = /* @__PURE__ */ new Set([
      "revolutionary",
      "cutting-edge",
      "seamless",
      "unleash",
      "empower",
      "journey",
      "orchestrate",
      "transform",
      "magical",
      "next-generation",
      "world-class",
      "state-of-the-art",
      "game-changing",
      "synergy",
      "leverage",
      "solution"
    ]);
  }
});

// ../shared-types/dist/setupQuestions.js
function applySetupAnswer(write, answer, config) {
  switch (write.kind) {
    case "set": {
      const value = Array.isArray(answer) ? answer.join(", ") : answer;
      return { ...config, [write.key]: value };
    }
    case "append": {
      const key = write.key;
      const current = config[key] ?? [];
      const incoming = Array.isArray(answer) ? answer : [answer];
      const merged = [...current, ...incoming.filter((v) => v && !current.includes(v))];
      return { ...config, [key]: merged };
    }
    case "replace": {
      const value = Array.isArray(answer) ? answer : [answer];
      return { ...config, [write.key]: value };
    }
    case "append-csv": {
      const value = Array.isArray(answer) ? answer.join(", ") : answer;
      const current = (config.stt_keywords ?? "").trim();
      return { ...config, stt_keywords: current ? `${current}, ${value}` : value };
    }
    case "opener-template": {
      const value = Array.isArray(answer) ? answer.join(", ") : answer;
      const token = write.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(`\\{\\{\\s*${token}\\s*\\}\\}|\\{${token}\\}`, "g");
      return { ...config, opener: (config.opener || "").replace(re, value) };
    }
    default: {
      const exhaustive = write;
      void exhaustive;
      return config;
    }
  }
}
function applyWritesToConfig(writes, answer, config) {
  const cfg = config;
  return writes.reduce((c, w) => applySetupAnswer(w, answer, c), cfg);
}
function getPendingSetupQuestions(all, answered) {
  return all.filter((q) => {
    if (answered[q.id] !== void 0)
      return false;
    if (!q.dependsOn)
      return true;
    const depAnswer = answered[q.dependsOn.id];
    if (depAnswer === void 0 || depAnswer === "skipped")
      return false;
    if (Array.isArray(depAnswer))
      return depAnswer.includes(q.dependsOn.equals);
    return depAnswer === q.dependsOn.equals;
  });
}
function deltaCoversQuestion(question, deltaKeys) {
  return question.writes.some((w) => {
    if (w.kind === "opener-template")
      return deltaKeys.includes("opener");
    return deltaKeys.includes(w.key);
  });
}
function getMissingConfigQuestions(blockers, templateQuestions) {
  const result2 = [];
  const coveredIds = /* @__PURE__ */ new Set();
  for (const blocker of blockers) {
    const fallback = BLOCKER_QUESTIONS[blocker.id];
    if (!fallback)
      continue;
    if (templateQuestions) {
      const fallbackKeys = new Set(fallback.writes.map((w) => "key" in w ? w.key : "opener"));
      const match = templateQuestions.find((tq) => !coveredIds.has(tq.id) && tq.writes.some((w) => {
        if (w.kind === "opener-template")
          return fallbackKeys.has("opener");
        return "key" in w && fallbackKeys.has(w.key);
      }));
      if (match) {
        result2.push(match);
        coveredIds.add(match.id);
        continue;
      }
    }
    if (!coveredIds.has(fallback.id)) {
      result2.push(fallback);
      coveredIds.add(fallback.id);
    }
  }
  return result2;
}
var FOLLOW_UP_QUESTIONS, BLOCKER_QUESTIONS;
var init_setupQuestions = __esm({
  "../shared-types/dist/setupQuestions.js"() {
    "use strict";
    FOLLOW_UP_QUESTIONS = {
      // After companyName is answered, ask for website
      "missing_company": [{
        id: "follow_website",
        header: "Website",
        question: "Do you have a website we can learn from?",
        helper: "If you share your URL, we'll pull in details about your business automatically \u2014 no typing needed",
        options: [],
        multiSelect: false,
        allowFreeText: true,
        placeholder: "e.g. https://acme.com",
        required: false,
        writes: [{ kind: "set", key: "companyWebsite" }]
      }],
      // After website is skipped (no URL given), ask for description
      "follow_website_skipped": [{
        id: "follow_description",
        header: "About",
        question: "Tell us a bit about your business",
        helper: `For example: "We're a B2B SaaS platform that helps small businesses automate invoicing. We serve 500+ customers across the US."`,
        options: [],
        multiSelect: false,
        allowFreeText: true,
        placeholder: 'e.g. "We sell custom furniture online. Most callers want delivery updates or to place new orders."',
        required: false,
        writes: [{ kind: "set", key: "companyDescription" }]
      }]
    };
    BLOCKER_QUESTIONS = {
      "blocker:Identity:Add your business name": {
        id: "missing_company",
        header: "Business",
        question: "What's your business or company name?",
        helper: 'Your agent will introduce itself as representing this company \u2014 for example: "Hi, thanks for calling Acme!"',
        options: [],
        multiSelect: false,
        allowFreeText: true,
        placeholder: "e.g. Acme Corp, Sunrise Dental, Freshplate",
        required: true,
        writes: [{ kind: "set", key: "companyName" }]
      },
      "blocker:Identity:Define the agent role": {
        id: "missing_role",
        header: "Role",
        question: "What does your agent do?",
        helper: 'For example: "A friendly sales rep that books product demos for our SaaS platform" or "A support agent that helps customers troubleshoot billing issues"',
        options: [
          { label: "Sells & books meetings", description: 'e.g. "Books product demos for inbound leads"' },
          { label: "Helps customers", description: 'e.g. "Troubleshoots issues and answers billing questions"' },
          { label: "Answers the phone", description: 'e.g. "Greets callers, takes messages, transfers urgent calls"' }
        ],
        multiSelect: false,
        allowFreeText: true,
        placeholder: 'e.g. "A sales rep that qualifies inbound leads and books demos for our team"',
        required: true,
        writes: [{ kind: "set", key: "role" }]
      },
      "blocker:Conversation Flow:Add an opener": {
        id: "missing_opener",
        header: "Greeting",
        question: "What should the agent say when it picks up?",
        helper: "This is the very first thing callers hear \u2014 set the tone for the whole conversation",
        options: [
          { label: "Hi, thanks for calling {{business_name}}! How can I help you today?", description: "Friendly and warm \u2014 great for support & general inquiries" },
          { label: "Hello, you've reached the sales team. I'd love to learn about what you're looking for.", description: "Professional with a soft pitch \u2014 good for sales" },
          { label: "Hey there! Thanks for calling. What can I do for you?", description: "Casual and approachable \u2014 fits startups & small businesses" }
        ],
        multiSelect: false,
        allowFreeText: true,
        placeholder: `e.g. "Hi, thanks for calling [your company]! I'm here to help \u2014 what can I do for you?"`,
        required: true,
        writes: [{ kind: "set", key: "opener" }]
      },
      "blocker:Conversation Flow:Add a primary CTA": {
        id: "missing_cta",
        header: "Goal",
        question: "What should the agent try to get the caller to do?",
        helper: 'Think of the one outcome you want from every call. For example: "Get them to book a 15-minute demo" or "Resolve their issue without needing to transfer"',
        options: [
          { label: "Book a meeting", description: 'e.g. "Schedule a 15-min demo with our sales team"' },
          { label: "Fix their problem", description: `e.g. "Walk them through the fix so they don't need to call back"` },
          { label: "See if they're a fit", description: 'e.g. "Ask about their budget and timeline to qualify them"' },
          { label: "Take a message", description: 'e.g. "Get their name, number, and reason for calling"' }
        ],
        multiSelect: false,
        allowFreeText: true,
        placeholder: 'e.g. "Get the caller to schedule a product demo with our team"',
        required: true,
        writes: [{ kind: "set", key: "primaryCTA" }]
      },
      "blocker:Conversation Flow:Define at least one success criterion": {
        id: "missing_success",
        header: "Win",
        question: "What counts as a good call?",
        helper: `Pick what matters most \u2014 we'll use this to score every call. For example: a call is a win when "the caller booked a demo" or "their issue was fully resolved"`,
        options: [
          { label: "They booked a meeting", description: 'e.g. "Caller confirmed a date and time for a follow-up"' },
          { label: "Their issue got resolved", description: 'e.g. "Caller confirmed their problem is fixed"' },
          { label: "They're a qualified lead", description: 'e.g. "Caller shared budget, timeline, and decision-making authority"' },
          { label: "We captured their info", description: 'e.g. "Got name, email, and reason for calling"' }
        ],
        multiSelect: true,
        allowFreeText: true,
        placeholder: 'e.g. "The caller booked a demo and shared their contact info"',
        required: true,
        writes: [{ kind: "append", key: "successCriteria" }]
      }
    };
  }
});

// ../shared-types/dist/languageCapabilities.js
var init_languageCapabilities = __esm({
  "../shared-types/dist/languageCapabilities.js"() {
    "use strict";
  }
});

// ../shared-types/dist/sttCapabilities.js
function norm(value) {
  return String(value || "").trim().toLowerCase();
}
function getSttModelCapabilities(provider, model) {
  const p = norm(provider);
  const m = norm(model);
  if (p === "deepgram") {
    if (m.startsWith("flux")) {
      return { nativeEndOfTurn: true, knobs: [...DEEPGRAM_FLUX_KNOBS] };
    }
    return { nativeEndOfTurn: false, knobs: [...DEEPGRAM_NOVA_KNOBS] };
  }
  if (p === "assemblyai") {
    return { nativeEndOfTurn: false, knobs: [...ASSEMBLYAI_KNOBS] };
  }
  if (p === "soniox") {
    const nativeEndOfTurn = m.includes("v4") || m.startsWith("stt-rt");
    return { nativeEndOfTurn, knobs: [...SONIOX_KNOBS] };
  }
  return { nativeEndOfTurn: false, knobs: ["language"] };
}
function getSttLanguageSupport(provider, _model) {
  const p = norm(provider);
  if (p === "soniox") {
    return {
      mode: "bias",
      label: "Language bias",
      description: "Your selection biases recognition but doesn\u2019t restrict it \u2014 a single language gives the best accuracy. Turn on Strict language to lock it."
    };
  }
  if (MULTILINGUAL_STT_PROVIDERS.has(p)) {
    return {
      mode: "multilingual",
      label: "Multilingual",
      description: "Recognizes every language you add within the same call \u2014 no per-language engine swap needed."
    };
  }
  return {
    mode: "single",
    label: "Single language",
    description: "Transcribes one language at a time, starting with your start language. Rymi re-resolves the engine per language when you support more than one."
  };
}
var DEEPGRAM_NOVA_KNOBS, DEEPGRAM_FLUX_KNOBS, ASSEMBLYAI_KNOBS, SONIOX_KNOBS, MULTILINGUAL_STT_PROVIDERS;
var init_sttCapabilities = __esm({
  "../shared-types/dist/sttCapabilities.js"() {
    "use strict";
    DEEPGRAM_NOVA_KNOBS = [
      "confidence",
      "numeralFormatting",
      "profanityFilter",
      "keywords",
      "backgroundDenoising"
    ];
    DEEPGRAM_FLUX_KNOBS = [
      "keywords",
      "profanityFilter",
      "endOfTurnConfidence",
      "endOfTurnTimeout"
    ];
    ASSEMBLYAI_KNOBS = [
      "endOfTurnConfidence",
      "minTurnSilence",
      "maxTurnSilence"
    ];
    SONIOX_KNOBS = [
      "strictLanguage",
      "endpointDelay",
      "customVocabulary",
      "context"
    ];
    MULTILINGUAL_STT_PROVIDERS = /* @__PURE__ */ new Set([
      "google",
      // Gemini / Chirp
      "openai",
      // Whisper / gpt-4o-transcribe — auto-detect
      "elevenlabs",
      // Scribe — auto multilingual
      "gladia",
      // auto language detection
      "sarvam",
      // Indic + English code-switching
      "assemblyai"
      // universal-streaming multilingual
    ]);
  }
});

// ../shared-types/dist/managedAgentSkus.js
function resolveManagedPricePerMin(sku) {
  return sku.pricePerMin ?? 0;
}
var init_managedAgentSkus = __esm({
  "../shared-types/dist/managedAgentSkus.js"() {
    "use strict";
  }
});

// ../shared-types/dist/customBilling.js
function customStackCostPerMin(costs, byok) {
  const order = costs.realtime != null ? ["realtime"] : ["stt", "llm", "tts"];
  const channels = [];
  let component = 0;
  let unknown = false;
  for (const ch of order) {
    const isByok = !!byok[ch];
    const rate = costs[ch];
    const known = rate != null && Number.isFinite(rate);
    channels.push({ channel: ch, cost: isByok ? 0 : known ? rate : null, byok: isByok });
    if (isByok)
      continue;
    if (!known) {
      unknown = true;
      continue;
    }
    component += rate;
  }
  if (unknown) {
    return { componentCostPerMin: null, platformFeePerMin: CUSTOM_PLATFORM_FEE_PER_MIN, totalPerMin: null, channels };
  }
  component = Number(component.toFixed(8));
  return {
    componentCostPerMin: component,
    platformFeePerMin: CUSTOM_PLATFORM_FEE_PER_MIN,
    totalPerMin: Number((component + CUSTOM_PLATFORM_FEE_PER_MIN).toFixed(8)),
    channels
  };
}
var init_customBilling = __esm({
  "../shared-types/dist/customBilling.js"() {
    "use strict";
    init_pricing();
  }
});

// ../shared-types/dist/systemVariables.js
function isSystemVariable(key) {
  return SYSTEM_VARIABLE_KEYS.has(key);
}
function resolveSystemAlias(key) {
  const v = SYSTEM_VARIABLES.find((x) => x.key === key);
  if (!v)
    return void 0;
  return v.aliasOf ?? v.key;
}
function buildSystemBusinessValues(opts = {}) {
  const business = (opts.businessName || "").trim();
  const agent = (opts.agentName || "").trim();
  const values = {};
  if (business) {
    for (const v of SYSTEM_VARIABLES) {
      if (v.group === "business" && (v.key === "company_name" || v.aliasOf === "company_name")) {
        values[v.key] = business;
      }
    }
  }
  if (agent)
    values["agent_name"] = agent;
  return values;
}
var SYSTEM_VARIABLES, SYSTEM_VARIABLE_KEYS;
var init_systemVariables = __esm({
  "../shared-types/dist/systemVariables.js"() {
    "use strict";
    SYSTEM_VARIABLES = [
      { key: "company_name", label: "Business name", description: "The business name", group: "business" },
      { key: "agent_name", label: "Agent name", description: "This agent's name", group: "business" },
      { key: "company_description", label: "Business description", description: "What the business does", group: "business" },
      { key: "business_name", label: "Business name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "restaurant_name", label: "Restaurant name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "hotel_name", label: "Hotel name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "firm_name", label: "Firm name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "brokerage_name", label: "Brokerage name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "institution_name", label: "Institution name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "practice_name", label: "Practice name", description: "Alias of company_name", group: "business", aliasOf: "company_name" },
      { key: "name", label: "Caller name", description: "The caller's name, if known", group: "caller" },
      { key: "email", label: "Caller email", description: "The caller's email, if known", group: "caller" },
      { key: "phone", label: "Caller phone", description: "The caller's number, if known", group: "caller" },
      { key: "timezone", label: "Caller timezone", description: "The caller's timezone, if known", group: "caller" },
      { key: "current_date", label: "Current date", description: "Today's date at call start", group: "datetime" },
      { key: "current_time", label: "Current time", description: "Time at call start", group: "datetime" },
      { key: "day_of_week", label: "Day of week", description: "e.g. Monday", group: "datetime" },
      { key: "caller_local_time", label: "Caller's local time", description: "Time in the caller's timezone", group: "datetime" }
    ];
    SYSTEM_VARIABLE_KEYS = new Set(SYSTEM_VARIABLES.map((v) => v.key));
  }
});

// ../shared-types/dist/dateTimeVariables.js
function fmt(now, locale, opts) {
  return new Intl.DateTimeFormat(locale, opts).format(now);
}
function computeDateTimeVariables(input) {
  const locale = input.locale || "en-US";
  let tz = input.timezone || "UTC";
  let callerTz = input.callerTimezone || tz;
  try {
    Intl.DateTimeFormat(void 0, { timeZone: tz });
  } catch {
    tz = "UTC";
  }
  try {
    Intl.DateTimeFormat(void 0, { timeZone: callerTz });
  } catch {
    callerTz = tz;
  }
  const current_date = fmt(input.now, locale, {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  const current_time = fmt(input.now, locale, {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit"
  });
  const day_of_week = fmt(input.now, locale, { timeZone: tz, weekday: "long" });
  const caller_local_time = fmt(input.now, locale, {
    timeZone: callerTz,
    hour: "numeric",
    minute: "2-digit"
  });
  return { current_date, current_time, day_of_week, caller_local_time };
}
var init_dateTimeVariables = __esm({
  "../shared-types/dist/dateTimeVariables.js"() {
    "use strict";
  }
});

// ../shared-types/dist/compliance.js
function consentStatus(contact, channel) {
  const v = contact?.consent?.[channel];
  if (v === void 0 || v === null)
    return { granted: false, hasEvidence: false };
  if (typeof v === "boolean")
    return { granted: v, hasEvidence: false };
  return { granted: Boolean(v.granted), hasEvidence: true };
}
function localHourInZone(now, timezone) {
  try {
    const s = new Intl.DateTimeFormat("en-US", { timeZone: timezone, hour: "2-digit", hour12: false }).format(now);
    const h = parseInt(s, 10);
    if (!Number.isFinite(h))
      return null;
    return h === 24 ? 0 : h;
  } catch {
    return null;
  }
}
function isWithinCallingWindow(window, now) {
  if (!window)
    return true;
  const hour = localHourInZone(now, window.timezone);
  if (hour === null)
    return true;
  return hour >= window.start_hour && hour < window.end_hour;
}
function requiredConsentChannels(level) {
  if (level === "voice")
    return ["voice"];
  if (level === "all")
    return ["voice", "sms", "whatsapp", "telegram"];
  return [];
}
var DEFAULT_COMPLIANCE_POLICY;
var init_compliance = __esm({
  "../shared-types/dist/compliance.js"() {
    "use strict";
    DEFAULT_COMPLIANCE_POLICY = {
      require_consent: "voice",
      require_consent_evidence: false,
      max_attempts_per_24h: 3,
      ai_disclosure: "agent",
      dnc_scrub: "attested"
    };
  }
});

// ../shared-types/dist/connectorCatalog.js
function getConnectorCatalogEntry(id) {
  return CATALOG_BY_ID.get(id);
}
function listActiveConnectors(maxPhase = 1) {
  return CONNECTOR_CATALOG.filter((c) => c.phase <= maxPhase);
}
function providerIdsForTool(toolId, maxPhase = 1) {
  return listActiveConnectors(maxPhase).filter((c) => c.toolIds.includes(toolId)).map((c) => c.id);
}
var CONNECTOR_CATALOG, CATALOG_BY_ID;
var init_connectorCatalog = __esm({
  "../shared-types/dist/connectorCatalog.js"() {
    "use strict";
    CONNECTOR_CATALOG = [
      {
        id: "google_calendar",
        category: "calendar",
        displayName: "Google Calendar",
        authType: "oauth2",
        phase: 1,
        toolIds: [
          "check_calendar_availability",
          "list_calendar_events",
          "create_calendar_event",
          "update_calendar_event",
          "delete_calendar_event"
        ],
        brandAssetKey: "google_calendar"
      },
      {
        id: "outlook_calendar",
        category: "calendar",
        displayName: "Outlook / Microsoft 365",
        authType: "oauth2",
        phase: 1,
        toolIds: [
          "check_calendar_availability",
          "list_calendar_events",
          "create_calendar_event",
          "update_calendar_event",
          "delete_calendar_event"
        ],
        brandAssetKey: "outlook_calendar"
      },
      {
        id: "hubspot",
        category: "crm",
        displayName: "HubSpot",
        authType: "oauth2",
        phase: 1,
        toolIds: ["lookup_customer"],
        brandAssetKey: "hubspot"
      },
      {
        id: "zoho_crm",
        category: "crm",
        displayName: "Zoho CRM",
        authType: "oauth2",
        phase: 1,
        toolIds: ["lookup_customer"],
        brandAssetKey: "zoho_crm"
      },
      {
        id: "leadsquared",
        category: "crm",
        displayName: "LeadSquared",
        authType: "api_key",
        phase: 1,
        toolIds: ["lookup_customer"],
        brandAssetKey: "leadsquared"
      },
      {
        id: "freshdesk",
        category: "ticketing",
        displayName: "Freshdesk",
        authType: "api_key",
        phase: 1,
        toolIds: ["lookup_ticket", "create_ticket"],
        brandAssetKey: "freshdesk"
      },
      {
        id: "whatsapp",
        category: "messaging",
        displayName: "WhatsApp",
        // Multi-transport (Plivo/Twilio/Vonage/Meta) — the embedded Meta flow is
        // the recommended one, so the catalog labels it meta_embedded. Nothing
        // gates on this beyond `!== 'oauth2'`, which holds either way.
        authType: "meta_embedded",
        phase: 1,
        toolIds: ["send_whatsapp_message", "send_asset"],
        brandAssetKey: "whatsapp"
      },
      {
        id: "telegram",
        category: "messaging",
        displayName: "Telegram",
        authType: "bot_token",
        phase: 1,
        toolIds: ["send_telegram_message", "send_asset"],
        brandAssetKey: "telegram"
      },
      // ── Future (phase 2/3) — stubbed so the catalog stays the single source of
      // truth, but excluded from the active view until their phase ships. When one
      // goes live (phase → 1), providerIdsForTool/OAUTH_CRM_PROVIDERS pick it up
      // automatically; the connectorCatalog.test.ts invariant then fails until the
      // lookup_customer handler grows a matching dispatch branch. ────────────────
      {
        id: "salesforce",
        category: "crm",
        displayName: "Salesforce",
        authType: "oauth2",
        phase: 2,
        toolIds: ["lookup_customer"],
        brandAssetKey: "salesforce"
      },
      {
        id: "calendly",
        category: "calendar",
        displayName: "Calendly",
        authType: "oauth2",
        phase: 3,
        toolIds: ["check_calendar_availability"],
        brandAssetKey: "calendly"
      },
      {
        id: "pipedrive",
        category: "crm",
        displayName: "Pipedrive",
        authType: "oauth2",
        phase: 3,
        toolIds: ["lookup_customer"],
        brandAssetKey: "pipedrive"
      }
    ];
    CATALOG_BY_ID = new Map(CONNECTOR_CATALOG.map((c) => [c.id, c]));
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/metadata.min.json.js
var metadata_min_json_default;
var init_metadata_min_json = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/metadata.min.json.js"() {
    "use strict";
    metadata_min_json_default = { "version": 4, "country_calling_codes": { "1": ["US", "AG", "AI", "AS", "BB", "BM", "BS", "CA", "DM", "DO", "GD", "GU", "JM", "KN", "KY", "LC", "MP", "MS", "PR", "SX", "TC", "TT", "VC", "VG", "VI"], "7": ["RU", "KZ"], "20": ["EG"], "27": ["ZA"], "30": ["GR"], "31": ["NL"], "32": ["BE"], "33": ["FR"], "34": ["ES"], "36": ["HU"], "39": ["IT", "VA"], "40": ["RO"], "41": ["CH"], "43": ["AT"], "44": ["GB", "GG", "IM", "JE"], "45": ["DK"], "46": ["SE"], "47": ["NO", "SJ"], "48": ["PL"], "49": ["DE"], "51": ["PE"], "52": ["MX"], "53": ["CU"], "54": ["AR"], "55": ["BR"], "56": ["CL"], "57": ["CO"], "58": ["VE"], "60": ["MY"], "61": ["AU", "CC", "CX"], "62": ["ID"], "63": ["PH"], "64": ["NZ"], "65": ["SG"], "66": ["TH"], "81": ["JP"], "82": ["KR"], "84": ["VN"], "86": ["CN"], "90": ["TR"], "91": ["IN"], "92": ["PK"], "93": ["AF"], "94": ["LK"], "95": ["MM"], "98": ["IR"], "211": ["SS"], "212": ["MA", "EH"], "213": ["DZ"], "216": ["TN"], "218": ["LY"], "220": ["GM"], "221": ["SN"], "222": ["MR"], "223": ["ML"], "224": ["GN"], "225": ["CI"], "226": ["BF"], "227": ["NE"], "228": ["TG"], "229": ["BJ"], "230": ["MU"], "231": ["LR"], "232": ["SL"], "233": ["GH"], "234": ["NG"], "235": ["TD"], "236": ["CF"], "237": ["CM"], "238": ["CV"], "239": ["ST"], "240": ["GQ"], "241": ["GA"], "242": ["CG"], "243": ["CD"], "244": ["AO"], "245": ["GW"], "246": ["IO"], "247": ["AC"], "248": ["SC"], "249": ["SD"], "250": ["RW"], "251": ["ET"], "252": ["SO"], "253": ["DJ"], "254": ["KE"], "255": ["TZ"], "256": ["UG"], "257": ["BI"], "258": ["MZ"], "260": ["ZM"], "261": ["MG"], "262": ["RE", "YT"], "263": ["ZW"], "264": ["NA"], "265": ["MW"], "266": ["LS"], "267": ["BW"], "268": ["SZ"], "269": ["KM"], "290": ["SH", "TA"], "291": ["ER"], "297": ["AW"], "298": ["FO"], "299": ["GL"], "350": ["GI"], "351": ["PT"], "352": ["LU"], "353": ["IE"], "354": ["IS"], "355": ["AL"], "356": ["MT"], "357": ["CY"], "358": ["FI", "AX"], "359": ["BG"], "370": ["LT"], "371": ["LV"], "372": ["EE"], "373": ["MD"], "374": ["AM"], "375": ["BY"], "376": ["AD"], "377": ["MC"], "378": ["SM"], "380": ["UA"], "381": ["RS"], "382": ["ME"], "383": ["XK"], "385": ["HR"], "386": ["SI"], "387": ["BA"], "389": ["MK"], "420": ["CZ"], "421": ["SK"], "423": ["LI"], "500": ["FK"], "501": ["BZ"], "502": ["GT"], "503": ["SV"], "504": ["HN"], "505": ["NI"], "506": ["CR"], "507": ["PA"], "508": ["PM"], "509": ["HT"], "590": ["GP", "BL", "MF"], "591": ["BO"], "592": ["GY"], "593": ["EC"], "594": ["GF"], "595": ["PY"], "596": ["MQ"], "597": ["SR"], "598": ["UY"], "599": ["CW", "BQ"], "670": ["TL"], "672": ["NF"], "673": ["BN"], "674": ["NR"], "675": ["PG"], "676": ["TO"], "677": ["SB"], "678": ["VU"], "679": ["FJ"], "680": ["PW"], "681": ["WF"], "682": ["CK"], "683": ["NU"], "685": ["WS"], "686": ["KI"], "687": ["NC"], "688": ["TV"], "689": ["PF"], "690": ["TK"], "691": ["FM"], "692": ["MH"], "850": ["KP"], "852": ["HK"], "853": ["MO"], "855": ["KH"], "856": ["LA"], "880": ["BD"], "886": ["TW"], "960": ["MV"], "961": ["LB"], "962": ["JO"], "963": ["SY"], "964": ["IQ"], "965": ["KW"], "966": ["SA"], "967": ["YE"], "968": ["OM"], "970": ["PS"], "971": ["AE"], "972": ["IL"], "973": ["BH"], "974": ["QA"], "975": ["BT"], "976": ["MN"], "977": ["NP"], "992": ["TJ"], "993": ["TM"], "994": ["AZ"], "995": ["GE"], "996": ["KG"], "998": ["UZ"] }, "countries": { "AC": ["247", "00", "(?:[01589]\\d|[46])\\d{4}", [5, 6]], "AD": ["376", "00", "(?:1|6\\d)\\d{7}|[135-9]\\d{5}", [6, 8, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["[135-9]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["1"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]]], "AE": ["971", "00", "(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{2,9})", "$1 $2", ["60|8"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[236]|[479][2-8]"], "0$1"], ["(\\d{3})(\\d)(\\d{5})", "$1 $2 $3", ["[479]"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"]], "0"], "AF": ["93", "00", "[2-7]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"]], "0"], "AG": ["1", "011", "(?:268|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([457]\\d{6})$|1", "268$1", 0, "268"], "AI": ["1", "011", "(?:264|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2457]\\d{6})$|1", "264$1", 0, "264"], "AL": ["355", "00", "(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}", [6, 7, 8, 9], [["(\\d{3})(\\d{3,4})", "$1 $2", ["80|9"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["4[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2358][2-5]|4"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["[23578]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["6"], "0$1"]], "0"], "AM": ["374", "00", "(?:[1-489]\\d|55|60|77)\\d{6}", [8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[89]0"], "0 $1"], ["(\\d{3})(\\d{5})", "$1 $2", ["2|3[12]"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["1|47"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[3-9]"], "0$1"]], "0"], "AO": ["244", "00", "[29]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[29]"]]]], "AR": ["54", "00", "(?:11|[89]\\d\\d)\\d{8}|[2368]\\d{9}", [10, 11], [["(\\d{4})(\\d{2})(\\d{4})", "$1 $2-$3", ["2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])", "2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["1"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[68]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2-$3", ["[23]"], "0$1", 1], ["(\\d)(\\d{4})(\\d{2})(\\d{4})", "$2 15-$3-$4", ["9(?:2[2-469]|3[3-578])", "9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))", "9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]", "9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d)(\\d{2})(\\d{4})(\\d{4})", "$2 15-$3-$4", ["91"], "0$1", 0, "$1 $2 $3-$4"], ["(\\d{3})(\\d{3})(\\d{5})", "$1-$2-$3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{4})", "$2 15-$3-$4", ["9"], "0$1", 0, "$1 $2 $3-$4"]], "0", 0, "0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?", "9$1"], "AS": ["1", "011", "(?:[58]\\d\\d|684|900)\\d{7}", [10], 0, "1", 0, "([267]\\d{6})$|1", "684$1", 0, "684"], "AT": ["43", "00", "1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{3,12})", "$1 $2", ["1(?:11|[2-9])"], "0$1"], ["(\\d{3})(\\d{2})", "$1 $2", ["517"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["5[079]"], "0$1"], ["(\\d{3})(\\d{3,10})", "$1 $2", ["(?:31|4)6|51|6(?:48|5[0-3579]|[6-9])|7(?:20|32|8)|[89]", "(?:31|4)6|51|6(?:485|5[0-3579]|[6-9])|7(?:20|32|8)|[89]"], "0$1"], ["(\\d{4})(\\d{3,9})", "$1 $2", ["[2-467]|5[2-6]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,7})", "$1 $2 $3", ["5"], "0$1"]], "0"], "AU": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{7}(?:\\d(?:\\d{2})?)?|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}", [5, 6, 7, 8, 9, 10, 12], [["(\\d{2})(\\d{3,4})", "$1 $2", ["16"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["16"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["14|4"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[2378]"], "(0$1)"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:30|[89])"]]], "0", 0, "(183[12])|0", 0, 0, 0, [["(?:(?:241|349)0\\d\\d|8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-79]|[18][13579]|2[14-9]|3[0-46-9]|[4-6]\\d|7[89]|9[0-4])|[34]\\d\\d)|91(?:(?:[0-58]\\d|6[0135-9])\\d|7(?:0[0-24-9]|[1-9]\\d)|9(?:[0-46-9]\\d|5[0-79]))))\\d{3}|(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8])|8(?:55|6[0-8]|[78]\\d|9[02-9]))\\d{6}", [9]], ["4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, ["163\\d{2,6}", [5, 6, 7, 8, 9]], ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "AW": ["297", "00", "(?:[25-79]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[25-9]"]]]], "AX": ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}", [5, 6, 7, 8, 9, 10, 11, 12], 0, "0", 0, 0, 0, 0, "18", 0, "00"], "AZ": ["994", "00", "365\\d{6}|(?:[124579]\\d|60|88)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[28]|2|365|46", "1[28]|2|365[45]|46", "1[28]|2|365(?:4|5[02])|46"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[13-9]"], "0$1"]], "0"], "BA": ["387", "00", "6\\d{8}|(?:[35689]\\d|49|70)\\d{6}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[1-3]|[7-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2-$3", ["[3-5]|6[56]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["6"], "0$1"]], "0"], "BB": ["1", "011", "(?:246|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "246$1", 0, "246"], "BD": ["880", "00", "[1-469]\\d{9}|8[0-79]\\d{7,8}|[2-79]\\d{8}|[2-9]\\d{7}|[3-9]\\d{6}|[57-9]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{2})(\\d{4,6})", "$1-$2", ["31[5-8]|[459]1"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1-$2", ["3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:[15]|28|4[14])|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]"], "0$1"], ["(\\d{4})(\\d{3,6})", "$1-$2", ["[13-9]|2[23]"], "0$1"], ["(\\d)(\\d{7,8})", "$1-$2", ["2"], "0$1"]], "0"], "BE": ["32", "00", "4\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:80|9)0"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[239]|4[23]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[15-8]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4"], "0$1"]], "0"], "BF": ["226", "00", "[024-7]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[024-7]"]]]], "BG": ["359", "00", "00800\\d{7}|[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}", [6, 7, 8, 9, 12], [["(\\d)(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["43[1-6]|70[1-9]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["(?:70|8)0"], "0$1"], ["(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3", ["43[1-7]|7"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[48]|9[08]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"]], "0"], "BH": ["973", "00", "[136-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[13679]|8[02-4679]"]]]], "BI": ["257", "00", "(?:[267]\\d|31)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2367]"]]]], "BJ": ["229", "00", "(?:01\\d|8)\\d{7}", [8, 10], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["0"]]]], "BL": ["590", "00", "7090\\d{5}|(?:[56]9|[89]\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["(?:59(?:0(?:2[7-9]|3[3-7]|5[12]|87)|87\\d)|80[6-9]\\d\\d)\\d{4}"], ["(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))|7090[0-4])\\d{4}"], ["80[0-5]\\d{6}"], ["8[129]\\d{7}"], 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"]]], "BM": ["1", "011", "(?:441|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "441$1", 0, "441"], "BN": ["673", "00", "[2-578]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-578]"]]]], "BO": ["591", "00(?:1\\d)?", "(?:[2-7]\\d\\d|8001)\\d{5}", [8, 9], [["(\\d)(\\d{7})", "$1 $2", ["[23]|4[46]|50"]], ["(\\d{8})", "$1", ["[5-7]"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["8"]]], "0", 0, "0(1\\d)?"], "BQ": ["599", "00", "(?:[34]1|7\\d)\\d{5}", [7], 0, 0, 0, 0, 0, 0, "[347]"], "BR": ["55", "00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)", "[1-467]\\d{9,10}|55[0-46-9]\\d{8}|[34]\\d{7}|55\\d{7,8}|(?:5[0-46-9]|[89]\\d)\\d{7,9}", [8, 9, 10, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["300|4(?:0[02]|37|86)", "300|4(?:0(?:0|20)|370|864)"]], ["(\\d{3})(\\d{2,3})(\\d{4})", "$1 $2 $3", ["(?:[358]|90)0"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2-$3", ["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"], "($1)"], ["(\\d{2})(\\d{5})(\\d{4})", "$1 $2-$3", ["[16][1-9]|[2-57-9]"], "($1)"]], "0", 0, "(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?", "$2"], "BS": ["1", "011", "(?:242|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([3-8]\\d{6})$|1", "242$1", 0, "242"], "BT": ["975", "00", "[178]\\d{7}|[2-8]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-6]|7[246]|8[2-4]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[67]|[78]"]]]], "BW": ["267", "00", "(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["90"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[24-6]|3[15-9]"]], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37]"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["8"]]]], "BY": ["375", "810", "(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3})", "$1 $2", ["800"], "8 $1"], ["(\\d{3})(\\d{2})(\\d{2,4})", "$1 $2 $3", ["800"], "8 $1"], ["(\\d{4})(\\d{2})(\\d{3})", "$1 $2-$3", ["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])", "1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"], "8 0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["1(?:[56]|7[467])|2[1-3]"], "8 0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-4]"], "8 0$1"], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[89]"], "8 $1"]], "8", 0, "0|80?", 0, 0, 0, 0, "8~10"], "BZ": ["501", "00", "(?:0800\\d|[2-8])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-8]"]], ["(\\d)(\\d{3})(\\d{4})(\\d{3})", "$1-$2-$3-$4", ["0"]]]], "CA": ["1", "011", "[2-9]\\d{9}|3\\d{6}", [7, 10], 0, "1", 0, 0, 0, 0, 0, [["(?:2(?:04|[23]6|[48]9|5[07]|63)|3(?:06|43|54|6[578]|82)|4(?:03|1[68]|[26]8|3[178]|50|74)|5(?:06|1[49]|48|79|8[147])|6(?:04|[18]3|39|47|72)|7(?:0[59]|42|53|78|8[02])|8(?:[06]7|19|25|7[39])|9(?:0[25]|42))[2-9]\\d{6}", [10]], ["", [10]], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}", [10]], ["900[2-9]\\d{6}", [10]], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:2[125-9]|3[23]|44|66|77|88)|6(?:22|33))[2-9]\\d{6}", [10]], 0, ["310\\d{4}", [7]], 0, ["600[2-9]\\d{6}", [10]]]], "CC": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:02|31|60|89)|1(?:18|76)|223)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}", [9]], ["4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "CD": ["243", "00", "(?:(?:[189]|5\\d)\\d|2)\\d{7}|[1-68]\\d{6}", [7, 8, 9, 10], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["[1-6]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["5"], "0$1"]], "0"], "CF": ["236", "00", "8776\\d{4}|(?:[27]\\d|61)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[26-8]"]]]], "CG": ["242", "00", "222\\d{6}|(?:0\\d|80)\\d{7}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[02]"]]]], "CH": ["41", "00", "8\\d{11}|[2-9]\\d{8}", [9, 12], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8[047]|90"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]|81"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["8"], "0$1"]], "0"], "CI": ["225", "00", "[02]\\d{9}", [10], [["(\\d{2})(\\d{2})(\\d)(\\d{5})", "$1 $2 $3 $4", ["2"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3 $4", ["0"]]]], "CK": ["682", "00", "[2-578]\\d{4}", [5], [["(\\d{2})(\\d{3})", "$1 $2", ["[2-578]"]]]], "CL": ["56", "(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0", "12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}", [9, 10, 11], [["(\\d{5})(\\d{4})", "$1 $2", ["219", "2196"], "($1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["60|809"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["44"]], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2[1-36]"], "($1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["9(?:10|[2-9])"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-8]|[1-9])"], "($1)"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["60|8"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{3})(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["60"]]]], "CM": ["237", "00", "[26]\\d{8}|88\\d{6,7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["88"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[26]|88"]]]], "CN": ["86", "00|1(?:[12]\\d|79)\\d\\d00", "(?:(?:1[03-689]|2\\d)\\d\\d|6)\\d{8}|1\\d{10}|[126]\\d{6}(?:\\d(?:\\d{2})?)?|86\\d{5,6}|(?:[3-579]\\d|8[0-57-9])\\d{5,9}", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5,6})", "$1 $2", ["(?:10|2[0-57-9])[19]|3(?:[157]|35|49|9[1-68])|4(?:1[124-9]|2[179]|6[47-9]|7|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:07|1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3|4[13]|5[1-5]|7[0-79]|9[0-35-9])|(?:4[35]|59|85)[1-9]", "(?:10|2[0-57-9])(?:1[02]|9[56])|8078|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))1", "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|80781|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))12", "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|807812|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))123", "10(?:1(?:0|23)|9[56])|2[0-57-9](?:1(?:00|23)|9[56])|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:1[124-9]|2[179]|[35][1-9]|6[47-9]|7\\d|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:078|1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|3\\d|4[13]|5[1-5]|7[0-79]|9[0-35-9]))123"], "0$1"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]", "(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]", "85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])", "85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["(?:4|80)0"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|2(?:[02-57-9]|1[1-9])", "10|2(?:[02-57-9]|1[1-9])", "10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]"], "0$1", 1], ["(\\d{3})(\\d{7,8})", "$1 $2", ["9"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["80"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[3-578]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["1[3-9]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["[12]"], "0$1", 1]], "0", 0, "(1(?:[12]\\d|79)\\d\\d)|0", 0, 0, 0, 0, "00"], "CO": ["57", "00(?:4(?:[14]4|56)|[579])", "(?:46|60\\d\\d)\\d{6}|(?:1\\d|[39])\\d{9}", [8, 10, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["46"]], ["(\\d{3})(\\d{7})", "$1 $2", ["6|90"], "($1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3[0-357]|9[14]"]], ["(\\d)(\\d{3})(\\d{7})", "$1-$2-$3", ["1"], "0$1", 0, "$1 $2 $3"]], "0", 0, "0([3579]|4(?:[14]4|56))?"], "CR": ["506", "00", "(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}", [8, 10], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[3-9]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["[89]"]]], 0, 0, "(19(?:0[0-2468]|1[09]|20|66|77|99))"], "CU": ["53", "119", "(?:[2-7]|8\\d\\d)\\d{7}|[2-47]\\d{6}|[34]\\d{5}", [6, 7, 8, 10], [["(\\d{2})(\\d{4,6})", "$1 $2", ["2[1-4]|[34]"], "(0$1)"], ["(\\d)(\\d{6,7})", "$1 $2", ["7"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["[56]"], "0$1"], ["(\\d{3})(\\d{7})", "$1 $2", ["8"], "0$1"]], "0"], "CV": ["238", "0", "(?:[2-59]\\d\\d|800)\\d{4}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-589]"]]]], "CW": ["599", "00", "(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[3467]"]], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["9[4-8]"]]], 0, 0, 0, 0, 0, "[69]"], "CX": ["61", "001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011", "1(?:[0-79]\\d{8}(?:\\d{2})?|8[0-24-9]\\d{7})|[148]\\d{8}|1\\d{5,7}", [6, 7, 8, 9, 10, 12], 0, "0", 0, "([59]\\d{7})$|0", "8$1", 0, 0, [["8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|2(?:22|35))|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}", [9]], ["4(?:79[01]|83[0-36-9]|95[0-3])\\d{5}|4(?:[0-36]\\d|4[047-9]|[58][0-24-9]|7[02-8]|9[0-47-9])\\d{6}", [9]], ["180(?:0\\d{3}|2)\\d{3}", [7, 10]], ["190[0-26]\\d{6}", [10]], 0, 0, 0, 0, ["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}", [9]], ["13(?:00\\d{6}(?:\\d{2})?|45[0-4]\\d{3})|13\\d{4}", [6, 8, 10, 12]]], "0011"], "CY": ["357", "00", "(?:[279]\\d|[58]0)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[257-9]"]]]], "CZ": ["420", "00", "(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}", [9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]|9[015-7]"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["96"]], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]]], "DE": ["49", "00", "[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:2[024-9]|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[015]\\d|2[13]|31|[46][1-8])\\d{1,9}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], [["(\\d{2})(\\d{3,13})", "$1 $2", ["3[02]|40|[68]9"], "0$1"], ["(\\d{3})(\\d{3,12})", "$1 $2", ["2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1", "2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1"], "0$1"], ["(\\d{4})(\\d{2,11})", "$1 $2", ["[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]", "[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["138"], "0$1"], ["(\\d{5})(\\d{2,10})", "$1 $2", ["3"], "0$1"], ["(\\d{3})(\\d{5,11})", "$1 $2", ["181"], "0$1"], ["(\\d{3})(\\d)(\\d{4,10})", "$1 $2 $3", ["1(?:3|80)|9"], "0$1"], ["(\\d{3})(\\d{7,8})", "$1 $2", ["1[67]"], "0$1"], ["(\\d{3})(\\d{7,12})", "$1 $2", ["8"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["185", "1850", "18500"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["18[68]"], "0$1"], ["(\\d{4})(\\d{7})", "$1 $2", ["15[1279]"], "0$1"], ["(\\d{5})(\\d{6})", "$1 $2", ["15[03568]", "15(?:[0568]|3[13])"], "0$1"], ["(\\d{3})(\\d{8})", "$1 $2", ["18"], "0$1"], ["(\\d{3})(\\d{2})(\\d{7,8})", "$1 $2 $3", ["1(?:6[023]|7)"], "0$1"], ["(\\d{4})(\\d{2})(\\d{7})", "$1 $2 $3", ["15[279]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{8})", "$1 $2 $3", ["15"], "0$1"]], "0"], "DJ": ["253", "00", "(?:2\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[27]"]]]], "DK": ["45", "00", "[2-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-9]"]]]], "DM": ["1", "011", "(?:[58]\\d\\d|767|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "767$1", 0, "767"], "DO": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "8001|8[024]9"], "DZ": ["213", "00", "(?:[1-4]|[5-79]\\d|80)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["9"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-8]"], "0$1"]], "0"], "EC": ["593", "00", "1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}", [8, 9, 10, 11], [["(\\d)(\\d{3})(\\d{4})", "$1 $2-$3", ["[2-7]"], "(0$1)", 0, "$1-$2-$3"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1"]]], "0"], "EE": ["372", "00", "8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88", "[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88"]], ["(\\d{4})(\\d{3,4})", "$1 $2", ["[45]|8(?:00|[1-49])", "[45]|8(?:00[1-9]|[1-49])"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], "EG": ["20", "00", "[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}", [8, 9, 10], [["(\\d)(\\d{7,8})", "$1 $2", ["[23]"], "0$1"], ["(\\d{2})(\\d{6,7})", "$1 $2", ["1[35]|[4-6]|8[2468]|9[235-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{8})", "$1 $2", ["1"], "0$1"]], "0"], "EH": ["212", "00", "[5-8]\\d{8}", [9], 0, "0", 0, 0, 0, 0, 0, [["528[89]\\d{5}"], ["(?:6(?:[0-79]\\d|8[0-247-9])|7(?:[016-8]\\d|2[0-8]|5[0-5]))\\d{6}"], ["80[0-7]\\d{6}"], ["89\\d{7}"], 0, 0, 0, 0, ["(?:592(?:4[0-2]|93)|80[89]\\d\\d)\\d{4}"]]], "ER": ["291", "00", "[178]\\d{6}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[178]"], "0$1"]], "0"], "ES": ["34", "00", "[5-9]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[89]00"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-9]"]]]], "ET": ["251", "00", "(?:11|[2-57-9]\\d)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-57-9]"], "0$1"]], "0"], "FI": ["358", "00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))", "[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}", [5, 6, 7, 8, 9, 10, 11, 12], [["(\\d{5})", "$1", ["20[2-59]"], "0$1"], ["(\\d{3})(\\d{3,7})", "$1 $2", ["(?:[1-3]0|[68])0|70[07-9]"], "0$1"], ["(\\d{2})(\\d{4,8})", "$1 $2", ["[14]|2[09]|50|7[135]"], "0$1"], ["(\\d{2})(\\d{6,10})", "$1 $2", ["7"], "0$1"], ["(\\d)(\\d{4,9})", "$1 $2", ["(?:19|[2568])[1-8]|3(?:0[1-9]|[1-9])|9"], "0$1"]], "0", 0, 0, 0, 0, "1[03-79]|[2-9]", 0, "00"], "FJ": ["679", "0(?:0|52)", "45\\d{5}|(?:0800\\d|[235-9])\\d{6}", [7, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[235-9]|45"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "FK": ["500", "00", "[2-7]\\d{4}", [5]], "FM": ["691", "00", "(?:[39]\\d\\d|820)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[389]"]]]], "FO": ["298", "00", "[2-9]\\d{5}", [6], [["(\\d{6})", "$1", ["[2-9]"]]], 0, 0, "(10(?:01|[12]0|88))"], "FR": ["33", "00", "[1-9]\\d{8}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0 $1"], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[1-79]"], "0$1"]], "0"], "GA": ["241", "00", "(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}", [7, 8], [["(\\d)(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-7]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["11|[67]"], "0$1"]], 0, 0, "0(11\\d{6}|60\\d{6}|61\\d{6}|6[256]\\d{6}|7[467]\\d{6})", "$1"], "GB": ["44", "00", "[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}", [7, 9, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["800", "8001", "80011", "800111", "8001111"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["845", "8454", "84546", "845464"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["800"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["1(?:38|5[23]|69|76|94)", "1(?:(?:38|69)7|5(?:24|39)|768|946)", "1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["1(?:[2-69][02-9]|[78])"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[25]|7(?:0|6[02-9])", "[25]|7(?:0|6(?:[03-9]|2[356]))"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1389]"], "0$1"]], "0", 0, "0|180020", 0, 0, 0, [["(?:1(?:1(?:3(?:[0-58]\\d\\d|73[0-5])|4(?:(?:[0-5]\\d|70)\\d|69[7-9])|(?:(?:5[0-26-9]|[78][0-49])\\d|6(?:[0-4]\\d|5[01]))\\d)|(?:2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d|1(?:[0-7]\\d|8[0-3]))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d)\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}", [9, 10]], ["7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]], 0, " x"], "GD": ["1", "011", "(?:473|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "473$1", 0, "473"], "GE": ["995", "00", "(?:[3-57]\\d\\d|800)\\d{6}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["32"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[57]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[348]"], "0$1"]], "0"], "GF": ["594", "00", "(?:694\\d|7093)\\d{5}|(?:59|[89]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]|80[6-9]|9[47]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[89]"], "0$1"]], "0"], "GG": ["44", "00", "(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?", [7, 9, 10], 0, "0", 0, "([25-9]\\d{5})$|0|180020", "1481$1", 0, 0, [["1481[25-9]\\d{5}", [10]], ["7(?:(?:781|839)\\d|911[17])\\d{5}", [10]], ["80[08]\\d{7}|800\\d{6}|8001111"], ["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d", [7, 10]], ["70\\d{8}", [10]], 0, ["(?:3[0347]|55)\\d{8}", [10]], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}", [10]], ["56\\d{8}", [10]]]], "GH": ["233", "00", "[235]\\d{8}|800\\d{5,6}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2358]"], "0$1"]], "0"], "GI": ["350", "00", "(?:[25]\\d|60)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["2"]]]], "GL": ["299", "00", "(?:19|[2-689]\\d|70)\\d{4}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["19|[2-9]"]]]], "GM": ["220", "00", "[2-9]\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "GN": ["224", "00", "722\\d{6}|(?:3|6\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["3"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[67]"]]]], "GP": ["590", "00", "7090\\d{5}|(?:[56]9|[89]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-79]|80[6-9]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0", 0, 0, 0, 0, 0, [["(?:59(?:0(?:0[1-68]|[14][0-24-9]|2[0-68]|3[1-9]|5[3-579]|[68][0-689]|7[08]|9\\d)|87\\d)|80[6-9]\\d\\d)\\d{4}"], ["(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))|7090[0-4])\\d{4}"], ["80[0-5]\\d{6}"], ["8[129]\\d{7}"], 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"]]], "GQ": ["240", "00", "222\\d{6}|(?:3\\d|55|[89]0)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235]"]], ["(\\d{3})(\\d{6})", "$1 $2", ["[89]"]]]], "GR": ["30", "00", "5005000\\d{3}|8\\d{9,11}|(?:[269]\\d|70)\\d{8}", [10, 11, 12], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["21|7"]], ["(\\d{4})(\\d{6})", "$1 $2", ["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2689]"]], ["(\\d{3})(\\d{3,4})(\\d{5})", "$1 $2 $3", ["8"]]]], "GT": ["502", "00", "80\\d{6}|(?:1\\d{3}|[2-7])\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[2-8]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], "GU": ["1", "011", "(?:[58]\\d\\d|671|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "671$1", 0, "671"], "GW": ["245", "00", "[49]\\d{8}|4\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["40"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"]]]], "GY": ["592", "001", "(?:[2-8]\\d{3}|9008)\\d{3}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "HK": ["852", "00(?:30|5[09]|[126-9]?)", "8[0-46-9]\\d{6,7}|9\\d{4,7}|(?:[2-7]|9\\d{3})\\d{7}", [5, 6, 7, 8, 9, 11], [["(\\d{3})(\\d{2,5})", "$1 $2", ["900", "9003"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{3})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["9"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "HN": ["504", "00", "8\\d{10}|[237-9]\\d{7}", [8, 11], [["(\\d{4})(\\d{4})", "$1-$2", ["[237-9]"]]]], "HR": ["385", "00", "[2-69]\\d{8}|80\\d{5,7}|[1-79]\\d{7}|6\\d{6}", [7, 8, 9], [["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["6[01]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{4})(\\d{3})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6|7[245]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-57]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"]], "0"], "HT": ["509", "00", "[2-589]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["[2-589]"]]]], "HU": ["36", "00", "[235-7]\\d{8}|[1-9]\\d{7}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"], "(06 $1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "06 $1"]], "06"], "ID": ["62", "00[89]", "00[1-9]\\d{9,14}|(?:[1-36]|8\\d{5})\\d{6}|00\\d{9}|[1-9]\\d{8,10}|[2-9]\\d{7}", [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["15"]], ["(\\d{2})(\\d{5,9})", "$1 $2", ["2[124]|[36]1"], "(0$1)"], ["(\\d{3})(\\d{5,7})", "$1 $2", ["800"], "0$1"], ["(\\d{3})(\\d{5,8})", "$1 $2", ["[2-79]"], "(0$1)"], ["(\\d{3})(\\d{3,4})(\\d{3})", "$1-$2-$3", ["8[1-35-9]"], "0$1"], ["(\\d{3})(\\d{6,8})", "$1 $2", ["1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["804"], "0$1"], ["(\\d{3})(\\d)(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["80"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1-$2-$3", ["8"], "0$1"]], "0"], "IE": ["353", "00", "(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}", [7, 8, 9, 10], [["(\\d{2})(\\d{5})", "$1 $2", ["2[24-9]|47|58|6[237-9]|9[35-9]"], "(0$1)"], ["(\\d{3})(\\d{5})", "$1 $2", ["[45]0"], "(0$1)"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2569]|4[1-69]|7[14]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["70"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["81"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["4"], "(0$1)"], ["(\\d{2})(\\d)(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "IL": ["972", "0(?:0|1[2-9])", "1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}", [7, 8, 9, 10, 11, 12], [["(\\d{4})(\\d{3})", "$1-$2", ["125"]], ["(\\d{4})(\\d{2})(\\d{2})", "$1-$2-$3", ["121"]], ["(\\d)(\\d{3})(\\d{4})", "$1-$2-$3", ["[2-489]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1-$2-$3", ["12"]], ["(\\d{4})(\\d{6})", "$1-$2", ["159"]], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3-$4", ["1[7-9]"]], ["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})", "$1-$2 $3-$4", ["15"]]], "0"], "IM": ["44", "00", "1624\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([25-8]\\d{5})$|0|180020", "1624$1", 0, "74576|(?:16|7[56])24"], "IN": ["91", "00", "(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}", [8, 9, 10, 11, 12, 13], [["(\\d{8})", "$1", ["5(?:0|2[23]|3[03]|[67]1|88)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)", "5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)"], 0, 1], ["(\\d{4})(\\d{4,5})", "$1 $2", ["180", "1800"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["140"], 0, 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["11|2[02]|33|4[04]|79[1-7]|80[2-46]", "11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])", "11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67)[14]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31)|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]", "1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:3171|5[15][2-6]|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|8(?:16|2[014]|3[126]|6[136]|7[78]|83)(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]"], "0$1", 1], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|3[129]|5[29]|6[02-5]|70)|807", "1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7(?:[23569]|8[0-57-9])|8[1-6])|7(?:1(?:[013-8]|9[6-9])|3(?:17|2[0-49]|9[2-57])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]", "1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|8(?:28[235-7]|3))|73179|807(?:1|9[1-3])|(?:1552|6(?:(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578])\\d|7(?:[23569]\\d|8[0-57-9])|8(?:[14-6]\\d|2[0-79]))|7(?:1(?:[013-8]\\d|9[6-9])|3(?:2[0-49]|9[2-57])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]"], "0$1", 1], ["(\\d{5})(\\d{5})", "$1 $2", ["16|[6-9]"], "0$1", 1], ["(\\d{4})(\\d{2,4})(\\d{4})", "$1 $2 $3", ["18[06]", "18[06]0"], 0, 1], ["(\\d{4})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["18"], 0, 1]], "0"], "IO": ["246", "00", "3\\d{6}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["3"]]]], "IQ": ["964", "00", "(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-6]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"]], "0"], "IR": ["98", "00", "[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}", [4, 5, 6, 7, 10], [["(\\d{4,5})", "$1", ["96"], "0$1"], ["(\\d{2})(\\d{4,5})", "$1 $2", ["(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["[1-8]"], "0$1"]], "0"], "IS": ["354", "00|1(?:0(?:01|[12]0)|100)", "(?:38\\d|[4-9])\\d{6}", [7, 9], [["(\\d{3})(\\d{4})", "$1 $2", ["[4-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["3"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "IT": ["39", "00", "0\\d{5,11}|1\\d{8,10}|3(?:[0-8]\\d{7,10}|9\\d{7,8})|(?:43|55|70)\\d{8}|8\\d{5}(?:\\d{2,4})?", [6, 7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{4,6})", "$1 $2", ["0[26]"]], ["(\\d{3})(\\d{3,6})", "$1 $2", ["0[13-57-9][0159]|8(?:03|4[17]|9[2-5])", "0[13-57-9][0159]|8(?:03|4[17]|9(?:2|3[04]|[45][0-4]))"]], ["(\\d{4})(\\d{2,6})", "$1 $2", ["0(?:[13-579][2-46-8]|8[236-8])"]], ["(\\d{4})(\\d{4})", "$1 $2", ["894"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[26]|5"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["1(?:44|[679])|[378]|43"]], ["(\\d{3})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["0[13-57-9][0159]|14"]], ["(\\d{2})(\\d{4})(\\d{5})", "$1 $2 $3", ["0[26]"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[03]"]]], 0, 0, 0, 0, 0, 0, [["0(?:669[0-79]\\d{1,6}|831\\d{2,8})|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[2356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}"], ["3[2-9]\\d{7,8}|(?:31|43)\\d{8}", [9, 10]], ["80(?:0\\d{3}|3)\\d{3}", [6, 9]], ["(?:0878\\d{3}|89(?:2\\d|3[04]|4(?:[0-4]|[5-9]\\d\\d)|5[0-4]))\\d\\d|(?:1(?:44|6[346])|89(?:38|5[5-9]|9))\\d{6}", [6, 8, 9, 10]], ["1(?:78\\d|99)\\d{6}", [9, 10]], ["3[2-8]\\d{9,10}", [11, 12]], 0, 0, ["55\\d{8}", [10]], ["84(?:[08]\\d{3}|[17])\\d{3}", [6, 9]]]], "JE": ["44", "00", "1534\\d{6}|(?:[3578]\\d|90)\\d{8}", [10], 0, "0", 0, "([0-24-8]\\d{5})$|0|180020", "1534$1", 0, 0, [["1534[0-24-8]\\d{5}"], ["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97\\d))\\d{5}"], ["80(?:07(?:35|81)|8901)\\d{4}"], ["(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"], ["701511\\d{4}"], 0, ["(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"], ["76(?:464|652)\\d{5}|76(?:0[0-28]|2[356]|34|4[01347]|5[49]|6[0-369]|77|8[14]|9[139])\\d{6}"], ["56\\d{8}"]]], "JM": ["1", "011", "(?:[58]\\d\\d|658|900)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "658|876"], "JO": ["962", "00", "(?:(?:[2689]|7\\d)\\d|32|427|53)\\d{6}", [8, 9], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2356]|87"], "(0$1)"], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["70"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[47]"], "0$1"]], "0"], "JP": ["81", "010", "00[1-9]\\d{6,14}|[25-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}", [8, 9, 10, 11, 12, 13, 14, 15, 16, 17], [["(\\d{3})(\\d{3})(\\d{3})", "$1-$2-$3", ["(?:12|57|99)0"], "0$1"], ["(\\d{4})(\\d)(\\d{4})", "$1-$2-$3", ["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51)|9(?:80|9[16])", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]", "1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9])|9(?:802|9(?:1[23]|69))|1(?:45|58)[67]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["60"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2-$3", ["3|4(?:2[09]|7[01])|6[1-9]", "3|4(?:2(?:0|9[02-69])|7(?:0[019]|1))|6[1-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[0459]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[26-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9]|9[29])|5(?:2|3(?:[045]|9[0-8])|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|3(?:[29]|60)|49|51|6(?:[0-24]|36|5[0-3589]|7[23]|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]", "1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3(?:[045]|9(?:[0-58]|6[4-9]|7[0-35689]))|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|60|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[2-57-9]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|7(?:2[2-468]|3[78])|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3", ["[14]|[289][2-9]|5[3-9]|7[2-4679]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2-$3", ["800"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[25-9]"], "0$1"]], "0", 0, "(000[2569]\\d{4,6})$|(?:(?:003768)0?)|0", "$1"], "KE": ["254", "000", "(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}", [7, 8, 9, 10], [["(\\d{2})(\\d{5,7})", "$1 $2", ["[24-6]"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[17]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0"], "KG": ["996", "00", "8\\d{9}|[235-9]\\d{8}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["3(?:1[346]|[24-79])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-79]|88"], "0$1"], ["(\\d{3})(\\d{3})(\\d)(\\d{2,3})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "KH": ["855", "00[14-9]", "1\\d{9}|[1-9]\\d{7,8}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "KI": ["686", "00", "(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}", [5, 8], 0, "0"], "KM": ["269", "00", "[3478]\\d{6}", [7], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[3478]"]]]], "KN": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "869$1", 0, "869"], "KP": ["850", "00|99", "85\\d{6}|(?:19\\d|[2-7])\\d{7}", [8, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-7]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"]], "0"], "KR": ["82", "00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))", "00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}", [5, 6, 8, 9, 10, 11, 12, 13, 14], [["(\\d{2})(\\d{3,4})", "$1-$2", ["(?:3[1-3]|[46][1-4]|5[1-5])1"], "0$1"], ["(\\d{4})(\\d{4})", "$1-$2", ["1"]], ["(\\d)(\\d{3,4})(\\d{4})", "$1-$2-$3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1-$2-$3", ["[36]0|8"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1-$2-$3", ["[1346]|5[1-5]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2-$3", ["[57]"], "0$1"], ["(\\d{2})(\\d{5})(\\d{4})", "$1-$2-$3", ["5"], "0$1"]], "0", 0, "0(8(?:[1-46-8]|5\\d\\d))?"], "KW": ["965", "00", "18\\d{5}|(?:[2569]\\d|41)\\d{6}", [7, 8], [["(\\d{4})(\\d{3,4})", "$1 $2", ["[169]|2(?:[235]|4[1-35-9])|52"]], ["(\\d{3})(\\d{5})", "$1 $2", ["[245]"]]]], "KY": ["1", "011", "(?:345|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "345$1", 0, "345"], "KZ": ["7", "810", "8\\d{13}|[78]\\d{9}", [10, 14], 0, "8", 0, 0, 0, 0, "7", 0, "8~10"], "LA": ["856", "00", "[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}", [8, 9, 10], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2[13]|3[14]|[4-8]"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["3"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0"], "LB": ["961", "00", "[27-9]\\d{7}|[13-9]\\d{6}", [7, 8], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[13-69]|7(?:[2-57]|62|8[0-6]|9[04-9])|8[02-9]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[27-9]"]]], "0"], "LC": ["1", "011", "(?:[58]\\d\\d|758|900)\\d{7}", [10], 0, "1", 0, "([2-8]\\d{6})$|1", "758$1", 0, "758"], "LI": ["423", "00", "[68]\\d{8}|(?:[2378]\\d|90)\\d{5}", [7, 9], [["(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2379]|8(?:0[09]|7)", "[2379]|8(?:0(?:02|9)|7)"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["69"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]]], "0", 0, "(1001)|0"], "LK": ["94", "00", "[1-9]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[1-689]"], "0$1"]], "0"], "LR": ["231", "00", "(?:[2457]\\d|33|88)\\d{7}|(?:2\\d|[4-6])\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["4[67]|[56]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-578]"], "0$1"]], "0"], "LS": ["266", "00", "(?:[256]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2568]"]]]], "LT": ["370", "00", "(?:[3469]\\d|52|[78]0)\\d{6}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["52[0-7]"], "(0-$1)", 1], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0 $1", 1], ["(\\d{2})(\\d{6})", "$1 $2", ["37|4(?:[15]|6[1-8])"], "(0-$1)", 1], ["(\\d{3})(\\d{5})", "$1 $2", ["[3-6]"], "(0-$1)", 1]], "0", 0, "[08]"], "LU": ["352", "00", "35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}", [4, 5, 6, 7, 8, 9, 10, 11], [["(\\d{2})(\\d{3})", "$1 $2", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["20[2-689]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4", ["20"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})", "$1 $2 $3 $4", ["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"]], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["80[01]|90[015]"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3 $4", ["20"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})", "$1 $2 $3 $4 $5", ["20"]]], 0, 0, "(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"], "LV": ["371", "00", "(?:[268]\\d|78|90)\\d{6}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2679]|8[01]"]]]], "LY": ["218", "00", "[2-9]\\d{8}", [9], [["(\\d{2})(\\d{7})", "$1-$2", ["[2-9]"], "0$1"]], "0"], "MA": ["212", "00", "[5-8]\\d{8}", [9], [["(\\d{4})(\\d{5})", "$1-$2", ["892"], "0$1"], ["(\\d{2})(\\d{7})", "$1-$2", ["8(?:0[0-7]|9)"], "0$1"], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[5-8]"], "0$1"]], "0", 0, 0, 0, 0, "[5-8]"], "MC": ["377", "00", "(?:[3489]|[67]\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["4"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[389]"]], ["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4 $5", ["[67]"], "0$1"]], "0"], "MD": ["373", "00", "(?:[235-7]\\d|[89]0)\\d{6}", [8], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["22|3"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["[25-7]"], "0$1"]], "0"], "ME": ["382", "00", "(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[2-9]"], "0$1"]], "0"], "MF": ["590", "00", "7090\\d{5}|(?:[56]9|[89]\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["(?:59(?:0(?:0[079]|[14]3|[27][79]|3[03-7]|5[0-268]|87)|87\\d)|80[6-9]\\d\\d)\\d{4}"], ["(?:69(?:0\\d\\d|1(?:2[2-9]|3[0-5]))|7090[0-4])\\d{4}"], ["80[0-5]\\d{6}"], ["8[129]\\d{7}"], 0, 0, 0, 0, ["9(?:(?:39[5-7]|76[018])\\d|475[0-6])\\d{4}"]]], "MG": ["261", "00", "[23]\\d{8}", [9], [["(\\d{2})(\\d{2})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["[23]"], "0$1"]], "0", 0, "([24-9]\\d{6})$|0", "20$1"], "MH": ["692", "011", "329\\d{4}|(?:[256]\\d|45)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1-$2", ["[2-6]"]]], "1"], "MK": ["389", "00", "[2-578]\\d{7}", [8], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2|34[47]|4(?:[37]7|5[47]|64)"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[347]"], "0$1"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[58]"], "0$1"]], "0"], "ML": ["223", "00", "[24-9]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24-9]"]]]], "MM": ["95", "00", "1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}", [6, 7, 8, 9, 10], [["(\\d)(\\d{2})(\\d{3})", "$1 $2 $3", ["16|2"], "0$1"], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["4(?:[2-46]|5[3-5])|5|6(?:[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-5]|(?:60|86)[23]"], "0$1"], ["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[12]|452|678|86", "[12]|452|6788|86"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[4-7]|8[1-35]"], "0$1"], ["(\\d)(\\d{3})(\\d{4,6})", "$1 $2 $3", ["9(?:2[0-4]|[35-9]|4[137-9])"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["92"], "0$1"], ["(\\d)(\\d{5})(\\d{4})", "$1 $2 $3", ["9"], "0$1"]], "0"], "MN": ["976", "001", "[12]\\d{7,9}|[5-9]\\d{7}", [8, 9, 10], [["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["11|2[16]"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[5-9]"]], ["(\\d{3})(\\d{5,6})", "$1 $2", ["[12]2[1-3]"], "0$1"], ["(\\d{4})(\\d{5,6})", "$1 $2", ["[12](?:27|3[2-8]|4[2-68]|5[1-4689])", "[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"], "0$1"], ["(\\d{5})(\\d{4,5})", "$1 $2", ["[12]"], "0$1"]], "0"], "MO": ["853", "00", "0800\\d{3}|(?:28|[68]\\d)\\d{6}", [7, 8], [["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[268]"]]]], "MP": ["1", "011", "[58]\\d{9}|(?:67|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "670$1", 0, "670"], "MQ": ["596", "00", "7091\\d{5}|(?:[56]9|[89]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-79]|8(?:0[6-9]|[36])"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "MR": ["222", "00", "(?:[2-4]\\d\\d|800)\\d{5}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-48]"]]]], "MS": ["1", "011", "(?:[58]\\d\\d|664|900)\\d{7}", [10], 0, "1", 0, "([34]\\d{6})$|1", "664$1", 0, "664"], "MT": ["356", "00", "3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[2357-9]"]]]], "MU": ["230", "0(?:0|[24-7]0|3[03])", "(?:[57]|8\\d\\d)\\d{7}|[2-468]\\d{6}", [7, 8, 10], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-46]|8[013]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[57]"]], ["(\\d{5})(\\d{5})", "$1 $2", ["8"]]], 0, 0, 0, 0, 0, 0, 0, "020"], "MV": ["960", "0(?:0|19)", "(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}", [7, 10], [["(\\d{3})(\\d{4})", "$1-$2", ["[34679]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "MW": ["265", "00", "(?:[1289]\\d|31|77)\\d{7}|1\\d{6}", [7, 9], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["1[2-9]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-37-9]"], "0$1"]], "0"], "MX": ["52", "0[09]", "[2-9]\\d{9}", [10], [["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["33|5[56]|81"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[2-9]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "MY": ["60", "00", "1\\d{8,9}|(?:3\\d|[4-9])\\d{7}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1-$2 $3", ["[4-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1-$2 $3", ["1(?:[02469]|[378][1-9]|53)|8", "1(?:[02469]|[37][1-9]|53|8(?:[1-46-9]|5[7-9]))|8"], "0$1"], ["(\\d)(\\d{4})(\\d{4})", "$1-$2 $3", ["3"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{4})", "$1-$2-$3-$4", ["1(?:[367]|80)"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1-$2 $3", ["15"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4})", "$1-$2 $3", ["1"], "0$1"]], "0"], "MZ": ["258", "00", "(?:2|8\\d)\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2|8[2-79]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["8"]]]], "NA": ["264", "00", "[68]\\d{7,8}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["88"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["87"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], "NC": ["687", "00", "(?:050|[2-57-9]\\d\\d)\\d{3}", [6], [["(\\d{2})(\\d{2})(\\d{2})", "$1.$2.$3", ["[02-57-9]"]]]], "NE": ["227", "00", "[027-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["08"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[089]|2[013]|7[0467]"]]]], "NF": ["672", "00", "[13]\\d{5}", [6], [["(\\d{2})(\\d{4})", "$1 $2", ["1[0-3]"]], ["(\\d)(\\d{5})", "$1 $2", ["[13]"]]], 0, 0, "([0-258]\\d{4})$", "3$1"], "NG": ["234", "009", "(?:20|9\\d)\\d{8}|[78]\\d{9,13}", [10, 11, 12, 13, 14], [["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[7-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["20[129]"], "0$1"], ["(\\d{4})(\\d{2})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{3})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["[78]"], "0$1"], ["(\\d{3})(\\d{5})(\\d{5,6})", "$1 $2 $3", ["[78]"], "0$1"]], "0"], "NI": ["505", "00", "(?:1800|[25-8]\\d{3})\\d{4}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[125-8]"]]]], "NL": ["31", "00", "(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|8\\d{6,9}|9\\d{6,10}|1\\d{4,5}", [5, 6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{4,7})", "$1 $2", ["[89]0"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["66"], "0$1"], ["(\\d)(\\d{8})", "$1 $2", ["6"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-578]|91"], "0$1"], ["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3", ["9"], "0$1"]], "0"], "NO": ["47", "00", "(?:0|[2-9]\\d{3})\\d{4}", [5, 8], [["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["8"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[2-79]"]]], 0, 0, 0, 0, 0, "[02-689]|7[0-8]"], "NP": ["977", "00", "(?:1\\d|9)\\d{9}|[1-9]\\d{7}", [8, 10, 11], [["(\\d)(\\d{7})", "$1-$2", ["1[2-6]"], "0$1"], ["(\\d{2})(\\d{6})", "$1-$2", ["1[01]|[2-8]|9(?:[1-59]|[67][2-6])"], "0$1"], ["(\\d{3})(\\d{7})", "$1-$2", ["9"]]], "0"], "NR": ["674", "00", "(?:222|444|(?:55|8\\d)\\d|666|777|999)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[24-9]"]]]], "NU": ["683", "00", "(?:[4-7]|888\\d)\\d{3}", [4, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["8"]]]], "NZ": ["64", "0(?:0|161)", "[1289]\\d{9}|50\\d{5}(?:\\d{2,3})?|[27-9]\\d{7,8}|(?:[34]\\d|6[0-35-9])\\d{6}|8\\d{4,6}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,8})", "$1 $2", ["8[1-79]"], "0$1"], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["50[036-8]|8|90", "50(?:[0367]|88)|8|90"], "0$1"], ["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["24|[346]|7[2-57-9]|9[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:10|74)|[589]"], "0$1"], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["1|2[028]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,5})", "$1 $2 $3", ["2(?:[169]|7[0-35-9])|7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "00"], "OM": ["968", "00", "(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}", [7, 8, 9], [["(\\d{3})(\\d{4,6})", "$1 $2", ["[58]"]], ["(\\d{2})(\\d{6})", "$1 $2", ["2"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[179]"]]]], "PA": ["507", "00", "(?:00800|8\\d{3})\\d{6}|[68]\\d{7}|[1-57-9]\\d{6}", [7, 8, 10, 11], [["(\\d{3})(\\d{4})", "$1-$2", ["[1-57-9]"]], ["(\\d{4})(\\d{4})", "$1-$2", ["[68]"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]]], "PE": ["51", "00|19(?:1[124]|77|90)00", "(?:[14-8]|9\\d)\\d{7}", [8, 9], [["(\\d{3})(\\d{5})", "$1 $2", ["80"], "(0$1)"], ["(\\d)(\\d{7})", "$1 $2", ["1"], "(0$1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[4-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"]]], "0", 0, 0, 0, 0, 0, 0, "00", " Anexo "], "PF": ["689", "00", "4\\d{5}(?:\\d{2})?|8\\d{7,8}", [6, 8, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["44"]], ["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["4|8[7-9]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], "PG": ["675", "00|140[1-3]", "(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["18|[2-69]|85"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[78]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "PH": ["63", "00", "(?:[2-7]|9\\d)\\d{8}|2\\d{5}|(?:1800|8)\\d{7,9}", [6, 8, 9, 10, 11, 12, 13], [["(\\d)(\\d{5})", "$1 $2", ["2"], "(0$1)"], ["(\\d{4})(\\d{4,6})", "$1 $2", ["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2", "3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"], "(0$1)"], ["(\\d{5})(\\d{4})", "$1 $2", ["346|4(?:27|9[35])|883", "3469|4(?:279|9(?:30|56))|8834"], "(0$1)"], ["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["2"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|8[2-8]"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]], ["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})", "$1 $2 $3 $4", ["1"]]], "0"], "PK": ["92", "00", "122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,7})", "$1 $2 $3", ["[89]0"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["1"]], ["(\\d{3})(\\d{6,7})", "$1 $2", ["2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])", "9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]"], "(0$1)"], ["(\\d{2})(\\d{7,8})", "$1 $2", ["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"], "(0$1)"], ["(\\d{5})(\\d{5})", "$1 $2", ["58"], "(0$1)"], ["(\\d{3})(\\d{7})", "$1 $2", ["3"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"], "(0$1)"], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[24-9]"], "(0$1)"]], "0"], "PL": ["48", "00", "(?:6|8\\d\\d)\\d{7}|[1-9]\\d{6}(?:\\d{2})?|[26]\\d{5}", [6, 7, 8, 9, 10], [["(\\d{5})", "$1", ["19"]], ["(\\d{3})(\\d{3})", "$1 $2", ["11|20|64"]], ["(\\d{2})(\\d{2})(\\d{3})", "$1 $2 $3", ["30|(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1", "30|(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"]], ["(\\d{3})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["64"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["21|39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[2-8]|[2-7]|8[1-79]|9[145]"]], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["8"]]]], "PM": ["508", "00", "[78]\\d{8}|[2-9]\\d{5}", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[2-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"], "0$1"]], "0"], "PR": ["1", "011", "(?:[589]\\d\\d|787)\\d{7}", [10], 0, "1", 0, 0, 0, 0, "787|939"], "PS": ["970", "00", "[2489]2\\d{6}|(?:1\\d|5)\\d{8}", [8, 9, 10], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["[2489]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "PT": ["351", "00", "1693\\d{5}|(?:[26-9]\\d|30)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["2[12]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["16|[236-9]"]]]], "PW": ["680", "01[12]", "(?:[24-8]\\d\\d|345|900)\\d{4}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-9]"]]]], "PY": ["595", "00", "[36-8]\\d{5,8}|4\\d{6,8}|59\\d{6}|9\\d{5,10}|(?:2\\d|5[0-8])\\d{6,7}", [6, 7, 8, 9, 10, 11], [["(\\d{3})(\\d{3,6})", "$1 $2", ["[2-9]0"], "0$1"], ["(\\d{2})(\\d{5})", "$1 $2", ["3[289]|4[246-8]|61|7[1-3]|8[1-36]"], "(0$1)"], ["(\\d{3})(\\d{4,5})", "$1 $2", ["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["87"]], ["(\\d{3})(\\d{6})", "$1 $2", ["9(?:[5-79]|8[1-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-8]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["9"]]], "0"], "QA": ["974", "00", "800\\d{4}|(?:2|800)\\d{6}|(?:0080|[3-7])\\d{7}", [7, 8, 9, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["2[136]|8"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[3-7]"]]]], "RE": ["262", "00", "709\\d{6}|(?:26|[689]\\d)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[26-9]"], "0$1"]], "0", 0, 0, 0, 0, 0, [["2631[0-6]\\d{4}|26(?:2\\d|30|88)\\d{5}"], ["(?:69(?:2\\d\\d|3(?:[06][0-6]|1[0-3]|2[0-2]|3[0-39]|4\\d|5[0-5]|7[0-37]|8[0-8]|9[0-479]))|7092[0-3])\\d{4}"], ["80\\d{7}"], ["89[1-37-9]\\d{6}"], 0, 0, 0, 0, ["9(?:399[0-3]|479[0-6]|76(?:2[278]|3[0-37]))\\d{4}"], ["8(?:1[019]|2[0156]|84|90)\\d{6}"]]], "RO": ["40", "00", "(?:[236-8]\\d|90)\\d{7}|[23]\\d{5}", [6, 9], [["(\\d{3})(\\d{3})", "$1 $2", ["2[3-6]", "2[3-6]\\d9"], "0$1"], ["(\\d{2})(\\d{4})", "$1 $2", ["219|31"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[23]1"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[236-9]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, " int "], "RS": ["381", "00", "38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}", [6, 7, 8, 9, 10, 11, 12], [["(\\d{3})(\\d{3,9})", "$1 $2", ["(?:2[389]|39)0|[7-9]"], "0$1"], ["(\\d{2})(\\d{5,10})", "$1 $2", ["[1-36]"], "0$1"]], "0"], "RU": ["7", "810", "8\\d{13}|[347-9]\\d{9}", [10, 14], [["(\\d{4})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-8]|2[1-9])", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:1[23]|[2-9]2))", "7(?:1(?:[0-356]2|4[29]|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2"], "8 ($1)", 1], ["(\\d{5})(\\d)(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["7(?:1[0-68]|2[1-9])", "7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))", "7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "8 ($1)", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[349]|8(?:[02-7]|1[1-8])"], "8 ($1)", 1], ["(\\d{4})(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["8"], "8 ($1)"]], "8", 0, 0, 0, 0, "[3489]", 0, "8~10"], "RW": ["250", "00", "(?:06|[27]\\d\\d|[89]00)\\d{6}", [8, 9], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[7-9]"], "0$1"]], "0"], "SA": ["966", "00", "(?:[15]\\d|800|92)\\d{7}", [9, 10], [["(\\d{4})(\\d{5})", "$1 $2", ["9"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["5"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]]], "0"], "SB": ["677", "0[01]", "[6-9]\\d{6}|[1-6]\\d{4}", [5, 7], [["(\\d{2})(\\d{5})", "$1 $2", ["6[89]|7|8[4-9]|9(?:[1-8]|9[0-8])"]]]], "SC": ["248", "010|0[0-2]", "(?:[2489]\\d|64)\\d{5}", [7], [["(\\d)(\\d{3})(\\d{3})", "$1 $2 $3", ["[246]|9[57]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "SD": ["249", "00", "[19]\\d{8}", [9], [["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], "SE": ["46", "00", "(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}", [6, 7, 8, 9, 10, 12], [["(\\d{2})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["20"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{4})", "$1-$2", ["9(?:00|39|44|9)"], "0$1", 0, "$1 $2"], ["(\\d{2})(\\d{3})(\\d{2})", "$1-$2 $3", ["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3"], ["(\\d)(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2,3})(\\d{2})", "$1-$2 $3", ["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3"], ["(\\d{3})(\\d{2,3})(\\d{3})", "$1-$2 $3", ["9(?:00|39|44)"], "0$1", 0, "$1 $2 $3"], ["(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["10|7"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1-$2 $3 $4", ["8"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1-$2 $3 $4", ["[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{2})(\\d{3})", "$1-$2 $3 $4", ["9"], "0$1", 0, "$1 $2 $3 $4"], ["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1-$2 $3 $4 $5", ["[26]"], "0$1", 0, "$1 $2 $3 $4 $5"]], "0"], "SG": ["65", "0[0-3]\\d", "(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}", [8, 10, 11], [["(\\d{4})(\\d{4})", "$1 $2", ["[369]|8(?:0[1-9]|[1-9])"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"]], ["(\\d{4})(\\d{4})(\\d{3})", "$1 $2 $3", ["7"]], ["(\\d{4})(\\d{3})(\\d{4})", "$1 $2 $3", ["1"]]]], "SH": ["290", "00", "(?:[256]\\d|8)\\d{3}", [4, 5], 0, 0, 0, 0, 0, 0, "[256]"], "SI": ["386", "00|10(?:22|66|88|99)", "[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}", [5, 6, 7, 8], [["(\\d{2})(\\d{3,6})", "$1 $2", ["8[09]|9"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["59|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[37][01]|4[013]|51|6"], "0$1"], ["(\\d)(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[1-57]"], "(0$1)"]], "0", 0, 0, 0, 0, 0, 0, "00"], "SJ": ["47", "00", "0\\d{4}|(?:[489]\\d|79)\\d{6}", [5, 8], 0, 0, 0, 0, 0, 0, "79"], "SK": ["421", "00", "[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}", [6, 7, 9], [["(\\d)(\\d{2})(\\d{3,4})", "$1 $2 $3", ["21"], "0$1"], ["(\\d{2})(\\d{2})(\\d{2,3})", "$1 $2 $3", ["[3-5][1-8]1", "[3-5][1-8]1[67]"], "0$1"], ["(\\d)(\\d{3})(\\d{3})(\\d{2})", "$1 $2 $3 $4", ["2"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[689]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[3-5]"], "0$1"]], "0"], "SL": ["232", "00", "(?:[237-9]\\d|66)\\d{6}", [8], [["(\\d{2})(\\d{6})", "$1 $2", ["[236-9]"], "(0$1)"]], "0"], "SM": ["378", "00", "(?:0549|[5-7]\\d)\\d{6}", [8, 10], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[5-7]"]], ["(\\d{4})(\\d{6})", "$1 $2", ["0"]]], 0, 0, "([89]\\d{5})$", "0549$1"], "SN": ["221", "00", "(?:[378]\\d|93)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[379]"]]]], "SO": ["252", "00", "[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}", [6, 7, 8, 9], [["(\\d{2})(\\d{4})", "$1 $2", ["8[125]"]], ["(\\d{6})", "$1", ["[134]"]], ["(\\d)(\\d{6})", "$1 $2", ["[15]|2[0-79]|3[0-46-8]|4[0-7]"]], ["(\\d{2})(\\d{5,7})", "$1 $2", ["1|28|9[2-9]"]], ["(\\d)(\\d{7})", "$1 $2", ["[267]|904"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[346-9]"]]], "0"], "SR": ["597", "00", "(?:[2-5]|[6-9]\\d)\\d{5}", [6, 7], [["(\\d{2})(\\d{2})(\\d{2})", "$1-$2-$3", ["56"]], ["(\\d{3})(\\d{3})", "$1-$2", ["[2-5]"]], ["(\\d{3})(\\d{4})", "$1-$2", ["[6-9]"]]]], "SS": ["211", "00", "[19]\\d{8}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[19]"], "0$1"]], "0"], "ST": ["239", "00", "(?:22|9\\d)\\d{5}", [7], [["(\\d{3})(\\d{4})", "$1 $2", ["[29]"]]]], "SV": ["503", "00", "[25-7]\\d{7}|(?:80\\d|900)\\d{4}(?:\\d{4})?", [7, 8, 11], [["(\\d{3})(\\d{4})", "$1 $2", ["[89]"]], ["(\\d{4})(\\d{4})", "$1 $2", ["[25-7]"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["[89]"]]]], "SX": ["1", "011", "7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "(5\\d{6})$|1", "721$1", 0, "721"], "SY": ["963", "00", "[1-359]\\d{8}|[1-5]\\d{7}", [8, 9], [["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-4]|5[1-3]"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[59]"], "0$1", 1]], "0"], "SZ": ["268", "00", "0800\\d{4}|(?:[237]\\d|900)\\d{6}", [8, 9], [["(\\d{4})(\\d{4})", "$1 $2", ["[0237]"]], ["(\\d{5})(\\d{4})", "$1 $2", ["9"]]]], "TA": ["290", "00", "8\\d{3}", [4], 0, 0, 0, 0, 0, 0, "8"], "TC": ["1", "011", "(?:[58]\\d\\d|649|900)\\d{7}", [10], 0, "1", 0, "([2-479]\\d{6})$|1", "649$1", 0, "649"], "TD": ["235", "00|16", "(?:22|[3689]\\d|77)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[236-9]"]]], 0, 0, 0, 0, 0, 0, 0, "00"], "TG": ["228", "00", "[279]\\d{7}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[279]"]]]], "TH": ["66", "00[1-9]", "(?:001800|[2-57]|[689]\\d)\\d{7}|1\\d{7,9}", [8, 9, 10, 13], [["(\\d)(\\d{3})(\\d{4})", "$1 $2 $3", ["2"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[13-9]"], "0$1"], ["(\\d{4})(\\d{3})(\\d{3})", "$1 $2 $3", ["1"]]], "0"], "TJ": ["992", "810", "(?:[0-57-9]\\d|66)\\d{7}", [9], [["(\\d{6})(\\d)(\\d{2})", "$1 $2 $3", ["331", "3317"]], ["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["44[02-479]|[34]7"]], ["(\\d{4})(\\d)(\\d{4})", "$1 $2 $3", ["3(?:[1245]|3[12])"]], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["\\d"]]], 0, 0, 0, 0, 0, 0, 0, "8~10"], "TK": ["690", "00", "[2-47]\\d{3,6}", [4, 5, 6, 7]], "TL": ["670", "00", "7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}", [7, 8], [["(\\d{3})(\\d{4})", "$1 $2", ["[2-489]|70"]], ["(\\d{4})(\\d{4})", "$1 $2", ["7"]]]], "TM": ["993", "810", "(?:[1-6]\\d|71)\\d{6}", [8], [["(\\d{2})(\\d{2})(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["12"], "(8 $1)"], ["(\\d{3})(\\d)(\\d{2})(\\d{2})", "$1 $2-$3-$4", ["[1-5]"], "(8 $1)"], ["(\\d{2})(\\d{6})", "$1 $2", ["[67]"], "8 $1"]], "8", 0, 0, 0, 0, 0, 0, "8~10"], "TN": ["216", "00", "[2-57-9]\\d{7}", [8], [["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-57-9]"]]]], "TO": ["676", "00", "(?:0800|(?:[5-8]\\d\\d|999)\\d)\\d{3}|[2-8]\\d{4}", [5, 7], [["(\\d{2})(\\d{3})", "$1-$2", ["[2-4]|50|6[09]|7[0-24-69]|8[05]"]], ["(\\d{4})(\\d{3})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[5-9]"]]]], "TR": ["90", "00", "4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}", [7, 10, 12, 13], [["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["512|8[01589]|90"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["5[0-79]"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[24][1-8]|3[1-9]"], "(0$1)", 1], ["(\\d{3})(\\d{3})(\\d{6,7})", "$1 $2 $3", ["80"], "0$1", 1]], "0"], "TT": ["1", "011", "(?:[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-46-8]\\d{6})$|1", "868$1", 0, "868"], "TV": ["688", "00", "(?:2|7\\d\\d|90)\\d{4}", [5, 6, 7], [["(\\d{2})(\\d{3})", "$1 $2", ["2"]], ["(\\d{2})(\\d{4})", "$1 $2", ["90"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], "TW": ["886", "0(?:0[25-79]|19)", "[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}", [7, 8, 9, 10, 11], [["(\\d{2})(\\d)(\\d{4})", "$1 $2 $3", ["202"], "0$1"], ["(\\d{3})(\\d{5})", "$1 $2", ["826"], "0$1"], ["(\\d{3})(\\d{2})(\\d{3})", "$1 $2 $3", ["83"], "0$1"], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["82"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[25]0|37|49|8[09]"], "0$1"], ["(\\d)(\\d{3,4})(\\d{4})", "$1 $2 $3", ["[23568]|4(?:0[02-48]|[1-478])|7[1-9]", "[23568]|4(?:0[2-48]|[1-478])|(?:400|7)[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{2})(\\d{4})(\\d{4,5})", "$1 $2 $3", ["7"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, 0, "#"], "TZ": ["255", "00[056]", "(?:[25-8]\\d|41|90)\\d{7}", [9], [["(\\d{3})(\\d{2})(\\d{4})", "$1 $2 $3", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[24]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["5"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[67]"], "0$1"]], "0"], "UA": ["380", "00", "[89]\\d{9}|[3-9]\\d{8}", [9, 10], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]", "6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]"], "0$1"], ["(\\d{4})(\\d{5})", "$1 $2", ["3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6(?:[12][3-7]|[459])", "3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6(?:[12][3-7]|[459])"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[3-7]|89|9[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[89]"], "0$1"]], "0", 0, 0, 0, 0, 0, 0, "0~0"], "UG": ["256", "00[057]", "800\\d{6}|(?:[29]0|[347]\\d)\\d{7}", [9], [["(\\d{4})(\\d{5})", "$1 $2", ["202", "2024"], "0$1"], ["(\\d{3})(\\d{6})", "$1 $2", ["[27-9]|4(?:6[45]|[7-9])"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[34]"], "0$1"]], "0"], "US": ["1", "011", "[2-9]\\d{9}|3\\d{6}", [10], [["(\\d{3})(\\d{4})", "$1-$2", ["310"], 0, 1], ["(\\d{3})(\\d{3})(\\d{4})", "($1) $2-$3", ["[2-9]"], 0, 1, "$1-$2-$3"]], "1", 0, 0, 0, 0, 0, [["(?:274[27]|(?:472|983)[2-47-9])\\d{6}|(?:2(?:0[1-35-9]|1[02-9]|2[03-57-9]|3[1459]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[013-79]|3[0-24679]|4[167]|5[0-3]|6[01349]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[023578]|58|6[349]|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[179]|6[1-47]|7[0-5]|8[0256])|6(?:0[1-35-9]|1[024-9]|2[03689]|3[016]|4[0156]|5[01679]|6[0-279]|78|8[0-269])|7(?:0[1-46-8]|1[2-9]|2[04-8]|3[0-2478]|4[0378]|5[47]|6[02359]|7[0-59]|8[156])|8(?:0[1-68]|1[02-8]|2[0168]|3[0-2589]|4[03578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[01357-9]|5[12469]|7[0-3589]|8[04-69]))[2-9]\\d{6}"], [""], ["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"], ["900[2-9]\\d{6}"], ["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[125-9]|3[23]|44|66|77|88)[2-9]\\d{6}"]]], "UY": ["598", "0(?:0|1[3-9]\\d)", "0004\\d{2,9}|[1249]\\d{7}|2\\d{3,4}|(?:[49]\\d|80)\\d{5}", [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], [["(\\d{4,5})", "$1", ["21"]], ["(\\d{3})(\\d{3,4})", "$1 $2", ["0"]], ["(\\d{3})(\\d{4})", "$1 $2", ["[49]0|8"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["9"], "0$1"], ["(\\d{4})(\\d{4})", "$1 $2", ["[124]"]], ["(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3", ["0"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{2,4})", "$1 $2 $3 $4", ["0"]]], "0", 0, 0, 0, 0, 0, 0, "00", " int. "], "UZ": ["998", "00", "(?:20|33|[5-9]\\d)\\d{7}", [9], [["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["[235-9]"]]]], "VA": ["39", "00", "0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}", [6, 7, 8, 9, 10, 11, 12], 0, 0, 0, 0, 0, 0, "06698"], "VC": ["1", "011", "(?:[58]\\d\\d|784|900)\\d{7}", [10], 0, "1", 0, "([2-7]\\d{6})$|1", "784$1", 0, "784"], "VE": ["58", "00", "[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}", [10], [["(\\d{3})(\\d{7})", "$1-$2", ["[24-689]"], "0$1"]], "0"], "VG": ["1", "011", "(?:284|[58]\\d\\d|900)\\d{7}", [10], 0, "1", 0, "([2-578]\\d{6})$|1", "284$1", 0, "284"], "VI": ["1", "011", "[58]\\d{9}|(?:34|90)0\\d{7}", [10], 0, "1", 0, "([2-9]\\d{6})$|1", "340$1", 0, "340"], "VN": ["84", "00", "[12]\\d{9}|[135-9]\\d{8}|[16]\\d{6,7}|7\\d{6}", [7, 8, 9, 10], [["(\\d{4})(\\d{4,6})", "$1 $2", ["1(?:2[02]|[89])"], 0, 1], ["(\\d{2})(\\d{3})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["1[26]|6"], "0$1", 1], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[357-9]"], "0$1", 1], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["2[48]"], "0$1", 1], ["(\\d{3})(\\d{4})(\\d{3})", "$1 $2 $3", ["2"], "0$1", 1]], "0"], "VU": ["678", "00", "[57-9]\\d{6}|(?:[238]\\d|48)\\d{3}", [5, 7], [["(\\d{3})(\\d{4})", "$1 $2", ["[57-9]"]]]], "WF": ["681", "00", "(?:40|72|8\\d{4})\\d{4}|[89]\\d{5}", [6, 9], [["(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3", ["[47-9]"]], ["(\\d{3})(\\d{2})(\\d{2})(\\d{2})", "$1 $2 $3 $4", ["8"]]]], "WS": ["685", "0", "(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}", [5, 6, 7, 10], [["(\\d{5})", "$1", ["[2-5]|6[1-9]"]], ["(\\d{3})(\\d{3,7})", "$1 $2", ["[68]"]], ["(\\d{2})(\\d{5})", "$1 $2", ["7"]]]], "XK": ["383", "00", "2\\d{7,8}|3\\d{7,11}|(?:4\\d\\d|[89]00)\\d{5}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{5})", "$1 $2", ["[89]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3})", "$1 $2 $3", ["[2-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["2|39"], "0$1"], ["(\\d{2})(\\d{7,10})", "$1 $2", ["3"], "0$1"]], "0"], "YE": ["967", "00", "(?:1|7\\d)\\d{7}|[1-7]\\d{6}", [7, 8, 9], [["(\\d)(\\d{3})(\\d{3,4})", "$1 $2 $3", ["[1-6]|7(?:[24-6]|8[0-7])"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["7"], "0$1"]], "0"], "YT": ["262", "00", "(?:639\\d|7093)\\d{5}|(?:26|80|9\\d)\\d{7}", [9], 0, "0", 0, 0, 0, 0, 0, [["26(?:89\\d|9(?:0[0-467]|15|5[0-4]|6\\d|[78]0))\\d{4}"], ["(?:639(?:0[0-79]|1[019]|[267]\\d|3[09]|40|5[05-9]|9[04-79])|7093[5-7])\\d{4}"], ["80\\d{7}"], 0, 0, 0, 0, 0, ["9(?:(?:39|47)8[01]|769\\d)\\d{4}"]]], "ZA": ["27", "00", "[1-79]\\d{8}|8\\d{4,9}", [5, 6, 7, 8, 9, 10], [["(\\d{2})(\\d{3,4})", "$1 $2", ["8[1-4]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{2,3})", "$1 $2 $3", ["8[1-4]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["860"], "0$1"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["[1-9]"], "0$1"], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["8"], "0$1"]], "0"], "ZM": ["260", "00", "800\\d{6}|(?:21|[579]\\d|63)\\d{7}", [9], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[28]"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["[579]"], "0$1"]], "0"], "ZW": ["263", "00", "2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}", [5, 6, 7, 8, 9, 10], [["(\\d{3})(\\d{3,5})", "$1 $2", ["2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]"], "0$1"], ["(\\d)(\\d{3})(\\d{2,4})", "$1 $2 $3", ["[49]"], "0$1"], ["(\\d{3})(\\d{4})", "$1 $2", ["80"], "0$1"], ["(\\d{2})(\\d{7})", "$1 $2", ["24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2", "2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"], "(0$1)"], ["(\\d{2})(\\d{3})(\\d{4})", "$1 $2 $3", ["7"], "0$1"], ["(\\d{3})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)", "2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"], "0$1"], ["(\\d{4})(\\d{6})", "$1 $2", ["8"], "0$1"], ["(\\d{2})(\\d{3,5})", "$1 $2", ["1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]"], "0$1"], ["(\\d{2})(\\d{3})(\\d{3,4})", "$1 $2 $3", ["29[013-9]|39|54"], "0$1"], ["(\\d{4})(\\d{3,5})", "$1 $2", ["(?:25|54)8", "258|5483"], "0$1"]], "0"] }, "nonGeographic": { "800": ["800", 0, "(?:00|[1-9]\\d)\\d{6}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["\\d"]]], 0, 0, 0, 0, 0, 0, [0, 0, ["(?:00|[1-9]\\d)\\d{6}"]]], "808": ["808", 0, "[1-9]\\d{7}", [8], [["(\\d{4})(\\d{4})", "$1 $2", ["[1-9]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, ["[1-9]\\d{7}"]]], "870": ["870", 0, "7\\d{11}|[235-7]\\d{8}", [9, 12], [["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["[235-7]"]]], 0, 0, 0, 0, 0, 0, [0, ["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"], 0, 0, 0, 0, 0, 0, ["2\\d{8}", [9]]]], "878": ["878", 0, "10\\d{10}", [12], [["(\\d{2})(\\d{5})(\\d{5})", "$1 $2 $3", ["1"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["10\\d{10}"]]], "881": ["881", 0, "6\\d{9}|[0-36-9]\\d{8}", [9, 10], [["(\\d)(\\d{3})(\\d{5})", "$1 $2 $3", ["[0-37-9]"]], ["(\\d)(\\d{3})(\\d{5,6})", "$1 $2 $3", ["6"]]], 0, 0, 0, 0, 0, 0, [0, ["6\\d{9}|[0-36-9]\\d{8}"]]], "882": ["882", 0, "[13]\\d{6}(?:\\d{2,5})?|[19]\\d{7}|(?:[25]\\d\\d|4)\\d{7}(?:\\d{2})?", [7, 8, 9, 10, 11, 12], [["(\\d{2})(\\d{5})", "$1 $2", ["16|342"]], ["(\\d{2})(\\d{6})", "$1 $2", ["49"]], ["(\\d{2})(\\d{2})(\\d{4})", "$1 $2 $3", ["1[36]|9"]], ["(\\d{2})(\\d{4})(\\d{3})", "$1 $2 $3", ["3[23]"]], ["(\\d{2})(\\d{3,4})(\\d{4})", "$1 $2 $3", ["16"]], ["(\\d{2})(\\d{4})(\\d{4})", "$1 $2 $3", ["10|23|3(?:[15]|4[57])|4|5[12]"]], ["(\\d{3})(\\d{4})(\\d{4})", "$1 $2 $3", ["34"]], ["(\\d{2})(\\d{4,5})(\\d{5})", "$1 $2 $3", ["[1-35]"]]], 0, 0, 0, 0, 0, 0, [0, ["342\\d{4}|(?:337|49)\\d{6}|(?:3(?:2|47|7\\d{3})|5(?:0\\d{3}|2[0-2]))\\d{7}", [7, 8, 9, 10, 12]], 0, 0, 0, ["348[57]\\d{7}", [11]], 0, 0, ["1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:345\\d|9[89])\\d{6}|(?:10|2(?:3|85\\d)|3(?:[15]|[69]\\d\\d)|4[15-8]|51)\\d{8}"]]], "883": ["883", 0, "(?:[1-4]\\d|51)\\d{6,10}", [8, 9, 10, 11, 12], [["(\\d{3})(\\d{3})(\\d{2,8})", "$1 $2 $3", ["[14]|2[24-689]|3[02-689]|51[24-9]"]], ["(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3", ["510"]], ["(\\d{3})(\\d{3})(\\d{4})", "$1 $2 $3", ["21"]], ["(\\d{4})(\\d{4})(\\d{4})", "$1 $2 $3", ["51[13]"]], ["(\\d{3})(\\d{3})(\\d{3})(\\d{3})", "$1 $2 $3 $4", ["[235]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, 0, 0, ["(?:2(?:00\\d\\d|10)|(?:370[1-9]|51\\d0)\\d)\\d{7}|51(?:00\\d{5}|[24-9]0\\d{4,7})|(?:1[0-79]|2[24-689]|3[02-689]|4[0-4])0\\d{5,9}"]]], "888": ["888", 0, "\\d{11}", [11], [["(\\d{3})(\\d{3})(\\d{5})", "$1 $2 $3"]], 0, 0, 0, 0, 0, 0, [0, 0, 0, 0, 0, 0, ["\\d{11}"]]], "979": ["979", 0, "[1359]\\d{8}", [9], [["(\\d)(\\d{4})(\\d{4})", "$1 $2 $3", ["[1359]"]]], 0, 0, 0, 0, 0, 0, [0, 0, 0, ["[1359]\\d{8}"]]] } };
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/withMetadataArgument.js
function withMetadataArgument(func, _arguments) {
  var args = Array.prototype.slice.call(_arguments);
  args.push(metadata_min_json_default);
  return func.apply(this, args);
}
var init_withMetadataArgument = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/withMetadataArgument.js"() {
    "use strict";
    init_metadata_min_json();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/tools/semver-compare.js
function semver_compare_default(a, b) {
  a = a.split("-");
  b = b.split("-");
  var pa = a[0].split(".");
  var pb = b[0].split(".");
  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }
  if (a[1] && b[1]) {
    return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
  }
  return !a[1] && b[1] ? 1 : a[1] && !b[1] ? -1 : 0;
}
var init_semver_compare = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/tools/semver-compare.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isObject.js
function isObject(object) {
  return object !== void 0 && object !== null && object.constructor === objectConstructor;
}
var objectConstructor;
var init_isObject = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isObject.js"() {
    "use strict";
    objectConstructor = {}.constructor;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isCallingCode.js
function isCallingCode(string) {
  return CALLING_CODE_REG_EXP.test(string);
}
var CALLING_CODE_REG_EXP;
var init_isCallingCode = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isCallingCode.js"() {
    "use strict";
    CALLING_CODE_REG_EXP = /^\d+$/;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/metadata.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function getType(types, type) {
  switch (type) {
    case "FIXED_LINE":
      return types[0];
    case "MOBILE":
      return types[1];
    case "TOLL_FREE":
      return types[2];
    case "PREMIUM_RATE":
      return types[3];
    case "PERSONAL_NUMBER":
      return types[4];
    case "VOICEMAIL":
      return types[5];
    case "UAN":
      return types[6];
    case "PAGER":
      return types[7];
    case "VOIP":
      return types[8];
    case "SHARED_COST":
      return types[9];
  }
}
function validateMetadata(metadata) {
  if (!metadata) {
    throw new Error("[libphonenumber-js] `metadata` argument not passed. Check your arguments.");
  }
  if (!isObject(metadata) || !isObject(metadata.countries)) {
    throw new Error("[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(isObject(metadata) ? "an object of shape: { " + Object.keys(metadata).join(", ") + " }" : "a " + typeOf(metadata) + ": " + metadata, "."));
  }
}
function getCountryCallingCode(country, metadataJson) {
  var metadata = new Metadata(metadataJson);
  if (metadata.hasCountry(country)) {
    return metadata.selectNumberingPlan(country).countryCallingCode();
  }
  throw new Error("Unknown country: ".concat(country));
}
function isSupportedCountry(country, metadataJson) {
  return metadataJson.countries.hasOwnProperty(country);
}
function setVersion(metadata) {
  var version = metadata.version;
  if (typeof version === "number") {
    this.v1 = version === 1;
    this.v2 = version === 2;
    this.v3 = version === 3;
    this.v4 = version === 4;
  } else {
    if (!version) {
      this.v1 = true;
    } else if (semver_compare_default(version, V3) === -1) {
      this.v2 = true;
    } else if (semver_compare_default(version, V4) === -1) {
      this.v3 = true;
    } else {
      this.v4 = true;
    }
  }
}
var V3, V4, DEFAULT_EXT_PREFIX, Metadata, NumberingPlan, Format, FIRST_GROUP_ONLY_PREFIX_PATTERN, Type, typeOf;
var init_metadata = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/metadata.js"() {
    "use strict";
    init_semver_compare();
    init_isObject();
    init_isCallingCode();
    V3 = "1.2.0";
    V4 = "1.7.35";
    DEFAULT_EXT_PREFIX = " ext. ";
    Metadata = /* @__PURE__ */ (function() {
      function Metadata2(metadata) {
        _classCallCheck(this, Metadata2);
        validateMetadata(metadata);
        this.metadata = metadata;
        setVersion.call(this, metadata);
      }
      return _createClass(Metadata2, [{
        key: "getCountries",
        value: function getCountries() {
          return Object.keys(this.metadata.countries).filter(function(_) {
            return _ !== "001";
          });
        }
      }, {
        key: "getCountryMetadata",
        value: function getCountryMetadata(countryCode) {
          return this.metadata.countries[countryCode];
        }
      }, {
        key: "nonGeographic",
        value: function nonGeographic() {
          if (this.v1 || this.v2 || this.v3) return;
          return this.metadata.nonGeographic || this.metadata.nonGeographical;
        }
      }, {
        key: "hasCountry",
        value: function hasCountry(country) {
          return this.getCountryMetadata(country) !== void 0;
        }
      }, {
        key: "hasCallingCode",
        value: function hasCallingCode(callingCode) {
          if (this.getCountryCodesForCallingCode(callingCode)) {
            return true;
          }
          if (this.nonGeographic()) {
            if (this.nonGeographic()[callingCode]) {
              return true;
            }
          } else {
            var countryCodes = this.countryCallingCodes()[callingCode];
            if (countryCodes && countryCodes.length === 1 && countryCodes[0] === "001") {
              return true;
            }
          }
        }
      }, {
        key: "isNonGeographicCallingCode",
        value: function isNonGeographicCallingCode(callingCode) {
          if (this.nonGeographic()) {
            return this.nonGeographic()[callingCode] ? true : false;
          } else {
            return this.getCountryCodesForCallingCode(callingCode) ? false : true;
          }
        }
        // Deprecated.
      }, {
        key: "country",
        value: function country(countryCode) {
          return this.selectNumberingPlan(countryCode);
        }
        /**
         * Selects a telephone numbering plan based on either a country code or a calling code.
         * @param {string} argument — Country code or calling code.
         * @param {string} legacyArgumentCallingCode — Legacy argument: calling code, if the first argument is not passed.
         */
      }, {
        key: "selectNumberingPlan",
        value: function selectNumberingPlan(argument, legacyArgumentCallingCode) {
          var countryCode;
          var callingCode;
          if (argument) {
            if (isCallingCode(argument)) {
              callingCode = argument;
            } else {
              countryCode = argument;
            }
          }
          if (legacyArgumentCallingCode) {
            callingCode = legacyArgumentCallingCode;
          }
          if (countryCode && countryCode !== "001") {
            var countryMetadata = this.getCountryMetadata(countryCode);
            if (!countryMetadata) {
              throw new Error("Unknown country: ".concat(countryCode));
            }
            this.numberingPlan = new NumberingPlan(countryMetadata, this);
          } else if (callingCode) {
            if (!this.hasCallingCode(callingCode)) {
              throw new Error("Unknown calling code: ".concat(callingCode));
            }
            this.numberingPlan = new NumberingPlan(this.getNumberingPlanMetadata(callingCode), this);
          } else {
            this.numberingPlan = void 0;
          }
          return this;
        }
      }, {
        key: "getCountryCodesForCallingCode",
        value: function getCountryCodesForCallingCode(callingCode) {
          var countryCodes = this.countryCallingCodes()[callingCode];
          if (countryCodes) {
            if (countryCodes.length === 1 && countryCodes[0].length === 3) {
              return;
            }
            return countryCodes;
          }
        }
      }, {
        key: "getCountryCodeForCallingCode",
        value: function getCountryCodeForCallingCode(callingCode) {
          var countryCodes = this.getCountryCodesForCallingCode(callingCode);
          if (countryCodes) {
            return countryCodes[0];
          }
        }
      }, {
        key: "getNumberingPlanMetadata",
        value: function getNumberingPlanMetadata(callingCode) {
          var countryCode = this.getCountryCodeForCallingCode(callingCode);
          if (countryCode) {
            return this.getCountryMetadata(countryCode);
          }
          if (this.nonGeographic()) {
            var metadata = this.nonGeographic()[callingCode];
            if (metadata) {
              return metadata;
            }
          } else {
            var countryCodes = this.countryCallingCodes()[callingCode];
            if (countryCodes && countryCodes.length === 1 && countryCodes[0] === "001") {
              return this.metadata.countries["001"];
            }
          }
        }
        // Deprecated.
      }, {
        key: "countryCallingCode",
        value: function countryCallingCode() {
          return this.numberingPlan.callingCode();
        }
        // Deprecated.
      }, {
        key: "IDDPrefix",
        value: function IDDPrefix() {
          return this.numberingPlan.IDDPrefix();
        }
        // Deprecated.
      }, {
        key: "defaultIDDPrefix",
        value: function defaultIDDPrefix() {
          return this.numberingPlan.defaultIDDPrefix();
        }
        // Deprecated.
      }, {
        key: "nationalNumberPattern",
        value: function nationalNumberPattern() {
          return this.numberingPlan.nationalNumberPattern();
        }
        // Deprecated.
      }, {
        key: "possibleLengths",
        value: function possibleLengths() {
          return this.numberingPlan.possibleLengths();
        }
        // Deprecated.
      }, {
        key: "formats",
        value: function formats() {
          return this.numberingPlan.formats();
        }
        // Deprecated.
      }, {
        key: "nationalPrefixForParsing",
        value: function nationalPrefixForParsing() {
          return this.numberingPlan.nationalPrefixForParsing();
        }
        // Deprecated.
      }, {
        key: "nationalPrefixTransformRule",
        value: function nationalPrefixTransformRule() {
          return this.numberingPlan.nationalPrefixTransformRule();
        }
        // Deprecated.
      }, {
        key: "leadingDigits",
        value: function leadingDigits() {
          return this.numberingPlan.leadingDigits();
        }
        // Deprecated.
      }, {
        key: "hasTypes",
        value: function hasTypes() {
          return this.numberingPlan.hasTypes();
        }
        // Deprecated.
      }, {
        key: "type",
        value: function type(_type) {
          return this.numberingPlan.type(_type);
        }
        // Deprecated.
      }, {
        key: "ext",
        value: function ext() {
          return this.numberingPlan.ext();
        }
      }, {
        key: "countryCallingCodes",
        value: function countryCallingCodes() {
          if (this.v1) return this.metadata.country_phone_code_to_countries;
          return this.metadata.country_calling_codes;
        }
        // Deprecated.
      }, {
        key: "chooseCountryByCountryCallingCode",
        value: function chooseCountryByCountryCallingCode(callingCode) {
          return this.selectNumberingPlan(callingCode);
        }
      }, {
        key: "hasSelectedNumberingPlan",
        value: function hasSelectedNumberingPlan() {
          return this.numberingPlan !== void 0;
        }
      }]);
    })();
    NumberingPlan = /* @__PURE__ */ (function() {
      function NumberingPlan2(metadata, globalMetadataObject) {
        _classCallCheck(this, NumberingPlan2);
        this.globalMetadataObject = globalMetadataObject;
        this.metadata = metadata;
        setVersion.call(this, globalMetadataObject.metadata);
      }
      return _createClass(NumberingPlan2, [{
        key: "callingCode",
        value: function callingCode() {
          return this.metadata[0];
        }
        // When multiple countries share the same calling code,
        // all phone number formatting rules are included in the metadata
        // of the "default" country for that calling code.
        // Any other countries' metdata doesn't include any formatting rules.
        // Google developers said that such storage architecture was chosen for performance reasons.
        //
        // For example, for NANPA region ("North American Numbering Plan Administration",
        // which includes USA, Canada, Cayman Islands, Bahamas, etc) all formatting rules
        // are contained in the metadata of `US` country.
        //
        // This is not public API.
        //
      }, {
        key: "_getDefaultCountryMetadataForThisCallingCode",
        value: function _getDefaultCountryMetadataForThisCallingCode() {
          return this.globalMetadataObject.getNumberingPlanMetadata(this.callingCode());
        }
        // Deprecated.
      }, {
        key: "getDefaultCountryMetadataForRegion",
        value: function getDefaultCountryMetadataForRegion() {
          return this._getDefaultCountryMetadataForThisCallingCode();
        }
        // Is always present.
      }, {
        key: "IDDPrefix",
        value: function IDDPrefix() {
          if (this.v1 || this.v2) return;
          return this.metadata[1];
        }
        // Is only present when a country supports multiple IDD prefixes.
      }, {
        key: "defaultIDDPrefix",
        value: function defaultIDDPrefix() {
          if (this.v1 || this.v2) return;
          return this.metadata[12];
        }
      }, {
        key: "nationalNumberPattern",
        value: function nationalNumberPattern() {
          if (this.v1 || this.v2) return this.metadata[1];
          return this.metadata[2];
        }
        // "possible length" data is always present in Google's metadata.
      }, {
        key: "possibleLengths",
        value: function possibleLengths() {
          if (this.v1) return;
          return this.metadata[this.v2 ? 2 : 3];
        }
      }, {
        key: "_getFormats",
        value: function _getFormats(metadata) {
          return metadata[this.v1 ? 2 : this.v2 ? 3 : 4];
        }
        // For countries of the same region (e.g. NANPA)
        // formats are all stored in the "main" country for that region.
        // E.g. "RU" and "KZ", "US" and "CA".
      }, {
        key: "formats",
        value: function formats() {
          var _this = this;
          var formats2 = this._getFormats(this.metadata) || this._getFormats(this._getDefaultCountryMetadataForThisCallingCode()) || [];
          return formats2.map(function(_) {
            return new Format(_, _this);
          });
        }
      }, {
        key: "nationalPrefix",
        value: function nationalPrefix() {
          return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
        }
      }, {
        key: "_getNationalPrefixFormattingRule",
        value: function _getNationalPrefixFormattingRule(metadata) {
          return metadata[this.v1 ? 4 : this.v2 ? 5 : 6];
        }
        // For countries of the same region (e.g. NANPA)
        // national prefix formatting rule is stored in the "main" country for that region.
        // E.g. "RU" and "KZ", "US" and "CA".
      }, {
        key: "nationalPrefixFormattingRule",
        value: function nationalPrefixFormattingRule() {
          return this._getNationalPrefixFormattingRule(this.metadata) || this._getNationalPrefixFormattingRule(this._getDefaultCountryMetadataForThisCallingCode());
        }
      }, {
        key: "_nationalPrefixForParsing",
        value: function _nationalPrefixForParsing() {
          return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7];
        }
      }, {
        key: "nationalPrefixForParsing",
        value: function nationalPrefixForParsing() {
          return this._nationalPrefixForParsing() || this.nationalPrefix();
        }
      }, {
        key: "nationalPrefixTransformRule",
        value: function nationalPrefixTransformRule() {
          return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
        }
      }, {
        key: "_getNationalPrefixIsOptionalWhenFormatting",
        value: function _getNationalPrefixIsOptionalWhenFormatting() {
          return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
        }
        // For countries of the same region (e.g. NANPA)
        // "national prefix is optional when formatting" flag is
        // stored in the "main" country for that region.
        // E.g. "RU" and "KZ", "US" and "CA".
      }, {
        key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
        value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
          return this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this._getDefaultCountryMetadataForThisCallingCode());
        }
      }, {
        key: "leadingDigits",
        value: function leadingDigits() {
          return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
        }
      }, {
        key: "types",
        value: function types() {
          return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
        }
      }, {
        key: "hasTypes",
        value: function hasTypes() {
          if (this.types() && this.types().length === 0) {
            return false;
          }
          return !!this.types();
        }
      }, {
        key: "type",
        value: function type(_type2) {
          if (this.hasTypes() && getType(this.types(), _type2)) {
            return new Type(getType(this.types(), _type2), this);
          }
        }
      }, {
        key: "ext",
        value: function ext() {
          if (this.v1 || this.v2) return DEFAULT_EXT_PREFIX;
          return this.metadata[13] || DEFAULT_EXT_PREFIX;
        }
      }]);
    })();
    Format = /* @__PURE__ */ (function() {
      function Format2(format, metadata) {
        _classCallCheck(this, Format2);
        this._format = format;
        this.metadata = metadata;
      }
      return _createClass(Format2, [{
        key: "pattern",
        value: function pattern() {
          return this._format[0];
        }
      }, {
        key: "format",
        value: function format() {
          return this._format[1];
        }
      }, {
        key: "leadingDigitsPatterns",
        value: function leadingDigitsPatterns() {
          return this._format[2] || [];
        }
      }, {
        key: "nationalPrefixFormattingRule",
        value: function nationalPrefixFormattingRule() {
          return this._format[3] || this.metadata.nationalPrefixFormattingRule();
        }
      }, {
        key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
        value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
          return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
        }
      }, {
        key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
        value: function nationalPrefixIsMandatoryWhenFormattingInNationalFormat() {
          return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
        }
        // Checks whether national prefix formatting rule contains national prefix.
      }, {
        key: "usesNationalPrefix",
        value: function usesNationalPrefix() {
          return this.nationalPrefixFormattingRule() && // Check that national prefix formatting rule is not a "dummy" one.
          !FIRST_GROUP_ONLY_PREFIX_PATTERN.test(this.nationalPrefixFormattingRule()) ? true : false;
        }
      }, {
        key: "internationalFormat",
        value: function internationalFormat() {
          return this._format[5] || this.format();
        }
      }]);
    })();
    FIRST_GROUP_ONLY_PREFIX_PATTERN = /^\(?\$1\)?$/;
    Type = /* @__PURE__ */ (function() {
      function Type2(type, metadata) {
        _classCallCheck(this, Type2);
        this.type = type;
        this.metadata = metadata;
      }
      return _createClass(Type2, [{
        key: "pattern",
        value: function pattern() {
          if (this.metadata.v1) return this.type;
          return this.type[0];
        }
      }, {
        key: "possibleLengths",
        value: function possibleLengths() {
          if (this.metadata.v1) return;
          return this.type[1] || this.metadata.possibleLengths();
        }
      }]);
    })();
    typeOf = function typeOf2(_) {
      return _typeof(_);
    };
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/mergeArrays.js
function _createForOfIteratorHelperLoose(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? { done: true } : { done: false, value: r[o++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}
function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function mergeArrays(a, b) {
  var merged = a.slice();
  for (var _iterator = _createForOfIteratorHelperLoose(b), _step; !(_step = _iterator()).done; ) {
    var element = _step.value;
    if (a.indexOf(element) < 0) {
      merged.push(element);
    }
  }
  return merged.sort(function(a2, b2) {
    return a2 - b2;
  });
}
var init_mergeArrays = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/mergeArrays.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/checkNumberLength.js
function checkNumberLength(nationalNumber, country, metadata) {
  return checkNumberLengthForType(nationalNumber, void 0, country, metadata);
}
function checkNumberLengthForType(nationalNumber, type, country, metadata) {
  if (country) {
    metadata = new Metadata(metadata.metadata);
    metadata.selectNumberingPlan(country);
  }
  var type_info = metadata.type(type);
  var possible_lengths = type_info && type_info.possibleLengths() || metadata.possibleLengths();
  if (!possible_lengths) {
    return "IS_POSSIBLE";
  }
  if (type === "FIXED_LINE_OR_MOBILE") {
    if (!metadata.type("FIXED_LINE")) {
      return checkNumberLengthForType(nationalNumber, "MOBILE", country, metadata);
    }
    var mobile_type = metadata.type("MOBILE");
    if (mobile_type) {
      possible_lengths = mergeArrays(possible_lengths, mobile_type.possibleLengths());
    }
  } else if (type && !type_info) {
    return "INVALID_LENGTH";
  }
  var actual_length = nationalNumber.length;
  var minimum_length = possible_lengths[0];
  if (minimum_length === actual_length) {
    return "IS_POSSIBLE";
  }
  if (minimum_length > actual_length) {
    return "TOO_SHORT";
  }
  if (possible_lengths[possible_lengths.length - 1] < actual_length) {
    return "TOO_LONG";
  }
  return possible_lengths.indexOf(actual_length, 1) >= 0 ? "IS_POSSIBLE" : "INVALID_LENGTH";
}
var init_checkNumberLength = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/checkNumberLength.js"() {
    "use strict";
    init_metadata();
    init_mergeArrays();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isPossible.js
function isPossiblePhoneNumber(input, options, metadataJson) {
  if (options === void 0) {
    options = {};
  }
  var metadata = new Metadata(metadataJson);
  if (options.v2) {
    if (!input.countryCallingCode) {
      throw new Error("Invalid phone number object passed");
    }
    metadata.selectNumberingPlan(input.country || input.countryCallingCode);
  } else {
    if (!input.phone) {
      return false;
    }
    if (input.country) {
      if (!metadata.hasCountry(input.country)) {
        throw new Error("Unknown country: ".concat(input.country));
      }
      metadata.selectNumberingPlan(input.country);
    } else {
      if (!input.countryCallingCode) {
        throw new Error("Invalid phone number object passed");
      }
      metadata.selectNumberingPlan(input.countryCallingCode);
    }
  }
  if (metadata.possibleLengths()) {
    return isPossibleNumber(input.phone || input.nationalNumber, metadata);
  }
  if (input.countryCallingCode && metadata.isNonGeographicCallingCode(input.countryCallingCode)) {
    return true;
  }
  throw new Error('Missing "possibleLengths" in metadata. Perhaps the metadata has been generated before v1.0.18.');
}
function isPossibleNumber(nationalNumber, metadata) {
  switch (checkNumberLength(nationalNumber, void 0, metadata)) {
    case "IS_POSSIBLE":
      return true;
    // This library ignores "local-only" phone numbers (for simplicity).
    // See the readme for more info on what are "local-only" phone numbers.
    // case 'IS_POSSIBLE_LOCAL_ONLY':
    // 	return !isInternational
    default:
      return false;
  }
}
var init_isPossible = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isPossible.js"() {
    "use strict";
    init_metadata();
    init_checkNumberLength();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/matchesEntirely.js
function matchesEntirely(text, regularExpressionText) {
  text = text || "";
  return new RegExp("^(?:" + regularExpressionText + ")$").test(text);
}
var init_matchesEntirely = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/matchesEntirely.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getNumberType.js
function _createForOfIteratorHelperLoose2(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray2(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? { done: true } : { done: false, value: r[o++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray2(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray2(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray2(r, a) : void 0;
  }
}
function _arrayLikeToArray2(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function getNumberType(input, options, metadataJson) {
  options = options || {};
  if (!input.country && !input.countryCallingCode) {
    return;
  }
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(input.country || input.countryCallingCode);
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  if (!matchesEntirely(nationalNumber, metadata.nationalNumberPattern())) {
    return;
  }
  if (isNumberTypeEqualTo(nationalNumber, "FIXED_LINE", metadata)) {
    if (metadata.type("MOBILE") && metadata.type("MOBILE").pattern() === "") {
      return "FIXED_LINE_OR_MOBILE";
    }
    if (!metadata.type("MOBILE")) {
      return "FIXED_LINE_OR_MOBILE";
    }
    if (isNumberTypeEqualTo(nationalNumber, "MOBILE", metadata)) {
      return "FIXED_LINE_OR_MOBILE";
    }
    return "FIXED_LINE";
  }
  for (var _iterator = _createForOfIteratorHelperLoose2(NON_FIXED_LINE_PHONE_TYPES), _step; !(_step = _iterator()).done; ) {
    var type = _step.value;
    if (isNumberTypeEqualTo(nationalNumber, type, metadata)) {
      return type;
    }
  }
}
function isNumberTypeEqualTo(nationalNumber, type, metadata) {
  var typeDefinition = metadata.type(type);
  if (!typeDefinition || !typeDefinition.pattern()) {
    return false;
  }
  if (typeDefinition.possibleLengths() && typeDefinition.possibleLengths().indexOf(nationalNumber.length) < 0) {
    return false;
  }
  return matchesEntirely(nationalNumber, typeDefinition.pattern());
}
var NON_FIXED_LINE_PHONE_TYPES;
var init_getNumberType = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getNumberType.js"() {
    "use strict";
    init_metadata();
    init_matchesEntirely();
    NON_FIXED_LINE_PHONE_TYPES = ["MOBILE", "PREMIUM_RATE", "TOLL_FREE", "SHARED_COST", "VOIP", "PERSONAL_NUMBER", "PAGER", "UAN", "VOICEMAIL"];
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isValid.js
function isValidNumber(input, options, metadataJson) {
  options = options || {};
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(input.country || input.countryCallingCode);
  if (metadata.hasTypes()) {
    return getNumberType(input, options, metadata.metadata) !== void 0;
  }
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  return matchesEntirely(nationalNumber, metadata.nationalNumberPattern());
}
var init_isValid = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isValid.js"() {
    "use strict";
    init_metadata();
    init_matchesEntirely();
    init_getNumberType();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isCountryCode.js
function isCountryCode(string) {
  return COUNTRY_CODE_REG_EXP.test(string);
}
var COUNTRY_CODE_REG_EXP;
var init_isCountryCode = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isCountryCode.js"() {
    "use strict";
    COUNTRY_CODE_REG_EXP = /^[A-Z]{2}$/;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryAndCallingCodeFromOneOfThem.js
function getCountryAndCallingCodeFromOneOfThem(countryOrCallingCode, metadataJson) {
  var country;
  var callingCode;
  var metadata = new Metadata(metadataJson);
  if (isCountryCode(countryOrCallingCode)) {
    country = countryOrCallingCode;
    metadata.selectNumberingPlan(country);
    callingCode = metadata.countryCallingCode();
  } else {
    callingCode = countryOrCallingCode;
    if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
      if (metadata.isNonGeographicCallingCode(callingCode)) {
        country = "001";
      }
    }
  }
  return {
    country,
    callingCode
  };
}
var USE_NON_GEOGRAPHIC_COUNTRY_CODE;
var init_getCountryAndCallingCodeFromOneOfThem = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryAndCallingCodeFromOneOfThem.js"() {
    "use strict";
    init_metadata();
    init_isCountryCode();
    USE_NON_GEOGRAPHIC_COUNTRY_CODE = false;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getPossibleCountriesForNumber.js
function getPossibleCountriesForNumber(callingCode, nationalNumber, metadata) {
  var _metadata = new Metadata(metadata);
  var possibleCountries = _metadata.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return [];
  }
  return possibleCountries.filter(function(country) {
    return couldNationalNumberBelongToCountry(nationalNumber, country, metadata);
  });
}
function couldNationalNumberBelongToCountry(nationalNumber, country, metadataJson) {
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(country);
  return metadata.numberingPlan.possibleLengths().indexOf(nationalNumber.length) >= 0;
}
var init_getPossibleCountriesForNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getPossibleCountriesForNumber.js"() {
    "use strict";
    init_metadata();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/constants.js
var MIN_LENGTH_FOR_NSN, MAX_LENGTH_FOR_NSN, MAX_LENGTH_COUNTRY_CODE, VALID_DIGITS, DASHES, SLASHES, DOTS, WHITESPACE, BRACKETS, TILDES, VALID_PUNCTUATION, PLUS_CHARS;
var init_constants = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/constants.js"() {
    "use strict";
    MIN_LENGTH_FOR_NSN = 2;
    MAX_LENGTH_FOR_NSN = 17;
    MAX_LENGTH_COUNTRY_CODE = 3;
    VALID_DIGITS = "0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9";
    DASHES = "-\u2010-\u2015\u2212\u30FC\uFF0D";
    SLASHES = "\uFF0F/";
    DOTS = "\uFF0E.";
    WHITESPACE = " \xA0\xAD\u200B\u2060\u3000";
    BRACKETS = "()\uFF08\uFF09\uFF3B\uFF3D\\[\\]";
    TILDES = "~\u2053\u223C\uFF5E";
    VALID_PUNCTUATION = "".concat(DASHES).concat(SLASHES).concat(DOTS).concat(WHITESPACE).concat(BRACKETS).concat(TILDES);
    PLUS_CHARS = "+\uFF0B";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/stripIddPrefix.js
function stripIddPrefix(number, country, callingCode, metadataJson) {
  if (!country) {
    return;
  }
  var metadata = new Metadata(metadataJson);
  metadata.selectNumberingPlan(country || callingCode);
  var IDDPrefixPattern = new RegExp(metadata.IDDPrefix());
  if (number.search(IDDPrefixPattern) !== 0) {
    return;
  }
  number = number.slice(number.match(IDDPrefixPattern)[0].length);
  var matchedGroups = number.match(CAPTURING_DIGIT_PATTERN);
  if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
    if (matchedGroups[1] === "0") {
      return;
    }
  }
  return number;
}
var CAPTURING_DIGIT_PATTERN;
var init_stripIddPrefix = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/stripIddPrefix.js"() {
    "use strict";
    init_metadata();
    init_constants();
    CAPTURING_DIGIT_PATTERN = new RegExp("([" + VALID_DIGITS + "])");
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractNationalNumberFromPossiblyIncompleteNumber.js
function extractNationalNumberFromPossiblyIncompleteNumber(number, metadata) {
  if (number && metadata.numberingPlan.nationalPrefixForParsing()) {
    var prefixPattern = new RegExp("^(?:" + metadata.numberingPlan.nationalPrefixForParsing() + ")");
    var prefixMatch = prefixPattern.exec(number);
    if (prefixMatch) {
      var nationalNumber;
      var carrierCode;
      var capturedGroupsCount = prefixMatch.length - 1;
      var hasCapturedGroups = capturedGroupsCount > 0 && prefixMatch[capturedGroupsCount];
      if (metadata.nationalPrefixTransformRule() && hasCapturedGroups) {
        nationalNumber = number.replace(prefixPattern, metadata.nationalPrefixTransformRule());
        if (capturedGroupsCount > 1) {
          carrierCode = prefixMatch[1];
        }
      } else {
        var prefixBeforeNationalNumber = prefixMatch[0];
        nationalNumber = number.slice(prefixBeforeNationalNumber.length);
        if (hasCapturedGroups) {
          carrierCode = prefixMatch[1];
        }
      }
      var nationalPrefix;
      if (hasCapturedGroups) {
        var possiblePositionOfTheFirstCapturedGroup = number.indexOf(prefixMatch[1]);
        var possibleNationalPrefix = number.slice(0, possiblePositionOfTheFirstCapturedGroup);
        if (possibleNationalPrefix === metadata.numberingPlan.nationalPrefix()) {
          nationalPrefix = metadata.numberingPlan.nationalPrefix();
        }
      } else {
        nationalPrefix = prefixMatch[0];
      }
      return {
        nationalNumber,
        nationalPrefix,
        carrierCode
      };
    }
  }
  return {
    nationalNumber: number
  };
}
var init_extractNationalNumberFromPossiblyIncompleteNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractNationalNumberFromPossiblyIncompleteNumber.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryByNationalNumber.js
function _createForOfIteratorHelperLoose3(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray3(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? { done: true } : { done: false, value: r[o++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray3(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray3(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray3(r, a) : void 0;
  }
}
function _arrayLikeToArray3(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function getCountryByNationalNumber(nationalNumber, countries, metadataJson) {
  var metadata = new Metadata(metadataJson);
  for (var _iterator = _createForOfIteratorHelperLoose3(countries), _step; !(_step = _iterator()).done; ) {
    var country = _step.value;
    metadata.selectNumberingPlan(country);
    if (metadata.leadingDigits()) {
      if (nationalNumber && nationalNumber.search(metadata.leadingDigits()) === 0) {
        return country;
      }
    } else if (getNumberType({
      phone: nationalNumber,
      country
    }, void 0, metadata.metadata)) {
      return country;
    }
  }
}
var init_getCountryByNationalNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryByNationalNumber.js"() {
    "use strict";
    init_metadata();
    init_getNumberType();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryByCallingCode.js
function getCountryByCallingCode(callingCode, _ref) {
  var nationalNumber = _ref.nationalNumber, metadata = _ref.metadata;
  if (USE_NON_GEOGRAPHIC_COUNTRY_CODE2) {
    if (metadata.isNonGeographicCallingCode(callingCode)) {
      return "001";
    }
  }
  var possibleCountries = metadata.getCountryCodesForCallingCode(callingCode);
  if (!possibleCountries) {
    return;
  }
  if (possibleCountries.length === 1) {
    return possibleCountries[0];
  }
  return getCountryByNationalNumber(nationalNumber, possibleCountries, metadata.metadata);
}
var USE_NON_GEOGRAPHIC_COUNTRY_CODE2;
var init_getCountryByCallingCode = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getCountryByCallingCode.js"() {
    "use strict";
    init_getCountryByNationalNumber();
    USE_NON_GEOGRAPHIC_COUNTRY_CODE2 = false;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractNationalNumber.js
function extractNationalNumber(number, country, metadata) {
  var _extractNationalNumbe = extractNationalNumberFromPossiblyIncompleteNumber(number, metadata), carrierCode = _extractNationalNumbe.carrierCode, nationalNumber = _extractNationalNumbe.nationalNumber;
  if (nationalNumber !== number) {
    if (!shouldHaveExtractedNationalPrefix(number, nationalNumber, metadata)) {
      return {
        nationalNumber: number
      };
    }
    if (metadata.numberingPlan.possibleLengths()) {
      if (!country) {
        country = getCountryByCallingCode(metadata.numberingPlan.callingCode(), {
          nationalNumber,
          metadata
        });
      }
      if (!isPossibleIncompleteNationalNumber(nationalNumber, country, metadata)) {
        return {
          nationalNumber: number
        };
      }
    }
  }
  return {
    nationalNumber,
    carrierCode
  };
}
function shouldHaveExtractedNationalPrefix(nationalNumberBefore, nationalNumberAfter, metadata) {
  if (matchesEntirely(nationalNumberBefore, metadata.nationalNumberPattern()) && !matchesEntirely(nationalNumberAfter, metadata.nationalNumberPattern())) {
    return false;
  }
  return true;
}
function isPossibleIncompleteNationalNumber(nationalNumber, country, metadata) {
  switch (checkNumberLength(nationalNumber, country, metadata)) {
    case "TOO_SHORT":
    case "INVALID_LENGTH":
      return false;
    default:
      return true;
  }
}
var init_extractNationalNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractNationalNumber.js"() {
    "use strict";
    init_extractNationalNumberFromPossiblyIncompleteNumber();
    init_matchesEntirely();
    init_checkNumberLength();
    init_getCountryByCallingCode();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/getCountryCallingCode.js
var init_getCountryCallingCode = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/getCountryCallingCode.js"() {
    "use strict";
    init_metadata();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign.js
function extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, defaultCountry, defaultCallingCode, metadataJson) {
  if (!(country || defaultCountry || defaultCallingCode)) {
    return {
      number
    };
  }
  var countryCallingCode = country || defaultCountry ? getCountryCallingCode(country || defaultCountry, metadataJson) : defaultCallingCode;
  if (number.indexOf(countryCallingCode) === 0) {
    var metadata = new Metadata(metadataJson);
    metadata.selectNumberingPlan(country || defaultCountry || defaultCallingCode);
    var possibleShorterNumber = number.slice(countryCallingCode.length);
    var _extractNationalNumbe = extractNationalNumber(possibleShorterNumber, void 0, metadata), possibleShorterNationalNumber = _extractNationalNumbe.nationalNumber;
    var _extractNationalNumbe2 = extractNationalNumber(number, void 0, metadata), nationalNumber = _extractNationalNumbe2.nationalNumber;
    if (!matchesEntirely(nationalNumber, metadata.nationalNumberPattern()) && matchesEntirely(possibleShorterNationalNumber, metadata.nationalNumberPattern()) || checkNumberLength(nationalNumber, void 0, metadata) === "TOO_LONG") {
      return {
        countryCallingCode,
        number: possibleShorterNumber
      };
    }
  }
  return {
    number
  };
}
var init_extractCountryCallingCodeFromInternationalNumberWithoutPlusSign = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign.js"() {
    "use strict";
    init_metadata();
    init_matchesEntirely();
    init_extractNationalNumber();
    init_checkNumberLength();
    init_getCountryCallingCode();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractCountryCallingCode.js
function extractCountryCallingCode(number, country, defaultCountry, defaultCallingCode, metadataJson) {
  if (!number) {
    return {};
  }
  var isNumberWithIddPrefix;
  if (number[0] !== "+") {
    var numberWithoutIDD = stripIddPrefix(number, country || defaultCountry, defaultCallingCode, metadataJson);
    if (numberWithoutIDD && numberWithoutIDD !== number) {
      isNumberWithIddPrefix = true;
      number = "+" + numberWithoutIDD;
    } else {
      if (country || defaultCountry || defaultCallingCode) {
        var _extractCountryCallin = extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, defaultCountry, defaultCallingCode, metadataJson), countryCallingCode = _extractCountryCallin.countryCallingCode, shorterNumber = _extractCountryCallin.number;
        if (countryCallingCode) {
          return {
            countryCallingCodeSource: "FROM_NUMBER_WITHOUT_PLUS_SIGN",
            countryCallingCode,
            number: shorterNumber
          };
        }
      }
      return {
        // No need to set it to `UNSPECIFIED`. It can be just `undefined`.
        // countryCallingCodeSource: 'UNSPECIFIED',
        number
      };
    }
  }
  if (number[1] === "0") {
    return {};
  }
  var metadata = new Metadata(metadataJson);
  var i = 2;
  while (i - 1 <= MAX_LENGTH_COUNTRY_CODE && i <= number.length) {
    var _countryCallingCode = number.slice(1, i);
    if (metadata.hasCallingCode(_countryCallingCode)) {
      metadata.selectNumberingPlan(_countryCallingCode);
      return {
        countryCallingCodeSource: isNumberWithIddPrefix ? "FROM_NUMBER_WITH_IDD" : "FROM_NUMBER_WITH_PLUS_SIGN",
        countryCallingCode: _countryCallingCode,
        number: number.slice(i)
      };
    }
    i++;
  }
  return {};
}
var init_extractCountryCallingCode = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractCountryCallingCode.js"() {
    "use strict";
    init_stripIddPrefix();
    init_extractCountryCallingCodeFromInternationalNumberWithoutPlusSign();
    init_metadata();
    init_constants();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/applyInternationalSeparatorStyle.js
function applyInternationalSeparatorStyle(formattedNumber) {
  return formattedNumber.replace(new RegExp("[".concat(VALID_PUNCTUATION, "]+"), "g"), " ").trim();
}
var init_applyInternationalSeparatorStyle = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/applyInternationalSeparatorStyle.js"() {
    "use strict";
    init_constants();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/formatNationalNumberUsingFormat.js
function formatNationalNumberUsingFormat(number, format, _ref) {
  var useInternationalFormat = _ref.useInternationalFormat, withNationalPrefix = _ref.withNationalPrefix, carrierCode = _ref.carrierCode, metadata = _ref.metadata;
  var formattedNumber = number.replace(new RegExp(format.pattern()), useInternationalFormat ? format.internationalFormat() : (
    // This library doesn't use `domestic_carrier_code_formatting_rule`,
    // because that one is only used when formatting phone numbers
    // for dialing from a mobile phone, and this is not a dialing library.
    // carrierCode && format.domesticCarrierCodeFormattingRule()
    // 	// First, replace the $CC in the formatting rule with the desired carrier code.
    // 	// Then, replace the $FG in the formatting rule with the first group
    // 	// and the carrier code combined in the appropriate way.
    // 	? format.format().replace(FIRST_GROUP_PATTERN, format.domesticCarrierCodeFormattingRule().replace('$CC', carrierCode))
    // 	: (
    // 		withNationalPrefix && format.nationalPrefixFormattingRule()
    // 			? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule())
    // 			: format.format()
    // 	)
    withNationalPrefix && format.nationalPrefixFormattingRule() ? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule()) : format.format()
  ));
  if (useInternationalFormat) {
    return applyInternationalSeparatorStyle(formattedNumber);
  }
  return formattedNumber;
}
var FIRST_GROUP_PATTERN;
var init_formatNationalNumberUsingFormat = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/formatNationalNumberUsingFormat.js"() {
    "use strict";
    init_applyInternationalSeparatorStyle();
    FIRST_GROUP_PATTERN = /(\$\d)/;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getIddPrefix.js
function getIddPrefix(country, callingCode, metadata) {
  var countryMetadata = new Metadata(metadata);
  countryMetadata.selectNumberingPlan(country || callingCode);
  if (countryMetadata.defaultIDDPrefix()) {
    return countryMetadata.defaultIDDPrefix();
  }
  if (SINGLE_IDD_PREFIX_REG_EXP.test(countryMetadata.IDDPrefix())) {
    return countryMetadata.IDDPrefix();
  }
}
var SINGLE_IDD_PREFIX_REG_EXP;
var init_getIddPrefix = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/getIddPrefix.js"() {
    "use strict";
    init_metadata();
    SINGLE_IDD_PREFIX_REG_EXP = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extension/createExtensionPattern.js
function createExtensionPattern(purpose) {
  var extLimitAfterExplicitLabel = "20";
  var extLimitAfterLikelyLabel = "15";
  var extLimitAfterAmbiguousChar = "9";
  var extLimitWhenNotSure = "6";
  var possibleSeparatorsBetweenNumberAndExtLabel = "[ \xA0\\t,]*";
  var possibleCharsAfterExtLabel = "[:\\.\uFF0E]?[ \xA0\\t,-]*";
  var optionalExtnSuffix = "#?";
  var explicitExtLabels = "(?:e?xt(?:ensi(?:o\u0301?|\xF3))?n?|\uFF45?\uFF58\uFF54\uFF4E?|\u0434\u043E\u0431|anexo)";
  var ambiguousExtLabels = "(?:[x\uFF58#\uFF03~\uFF5E]|int|\uFF49\uFF4E\uFF54)";
  var ambiguousSeparator = "[- ]+";
  var possibleSeparatorsNumberExtLabelNoComma = "[ \xA0\\t]*";
  var autoDiallingAndExtLabelsFound = "(?:,{2}|;)";
  var rfcExtn = RFC3966_EXTN_PREFIX + getExtensionDigitsPattern(extLimitAfterExplicitLabel);
  var explicitExtn = possibleSeparatorsBetweenNumberAndExtLabel + explicitExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterExplicitLabel) + optionalExtnSuffix;
  var ambiguousExtn = possibleSeparatorsBetweenNumberAndExtLabel + ambiguousExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix;
  var americanStyleExtnWithSuffix = ambiguousSeparator + getExtensionDigitsPattern(extLimitWhenNotSure) + "#";
  var autoDiallingExtn = possibleSeparatorsNumberExtLabelNoComma + autoDiallingAndExtLabelsFound + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterLikelyLabel) + optionalExtnSuffix;
  var onlyCommasExtn = possibleSeparatorsNumberExtLabelNoComma + "(?:,)+" + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix;
  return rfcExtn + "|" + explicitExtn + "|" + ambiguousExtn + "|" + americanStyleExtnWithSuffix + "|" + autoDiallingExtn + "|" + onlyCommasExtn;
}
var RFC3966_EXTN_PREFIX, getExtensionDigitsPattern;
var init_createExtensionPattern = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extension/createExtensionPattern.js"() {
    "use strict";
    init_constants();
    RFC3966_EXTN_PREFIX = ";ext=";
    getExtensionDigitsPattern = function getExtensionDigitsPattern2(maxLength) {
      return "([".concat(VALID_DIGITS, "]{1,").concat(maxLength, "})");
    };
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isViablePhoneNumber.js
function isViablePhoneNumber(number) {
  return number.length >= MIN_LENGTH_FOR_NSN && VALID_PHONE_NUMBER_PATTERN.test(number);
}
function isViablePhoneNumberStart(number) {
  return VALID_PHONE_NUMBER_START_REG_EXP.test(number);
}
var MIN_LENGTH_PHONE_NUMBER_PATTERN, VALID_PHONE_NUMBER, VALID_PHONE_NUMBER_START_REG_EXP, VALID_PHONE_NUMBER_WITH_EXTENSION, VALID_PHONE_NUMBER_PATTERN;
var init_isViablePhoneNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/isViablePhoneNumber.js"() {
    "use strict";
    init_constants();
    init_createExtensionPattern();
    MIN_LENGTH_PHONE_NUMBER_PATTERN = "[" + VALID_DIGITS + "]{" + MIN_LENGTH_FOR_NSN + "}";
    VALID_PHONE_NUMBER = "[" + PLUS_CHARS + "]{0,1}(?:[" + VALID_PUNCTUATION + "]*[" + VALID_DIGITS + "]){3,}[" + VALID_PUNCTUATION + VALID_DIGITS + "]*";
    VALID_PHONE_NUMBER_START_REG_EXP = new RegExp("^[" + PLUS_CHARS + "]{0,1}(?:[" + VALID_PUNCTUATION + "]*[" + VALID_DIGITS + "]){1,2}$", "i");
    VALID_PHONE_NUMBER_WITH_EXTENSION = VALID_PHONE_NUMBER + // Phone number extensions
    "(?:" + createExtensionPattern() + ")?";
    VALID_PHONE_NUMBER_PATTERN = new RegExp(
      // Either a short two-digit-only phone number
      "^" + MIN_LENGTH_PHONE_NUMBER_PATTERN + "$|^" + VALID_PHONE_NUMBER_WITH_EXTENSION + "$",
      "i"
    );
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/RFC3966.js
function formatRFC3966(_ref) {
  var number = _ref.number, ext = _ref.ext;
  if (!number) {
    return "";
  }
  if (number[0] !== "+") {
    throw new Error('"formatRFC3966()" expects "number" to be in E.164 format.');
  }
  return "tel:".concat(number).concat(ext ? ";ext=" + ext : "");
}
var init_RFC3966 = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/RFC3966.js"() {
    "use strict";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/format.js
function formatNumber(input, format, options, metadataJson) {
  if (options) {
    options = merge({}, DEFAULT_OPTIONS, options);
  } else {
    options = DEFAULT_OPTIONS;
  }
  var metadata = new Metadata(metadataJson);
  if (input.country && input.country !== "001") {
    if (!metadata.hasCountry(input.country)) {
      throw new Error("Unknown country: ".concat(input.country));
    }
    metadata.selectNumberingPlan(input.country);
  } else if (input.countryCallingCode) {
    metadata.selectNumberingPlan(input.countryCallingCode);
  } else return input.phone || "";
  var countryCallingCode = metadata.countryCallingCode();
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
  var number;
  switch (format) {
    case "NATIONAL":
      if (!nationalNumber) {
        return "";
      }
      number = formatNationalNumber(nationalNumber, input.carrierCode, "NATIONAL", metadata, options);
      return addExtension(number, input.ext, metadata, options.formatExtension);
    case "INTERNATIONAL":
      if (!nationalNumber) {
        return "+".concat(countryCallingCode);
      }
      number = formatNationalNumber(nationalNumber, null, "INTERNATIONAL", metadata, options);
      number = "+".concat(countryCallingCode, " ").concat(number);
      return addExtension(number, input.ext, metadata, options.formatExtension);
    case "E.164":
      return "+".concat(countryCallingCode).concat(nationalNumber);
    case "RFC3966":
      return formatRFC3966({
        number: "+".concat(countryCallingCode).concat(nationalNumber),
        ext: input.ext
      });
    // For reference, here's Google's IDD formatter:
    // https://github.com/google/libphonenumber/blob/32719cf74e68796788d1ca45abc85dcdc63ba5b9/java/libphonenumber/src/com/google/i18n/phonenumbers/PhoneNumberUtil.java#L1546
    // Not saying that this IDD formatter replicates it 1:1, but it seems to work.
    // Who would even need to format phone numbers in IDD format anyway?
    case "IDD":
      if (!options.fromCountry) {
        return;
      }
      var formattedNumber = formatIDD(nationalNumber, input.carrierCode, countryCallingCode, options.fromCountry, metadata);
      if (!formattedNumber) {
        return;
      }
      return addExtension(formattedNumber, input.ext, metadata, options.formatExtension);
    default:
      throw new Error('Unknown "format" argument passed to "formatNumber()": "'.concat(format, '"'));
  }
}
function formatNationalNumber(number, carrierCode, formatAs, metadata, options) {
  var format = chooseFormatForNumber(metadata.formats(), number);
  if (!format) {
    return number;
  }
  return formatNationalNumberUsingFormat(number, format, {
    useInternationalFormat: formatAs === "INTERNATIONAL",
    withNationalPrefix: format.nationalPrefixIsOptionalWhenFormattingInNationalFormat() && options && options.nationalPrefix === false ? false : true,
    carrierCode,
    metadata
  });
}
function chooseFormatForNumber(availableFormats, nationalNumber) {
  return pickFirstMatchingElement(availableFormats, function(format) {
    if (format.leadingDigitsPatterns().length > 0) {
      var lastLeadingDigitsPattern = format.leadingDigitsPatterns()[format.leadingDigitsPatterns().length - 1];
      if (nationalNumber.search(lastLeadingDigitsPattern) !== 0) {
        return false;
      }
    }
    return matchesEntirely(nationalNumber, format.pattern());
  });
}
function addExtension(formattedNumber, ext, metadata, formatExtension2) {
  return ext ? formatExtension2(formattedNumber, ext, metadata) : formattedNumber;
}
function formatIDD(nationalNumber, carrierCode, countryCallingCode, fromCountry, metadata) {
  var fromCountryCallingCode = getCountryCallingCode(fromCountry, metadata.metadata);
  if (fromCountryCallingCode === countryCallingCode) {
    var formattedNumber = formatNationalNumber(nationalNumber, carrierCode, "NATIONAL", metadata);
    if (countryCallingCode === "1") {
      return countryCallingCode + " " + formattedNumber;
    }
    return formattedNumber;
  }
  var iddPrefix = getIddPrefix(fromCountry, void 0, metadata.metadata);
  if (iddPrefix) {
    return "".concat(iddPrefix, " ").concat(countryCallingCode, " ").concat(formatNationalNumber(nationalNumber, null, "INTERNATIONAL", metadata));
  }
}
function merge() {
  var i = 1;
  for (var _len = arguments.length, objects = new Array(_len), _key = 0; _key < _len; _key++) {
    objects[_key] = arguments[_key];
  }
  while (i < objects.length) {
    if (objects[i]) {
      for (var key in objects[i]) {
        objects[0][key] = objects[i][key];
      }
    }
    i++;
  }
  return objects[0];
}
function pickFirstMatchingElement(elements, testFunction) {
  var i = 0;
  while (i < elements.length) {
    if (testFunction(elements[i])) {
      return elements[i];
    }
    i++;
  }
}
var DEFAULT_OPTIONS;
var init_format = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/format.js"() {
    "use strict";
    init_matchesEntirely();
    init_formatNationalNumberUsingFormat();
    init_metadata();
    init_getIddPrefix();
    init_RFC3966();
    DEFAULT_OPTIONS = {
      formatExtension: function formatExtension(formattedNumber, extension, metadata) {
        return "".concat(formattedNumber).concat(metadata.ext()).concat(extension);
      }
    };
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/PhoneNumber.js
function _typeof2(o) {
  "@babel/helpers - typeof";
  return _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof2(o);
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), true).forEach(function(r2) {
      _defineProperty(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey2(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _classCallCheck2(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties2(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey2(o.key), o);
  }
}
function _createClass2(e, r, t) {
  return r && _defineProperties2(e.prototype, r), t && _defineProperties2(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _toPropertyKey2(t) {
  var i = _toPrimitive2(t, "string");
  return "symbol" == _typeof2(i) ? i : i + "";
}
function _toPrimitive2(t, r) {
  if ("object" != _typeof2(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof2(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var PhoneNumber, E164_NUMBER_REGEXP;
var init_PhoneNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/PhoneNumber.js"() {
    "use strict";
    init_metadata();
    init_isPossible();
    init_isValid();
    init_getNumberType();
    init_getCountryAndCallingCodeFromOneOfThem();
    init_getPossibleCountriesForNumber();
    init_extractCountryCallingCode();
    init_isObject();
    init_format();
    PhoneNumber = /* @__PURE__ */ (function() {
      function PhoneNumber2(countryOrCountryCallingCode, nationalNumber, metadata) {
        _classCallCheck2(this, PhoneNumber2);
        if (!countryOrCountryCallingCode) {
          throw new TypeError("First argument is required");
        }
        if (typeof countryOrCountryCallingCode !== "string") {
          throw new TypeError("First argument must be a string");
        }
        if (countryOrCountryCallingCode[0] === "+" && !nationalNumber) {
          throw new TypeError("`metadata` argument not passed");
        }
        if (isObject(nationalNumber) && isObject(nationalNumber.countries)) {
          metadata = nationalNumber;
          var e164Number = countryOrCountryCallingCode;
          if (!E164_NUMBER_REGEXP.test(e164Number)) {
            throw new Error('Invalid `number` argument passed: must consist of a "+" followed by digits');
          }
          var _extractCountryCallin = extractCountryCallingCode(e164Number, void 0, void 0, void 0, metadata), _countryCallingCode = _extractCountryCallin.countryCallingCode, number = _extractCountryCallin.number;
          nationalNumber = number;
          countryOrCountryCallingCode = _countryCallingCode;
          if (!nationalNumber) {
            throw new Error("Invalid `number` argument passed: too short");
          }
        }
        if (!nationalNumber) {
          throw new TypeError("`nationalNumber` argument is required");
        }
        if (typeof nationalNumber !== "string") {
          throw new TypeError("`nationalNumber` argument must be a string");
        }
        validateMetadata(metadata);
        var _getCountryAndCalling = getCountryAndCallingCodeFromOneOfThem(countryOrCountryCallingCode, metadata), country = _getCountryAndCalling.country, countryCallingCode = _getCountryAndCalling.callingCode;
        this.country = country;
        this.countryCallingCode = countryCallingCode;
        this.nationalNumber = nationalNumber;
        this.number = "+" + this.countryCallingCode + this.nationalNumber;
        this.getMetadata = function() {
          return metadata;
        };
      }
      return _createClass2(PhoneNumber2, [{
        key: "setExt",
        value: function setExt(ext) {
          this.ext = ext;
        }
      }, {
        key: "getPossibleCountries",
        value: function getPossibleCountries() {
          if (this.country) {
            return [this.country];
          }
          return getPossibleCountriesForNumber(this.countryCallingCode, this.nationalNumber, this.getMetadata());
        }
      }, {
        key: "isPossible",
        value: function isPossible() {
          return isPossiblePhoneNumber(this, {
            v2: true
          }, this.getMetadata());
        }
      }, {
        key: "isValid",
        value: function isValid() {
          return isValidNumber(this, {
            v2: true
          }, this.getMetadata());
        }
      }, {
        key: "isNonGeographic",
        value: function isNonGeographic() {
          var metadata = new Metadata(this.getMetadata());
          return metadata.isNonGeographicCallingCode(this.countryCallingCode);
        }
      }, {
        key: "isEqual",
        value: function isEqual(phoneNumber) {
          return this.number === phoneNumber.number && this.ext === phoneNumber.ext;
        }
        // `validateLength()` method was originally meant to be an equivalent for `validatePhoneNumberLength()`.
        //
        // Later, it became apparent that it's not really a true equivalent.
        // The reason is that a `PhoneNumber` instance is not created
        // when the phone number string is too short for it to be considered a valid phone number:
        // * When there must be at least 2 national (significant) number digits: `"1"`.
        // * When the country calling code part of an international number is incomplete: `"+12"`.
        //
        // So leaving this `validateLength()` method here would suggest a hidden anti-pattern
        // of using it instead of `validatePhoneNumberLength()` while ignoring
        // the "too short to be even possible" case from phone number length validation.
        // And ignoring that case wouldn't make any sense in a real-world application
        // because it would still be a valid case that should be handled.
        //
        // Because of that, this method was eventually commented out in order to not introduce
        // that kind of an anti-pattern.
        //
        // validateLength() {
        // 	const result = checkNumberLength(
        // 		this.nationalNumber,
        // 		undefined,
        // 		this.getMetadata()
        // 	)
        // 	if (result !== 'IS_POSSIBLE') {
        // 		return result
        // 	}
        // }
      }, {
        key: "getType",
        value: function getType2() {
          return getNumberType(this, {
            v2: true
          }, this.getMetadata());
        }
      }, {
        key: "format",
        value: function format(_format, options) {
          return formatNumber(this, _format, options ? _objectSpread(_objectSpread({}, options), {}, {
            v2: true
          }) : {
            v2: true
          }, this.getMetadata());
        }
      }, {
        key: "formatNational",
        value: function formatNational(options) {
          return this.format("NATIONAL", options);
        }
      }, {
        key: "formatInternational",
        value: function formatInternational(options) {
          return this.format("INTERNATIONAL", options);
        }
      }, {
        key: "getURI",
        value: function getURI(options) {
          return this.format("RFC3966", options);
        }
      }]);
    })();
    E164_NUMBER_REGEXP = /^\+\d+$/;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/ParseError.js
function _typeof3(o) {
  "@babel/helpers - typeof";
  return _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof3(o);
}
function _defineProperties3(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey3(o.key), o);
  }
}
function _createClass3(e, r, t) {
  return r && _defineProperties3(e.prototype, r), t && _defineProperties3(e, t), Object.defineProperty(e, "prototype", { writable: false }), e;
}
function _toPropertyKey3(t) {
  var i = _toPrimitive3(t, "string");
  return "symbol" == _typeof3(i) ? i : i + "";
}
function _toPrimitive3(t, r) {
  if ("object" != _typeof3(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof3(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _classCallCheck3(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == _typeof3(e) || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: true, configurable: true } }), Object.defineProperty(t, "prototype", { writable: false }), e && _setPrototypeOf(t, e);
}
function _wrapNativeSuper(t) {
  var r = "function" == typeof Map ? /* @__PURE__ */ new Map() : void 0;
  return _wrapNativeSuper = function _wrapNativeSuper2(t2) {
    if (null === t2 || !_isNativeFunction(t2)) return t2;
    if ("function" != typeof t2) throw new TypeError("Super expression must either be null or a function");
    if (void 0 !== r) {
      if (r.has(t2)) return r.get(t2);
      r.set(t2, Wrapper);
    }
    function Wrapper() {
      return _construct(t2, arguments, _getPrototypeOf(this).constructor);
    }
    return Wrapper.prototype = Object.create(t2.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }), _setPrototypeOf(Wrapper, t2);
  }, _wrapNativeSuper(t);
}
function _construct(t, e, r) {
  if (_isNativeReflectConstruct()) return Reflect.construct.apply(null, arguments);
  var o = [null];
  o.push.apply(o, e);
  var p = new (t.bind.apply(t, o))();
  return r && _setPrototypeOf(p, r.prototype), p;
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t2) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t;
  })();
}
function _isNativeFunction(t) {
  try {
    return -1 !== Function.toString.call(t).indexOf("[native code]");
  } catch (n) {
    return "function" == typeof t;
  }
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t2, e2) {
    return t2.__proto__ = e2, t2;
  }, _setPrototypeOf(t, e);
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t2) {
    return t2.__proto__ || Object.getPrototypeOf(t2);
  }, _getPrototypeOf(t);
}
var ParseError;
var init_ParseError = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/ParseError.js"() {
    "use strict";
    ParseError = /* @__PURE__ */ (function(_Error) {
      function ParseError2(code) {
        var _this;
        _classCallCheck3(this, ParseError2);
        _this = _callSuper(this, ParseError2, [code]);
        Object.setPrototypeOf(_this, ParseError2.prototype);
        _this.name = _this.constructor.name;
        return _this;
      }
      _inherits(ParseError2, _Error);
      return _createClass3(ParseError2);
    })(/* @__PURE__ */ _wrapNativeSuper(Error));
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extension/extractExtension.js
function extractExtension(number) {
  var start = number.search(EXTN_PATTERN);
  if (start < 0) {
    return {};
  }
  var numberWithoutExtension = number.slice(0, start);
  var matches = number.match(EXTN_PATTERN);
  var i = 1;
  while (i < matches.length) {
    if (matches[i]) {
      return {
        number: numberWithoutExtension,
        ext: matches[i]
      };
    }
    i++;
  }
}
var EXTN_PATTERN;
var init_extractExtension = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extension/extractExtension.js"() {
    "use strict";
    init_createExtensionPattern();
    EXTN_PATTERN = new RegExp("(?:" + createExtensionPattern() + ")$", "i");
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/parseDigits.js
function parseDigit(character) {
  return DIGITS[character];
}
var DIGITS;
var init_parseDigits = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/parseDigits.js"() {
    "use strict";
    DIGITS = {
      "0": "0",
      "1": "1",
      "2": "2",
      "3": "3",
      "4": "4",
      "5": "5",
      "6": "6",
      "7": "7",
      "8": "8",
      "9": "9",
      "\uFF10": "0",
      // Fullwidth digit 0
      "\uFF11": "1",
      // Fullwidth digit 1
      "\uFF12": "2",
      // Fullwidth digit 2
      "\uFF13": "3",
      // Fullwidth digit 3
      "\uFF14": "4",
      // Fullwidth digit 4
      "\uFF15": "5",
      // Fullwidth digit 5
      "\uFF16": "6",
      // Fullwidth digit 6
      "\uFF17": "7",
      // Fullwidth digit 7
      "\uFF18": "8",
      // Fullwidth digit 8
      "\uFF19": "9",
      // Fullwidth digit 9
      "\u0660": "0",
      // Arabic-indic digit 0
      "\u0661": "1",
      // Arabic-indic digit 1
      "\u0662": "2",
      // Arabic-indic digit 2
      "\u0663": "3",
      // Arabic-indic digit 3
      "\u0664": "4",
      // Arabic-indic digit 4
      "\u0665": "5",
      // Arabic-indic digit 5
      "\u0666": "6",
      // Arabic-indic digit 6
      "\u0667": "7",
      // Arabic-indic digit 7
      "\u0668": "8",
      // Arabic-indic digit 8
      "\u0669": "9",
      // Arabic-indic digit 9
      "\u06F0": "0",
      // Eastern-Arabic digit 0
      "\u06F1": "1",
      // Eastern-Arabic digit 1
      "\u06F2": "2",
      // Eastern-Arabic digit 2
      "\u06F3": "3",
      // Eastern-Arabic digit 3
      "\u06F4": "4",
      // Eastern-Arabic digit 4
      "\u06F5": "5",
      // Eastern-Arabic digit 5
      "\u06F6": "6",
      // Eastern-Arabic digit 6
      "\u06F7": "7",
      // Eastern-Arabic digit 7
      "\u06F8": "8",
      // Eastern-Arabic digit 8
      "\u06F9": "9"
      // Eastern-Arabic digit 9
    };
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parseIncompletePhoneNumber.js
function _createForOfIteratorHelperLoose4(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (t) return (t = t.call(r)).next.bind(t);
  if (Array.isArray(r) || (t = _unsupportedIterableToArray4(r)) || e && r && "number" == typeof r.length) {
    t && (r = t);
    var o = 0;
    return function() {
      return o >= r.length ? { done: true } : { done: false, value: r[o++] };
    };
  }
  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray4(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray4(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray4(r, a) : void 0;
  }
}
function _arrayLikeToArray4(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function parseIncompletePhoneNumber(string) {
  var result2 = "";
  for (var _iterator = _createForOfIteratorHelperLoose4(string.split("")), _step; !(_step = _iterator()).done; ) {
    var character = _step.value;
    result2 += parsePhoneNumberCharacter(character, result2) || "";
  }
  return result2;
}
function parsePhoneNumberCharacter(character, prevParsedCharacters, eventListener) {
  if (character === "+") {
    if (prevParsedCharacters) {
      if (typeof eventListener === "function") {
        eventListener("end");
      }
      return;
    }
    return "+";
  }
  return parseDigit(character);
}
var init_parseIncompletePhoneNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parseIncompletePhoneNumber.js"() {
    "use strict";
    init_parseDigits();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractPhoneContext.js
function extractPhoneContext(numberToExtractFrom) {
  var indexOfPhoneContext = numberToExtractFrom.indexOf(RFC3966_PHONE_CONTEXT_);
  if (indexOfPhoneContext < 0) {
    return null;
  }
  var phoneContextStart = indexOfPhoneContext + RFC3966_PHONE_CONTEXT_.length;
  if (phoneContextStart >= numberToExtractFrom.length) {
    return "";
  }
  var phoneContextEnd = numberToExtractFrom.indexOf(";", phoneContextStart);
  if (phoneContextEnd >= 0) {
    return numberToExtractFrom.substring(phoneContextStart, phoneContextEnd);
  } else {
    return numberToExtractFrom.substring(phoneContextStart);
  }
}
function isPhoneContextValid(phoneContext) {
  if (phoneContext === null) {
    return true;
  }
  if (phoneContext.length === 0) {
    return false;
  }
  return RFC3966_GLOBAL_NUMBER_DIGITS_PATTERN_.test(phoneContext) || RFC3966_DOMAINNAME_PATTERN_.test(phoneContext);
}
var PLUS_SIGN, RFC3966_VISUAL_SEPARATOR_, RFC3966_PHONE_DIGIT_, RFC3966_GLOBAL_NUMBER_DIGITS_, RFC3966_GLOBAL_NUMBER_DIGITS_PATTERN_, ALPHANUM_, RFC3966_DOMAINLABEL_, VALID_ALPHA_, RFC3966_TOPLABEL_, RFC3966_DOMAINNAME_, RFC3966_DOMAINNAME_PATTERN_, RFC3966_PREFIX_, RFC3966_PHONE_CONTEXT_, RFC3966_ISDN_SUBADDRESS_;
var init_extractPhoneContext = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractPhoneContext.js"() {
    "use strict";
    init_constants();
    PLUS_SIGN = "+";
    RFC3966_VISUAL_SEPARATOR_ = "[\\-\\.\\(\\)]?";
    RFC3966_PHONE_DIGIT_ = "([" + VALID_DIGITS + "]|" + RFC3966_VISUAL_SEPARATOR_ + ")";
    RFC3966_GLOBAL_NUMBER_DIGITS_ = "^\\" + PLUS_SIGN + RFC3966_PHONE_DIGIT_ + "*[" + VALID_DIGITS + "]" + RFC3966_PHONE_DIGIT_ + "*$";
    RFC3966_GLOBAL_NUMBER_DIGITS_PATTERN_ = new RegExp(RFC3966_GLOBAL_NUMBER_DIGITS_, "g");
    ALPHANUM_ = VALID_DIGITS;
    RFC3966_DOMAINLABEL_ = "[" + ALPHANUM_ + "]+((\\-)*[" + ALPHANUM_ + "])*";
    VALID_ALPHA_ = "a-zA-Z";
    RFC3966_TOPLABEL_ = "[" + VALID_ALPHA_ + "]+((\\-)*[" + ALPHANUM_ + "])*";
    RFC3966_DOMAINNAME_ = "^(" + RFC3966_DOMAINLABEL_ + "\\.)*" + RFC3966_TOPLABEL_ + "\\.?$";
    RFC3966_DOMAINNAME_PATTERN_ = new RegExp(RFC3966_DOMAINNAME_, "g");
    RFC3966_PREFIX_ = "tel:";
    RFC3966_PHONE_CONTEXT_ = ";phone-context=";
    RFC3966_ISDN_SUBADDRESS_ = ";isub=";
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractFormattedPhoneNumberFromPossibleRfc3966NumberUri.js
function extractFormattedPhoneNumberFromPossibleRfc3966NumberUri(numberToParse, _ref) {
  var extractFormattedPhoneNumber = _ref.extractFormattedPhoneNumber;
  var phoneContext = extractPhoneContext(numberToParse);
  if (!isPhoneContextValid(phoneContext)) {
    throw new ParseError("NOT_A_NUMBER");
  }
  var phoneNumberString;
  if (phoneContext === null) {
    phoneNumberString = extractFormattedPhoneNumber(numberToParse) || "";
  } else {
    phoneNumberString = "";
    if (phoneContext.charAt(0) === PLUS_SIGN) {
      phoneNumberString += phoneContext;
    }
    var indexOfRfc3966Prefix = numberToParse.indexOf(RFC3966_PREFIX_);
    var indexOfNationalNumber;
    if (indexOfRfc3966Prefix >= 0) {
      indexOfNationalNumber = indexOfRfc3966Prefix + RFC3966_PREFIX_.length;
    } else {
      indexOfNationalNumber = 0;
    }
    var indexOfPhoneContext = numberToParse.indexOf(RFC3966_PHONE_CONTEXT_);
    phoneNumberString += numberToParse.substring(indexOfNationalNumber, indexOfPhoneContext);
  }
  var indexOfIsdn = phoneNumberString.indexOf(RFC3966_ISDN_SUBADDRESS_);
  if (indexOfIsdn > 0) {
    phoneNumberString = phoneNumberString.substring(0, indexOfIsdn);
  }
  if (phoneNumberString !== "") {
    return phoneNumberString;
  }
}
var init_extractFormattedPhoneNumberFromPossibleRfc3966NumberUri = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/helpers/extractFormattedPhoneNumberFromPossibleRfc3966NumberUri.js"() {
    "use strict";
    init_extractPhoneContext();
    init_ParseError();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parse.js
function parse(text, options, metadataJson) {
  options = options || {};
  var metadata = new Metadata(metadataJson);
  if (options.defaultCountry && !metadata.hasCountry(options.defaultCountry)) {
    if (options.v2) {
      throw new ParseError("INVALID_COUNTRY");
    }
    throw new Error("Unknown country: ".concat(options.defaultCountry));
  }
  var _parseInput = parseInput(text, options.v2, options.extract), formattedPhoneNumber = _parseInput.number, ext = _parseInput.ext, error = _parseInput.error;
  if (!formattedPhoneNumber) {
    if (options.v2) {
      if (error === "TOO_SHORT") {
        throw new ParseError("TOO_SHORT");
      }
      throw new ParseError("NOT_A_NUMBER");
    }
    return {};
  }
  var _parsePhoneNumber = parsePhoneNumber(
    formattedPhoneNumber,
    options.defaultCountry,
    options.defaultCallingCode,
    // If `country` is returned, its numbering plan will also be selected in `metadata`.
    // Otherwise, if `countryCallingCode` is returned, its numbering plan will also be selected in `metadata`.
    // Otherwise, if neither `country` nor `countryCallingCode` are returned, no numbering plan will be selected in `metadata`.
    metadata
  ), country = _parsePhoneNumber.country, nationalNumber = _parsePhoneNumber.nationalNumber, countryCallingCode = _parsePhoneNumber.countryCallingCode, countryCallingCodeSource = _parsePhoneNumber.countryCallingCodeSource, carrierCode = _parsePhoneNumber.carrierCode;
  if (!metadata.hasSelectedNumberingPlan()) {
    if (options.v2) {
      throw new ParseError("INVALID_COUNTRY");
    }
    return {};
  }
  if (!nationalNumber || nationalNumber.length < MIN_LENGTH_FOR_NSN) {
    if (options.v2) {
      throw new ParseError("TOO_SHORT");
    }
    return {};
  }
  if (nationalNumber.length > MAX_LENGTH_FOR_NSN) {
    if (options.v2) {
      throw new ParseError("TOO_LONG");
    }
    return {};
  }
  if (options.v2) {
    var phoneNumber = new PhoneNumber(countryCallingCode, nationalNumber, metadata.metadata);
    if (country) {
      phoneNumber.country = country;
    }
    if (carrierCode) {
      phoneNumber.carrierCode = carrierCode;
    }
    if (ext) {
      phoneNumber.ext = ext;
    }
    phoneNumber.__countryCallingCodeSource = countryCallingCodeSource;
    return phoneNumber;
  }
  var valid = (options.extended ? metadata.hasSelectedNumberingPlan() : country) ? matchesEntirely(nationalNumber, metadata.nationalNumberPattern()) : false;
  if (!options.extended) {
    return valid ? result(country, nationalNumber, ext) : {};
  }
  return {
    country,
    countryCallingCode,
    carrierCode,
    valid,
    possible: valid ? true : options.extended === true && metadata.possibleLengths() && isPossibleNumber(nationalNumber, metadata) ? true : false,
    phone: nationalNumber,
    ext
  };
}
function _extractFormattedPhoneNumber(text, extract, throwOnError) {
  if (!text) {
    return;
  }
  if (text.length > MAX_INPUT_STRING_LENGTH) {
    if (throwOnError) {
      throw new ParseError("TOO_LONG");
    }
    return;
  }
  if (extract === false) {
    return text;
  }
  var startsAt = text.search(PHONE_NUMBER_START_PATTERN);
  if (startsAt < 0) {
    return;
  }
  return text.slice(startsAt).replace(AFTER_PHONE_NUMBER_END_PATTERN, "");
}
function parseInput(text, v2, extract) {
  var number = extractFormattedPhoneNumberFromPossibleRfc3966NumberUri(text, {
    extractFormattedPhoneNumber: function extractFormattedPhoneNumber(text2) {
      return _extractFormattedPhoneNumber(text2, extract, v2);
    }
  });
  if (!number) {
    return {};
  }
  if (!isViablePhoneNumber(number)) {
    if (isViablePhoneNumberStart(number)) {
      return {
        error: "TOO_SHORT"
      };
    }
    return {};
  }
  var withExtensionStripped = extractExtension(number);
  if (withExtensionStripped.ext) {
    return withExtensionStripped;
  }
  return {
    number
  };
}
function result(country, nationalNumber, ext) {
  var result2 = {
    country,
    phone: nationalNumber
  };
  if (ext) {
    result2.ext = ext;
  }
  return result2;
}
function parsePhoneNumber(formattedPhoneNumber, defaultCountry, defaultCallingCode, metadata) {
  var _extractCountryCallin = extractCountryCallingCode(
    parseIncompletePhoneNumber(formattedPhoneNumber),
    void 0,
    // `defaultCountry` and `defaultCallingCode` are only used to detect
    // if it's an "international" phone number or not. They won't be used
    // to derive the resulting `countryCallingCode` from them, or anything like that.
    defaultCountry,
    defaultCallingCode,
    metadata.metadata
  ), countryCallingCodeSource = _extractCountryCallin.countryCallingCodeSource, countryCallingCode = _extractCountryCallin.countryCallingCode, number = _extractCountryCallin.number;
  var country;
  if (countryCallingCode) {
    metadata.selectNumberingPlan(countryCallingCode);
  } else if (number && (defaultCountry || defaultCallingCode)) {
    if (defaultCountry) {
      country = defaultCountry;
      metadata.selectNumberingPlan(defaultCountry);
      countryCallingCode = metadata.numberingPlan.callingCode();
    } else {
      metadata.selectNumberingPlan(defaultCallingCode);
      countryCallingCode = defaultCallingCode;
      if (USE_NON_GEOGRAPHIC_COUNTRY_CODE3) {
        if (metadata.isNonGeographicCallingCode(countryCallingCode)) {
          country = "001";
        }
      }
    }
  } else return {};
  if (!number) {
    return {
      countryCallingCodeSource,
      countryCallingCode
    };
  }
  var _extractNationalNumbe = extractNationalNumber(parseIncompletePhoneNumber(number), void 0, metadata), nationalNumber = _extractNationalNumbe.nationalNumber, carrierCode = _extractNationalNumbe.carrierCode;
  var exactCountry = getCountryByCallingCode(countryCallingCode, {
    nationalNumber,
    metadata
  });
  if (exactCountry) {
    country = exactCountry;
    if (exactCountry === "001") {
    } else {
      metadata.selectNumberingPlan(country);
    }
  }
  return {
    country,
    countryCallingCode,
    countryCallingCodeSource,
    nationalNumber,
    carrierCode
  };
}
var MAX_INPUT_STRING_LENGTH, PHONE_NUMBER_START_PATTERN, AFTER_PHONE_NUMBER_END_PATTERN, USE_NON_GEOGRAPHIC_COUNTRY_CODE3;
var init_parse = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parse.js"() {
    "use strict";
    init_constants();
    init_ParseError();
    init_metadata();
    init_isViablePhoneNumber();
    init_extractExtension();
    init_parseIncompletePhoneNumber();
    init_isPossible();
    init_PhoneNumber();
    init_matchesEntirely();
    init_extractCountryCallingCode();
    init_extractNationalNumber();
    init_getCountryByCallingCode();
    init_extractFormattedPhoneNumberFromPossibleRfc3966NumberUri();
    MAX_INPUT_STRING_LENGTH = 250;
    PHONE_NUMBER_START_PATTERN = new RegExp("[" + PLUS_CHARS + VALID_DIGITS + "]");
    AFTER_PHONE_NUMBER_END_PATTERN = new RegExp("[^" + VALID_DIGITS + "#]+$");
    USE_NON_GEOGRAPHIC_COUNTRY_CODE3 = false;
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumberWithError_.js
function _typeof4(o) {
  "@babel/helpers - typeof";
  return _typeof4 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof4(o);
}
function ownKeys2(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys2(Object(t), true).forEach(function(r2) {
      _defineProperty2(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys2(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty2(e, r, t) {
  return (r = _toPropertyKey4(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey4(t) {
  var i = _toPrimitive4(t, "string");
  return "symbol" == _typeof4(i) ? i : i + "";
}
function _toPrimitive4(t, r) {
  if ("object" != _typeof4(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof4(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function parsePhoneNumberWithError(text, options, metadata) {
  return parse(text, _objectSpread2(_objectSpread2({}, options), {}, {
    v2: true
  }), metadata);
}
var init_parsePhoneNumberWithError = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumberWithError_.js"() {
    "use strict";
    init_parse();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/normalizeArguments.js
function _typeof5(o) {
  "@babel/helpers - typeof";
  return _typeof5 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof5(o);
}
function ownKeys3(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread3(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys3(Object(t), true).forEach(function(r2) {
      _defineProperty3(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys3(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty3(e, r, t) {
  return (r = _toPropertyKey5(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey5(t) {
  var i = _toPrimitive5(t, "string");
  return "symbol" == _typeof5(i) ? i : i + "";
}
function _toPrimitive5(t, r) {
  if ("object" != _typeof5(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof5(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray5(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray5(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray5(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray5(r, a) : void 0;
  }
}
function _arrayLikeToArray5(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e, n, i, u, a = [], f = true, o = false;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = false;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = true) ;
    } catch (r2) {
      o = true, n = r2;
    } finally {
      try {
        if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function normalizeArguments(args) {
  var _Array$prototype$slic = Array.prototype.slice.call(args), _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 4), arg_1 = _Array$prototype$slic2[0], arg_2 = _Array$prototype$slic2[1], arg_3 = _Array$prototype$slic2[2], arg_4 = _Array$prototype$slic2[3];
  var text;
  var options;
  var metadata;
  if (typeof arg_1 === "string") {
    text = arg_1;
  } else throw new TypeError("A text for parsing must be a string.");
  if (!arg_2 || typeof arg_2 === "string") {
    if (arg_4) {
      options = arg_3;
      metadata = arg_4;
    } else {
      options = void 0;
      metadata = arg_3;
    }
    if (arg_2) {
      options = _objectSpread3({
        defaultCountry: arg_2
      }, options);
    }
  } else if (isObject(arg_2)) {
    if (arg_3) {
      options = arg_2;
      metadata = arg_3;
    } else {
      metadata = arg_2;
    }
  } else throw new Error("Invalid second argument: ".concat(arg_2));
  return {
    text,
    options,
    metadata
  };
}
var init_normalizeArguments = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/normalizeArguments.js"() {
    "use strict";
    init_isObject();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumber_.js
function _typeof6(o) {
  "@babel/helpers - typeof";
  return _typeof6 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof6(o);
}
function ownKeys4(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread4(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys4(Object(t), true).forEach(function(r2) {
      _defineProperty4(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys4(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty4(e, r, t) {
  return (r = _toPropertyKey6(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey6(t) {
  var i = _toPrimitive6(t, "string");
  return "symbol" == _typeof6(i) ? i : i + "";
}
function _toPrimitive6(t, r) {
  if ("object" != _typeof6(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof6(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function parsePhoneNumber2(text, options, metadata) {
  if (options && options.defaultCountry && !isSupportedCountry(options.defaultCountry, metadata)) {
    options = _objectSpread4(_objectSpread4({}, options), {}, {
      defaultCountry: void 0
    });
  }
  try {
    return parsePhoneNumberWithError(text, options, metadata);
  } catch (error) {
    if (error instanceof ParseError) {
    } else {
      throw error;
    }
  }
}
var init_parsePhoneNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumber_.js"() {
    "use strict";
    init_parsePhoneNumberWithError();
    init_ParseError();
    init_metadata();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumber.js
function parsePhoneNumber3() {
  var _normalizeArguments = normalizeArguments(arguments), text = _normalizeArguments.text, options = _normalizeArguments.options, metadata = _normalizeArguments.metadata;
  return parsePhoneNumber2(text, options, metadata);
}
var init_parsePhoneNumber2 = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/parsePhoneNumber.js"() {
    "use strict";
    init_normalizeArguments();
    init_parsePhoneNumber();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isValidPhoneNumber.js
function _typeof7(o) {
  "@babel/helpers - typeof";
  return _typeof7 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof7(o);
}
function ownKeys5(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function(r2) {
      return Object.getOwnPropertyDescriptor(e, r2).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread5(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys5(Object(t), true).forEach(function(r2) {
      _defineProperty5(e, r2, t[r2]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys5(Object(t)).forEach(function(r2) {
      Object.defineProperty(e, r2, Object.getOwnPropertyDescriptor(t, r2));
    });
  }
  return e;
}
function _defineProperty5(e, r, t) {
  return (r = _toPropertyKey7(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: true, configurable: true, writable: true }) : e[r] = t, e;
}
function _toPropertyKey7(t) {
  var i = _toPrimitive7(t, "string");
  return "symbol" == _typeof7(i) ? i : i + "";
}
function _toPrimitive7(t, r) {
  if ("object" != _typeof7(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof7(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function isValidPhoneNumber() {
  var _normalizeArguments = normalizeArguments(arguments), text = _normalizeArguments.text, options = _normalizeArguments.options, metadata = _normalizeArguments.metadata;
  options = _objectSpread5(_objectSpread5({}, options), {}, {
    extract: false
  });
  var phoneNumber = parsePhoneNumber2(text, options, metadata);
  return phoneNumber && phoneNumber.isValid() || false;
}
var init_isValidPhoneNumber = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/es6/isValidPhoneNumber.js"() {
    "use strict";
    init_normalizeArguments();
    init_parsePhoneNumber();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/core/index.js
var init_core2 = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/core/index.js"() {
    "use strict";
    init_parsePhoneNumber2();
    init_isValidPhoneNumber();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/parsePhoneNumber.js
function parsePhoneNumber4() {
  return withMetadataArgument(parsePhoneNumber3, arguments);
}
var init_parsePhoneNumber3 = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/parsePhoneNumber.js"() {
    "use strict";
    init_withMetadataArgument();
    init_core2();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/isValidPhoneNumber.js
function isValidPhoneNumber2() {
  return withMetadataArgument(isValidPhoneNumber, arguments);
}
var init_isValidPhoneNumber2 = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/min/exports/isValidPhoneNumber.js"() {
    "use strict";
    init_withMetadataArgument();
    init_core2();
  }
});

// ../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/index.js
var init_libphonenumber_js = __esm({
  "../../node_modules/.pnpm/libphonenumber-js@1.13.7/node_modules/libphonenumber-js/index.js"() {
    "use strict";
    init_parsePhoneNumber3();
    init_isValidPhoneNumber2();
  }
});

// ../shared-types/dist/supportedCountries.js
function isDemoDialableCountry(iso2) {
  return !!iso2 && DEMO_DIALABLE_COUNTRIES.includes(iso2.toUpperCase());
}
function isSupportedCountry2(iso2) {
  if (!iso2)
    return false;
  return SUPPORTED_COUNTRY_CODES.includes(iso2.toUpperCase());
}
function supportedCountry(iso2) {
  const upper = iso2.toUpperCase();
  return SUPPORTED_COUNTRIES.find((c) => c.iso2 === upper);
}
function phoneNumberCountry(raw, defaultCountry) {
  const parsed = parseValidPhone(raw, defaultCountry);
  return parsed?.country ?? null;
}
function toSupportedE164(raw, defaultCountry) {
  const parsed = parseValidPhone(raw, defaultCountry);
  return parsed && isSupportedCountry2(parsed.country) ? parsed.number : null;
}
function isSupportedPhoneNumber(raw, defaultCountry) {
  return toSupportedE164(raw, defaultCountry) !== null;
}
function phoneNumberIssue(raw, defaultCountry) {
  const input = typeof raw === "string" ? raw.trim() : "";
  if (!input)
    return null;
  const parsed = parseValidPhone(input, defaultCountry);
  const iso = parsed?.country ?? (input.startsWith("+") ? parsePhoneNumber4(input)?.country : void 0) ?? defaultCountry;
  if (iso && !isSupportedCountry2(iso)) {
    return `Rymi doesn't support ${countryDisplayName(iso)} numbers. Supported: ${SUPPORTED_COUNTRIES.map((c) => c.name).join(", ")}.`;
  }
  if (parsed)
    return null;
  return iso ? `Not a valid number for ${countryDisplayName(iso)} yet.` : "Enter a valid number in E.164 format, e.g. +15551234567.";
}
function parseValidPhone(raw, defaultCountry) {
  if (typeof raw !== "string")
    return void 0;
  const input = raw.trim();
  if (!input)
    return void 0;
  const intl = input.startsWith("+");
  if (!intl && !defaultCountry)
    return void 0;
  const country = intl ? void 0 : defaultCountry.toUpperCase();
  try {
    if (!isValidPhoneNumber2(input, country))
      return void 0;
    const parsed = parsePhoneNumber4(input, country);
    return parsed?.country ? parsed : void 0;
  } catch {
    return void 0;
  }
}
function countryDisplayName(iso) {
  const supported = supportedCountry(iso);
  if (supported)
    return supported.name;
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(iso) ?? iso;
  } catch {
    return iso;
  }
}
var SUPPORTED_COUNTRIES, DEMO_DIALABLE_COUNTRIES, SUPPORTED_COUNTRY_CODES, regionNames;
var init_supportedCountries = __esm({
  "../shared-types/dist/supportedCountries.js"() {
    "use strict";
    init_libphonenumber_js();
    SUPPORTED_COUNTRIES = [
      { iso2: "US", name: "United States", dialCode: "+1" },
      { iso2: "IN", name: "India", dialCode: "+91" },
      { iso2: "AE", name: "United Arab Emirates", dialCode: "+971" },
      { iso2: "SA", name: "Saudi Arabia", dialCode: "+966" },
      { iso2: "QA", name: "Qatar", dialCode: "+974" },
      { iso2: "KW", name: "Kuwait", dialCode: "+965" },
      { iso2: "BH", name: "Bahrain", dialCode: "+973" },
      { iso2: "OM", name: "Oman", dialCode: "+968" }
    ];
    DEMO_DIALABLE_COUNTRIES = ["US", "IN"];
    SUPPORTED_COUNTRY_CODES = SUPPORTED_COUNTRIES.map((c) => c.iso2);
    regionNames = null;
  }
});

// ../shared-types/dist/index.js
var dist_exports = {};
__export(dist_exports, {
  AGENT_CONFIG_SCHEMA: () => AGENT_CONFIG_SCHEMA,
  AGENT_CONFIG_SCHEMA_VERSION: () => AGENT_CONFIG_SCHEMA_VERSION,
  AGENT_LLM_PROVIDERS: () => AGENT_LLM_PROVIDERS,
  ALL_API_KEY_SCOPES: () => ALL_API_KEY_SCOPES,
  API_SECRETS_PROVIDER: () => API_SECRETS_PROVIDER,
  API_TOOL_AUTH_HEADER_PATTERN: () => API_TOOL_AUTH_HEADER_PATTERN,
  API_TOOL_NAME_PATTERN: () => API_TOOL_NAME_PATTERN,
  API_TOOL_RESERVED_FIELD_NAMES: () => API_TOOL_RESERVED_FIELD_NAMES,
  API_TOOL_SECRET_REF_PATTERN: () => API_TOOL_SECRET_REF_PATTERN,
  AZURE_SPEECH_LANGUAGE_CODES: () => AZURE_SPEECH_LANGUAGE_CODES,
  BLOCKER_QUESTIONS: () => BLOCKER_QUESTIONS,
  BUILTIN_TOOL_CATALOG: () => BUILTIN_TOOL_CATALOG,
  BUSINESS_TYPES: () => BUSINESS_TYPES,
  CALL_FINALIZATION_JOB_VERSION: () => CALL_FINALIZATION_JOB_VERSION,
  CHANGE_SET_VALIDATORS: () => CHANGE_SET_VALIDATORS,
  CONNECTOR_CATALOG: () => CONNECTOR_CATALOG,
  CREDIT_CENTS_PER_USD: () => CREDIT_CENTS_PER_USD,
  CUSTOM_PLATFORM_FEE_PER_MIN: () => CUSTOM_PLATFORM_FEE_PER_MIN,
  DEFAULT_CALL_PRIVACY_POLICY: () => DEFAULT_CALL_PRIVACY_POLICY,
  DEFAULT_CALL_RECORDINGS_BUCKET: () => DEFAULT_CALL_RECORDINGS_BUCKET,
  DEFAULT_COMPLIANCE_POLICY: () => DEFAULT_COMPLIANCE_POLICY,
  DEFAULT_CONFIDENCE_THRESHOLD: () => DEFAULT_CONFIDENCE_THRESHOLD,
  DEFAULT_COST_QUALITY_MODE: () => DEFAULT_COST_QUALITY_MODE,
  DEFAULT_POST_CALL_CONFIG: () => DEFAULT_POST_CALL_CONFIG,
  DEMO_DIALABLE_COUNTRIES: () => DEMO_DIALABLE_COUNTRIES,
  DEPENDENCY_GRAPH: () => DEPENDENCY_GRAPH,
  DERIVED_SERIALIZE_RULES: () => DERIVED_SERIALIZE_RULES,
  ENTERPRISE_UNLOCKS: () => ENTERPRISE_UNLOCKS,
  FIELD_REFERENCE_CREATE: () => FIELD_REFERENCE_CREATE,
  FIELD_REFERENCE_EDIT: () => FIELD_REFERENCE_EDIT,
  FOCUSED_STUDIO_SECTION_FIELDS: () => FOCUSED_STUDIO_SECTION_FIELDS,
  FOCUSED_STUDIO_SECTION_IDS: () => FOCUSED_STUDIO_SECTION_IDS,
  FOLLOW_UP_QUESTIONS: () => FOLLOW_UP_QUESTIONS,
  KNOWLEDGE_INGEST_JOB_VERSION: () => KNOWLEDGE_INGEST_JOB_VERSION,
  KNOWLEDGE_INGEST_QUEUE_NAME: () => KNOWLEDGE_INGEST_QUEUE_NAME,
  KNOWLEDGE_INLINE_TEXT_MAX_BYTES: () => KNOWLEDGE_INLINE_TEXT_MAX_BYTES,
  MAX_PRONUNCIATIONS: () => MAX_PRONUNCIATIONS,
  MCP_CONNECT_TIMEOUT_MS: () => MCP_CONNECT_TIMEOUT_MS,
  MCP_SERVER_TOOL_ID: () => MCP_SERVER_TOOL_ID,
  MINIMAL_TELEPHONY_CAPABILITIES: () => MINIMAL_TELEPHONY_CAPABILITIES,
  NOTIFICATION_CHANNELS: () => NOTIFICATION_CHANNELS,
  NOTIFICATION_JOB_VERSION: () => NOTIFICATION_JOB_VERSION,
  NOTIFICATION_QUEUE_NAME: () => NOTIFICATION_QUEUE_NAME,
  PLANS: () => PLANS,
  POST_CALL_JOB_VERSION: () => POST_CALL_JOB_VERSION,
  POST_CALL_QUEUE_NAME: () => POST_CALL_QUEUE_NAME,
  POST_CALL_RESULT_SCHEMA_VERSION: () => POST_CALL_RESULT_SCHEMA_VERSION,
  PUBLISHABLE_KEY_ALLOWED_SCOPES: () => PUBLISHABLE_KEY_ALLOWED_SCOPES,
  QUEUE_RETRY_DEFAULTS: () => QUEUE_RETRY_DEFAULTS,
  REALTIME_MODEL_COST_PER_MIN: () => REALTIME_MODEL_COST_PER_MIN,
  REST_OPERATION_COVERAGE: () => REST_OPERATION_COVERAGE,
  SDK_MCP_CAPABILITY_DISCOVERY: () => SDK_MCP_CAPABILITY_DISCOVERY,
  SECRET_KEY_ONLY_SCOPES: () => SECRET_KEY_ONLY_SCOPES,
  SECRET_NAME_PATTERN: () => SECRET_NAME_PATTERN,
  SERIALIZATION_OVERRIDES: () => SERIALIZATION_OVERRIDES,
  SERVER_FLAG_REQUIRED_SCOPES: () => SERVER_FLAG_REQUIRED_SCOPES,
  SESSION_END_REASON_LABELS: () => SESSION_END_REASON_LABELS,
  STANDARD_MODEL_COST_PER_MIN: () => STANDARD_MODEL_COST_PER_MIN,
  STUDIO_MODEL_PREFERENCE: () => STUDIO_MODEL_PREFERENCE,
  STUDIO_SUPPORTED_LANGUAGES: () => STUDIO_SUPPORTED_LANGUAGES,
  SUPPORTED_COUNTRIES: () => SUPPORTED_COUNTRIES,
  SUPPORTED_COUNTRY_CODES: () => SUPPORTED_COUNTRY_CODES,
  SYSTEM_VARIABLES: () => SYSTEM_VARIABLES,
  SYSTEM_VARIABLE_KEYS: () => SYSTEM_VARIABLE_KEYS,
  TRACE_ID_HEADER: () => TRACE_ID_HEADER,
  USAGE_IDEMPOTENCY_KEY_FIELDS: () => USAGE_IDEMPOTENCY_KEY_FIELDS,
  VOICEMAIL_END_REASONS: () => VOICEMAIL_END_REASONS,
  WEBHOOK_JOB_VERSION: () => WEBHOOK_JOB_VERSION,
  affectedByOf: () => affectedByOf,
  affectsOf: () => affectsOf,
  applyDerivedOnSerialize: () => applyDerivedOnSerialize,
  applyFlatDiff: () => applyFlatDiff,
  applyWritesToConfig: () => applyWritesToConfig,
  assertE164: () => assertE164,
  buildPlans: () => buildPlans,
  buildSystemBusinessValues: () => buildSystemBusinessValues,
  buildTranscriptText: () => buildTranscriptText,
  canonicalizeLlmProvider: () => canonicalizeLlmProvider,
  changedFocusedStudioSections: () => changedFocusedStudioSections,
  clarifyableKeys: () => clarifyableKeys,
  coerceTraceId: () => coerceTraceId,
  computeDateTimeVariables: () => computeDateTimeVariables,
  connectionStatus: () => connectionStatus,
  consentStatus: () => consentStatus,
  customStackCostPerMin: () => customStackCostPerMin,
  deepEqualConfigValue: () => deepEqualConfigValue,
  deltaCoversQuestion: () => deltaCoversQuestion,
  deriveExtractionFields: () => deriveExtractionFields2,
  deriveRequiredSlots: () => deriveRequiredSlots2,
  deriveUsageIdempotencyKey: () => deriveUsageIdempotencyKey,
  diffRequiresReinit: () => diffRequiresReinit,
  editableKeysForMode: () => editableKeysForMode,
  equalsE164: () => equalsE164,
  estimateSegmentDurationMs: () => estimateSegmentDurationMs,
  fieldsBySection: () => fieldsBySection,
  fieldsForApiSection: () => fieldsForApiSection,
  flattenDraft: () => flattenDraft,
  formatHumanRelativeTime: () => formatHumanRelativeTime,
  formatSessionEndReason: () => formatSessionEndReason,
  getConnectorCatalogEntry: () => getConnectorCatalogEntry,
  getFieldByKey: () => getFieldByKey,
  getMissingConfigQuestions: () => getMissingConfigQuestions,
  getNestedValue: () => getNestedValue,
  getPendingSetupQuestions: () => getPendingSetupQuestions,
  getSttLanguageSupport: () => getSttLanguageSupport,
  getSttModelCapabilities: () => getSttModelCapabilities,
  humanizeKey: () => humanizeKey2,
  hydrateDefaults: () => hydrateDefaults,
  hydrateTranscriptSegments: () => hydrateTranscriptSegments,
  inferCallerMetadataKey: () => inferCallerMetadataKey2,
  isAgentToolEnabled: () => isAgentToolEnabled,
  isApiKeyScope: () => isApiKeyScope,
  isCuratedBusinessType: () => isCuratedBusinessType,
  isDemoDialableCountry: () => isDemoDialableCountry,
  isE164: () => isE164,
  isKnownSessionEndReason: () => isKnownSessionEndReason,
  isRealtimeModel: () => isRealtimeModel,
  isSafeUrl: () => isSafeUrl,
  isSupportedCountry: () => isSupportedCountry2,
  isSupportedPhoneNumber: () => isSupportedPhoneNumber,
  isSuppressedByPolicy: () => isSuppressedByPolicy,
  isSystemVariable: () => isSystemVariable,
  isValidTraceId: () => isValidTraceId,
  isVoicemailEndReason: () => isVoicemailEndReason,
  isWithinCallingWindow: () => isWithinCallingWindow,
  listActiveConnectors: () => listActiveConnectors,
  listContextFields: () => listContextFields,
  mergePostCallConfig: () => mergePostCallConfig,
  newTraceId: () => newTraceId,
  normalizeE164: () => normalizeE164,
  normalizeKey: () => normalizeKey2,
  normalizePostCallConfig: () => normalizePostCallConfig,
  normalizeTranscriptRows: () => normalizeTranscriptRows,
  normalizeVariableAcquisition: () => normalizeVariableAcquisition2,
  phoneNumberCountry: () => phoneNumberCountry,
  phoneNumberIssue: () => phoneNumberIssue,
  pollUntil: () => pollUntil,
  populatedFocusedStudioSections: () => populatedFocusedStudioSections,
  pronunciationSupport: () => pronunciationSupport,
  providerIdsForTool: () => providerIdsForTool,
  publishRequiredKeys: () => publishRequiredKeys,
  readFocusedSectionField: () => readFocusedSectionField,
  readFromPayload: () => readFromPayload,
  readMcpServerBinding: () => readMcpServerBinding,
  registerVariable: () => registerVariable2,
  reinitKeys: () => reinitKeys,
  renderFieldReference: () => renderFieldReference,
  requiredConsentChannels: () => requiredConsentChannels,
  resolveManagedPricePerMin: () => resolveManagedPricePerMin,
  resolveSystemAlias: () => resolveSystemAlias,
  sanitizeTranscriptText: () => sanitizeTranscriptText,
  scalarContextKeys: () => scalarContextKeys,
  serializeSection: () => serializeSection,
  stackCostPerMin: () => stackCostPerMin,
  supportedCountry: () => supportedCountry,
  toSupportedE164: () => toSupportedE164,
  toToolCapabilitySafeView: () => toToolCapabilitySafeView,
  validateAgentTemplate: () => validateAgentTemplate,
  validatePublishConfig: () => validatePublishConfig,
  variablesFromRequiredSlots: () => variablesFromRequiredSlots2,
  writeToPayload: () => writeToPayload
});
var deriveExtractionFields2, deriveRequiredSlots2, humanizeKey2, inferCallerMetadataKey2, normalizeVariableAcquisition2, normalizeKey2, registerVariable2, variablesFromRequiredSlots2;
var init_dist2 = __esm({
  "../shared-types/dist/index.js"() {
    "use strict";
    init_core();
    init_notifications();
    init_postCall();
    init_publishValidation();
    init_transcript();
    init_agent();
    init_pronunciations();
    init_callerMemory();
    init_variables();
    init_studioCatalog();
    init_agentConfigSchema();
    init_businessTypes();
    init_flatDiff();
    init_pricing();
    init_billing();
    init_knowledge();
    init_agentTools();
    init_traceId();
    init_phone();
    init_pollUntil();
    init_runtimeReasonLabels();
    init_apiKeyScopes();
    init_privacyPolicy();
    init_telephonyEvents();
    init_queueContracts();
    init_observability();
    init_sdkParity();
    init_studioSections();
    init_relativeTime();
    init_chat();
    init_campaigns();
    init_agentTemplate();
    init_setupQuestions();
    init_languageCapabilities();
    init_sttCapabilities();
    init_managedAgentSkus();
    init_customBilling();
    init_systemVariables();
    init_dateTimeVariables();
    init_compliance();
    init_safeUrl();
    init_connectorCatalog();
    init_supportedCountries();
    deriveExtractionFields2 = deriveExtractionFields;
    deriveRequiredSlots2 = deriveRequiredSlots;
    humanizeKey2 = humanizeKey;
    inferCallerMetadataKey2 = inferCallerMetadataKey;
    normalizeVariableAcquisition2 = normalizeVariableAcquisition;
    normalizeKey2 = normalizeKey;
    registerVariable2 = registerVariable;
    variablesFromRequiredSlots2 = variablesFromRequiredSlots;
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
      BILLING_WRITE: () => BILLING_WRITE,
      defineTool: () => defineTool,
      keyAllowsTool: () => keyAllowsTool2,
      opsToolCatalog: () => opsToolCatalog2,
      resolveToolDisposition: () => resolveToolDisposition,
      withWorkspaceParam: () => withWorkspaceParam2
    });
    module2.exports = __toCommonJS2(index_exports);
    var BILLING_WRITE = "billing:write";
    function defineTool(def) {
      return def;
    }
    function keyAllowsTool2(tool, key) {
      if (tool.keyScopes.includes(BILLING_WRITE)) return false;
      if (key.legacy === true) return true;
      return tool.keyScopes.every((scope) => key.scopes.includes(scope));
    }
    var PRIVILEGED = /* @__PURE__ */ new Set(["owner", "admin"]);
    function resolveToolDisposition(p) {
      if (p.risk === "read") return "execute";
      if (p.scope === "account" && !PRIVILEGED.has(p.role)) return "deny";
      return p.risk === "write" ? "propose" : "confirm";
    }
    var import_zod = require("zod");
    var import_shared_types = (init_dist2(), __toCommonJS(dist_exports));
    var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    var norm2 = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    async function resolveAgentId(client, agentId) {
      const raw = String(agentId ?? "").trim();
      if (UUID_RE.test(raw)) return raw;
      const { agents } = await client.agents.list({ limit: 500 });
      const target = norm2(raw);
      const matches = agents.filter((a) => norm2(a.name ?? "") === target);
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
      llm_provider: import_zod.z.enum(import_shared_types.AGENT_LLM_PROVIDERS).optional(),
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
      azure: "openai",
      grok: "xai",
      "x.ai": "xai"
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
        routes: ["GET /v1/agents"],
        keyScopes: ["agents:read"],
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
        routes: ["GET /v1/agents/:id"],
        keyScopes: ["agents:read"],
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.retrieve(agent_id)
      }),
      defineTool({
        name: "list_llm_options",
        description: "Fetch all available LLM models and voices you can use when creating or updating an agent. Always call this before create_agent to pick valid values.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agents/llm-options"],
        keyScopes: ["agents:read"],
        input: {},
        run: (client) => client.agents.llmOptions()
      }),
      defineTool({
        name: "list_voices",
        description: "List available agent/TTS voices, optionally filtered by provider or model. Much smaller payload than list_llm_options \u2014 use this to pick a `voice` value for create_agent/update_agent.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agents/llm-options"],
        keyScopes: ["agents:read"],
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
        routes: ["POST /v1/agents/stack-preview"],
        keyScopes: ["agents:write"],
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
        routes: ["GET /v1/agents/:id/calls"],
        keyScopes: ["agents:read"],
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
        routes: ["POST /v1/agents/validate-publish"],
        keyScopes: ["agents:write"],
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
        routes: ["GET /v1/agents/:id", "POST /v1/agents/apply-changes"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["POST /v1/agents/enrich-company"],
        keyScopes: ["agents:write"],
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
        routes: ["POST /v1/agents/generate"],
        keyScopes: ["agents:write"],
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
        routes: ["POST /v1/agents"],
        keyScopes: ["agents:write"],
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
        routes: ["GET /v1/agents", "PUT /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/agents", "DELETE /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
        input: { agent_id: import_zod.z.string().uuid().describe("The agent UUID to delete") },
        run: async (client, { agent_id }) => client.agents.delete(await resolveAgentId(client, agent_id))
      }),
      defineTool({
        name: "clone_agent",
        description: 'Duplicate an existing agent. The copy gets " (Copy)" appended to its name.',
        scope: "agent",
        risk: "write",
        routes: ["GET /v1/agents", "POST /v1/agents/:id/clone"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/calls"],
        keyScopes: ["calls:read"],
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
        routes: ["GET /v1/calls/active"],
        keyScopes: ["calls:read"],
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
        routes: ["GET /v1/calls/:id"],
        keyScopes: ["calls:read"],
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.retrieve(call_id)
      }),
      defineTool({
        name: "get_call_summary",
        description: "Retrieve the post-call summary for a call.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/calls/:id/summary"],
        keyScopes: ["calls:read"],
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.summary(call_id)
      }),
      defineTool({
        name: "get_call_transcript",
        description: "Retrieve the full transcript for a call. May contain personal data \u2014 handle accordingly.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/calls/:id/transcript"],
        keyScopes: ["calls:read"],
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.transcript(call_id)
      }),
      defineTool({
        name: "get_call_recording",
        description: "Retrieve recording metadata (e.g. playback URL) for a call, when recording is enabled.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/calls/:id/recording"],
        keyScopes: ["calls:read"],
        input: { call_id: import_zod2.z.string().describe("The call ID") },
        run: (client, { call_id }) => client.calls.recording(call_id)
      }),
      defineTool({
        name: "get_call_queue_stats",
        description: "Retrieve current outbound call queue statistics.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/calls/queue/stats"],
        keyScopes: ["calls:read"],
        input: {},
        run: (client) => client.calls.queueStats()
      }),
      defineTool({
        name: "reprocess_call",
        description: "Re-run post-call intelligence (summary, extraction, evaluation) for a call.",
        scope: "agent",
        risk: "write",
        routes: ["POST /v1/calls/:id/reprocess"],
        keyScopes: ["calls:write"],
        input: { call_id: import_zod2.z.string().describe("The call ID to reprocess") },
        run: (client, { call_id }) => client.calls.reprocess(call_id)
      }),
      defineTool({
        name: "create_call",
        description: "WARNING: places a real, billable PSTN call. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account \u2014 omit it to use the agent's attached number. `identity` is the destination in strict E.164 (e.g. +15555550123).",
        scope: "agent",
        risk: "sensitive",
        routes: ["POST /v1/calls"],
        keyScopes: ["calls:write"],
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
        routes: ["POST /v1/calls/batch"],
        keyScopes: ["calls:write"],
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
        routes: ["POST /v1/calls/:id/end"],
        keyScopes: ["calls:write"],
        input: { call_id: import_zod2.z.string().describe("The call ID to end") },
        run: (client, { call_id }) => client.calls.end(call_id)
      }),
      defineTool({
        name: "add_call_participant",
        description: "WARNING: dials and adds a participant to a live call. PSTN additions are billable.",
        scope: "agent",
        risk: "sensitive",
        routes: ["POST /v1/calls/:id/participants"],
        keyScopes: ["calls:write"],
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
        routes: ["GET /v1/numbers"],
        keyScopes: ["numbers:read"],
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
        routes: ["POST /v1/numbers"],
        keyScopes: ["numbers:write"],
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
        routes: ["POST /v1/numbers/:number/attach"],
        keyScopes: ["numbers:write"],
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
        routes: ["DELETE /v1/numbers/:number"],
        keyScopes: ["numbers:write"],
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
        routes: ["GET /v1/telephony/status"],
        keyScopes: ["numbers:read"],
        input: {},
        run: (client) => client.telephony.status()
      }),
      defineTool({
        name: "list_telephony_numbers",
        description: "List numbers available on the connected telephony carrier account.",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/telephony/numbers"],
        keyScopes: ["numbers:read"],
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
        routes: ["GET /v1/keys/publishable"],
        keyScopes: ["keys:read"],
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
        routes: ["GET /v1/agents/:id/knowledge-sources"],
        keyScopes: ["knowledge:read"],
        input: { agent_id: import_zod4.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.listKnowledgeSources(agent_id)
      }),
      defineTool({
        name: "list_agent_changes",
        description: "List recorded configuration changes for an agent (for auditing or before an undo).",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agents/:id/changes"],
        keyScopes: ["agents:read"],
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
        routes: ["POST /v1/agents/:id/knowledge-sources"],
        keyScopes: ["knowledge:write"],
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
        routes: ["DELETE /v1/agents/:id/knowledge-sources/:sourceId"],
        keyScopes: ["knowledge:write"],
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
        routes: ["POST /v1/agents/:id/changes/:changeId/undo"],
        keyScopes: ["agents:write"],
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
        routes: ["GET /v1/billing/usage-summary"],
        keyScopes: ["billing:read"],
        input: {},
        run: (client) => client.billing.usageSummary()
      }),
      defineTool({
        name: "list_agent_templates",
        description: "List published agent templates. Use a template's `defaults` as the starting config for create_agent.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agent-templates"],
        keyScopes: ["agents:read"],
        input: {},
        run: (client) => client.templates.list()
      }),
      defineTool({
        name: "list_eval_runs",
        description: "List previous evaluation runs for an agent.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agents/:id/evals/runs"],
        keyScopes: ["agents:read"],
        input: { agent_id: import_zod5.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.listEvalRuns(agent_id)
      }),
      defineTool({
        name: "get_eval_run",
        description: "Retrieve a single evaluation run, including per-scenario scores.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/agents/:id/evals/runs/:runId"],
        keyScopes: ["agents:read"],
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
        routes: ["POST /v1/agents/:id/evals/run"],
        keyScopes: ["agents:write"],
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
        routes: ["POST /v1/agents/evals/suite"],
        keyScopes: ["agents:write"],
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
        routes: ["GET /v1/agents", "POST /v1/agents/:id/publish"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/dnc"],
        keyScopes: ["contacts:read"],
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
        routes: ["POST /v1/dnc/check"],
        keyScopes: ["contacts:write"],
        input: { phone_numbers: import_zod7.z.array(import_zod7.z.string()).min(1).max(500).describe("E.164 numbers to check") },
        run: (client, { phone_numbers }) => client.dnc.check({ phone_numbers })
      }),
      defineTool({
        name: "add_dnc",
        description: "Add a phone number to the Do-Not-Call registry so outbound calls to it are blocked.",
        scope: "account",
        risk: "write",
        routes: ["POST /v1/dnc"],
        keyScopes: ["contacts:write"],
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
        routes: ["POST /v1/dnc/batch"],
        keyScopes: ["contacts:write"],
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
        routes: ["DELETE /v1/dnc/:phone"],
        keyScopes: ["contacts:write"],
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
        routes: ["GET /v1/webhooks"],
        keyScopes: ["webhooks:read"],
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
        routes: ["POST /v1/webhooks"],
        keyScopes: ["webhooks:write"],
        input: {
          url: import_zod8.z.string().url().describe("Public https endpoint"),
          events: import_zod8.z.array(import_zod8.z.string()).min(1).describe("Event names to subscribe to"),
          secret: import_zod8.z.string().min(16).max(256).optional().describe("Signing secret; auto-generated if omitted"),
          alert_email: import_zod8.z.string().email().optional()
        },
        run: async (client, { url, events, secret, alert_email }) => {
          const finalSecret = secret ?? (0, import_crypto.randomBytes)(24).toString("hex");
          const result2 = await client.webhooks.create({ url, events, secret: finalSecret, alert_email });
          return secret ? result2 : { ...result2, secret: finalSecret, secret_notice: "Store this secret now \u2014 it cannot be retrieved later." };
        }
      }),
      defineTool({
        name: "update_webhook",
        description: "Update a webhook endpoint. Only provided fields change. Pass `secret` to rotate it.",
        scope: "account",
        risk: "write",
        routes: ["PATCH /v1/webhooks/:id"],
        keyScopes: ["webhooks:write"],
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
        routes: ["DELETE /v1/webhooks/:id"],
        keyScopes: ["webhooks:write"],
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
        routes: ["POST /v1/billing/estimate"],
        keyScopes: ["agents:read"],
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
        routes: ["PUT /v1/billing/auto-recharge"],
        keyScopes: [BILLING_WRITE],
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
        routes: ["PUT /v1/billing/alerts"],
        keyScopes: [BILLING_WRITE],
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
        routes: ["GET /v1/campaigns"],
        keyScopes: ["campaigns:read"],
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
        routes: ["GET /v1/campaigns/:id"],
        keyScopes: ["campaigns:read"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.get(campaign_id)
      }),
      defineTool({
        name: "get_campaign_report",
        description: "Retrieve the campaign report: stat_* summary counters plus outcome/sentiment/hourly/snapshot distributions. Cost is reported in credits, durations in minutes.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/campaigns/:id/report"],
        keyScopes: ["campaigns:read"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.report(campaign_id)
      }),
      defineTool({
        name: "list_campaign_attempts",
        description: "List a campaign's dial attempts, paginated.",
        scope: "agent",
        risk: "read",
        routes: ["GET /v1/campaigns/:id/attempts"],
        keyScopes: ["campaigns:read"],
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
        routes: ["GET /v1/campaigns/:id/suggestions"],
        keyScopes: ["campaigns:read"],
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
        routes: ["GET /v1/contacts"],
        keyScopes: ["contacts:read"],
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
        routes: ["POST /v1/campaigns"],
        keyScopes: ["campaigns:write"],
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
        routes: ["POST /v1/campaigns/:id/members/import"],
        keyScopes: ["campaigns:write"],
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
        routes: ["POST /v1/campaigns/:id/launch"],
        keyScopes: ["campaigns:write"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to launch") },
        run: (client, { campaign_id }) => client.campaigns.launch(campaign_id)
      }),
      defineTool({
        name: "pause_campaign",
        description: "Pause a running campaign. In-flight calls finish naturally; no new attempts are scheduled until resumed.",
        scope: "agent",
        risk: "write",
        routes: ["POST /v1/campaigns/:id/pause"],
        keyScopes: ["campaigns:write"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to pause") },
        run: (client, { campaign_id }) => client.campaigns.pause(campaign_id)
      }),
      defineTool({
        name: "resume_campaign",
        description: "Resume a paused campaign. WARNING: resuming re-enables outbound dialing and will incur further per-minute charges as attempts continue.",
        scope: "agent",
        risk: "sensitive",
        routes: ["POST /v1/campaigns/:id/resume"],
        keyScopes: ["campaigns:write"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID to resume") },
        run: (client, { campaign_id }) => client.campaigns.resume(campaign_id)
      }),
      defineTool({
        name: "accept_campaign_suggestion",
        description: "Accept an improvement suggestion. Agent-editing suggestions create an agent-changes draft for review; campaign-policy suggestions patch the campaign directly.",
        scope: "agent",
        risk: "write",
        routes: ["POST /v1/campaigns/:id/suggestions/:suggestionId/accept"],
        keyScopes: ["campaigns:write"],
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
        routes: ["GET /v1/campaigns/:id/intake"],
        keyScopes: ["campaigns:read"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.intake.get(campaign_id)
      }),
      defineTool({
        name: "set_campaign_intake",
        description: 'Create a lead-intake URL for a campaign, or update its settings. Lead sources (website forms, Typeform, Google Apps Script, Zapier/Make) POST leads to the URL with no API key; a running campaign dials them within its calling window. The URL is returned ONCE on create (url: null on later updates) and anyone holding it can add numbers to the campaign. assume_voice_consent=true treats every posted lead as consenting to calls; default_country (e.g. "IN") makes local numbers without +<code> dialable.',
        scope: "agent",
        risk: "sensitive",
        routes: ["PUT /v1/campaigns/:id/intake"],
        keyScopes: ["campaigns:write"],
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
        routes: ["POST /v1/campaigns/:id/intake/rotate"],
        keyScopes: ["campaigns:write"],
        input: { campaign_id: import_zod10.z.string().describe("The campaign ID") },
        run: (client, { campaign_id }) => client.campaigns.intake.rotate(campaign_id)
      }),
      defineTool({
        name: "disable_campaign_intake",
        description: "Remove a campaign's lead-intake URL. Leads already accepted stay in the campaign.",
        scope: "agent",
        risk: "write",
        routes: ["DELETE /v1/campaigns/:id/intake"],
        keyScopes: ["campaigns:write"],
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
        routes: ["GET /v1/agents", "GET /v1/agents/:id"],
        keyScopes: ["agents:read"],
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
        routes: ["GET /v1/agents", "GET /v1/agents/:id", "PUT /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/agents", "GET /v1/agents/:id", "PUT /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/agents", "GET /v1/agents/:id", "PUT /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/agents", "GET /v1/agents/:id", "PUT /v1/agents/:id"],
        keyScopes: ["agents:read", "agents:write"],
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
        routes: ["GET /v1/tool-secrets"],
        keyScopes: ["connections:read"],
        input: {},
        run: (client) => client.toolSecrets.list()
      }),
      defineTool({
        name: "set_tool_secret",
        description: 'Create or replace a workspace secret for API-tool headers, referenced as "{{secrets.NAME}}" (e.g. header x-api-key: "{{secrets.RESERVATIONS_API_KEY}}"). The value is encrypted, write-only, and only ever sent to `host`. Replacing an existing name changes it for every agent that references it.',
        scope: "account",
        risk: "sensitive",
        routes: ["PUT /v1/tool-secrets/:name"],
        keyScopes: ["connections:write"],
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
        routes: ["GET /v1/agents/:id/testers"],
        keyScopes: ["agents:read"],
        input: { agent_id: import_zod12.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.getShareLink(agent_id)
      }),
      defineTool({
        name: "set_share_link",
        description: "Create an agent's public share link, or update its settings. Anyone with the URL can talk to the agent in a browser, billed to this workspace. Defaults on create: 30-minute pool, 300 s per call, 2 concurrent calls, 3 calls per IP per hour. Set enabled=false to switch the link off.",
        scope: "agent",
        risk: "sensitive",
        routes: ["PUT /v1/agents/:id/share-link"],
        keyScopes: ["agents:write"],
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
        routes: ["POST /v1/agents/:id/share-link/regenerate"],
        keyScopes: ["agents:write"],
        input: { agent_id: import_zod12.z.string().uuid().describe("The agent UUID") },
        run: (client, { agent_id }) => client.agents.regenerateShareLink(agent_id)
      })
    ];
    var import_zod13 = require("zod");
    var workspaceTools = [
      defineTool({
        name: "list_workspaces",
        description: "List the workspaces this credential can act in, marking the current one. Client workspaces show their agency in parent_id. Act in another by setting RYMI_WORKSPACE (local MCP) or the Rymi-Workspace header.",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/workspaces"],
        keyScopes: [],
        input: {},
        run: (client) => client.workspaces.list()
      }),
      defineTool({
        name: "create_workspace",
        description: "Create a workspace in an account you own or administer. The account pays for its calls. New workspaces don't get the free monthly credit.",
        scope: "account",
        risk: "write",
        routes: ["POST /v1/workspaces"],
        keyScopes: ["workspaces:write"],
        input: {
          name: import_zod13.z.string().min(1).max(80).describe("Workspace name"),
          operating_country: import_zod13.z.string().length(2).optional().describe('ISO-3166 alpha-2 country, e.g. "IN"'),
          parent: import_zod13.z.string().optional().describe("Any workspace in the account to create it in (defaults to the current account).")
        },
        run: (client, params) => client.workspaces.create(params)
      }),
      defineTool({
        name: "get_workspace_usage",
        description: "Calls, minutes and credits for one workspace in a calendar month (UTC). Use it to bill a customer for one workspace. Credits are left out for the client and viewer roles.",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/workspaces/:id/usage"],
        keyScopes: ["analytics:read"],
        input: {
          workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces"),
          month: import_zod13.z.string().regex(/^\d{4}-\d{2}$/).optional().describe("YYYY-MM; default this month")
        },
        run: (client, params) => client.workspaces.usage(params.workspace_id, { month: params.month })
      }),
      defineTool({
        name: "update_workspace",
        description: "Rename a workspace, change its operating country, or set its monthly spend cap in credits (1 credit = $0.01; null removes the cap). Calls in that workspace stop at the cap until next month. The cap needs an account Owner or Admin.",
        scope: "account",
        risk: "write",
        routes: ["PATCH /v1/workspaces/:id"],
        keyScopes: ["workspaces:write"],
        input: {
          workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces"),
          name: import_zod13.z.string().min(1).max(80).optional().describe("New name"),
          operating_country: import_zod13.z.string().length(2).nullable().optional().describe('ISO-3166 alpha-2 country, e.g. "IN"; null clears it'),
          spend_cap_cents_monthly: import_zod13.z.number().int().min(0).nullable().optional().describe("Monthly cap in credits; null removes it")
        },
        run: (client, { workspace_id, ...patch }) => client.workspaces.update(workspace_id, patch)
      }),
      defineTool({
        name: "delete_workspace",
        description: "Delete an empty workspace: no agents, numbers, calls or campaigns left in it. Only the account Owner may. The account's primary workspace can't be deleted.",
        scope: "account",
        risk: "sensitive",
        routes: ["DELETE /v1/workspaces/:id"],
        keyScopes: ["workspaces:write"],
        input: { workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces") },
        run: (client, params) => client.workspaces.delete(params.workspace_id)
      }),
      defineTool({
        name: "list_workspace_members",
        description: "People in a workspace and their roles (admin, editor, client, viewer).",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/workspaces/:id/members"],
        keyScopes: ["workspace_members:read"],
        input: { workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces") },
        run: (client, params) => client.workspaces.listMembers(params.workspace_id)
      }),
      defineTool({
        name: "add_workspace_member",
        description: "Add a person by email with a workspace role: admin, editor, client (sees calls and minutes, edits contacts, the do-not-call list, knowledge and the transfer number) or viewer (reads what a client sees). The role defaults to client. Someone without a Rymi account gets an invite email.",
        scope: "account",
        risk: "sensitive",
        routes: ["POST /v1/workspaces/:id/members"],
        keyScopes: ["workspace_members:write"],
        input: {
          workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces"),
          email: import_zod13.z.string().email().describe("Their email address"),
          role: import_zod13.z.enum(["admin", "editor", "client", "viewer"]).optional().describe("Workspace role; default client")
        },
        run: (client, { workspace_id, ...member }) => client.workspaces.addMember(workspace_id, member)
      }),
      defineTool({
        name: "remove_workspace_member",
        description: "Remove a person's role in a workspace.",
        scope: "account",
        risk: "sensitive",
        routes: ["DELETE /v1/workspaces/:id/members/:userId"],
        keyScopes: ["workspace_members:write"],
        input: {
          workspace_id: import_zod13.z.string().describe("Workspace id from list_workspaces"),
          user_id: import_zod13.z.string().describe("user_id from list_workspace_members")
        },
        run: (client, params) => client.workspaces.removeMember(params.workspace_id, params.user_id)
      })
    ];
    var import_zod14 = require("zod");
    var rules = import_zod14.z.object({
      calling_hours: import_zod14.z.object({ start_hour: import_zod14.z.number().int().min(0).max(23), end_hour: import_zod14.z.number().int().min(1).max(24) }).nullable().optional().describe("Callee-local calling hours; null = any hour"),
      dnc_check: import_zod14.z.boolean().optional().describe("Check the workspace do-not-call list before calls"),
      require_voice_consent: import_zod14.z.boolean().optional().describe("Require recorded voice consent on the contact"),
      recording_notice: import_zod14.z.boolean().optional().describe("Recording notice default for new agents"),
      destination_countries: import_zod14.z.array(import_zod14.z.string().length(2)).nullable().optional().describe("Countries this workspace may call; null = all supported"),
      apply_to_single_calls: import_zod14.z.boolean().optional().describe("Also apply hours and consent to single calls")
    }).partial();
    var complianceTools = [
      defineTool({
        name: "get_compliance_settings",
        description: "Read the workspace's compliance settings: operating country, callee-local calling hours, do-not-call check, voice consent, recording-notice default and allowed destination countries. Compliance is the customer's responsibility; these settings help.",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/compliance/settings"],
        keyScopes: ["compliance:read"],
        input: {},
        run: (client) => client.compliance.getSettings()
      }),
      defineTool({
        name: "update_compliance_settings",
        description: "Change the workspace's compliance settings. Setting operating_country fills every setting not already edited from that country's preset. Blocked calls fail with destination_not_allowed, outside_calling_hours or no_voice_consent.",
        scope: "account",
        risk: "write",
        routes: ["PUT /v1/compliance/settings"],
        keyScopes: ["compliance:write"],
        input: {
          operating_country: import_zod14.z.string().length(2).nullable().optional().describe('ISO country, e.g. "IN"'),
          rules: rules.optional()
        },
        run: (client, params) => client.compliance.updateSettings(params)
      })
    ];
    var import_zod15 = require("zod");
    var accountId = import_zod15.z.string().describe("Account id from list_accounts");
    var accountTools = [
      defineTool({
        name: "list_accounts",
        description: "List the accounts you belong to and your role in each (owner, admin, or billing).",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/accounts"],
        keyScopes: [],
        input: {},
        run: (client) => client.accounts.list()
      }),
      defineTool({
        name: "list_account_members",
        description: "List people in an account and their roles (owner, admin, billing).",
        scope: "account",
        risk: "read",
        routes: ["GET /v1/accounts/:id/members"],
        keyScopes: ["account_members:read"],
        input: { account_id: accountId },
        run: (client, { account_id }) => client.accounts.members.list(account_id)
      }),
      defineTool({
        name: "add_account_member",
        description: "Add a person to an account by email, with role owner, admin, or billing. An owner can grant owner. An admin can grant admin or billing.",
        scope: "account",
        risk: "sensitive",
        routes: ["POST /v1/accounts/:id/members"],
        keyScopes: ["account_members:write"],
        input: {
          account_id: accountId,
          email: import_zod15.z.string().email().describe("Their email address"),
          role: import_zod15.z.enum(["owner", "admin", "billing"]).describe("Account role")
        },
        run: (client, { account_id, email, role }) => client.accounts.members.add(account_id, { email, role })
      }),
      defineTool({
        name: "remove_account_member",
        description: "Remove a person from an account. The last owner stays.",
        scope: "account",
        risk: "sensitive",
        routes: ["DELETE /v1/accounts/:id/members/:userId"],
        keyScopes: ["account_members:write"],
        input: {
          account_id: accountId,
          user_id: import_zod15.z.string().describe("User id from list_account_members")
        },
        run: (client, { account_id, user_id }) => client.accounts.members.remove(account_id, user_id)
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
    function publish(tools) {
      return tools.map((t) => ({
        ...t,
        run: async (client, params) => redactToolSecrets(await t.run(client, params))
      }));
    }
    var opsToolCatalog2 = [
      ...publish(agentTools),
      ...publish(agentToolBindingTools),
      ...publish(callTools),
      ...publish(numberTools),
      ...publish(telephonyTools),
      ...publish(keyTools),
      ...publish(knowledgeTools),
      ...publish(insightTools),
      ...publish(publishTools),
      ...publish(dncTools),
      ...publish(webhookTools),
      ...publish(billingTools),
      ...publish(campaignTools),
      ...publish(shareLinkTools),
      ...publish(workspaceTools),
      ...publish(complianceTools),
      ...publish(accountTools)
    ];
    var names = /* @__PURE__ */ new Set();
    for (const tool of opsToolCatalog2) {
      if (names.has(tool.name)) throw new Error(`Duplicate ops tool name: ${tool.name}`);
      names.add(tool.name);
    }
    var import_zod16 = require("zod");
    var WORKSPACE = import_zod16.z.string().optional().describe("Act in this workspace, e.g. one of your client workspaces (id from list_workspaces). Default: the workspace this connection uses.");
    function withWorkspaceParam2(tool) {
      return {
        ...tool,
        input: { ...tool.input, workspace: WORKSPACE },
        run: (client, params) => {
          const { workspace, ...rest } = params;
          return tool.run(typeof workspace === "string" && workspace ? client.withWorkspace(workspace) : client, rest);
        }
      };
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
  version: "2.8.1",
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
var RETRY_DELAYS_MS = [500, 1500];
async function readKeyScopes(rymi, delays) {
  for (let attempt = 0; ; attempt++) {
    try {
      const self = await rymi.keys.self();
      return { scopes: self.scopes ?? [], legacy: self.legacy === true };
    } catch (err) {
      const status = err.status;
      const final = status !== void 0 && status >= 400 && status < 500;
      if (final || attempt >= delays.length) {
        process.stderr.write(
          `Warning: could not read this key's scopes from GET /v1/keys/self (${err instanceof Error ? err.message : String(err)}). Serving read-only tools. Restart once the API is reachable; @rymi/mcp needs a Rymi API with /v1/keys/self.
`
        );
        return null;
      }
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
    }
  }
}
async function createServer(apiKey2, options = {}) {
  const rymi = new import_node.default({ apiKey: apiKey2 });
  const key = await readKeyScopes(rymi, options.retryDelaysMs ?? RETRY_DELAYS_MS);
  const server = new import_mcp.McpServer({
    name: "rymi",
    version: package_default.version
  });
  const isReadOnly = process.env.RYMI_MCP_READONLY === "1" || key === null;
  for (const tool of import_ops_tools.opsToolCatalog.map(import_ops_tools.withWorkspaceParam)) {
    if (isReadOnly && tool.risk !== "read") continue;
    if (key && !(0, import_ops_tools.keyAllowsTool)(tool, key)) continue;
    server.tool(
      tool.name,
      tool.description,
      tool.input,
      withToolErrors(async (params) => {
        const result2 = await tool.run(rymi, params);
        return { content: [{ type: "text", text: JSON.stringify(result2, null, 2) }] };
      })
    );
  }
  return server;
}

// src/transport/stdio.ts
var import_stdio = require("@modelcontextprotocol/sdk/server/stdio.js");
async function runStdio(server) {
  const transport2 = new import_stdio.StdioServerTransport();
  await server.connect(transport2);
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
createServer(apiKey).then((server) => runStdio(server)).catch((err) => {
  process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}
`);
  process.exit(1);
});
