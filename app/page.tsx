import { HeroSearch } from "@/components/hero-search";
import { TermCard } from "@/components/term-card";
import { getPublishedTerms } from "@/lib/data/terms";

type HomePageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const terms = await getPublishedTerms(query);

  return (
    <div className="page-stack">
      <HeroSearch query={query} resultCount={terms.length} />

      <section className="feed-header">
        <div>
          <p className="section-kicker">term feed</p>
          <h2>{query ? `Results for "${query}"` : "Fresh entries from the codetionary"}</h2>
        </div>
        <p>
          Every card gives a fast mental model first, then a more precise
          explanation for people who want the implementation details.
        </p>
      </section>

      <div className="term-feed">
        {terms.length > 0 ? (
          terms.map((term) => <TermCard key={term.slug} term={term} />)
        ) : (
          <section className="empty-state">
            <p className="section-kicker">no matches</p>
            <h2>No term matched that search.</h2>
            <p>Try a broader keyword like security, runtime, sql, or debugging.</p>
          </section>
        )}
      </div>
    </div>
  );
}
