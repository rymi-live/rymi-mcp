import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type Rymi from '@rymi/node';

/**
 * Read-only key tools. Listing returns only key prefixes/metadata, never a
 * full secret. Creating or revoking publishable keys mints/destroys
 * credentials and changes standing config, so those are intentionally left to
 * the dashboard rather than exposed over MCP.
 */
export function registerKeyTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'list_publishable_keys',
        'List publishable (browser-safe) keys and which agent/channels each is scoped to. Returns key prefixes only, never full secrets.',
        {},
        async () => {
            const result = await rymi.keys.listPublishable();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );
}
