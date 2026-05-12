"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitTermAction } from "@/app/admin/terms/new/actions";
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
      {pending ? "saving draft..." : "save draft"}
    </button>
  );
}

export function TermForm() {
  const [state, formAction] = useActionState(submitTermAction, initialTermFormState);

  return (
    <form action={formAction} className="admin-form">
      {state.status !== "idle" ? (
        <div className={`form-banner form-banner--${state.status}`}>
          <strong>{state.status === "success" ? "Submission checked" : "Submission blocked"}</strong>
          <p>{state.message}</p>
        </div>
      ) : null}

      <div className="admin-form__grid">
        <label className="field field--wide">
          <span>Term name</span>
          <input defaultValue="SQL Injection" name="termName" placeholder="Enter a term" type="text" />
          <FieldError errors={state.fieldErrors.termName} />
        </label>

        <label className="field">
          <span>Category tag</span>
          <select defaultValue="security" name="categoryTag">
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
          <input defaultValue="sql" name="subtopicTag" placeholder="sql" type="text" />
          <FieldError errors={state.fieldErrors.subtopicTag} />
        </label>

        <label className="field field--wide">
          <span>Complexity slider</span>
          <input defaultValue="24" max="100" min="0" name="complexity" type="range" />
          <div className="field__range-labels">
            <small>ELI5</small>
            <small>Expert</small>
          </div>
          <FieldError errors={state.fieldErrors.complexity} />
        </label>

        <label className="field field--wide">
          <span>ELI5 explanation</span>
          <textarea
            defaultValue="Imagine a vending machine that greets you by name. A hacker types '; DROP TABLE users; -- instead, and the machine follows those hidden instructions."
            name="eli5"
            rows={6}
          />
          <FieldError errors={state.fieldErrors.eli5} />
        </label>

        <label className="field field--wide">
          <span>Dev Level explanation</span>
          <textarea
            defaultValue="SQL injection occurs when untrusted input is concatenated directly into a query string. Use parameterized queries, strict validation, and least-privilege database roles so user input never changes SQL structure."
            name="devLevel"
            rows={8}
          />
          <FieldError errors={state.fieldErrors.devLevel} />
        </label>

        <label className="field field--wide">
          <span>Curated links</span>
          <textarea
            defaultValue={`https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
https://www.postgresql.org/docs/current/sql-prepare.html`}
            name="links"
            rows={4}
          />
          <small>One HTTPS URL per line. Trusted documentation hosts only.</small>
          <FieldError errors={state.fieldErrors.links} />
        </label>

        <label className="field field--wide">
          <span>Video URLs</span>
          <textarea
            defaultValue="https://www.youtube.com/watch?v=ciNHn38EyRc"
            name="videos"
            rows={3}
          />
          <small>Only YouTube links are accepted in v1.</small>
          <FieldError errors={state.fieldErrors.videos} />
        </label>
      </div>

      <div className="admin-form__actions">
        <p>
          The server validates every field, rejects untrusted hosts, and
          requires an allowlisted admin session before persistence.
        </p>
        <SubmitButton />
      </div>

      <FieldError errors={state.fieldErrors.form} />
    </form>
  );
}
