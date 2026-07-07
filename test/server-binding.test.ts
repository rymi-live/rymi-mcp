import { describe, it, expect, afterEach } from 'vitest';
import { createServer } from '../src/server';
import { opsToolCatalog } from '@rymi/ops-tools';

function registeredNames(readonly: boolean): string[] {
    const prev = process.env.RYMI_MCP_READONLY;
    process.env.RYMI_MCP_READONLY = readonly ? '1' : '';
    try {
        const server = createServer('rymi_dummy_key_for_registration_only');
        const registry = (server as unknown as { _registeredTools: Record<string, unknown> })._registeredTools;
        return Object.keys(registry).sort();
    } finally {
        if (prev === undefined) delete process.env.RYMI_MCP_READONLY;
        else process.env.RYMI_MCP_READONLY = prev;
    }
}

afterEach(() => { delete process.env.RYMI_MCP_READONLY; });

describe('MCP server catalog binding', () => {
    it('full mode registers exactly the whole ops-tool catalog', () => {
        expect(registeredNames(false)).toEqual(opsToolCatalog.map((t) => t.name).sort());
    });

    it('readonly mode registers exactly the read-risk tools', () => {
        const expected = opsToolCatalog.filter((t) => t.risk === 'read').map((t) => t.name).sort();
        expect(registeredNames(true)).toEqual(expected);
    });

    it('readonly is a strict subset of full', () => {
        const full = new Set(registeredNames(false));
        for (const name of registeredNames(true)) expect(full.has(name)).toBe(true);
    });
});
