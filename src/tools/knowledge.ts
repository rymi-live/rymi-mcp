import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';

/**
 * Knowledge-base (RAG) and configuration-history tools.
 *
 * Knowledge sources are added from raw text or a URL (file upload is
 * multipart-only and stays in the dashboard). Change history is read +
 * single-change undo — a safe, reversible way to inspect and roll back
 * config edits.
 */
export function registerKnowledgeTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'list_knowledge_sources',
        'List the knowledge sources (RAG context) attached to an agent.',
        { agent_id: z.string().uuid().describe('The agent UUID') },
        async ({ agent_id }) => {
            const result = await rymi.agents.listKnowledgeSources(agent_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_agent_changes',
        'List recorded configuration changes for an agent (for auditing or before an undo).',
        {
            agent_id: z.string().uuid().describe('The agent UUID'),
            since: z.string().optional().describe('ISO timestamp — only return changes after this time'),
        },
        async ({ agent_id, since }) => {
            const result = await rymi.agents.listChanges(agent_id, since ? { since } : {});
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    if (!isReadOnly) {
        server.tool(
            'add_knowledge_source',
            'Add a knowledge source to an agent from raw text or a URL (the URL is fetched and ingested).',
            {
                agent_id: z.string().uuid().describe('The agent UUID'),
                kind: z.enum(['text', 'url']).describe('Source type'),
                title: z.string().min(1).describe('Human-readable title for the source'),
                text: z.string().optional().describe('Required when kind="text": the raw content to ingest'),
                url: z.string().url().optional().describe('Required when kind="url": the page to fetch and ingest'),
            },
            async ({ agent_id, kind, title, text, url }) => {
                const data = kind === 'text'
                    ? { kind: 'text' as const, title, text: text ?? '' }
                    : { kind: 'url' as const, title, url: url ?? '' };
                const result = await rymi.agents.addKnowledgeSource(agent_id, data);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'delete_knowledge_source',
            'Delete a knowledge source from an agent.',
            {
                agent_id: z.string().uuid().describe('The agent UUID'),
                source_id: z.string().describe('The knowledge source ID to delete'),
            },
            async ({ agent_id, source_id }) => {
                const result = await rymi.agents.deleteKnowledgeSource(agent_id, source_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );

        server.tool(
            'undo_agent_change',
            'Undo a single recorded configuration change, reverting that field to its previous value.',
            {
                agent_id: z.string().uuid().describe('The agent UUID'),
                change_id: z.string().describe('The change_id to undo (from list_agent_changes)'),
            },
            async ({ agent_id, change_id }) => {
                const result = await rymi.agents.undoChange(agent_id, change_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );
    }
}
