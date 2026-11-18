import { describe, expect, it } from 'vitest';
import { getRedirectPath } from '../redirect';

const ORIGIN = 'https://natsumeaoii.github.io';

describe('getRedirectPath', () => {
    it('restores a same-origin path with query and hash', () => {
        expect(getRedirectPath('?redirect=%2Fprojects%3Ftags%3DLua%23top', ORIGIN)).toBe(
            '/projects?tags=Lua#top',
        );
    });

    it('returns null when the redirect parameter is missing or empty', () => {
        expect(getRedirectPath('', ORIGIN)).toBeNull();
        expect(getRedirectPath('?redirect=', ORIGIN)).toBeNull();
    });

    it('ignores malformed percent-encoding without throwing', () => {
        expect(getRedirectPath('?redirect=%E0%A4%A', ORIGIN)).toBeNull();
    });

    it('rejects absolute and protocol-relative targets', () => {
        expect(getRedirectPath('?redirect=https%3A%2F%2Fevil.example', ORIGIN)).toBeNull();
        expect(getRedirectPath('?redirect=%2F%2Fevil.example', ORIGIN)).toBeNull();
        expect(getRedirectPath('?redirect=%2F%5Cevil.example', ORIGIN)).toBeNull();
    });

    it('normalizes a plain path', () => {
        expect(getRedirectPath('?redirect=%2Fabout', ORIGIN)).toBe('/about');
    });
});
