export type ToolResult = { content: Array<{ type: 'text'; text: string }>; isError?: boolean };

export function handleMcpError(err: unknown): ToolResult {
    const e = err as { message?: string; code?: string; status?: number };
    const body: Record<string, unknown> = { error: e?.message || String(err) };
    if (e?.code) body.code = e.code;
    if (e?.status) body.status = e.status;
    return { isError: true, content: [{ type: 'text', text: JSON.stringify(body, null, 2) }] };
}

export function withToolErrors<TArgs>(
    handler: (args: TArgs) => Promise<ToolResult>
): (args: TArgs) => Promise<ToolResult> {
    return async (args: TArgs) => {
        try {
            return await handler(args);
        } catch (err) {
            return handleMcpError(err);
        }
    };
}
