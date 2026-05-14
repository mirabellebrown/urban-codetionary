import { desc, eq } from "drizzle-orm";
import { termResources, termRevisions, terms } from "@/db/schema";
import { db } from "@/lib/db";

export type AdminResource = typeof termResources.$inferSelect;
export type AdminRevision = typeof termRevisions.$inferSelect;
export type AdminTerm = typeof terms.$inferSelect;

export type AdminTermWithResources = AdminTerm & {
  resources: AdminResource[];
  revisions: AdminRevision[];
};

export async function getAdminTerms() {
  if (!db) {
    return [];
  }

  return db.select().from(terms).orderBy(desc(terms.updatedAt));
}

export async function getAdminTermById(id: string): Promise<AdminTermWithResources | undefined> {
  if (!db) {
    return undefined;
  }

  const [term] = await db.select().from(terms).where(eq(terms.id, id)).limit(1);

  if (!term) {
    return undefined;
  }

  const [resources, revisions] = await Promise.all([
    db.select().from(termResources).where(eq(termResources.termId, id)),
    db
      .select()
      .from(termRevisions)
      .where(eq(termRevisions.termId, id))
      .orderBy(desc(termRevisions.createdAt)),
  ]);

  return {
    ...term,
    resources,
    revisions,
  };
}
