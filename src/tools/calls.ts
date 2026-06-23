import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type Rymi from '@rymi/node';
import { withToolErrors } from '../utils/errors.js';

/**
 * Read-only / observability call tools. These never place a call or spend
 * money — they only read call history, transcripts, summaries, recordings,
 * and queue stats. Always safe to register.
 */
export function registerCallTools(server: McpServer, rymi: InstanceType<typeof Rymi>, isReadOnly: boolean = false) {
    server.tool(
        'list_calls',
        'List previous and active calls across your account.',
        {
            limit: z.number().int().min(1).max(200).optional().describe('Max calls to return'),
            offset: z.number().int().min(0).optional().describe('Pagination offset'),
            cursor: z.string().optional().describe('Opaque cursor for keyset pagination'),
            status: z.string().optional().describe('Filter by call status (e.g. completed, in_progress, failed)'),
        },
        async (params) => {
            const result = await rymi.calls.list(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'list_active_calls',
        'List calls currently in progress.',
        {
            limit: z.number().int().min(1).max(200).optional(),
            offset: z.number().int().min(0).optional(),
        },
        async (params) => {
            const result = await rymi.calls.active(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_call',
        'Retrieve details, participants, status, duration, and cost for a single call.',
        { call_id: z.string().describe('The call ID') },
        async ({ call_id }) => {
            const result = await rymi.calls.retrieve(call_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_call_summary',
        'Retrieve the post-call summary for a call.',
        { call_id: z.string().describe('The call ID') },
        async ({ call_id }) => {
            const result = await rymi.calls.summary(call_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_call_transcript',
        'Retrieve the full transcript for a call. May contain personal data — handle accordingly.',
        { call_id: z.string().describe('The call ID') },
        async ({ call_id }) => {
            const result = await rymi.calls.transcript(call_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_call_recording',
        'Retrieve recording metadata (e.g. playback URL) for a call, when recording is enabled.',
        { call_id: z.string().describe('The call ID') },
        async ({ call_id }) => {
            const result = await rymi.calls.recording(call_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    server.tool(
        'get_call_queue_stats',
        'Retrieve current outbound call queue statistics.',
        {},
        async () => {
            const result = await rymi.calls.queueStats();
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        }
    );

    if (!isReadOnly) {
        server.tool(
            'reprocess_call',
            'Re-run post-call intelligence (summary, extraction, evaluation) for a call.',
            { call_id: z.string().describe('The call ID to reprocess') },
            async ({ call_id }) => {
                const result = await rymi.calls.reprocess(call_id);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
        );
    }
}

/**
 * Outbound dialing tools.
 */
export function registerOutboundCallTools(server: McpServer, rymi: InstanceType<typeof Rymi>) {
    server.tool(
        'create_call',
        'WARNING: places a real, billable PSTN call. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account — omit it to use the agent\'s attached number. `identity` is the destination in strict E.164 (e.g. +15555550123).',
        {
            agent_id: z.string().uuid().describe('The agent that will handle the call'),
            participants: z.array(z.object({
                transport: z.enum(['webrtc', 'pstn']),
                identity: z.string().describe('Destination phone number (pstn) or participant identity (webrtc)'),
                from_number: z.string().optional().describe('Caller ID / from number for pstn'),
                metadata: z.record(z.any()).optional(),
            })).min(1),
            metadata: z.record(z.any()).optional(),
            variables: z.record(z.any()).optional().describe('Playbook variables to seed the call'),
            post_call: z.record(z.any()).optional(),
        },
        withToolErrors(async (params: any) => {
            const result = await rymi.calls.create(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'batch_call',
        'Queue up to 500 outbound PSTN recipients in one request. WARNING: places real phone calls and incurs per-minute charges. `from_number` is the caller ID shown to the recipient and must be a phone number registered to your account.',
        {
            agent_id: z.string().uuid().describe('The agent that will handle the calls'),
            to: z.array(z.string()).optional().describe('Simple list of destination phone numbers'),
            recipients: z.array(z.object({
                to: z.string().optional(),
                from_number: z.string().optional(),
                metadata: z.record(z.any()).optional(),
            })).optional().describe('Per-recipient targets with optional from_number/metadata'),
            from_number: z.string().optional().describe('Default caller ID / from number'),
            batch_id: z.string().optional(),
            metadata: z.record(z.any()).optional(),
            variables: z.record(z.any()).optional(),
            post_call: z.record(z.any()).optional(),
        },
        withToolErrors(async (params: any) => {
            const result = await rymi.calls.batch(params);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );
}

export function registerCallControlTools(server: McpServer, rymi: InstanceType<typeof Rymi>) {
    server.tool(
        'end_call',
        'WARNING: immediately terminates an in-progress call. The call transitions to completed and post-call processing runs.',
        { call_id: z.string().describe('The call ID to end') },
        withToolErrors(async ({ call_id }: any) => {
            const result = await rymi.calls.end(call_id);
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );

    server.tool(
        'add_call_participant',
        'WARNING: dials/adds participants to a live call (warm transfer / conference). PSTN additions are billable.',
        {
            call_id: z.string().describe('The in-progress call ID'),
            participants: z.array(z.object({
                transport: z.enum(['webrtc', 'pstn']),
                identity: z.string().describe('Destination phone number (pstn, E.164) or participant identity (webrtc)'),
                from_number: z.string().optional().describe('Caller ID for pstn'),
                metadata: z.record(z.any()).optional(),
            })).min(1),
        },
        withToolErrors(async ({ call_id, participants }: any) => {
            const result = await rymi.calls.addParticipants(call_id, { participants });
            return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
        })
    );
}
