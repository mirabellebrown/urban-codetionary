import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TermCard } from "@/components/term-card";
import { getSubtopicsByCategory, getTermsByCategory } from "@/lib/data/terms";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  return {
    title: `${category} terms`,
    description: `Browse Urban Codetionary entries in the ${category} category.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const [terms, subtopics] = await Promise.all([
    getTermsByCategory(category),
    getSubtopicsByCategory(category),
  ]);

  if (terms.length === 0) {
    notFound();
  }

  return (
    <div className="page-stack">
      <section className="detail-intro">
        <Link className="detail-intro__back" href="/">
          ← back to feed
        </Link>
        <div>
          <p className="section-kicker">category</p>
          <h1>{category}</h1>
          <p>Browse published terms grouped by domain and subtopic.</p>
        </div>
      </section>

      <section className="browse-panel">
        <div>
          <p className="section-kicker">subtopics</p>
          <h2>Filter this category.</h2>
        </div>
        <div className="browse-pills">
          {subtopics.map((subtopic) => (
            <Link
              className="browse-pill"
              href={`/category/${category}/${subtopic.subtopic}`}
              key={subtopic.subtopic}
            >
              <span>{subtopic.subtopic}</span>
              <small>{subtopic.count}</small>
            </Link>
          ))}
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
