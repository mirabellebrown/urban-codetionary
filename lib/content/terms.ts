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

function getVoteScore(term: TermEntry) {
  return term.upvotes - term.downvotes;
}

export function getTermSearchScore(term: TermEntry, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return getVoteScore(term);
  }

  const fields = [
    { value: term.name, weight: 60 },
    { value: term.categoryTag, weight: 35 },
    { value: term.subtopicTag, weight: 35 },
    { value: term.domain, weight: 25 },
    { value: term.eli5, weight: 8 },
    { value: term.devLevel, weight: 8 },
  ];

  return fields.reduce((score, field) => {
    const value = field.value.toLowerCase();

    if (value === normalizedQuery) {
      return score + field.weight * 2;
    }

    if (value.includes(normalizedQuery)) {
      return score + field.weight;
    }

    return score;
  }, 0);
}

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
  {
    slug: "n-plus-one-query",
    name: "N+1 Query",
    partOfSpeech: "noun",
    domain: "database performance",
    categoryTag: "databases",
    subtopicTag: "query-performance",
    complexity: 49,
    eli5:
      "You ask one friend for a list of classmates, then call every classmate one by one for their favorite snack. It works, but it is slow. An N+1 query is a database version of that mistake.",
    devLevel:
      "An N+1 query happens when code runs one initial query and then issues another query for each returned row. Fix it with joins, eager loading, batching, or query shapes that fetch related data in fewer round trips.",
    upvotes: 188,
    downvotes: 6,
    links: [
      {
        label: "Prisma query optimization guide",
        url: "https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance",
      },
      {
        label: "PostgreSQL join documentation",
        url: "https://www.postgresql.org/docs/current/queries-table-expressions.html",
      },
    ],
    videos: [],
  },
  {
    slug: "idempotency",
    name: "Idempotency",
    partOfSpeech: "noun",
    domain: "api safety",
    categoryTag: "backend",
    subtopicTag: "apis",
    complexity: 45,
    eli5:
      "Pressing an elevator button once or ten times should still call the elevator once. Idempotency means repeating the same request does not accidentally repeat the side effect.",
    devLevel:
      "Idempotency is a property where repeated identical operations produce the same final state. APIs often use idempotency keys to make retries safe for payments, job creation, message processing, and other side-effecting actions.",
    upvotes: 204,
    downvotes: 5,
    links: [
      {
        label: "MDN HTTP request methods",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods",
      },
      {
        label: "Stripe idempotent requests",
        url: "https://docs.stripe.com/api/idempotent_requests",
      },
    ],
    videos: [],
  },
  {
    slug: "rate-limiting",
    name: "Rate Limiting",
    partOfSpeech: "noun",
    domain: "traffic control",
    categoryTag: "security",
    subtopicTag: "abuse-prevention",
    complexity: 38,
    eli5:
      "A water fountain can only pour so much water at once. Rate limiting tells users or bots they have to slow down when they ask for too much too fast.",
    devLevel:
      "Rate limiting restricts how many requests a client can make in a time window. Common implementations use fixed windows, sliding windows, token buckets, or leaky buckets to protect availability and reduce abuse.",
    upvotes: 221,
    downvotes: 4,
    links: [
      {
        label: "Cloudflare rate limiting concepts",
        url: "https://developers.cloudflare.com/waf/rate-limiting-rules/",
      },
    ],
    videos: [],
  },
  {
    slug: "csrf",
    name: "CSRF",
    partOfSpeech: "noun",
    domain: "web attack",
    categoryTag: "security",
    subtopicTag: "web-security",
    complexity: 52,
    eli5:
      "You are logged into your bank, and a sneaky website tries to make your browser press a bank button without asking you. CSRF is tricking a trusted browser session into doing something unwanted.",
    devLevel:
      "Cross-Site Request Forgery abuses authenticated browser state to submit unwanted requests. Mitigate it with SameSite cookies, CSRF tokens, origin checks, and avoiding unsafe state changes through GET requests.",
    upvotes: 167,
    downvotes: 8,
    links: [
      {
        label: "OWASP CSRF Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
      },
      {
        label: "MDN SameSite cookies",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite",
      },
    ],
    videos: [],
  },
  {
    slug: "oauth",
    name: "OAuth",
    partOfSpeech: "noun",
    domain: "authorization protocol",
    categoryTag: "security",
    subtopicTag: "auth",
    complexity: 57,
    eli5:
      "OAuth is like giving a valet key to an app. It lets the app do specific things without giving it your real password.",
    devLevel:
      "OAuth is an authorization framework for delegated access. Instead of sharing credentials, clients receive scoped tokens after a redirect-based grant flow, commonly using PKCE for public clients.",
    upvotes: 239,
    downvotes: 10,
    links: [
      {
        label: "GitHub OAuth app documentation",
        url: "https://docs.github.com/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps",
      },
      {
        label: "Auth.js OAuth guide",
        url: "https://authjs.dev/getting-started/authentication/oauth",
      },
    ],
    videos: [],
  },
  {
    slug: "webhook",
    name: "Webhook",
    partOfSpeech: "noun",
    domain: "event callback",
    categoryTag: "backend",
    subtopicTag: "integrations",
    complexity: 31,
    eli5:
      "A webhook is a doorbell for apps. Instead of checking every minute if something happened, another app rings your doorbell when it does.",
    devLevel:
      "A webhook is an HTTP callback triggered by an external event. Production webhook handlers should verify signatures, be idempotent, respond quickly, and move slow work into background processing.",
    upvotes: 173,
    downvotes: 4,
    links: [
      {
        label: "GitHub webhook documentation",
        url: "https://docs.github.com/webhooks",
      },
    ],
    videos: [],
  },
  {
    slug: "feature-flag",
    name: "Feature Flag",
    partOfSpeech: "noun",
    domain: "release control",
    categoryTag: "engineering",
    subtopicTag: "delivery",
    complexity: 29,
    eli5:
      "A feature flag is a light switch for code. The code can be in the house, but you choose when to turn the light on.",
    devLevel:
      "A feature flag gates behavior at runtime, letting teams separate deployment from release. Flags support gradual rollouts, experiments, kill switches, and safer migrations, but stale flags become technical debt.",
    upvotes: 146,
    downvotes: 3,
    links: [
      {
        label: "Martin Fowler on feature toggles",
        url: "https://martinfowler.com/articles/feature-toggles.html",
      },
    ],
    videos: [],
  },
  {
    slug: "edge-function",
    name: "Edge Function",
    partOfSpeech: "noun",
    domain: "edge runtime",
    categoryTag: "backend",
    subtopicTag: "edge",
    complexity: 47,
    eli5:
      "An edge function is code that runs close to the person using your website, like opening a tiny helper desk in their neighborhood instead of only at headquarters.",
    devLevel:
      "An edge function runs in geographically distributed runtimes to reduce latency for request handling. It is useful for redirects, personalization, auth checks, and lightweight APIs, but usually has stricter runtime limits than a full server.",
    upvotes: 132,
    downvotes: 4,
    links: [
      {
        label: "Vercel Edge Functions docs",
        url: "https://vercel.com/docs/functions/runtimes/edge",
      },
      {
        label: "Cloudflare Workers docs",
        url: "https://developers.cloudflare.com/workers/",
      },
    ],
    videos: [],
  },
  {
    slug: "race-condition",
    name: "Race Condition",
    partOfSpeech: "noun",
    domain: "concurrency bug",
    categoryTag: "engineering",
    subtopicTag: "concurrency",
    complexity: 64,
    eli5:
      "Two people try to write on the same sticky note at the same time. Whoever writes last wins, and the result may be wrong. That is the feeling of a race condition.",
    devLevel:
      "A race condition occurs when program behavior depends on unpredictable timing between concurrent operations. Fixes often involve locks, transactions, atomic operations, queues, or designing state transitions to be conflict-safe.",
    upvotes: 201,
    downvotes: 6,
    links: [
      {
        label: "MDN JavaScript concurrency model",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
      },
    ],
    videos: [],
  },
  {
    slug: "observability",
    name: "Observability",
    partOfSpeech: "noun",
    domain: "production visibility",
    categoryTag: "devops",
    subtopicTag: "monitoring",
    complexity: 50,
    eli5:
      "Observability is giving your app a dashboard, a diary, and a set of alarms so you can understand what happened when something feels broken.",
    devLevel:
      "Observability is the ability to infer system state from outputs like logs, metrics, traces, events, and errors. Good observability helps teams debug unknown failures without shipping new instrumentation every time.",
    upvotes: 184,
    downvotes: 5,
    links: [
      {
        label: "OpenTelemetry documentation",
        url: "https://opentelemetry.io/docs/",
      },
    ],
    videos: [],
  },
  {
    slug: "cache-invalidation",
    name: "Cache Invalidation",
    partOfSpeech: "noun",
    domain: "state freshness",
    categoryTag: "performance",
    subtopicTag: "caching",
    complexity: 61,
    eli5:
      "A cache is a shortcut notebook. Cache invalidation is knowing when the notebook is old and needs a fresh answer.",
    devLevel:
      "Cache invalidation is the process of expiring or updating cached data when source data changes. It is hard because freshness, latency, consistency, and cost often trade off against each other.",
    upvotes: 198,
    downvotes: 9,
    links: [
      {
        label: "Next.js caching docs",
        url: "https://nextjs.org/docs/app/building-your-application/caching",
      },
    ],
    videos: [],
  },
];

export function getPublishedTerms(query = "") {
  const normalizedQuery = query.trim().toLowerCase();

  const filtered = normalizedQuery
    ? starterTerms.filter((term) => getTermSearchScore(term, normalizedQuery) > 0)
    : starterTerms;

  return [...filtered].sort(
    (left, right) =>
      getTermSearchScore(right, normalizedQuery) -
      getTermSearchScore(left, normalizedQuery) ||
      getVoteScore(right) -
      getVoteScore(left),
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
