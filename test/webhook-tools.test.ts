import { describe, it, expect, vi } from 'vitest';
import { registerWebhookTools } from '../src/tools/webhooks';

function capture() {
  const handlers: Record<string, Function> = {};
  const server: any = { tool: (name: string, _d: string, _s: any, h: Function) => { handlers[name] = h; } };
  return { handlers, server };
}

describe('webhook tools', () => {
  it('registers all four tools', () => {
    const { handlers, server } = capture();
    registerWebhookTools(server, {} as any, false);
    expect(Object.keys(handlers).sort()).toEqual(
      ['create_webhook', 'delete_webhook', 'list_webhooks', 'update_webhook'].sort()
    );
  });

  it('create_webhook generates a secret when omitted and echoes it once', async () => {
    const { handlers, server } = capture();
    const rymi: any = { webhooks: { create: vi.fn().mockResolvedValue({ status: 'registered' }) } };
    registerWebhookTools(server, rymi, false);
    const res = await handlers['create_webhook']({ url: 'https://x.com/h', events: ['call.completed'] }, { _meta: {} });
    const passed = rymi.webhooks.create.mock.calls[0][0];
    expect(passed.secret).toBeTypeOf('string');
    expect(passed.secret.length).toBeGreaterThanOrEqual(16);
    expect(res.content[0].text).toContain(passed.secret); // echoed once
  });

  it('create_webhook uses the provided secret as-is', async () => {
    const { handlers, server } = capture();
    const rymi: any = { webhooks: { create: vi.fn().mockResolvedValue({ status: 'registered' }) } };
    registerWebhookTools(server, rymi, false);
    const secret = 's'.repeat(20);
    await handlers['create_webhook']({ url: 'https://x.com/h', events: ['call.completed'], secret }, { _meta: {} });
    expect(rymi.webhooks.create.mock.calls[0][0].secret).toBe(secret);
  });
});
