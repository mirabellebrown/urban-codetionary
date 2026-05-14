import { describe, expect, it } from "vitest";
import { termSubmissionSchema, toSlug } from "@/lib/validation";

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
