export type TermFormField =
  | "termName"
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
};

export const initialTermFormState: TermFormState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};
