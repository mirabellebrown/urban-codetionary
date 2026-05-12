import Link from "next/link";
import { ComplexityScale } from "@/components/complexity-scale";
import { LearnMore } from "@/components/learn-more";
import { VoteBar } from "@/components/vote-bar";
import type { TermEntry } from "@/lib/content/terms";

const binaryRows = [
  "1010001000010110101110001010000110101111011",
  "0101100111010000101001110100011010101010100",
  "1010111010010101110001010000110101101100110",
  "0001011101010100011010111000101000011010101",
  "1110001010000110101111010101000110101110001",
  "0011010111000101000011010111101010100011010",
  "1010100011010111000101000011010111101010100",
  "0101000011010111101010100011010111000101000",
  "1101011110101010001101011100010100001101011",
  "0010101000110101110001010000110101111010101",
];

type TermCardProps = {
  term: TermEntry;
  defaultLearnMoreOpen?: boolean;
  detailPage?: boolean;
};

export function TermCard({
  term,
  defaultLearnMoreOpen = false,
  detailPage = false,
}: TermCardProps) {
  return (
    <article className="term-card">
      <div aria-hidden="true" className="term-card__noise">
        {binaryRows.map((row) => (
          <span key={`${term.slug}-${row}`}>{row}</span>
        ))}
      </div>
      <div aria-hidden="true" className="term-card__scanlines" />

      <div className="term-card__inner">
        <div className="term-card__chrome">
          <div className="term-card__dots">
            <span />
            <span />
            <span />
          </div>
          <p>
            urban_codetionary <strong>term.exe</strong>
          </p>
        </div>

        <div className="term-card__heading">
          <div>
            <h2>
              {detailPage ? (
                <span>{term.name}</span>
              ) : (
                <Link href={`/term/${term.slug}`}>{term.name}</Link>
              )}
              <span aria-hidden="true" className="term-card__cursor">
                _
              </span>
            </h2>
            <p className="term-card__subline">
              {term.partOfSpeech} / {term.domain} / {term.categoryTag} /{" "}
              {term.subtopicTag}
            </p>
          </div>
          <div className="term-card__tags">
            <span>{term.categoryTag}</span>
            <span>{term.subtopicTag}</span>
          </div>
        </div>

        <ComplexityScale value={term.complexity} />

        <div className="term-card__sections">
          <section className="term-section">
            <p className="term-section__label">{"// eli5"}</p>
            <p>{term.eli5}</p>
          </section>
          <section className="term-section">
            <p className="term-section__label">{"// dev level"}</p>
            <p>{term.devLevel}</p>
          </section>
        </div>

        <div className="term-card__footer">
          <VoteBar
            downvotes={term.downvotes}
            selectedVote={term.selectedVote}
            upvotes={term.upvotes}
          />
          <LearnMore
            defaultOpen={defaultLearnMoreOpen}
            links={term.links}
            videos={term.videos}
          />
        </div>
      </div>
    </article>
  );
}
