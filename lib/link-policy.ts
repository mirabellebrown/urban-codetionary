const DOCUMENTATION_HOST_ALLOWLIST = [
  "developer.mozilla.org",
  "react.dev",
  "nextjs.org",
  "nodejs.org",
  "postgresql.org",
  "owasp.org",
  "cheatsheetseries.owasp.org",
  "github.com",
  "pragprog.com",
  "seths.blog",
  "cloudflare.com",
  "openai.com",
];

const YOUTUBE_HOST_ALLOWLIST = [
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
  "youtube-nocookie.com",
];

function safelyParseUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

function matchesAllowedHost(hostname: string, allowlist: string[]) {
  return allowlist.some(
    (allowedHost) => hostname === allowedHost || hostname.endsWith(`.${allowedHost}`),
  );
}

export function isAllowedDocumentationUrl(value: string) {
  const url = safelyParseUrl(value);
  return url ? matchesAllowedHost(url.hostname.toLowerCase(), DOCUMENTATION_HOST_ALLOWLIST) : false;
}

export function isAllowedYouTubeUrl(value: string) {
  const url = safelyParseUrl(value);
  return url ? matchesAllowedHost(url.hostname.toLowerCase(), YOUTUBE_HOST_ALLOWLIST) : false;
}

export const trustedHosts = {
  docs: DOCUMENTATION_HOST_ALLOWLIST,
  videos: YOUTUBE_HOST_ALLOWLIST,
};
