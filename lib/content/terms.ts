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

export const starterTerms: TermEntry[] = [
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
  {
    slug: "prompt-injection",
    name: "Prompt Injection",
    partOfSpeech: "noun",
    domain: "model security",
    categoryTag: "ai",
    subtopicTag: "llm-security",
    complexity: 58,
    eli5:
      "Imagine giving a robot helper a rulebook, then someone slips in a note saying ignore the rulebook and do what I say. Prompt injection is that trick, but aimed at AI systems.",
    devLevel:
      "Prompt injection is an input attack where user-controlled text attempts to override system instructions, reveal hidden context, or trigger unsafe tool use. Treat model input as untrusted data, isolate tools, constrain outputs, and validate actions outside the model.",
    upvotes: 176,
    downvotes: 9,
    links: [
      {
        label: "OWASP LLM Top 10",
        url: "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
      },
      {
        label: "OpenAI safety best practices",
        url: "https://platform.openai.com/docs/guides/safety-best-practices",
      },
    ],
    videos: [],
  },
  {
    slug: "dns-propagation",
    name: "DNS Propagation",
    partOfSpeech: "noun",
    domain: "networking delay",
    categoryTag: "networking",
    subtopicTag: "dns",
    complexity: 35,
    eli5:
      "You changed your address, but not every phone book updates at the same time. DNS propagation is the waiting period while the internet learns the new address for a domain.",
    devLevel:
      "DNS propagation is the time it takes for recursive resolvers and caches to observe updated DNS records. The practical delay depends on TTL values, resolver cache behavior, registrar updates, and whether stale records were cached before the change.",
    upvotes: 128,
    downvotes: 3,
    links: [
      {
        label: "Cloudflare DNS concepts",
        url: "https://developers.cloudflare.com/dns/concepts/",
      },
    ],
    videos: [],
  },
  {
    slug: "hydration-error",
    name: "Hydration Error",
    partOfSpeech: "noun",
    domain: "frontend rendering",
    categoryTag: "frontend",
    subtopicTag: "react",
    complexity: 54,
    eli5:
      "The server draws a page, then the browser tries to bring it to life. A hydration error happens when the browser sees a different page than the one the server drew.",
    devLevel:
      "A hydration error occurs when client-rendered React output does not match server-rendered HTML. Common causes include non-deterministic values, browser-only APIs during render, time-dependent markup, and conditional UI that differs between server and client.",
    upvotes: 159,
    downvotes: 7,
    links: [
      {
        label: "Next.js hydration error docs",
        url: "https://nextjs.org/docs/messages/react-hydration-error",
      },
      {
        label: "React hydrateRoot reference",
        url: "https://react.dev/reference/react-dom/client/hydrateRoot",
      },
    ],
    videos: [],
  },
  {
    slug: "ci-flake",
    name: "CI Flake",
    partOfSpeech: "noun",
    domain: "delivery risk",
    categoryTag: "devops",
    subtopicTag: "ci",
    complexity: 42,
    eli5:
      "A CI flake is a test that sometimes says the code is broken and sometimes says it is fine, even when nobody changed anything.",
    devLevel:
      "A CI flake is nondeterministic pipeline behavior, usually from timing assumptions, shared state, network dependencies, test order coupling, or insufficient isolation. Flakes erode trust in CI because engineers stop treating failures as actionable signals.",
    upvotes: 117,
    downvotes: 5,
    links: [
      {
        label: "GitHub Actions docs",
        url: "https://docs.github.com/actions",
      },
    ],
    videos: [],
  },
];

export function getPublishedTerms(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? starterTerms.filter((term) => {
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
    : starterTerms;

  return [...filtered].sort(
    (left, right) =>
      right.upvotes -
      right.downvotes -
      (left.upvotes - left.downvotes),
  );
}

export function getTermBySlug(slug: string) {
  return starterTerms.find((term) => term.slug === slug);
}

export function getRelatedTerms(currentSlug: string, categoryTag: string) {
  const currentTerm = getTermBySlug(currentSlug);

  return starterTerms
    .filter((term) => term.slug !== currentSlug && term.categoryTag === categoryTag)
    .sort((left, right) => {
      if (!currentTerm) {
        return right.upvotes - right.downvotes - (left.upvotes - left.downvotes);
      }

      const leftSubtopicMatch = left.subtopicTag === currentTerm.subtopicTag ? 1 : 0;
      const rightSubtopicMatch = right.subtopicTag === currentTerm.subtopicTag ? 1 : 0;
      const leftComplexityDistance = Math.abs(left.complexity - currentTerm.complexity);
      const rightComplexityDistance = Math.abs(right.complexity - currentTerm.complexity);

      return (
        rightSubtopicMatch -
        leftSubtopicMatch ||
        leftComplexityDistance -
        rightComplexityDistance ||
        right.upvotes -
        right.downvotes -
        (left.upvotes - left.downvotes)
      );
    })
    .slice(0, 2);
}

export function getCategories() {
  return Array.from(
    starterTerms.reduce((categories, term) => {
      const current = categories.get(term.categoryTag) ?? { category: term.categoryTag, count: 0 };
      categories.set(term.categoryTag, { ...current, count: current.count + 1 });
      return categories;
    }, new Map<string, { category: string; count: number }>()),
  )
    .map(([, value]) => value)
    .sort((left, right) => left.category.localeCompare(right.category));
}

export function getSubtopicsByCategory(category: string) {
  return Array.from(
    starterTerms
      .filter((term) => term.categoryTag === category)
      .reduce((subtopics, term) => {
        const current = subtopics.get(term.subtopicTag) ?? {
          category: term.categoryTag,
          subtopic: term.subtopicTag,
          count: 0,
        };
        subtopics.set(term.subtopicTag, { ...current, count: current.count + 1 });
        return subtopics;
      }, new Map<string, { category: string; subtopic: string; count: number }>()),
  )
    .map(([, value]) => value)
    .sort((left, right) => left.subtopic.localeCompare(right.subtopic));
}

export function getTermsByCategory(category: string) {
  return getPublishedTerms().filter((term) => term.categoryTag === category);
}

export function getTermsBySubtopic(category: string, subtopic: string) {
  return getPublishedTerms().filter(
    (term) => term.categoryTag === category && term.subtopicTag === subtopic,
  );
}
