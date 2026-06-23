import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import type Rymi from '@rymi/node';
import { withToolErrors } from '../utils/errors.js';

export function registerWebhookTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean) {
    server.tool(
        'list_webhooks',
        'List your registered webhook endpoints. Signing secrets are never returned.',
        {
            limit: z.number().int().min(1).max(500).optional(),
            offset: z.number().int().min(0).optional(),
        },
        withToolErrors(async (params) => {
            const result = await rymi.webhooks.list(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    if (isReadOnly) return;

    server.tool(
        'create_webhook',
        'Register a webhook to receive call lifecycle events (e.g. call.completed, transcript.ready). URL must be public https. If you omit `secret`, one is generated and shown ONCE in the response — store it to verify signatures.',
        {
            url: z.string().url().describe('Public https endpoint'),
            events: z.array(z.string()).min(1).describe('Event names to subscribe to'),
            secret: z.string().min(16).max(256).optional().describe('Signing secret; auto-generated if omitted'),
            alert_email: z.string().email().optional(),
        },
        withToolErrors(async ({ url, events, secret, alert_email }) => {
            const finalSecret = secret ?? randomBytes(24).toString('hex');
            const result = await rymi.webhooks.create({ url, events, secret: finalSecret, alert_email });
            const echoed = secret
                ? result
                : { ...result, secret: finalSecret, secret_notice: 'Store this secret now — it cannot be retrieved later.' };
            return { content: [{ type: 'text', text: JSON.stringify(echoed, null, 2) }] };
        })
    );

    server.tool(
        'update_webhook',
        'Update a webhook endpoint. Only provided fields change. Pass `secret` to rotate it.',
        {
            id: z.string(),
            url: z.string().url().optional(),
            events: z.array(z.string()).min(1).optional(),
            secret: z.string().min(16).max(256).optional(),
            alert_email: z.string().email().nullable().optional(),
        },
        withToolErrors(async ({ id, ...rest }) => {
            const result = await rymi.webhooks.update(id, rest);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'delete_webhook',
        'WARNING: stops event delivery to this endpoint.',
        { id: z.string() },
        withToolErrors(async ({ id }) => {
            const result = await rymi.webhooks.delete(id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );
}
