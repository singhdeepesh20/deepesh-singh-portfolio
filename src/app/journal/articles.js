export const ARTICLES = {
  "document-processing": {
    title: "Designing a document processing pipeline with durable states",
    description: "Notes on file ingestion, provenance, processing jobs, and explicit failure states in Niramaya AI.",
    date: "2026-11-06",
    readingTime: "6 min read",
    tags: ["Document systems", "Backend", "Reliability"],
    sections: [
      { heading: "A file upload is only the beginning", paragraphs: ["A medical report arrives as bytes, but the application needs page text, extracted values, provenance, and an honest processing status. Treating upload as a single synchronous operation makes slow OCR, retries, and partial failure hard to reason about.", "In Niramaya AI, the repository models durable processing jobs and explicit document states. The API can accept a document and record work before extraction finishes. That creates a place to observe progress and to recover from a worker interruption."] },
      { heading: "Keep source and derived data connected", paragraphs: ["Original files and extracted records have different access patterns. The source object belongs in private object storage; metadata, pages, findings, and processing state belong in PostgreSQL. A storage key connects them, while provenance fields explain which page and extraction generation produced a value.", "This separation makes reprocessing possible without pretending that a parsed value is as authoritative as its source. It also means deletion needs a deliberate cross system strategy: mark the record, remove derived chunks and metadata, delete the object, and make retryable cleanup visible."] },
      { heading: "Make failure a state, not a log line", paragraphs: ["An extraction dependency may be absent, a PDF may be malformed, or an OCR pass may be inconclusive. Those outcomes should be represented as failed or review required states with useful warnings. A background worker also needs idempotent transitions so retrying a job does not duplicate chunks or overwrite newer processing generations.", "The repository contains the processing lifecycle and tests, but external storage and worker operation have not been verified here. The next useful step is to exercise retries and interrupted jobs against isolated infrastructure, then publish the observed behavior rather than infer it from the design."] },
    ],
  },
  "user-scoped-retrieval": {
    title: "User scoped retrieval: make identity part of the query boundary",
    description: "Why vector search results should be treated as candidates and authorization should remain server controlled.",
    date: "2026-11-06",
    readingTime: "5 min read",
    tags: ["Multi tenant RAG", "Security", "Retrieval"],
    sections: [
      { heading: "Similarity is not authorization", paragraphs: ["A vector index answers a relevance question: which stored passages resemble this query? It does not know whether the requesting person is allowed to read those passages. If a request body can choose an owner identifier, a relevant result can still be an unauthorized result.", "For a multi user document product, the server should derive identity from a validated authentication context and apply that owner filter to every relevant read. The user supplied question can influence relevance; it must not define whose records are eligible."] },
      { heading: "Use the database as the ownership authority", paragraphs: ["Niramaya AI's documented retrieval flow uses Qdrant for candidate IDs and resolves those IDs through PostgreSQL using the authenticated owner, current generation, ready state, and deletion filters. This makes the vector index an accelerator rather than the source of truth for access decisions.", "The trade off is an additional database query and the need to keep metadata in sync. That cost is useful only if the authorization checks are consistently enforced, including direct document reads, downloads, deletion, and citation construction."] },
      { heading: "Test the boundary directly", paragraphs: ["A useful isolation test creates two owners with similar documents, queries as one owner, and verifies that the other owner's chunks never enter the context or citations. Repeat it for lexical fallback, vector results, stale generations, and deletion states.", "This is a design and implementation claim supported by repository code and tests, not a certification or a claim about a deployed service. Runtime configuration still needs independent verification."] },
    ],
  },
};
