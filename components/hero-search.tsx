import { SearchBar } from "@/components/search-bar";

type HeroSearchProps = {
  query: string;
  resultCount: number;
};

export function HeroSearch({ query, resultCount }: HeroSearchProps) {
  return (
    <section className="hero-panel">
      <div className="hero-panel__copy">
        <p className="hero-panel__eyebrow">community-style dictionary for developers</p>
        <h1>Understand the language developers actually use.</h1>
        <p>
          Urban Codetionary pairs approachable explanations with dev-level
          context so terms are useful to beginners, professionals, and everyone
          in between.
        </p>
      </div>
      <SearchBar defaultValue={query} />
      <div className="hero-panel__meta">
        <span>{resultCount} terms in the current feed</span>
        <span>
          Security-minded, SEO-friendly, and built to grow into a real community
          platform.
        </span>
      </div>
    </section>
  );
}
