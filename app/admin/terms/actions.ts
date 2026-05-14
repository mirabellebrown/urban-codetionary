"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auditLogs, termResources, termRevisions, terms } from "@/db/schema";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { createAuditMetadata } from "@/lib/audit";
import { db } from "@/lib/db";
import { initialTermFormState, type TermFormState } from "@/lib/term-form-state";
import { buildTermSubmissionInput, termSubmissionSchema, toSlug } from "@/lib/validation";

type TermSnapshot = {
  termName: string;
  domain: string;
  categoryTag: string;
  subtopicTag: string;
  complexity: number;
  eli5: string;
  devLevel: string;
  links: string[];
  videos: string[];
};

async function requireAdmin() {
  const session = await getCurrentSession();

  if (!session || !isAdminSession(session)) {
    return null;
  }

  return session.user?.email ?? "unknown@example.com";
}

function blockedState(message: string): TermFormState {
  return {
    ...initialTermFormState,
    status: "error",
    message,
    fieldErrors: {
      form: [message],
    },
  };
}

async function getTermSnapshot(termId: string): Promise<TermSnapshot | null> {
  if (!db) {
    return null;
  }

  const [term] = await db.select().from(terms).where(eq(terms.id, termId)).limit(1);

  if (!term) {
    return null;
  }

  const resources = await db.select().from(termResources).where(eq(termResources.termId, termId));

  return {
    termName: term.name,
    domain: term.domain,
    categoryTag: term.categoryTag,
    subtopicTag: term.subtopicTag,
    complexity: term.complexity,
    eli5: term.eli5Text,
    devLevel: term.devLevelText,
    links: resources.filter((resource) => resource.kind === "link").map((resource) => resource.url),
    videos: resources.filter((resource) => resource.kind === "video").map((resource) => resource.url),
  };
}

function parseSnapshot(value: Record<string, unknown>): TermSnapshot | null {
  const parsed = termSubmissionSchema.safeParse({
    termName: value.termName,
    domain: value.domain,
    categoryTag: value.categoryTag,
    subtopicTag: value.subtopicTag,
    complexity: value.complexity,
    eli5: value.eli5,
    devLevel: value.devLevel,
    links: Array.isArray(value.links) ? value.links : [],
    videos: Array.isArray(value.videos) ? value.videos : [],
  });

  return parsed.success ? parsed.data : null;
}

export async function updateTermAction(
  _previousState: TermFormState,
  formData: FormData,
): Promise<TermFormState> {
  const actorEmail = await requireAdmin();

  if (!actorEmail) {
    return blockedState("Admin sign-in is required before a term can be updated.");
  }

  if (!db) {
    return blockedState("DATABASE_URL is required before edits can be saved.");
  }

  const termId = typeof formData.get("termId") === "string" ? String(formData.get("termId")) : "";
  const parsedInput = termSubmissionSchema.safeParse(buildTermSubmissionInput(formData));

  if (!termId) {
    return blockedState("A term id is required before edits can be saved.");
  }

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: parsedInput.error.flatten().fieldErrors,
    };
  }

  const payload = parsedInput.data;
  const slug = toSlug(payload.termName);

  if (!slug) {
    return {
      ...initialTermFormState,
      status: "error",
      message: "The term name could not be converted into a slug.",
      fieldErrors: {
        termName: ["Use letters and numbers so the term can generate a clean public URL."],
      },
    };
  }

  const [duplicate] = await db
    .select({ id: terms.id })
    .from(terms)
    .where(and(eq(terms.slug, slug), ne(terms.id, termId)))
    .limit(1);

  if (duplicate) {
    return {
      ...initialTermFormState,
      status: "error",
      message: "Another term already uses this slug.",
      fieldErrors: {
        termName: ["Choose a different term name or edit the existing entry instead."],
      },
    };
  }

  const updatedAt = new Date();

  await db.transaction(async (transaction) => {
    await transaction
      .update(terms)
      .set({
        slug,
        name: payload.termName,
        domain: payload.domain,
        categoryTag: payload.categoryTag,
        subtopicTag: payload.subtopicTag,
        complexity: payload.complexity,
        eli5Text: payload.eli5,
        devLevelText: payload.devLevel,
        updatedByEmail: actorEmail,
        updatedAt,
      })
      .where(eq(terms.id, termId));

    await transaction.delete(termResources).where(eq(termResources.termId, termId));

    const resourceRows = [
      ...payload.links.map((link) => ({
        termId,
        kind: "link" as const,
        title: link,
        url: link,
        meta: {},
      })),
      ...payload.videos.map((video) => ({
        termId,
        kind: "video" as const,
        title: video,
        url: video,
        meta: {},
      })),
    ];

    if (resourceRows.length > 0) {
      await transaction.insert(termResources).values(resourceRows);
    }

    await transaction.insert(termRevisions).values({
      termId,
      summary: `Edited by ${actorEmail}.`,
      snapshot: {
        ...payload,
        slug,
        actorEmail,
      },
    });

    await transaction.insert(auditLogs).values({
      action: "term_updated",
      entityType: "term",
      entityId: termId,
      actorEmail,
      metadata: createAuditMetadata("admin-edit-form", {
        slug,
        resourceCount: resourceRows.length,
      }),
    });
  });

  revalidatePath("/");
  revalidatePath(`/term/${slug}`);
  revalidatePath("/admin/terms");
  revalidatePath(`/admin/terms/${termId}/edit`);

  return {
    ...initialTermFormState,
    status: "success",
    message: "Term updated. A revision snapshot and audit event were recorded.",
  };
}

export async function publishTermAction(formData: FormData) {
  const actorEmail = await requireAdmin();
  const termId = typeof formData.get("termId") === "string" ? String(formData.get("termId")) : "";

  if (!actorEmail || !db || !termId) {
    return;
  }

  const snapshot = await getTermSnapshot(termId);
  const publishedAt = new Date();

  await db.transaction(async (transaction) => {
    await transaction
      .update(terms)
      .set({
        status: "published",
        publishedAt,
        updatedAt: publishedAt,
        updatedByEmail: actorEmail,
      })
      .where(eq(terms.id, termId));

    await transaction.insert(termRevisions).values({
      termId,
      summary: `Published by ${actorEmail}.`,
      snapshot: {
        ...(snapshot ?? {}),
        actorEmail,
        status: "published",
      },
    });

    await transaction.insert(auditLogs).values({
      action: "term_published",
      entityType: "term",
      entityId: termId,
      actorEmail,
      metadata: createAuditMetadata("admin-publish", { status: "published" }),
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/terms");
}

export async function unpublishTermAction(formData: FormData) {
  const actorEmail = await requireAdmin();
  const termId = typeof formData.get("termId") === "string" ? String(formData.get("termId")) : "";

  if (!actorEmail || !db || !termId) {
    return;
  }

  const snapshot = await getTermSnapshot(termId);
  const updatedAt = new Date();

  await db.transaction(async (transaction) => {
    await transaction
      .update(terms)
      .set({
        status: "draft",
        publishedAt: null,
        updatedAt,
        updatedByEmail: actorEmail,
      })
      .where(eq(terms.id, termId));

    await transaction.insert(termRevisions).values({
      termId,
      summary: `Unpublished by ${actorEmail}.`,
      snapshot: {
        ...(snapshot ?? {}),
        actorEmail,
        status: "draft",
      },
    });

    await transaction.insert(auditLogs).values({
      action: "term_unpublished",
      entityType: "term",
      entityId: termId,
      actorEmail,
      metadata: createAuditMetadata("admin-unpublish", { status: "draft" }),
    });
  });

  revalidatePath("/");
  revalidatePath("/admin/terms");
}

export async function rollbackRevisionAction(formData: FormData) {
  const actorEmail = await requireAdmin();
  const termId = typeof formData.get("termId") === "string" ? String(formData.get("termId")) : "";
  const revisionId =
    typeof formData.get("revisionId") === "string" ? String(formData.get("revisionId")) : "";

  if (!actorEmail || !db || !termId || !revisionId) {
    return;
  }

  const [revision] = await db
    .select()
    .from(termRevisions)
    .where(and(eq(termRevisions.id, revisionId), eq(termRevisions.termId, termId)))
    .limit(1);

  const snapshot = revision ? parseSnapshot(revision.snapshot) : null;

  if (!snapshot) {
    return;
  }

  const slug = toSlug(snapshot.termName);
  const updatedAt = new Date();

  await db.transaction(async (transaction) => {
    await transaction
      .update(terms)
      .set({
        slug,
        name: snapshot.termName,
        domain: snapshot.domain,
        categoryTag: snapshot.categoryTag,
        subtopicTag: snapshot.subtopicTag,
        complexity: snapshot.complexity,
        eli5Text: snapshot.eli5,
        devLevelText: snapshot.devLevel,
        updatedByEmail: actorEmail,
        updatedAt,
      })
      .where(eq(terms.id, termId));

    await transaction.delete(termResources).where(eq(termResources.termId, termId));

    const resourceRows = [
      ...snapshot.links.map((link) => ({
        termId,
        kind: "link" as const,
        title: link,
        url: link,
        meta: {},
      })),
      ...snapshot.videos.map((video) => ({
        termId,
        kind: "video" as const,
        title: video,
        url: video,
        meta: {},
      })),
    ];

    if (resourceRows.length > 0) {
      await transaction.insert(termResources).values(resourceRows);
    }

    await transaction.insert(termRevisions).values({
      termId,
      summary: `Rolled back to revision ${revisionId} by ${actorEmail}.`,
      snapshot: {
        ...snapshot,
        slug,
        actorEmail,
      },
    });

    await transaction.insert(auditLogs).values({
      action: "term_rolled_back",
      entityType: "term",
      entityId: termId,
      actorEmail,
      metadata: createAuditMetadata("admin-rollback", { revisionId, slug }),
    });
  });

  revalidatePath("/");
  revalidatePath(`/term/${slug}`);
  revalidatePath("/admin/terms");
  revalidatePath(`/admin/terms/${termId}/edit`);
}
