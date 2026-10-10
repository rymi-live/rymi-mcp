import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Rymi from '@rymi/node';
import { keyAllowsTool, opsToolCatalog, withWorkspaceParam } from '@rymi/ops-tools';
import { withToolErrors } from './utils/errors.js';
import pkg from '../package.json';

type KeyScopes = { scopes: readonly string[]; legacy: boolean };

/** Waits between GET /v1/keys/self attempts at startup. */
const RETRY_DELAYS_MS = [500, 1500];

/**
 * The key's scopes, or null when the API will not say: offline, or an API
 * older than GET /v1/keys/self. A 4xx answer is final, so only a network error
 * or a 5xx is retried.
 */
async function readKeyScopes(rymi: InstanceType<typeof Rymi>, delays: readonly number[]): Promise<KeyScopes | null> {
    for (let attempt = 0; ; attempt++) {
        try {
            const self = await rymi.keys.self();
            return { scopes: self.scopes ?? [], legacy: self.legacy === true };
        } catch (err) {
            const status = (err as { status?: number }).status;
            const final = status !== undefined && status >= 400 && status < 500;
            if (final || attempt >= delays.length) {
                process.stderr.write(
                    `Warning: could not read this key's scopes from GET /v1/keys/self (${err instanceof Error ? err.message : String(err)}). ` +
                    'Serving read-only tools. Restart once the API is reachable; @rymi/mcp needs a Rymi API with /v1/keys/self.\n'
                );
                return null;
            }
            await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
        }
    }
}

export async function createServer(
    apiKey: string,
    options: { retryDelaysMs?: readonly number[] } = {},
): Promise<McpServer> {
    const rymi = new Rymi({ apiKey });
    // Once per connection. A legacy key holds every scope. Without an answer the
    // server still starts, with the read tools; the API checks each call anyway.
    const key = await readKeyScopes(rymi, options.retryDelaysMs ?? RETRY_DELAYS_MS);

    const server = new McpServer({
        name: 'rymi',
        version: pkg.version,
    });

    const isReadOnly = process.env.RYMI_MCP_READONLY === '1' || key === null;

    // Bind the shared @rymi/ops-tools catalog to this API-key SDK client.
    // Readonly mode now gates per-tool on risk (strictly finer than the old
    // module-level gate); the studio harness binds the same catalog to an
    // in-process JWT client (apps/api/src/services/harness/opsClient.ts).
    for (const tool of opsToolCatalog.map(withWorkspaceParam)) {
        if (isReadOnly && tool.risk !== 'read') continue;
        if (key && !keyAllowsTool(tool, key)) continue;
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
