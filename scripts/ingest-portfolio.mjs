import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || process.env[match[1]]) continue;
    const value = match[2].replace(/\s+#.*$/, "").trim().replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, (_, doubleQuoted, singleQuoted) => doubleQuoted ?? singleQuoted);
    process.env[match[1]] = value;
  }
}

const required = ["LLM_API_KEY", "LLM_BASE_URL", "EMBEDDING_MODEL", "QDRANT_URL", "QDRANT_COLLECTION"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing environment variables: ${missing.join(", ")}`);

const documents = [
  { title: "About Deepesh Singh", path: "/#about", text: "Deepesh Singh is a B.Tech Robotics student interested in building intelligent software products. He is focused on retrieval augmented generation, AI agents, backend architecture, and scalable AI systems. He is seeking AI Engineering and AI Backend Engineering internship opportunities. GitHub: https://github.com/singhdeepesh20. LinkedIn: https://linkedin.com/in/contactdeepesh. Email: mr.deepesh.singh00@gmail.com." },
  { title: "Niramaya AI overview", path: "/work/niramaya-ai", text: "Niramaya AI is a medical document management and retrieval project. Its public repository includes a Next.js frontend, FastAPI backend, PostgreSQL models and migrations, document processing, chunking, embeddings, optional Qdrant retrieval, and an optional OpenAI-compatible answer provider. The repository contains code and tests; connected cloud services, deployment, clinical validation, user outcomes, and performance benchmarks are unverified and are not claimed." },
  { title: "Niramaya AI document processing", path: "/work/niramaya-ai", text: "Niramaya AI documents a durable processing workflow. Uploaded source files are stored separately from derived PostgreSQL records. PDF text and tables are extracted with PyMuPDF. Local Tesseract OCR is optional for image-heavy pages. Chunking preserves page boundaries and provenance. Processing jobs record lifecycle state and warnings. Worker and cloud runtime operation have not been verified." },
  { title: "Niramaya AI retrieval and access control", path: "/journal/user-scoped-retrieval", text: "Niramaya AI derives owner identity from a verified authentication token. PostgreSQL applies owner, current generation, ready-state, and deletion filters when resolving retrieved chunk IDs. Qdrant results are candidates, not authorization. The documented retriever can combine lexical candidates with optional Qdrant vector candidates through reciprocal-rank fusion. Retrieval quality has not been benchmarked." },
  { title: "Engineering interests", path: "/#focus", text: "Deepesh's engineering interests include retrieval augmented generation, chunking, source provenance, hybrid retrieval, AI agent orchestration, backend architecture, API design, user scoped data access, evaluation, and system reliability. AI agents and orchestration are current learning areas rather than professional or production claims." },
  { title: "Document processing pipeline article", path: "/journal/document-processing", text: "The engineering journal discusses durable document processing states, separating source files from derived records, provenance, retryable background processing, and representing failures explicitly. It is based on Niramaya AI repository implementation and design; deployment is not claimed." },
  { title: "User scoped retrieval article", path: "/journal/user-scoped-retrieval", text: "The engineering journal explains that vector similarity is not authorization. For multi user retrieval, identity should come from the validated authentication context, and retrieved candidates should be resolved through an ownership authority such as PostgreSQL before excerpts enter model context or citations." },
];

const base = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const headers = { Authorization: `Bearer ${process.env.LLM_API_KEY}`, "Content-Type": "application/json" };
const embeddingResponse = await fetch(`${base}/embeddings`, { method: "POST", headers, body: JSON.stringify({ model: process.env.EMBEDDING_MODEL, input: documents.map((document) => document.text) }) });
if (!embeddingResponse.ok) throw new Error(`Embedding request failed (${embeddingResponse.status}).`);
const vectors = (await embeddingResponse.json()).data;
if (!Array.isArray(vectors) || vectors.length !== documents.length) throw new Error("Embedding response did not contain one vector per document.");

const qdrant = process.env.QDRANT_URL.replace(/\/$/, "");
const qdrantHeaders = { "Content-Type": "application/json", ...(process.env.QDRANT_API_KEY ? { "api-key": process.env.QDRANT_API_KEY } : {}) };
const collection = encodeURIComponent(process.env.QDRANT_COLLECTION);
const exists = await fetch(`${qdrant}/collections/${collection}`, { headers: qdrantHeaders });
if (exists.status === 404) {
  const created = await fetch(`${qdrant}/collections/${collection}`, { method: "PUT", headers: qdrantHeaders, body: JSON.stringify({ vectors: { size: vectors[0].embedding.length, distance: "Cosine" } }) });
  if (!created.ok) throw new Error(`Could not create Qdrant collection (${created.status}).`);
} else if (!exists.ok) throw new Error(`Could not inspect Qdrant collection (${exists.status}).`);

const points = documents.map((document, index) => ({ id: index + 1, vector: vectors[index].embedding, payload: { ...document, scope: "portfolio" } }));
const upsert = await fetch(`${qdrant}/collections/${collection}/points?wait=true`, { method: "PUT", headers: qdrantHeaders, body: JSON.stringify({ points }) });
if (!upsert.ok) throw new Error(`Qdrant upsert failed (${upsert.status}).`);
console.log(`Indexed ${points.length} curated public portfolio passages into ${process.env.QDRANT_COLLECTION}.`);
