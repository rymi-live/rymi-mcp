import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

/**
 * Phone-number management. An agent is unreachable until a number is attached,
 * so these tools complete the "build → reach" loop. None of these provision a
 * brand-new number from a carrier (no purchase happens here) — they register
 * numbers already on the account and attach/detach them to agents.
 */
export function registerNumberTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'list_numbers',
        'List all phone numbers on your Rymi account and which agent each is attached to.',
        {
            limit: z.number().int().min(1).max(500).optional(),
            offset: z.number().int().min(0).optional(),
        },
        async (params) => {
            const result = await rymi.numbers.list(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    if (!isReadOnly) {
        server.tool(
            'register_number',
            'Register a phone number on your account, optionally attaching it to an agent.',
            {
                number: z.string().describe('Phone number in E.164 format (e.g. +14155550123)'),
                agent_id: z.string().uuid().optional().describe('Agent to attach the number to on registration'),
            },
            async ({ number, agent_id }) => {
                const result = await rymi.numbers.register(number, agent_id ? { agent_id } : {});
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'attach_number',
            'Attach an existing number to an agent so inbound calls route to it.',
            {
                number: z.string().describe('Phone number in E.164 format'),
                agent_id: z.string().uuid().describe('Agent to route this number to'),
            },
            async ({ number, agent_id }) => {
                const result = await rymi.numbers.attach(number, agent_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'remove_number',
            'Remove a phone number from your account. The number stops routing to any agent.',
            { number: z.string().describe('Phone number in E.164 format') },
            async ({ number }) => {
                const result = await rymi.numbers.remove(number);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );
    }
}
