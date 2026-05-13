import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const termStatusEnum = pgEnum("term_status", ["draft", "published"]);
export const resourceKindEnum = pgEnum("resource_kind", ["link", "video"]);
export const auditActionEnum = pgEnum("audit_action", [
  "term_created",
  "term_updated",
  "term_published",
]);

export const terms = pgTable("terms", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  partOfSpeech: varchar("part_of_speech", { length: 24 }).notNull().default("noun"),
  domain: varchar("domain", { length: 80 }).notNull(),
  categoryTag: varchar("category_tag", { length: 48 }).notNull(),
  subtopicTag: varchar("subtopic_tag", { length: 48 }).notNull(),
  complexity: integer("complexity").notNull(),
  eli5Text: text("eli5_text").notNull(),
  devLevelText: text("dev_level_text").notNull(),
  upvotes: integer("upvotes").notNull().default(0),
  downvotes: integer("downvotes").notNull().default(0),
  status: termStatusEnum("status").notNull().default("draft"),
  createdByEmail: varchar("created_by_email", { length: 320 }).notNull(),
  updatedByEmail: varchar("updated_by_email", { length: 320 }).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const termResources = pgTable("term_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  termId: uuid("term_id")
    .notNull()
    .references(() => terms.id, { onDelete: "cascade" }),
  kind: resourceKindEnum("kind").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  url: text("url").notNull(),
  meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const termRevisions = pgTable("term_revisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  termId: uuid("term_id")
    .notNull()
    .references(() => terms.id, { onDelete: "cascade" }),
  summary: varchar("summary", { length: 200 }).notNull(),
  snapshot: jsonb("snapshot").$type<Record<string, unknown>>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  action: auditActionEnum("action").notNull(),
  entityType: varchar("entity_type", { length: 32 }).notNull(),
  entityId: uuid("entity_id"),
  actorEmail: varchar("actor_email", { length: 320 }).notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
