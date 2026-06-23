import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

/**
 * Shared agent-configuration fields accepted by both create_agent and
 * update_agent. Kept in one place so the two tools never drift. These mirror
 * the canonical AgentPayload shape (packages/shared-types/src/agent.ts) and the
 * fields consumed by the API mutation service. `provider_config` is
 * intentionally omitted — the server always recomputes it from role + supported
 * languages, so accepting it from a client would be misleading.
 */
const agentConfigFields = {
    system_prompt: z.string().optional().describe('Full system prompt for the agent. If given without persona/playbook, the server auto-structures it.'),
    voice: z.string().optional().describe('Voice ID (e.g. "Aoede", "Charon"). Call list_llm_options for valid values. Leave empty for realtime LLMs and Deepgram TTS, which carry their own voice.'),
    language: z.string().optional().describe('Primary BCP-47 language tag (e.g. "hi-IN", "en-US").'),
    supported_languages: z.array(z.string()).optional().describe('All BCP-47 languages the agent should handle, e.g. ["hi-IN","en-US"] for a bilingual agent. The primary `language` is added automatically if omitted here.'),
    llm_provider: z.enum(['gemini', 'openai', 'anthropic', 'sarvam']).optional(),
    llm_model: z.string().optional().describe('LLM model id from list_llm_options (e.g. "gemini-2.5-flash", "sarvam-m"). Must fit the agent_role cost tier.'),
    llm_fallback_provider: z.string().nullable().optional().describe('Fallback LLM provider; null clears it.'),
    llm_fallback_model: z.string().nullable().optional().describe('Fallback LLM model; null clears it.'),
    stt_provider: z.string().optional().describe('Speech-to-text provider (e.g. "deepgram", "sarvam").'),
    stt_model: z.string().optional(),
    stt_fallback_provider: z.string().nullable().optional(),
    stt_fallback_model: z.string().nullable().optional(),
    tts_provider: z.string().optional().describe('Text-to-speech provider (e.g. "elevenlabs", "sarvam", "cartesia").'),
    tts_model: z.string().optional(),
    tts_fallback_provider: z.string().nullable().optional(),
    tts_fallback_model: z.string().nullable().optional(),
    custom_llm_url: z.string().nullable().optional().describe('Self-hosted LLM endpoint (https:// or wss://). Enterprise only; null clears.'),
    custom_voice_url: z.string().nullable().optional().describe('Self-hosted TTS endpoint (https:// or wss://). Enterprise only; null clears.'),
    custom_voice_mode: z.enum(['rymi', 'openai-compat']).optional().describe('Wire format for custom_voice_url.'),
    custom_transcriber_url: z.string().nullable().optional().describe('Self-hosted STT endpoint (https:// or wss://). Enterprise only; null clears.'),
    agent_role: z.enum(['operator', 'specialist', 'executive', 'concierge']).optional().describe('Cost/capability tier. "concierge" unlocks realtime models; higher tiers cost more.'),
    prompt_mode: z.enum(['builder', 'raw']).optional().describe('How the system prompt is interpreted: "builder" (server structures persona/playbook from system_prompt) or "raw" (use system_prompt verbatim — requires system_prompt). Defaults to "builder".'),
    persona: z.record(z.any()).optional().describe('Persona object. Note: callerPersonas must be objects of shape {type, approach, detectedWhen}, NOT plain strings.'),
    playbook: z.record(z.any()).optional().describe('Playbook configuration object'),
    advanced: z.record(z.any()).optional(),
    features: z.record(z.any()).optional(),
    post_call: z.record(z.any()).optional(),
} as const;

type ToolResult = { content: Array<{ type: 'text'; text: string }>; isError?: boolean };

/** Wrap a successful payload as a tool result. */
function ok(result: unknown): ToolResult {
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
}

/**
 * Surface an SDK/API failure (e.g. a RymiError from the role↔model tier guard)
 * as a clean, structured tool error instead of a raw thrown rejection, so the
 * calling model gets an actionable {error, code} payload.
 */
function fail(err: unknown): ToolResult {
    const e = err as { message?: string; code?: string; status?: number };
    const body: Record<string, unknown> = { error: e?.message || String(err) };
    if (e?.code) body.code = e.code;
    if (e?.status) body.status = e.status;
    return { isError: true, content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
}

/**
 * The API reads prompt mode from `advanced.prompt_mode`. Accept it as a
 * first-class `prompt_mode` param on the tools and fold it into `advanced`
 * before dispatch so callers don't have to know the nesting.
 */
function foldPromptMode<T extends { prompt_mode?: 'builder' | 'raw'; advanced?: Record<string, any> }>(params: T) {
    const { prompt_mode, ...rest } = params;
    if (!prompt_mode) return rest;
    return { ...rest, advanced: { ...(rest.advanced || {}), prompt_mode } };
}

export function registerAgentTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'list_agents',
        'List all your Rymi AI voice agents.',
        {
            limit: z.number().int().min(1).max(500).optional().describe('Max agents to return (default 50)'),
            offset: z.number().int().min(0).optional().describe('Pagination offset'),
        },
        async ({ limit, offset }) => {
            const result = await rymi.agents.list({ limit, offset });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_agent',
        'Retrieve a single Rymi voice agent by ID.',
        { agent_id: z.string().uuid().describe('The agent UUID') },
        async ({ agent_id }) => {
            const result = await rymi.agents.retrieve(agent_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_llm_options',
        'Fetch all available LLM models and voices you can use when creating or updating an agent. Always call this before create_agent to pick valid values.',
        {},
        async () => {
            const result = await rymi.agents.llmOptions();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_voices',
        'List available agent/TTS voices, optionally filtered by provider or model. Much smaller payload than list_llm_options — use this to pick a `voice` value for create_agent/update_agent.',
        {
            provider: z.string().optional().describe('Filter to one voice provider, e.g. "elevenlabs", "sarvam", "gemini", "cartesia", "deepgram".'),
            model_id: z.string().optional().describe('Filter to voices compatible with a given model id (matched against the voice\'s supported_model_ids).'),
        },
        async ({ provider, model_id }) => {
            const { voices } = await rymi.agents.llmOptions();
            let filtered = Array.isArray(voices) ? voices : [];
            if (provider) {
                const p = provider.toLowerCase();
                filtered = filtered.filter((v: any) => String(v?.provider || '').toLowerCase() === p);
            }
            if (model_id) {
                filtered = filtered.filter((v: any) => Array.isArray(v?.supported_model_ids) && v.supported_model_ids.includes(model_id));
            }
            const trimmed = filtered.map((v: any) => ({
                id: v?.id,
                provider: v?.provider,
                name: v?.name,
                label: v?.label,
                gender: v?.gender,
                supported_model_ids: v?.supported_model_ids,
                byok_required: v?.byok_required,
                preview_url: v?.preview_url,
            }));
            return { content: [{ type: 'text', text: JSON.stringify({ voices: trimmed, total: trimmed.length }, null, 2) }] };
        }
    );

    server.tool(
        'preview_stack',
        'Preview the resolved per-language model stack (STT/LLM/TTS), blockers, warnings, model diffs, and any required role upgrades for a set of supported languages — without saving. Use before create/update to confirm a multi-language setup is valid. Note: the concierge (realtime) role is not supported here.',
        {
            supported_languages: z.array(z.string()).min(1).describe('BCP-47 languages to resolve a stack for, e.g. ["hi-IN","en-US"].'),
            agent_role: z.enum(['operator', 'specialist', 'executive']).optional().describe('Role to resolve the stack for (default operator).'),
            language: z.string().optional().describe('Primary BCP-47 language (defaults to the first supported language).'),
            current_provider_config: z.record(z.any()).optional().describe('Existing provider_config to diff against, if any.'),
        },
        async (params) => {
            const result = await rymi.agents.previewStack(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    if (!isReadOnly) {
        server.tool(
            'create_agent',
            'Create a new Rymi AI voice agent. Call list_llm_options first to discover valid voice and model values. For a multi-language agent, set supported_languages (e.g. ["hi-IN","en-US"]).',
            {
                name: z.string().min(1).describe('Agent display name'),
                ...agentConfigFields,
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
            'update_agent',
            'Update an existing Rymi voice agent\'s configuration. Only the fields you pass are changed; nullable fields accept null to clear them.',
            {
                agent_id: z.string().uuid().describe('The agent UUID to update'),
                name: z.string().optional(),
                ...agentConfigFields,
                chat_summary: z.string().nullable().optional(),
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
            'delete_agent',
            'Permanently delete a Rymi voice agent.',
            { agent_id: z.string().uuid().describe('The agent UUID to delete') },
            async ({ agent_id }) => {
                const result = await rymi.agents.delete(agent_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'clone_agent',
            'Duplicate an existing agent. The copy gets " (Copy)" appended to its name.',
            { agent_id: z.string().uuid().describe('The agent UUID to clone') },
            async ({ agent_id }) => {
                const result = await rymi.agents.clone(agent_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );
    }

    server.tool(
        'list_calls_for_agent',
        'List calls made with a specific agent.',
        {
            agent_id: z.string().uuid(),
            limit: z.number().int().min(1).max(200).optional(),
            offset: z.number().int().min(0).optional(),
            status: z.string().optional().describe('Filter by call status'),
        },
        async ({ agent_id, ...params }) => {
            const result = await rymi.agents.listCalls(agent_id, params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'validate_agent_publish',
        'Check whether an agent is ready to go live. Returns a validation report without persisting any changes.',
        {
            agent_id: z.string().uuid().optional().describe('Merge validation with a persisted agent'),
            name: z.string().optional(),
            voice: z.string().optional(),
            persona: z.record(z.any()).optional(),
            playbook: z.record(z.any()).optional(),
        },
        async (params) => {
            const result = await rymi.agents.validatePublish(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'apply_agent_changes',
        'Validate and resolve a flat key/value change-set against the AgentConfig field registry. Does NOT persist — follow up with update_agent.',
        {
            agent_id: z.string().uuid().describe('Agent to load currentConfig from (recommended)'),
            changes: z.array(z.object({ key: z.string(), value: z.any() })).describe('Array of {key, value} field changes'),
            mode: z.enum(['create', 'edit']).describe('create = new agent, edit = updating existing'),
            lenient: z.boolean().optional().describe('Skip unknown-field hard-fail (not recommended)'),
        },
        async ({ agent_id, changes, mode, lenient }) => {
            const current = await rymi.agents.retrieve(agent_id);
            const normalizedChanges = changes.map(({ key, value }) => ({ key, value }));
            const result = await rymi.agents.applyChanges({
                currentConfig: current as any,
                changes: normalizedChanges,
                mode,
                lenient,
            });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'enrich_company',
        'Use AI + Google Search grounding to auto-generate a company description from a website URL, suitable for an agent\'s persona.',
        {
            company_name: z.string().min(1),
            website_url: z.string().url(),
        },
        async ({ company_name, website_url }) => {
            const result = await rymi.agents.enrichCompany({ companyName: company_name, websiteUrl: website_url });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'generate_agent_draft',
        'Use AI to generate an agent configuration draft from a plain-text description.',
        {
            prompt: z.string().min(1).describe('Description of the agent you want to create'),
            mode: z.enum(['create', 'edit']).optional().default('create'),
            current_config: z.record(z.any()).optional().describe('Existing config when editing'),
            options: z.record(z.any()).optional().describe('Override hints e.g. {voice, llm_provider}'),
        },
        async (params) => {
            const result = await rymi.agents.generate({ prompt: params.prompt, options: params.options });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );
}
