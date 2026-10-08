import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Rymi from '@rymi/node';
import { opsToolCatalog, withWorkspaceParam } from '@rymi/ops-tools';
import { withToolErrors } from './utils/errors.js';
import pkg from '../package.json';

export function createServer(apiKey: string): McpServer {
    const rymi = new Rymi({ apiKey });

    const server = new McpServer({
        name: 'rymi',
        version: pkg.version,
    });

    const isReadOnly = process.env.RYMI_MCP_READONLY === '1';

    // Bind the shared @rymi/ops-tools catalog to this API-key SDK client.
    // Readonly mode now gates per-tool on risk (strictly finer than the old
    // module-level gate); the studio harness binds the same catalog to an
    // in-process JWT client (apps/api/src/services/harness/opsClient.ts).
    for (const tool of opsToolCatalog.map(withWorkspaceParam)) {
        if (isReadOnly && tool.risk !== 'read') continue;
        server.tool(
            tool.name,
            tool.description,
            tool.input,
            withToolErrors(async (params: Record<string, unknown>) => {
                const result = await tool.run(rymi, params as never);
                return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
            })
        );
    }

    return server;
}
