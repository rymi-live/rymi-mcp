import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

/**
 * Insight tools: usage (in minutes), evaluation runs/scores, and the template
 * catalog. All read-only except run_evals, which kicks off an internal quality
 * evaluation (no customer-facing calls, no money movement).
 */
export function registerInsightTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'get_usage_summary',
        'Get this account\'s usage summary: remaining voice-runtime MINUTES, Studio AI unit usage, and post-call intelligence usage. Voice balance is reported in minutes, not dollars.',
        {},
        async () => {
            const result = await rymi.billing.usageSummary();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_agent_templates',
        'List published agent templates. Use a template\'s `defaults` as the starting config for create_agent.',
        {},
        async () => {
            const result = await rymi.templates.list();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_eval_runs',
        'List previous evaluation runs for an agent.',
        { agent_id: z.string().uuid().describe('The agent UUID') },
        async ({ agent_id }) => {
            const result = await rymi.agents.listEvalRuns(agent_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_eval_run',
        'Retrieve a single evaluation run, including per-scenario scores.',
        {
            agent_id: z.string().uuid().describe('The agent UUID'),
            run_id: z.string().describe('The evaluation run ID'),
        },
        async ({ agent_id, run_id }) => {
            const result = await rymi.agents.getEvalRun(agent_id, run_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    if (!isReadOnly) {
        server.tool(
            'run_evals',
            'Run the evaluation suite for an agent. mode="synthetic" (default) uses the offline scorer; mode="live" runs the model-driven runner (consumes Studio AI units). Set judge=true to supplement the synthetic heuristics with an opt-in LLM judge (requires a Gemini key; consumes Studio AI units).',
            {
                agent_id: z.string().uuid().describe('The agent UUID to evaluate'),
                mode: z.enum(['synthetic', 'live']).optional().describe('Evaluation mode (default synthetic)'),
                judge: z.boolean().optional().describe('Supplement synthetic heuristics with the LLM judge (default false)'),
            },
            async ({ agent_id, mode, judge }) => {
                const params: { mode?: 'synthetic' | 'live'; judge?: boolean } = {};
                if (mode) params.mode = mode;
                if (judge) params.judge = judge;
                const result = await rymi.agents.runEvals(agent_id, params);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'run_eval_suite',
            'Run the eval SUITE across many agents at once (agents × seeded scenarios) with bounded concurrency. One eval run is persisted per agent (visible in the per-agent eval UI); the aggregate report is returned. Set judge=true to add the LLM judge (requires a Gemini key; consumes Studio AI units).',
            {
                agent_ids: z.array(z.string().uuid()).min(1).describe('Agent UUIDs to evaluate'),
                scenario_ids: z.array(z.string()).optional().describe('Optional subset of seeded scenario ids; omit to run all'),
                concurrency: z.number().int().positive().optional().describe('Max agents evaluated in parallel (clamped to a safe ceiling)'),
                judge: z.boolean().optional().describe('Supplement synthetic heuristics with the LLM judge (default false)'),
            },
            async ({ agent_ids, scenario_ids, concurrency, judge }) => {
                const result = await rymi.agents.runEvalSuite({
                    agentIds: agent_ids,
                    ...(scenario_ids ? { scenarioIds: scenario_ids } : {}),
                    ...(concurrency ? { concurrency } : {}),
                    ...(judge ? { judge } : {}),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );
    }
}
