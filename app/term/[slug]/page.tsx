import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TermCard } from "@/components/term-card";
import { getRelatedTerms, getTermBySlug } from "@/lib/data/terms";

type TermPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    return {
      title: "Term not found",
    };
  }

  return {
    title: term.name,
    description: term.eli5,
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const { slug } = await params;
  const term = await getTermBySlug(slug);

  if (!term) {
    notFound();
  }

  const relatedTerms = await getRelatedTerms(term.slug, term.categoryTag);

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <Link className="detail-intro__back" href="/">
          ← back to feed
        </Link>
        <div>
          <p className="section-kicker">term detail</p>
          <h1>{term.name}</h1>
          <p>
            A richer single-entry view with references, supporting explanations,
            and room for future revision history.
          </p>
        </div>
      </section>

      <TermCard defaultLearnMoreOpen detailPage term={term} />

      {relatedTerms.length > 0 ? (
        <section className="related-terms">
          <div className="feed-header feed-header--compact">
            <div>
              <p className="section-kicker">same category</p>
              <h2>Keep exploring</h2>
            </div>
          </div>
          <div className="term-feed term-feed--compact">
            {relatedTerms.map((relatedTerm) => (
              <TermCard key={relatedTerm.slug} term={relatedTerm} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
