"use client";

import { useState } from "react";

const LAYERS = [
  {
    number: "01",
    name: "Web client",
    status: "Implemented in repository · runtime unverified",
    responsibility: "The Next.js frontend provides the document and assistant experience and sends authenticated requests to the API.",
    input: "User actions, document files, and question text.",
    output: "API requests and rendered document, processing, and answer states.",
    technology: "Next.js · React · TypeScript",
    decision: "The client improves usability; it is not the authorization boundary.",
    security: "Browser-held credentials are accessible to same-origin JavaScript. The API must validate identity and ownership for every protected operation.",
    source: "frontend/app/ · frontend/lib/api.ts",
  },
  {
    number: "02",
    name: "API boundary",
    status: "Implemented in repository · runtime unverified",
    responsibility: "FastAPI routes validate request data and coordinate authenticated document, retrieval, and answer operations.",
    input: "HTTP requests, uploaded files, metadata, and bounded query filters.",
    output: "Authorized records, durable processing jobs, or evidence-backed responses.",
    technology: "FastAPI · Pydantic · Python",
    decision: "Typed request validation and dependencies make the trust boundary explicit.",
    security: "Validate the caller and authorize each operation before returning document content or citations.",
    source: "app/main.py · app/documents/router.py · app/health/router.py",
  },
  {
    number: "03",
    name: "Authentication",
    status: "Implemented in repository · runtime unverified",
    responsibility: "Protected API routes resolve the active user from a validated signed token.",
    input: "Bearer token on a protected request.",
    output: "A server-controlled identity used by authorization and persistence layers.",
    technology: "JWT · FastAPI dependencies",
    decision: "Identity is derived from the verified authentication context, not a user_id supplied in the request body.",
    security: "Token validation and server-derived identity are required on every protected operation.",
    source: "app/user/controller.py · app/documents/router.py · app/health/router.py",
  },
  {
    number: "04",
    name: "PostgreSQL",
    status: "Implemented in repository · database service unverified",
    responsibility: "Stores canonical users, document metadata, extracted records, chunks, and processing state.",
    input: "Validated metadata, state transitions, extracted content, and authorized queries.",
    output: "Relational records and ownership-checked retrieval results.",
    technology: "PostgreSQL · SQLAlchemy · Alembic",
    decision: "Keep relational records authoritative; treat vector search results as candidates that must be resolved against this store.",
    security: "Apply owner, current-generation, ready-state, and deletion filters before content enters retrieval context.",
    source: "app/health/models.py · app/documents/models.py · alembic/",
  },
  {
    number: "05",
    name: "Private object storage",
    status: "Implemented in repository · live service unverified",
    responsibility: "Stores original uploaded document bytes separately from relational metadata and derived records.",
    input: "An owner-authorized upload and a generated storage key.",
    output: "Private source objects that authorized processing can retrieve.",
    technology: "S3-compatible storage adapter",
    decision: "Separate original bytes from queryable records; PostgreSQL tracks the object key and ownership metadata.",
    security: "Objects are intended to remain private. Access must go through server-side authorization; credentials stay on the server.",
    source: "app/storage/s3.py · app/documents/",
  },
  {
    number: "06",
    name: "Background worker",
    status: "Job lifecycle implemented · worker runtime unverified",
    responsibility: "Processes durable document jobs outside the upload request and records progress and failure states.",
    input: "A queued document and processing generation.",
    output: "Extracted page content, metadata, warnings, or an actionable failed/review state.",
    technology: "Python worker · PostgreSQL job ledger",
    decision: "Long-running extraction and indexing need explicit state, retry, and idempotency behavior.",
    security: "Worker access should be limited to the authorized document and temporary processing artifacts should be cleaned up.",
    source: "app/documents/ · docs/15-document-state-machine.md",
  },
  {
    number: "07",
    name: "Document extraction and indexing",
    status: "Implemented in repository · model runtime unverified",
    responsibility: "Extracts page text and tables, optionally applies local OCR, preserves provenance, chunks text, and creates embeddings.",
    input: "An authorized source document and a versioned processing generation.",
    output: "Page-aware chunks with source metadata and vectors for candidate search.",
    technology: "PyMuPDF · optional Tesseract · Sentence Transformers",
    decision: "Extraction is deterministic and separated from answer generation; OCR is an optional fallback, not an LLM step.",
    security: "Treat source documents as untrusted data and avoid putting sensitive content in application logs.",
    source: "app/documents/ · app/health/chunking.py · app/health/embeddings.py",
  },
  {
    number: "08",
    name: "Vector index and retrieval",
    status: "Hybrid retrieval implemented in repository · Qdrant unverified",
    responsibility: "Combines PostgreSQL lexical candidates and optional Qdrant vector candidates, then resolves candidate IDs through PostgreSQL.",
    input: "A query embedding, lexical terms, authenticated owner, and supported filters.",
    output: "A bounded set of authorized chunks with page provenance.",
    technology: "PostgreSQL full-text search · optional Qdrant · reciprocal-rank fusion",
    decision: "Qdrant is a candidate index, not an authorization source. Lexical retrieval is the documented fallback when vector search fails.",
    security: "Mandatory owner and document-state checks are applied by the relational repository. No cross-user candidate should reach context assembly.",
    source: "app/health/repository.py · app/health/router.py · docs/18-rag-retrieval-and-generation.md",
  },
  {
    number: "09",
    name: "RAG orchestration and assistant",
    status: "Implemented in repository · provider and answer quality unverified",
    responsibility: "Assembles bounded authorized evidence for an optional model provider and returns an answer with source references.",
    input: "A validated question and authorized evidence only.",
    output: "Evidence-only or generated response with citations; no evidence returns an insufficient-evidence state.",
    technology: "Optional OpenAI-compatible chat-completions API",
    decision: "An empty evidence set skips generation. The model has no tools; uploaded content is treated as untrusted data.",
    security: "Provider credentials remain server-side. Citations support traceability but do not prove every generated claim is entailed.",
    source: "app/health/assistant.py · app/health/router.py · docs/18-rag-retrieval-and-generation.md",
  },
];

export default function ArchitectureExplorer() {
  const [selectedLayer, setSelectedLayer] = useState(0);
  const active = LAYERS[selectedLayer];

  return (
    <div className="architecture-explorer">
      <p className="architecture-explorer-intro">Select a layer to inspect its responsibility, interface, and documented trade-off. Status describes repository evidence; it does not confirm deployed services.</p>
      <div className="architecture-explorer-grid">
        <ol className="architecture-layer-list" aria-label="Niramaya AI architecture layers">
          {LAYERS.map((layer, index) => (
            <li key={layer.number}>
              <button
                type="button"
                className={`architecture-layer-button ${selectedLayer === index ? "is-selected" : ""}`}
                aria-pressed={selectedLayer === index}
                aria-controls="architecture-layer-detail"
                onClick={() => setSelectedLayer(index)}
              >
                <span className="architecture-layer-number">{layer.number}</span>
                <span className="architecture-layer-copy"><strong>{layer.name}</strong><small>{layer.status}</small></span>
                <span className="architecture-layer-arrow" aria-hidden="true">{index < LAYERS.length - 1 ? "↓" : "↘"}</span>
              </button>
            </li>
          ))}
        </ol>
        <section className="architecture-layer-detail" id="architecture-layer-detail" aria-live="polite" aria-labelledby="architecture-active-title">
          <p className="section-kicker">LAYER {active.number} / {active.status}</p>
          <h3 id="architecture-active-title">{active.name}</h3>
          <p className="architecture-responsibility">{active.responsibility}</p>
          <dl>
            <div><dt>Input</dt><dd>{active.input}</dd></div>
            <div><dt>Output</dt><dd>{active.output}</dd></div>
            <div><dt>Technology</dt><dd>{active.technology}</dd></div>
            <div><dt>Observed decision</dt><dd>{active.decision}</dd></div>
            <div><dt>Security</dt><dd>{active.security}</dd></div>
          </dl>
          <p className="architecture-source"><span>Repository source</span>{active.source}</p>
        </section>
      </div>
      <p className="architecture-text-alternative">Flow summary: client → API and identity → PostgreSQL and private object storage → document processing → chunking and retrieval → optional answer generation. Every boundary is implemented in the repository; connected service operation has not been verified here.</p>
    </div>
  );
}
