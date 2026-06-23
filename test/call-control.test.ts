import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import Rymi from '@rymi/node';
import { registerCallControlTools } from '../src/tools/calls.js';

vi.mock('@rymi/node');

describe('Call Control Tools', () => {
    let server: McpServer;
    let mockRymi: vi.Mocked<Rymi>;

    beforeEach(() => {
        server = new McpServer({ name: 'test', version: '1.0.0' });
        mockRymi = new Rymi({ apiKey: 'test' }) as vi.Mocked<Rymi>;
        mockRymi.calls = {
            end: vi.fn(),
            addParticipants: vi.fn(),
        } as any;
    });

    it('registers end_call tool and delegates to SDK', async () => {
        registerCallControlTools(server, mockRymi);

        const tools = (server as any)._registeredTools;
        expect(tools).toHaveProperty('end_call');

        const tool = tools['end_call'] as any;
        console.log(Object.keys(tool));
        
        mockRymi.calls.end.mockResolvedValue({ status: 'ended', id: 'call_123', message: 'Success' });
        
        const result = await tool.handler({ call_id: 'call_123' }, { _meta: {} });
        
        expect(mockRymi.calls.end).toHaveBeenCalledWith('call_123');
        expect(result.content[0].type).toBe('text');
        expect(JSON.parse(result.content[0].text)).toEqual({ status: 'ended', id: 'call_123', message: 'Success' });
    });

    it('registers add_call_participant tool and delegates to SDK', async () => {
        registerCallControlTools(server, mockRymi);

        const tools = (server as any)._registeredTools;
        expect(tools).toHaveProperty('add_call_participant');

        const tool = tools['add_call_participant'] as any;
        
        const mockResponse = { id: 'call_123', participants: [{ id: 'p_1' }] };
        mockRymi.calls.addParticipants.mockResolvedValue(mockResponse as any);
        
        const result = await tool.handler({ 
            call_id: 'call_123', 
            participants: [{ transport: 'pstn', identity: '+1234567890' }] 
        }, { _meta: {} });
        
        expect(mockRymi.calls.addParticipants).toHaveBeenCalledWith('call_123', {
            participants: [{ transport: 'pstn', identity: '+1234567890' }]
        });
        expect(result.content[0].type).toBe('text');
        expect(JSON.parse(result.content[0].text)).toEqual(mockResponse);
    });
});
