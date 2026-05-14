import { describe, expect, it } from "vitest";
import { buildTermSubmissionInput, termSubmissionSchema, toSlug } from "@/lib/validation";

const validSubmission = {
  termName: "Prompt Injection",
  domain: "model security",
  categoryTag: "ai",
  subtopicTag: "llm-security",
  complexity: 58,
  eli5: "A person hides sneaky instructions in normal text so an AI helper forgets its original rules.",
  devLevel:
    "Prompt injection is an input attack where user-controlled text attempts to override system instructions, reveal hidden context, or trigger unsafe tool use.",
  links: ["https://owasp.org/www-project-top-10-for-large-language-model-applications/"],
  videos: ["https://www.youtube.com/watch?v=ciNHn38EyRc"],
};

describe("term validation", () => {
  it("normalizes term names into stable slugs", () => {
    expect(toSlug("  SQL Injection!!! ")).toBe("sql-injection");
    expect(toSlug("Rubber Duck Debugging")).toBe("rubber-duck-debugging");
  });

  it("accepts a valid admin submission", () => {
    expect(termSubmissionSchema.safeParse(validSubmission).success).toBe(true);
  });

  it("normalizes multiline form input before validation", () => {
    const formData = new FormData();

    formData.set("termName", "  CSRF  ");
    formData.set("domain", "web attack");
    formData.set("categoryTag", "security");
    formData.set("subtopicTag", "web-security");
    formData.set("complexity", "52");
    formData.set(
      "eli5",
      "A sneaky page tries to make your logged-in browser do something without asking you.",
    );
    formData.set(
      "devLevel",
      "Cross-Site Request Forgery abuses authenticated browser state to submit unwanted requests without the user's intent.",
    );
    formData.set(
      "links",
      " https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html \n\n https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite ",
    );
    formData.set("videos", " https://youtu.be/ciNHn38EyRc ");

    expect(buildTermSubmissionInput(formData)).toMatchObject({
      termName: "  CSRF  ",
      categoryTag: "security",
      complexity: 52,
      links: [
        "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite",
      ],
      videos: ["https://youtu.be/ciNHn38EyRc"],
    });
  });

  it("rejects unsupported category tags even if the client is bypassed", () => {
    const parsed = termSubmissionSchema.safeParse({
      ...validSubmission,
      categoryTag: "made-up-category",
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.map((issue) => issue.path[0])).toContain("categoryTag");
  });

  it("rejects unsafe links and unsupported videos", () => {
    const parsed = termSubmissionSchema.safeParse({
      ...validSubmission,
      links: ["https://totally-random.example/post"],
      videos: ["https://vimeo.com/123"],
    });

    expect(parsed.success).toBe(false);
    expect(parsed.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining(["links", "videos"]),
    );
  });
});
