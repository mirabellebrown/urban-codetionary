import Link from "next/link";

export default function NotFound() {
  return (
    <section className="empty-state">
      <p className="section-kicker">404</p>
      <h2>That term is not in the codetionary yet.</h2>
      <p>Head back to the main feed to browse the current entries.</p>
      <Link className="empty-state__link" href="/">
        Return to the homepage
      </Link>
    </section>
  );
}
