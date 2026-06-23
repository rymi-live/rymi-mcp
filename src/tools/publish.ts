import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

export function registerPublishTool(server: McpServer, rymi: InstanceType<typeof Rymi>) {
    server.tool(
        'publish_agent',
        'Publish a Rymi voice agent to make its current saved configuration live. IMPORTANT: this immediately makes the agent callable by end users. Returns published:false with a blockers list when the config has unresolved issues.',
        {
            agent_id: z.string().uuid().describe('The agent UUID to publish'),
        },
        async ({ agent_id }) => {
            try {
                const result = await rymi.agents.publish(agent_id);
                return {
                    isError: result.published ? undefined : true,
                    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
                };
            } catch (err) {
                const e = err as { message?: string; code?: string; status?: number };
                const body: Record<string, unknown> = { published: false, error: e?.message || String(err) };
                if (e?.code) body.code = e.code;
                if (e?.status) body.status = e.status;
                return { isError: true, content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
            }
        }
    );
}
