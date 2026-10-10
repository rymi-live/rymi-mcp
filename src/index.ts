#!/usr/bin/env node
import { createServer } from './server.js';
import { runStdio } from './transport/stdio.js';

// stdio only. The HTTP transport was removed in 2.0.0 — the hosted endpoint at
// https://mcp.rymi.live/mcp is served by apps/api, which speaks OAuth and gates
// tools by tenant role, neither of which this package could do.
//
// Failing loudly beats falling through to stdio: an existing `--transport http`
// deployment would otherwise "start" and then sit on a port nothing is
// listening to.
const transport = process.argv.includes('--transport')
    ? process.argv[process.argv.indexOf('--transport') + 1]
    : 'stdio';

if (transport !== 'stdio') {
    process.stderr.write(
        `Error: --transport ${transport} was removed in @rymi/mcp 2.0.0; this package is stdio-only.\n` +
        'For an HTTP endpoint use the hosted one: https://mcp.rymi.live/mcp\n' +
        '  — add it as a custom connector (OAuth, no key), or pass a rymi_ secret key as a Bearer token.\n' +
        'See https://docs.rymi.live/api/mcp\n'
    );
    process.exit(1);
}

const apiKey = process.env.RYMI_API_KEY || '';
if (!apiKey) {
    process.stderr.write('Error: RYMI_API_KEY environment variable is required.\n');
    process.exit(1);
}

createServer(apiKey).then((server) => runStdio(server)).catch((err) => {
    process.stderr.write(`Fatal: ${err instanceof Error ? err.message : String(err)}\n`);
    process.exit(1);
});
