"use server";

import { eq } from "drizzle-orm";
import { auditLogs, termResources, termRevisions, terms } from "@/db/schema";
import { getCurrentSession, isAdminSession } from "@/lib/auth";
import { createAuditMetadata } from "@/lib/audit";
import { db } from "@/lib/db";
import { initialTermFormState, type TermFormState } from "@/lib/term-form-state";
import { buildTermSubmissionInput, termSubmissionSchema, toSlug } from "@/lib/validation";

export async function submitTermAction(
  _previousState: TermFormState,
  formData: FormData,
): Promise<TermFormState> {
  const session = await getCurrentSession();

  if (!isAdminSession(session)) {
    return {
      ...initialTermFormState,
      status: "error",
      message: "Admin sign-in is required before a term can be saved.",
      fieldErrors: {
        form: ["Authenticate with an allowlisted GitHub account before submitting content."],
      },
    };
  }

  const rawInput = buildTermSubmissionInput(formData);
  const parsedInput = termSubmissionSchema.safeParse(rawInput);

  if (!parsedInput.success) {
    return {
      status: "error",
      message: "Fix the highlighted fields and try again.",
      fieldErrors: parsedInput.error.flatten().fieldErrors,
    };
  }

  const payload = parsedInput.data;
  const slug = toSlug(payload.termName);
  const actorEmail = session?.user?.email ?? "unknown@example.com";

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

  if (!db) {
    return {
      ...initialTermFormState,
      status: "success",
      message:
        "Validation passed. Configure DATABASE_URL to persist drafts and store revision history.",
    };
  }

  const existing = await db.select({ slug: terms.slug }).from(terms).where(eq(terms.slug, slug)).limit(1);

  if (existing.length > 0) {
    return {
      ...initialTermFormState,
      status: "error",
      message: "A term with this slug already exists.",
      fieldErrors: {
        termName: ["Choose a different term name or edit the existing entry instead."],
      },
    };
  }

  await db.transaction(async (transaction) => {
    const [createdTerm] = await transaction
      .insert(terms)
      .values({
        slug,
        name: payload.termName,
        partOfSpeech: "noun",
        domain: payload.domain,
        categoryTag: payload.categoryTag,
        subtopicTag: payload.subtopicTag,
        complexity: payload.complexity,
        eli5Text: payload.eli5,
        devLevelText: payload.devLevel,
        status: "draft",
        createdByEmail: actorEmail,
        updatedByEmail: actorEmail,
      })
      .returning({ id: terms.id });

    const resourceRows = [
      ...payload.links.map((link) => ({
        termId: createdTerm.id,
        kind: "link" as const,
        title: link,
        url: link,
        meta: {},
      })),
      ...payload.videos.map((video) => ({
        termId: createdTerm.id,
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
      termId: createdTerm.id,
      summary: "Created initial draft from admin submission form.",
      snapshot: {
        ...payload,
        slug,
        actorEmail,
      },
    });

    await transaction.insert(auditLogs).values({
      action: "term_created",
      entityType: "term",
      entityId: createdTerm.id,
      actorEmail,
      metadata: createAuditMetadata("admin-form", {
        slug,
        resourceCount: resourceRows.length,
        status: "draft",
      }),
    });
  });

  return {
    ...initialTermFormState,
    status: "success",
    message: "Draft saved. Revision and audit records were created alongside the term.",
  };
}
