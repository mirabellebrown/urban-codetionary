import { z } from "zod";
import { isAllowedDocumentationUrl, isAllowedYouTubeUrl } from "@/lib/link-policy";

export const CATEGORY_OPTIONS = [
  "security",
  "databases",
  "ai",
  "networking",
  "performance",
  "productivity",
  "engineering",
  "frontend",
  "devops",
] as const;

function toStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function splitLines(value: FormDataEntryValue | null) {
  return toStringValue(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

export function buildTermSubmissionInput(formData: FormData) {
  return {
    termName: toStringValue(formData.get("termName")),
    domain: toStringValue(formData.get("domain")),
    categoryTag: toStringValue(formData.get("categoryTag")),
    subtopicTag: toStringValue(formData.get("subtopicTag")),
    complexity: Number(toStringValue(formData.get("complexity")) || 0),
    eli5: toStringValue(formData.get("eli5")),
    devLevel: toStringValue(formData.get("devLevel")),
    links: splitLines(formData.get("links")),
    videos: splitLines(formData.get("videos")),
  };
}

const baseSchema = z.object({
  termName: z.string().trim().min(2, "Term names should be at least 2 characters.").max(80),
  domain: z.string().trim().min(2, "Domain should describe where this term is used.").max(80),
  categoryTag: z.string().trim().min(2).max(48),
  subtopicTag: z.string().trim().min(2).max(48),
  complexity: z.coerce.number().int().min(0).max(100),
  eli5: z.string().trim().min(30, "ELI5 explanation should be at least 30 characters.").max(1400),
  devLevel: z
    .string()
    .trim()
    .min(50, "Dev level explanation should be at least 50 characters.")
    .max(2200),
  links: z.array(z.string().url("Each curated link must be a valid HTTPS URL.")).max(8),
  videos: z.array(z.string().url("Each video link must be a valid HTTPS URL.")).max(4),
});

export const termSubmissionSchema = baseSchema.superRefine((value, context) => {
  value.links.forEach((link, index) => {
    if (!isAllowedDocumentationUrl(link)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["links"],
        message: `Link ${index + 1} must point to a trusted documentation or article host.`,
      });
    }
  });

  value.videos.forEach((video, index) => {
    if (!isAllowedYouTubeUrl(video)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["videos"],
        message: `Video ${index + 1} must be a YouTube URL.`,
      });
    }
  });
});

export type TermSubmissionInput = z.infer<typeof termSubmissionSchema>;
