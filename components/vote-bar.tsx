type VoteBarProps = {
  upvotes: number;
  downvotes: number;
  selectedVote?: "up" | "down" | null;
};

export function VoteBar({
  upvotes,
  downvotes,
  selectedVote = null,
}: VoteBarProps) {
  return (
    <div className="vote-bar">
      <button
        aria-pressed={selectedVote === "up"}
        className={`vote-bar__button ${
          selectedVote === "up" ? "is-active-up" : ""
        }`.trim()}
        type="button"
      >
        ▲ {upvotes}
      </button>
      <button
        aria-pressed={selectedVote === "down"}
        className={`vote-bar__button ${
          selectedVote === "down" ? "is-active-down" : ""
        }`.trim()}
        type="button"
      >
        ▼ {downvotes}
      </button>
    </div>
  );
}
