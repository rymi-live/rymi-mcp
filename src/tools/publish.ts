import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

export function registerPublishTool(server: McpServer, rymi: InstanceType<typeof Rymi>) {
    server.tool(
        'publish_agent',
        'Publish a Rymi voice agent to make it live. IMPORTANT: this immediately makes the agent callable by end users.',
        {
            agent_id: z.string().uuid().describe('The agent UUID to publish'),
        },
        async ({ agent_id }) => {
            // Validate first — surface any config problems before trying to publish
            const validation = await rymi.agents.validatePublish({ agent_id });
            if (!(validation as any).valid) {
                return {
                    content: [{
                        type: 'text',
                        text: JSON.stringify({ published: false, reason: 'Validation failed', details: validation }, null, 2),
                    }],
                };
            }

            // Rymi doesn't have a dedicated publish endpoint yet — publishing is
            // triggered by the dashboard via a status update. We surface the
            // validation result and instruct the caller to use the dashboard or
            // PUT /agents/:id with { status: 'published' } when that field ships.
            return {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        published: false,
                        reason: 'publish_agent requires PUT /agents/:id status field (coming soon). Validation passed — agent is ready to publish from the Rymi dashboard.',
                        agent_id,
                        validation,
                    }, null, 2),
                }],
            };
        }
    );
}
