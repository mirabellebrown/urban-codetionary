import Link from "next/link";

type CategoryBrowserProps = {
  categories: Array<{ category: string; count: number }>;
};

export function CategoryBrowser({ categories }: CategoryBrowserProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="browse-panel">
      <div>
        <p className="section-kicker">browse categories</p>
        <h2>Jump into a domain.</h2>
      </div>
      <div className="browse-pills">
        {categories.map((category) => (
          <Link className="browse-pill" href={`/category/${category.category}`} key={category.category}>
            <span>{category.category}</span>
            <small>{category.count}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
