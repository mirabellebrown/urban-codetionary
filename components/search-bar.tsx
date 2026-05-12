import { Search } from "lucide-react";

type SearchBarProps = {
  defaultValue?: string;
  variant?: "hero" | "nav";
  action?: string;
  className?: string;
};

export function SearchBar({
  defaultValue = "",
  variant = "hero",
  action = "/",
  className = "",
}: SearchBarProps) {
  return (
    <form
      action={action}
      className={`search-bar search-bar--${variant} ${className}`.trim()}
    >
      <Search aria-hidden="true" className="search-bar__icon" />
      <input
        aria-label="Search terms"
        className="search-bar__input"
        defaultValue={defaultValue}
        name="q"
        placeholder="Search coding slang, security terms, or debugging rituals"
        type="search"
      />
      <button className="search-bar__button" type="submit">
        search
      </button>
    </form>
  );
}
