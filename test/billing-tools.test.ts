import { describe, it, expect, vi } from 'vitest';
import { registerBillingControlTools } from '../src/tools/billing';

function capture() {
  const handlers: Record<string, Function> = {};
  const server: any = { tool: (name: string, _d: string, _s: any, h: Function) => { handlers[name] = h; } };
  return { handlers, server };
}

describe('billing control tools', () => {
  it('registers the three tools', () => {
    const { handlers, server } = capture();
    registerBillingControlTools(server, {} as any, false);
    expect(Object.keys(handlers).sort()).toEqual(
      ['estimate_call_cost', 'set_auto_recharge', 'set_spend_alerts'].sort()
    );
  });

  it('estimate_call_cost forwards tier + duration', async () => {
    const { handlers, server } = capture();
    const rymi: any = { billing: { estimate: vi.fn().mockResolvedValue({ estimated_minutes: 5 }) } };
    registerBillingControlTools(server, rymi, false);
    await handlers['estimate_call_cost']({ tier: 'specialist', duration_seconds: 300 }, { _meta: {} });
    expect(rymi.billing.estimate).toHaveBeenCalledWith({ tier: 'specialist', duration_seconds: 300 });
  });
});
