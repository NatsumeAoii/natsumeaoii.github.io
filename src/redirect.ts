const REDIRECT_PARAM = 'redirect';

/**
 * Resolve the ?redirect= value written by 404.html into a same-origin path.
 *
 * URLSearchParams already percent-decodes the value, so it must not be decoded
 * again. Returns null for missing, malformed, or off-origin targets: this runs
 * before React mounts, so bad input is ignored instead of thrown.
 */
export function getRedirectPath(search: string, origin: string): string | null {
    const redirect = new URLSearchParams(search).get(REDIRECT_PARAM);
    if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
        return null;
    }

    let url: URL;
    try {
        url = new URL(redirect, origin);
    } catch {
        return null;
    }

    // Backslashes are normalized to slashes by the URL parser, so verify the
    // origin after parsing rather than trusting the string prefix.
    if (url.origin !== origin) return null;

    return `${url.pathname}${url.search}${url.hash}`;
}
