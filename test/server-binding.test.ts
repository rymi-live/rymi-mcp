import { describe, it, expect, afterEach, vi } from 'vitest';
import { createServer } from '../src/server';
import { opsToolCatalog } from '@rymi/ops-tools';

/** The API refuses billing writes to every key, so no key lists them. */
const BILLING_WRITES = new Set(['set_auto_recharge', 'set_spend_alerts']);

function mockSelf(body: unknown) {
    global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => body,
    }) as typeof fetch;
}

const realFetch = global.fetch;

function registeredTools(server: Awaited<ReturnType<typeof createServer>>): string[] {
    const registry = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
    return Object.keys(registry).sort();
}

async function registeredNames(readonly: boolean): Promise<string[]> {
    mockSelf({ kind: 'account', scopes: [], legacy: true, account_id: 'a', workspace_id: null });
    const prev = process.env.RYMI_MCP_READONLY;
    process.env.RYMI_MCP_READONLY = readonly ? '1' : '';
    try {
        const server = await createServer('rymi_dummy_key_for_registration_only');
        return registeredTools(server);
    } finally {
        if (prev === undefined) delete process.env.RYMI_MCP_READONLY;
        else process.env.RYMI_MCP_READONLY = prev;
    }
}

afterEach(() => {
    delete process.env.RYMI_MCP_READONLY;
    global.fetch = realFetch;
});

describe('MCP server catalog binding', () => {
    it('full mode with a legacy key registers the whole catalog except billing writes', async () => {
        const expected = opsToolCatalog.filter((t) => !BILLING_WRITES.has(t.name)).map((t) => t.name).sort();
        expect(await registeredNames(false)).toEqual(expected);
    });

    it('readonly mode registers exactly the read-risk tools', async () => {
        const expected = opsToolCatalog.filter((t) => t.risk === 'read').map((t) => t.name).sort();
        expect(await registeredNames(true)).toEqual(expected);
    });

    it('readonly is a strict subset of full', async () => {
        const full = new Set(await registeredNames(false));
        for (const name of await registeredNames(true)) expect(full.has(name)).toBe(true);
    });

    it('reads GET /v1/keys/self once and a calls-only key lists no agent write tools', async () => {
        mockSelf({
            kind: 'workspace',
            scopes: ['calls:read', 'calls:write'],
            legacy: false,
            account_id: 'a',
            workspace_id: 'w',
        });
        const server = await createServer('rymi_ws_test');
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect((global.fetch as any).mock.calls[0][0]).toBe('https://api.rymi.live/v1/keys/self');
        const names = registeredTools(server);
        expect(names).not.toContain('create_agent');
        expect(names).toContain('create_call');
        expect(names).toContain('list_calls');
    });
});

describe('when GET /v1/keys/self fails', () => {
    const readTools = opsToolCatalog.filter((t) => t.risk === 'read').map((t) => t.name).sort();

    it('retries, then serves the read-only tools with a warning on stderr', async () => {
        global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed')) as typeof fetch;
        const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        try {
            const server = await createServer('rymi_offline', { retryDelaysMs: [0, 0] });
            expect(global.fetch).toHaveBeenCalledTimes(3);
            expect(registeredTools(server)).toEqual(readTools);
            expect(stderr.mock.calls.map((c) => String(c[0])).join('')).toMatch(/read-only/);
        } finally {
            stderr.mockRestore();
        }
    });

    it('does not retry an API that has no /keys/self, and still starts read-only', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false, status: 404, statusText: 'Not Found',
            headers: new Headers({ 'content-type': 'application/json' }),
            json: async () => ({ error: 'Not found' }),
        }) as typeof fetch;
        const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        try {
            const server = await createServer('rymi_old_api', { retryDelaysMs: [0, 0] });
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(registeredTools(server)).toEqual(readTools);
        } finally {
            stderr.mockRestore();
        }
    });

    it('recovers when a retry succeeds', async () => {
        global.fetch = vi.fn()
            .mockRejectedValueOnce(new TypeError('fetch failed'))
            .mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ kind: 'workspace', scopes: ['calls:read'], legacy: false, account_id: 'a', workspace_id: 'w' }),
            }) as typeof fetch;
        const server = await createServer('rymi_flaky', { retryDelaysMs: [0, 0] });
        expect(global.fetch).toHaveBeenCalledTimes(2);
        const names = registeredTools(server);
        expect(names).toContain('list_calls');
        expect(names).not.toContain('create_call');
    });
});
