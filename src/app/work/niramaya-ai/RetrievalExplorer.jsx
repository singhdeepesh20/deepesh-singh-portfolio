"use client";

import { useState } from "react";

const STEPS = [
  {
    name: "User query",
    status: "Implemented in repository",
    input: "Question text and optional supported filters",
    output: "Validated query for retrieval",
    detail:
      "The API accepts a bounded question and supported filters. The query determines relevance, not which person's records are eligible.",
    security:
      "Validate input length and shape; treat question text and uploaded content as untrusted.",
  },
  {
    name: "Authentication",
    status: "Implemented in repository · runtime unverified",
    input: "Signed bearer token",
    output: "Server-resolved active user",
    detail:
      "Protected routes resolve an active user from validated authentication context before querying document data.",
    security:
      "Never accept a request-supplied user_id as the source of authorization.",
  },
  {
    name: "Owner-scoped eligibility",
    status: "Implemented in repository",
    input: "Authenticated owner and document filters",
    output: "Eligible current-generation chunks",
    detail:
      "PostgreSQL applies ownership, current generation, ready-state, and deletion filters. Vector results are resolved again against these records.",
    security:
      "This relational authorization check is mandatory even when a vector index returns a similar candidate.",
  },
  {
    name: "Lexical and vector search",
    status: "Hybrid retrieval implemented · Qdrant/model services unverified",
    input: "Query terms and, when available, query embedding",
    output: "Lexical and semantic candidate lists",
    detail:
      "PostgreSQL full-text search can be combined with optional Qdrant vector candidates. Semantic similarity is a relevance signal, not an access-control decision.",
    security:
      "Keep candidate retrieval separate from final authorized content reads.",
  },
  {
    name: "Fusion and bounded results",
    status: "Implemented in repository · quality unmeasured",
    input: "Candidate lists and their ranks",
    output: "Bounded, fused chunk set",
    detail:
      "The repository uses reciprocal-rank fusion to combine lexical and vector candidates. A lexical path can be used when vector search fails.",
    security:
      "No learned reranker is claimed. Top-K and relevance quality need evaluation against a labelled dataset.",
  },
  {
    name: "Context and response",
    status: "Implemented in repository · optional provider unverified",
    input: "Authorized passages and a validated question",
    output: "Evidence-only response or generated answer",
    detail:
      "The API assembles bounded evidence for an optional model provider. When no authorized evidence is found, the documented flow returns insufficient evidence without a model call.",
    security:
      "Generation is not clinically validated. Grounding instructions do not guarantee that each model claim is entailed.",
  },
  {
    name: "Source references",
    status: "Implemented in repository",
    input: "Retrieved passage provenance",
    output: "Citations and source excerpts",
    detail:
      "Responses can include source references from the retrieved page-aware chunks to help a user inspect the supporting report context.",
    security:
      "Build citations only from the authorized result set; a citation is traceability, not proof of answer correctness.",
  },
];

export default function RetrievalExplorer() {
  const [active, setActive] = useState(0);
  const selected = STEPS[active];

  return (
    <div className="retrieval-explorer">
      <p className="case-study-section-intro">
        The query path is separate from document ingestion. Select a step to inspect its data contract and trust boundary.
      </p>
      <div className="retrieval-flow" role="group" aria-label="Retrieval and RAG stages">
        {STEPS.map((step, index) => (
          <button
            type="button"
            key={step.name}
            aria-pressed={active === index}
            aria-controls="retrieval-step-detail"
            onClick={() => setActive(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{step.name}</strong>
            {index < STEPS.length - 1 && <i aria-hidden="true">→</i>}
          </button>
        ))}
      </div>
      <section className="retrieval-step-detail" id="retrieval-step-detail" aria-live="polite">
        <div className="retrieval-detail-heading">
          <p className="section-kicker">STEP {String(active + 1).padStart(2, "0")}</p>
          <span>{selected.status}</span>
        </div>
        <h3>{selected.name}</h3>
        <p>{selected.detail}</p>
        <dl>
          <div><dt>Input</dt><dd>{selected.input}</dd></div>
          <div><dt>Output</dt><dd>{selected.output}</dd></div>
          <div><dt>Security / limitation</dt><dd>{selected.security}</dd></div>
        </dl>
      </section>
      <p className="retrieval-limits">
        Hybrid lexical + vector candidate retrieval is represented in the repository. Reranking is not claimed. Retrieval metrics, response grounding quality, latency, and clinical safety have not been measured or validated.
      </p>
    </div>
  );
}
