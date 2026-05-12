import Link from "next/link";
import { SearchBar } from "@/components/search-bar";

type SiteHeaderProps = {
  query?: string;
};

export function SiteHeader({ query = "" }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-header__brand" href="/">
          <span className="site-header__logo">UC</span>
          <span>
            <strong>Urban Codetionary</strong>
            <small>developer slang, decoded</small>
          </span>
        </Link>
        <SearchBar className="site-header__search" defaultValue={query} variant="nav" />
        <Link className="site-header__submit" href="/admin/terms/new">
          Submit a term
        </Link>
      </div>
    </header>
  );
}
