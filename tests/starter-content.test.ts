import { describe, expect, it } from "vitest";
import {
  getCategories,
  getPublishedTerms,
  getRelatedTerms,
  getTermsBySubtopic,
} from "@/lib/content/terms";

describe("starter content fallback", () => {
  it("searches seeded terms by technical body text", () => {
    const results = getPublishedTerms("parameterized queries");

    expect(results.map((term) => term.slug)).toContain("sql-injection");
  });

  it("ranks direct title matches above body-text matches", () => {
    const results = getPublishedTerms("oauth");

    expect(results[0].slug).toBe("oauth");
  });

  it("groups categories for homepage browsing", () => {
    const categories = getCategories();

    expect(categories.map((category) => category.category)).toEqual(
      expect.arrayContaining(["ai", "backend", "databases", "frontend", "networking"]),
    );
  });

  it("filters terms by category and subtopic", () => {
    const reactTerms = getTermsBySubtopic("frontend", "react");

    expect(reactTerms).toHaveLength(1);
    expect(reactTerms[0].slug).toBe("hydration-error");
  });

  it("does not return the current term as related content", () => {
    const relatedTerms = getRelatedTerms("sql-injection", "databases");

    expect(relatedTerms.every((term) => term.slug !== "sql-injection")).toBe(true);
  });
});
