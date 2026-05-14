"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateTermAction } from "@/app/admin/terms/actions";
import type { AdminTermWithResources } from "@/lib/data/admin-terms";
import { initialTermFormState } from "@/lib/term-form-state";
import { CATEGORY_OPTIONS } from "@/lib/validation";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) {
    return null;
  }

  return <p className="field__error">{errors[0]}</p>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button className="primary-button" type="submit">
      {pending ? "saving changes..." : "save changes"}
    </button>
  );
}

function getResourceValue(term: AdminTermWithResources, kind: "link" | "video") {
  return term.resources
    .filter((resource) => resource.kind === kind)
    .map((resource) => resource.url)
    .join("\n");
}

export function EditTermForm({ term }: { term: AdminTermWithResources }) {
  const [state, formAction] = useActionState(updateTermAction, initialTermFormState);

  return (
    <form action={formAction} className="admin-form">
      <input name="termId" type="hidden" value={term.id} />

      {state.status !== "idle" ? (
        <div className={`form-banner form-banner--${state.status}`}>
          <strong>{state.status === "success" ? "Term saved" : "Update blocked"}</strong>
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="admin-form__grid">
        <label className="field field--wide">
          <span>Term name</span>
          <input defaultValue={term.name} name="termName" type="text" />
          <FieldError errors={state.fieldErrors.termName} />
        </label>

        <label className="field field--wide">
          <span>Domain</span>
          <input defaultValue={term.domain} name="domain" type="text" />
          <FieldError errors={state.fieldErrors.domain} />
        </label>

        <label className="field">
          <span>Category tag</span>
          <select defaultValue={term.categoryTag} name="categoryTag">
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <FieldError errors={state.fieldErrors.categoryTag} />
        </label>

        <label className="field">
          <span>Subtopic tag</span>
          <input defaultValue={term.subtopicTag} name="subtopicTag" type="text" />
          <FieldError errors={state.fieldErrors.subtopicTag} />
        </label>

        <label className="field field--wide">
          <span>Complexity slider</span>
          <input defaultValue={term.complexity} max="100" min="0" name="complexity" type="range" />
          <div className="field__range-labels">
            <small>ELI5</small>
            <small>Expert</small>
          </div>
          <FieldError errors={state.fieldErrors.complexity} />
        </label>

        <label className="field field--wide">
          <span>ELI5 explanation</span>
          <textarea defaultValue={term.eli5Text} name="eli5" rows={6} />
          <FieldError errors={state.fieldErrors.eli5} />
        </label>

        <label className="field field--wide">
          <span>Dev Level explanation</span>
          <textarea defaultValue={term.devLevelText} name="devLevel" rows={8} />
          <FieldError errors={state.fieldErrors.devLevel} />
        </label>

        <label className="field field--wide">
          <span>Curated links</span>
          <textarea defaultValue={getResourceValue(term, "link")} name="links" rows={4} />
          <small>One HTTPS URL per line. Trusted documentation hosts only.</small>
          <FieldError errors={state.fieldErrors.links} />
        </label>

        <label className="field field--wide">
          <span>Video URLs</span>
          <textarea defaultValue={getResourceValue(term, "video")} name="videos" rows={3} />
          <small>Only YouTube links are accepted in v1.</small>
          <FieldError errors={state.fieldErrors.videos} />
        </label>
      </div>

      <div className="admin-form__actions">
        <p>Saving records a revision snapshot and audit event.</p>
        <SubmitButton />
      </div>

      <FieldError errors={state.fieldErrors.form} />
    </form>
  );
}
