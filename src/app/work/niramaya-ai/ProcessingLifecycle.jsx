"use client";

import { useState } from "react";

const STATES = [
  ["UPLOADED", "The API has accepted the file and created its document record."],
  ["QUEUED", "A durable job is ready for a worker to claim; retries need an idempotency key."],
  ["PROCESSING", "Extraction and indexing run with a versioned generation and recorded warnings."],
  ["REVIEW_REQUIRED", "The content or extraction quality needs a person to inspect it."],
  ["COMPLETED", "Processing finished and eligible derived content can be searched."],
  ["FAILED", "A terminal processing error is recorded with a safe, actionable reason."],
  ["DELETION_PENDING", "The document is excluded from retrieval while object and derived data cleanup completes."],
];

export default function ProcessingLifecycle() {
  const [active, setActive] = useState(0);
  const selected = STATES[active];
  return <div className="lifecycle-explorer"><div className="lifecycle-states" aria-label="Document processing states">{STATES.map(([name], index) => <button type="button" key={name} aria-pressed={active === index} onClick={() => setActive(index)}><span>{name}</span>{index < STATES.length - 1 && <i aria-hidden="true">↓</i>}</button>)}</div><section className="lifecycle-detail" aria-live="polite"><strong>{selected[0]}</strong><p>{selected[1]}</p><small>Transition rules and retry policy must be enforced by the backend job ledger.</small></section></div>;
}
