#!/usr/bin/env node
import { createServer } from './server.js';
import { runStdio } from './transport/stdio.js';
import { runHttp } from './transport/http.js';

const transport = process.argv.includes('--transport')
    ? process.argv[process.argv.indexOf('--transport') + 1]
    : 'stdio';

if (transport === 'http') {
    runHttp().catch((err) => {
        process.stderr.write(`Fatal: ${err.message}\n`);
        process.exit(1);
    });
} else {
    const apiKey = process.env.RYMI_API_KEY || '';
    if (!apiKey) {
        process.stderr.write('Error: RYMI_API_KEY environment variable is required.\n');
        process.exit(1);
    }
    const server = createServer(apiKey);
    runStdio(server).catch((err) => {
        process.stderr.write(`Fatal: ${err.message}\n`);
        process.exit(1);
    });
}
