import { and, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";
import { termResources, terms } from "@/db/schema";
import type { TermEntry, VideoResource } from "@/lib/content/terms";
import {
  getCategories as getStarterCategories,
  getPublishedTerms as getStarterPublishedTerms,
  getRelatedTerms as getStarterRelatedTerms,
  getSubtopicsByCategory as getStarterSubtopicsByCategory,
  getTermsByCategory as getStarterTermsByCategory,
  getTermsBySubtopic as getStarterTermsBySubtopic,
  getTermBySlug as getStarterTermBySlug,
  getTermSearchScore,
} from "@/lib/content/terms";
import { db } from "@/lib/db";

type TermRow = typeof terms.$inferSelect;
type ResourceRow = typeof termResources.$inferSelect;

function getResourceMeta(resource: ResourceRow) {
  return resource.meta && typeof resource.meta === "object"
    ? (resource.meta as Record<string, unknown>)
    : {};
}

function mapTerm(row: TermRow, resources: ResourceRow[]): TermEntry {
  return {
    slug: row.slug,
    name: row.name,
    partOfSpeech: row.partOfSpeech,
    domain: row.domain,
    categoryTag: row.categoryTag,
    subtopicTag: row.subtopicTag,
    complexity: row.complexity,
    eli5: row.eli5Text,
    devLevel: row.devLevelText,
    upvotes: row.upvotes,
    downvotes: row.downvotes,
    links: resources
      .filter((resource) => resource.kind === "link")
      .map((resource) => ({
        label: resource.title,
        url: resource.url,
      })),
    videos: resources
      .filter((resource) => resource.kind === "video")
      .map((resource): VideoResource => {
        const meta = getResourceMeta(resource);

        return {
          title: resource.title,
          url: resource.url,
          channel: typeof meta.channel === "string" ? meta.channel : "YouTube",
          duration: typeof meta.duration === "string" ? meta.duration : "watch",
        };
      }),
  };
}

async function getResourcesByTermId(termIds: string[]) {
  if (!db || termIds.length === 0) {
    return new Map<string, ResourceRow[]>();
  }

  const resources = await db
    .select()
    .from(termResources)
    .where(inArray(termResources.termId, termIds));

  return resources.reduce((grouped, resource) => {
    const existing = grouped.get(resource.termId) ?? [];
    existing.push(resource);
    grouped.set(resource.termId, existing);
    return grouped;
  }, new Map<string, ResourceRow[]>());
}

export async function getPublishedTerms(query = "") {
  if (!db) {
    return getStarterPublishedTerms(query);
  }

  const normalizedQuery = query.trim();
  const whereClause = normalizedQuery
    ? and(
        eq(terms.status, "published"),
        or(
          ilike(terms.name, `%${normalizedQuery}%`),
          ilike(terms.domain, `%${normalizedQuery}%`),
          ilike(terms.categoryTag, `%${normalizedQuery}%`),
          ilike(terms.subtopicTag, `%${normalizedQuery}%`),
          ilike(terms.eli5Text, `%${normalizedQuery}%`),
          ilike(terms.devLevelText, `%${normalizedQuery}%`),
        ),
      )
    : eq(terms.status, "published");

  const termRows = await db
    .select()
    .from(terms)
    .where(whereClause)
    .orderBy(desc(sql<number>`${terms.upvotes} - ${terms.downvotes}`));

  const resourcesByTermId = await getResourcesByTermId(termRows.map((term) => term.id));

  const mappedTerms = termRows.map((term) => mapTerm(term, resourcesByTermId.get(term.id) ?? []));

  if (!normalizedQuery) {
    return mappedTerms;
  }

  return mappedTerms.sort(
    (left, right) =>
      getTermSearchScore(right, normalizedQuery) - getTermSearchScore(left, normalizedQuery),
  );
}

export async function getTermBySlug(slug: string) {
  if (!db) {
    return getStarterTermBySlug(slug);
  }

  const [term] = await db
    .select()
    .from(terms)
    .where(and(eq(terms.slug, slug), eq(terms.status, "published")))
    .limit(1);

  if (!term) {
    return undefined;
  }

  const resourcesByTermId = await getResourcesByTermId([term.id]);
  return mapTerm(term, resourcesByTermId.get(term.id) ?? []);
}

export async function getRelatedTerms(currentSlug: string, categoryTag: string) {
  if (!db) {
    return getStarterRelatedTerms(currentSlug, categoryTag);
  }

  const [currentTerm] = await db
    .select({
      subtopicTag: terms.subtopicTag,
      complexity: terms.complexity,
    })
    .from(terms)
    .where(eq(terms.slug, currentSlug))
    .limit(1);

  const termRows = await db
    .select()
    .from(terms)
    .where(
      and(
        eq(terms.status, "published"),
        eq(terms.categoryTag, categoryTag),
        ne(terms.slug, currentSlug),
      ),
    )
    .orderBy(
      desc(sql<number>`case when ${terms.subtopicTag} = ${currentTerm?.subtopicTag ?? ""} then 1 else 0 end`),
      sql<number>`abs(${terms.complexity} - ${currentTerm?.complexity ?? 0})`,
      desc(sql<number>`${terms.upvotes} - ${terms.downvotes}`),
    )
    .limit(2);

  const resourcesByTermId = await getResourcesByTermId(termRows.map((term) => term.id));

  return termRows.map((term) => mapTerm(term, resourcesByTermId.get(term.id) ?? []));
}

export async function getCategories() {
  if (!db) {
    return getStarterCategories();
  }

  const rows = await db
    .select({
      category: terms.categoryTag,
      count: sql<number>`count(*)::int`,
    })
    .from(terms)
    .where(eq(terms.status, "published"))
    .groupBy(terms.categoryTag)
    .orderBy(terms.categoryTag);

  return rows;
}

export async function getSubtopicsByCategory(category: string) {
  if (!db) {
    return getStarterSubtopicsByCategory(category);
  }

  return db
    .select({
      category: terms.categoryTag,
      subtopic: terms.subtopicTag,
      count: sql<number>`count(*)::int`,
    })
    .from(terms)
    .where(and(eq(terms.status, "published"), eq(terms.categoryTag, category)))
    .groupBy(terms.categoryTag, terms.subtopicTag)
    .orderBy(terms.subtopicTag);
}

export async function getTermsByCategory(category: string) {
  if (!db) {
    return getStarterTermsByCategory(category);
  }

  const termRows = await db
    .select()
    .from(terms)
    .where(and(eq(terms.status, "published"), eq(terms.categoryTag, category)))
    .orderBy(desc(sql<number>`${terms.upvotes} - ${terms.downvotes}`));

  const resourcesByTermId = await getResourcesByTermId(termRows.map((term) => term.id));

  return termRows.map((term) => mapTerm(term, resourcesByTermId.get(term.id) ?? []));
}

export async function getTermsBySubtopic(category: string, subtopic: string) {
  if (!db) {
    return getStarterTermsBySubtopic(category, subtopic);
  }

  const termRows = await db
    .select()
    .from(terms)
    .where(
      and(
        eq(terms.status, "published"),
        eq(terms.categoryTag, category),
        eq(terms.subtopicTag, subtopic),
      ),
    )
    .orderBy(desc(sql<number>`${terms.upvotes} - ${terms.downvotes}`));

  const resourcesByTermId = await getResourcesByTermId(termRows.map((term) => term.id));

  return termRows.map((term) => mapTerm(term, resourcesByTermId.get(term.id) ?? []));
}
