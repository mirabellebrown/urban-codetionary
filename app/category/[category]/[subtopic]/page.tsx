import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TermCard } from "@/components/term-card";
import { getTermsBySubtopic } from "@/lib/data/terms";

type SubtopicPageProps = {
  params: Promise<{ category: string; subtopic: string }>;
};

export async function generateMetadata({ params }: SubtopicPageProps): Promise<Metadata> {
  const { category, subtopic } = await params;

  return {
    title: `${subtopic} terms`,
    description: `Browse Urban Codetionary entries for ${subtopic} inside ${category}.`,
  };
}

export default async function SubtopicPage({ params }: SubtopicPageProps) {
  const { category, subtopic } = await params;
  const terms = await getTermsBySubtopic(category, subtopic);

  if (terms.length === 0) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <Link className="detail-intro__back" href={`/category/${category}`}>
          ← back to {category}
        </Link>
        <div>
          <p className="section-kicker">subtopic</p>
          <h1>{subtopic}</h1>
          <p>Published terms tagged with {category} / {subtopic}.</p>
        </div>
      </section>

      <div className="term-feed">
        {terms.map((term) => (
          <TermCard key={term.slug} term={term} />
        ))}
      </div>
    </div>
  );
}
