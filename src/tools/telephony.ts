import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type Rymi from '@rymi/node';

/**
 * Read-only telephony tools. Connecting/disconnecting a carrier requires
 * carrier API credentials and changes a standing integration, so those are
 * intentionally NOT exposed over MCP — do them from the dashboard. These two
 * only report the current connection and list carrier-side numbers.
 */
export function registerTelephonyTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'telephony_status',
        'Report whether a telephony carrier is connected, and which provider/account.',
        {},
        async () => {
            const result = await rymi.telephony.status();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_telephony_numbers',
        'List numbers available on the connected telephony carrier account.',
        {},
        async () => {
            const result = await rymi.telephony.numbers();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );
}
