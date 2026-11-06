"use client";

import { useState } from "react";

const LAYERS = [
  {
    number: "01",
    name: "Client",
    status: "Implemented in repo · runtime unverified",
    responsibility: "The Next.js App Router frontend contains login and registration, document upload and review, dashboard, reports, and assistant routes.",
    input: "User actions and a short-lived access token stored in browser sessionStorage.",
    output: "Typed API requests and rendered document, processing, and assistant states.",
    technology: "Next.js 15 · React 19 · TypeScript",
    decision: "The frontend is not the authorization boundary; the API must validate each request. The documented sessionStorage token is readable by same-origin JavaScript, so XSS protection remains important.",
    source: "frontend/app/ · frontend/lib/api.ts · frontend/lib/session.ts",
  },
  {
    number: "02",
    name: "API and identity",
    status: "Implemented in repo · runtime unverified",
    responsibility: "FastAPI routes validate request DTOs, resolve an active user from a signed token, and coordinate document and health-question operations.",
    input: "Authenticated HTTP requests, uploaded files, metadata, and bounded question filters.",
    output: "Authorized records, durable processing jobs, or answer/evidence responses.",
    technology: "FastAPI · Pydantic · Python · JWT",
    decision: "Owner identity comes from the verified token. Request bodies and vector payloads do not get to choose which user's documents are queried.",
    source: "app/main.py · app/user/controller.py · app/documents/router.py · app/health/router.py",
  },
  {
    number: "03",
    name: "Database and file storage",
    status: "Implemented in repo · external services unverified",
    responsibility: "PostgreSQL stores users, document metadata, extracted records, chunks, processing state, and chat history. Private S3 stores original document bytes.",
    input: "Document metadata and state changes in PostgreSQL; original bytes through the storage adapter.",
    output: "Canonical owner-scoped records and private source files for processing.",
    technology: "PostgreSQL · SQLAlchemy · Alembic · Amazon S3 adapter",
    decision: "The database keeps the object key and provenance while S3 holds source bytes. Database records remain the authority for ownership and document state.",
    source: "app/health/models.py · app/documents/models.py · app/storage/s3.py · alembic/",
  },
  {
    number: "04",
    name: "Document processing",
    status: "Implemented in repo · worker runtime unverified",
    responsibility: "A durable job lifecycle feeds local PDF text and table extraction, deterministic classification and parsing, with optional local Tesseract OCR for image-heavy pages.",
    input: "An owner-authorized file and a processing generation.",
    output: "Page text, tables, findings, provenance, warnings, and processing/indexing state.",
    technology: "PyMuPDF · rule-based extraction · optional local Tesseract · PostgreSQL job ledger",
    decision: "Extraction is deterministic and separated from indexing. OCR is optional; unsupported or uncertain input can require review instead of silently producing a confident result.",
    source: "app/documents/ · docs/13-medical-data-extraction-rules.md · docs/15-document-state-machine.md",
  },
  {
    number: "05",
    name: "Chunking and retrieval",
    status: "Implemented in repo · Qdrant/model runtime unverified",
    responsibility: "Page-local chunks are embedded locally. PostgreSQL lexical candidates can be combined with optional Qdrant vector candidates, then fused and revalidated against owner and document state.",
    input: "Extracted page text, query text, authenticated identity, and optional document/date/type filters.",
    output: "A bounded set of authorized chunks and citations drawn from PostgreSQL records.",
    technology: "Sentence Transformers · PostgreSQL full-text search · optional Qdrant",
    decision: "Qdrant is a candidate index rather than the source of truth. Reciprocal-rank fusion joins lexical and vector candidates; vector failure can fall back to lexical search.",
    source: "app/health/chunking.py · app/health/embeddings.py · app/health/repository.py · docs/18-rag-retrieval-and-generation.md",
  },
  {
    number: "06",
    name: "Answer generation",
    status: "Implemented in repo · provider unverified",
    responsibility: "The answer route supplies bounded, authorized evidence to an optional OpenAI-compatible model provider and returns citations, excerpts, and generation status.",
    input: "A validated question and authorized evidence only.",
    output: "An evidence-only response or a generated answer with citations; no matching evidence yields an insufficient-evidence result without a model call.",
    technology: "Optional OpenAI-compatible chat-completions API",
    decision: "Uploaded content is treated as untrusted data. Generation has no tools, and an empty evidence set does not trigger an LLM call. Marker filtering does not guarantee entailment.",
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
          </dl>
          <p className="architecture-source"><span>Repository source</span>{active.source}</p>
        </section>
      </div>
      <p className="architecture-text-alternative">Flow summary: client → API and identity → PostgreSQL and private object storage → document processing → chunking and retrieval → optional answer generation. Every boundary is implemented in the repository; connected service operation has not been verified here.</p>
    </div>
  );
}
