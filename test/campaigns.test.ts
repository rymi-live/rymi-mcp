import { describe, it, expect, vi } from 'vitest';
import { registerCampaignTools } from '../src/tools/campaigns';

function capture() {
  const handlers: Record<string, Function> = {};
  const server: any = { tool: (name: string, _d: string, _s: any, h: Function) => { handlers[name] = h; } };
  return { handlers, server };
}

const READ_TOOLS = [
  'list_campaigns',
  'get_campaign',
  'get_campaign_report',
  'list_campaign_attempts',
  'list_campaign_suggestions',
  'list_contacts',
];

const WRITE_TOOLS = [
  'create_campaign',
  'import_campaign_contacts',
  'launch_campaign',
  'pause_campaign',
  'resume_campaign',
  'accept_campaign_suggestion',
];

describe('campaign tools', () => {
  it('registers all read tools regardless of readonly mode', () => {
    const { handlers, server } = capture();
    registerCampaignTools(server, {} as any, false);
    for (const name of READ_TOOLS) {
      expect(handlers[name]).toBeTypeOf('function');
    }

    const { handlers: roHandlers, server: roServer } = capture();
    registerCampaignTools(roServer, {} as any, true);
    for (const name of READ_TOOLS) {
      expect(roHandlers[name]).toBeTypeOf('function');
    }
  });

  it('registers write tools when not readonly', () => {
    const { handlers, server } = capture();
    registerCampaignTools(server, {} as any, false);
    for (const name of WRITE_TOOLS) {
      expect(handlers[name]).toBeTypeOf('function');
    }
    expect(Object.keys(handlers).sort()).toEqual([...READ_TOOLS, ...WRITE_TOOLS].sort());
  });

  it('omits write tools when RYMI_MCP_READONLY (isReadOnly=true)', () => {
    const { handlers, server } = capture();
    registerCampaignTools(server, {} as any, true);
    for (const name of WRITE_TOOLS) {
      expect(handlers[name]).toBeUndefined();
    }
    expect(Object.keys(handlers).sort()).toEqual(READ_TOOLS.sort());
  });

  it('list_campaigns forwards params to rymi.campaigns.list', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { list: vi.fn().mockResolvedValue({ campaigns: [], total: 0, offset: 0, limit: 20 }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['list_campaigns']({ status: 'running' }, { _meta: {} });
    expect(rymi.campaigns.list).toHaveBeenCalledWith({ status: 'running' });
  });

  it('get_campaign forwards campaign_id to rymi.campaigns.get', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { get: vi.fn().mockResolvedValue({ campaign: { id: 'c1' } }) } };
    registerCampaignTools(server, rymi, false);
    const res = await handlers['get_campaign']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.get).toHaveBeenCalledWith('c1');
    expect(res.content[0].text).toContain('c1');
  });

  it('get_campaign_report forwards campaign_id to rymi.campaigns.report', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { report: vi.fn().mockResolvedValue({ stat_total: 0 }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['get_campaign_report']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.report).toHaveBeenCalledWith('c1');
  });

  it('list_campaign_attempts splits campaign_id from query params', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { attempts: vi.fn().mockResolvedValue({ attempts: [], total: 0, offset: 0, limit: 20 }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['list_campaign_attempts']({ campaign_id: 'c1', status: 'failed', limit: 10 }, { _meta: {} });
    expect(rymi.campaigns.attempts).toHaveBeenCalledWith('c1', { status: 'failed', limit: 10 });
  });

  it('list_campaign_suggestions splits campaign_id from query params', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { suggestions: vi.fn().mockResolvedValue({ suggestions: [], total: 0, offset: 0, limit: 20 }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['list_campaign_suggestions']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.suggestions).toHaveBeenCalledWith('c1', {});
  });

  it('list_contacts forwards params to rymi.contacts.list', async () => {
    const { handlers, server } = capture();
    const rymi: any = { contacts: { list: vi.fn().mockResolvedValue({ contacts: [], total: 0, offset: 0, limit: 20 }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['list_contacts']({ limit: 5 }, { _meta: {} });
    expect(rymi.contacts.list).toHaveBeenCalledWith({ limit: 5 });
  });

  it('create_campaign forwards the full payload to rymi.campaigns.create', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { create: vi.fn().mockResolvedValue({ campaign: { id: 'c1', status: 'draft' } }) } };
    registerCampaignTools(server, rymi, false);
    const payload = { agent_id: 'a1', type: 'outbound', name: 'Q3 Renewals' };
    await handlers['create_campaign'](payload, { _meta: {} });
    expect(rymi.campaigns.create).toHaveBeenCalledWith(payload);
  });

  it('import_campaign_contacts splits campaign_id and calls members.import', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { members: { import: vi.fn().mockResolvedValue({ created: 1, merged: 0, invalid: [], members_added: 1 }) } } };
    registerCampaignTools(server, rymi, false);
    await handlers['import_campaign_contacts']({ campaign_id: 'c1', csv: 'phone\n+15555550123' }, { _meta: {} });
    expect(rymi.campaigns.members.import).toHaveBeenCalledWith('c1', { csv: 'phone\n+15555550123' });
  });

  it('launch_campaign description warns about real outbound PSTN calls and charges', () => {
    const descriptions: Record<string, string> = {};
    const server: any = { tool: (name: string, desc: string) => { descriptions[name] = desc; } };
    registerCampaignTools(server, {} as any, false);
    expect(descriptions['launch_campaign']).toMatch(/WARNING/);
    expect(descriptions['launch_campaign']).toMatch(/outbound/i);
    expect(descriptions['launch_campaign']).toMatch(/PSTN/);
    expect(descriptions['launch_campaign']).toMatch(/charg/i);
  });

  it('launch_campaign forwards campaign_id to rymi.campaigns.launch', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { launch: vi.fn().mockResolvedValue({ campaign: { id: 'c1', status: 'running' }, blockers: [] }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['launch_campaign']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.launch).toHaveBeenCalledWith('c1');
  });

  it('pause_campaign forwards campaign_id to rymi.campaigns.pause', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { pause: vi.fn().mockResolvedValue({ campaign: { id: 'c1', status: 'paused' } }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['pause_campaign']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.pause).toHaveBeenCalledWith('c1');
  });

  it('resume_campaign forwards campaign_id to rymi.campaigns.resume', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { resume: vi.fn().mockResolvedValue({ campaign: { id: 'c1', status: 'running' } }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['resume_campaign']({ campaign_id: 'c1' }, { _meta: {} });
    expect(rymi.campaigns.resume).toHaveBeenCalledWith('c1');
  });

  it('accept_campaign_suggestion forwards ids to rymi.campaigns.acceptSuggestion', async () => {
    const { handlers, server } = capture();
    const rymi: any = { campaigns: { acceptSuggestion: vi.fn().mockResolvedValue({ suggestion: { id: 's1', status: 'accepted' } }) } };
    registerCampaignTools(server, rymi, false);
    await handlers['accept_campaign_suggestion']({ campaign_id: 'c1', suggestion_id: 's1' }, { _meta: {} });
    expect(rymi.campaigns.acceptSuggestion).toHaveBeenCalledWith('c1', 's1');
  });
});
