import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';
import { withToolErrors } from '../utils/errors.js';

export function registerBillingControlTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean) {
    server.tool(
        'estimate_call_cost',
        'Estimate how much balance a call will consume for a custom model stack and duration. Results are usage estimates; surface remaining balance to customers in minutes.',
        {
            stt_model: z.string().optional(),
            llm_model: z.string().optional(),
            tts_model: z.string().optional(),
            duration_seconds: z.number().min(0).optional(),
        },
        withToolErrors(async (params) => {
            const result = await rymi.billing.estimate(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    if (isReadOnly) return;

    server.tool(
        'set_auto_recharge',
        'Configure auto-recharge. `pack_usd` must exceed `threshold_usd` or the API rejects it (recharge-loop guard).',
        {
            enabled: z.boolean().optional(),
            pack_usd: z.number().min(1).max(1000).optional(),
            threshold_usd: z.number().min(0).max(100).optional(),
        },
        withToolErrors(async (params) => {
            const result = await rymi.billing.setAutoRecharge(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'set_spend_alerts',
        'Configure spend-alert thresholds and low-balance / email preferences.',
        {
            thresholds_usd: z.array(z.number()).max(10).optional(),
            low_balance_pct: z.number().min(0).max(100).optional(),
            email_enabled: z.boolean().optional(),
        },
        withToolErrors(async (params) => {
            const result = await rymi.billing.setAlerts(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );
}
