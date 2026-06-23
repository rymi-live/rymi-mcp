import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createServer as createHttpServer } from 'http';
import { createServer as createRymiServer } from '../server.js';

const PORT = parseInt(process.env.RYMI_MCP_PORT || '8787', 10);

export async function runHttp(): Promise<void> {
    const httpServer = createHttpServer(async (req, res) => {
        if (req.url === '/health') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
            return;
        }

        // Per-request auth: caller passes their own RYMI_API_KEY as Bearer token.
        // This makes the HTTP server multi-tenant safe — each request uses the
        // caller's own key, not a shared server-level key.
        const authHeader = req.headers['authorization'] || '';
        const apiKey = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
        if (!apiKey) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing Authorization: Bearer <RYMI_API_KEY>' }));
            return;
        }

        const server = createRymiServer(apiKey);
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        await server.connect(transport);
        await transport.handleRequest(req, res);
    });

    httpServer.listen(PORT, () => {
        process.stderr.write(`Rymi MCP HTTP server listening on port ${PORT}\n`);
    });
}
