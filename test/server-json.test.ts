import { describe, it, expect } from 'vitest';
import pkg from '../package.json';
import serverJson from '../server.json';

// The registry verifies the npm package by mcpName and rejects a version
// that was never published, so server.json must track package.json.
describe('server.json', () => {
    it('matches package.json name, mcpName and version', () => {
        expect(serverJson.name).toBe((pkg as { mcpName: string }).mcpName);
        expect(serverJson.version).toBe(pkg.version);
        expect(serverJson.packages[0].identifier).toBe(pkg.name);
        expect(serverJson.packages[0].version).toBe(pkg.version);
    });

    it('keeps the registry description within its 100 character limit', () => {
        expect(serverJson.description.length).toBeLessThanOrEqual(100);
    });
});
