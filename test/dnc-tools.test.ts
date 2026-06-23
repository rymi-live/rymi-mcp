import { describe, it, expect, vi } from 'vitest';
import { registerDncTools } from '../src/tools/dnc';

function capture() {
  const handlers: Record<string, Function> = {};
  const server: any = { tool: (name: string, _d: string, _s: any, h: Function) => { handlers[name] = h; } };
  return { handlers, server };
}

describe('dnc tools', () => {
  it('registers all five tools', () => {
    const { handlers, server } = capture();
    registerDncTools(server, {} as any, false);
    expect(Object.keys(handlers).sort()).toEqual(
      ['add_dnc', 'add_dnc_batch', 'check_dnc', 'list_dnc', 'remove_dnc'].sort()
    );
  });

  it('add_dnc forwards phone_number + reason', async () => {
    const { handlers, server } = capture();
    const rymi: any = { dnc: { add: vi.fn().mockResolvedValue({ status: 'blocklisted', phone_number: '+1555' }) } };
    registerDncTools(server, rymi, false);
    await handlers['add_dnc']({ phone_number: '+1555', reason: 'opt-out' }, { _meta: {} });
    expect(rymi.dnc.add).toHaveBeenCalledWith({ phone_number: '+1555', reason: 'opt-out' });
  });

  it('remove_dnc forwards the phone', async () => {
    const { handlers, server } = capture();
    const rymi: any = { dnc: { remove: vi.fn().mockResolvedValue({ status: 'removed', phone: '+1555' }) } };
    registerDncTools(server, rymi, false);
    await handlers['remove_dnc']({ phone: '+1555' }, { _meta: {} });
    expect(rymi.dnc.remove).toHaveBeenCalledWith('+1555');
  });
});
