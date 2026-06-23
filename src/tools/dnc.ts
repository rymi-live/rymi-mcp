import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';
import { withToolErrors } from '../utils/errors.js';

export function registerDncTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean) {
    server.tool(
        'list_dnc',
        'List all numbers on your Do-Not-Call registry.',
        {
            limit: z.number().int().min(1).max(500).optional(),
            offset: z.number().int().min(0).optional(),
        },
        withToolErrors(async (params) => {
            const result = await rymi.dnc.list(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'check_dnc',
        'Check whether phone numbers are on the Do-Not-Call registry. Read-only — adds nothing.',
        { phone_numbers: z.array(z.string()).min(1).max(500).describe('E.164 numbers to check') },
        withToolErrors(async ({ phone_numbers }) => {
            const result = await rymi.dnc.check({ phone_numbers });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    if (isReadOnly) return;

    server.tool(
        'add_dnc',
        'Add a phone number to the Do-Not-Call registry so outbound calls to it are blocked.',
        {
            phone_number: z.string().describe('Phone number (any format; normalized to E.164)'),
            reason: z.string().optional(),
        },
        withToolErrors(async ({ phone_number, reason }) => {
            const result = await rymi.dnc.add({ phone_number, reason });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'add_dnc_batch',
        'Add up to 1000 numbers to the Do-Not-Call registry. Invalid numbers are skipped and returned in `invalid`.',
        {
            phone_numbers: z.array(z.string()).min(1).max(1000),
            reason: z.string().optional(),
        },
        withToolErrors(async ({ phone_numbers, reason }) => {
            const result = await rymi.dnc.addBatch({ phone_numbers, reason });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'remove_dnc',
        'WARNING: removes a number from the Do-Not-Call registry, re-enabling outbound calls to it.',
        { phone: z.string().describe('Phone number to remove') },
        withToolErrors(async ({ phone }) => {
            const result = await rymi.dnc.remove(phone);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );
}
