import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Rymi from '@rymi/node';
import { registerAgentTools } from './tools/agents.js';
import { registerCallTools, registerOutboundCallTools, registerCallControlTools } from './tools/calls.js';
import { registerNumberTools } from './tools/numbers.js';
import { registerTelephonyTools } from './tools/telephony.js';
import { registerKeyTools } from './tools/keys.js';
import { registerKnowledgeTools } from './tools/knowledge.js';
import { registerInsightTools } from './tools/insights.js';
import { registerPublishTool } from './tools/publish.js';
import { registerDncTools } from './tools/dnc.js';
import { registerWebhookTools } from './tools/webhooks.js';
import { registerBillingControlTools } from './tools/billing.js';

export function createServer(apiKey: string): McpServer {
    const rymi = new Rymi({ apiKey });

    const server = new McpServer({
        name: 'rymi',
        version: '0.5.0',
    });

    const isReadOnly = process.env.RYMI_MCP_READONLY === '1';

    registerAgentTools(server, rymi, isReadOnly);
    registerCallTools(server, rymi, isReadOnly);
    registerNumberTools(server, rymi, isReadOnly);
    registerTelephonyTools(server, rymi, isReadOnly);
    registerKeyTools(server, rymi, isReadOnly);
    registerKnowledgeTools(server, rymi, isReadOnly);
    registerInsightTools(server, rymi, isReadOnly);
    registerDncTools(server, rymi, isReadOnly);
    registerWebhookTools(server, rymi, isReadOnly);
    registerBillingControlTools(server, rymi, isReadOnly);

    // Call Control tools (end call, add participants)
    if (!isReadOnly) {
        registerCallControlTools(server, rymi);
        registerOutboundCallTools(server, rymi);
        registerPublishTool(server, rymi);
    }

    return server;
}
