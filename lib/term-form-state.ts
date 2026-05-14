export type TermFormField =
  | "termName"
  | "domain"
  | "categoryTag"
  | "subtopicTag"
  | "complexity"
  | "eli5"
  | "devLevel"
  | "links"
  | "videos"
  | "form";

export type TermFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<TermFormField, string[]>>;
  termId?: string;
};

export const initialTermFormState: TermFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
