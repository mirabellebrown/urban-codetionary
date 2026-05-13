import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { termResources, terms } from "@/db/schema";
import { starterTerms } from "@/lib/content/terms";

const databaseUrl = process.env.DATABASE_URL;
const seedActor = process.env.SEED_ACTOR_EMAIL ?? "seed@urban-codetionary.local";

if (!databaseUrl) {
  console.log("DATABASE_URL is not configured; skipping seed.");
  process.exit(0);
}

const ssl =
  databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1")
    ? undefined
    : { rejectUnauthorized: false };

const pool = new Pool({
  connectionString: databaseUrl,
  ssl,
  max: 1,
});

const db = drizzle(pool);

async function seed() {
  const publishedAt = new Date();

  for (const term of starterTerms) {
    const [savedTerm] = await db
      .insert(terms)
      .values({
        slug: term.slug,
        name: term.name,
        partOfSpeech: term.partOfSpeech,
        domain: term.domain,
        categoryTag: term.categoryTag,
        subtopicTag: term.subtopicTag,
        complexity: term.complexity,
        eli5Text: term.eli5,
        devLevelText: term.devLevel,
        upvotes: term.upvotes,
        downvotes: term.downvotes,
        status: "published",
        publishedAt,
        createdByEmail: seedActor,
        updatedByEmail: seedActor,
      })
      .onConflictDoUpdate({
        target: terms.slug,
        set: {
          name: term.name,
          partOfSpeech: term.partOfSpeech,
          domain: term.domain,
          categoryTag: term.categoryTag,
          subtopicTag: term.subtopicTag,
          complexity: term.complexity,
          eli5Text: term.eli5,
          devLevelText: term.devLevel,
          upvotes: term.upvotes,
          downvotes: term.downvotes,
          status: "published",
          publishedAt,
          updatedByEmail: seedActor,
          updatedAt: publishedAt,
        },
      })
      .returning({ id: terms.id, slug: terms.slug });

    await db.delete(termResources).where(eq(termResources.termId, savedTerm.id));

    const resources = [
      ...term.links.map((link) => ({
        termId: savedTerm.id,
        kind: "link" as const,
        title: link.label,
        url: link.url,
        meta: {},
      })),
      ...term.videos.map((video) => ({
        termId: savedTerm.id,
        kind: "video" as const,
        title: video.title,
        url: video.url,
        meta: {
          channel: video.channel,
          duration: video.duration,
        },
      })),
    ];

    if (resources.length > 0) {
      await db.insert(termResources).values(resources);
    }

    console.log(`Seeded ${savedTerm.slug}`);
  }
}

seed()
  .then(async () => {
    await pool.end();
    console.log(`Seeded ${starterTerms.length} starter terms.`);
  })
  .catch(async (error: unknown) => {
    await pool.end();
    console.error(error);
    process.exit(1);
  });
