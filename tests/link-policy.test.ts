import { describe, expect, it } from "vitest";
import { isAllowedDocumentationUrl, isAllowedYouTubeUrl } from "@/lib/link-policy";

describe("link policy", () => {
  it("allows trusted documentation hosts over HTTPS", () => {
    expect(isAllowedDocumentationUrl("https://react.dev/reference/react")).toBe(true);
    expect(isAllowedDocumentationUrl("https://docs.github.com/actions")).toBe(true);
    expect(isAllowedDocumentationUrl("https://platform.openai.com/docs/guides/safety-best-practices")).toBe(true);
  });

  it("rejects untrusted, invalid, and non-HTTPS documentation URLs", () => {
    expect(isAllowedDocumentationUrl("http://react.dev/reference/react")).toBe(false);
    expect(isAllowedDocumentationUrl("https://example.com/post")).toBe(false);
    expect(isAllowedDocumentationUrl("not a url")).toBe(false);
  });

  it("only allows YouTube video hosts for videos", () => {
    expect(isAllowedYouTubeUrl("https://www.youtube.com/watch?v=ciNHn38EyRc")).toBe(true);
    expect(isAllowedYouTubeUrl("https://youtu.be/ciNHn38EyRc")).toBe(true);
    expect(isAllowedYouTubeUrl("https://vimeo.com/123")).toBe(false);
  });
});
