export type ResourceLink = {
  label: string;
  url: string;
};

export type VideoResource = {
  title: string;
  url: string;
  channel: string;
  duration: string;
};

export type TermEntry = {
  slug: string;
  name: string;
  partOfSpeech: string;
  domain: string;
  categoryTag: string;
  subtopicTag: string;
  complexity: number;
  eli5: string;
  devLevel: string;
  upvotes: number;
  downvotes: number;
  selectedVote?: "up" | "down" | null;
  links: ResourceLink[];
  videos: VideoResource[];
};

const terms: TermEntry[] = [
  {
    slug: "sql-injection",
    name: "SQL Injection",
    partOfSpeech: "noun",
    domain: "attack vector",
    categoryTag: "databases",
    subtopicTag: "sql",
    complexity: 24,
    eli5:
      "Imagine a vending machine that greets you by name. A hacker types '; DROP TABLE users; -- instead. The machine gets confused and deletes everyone's data. That's SQL injection: sneaking commands into a database disguised as normal input.",
    devLevel:
      "SQL injection happens when untrusted input is concatenated directly into a query string, letting an attacker change query intent. Prevent it with parameterized queries, strict input validation, least-privilege database roles, and query builders that separate data from SQL structure.",
    upvotes: 284,
    downvotes: 12,
    selectedVote: "up",
    links: [
      {
        label: "OWASP SQL Injection Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html",
      },
      {
        label: "PostgreSQL PREPARE documentation",
        url: "https://www.postgresql.org/docs/current/sql-prepare.html",
      },
    ],
    videos: [
      {
        title: "SQL Injection Explained",
        url: "https://www.youtube.com/watch?v=ciNHn38EyRc",
        channel: "Web Dev Simplified",
        duration: "11m",
      },
    ],
  },
  {
    slug: "rubber-duck-debugging",
    name: "Rubber Duck Debugging",
    partOfSpeech: "noun",
    domain: "debugging method",
    categoryTag: "productivity",
    subtopicTag: "debugging",
    complexity: 9,
    eli5:
      "You explain your problem to a toy duck as if the duck has never seen code before. While talking through each step, your brain notices the mistake on its own.",
    devLevel:
      "Rubber duck debugging externalizes your reasoning. Forcing a step-by-step explanation reveals hidden assumptions, broken invariants, and missing edge cases without requiring another engineer to intervene.",
    upvotes: 192,
    downvotes: 4,
    links: [
      {
        label: "The Pragmatic Programmer",
        url: "https://pragprog.com/titles/tpp20/the-pragmatic-programmer-20th-anniversary-edition/",
      },
    ],
    videos: [
      {
        title: "Why explaining code helps",
        url: "https://www.youtube.com/watch?v=huOPVqztPdc",
        channel: "CS50",
        duration: "9m",
      },
    ],
  },
  {
    slug: "yak-shaving",
    name: "Yak Shaving",
    partOfSpeech: "noun",
    domain: "workflow spiral",
    categoryTag: "engineering",
    subtopicTag: "delivery",
    complexity: 46,
    eli5:
      "You wanted to make toast, but first you fixed the toaster, then the outlet, then the kitchen shelf, and suddenly breakfast is gone. That's yak shaving.",
    devLevel:
      "Yak shaving describes a chain of prerequisite tasks that pull you away from the original goal. It often appears during setup, tooling changes, or refactors where each dependency uncovers another blocker before the intended work can start.",
    upvotes: 143,
    downvotes: 8,
    links: [
      {
        label: "What is Yak Shaving?",
        url: "https://seths.blog/2005/03/dont_shave_that/",
      },
    ],
    videos: [],
  },
  {
    slug: "memory-leak",
    name: "Memory Leak",
    partOfSpeech: "noun",
    domain: "runtime failure",
    categoryTag: "performance",
    subtopicTag: "runtime",
    complexity: 62,
    eli5:
      "Imagine borrowing toys from a box and never putting them back. After a while, the floor is full and nobody can move. A memory leak is your app keeping things it no longer needs.",
    devLevel:
      "A memory leak occurs when objects remain reachable longer than intended, preventing garbage collection or explicit cleanup. Common causes include dangling event listeners, stale caches, unbounded queues, and closures retaining large object graphs.",
    upvotes: 211,
    downvotes: 6,
    links: [
      {
        label: "Node.js diagnostics guide",
        url: "https://nodejs.org/en/learn/diagnostics/memory/using-heap-snapshot",
      },
      {
        label: "React effect cleanup guidance",
        url: "https://react.dev/reference/react/useEffect",
      },
    ],
    videos: [
      {
        title: "Debugging memory leaks in JavaScript",
        url: "https://www.youtube.com/watch?v=LIuUx-KR0h4",
        channel: "Chrome for Developers",
        duration: "19m",
      },
    ],
  },
];

export function getPublishedTerms(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? terms.filter((term) => {
        const searchable = [
          term.name,
          term.categoryTag,
          term.subtopicTag,
          term.eli5,
          term.devLevel,
          term.domain,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(normalizedQuery);
      })
    : terms;

  return [...filtered].sort(
    (left, right) =>
      right.upvotes -
      right.downvotes -
      (left.upvotes - left.downvotes),
  );
}

export function getTermBySlug(slug: string) {
  return terms.find((term) => term.slug === slug);
}

export function getRelatedTerms(currentSlug: string, categoryTag: string) {
  return terms
    .filter((term) => term.slug !== currentSlug && term.categoryTag === categoryTag)
    .slice(0, 2);
}
