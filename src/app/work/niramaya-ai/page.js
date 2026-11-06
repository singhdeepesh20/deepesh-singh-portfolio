import Link from "next/link";

const SYSTEMS = [
  {
    number: "01",
    name: "Document intake and processing",
    status: "Implemented in repository",
    summary: "The documented worker downloads private uploads to a temporary local directory, extracts PDF text and tables with PyMuPDF, and can use local Tesseract OCR for image-heavy pages when enabled. The extraction path is deterministic and does not call an LLM.",
    evidence: "docs/medical-data/document-processing.md · app/documents/",
  },
  {
    number: "02",
    name: "Structured records and provenance",
    status: "Implemented in repository",
    summary: "Extracted pages, tables, and findings are represented in PostgreSQL. The repository records page and source-line provenance, extraction generation, method, warnings, and parsing quality metadata.",
    evidence: "app/health/models.py · app/documents/",
  },
  {
    number: "03",
    name: "Chunking and embeddings",
    status: "Implemented in repository",
    summary: "Indexing chunks each page independently, with configurable size and overlap. Stable UUIDv5 IDs include document, generation, order, and content hash. The default local embedding model is all-MiniLM-L6-v2 with 384-dimensional vectors.",
    evidence: "app/health/chunking.py · app/health/embeddings.py · docs/16-chunking-and-embeddings.md",
  },
  {
    number: "04",
    name: "Hybrid retrieval with owner checks",
    status: "Implemented in repository · services unverified",
    summary: "Qdrant can provide vector candidates; PostgreSQL applies authenticated owner, current-generation, ready-state, and deletion filters. Vector IDs are re-resolved in PostgreSQL, then reciprocal-rank fusion combines vector and lexical candidates. Qdrant failure degrades to lexical retrieval.",
    evidence: "app/health/repository.py · app/health/router.py · docs/18-rag-retrieval-and-generation.md",
  },
  {
    number: "05",
    name: "Evidence-bounded answers",
    status: "Implemented in repository · model provider unverified",
    summary: "When no chunks match, the API returns an insufficient-evidence response without calling the LLM. Otherwise it bounds evidence context and citations. Generation is optional; the docs state the model output is probabilistic and the product is not clinically validated.",
    evidence: "app/health/router.py · app/health/assistant.py · docs/18-rag-retrieval-and-generation.md",
  },
];

const DECISIONS = [
  ["PostgreSQL remains the source of truth", "Qdrant results are candidate identifiers and are checked again against PostgreSQL ownership and document state."],
  ["Retrieval can degrade gracefully", "Embedding or vector failures preserve stored chunks for lexical retrieval; semantic recall may be unavailable until reindexing."],
  ["Document content is untrusted input", "The documented answer prompt says not to follow instructions found in uploaded report text and gives the model no tools."],
  ["No evidence means no generated answer", "An empty retrieval result returns insufficient evidence and skips the model call."],
];

export const metadata = {
  title: "Niramaya AI — Engineering Case Study | Deepesh Singh",
  description: "A repository-grounded engineering case study of Niramaya AI's medical document processing and retrieval architecture.",
};

export default function NiramayaCaseStudy() {
  return (
    <main className="case-study-page">
      <nav className="case-study-nav" aria-label="Case study navigation">
        <Link href="/#work">← Back to portfolio</Link>
        <a href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">Source repository ↗</a>
      </nav>

      <header className="case-study-hero">
        <p className="eyebrow">ENGINEERING CASE STUDY <span>·</span> AI PRODUCT</p>
        <h1>Niramaya <em>AI.</em></h1>
        <p className="case-study-lede">A medical document intelligence project that processes reports into structured records and supports owner-scoped search over extracted evidence.</p>
        <div className="case-study-facts">
          <div><span>REVIEW BASIS</span><strong>Public source repository and project documentation</strong></div>
          <div><span>IMPLEMENTATION</span><strong>Next.js · FastAPI · PostgreSQL · optional Qdrant</strong></div>
          <div><span>STATUS</span><strong>Repository implementation; deployment and runtime services unverified</strong></div>
        </div>
      </header>

      <section className="case-study-section case-study-overview">
        <div><p className="section-kicker"><span>01</span> / PRODUCT PROBLEM</p><h2>Health information<br /><em>arrives in fragments.</em></h2></div>
        <div className="case-study-prose">
          <p>Niramaya is designed around a practical problem: medical information may be spread across uploaded reports, pages, tables, and lab values. The repository implements a pipeline to extract and organize this material, then retrieve relevant passages for a user’s question.</p>
          <p>This case study describes what is present in the public code and documentation. It does not claim a live deployment, clinical validation, measured user outcomes, or production use.</p>
        </div>
      </section>

      <section className="case-study-section">
        <p className="section-kicker"><span>02</span> / SYSTEM WALKTHROUGH</p>
        <h2>From upload <em>to evidence.</em></h2>
        <p className="case-study-section-intro">Each panel summarizes a repository-backed system boundary. Expand a stage to see its implementation notes and source locations.</p>
        <div className="system-explorer">
          {SYSTEMS.map((system) => (
            <details className="system-stage" key={system.number}>
              <summary><span className="system-stage-number">{system.number}</span><span className="system-stage-name">{system.name}</span><span className="system-stage-status">{system.status}</span><span className="system-stage-toggle" aria-hidden="true">+</span></summary>
              <div className="system-stage-detail"><p>{system.summary}</p><p className="system-evidence"><span>REPOSITORY EVIDENCE</span>{system.evidence}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="case-study-section decisions-section">
        <p className="section-kicker"><span>03</span> / ENGINEERING BEHAVIOR</p>
        <h2>Boundaries that shape <em>the system.</em></h2>
        <div className="decision-list">
          {DECISIONS.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}
        </div>
      </section>

      <section className="case-study-section case-limitations">
        <p className="section-kicker"><span>04</span> / VALIDATION BOUNDARY</p>
        <h2>What this review <em>can verify.</em></h2>
        <div className="case-study-prose">
          <p>The repository documents fallback behavior, ownership filtering, evidence limits, and implementation tests. This portfolio review did not run Niramaya’s test suite or connect to its AWS, Qdrant, or model-provider services. The latest public frontend CI run was failing at the production dependency audit; a local, unpushed fix was prepared separately.</p>
          <p>No retrieval benchmark or labelled evaluation results are published here. The project documentation explicitly says the answer behavior is not clinically validated and that citation-marker filtering does not establish that every statement is supported.</p>
        </div>
        <a className="button-primary" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">REVIEW THE SOURCE <span>↗</span></a>
      </section>

      <footer className="case-study-footer"><Link href="/#work">← Deepesh Singh / Selected work</Link><span>Repository-grounded summary · Last reviewed November 2026</span></footer>
    </main>
  );
}
