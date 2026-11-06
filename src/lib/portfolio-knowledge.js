export const PORTFOLIO_KNOWLEDGE = [
  {
    title: "About Deepesh Singh",
    path: "/#about",
    keywords: ["deepesh", "about", "robotics", "student", "education", "career", "internship", "intern", "role", "seeking", "study", "studying", "where", "college", "university"],
    text: "Deepesh Singh is studying B.Tech in Robotics and is interested in building intelligent software products. The portfolio does not specify his university. He is seeking AI Engineering and AI Backend Engineering internship opportunities. His interests include RAG, AI agents, backend architecture, and reliable AI systems.",
  },
  {
    title: "Niramaya AI project",
    path: "/projects/niramaya-ai",
    keywords: ["niramaya", "project", "healthcare", "medical", "documents", "reports", "health", "flagship"],
    text: "Niramaya AI is a medical document management and retrieval project. Its public repository contains document processing and retrieval code intended to help organize scattered medical reports into searchable health records. No live deployment, clinical validation, user outcomes, or performance benchmarks are claimed.",
  },
  {
    title: "Niramaya AI RAG architecture",
    path: "/projects/niramaya-ai#architecture",
    keywords: ["rag", "retrieval", "architecture", "qdrant", "embedding", "chunking", "vector", "search", "postgresql", "fastapi", "pipeline"],
    text: "The Niramaya AI repository includes FastAPI routes, PostgreSQL records, page-aware chunking, embeddings, optional Qdrant vector candidates, lexical retrieval, and owner checks in PostgreSQL. Retrieval quality has not been benchmarked, and external services are not verified as running.",
  },
  {
    title: "User-scoped retrieval and security",
    path: "/journal/user-scoped-retrieval",
    keywords: ["user", "scope", "scoped", "security", "authorization", "owner", "identity", "privacy", "isolation", "multi-tenant"],
    text: "Niramaya AI derives the record owner from a validated authentication context. Vector IDs are resolved again through PostgreSQL owner, document-state, and generation filters; a user-supplied user_id is not the authorization source. The code and tests are present in the repository, while deployed service behavior is unverified.",
  },
  {
    title: "Engineering interests",
    path: "/#skills",
    keywords: ["technology", "technologies", "skills", "stack", "interests", "agent", "agents", "backend", "engineering", "tools", "experience"],
    text: "Deepesh's engineering interests include retrieval augmented generation, AI agents, backend architecture, system reliability, Python, FastAPI, PostgreSQL, SQLAlchemy, embeddings, and Qdrant adapters. Agent orchestration is a learning area, not a professional or production claim.",
  },
  {
    title: "Contact Deepesh",
    path: "/#contact",
    keywords: ["contact", "email", "linkedin", "github", "reach", "connect"],
    text: "Deepesh can be contacted at mr.deepesh.singh00@gmail.com. GitHub: https://github.com/singhdeepesh20. LinkedIn: https://linkedin.com/in/contactdeepesh.",
  },
  {
    title: "Document processing journal",
    path: "/journal/document-processing",
    keywords: ["document", "processing", "pipeline", "ocr", "pdf", "worker", "background", "states", "failure"],
    text: "The document processing notes discuss durable job states, separating source files from derived records, preserving provenance, retryable background processing, and reporting extraction failures explicitly. These notes describe repository implementation and design; external worker runtime is unverified.",
  },
];

const STOP_WORDS = new Set(["a", "an", "and", "are", "about", "do", "does", "for", "how", "i", "in", "is", "it", "me", "my", "of", "the", "to", "what", "with", "you", "your", "explain", "tell", "show"]);
export const UNKNOWN_PORTFOLIO_ANSWER = "I don't have verified information about that yet. Please check the linked repository or contact Deepesh directly.";

export function retrievePortfolioNotes(question, limit = 3) {
  const tokens = [...new Set((question.toLowerCase().match(/[a-z0-9+#-]+/g) || []).filter((token) => !STOP_WORDS.has(token) && token.length > 1))];
  if (!tokens.length) return [];
  return PORTFOLIO_KNOWLEDGE.map((item) => {
    const haystack = `${item.title} ${item.keywords.join(" ")} ${item.text}`.toLowerCase();
    const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? (item.keywords.includes(token) ? 2 : 1) : 0), 0);
    return { ...item, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
}

export function answerFromPortfolioNotes(question) {
  const relevant = retrievePortfolioNotes(question, 3).filter((item) => item.score >= 2);
  if (!relevant.length) {
    return { answer: UNKNOWN_PORTFOLIO_ANSWER, sources: [], mode: "local-retrieval" };
  }
  return {
    answer: relevant.map((item) => item.text).join("\n\n"),
    sources: relevant.map(({ title, path }) => ({ title, path })),
    mode: "local-retrieval",
  };
}
