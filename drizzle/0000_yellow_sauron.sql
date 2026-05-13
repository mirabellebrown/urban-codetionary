CREATE TYPE "public"."audit_action" AS ENUM('term_created', 'term_updated', 'term_published');--> statement-breakpoint
CREATE TYPE "public"."resource_kind" AS ENUM('link', 'video');--> statement-breakpoint
CREATE TYPE "public"."term_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" "audit_action" NOT NULL,
	"entity_type" varchar(32) NOT NULL,
	"entity_id" uuid,
	"actor_email" varchar(320) NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "term_resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"kind" "resource_kind" NOT NULL,
	"title" varchar(160) NOT NULL,
	"url" text NOT NULL,
	"meta" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "term_revisions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"term_id" uuid NOT NULL,
	"summary" varchar(200) NOT NULL,
	"snapshot" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "terms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(140) NOT NULL,
	"name" varchar(80) NOT NULL,
	"part_of_speech" varchar(24) DEFAULT 'noun' NOT NULL,
	"domain" varchar(80) NOT NULL,
	"category_tag" varchar(48) NOT NULL,
	"subtopic_tag" varchar(48) NOT NULL,
	"complexity" integer NOT NULL,
	"eli5_text" text NOT NULL,
	"dev_level_text" text NOT NULL,
	"upvotes" integer DEFAULT 0 NOT NULL,
	"downvotes" integer DEFAULT 0 NOT NULL,
	"status" "term_status" DEFAULT 'draft' NOT NULL,
	"created_by_email" varchar(320) NOT NULL,
	"updated_by_email" varchar(320) NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "terms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "term_resources" ADD CONSTRAINT "term_resources_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "term_revisions" ADD CONSTRAINT "term_revisions_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;