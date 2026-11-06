"use client";

import { useState } from "react";

const STAGES = [
  {
    name: "Upload",
    input: "User-selected document",
    output: "Private object and document record",
    detail:
      "The API authorizes the upload, stores the original through the storage adapter, and records metadata in PostgreSQL.",
    failure: "Reject an invalid or unauthorized upload; do not expose storage credentials or object URLs.",
  },
  {
    name: "Validate",
    input: "File bytes and metadata",
    output: "Accepted document or validation error",
    detail:
      "Check supported type, size, and parseability before scheduling expensive work.",
    failure: "Return an actionable validation error and leave no searchable partial record.",
  },
  {
    name: "Queue",
    input: "Validated document and processing generation",
    output: "Durable job state",
    detail:
      "Create a trackable job so extraction can continue outside the request/response cycle.",
    failure:
      "Persist state transitions and use a stable generation/idempotency boundary to prevent duplicate derived records.",
  },
  {
    name: "Extract",
    input: "Authorized source document",
    output: "Page text, tables, and provenance",
    detail:
      "Use deterministic PDF text and table extraction, preserving page and source metadata.",
    failure:
      "Record warnings and extraction method; low-quality or unsupported content can require review.",
  },
  {
    name: "OCR fallback",
    input: "Pages with insufficient extractable text",
    output: "OCR text and quality warnings",
    detail:
      "Optionally use local Tesseract for image-heavy pages. OCR is a fallback extraction technique; no LLM is used in this processing pipeline.",
    failure:
      "Keep OCR optional, surface low-confidence results for review, and do not silently treat uncertain text as authoritative.",
  },
  {
    name: "Chunk",
    input: "Normalized page text",
    output: "Page-local overlapping chunks",
    detail:
      "Chunk within page boundaries and retain source-page metadata so retrieval results can be traced back to the report.",
    failure:
      "Version chunking settings and IDs so reprocessing can replace stale generations without duplicating indexed content.",
  },
  {
    name: "Embed",
    input: "Text chunks",
    output: "Embedding vectors",
    detail:
      "Generate vectors with the configured local embedding model; the model runtime is not verified by this portfolio.",
    failure:
      "Persist an explicit failed/retryable state when model loading or inference fails.",
  },
  {
    name: "Index",
    input: "Chunk IDs, vectors, and metadata",
    output: "Search candidates",
    detail:
      "Write optional Qdrant points while retaining PostgreSQL as the authority for ownership and document state.",
    failure:
      "Use idempotent point IDs, retry transient failures, and keep incomplete generations out of retrieval.",
  },
];

const STATES = [
  ["UPLOADED", "The API accepted the file and created its document record."],
  ["QUEUED", "A durable job is ready for a worker to claim."],
  ["PROCESSING", "Extraction and indexing run with a versioned generation and recorded warnings."],
  ["REVIEW_REQUIRED", "Content or extraction quality needs a person to inspect it."],
  ["COMPLETED", "Processing finished and eligible derived content can be searched."],
  ["FAILED", "A terminal processing error is recorded with a safe, actionable reason."],
  ["DELETION_PENDING", "The document is excluded from retrieval while cleanup completes."],
];

export default function ProcessingLifecycle() {
  const [active, setActive] = useState(0);
  const selected = STAGES[active];

  return (
    <div className="processing-explorer">
      <p className="case-study-section-intro">
        Select a stage to inspect its data contract and failure behavior. Extraction, OCR, chunking, and indexing are separate from LLM answer generation.
      </p>
      <div className="processing-stage-list" role="group" aria-label="Document processing stages">
        {STAGES.map((stage, index) => (
          <button
            type="button"
            key={stage.name}
            aria-pressed={active === index}
            aria-controls="processing-stage-detail"
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage.name}</strong>
            {index < STAGES.length - 1 && <i aria-hidden="true">→</i>}
          </button>
        ))}
      </div>
      <section className="processing-stage-detail" id="processing-stage-detail" aria-live="polite">
        <p className="section-kicker">STAGE {String(active + 1).padStart(2, "0")} / {selected.name}</p>
        <p>{selected.detail}</p>
        <dl>
          <div><dt>Input</dt><dd>{selected.input}</dd></div>
          <div><dt>Output</dt><dd>{selected.output}</dd></div>
          <div><dt>Failure handling</dt><dd>{selected.failure}</dd></div>
        </dl>
      </section>
      <div className="processing-states">
        <h3>Document states</h3>
        <ol>{STATES.map(([name, description]) => <li key={name}><strong>{name}</strong><span>{description}</span></li>)}</ol>
        <p>Retry policy, idempotency, and state transitions must be enforced by the backend job ledger; the connected worker runtime is unverified.</p>
      </div>
    </div>
  );
}
