import { describe, it, expect } from 'vitest';
import { handleMcpError } from '../src/utils/errors';

describe('handleMcpError', () => {
    it('formats a standard error', () => {
        const error = new Error('Something went wrong');
        const result = handleMcpError(error);
        
        expect(result.isError).toBe(true);
        expect(result.content[0].type).toBe('text');
        expect(JSON.parse(result.content[0].text)).toEqual({
            error: 'Something went wrong'
        });
    });

    it('formats an error with code and status', () => {
        const error = {
            message: 'API Error',
            code: 'invalid_request',
            status: 400
        };
        const result = handleMcpError(error);
        
        expect(result.isError).toBe(true);
        expect(JSON.parse(result.content[0].text)).toEqual({
            error: 'API Error',
            code: 'invalid_request',
            status: 400
        });
    });

    it('handles primitive strings', () => {
        const result = handleMcpError('Just a string error');
        expect(result.isError).toBe(true);
        expect(JSON.parse(result.content[0].text)).toEqual({
            error: 'Just a string error'
        });
    });
});
