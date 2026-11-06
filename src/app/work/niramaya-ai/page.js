import Link from "next/link";
import ArchitectureExplorer from "./ArchitectureExplorer";
import ProcessingLifecycle from "./ProcessingLifecycle";

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
  {
    title: "Keep original files separate from derived records",
    problem: "Uploaded bytes and extracted medical data have different lifecycles and access patterns.",
    decision: "The storage adapter puts source bytes in private S3; PostgreSQL stores an object key alongside metadata, extracted pages, tables, findings, and processing state.",
    tradeoff: "This separates source-file storage from queryable records, while making correct database-to-object cleanup important.",
    status: "Implemented in repository · live S3 configuration unverified",
    source: "app/storage/s3.py · app/documents/",
  },
  {
    title: "Preserve provenance through extraction",
    problem: "A normalized value alone loses where it came from and how it was parsed.",
    decision: "The repository models page, source-line, extraction generation, method, warnings, rule version, and quality metadata for extracted findings.",
    tradeoff: "Additional provenance improves traceability but does not prove that a heuristic parse is clinically correct.",
    status: "Implemented in repository",
    source: "app/health/models.py · docs/14-medical-data-extraction-rules.md",
  },
  {
    title: "Chunk at page boundaries and retain overlap",
    problem: "Large documents need smaller retrieval units, while arbitrary splits can lose useful local context.",
    decision: "The chunker does not merge page boundaries; defaults are 1,200 characters per chunk and 160 characters of overlap. IDs include the document, generation, order, and content hash.",
    tradeoff: "Page-local chunks preserve page provenance and overlap helps with context at cuts; retrieval quality has not been benchmarked.",
    status: "Implemented in repository · defaults documented",
    source: "app/health/chunking.py · docs/16-chunking-and-embeddings.md",
  },
  {
    title: "Treat vector results as candidates, not authority",
    problem: "A vector index must not decide which user's medical records can be read.",
    decision: "The API derives the owner from the verified JWT and resolves returned Qdrant chunk IDs again through PostgreSQL owner, generation, and document-state filters.",
    tradeoff: "This extra database check protects the authorization boundary, but retrieval latency and relevance still need measured evaluation.",
    status: "Implemented in repository · service integration unverified",
    source: "app/health/repository.py · docs/18-rag-retrieval-and-generation.md",
  },
  {
    title: "Combine lexical and semantic candidates",
    problem: "Exact terms and semantically similar wording can surface different useful passages.",
    decision: "The documented retriever combines PostgreSQL full-text candidates with optional Qdrant candidates using reciprocal-rank fusion.",
    tradeoff: "It has a lexical fallback when vector work fails; no learned reranker or published comparison benchmark exists.",
    status: "Implemented in repository · quality not measured",
    source: "app/health/repository.py · docs/ai/retrieval-and-citations.md",
  },
  {
    title: "Return insufficient evidence when retrieval is empty",
    problem: "A generative model can produce plausible answers even when no relevant record was found.",
    decision: "The API returns an insufficient-evidence response and skips the model call if the authorized chunk set is empty.",
    tradeoff: "This reduces unsupported answers from empty retrieval; it does not validate every claim in a generated response.",
    status: "Implemented in repository · not clinically validated",
    source: "app/health/router.py · app/health/assistant.py",
  },
  {
    title: "Use FastAPI for typed service boundaries",
    problem: "Document and health operations need validated request shapes and explicit authentication dependencies.",
    decision: "The repository uses FastAPI routers with Pydantic request models and dependencies that resolve the active user.",
    tradeoff: "Typed validation and generated API conventions help keep boundaries clear; the Python service still needs deployment, monitoring, and dependency management.",
    status: "Implemented in repository · service runtime unverified",
    source: "app/main.py · app/documents/router.py · app/health/router.py",
  },
  {
    title: "Keep relational records authoritative in PostgreSQL",
    problem: "Users, documents, processing jobs, provenance, and deletion state have relationships and transactional updates.",
    decision: "PostgreSQL stores canonical application records; vector search results are checked against owner and document state there.",
    tradeoff: "Relational constraints and transactions support lifecycle consistency, while vector indexing creates cross-store synchronization work.",
    status: "Implemented in repository · database service unverified",
    source: "app/health/models.py · app/documents/models.py · alembic/",
  },
  {
    title: "Use retrieval to ground changing document knowledge",
    problem: "Medical document content is user specific and can change as reports are added or removed.",
    decision: "The project retrieves authorized passages at question time and supplies bounded evidence to an optional generation provider.",
    tradeoff: "RAG keeps source passages available for citations and updates; it depends on extraction and retrieval quality and does not make answers clinically valid. Fine tuning may improve task behavior but would not replace per-user evidence access.",
    status: "Implemented in repository · provider and answer quality unverified",
    source: "app/health/repository.py · app/health/assistant.py",
  },
  {
    title: "Move long document work to a durable job lifecycle",
    problem: "PDF parsing, optional OCR, and indexing can take longer than a request should remain open.",
    decision: "The repository records processing jobs and states so work can proceed separately from the upload request.",
    tradeoff: "Async jobs improve request responsiveness and make progress explicit, while introducing worker availability, retry, and idempotency requirements. Kafka is an option, not a verified dependency.",
    status: "Job model and lifecycle implemented · worker runtime unverified",
    source: "app/documents/ · docs/15-document-state-machine.md",
  },
];

const LABS = [
  {
    title: "Retrieval engineering",
    body: "The code combines owner-filtered PostgreSQL full-text candidates with optional local embeddings and Qdrant vector candidates. Reciprocal-rank fusion selects bounded results, and PostgreSQL re-resolves vector IDs before excerpts are used.",
    proof: "app/health/repository.py · app/health/chunking.py · app/health/embeddings.py",
    status: "Code and tests present · no benchmark published",
  },
  {
    title: "Backend and document lifecycle",
    body: "Document APIs derive ownership from verified identity, store original objects through an S3 adapter, and record durable processing transitions and jobs in PostgreSQL. Extracted content carries generation and source provenance.",
    proof: "app/documents/ · app/user/controller.py · app/storage/s3.py",
    status: "Code and migrations present · cloud runtime unverified",
  },
  {
    title: "Reliability and verification",
    body: "The repository includes API, extraction, processing, authentication, isolation, and RAG tests. In this review, the backend suite passed against the isolated public-repository checkout. Frontend lint, type checking, and build do not replace browser E2E coverage.",
    proof: "tests/ · docs/testing/ · .github/workflows/",
    status: "93 backend tests passed here · frontend E2E runner not configured",
  },
];

const CAPABILITIES = [
  ["Hands-on · repository evidence", "Python and FastAPI · typed API and auth routes", "Implemented and tested in the public project repository"],
  ["Hands-on · repository evidence", "PostgreSQL and SQLAlchemy · ownership-aware persistence", "Models, migrations, and retrieval queries are present"],
  ["Hands-on · repository evidence", "Retrieval systems · chunking, embeddings, hybrid candidate fusion", "Code and backend tests are present; retrieval quality is unmeasured"],
  ["Working knowledge · repository evidence", "Next.js, React, and TypeScript · frontend routes and API client", "Frontend source and static CI checks are present; browser E2E is not"],
  ["Exploring · integration not verified", "Qdrant, local embedding models, S3, and model-provider operations", "Adapters and configuration exist; live service operation is unverified"],
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

      <section className="case-study-section architecture-section" id="architecture">
        <p className="section-kicker"><span>03</span> / INTERACTIVE SYSTEM ARCHITECTURE</p>
        <h2>Follow the data <em>through the system.</em></h2>
        <ArchitectureExplorer />
      </section>

      <section className="case-study-section">
        <p className="section-kicker"><span>04</span> / DOCUMENT LIFECYCLE</p>
        <h2>Processing has <em>visible states.</em></h2>
        <p className="case-study-section-intro">Select a state to read its role. This summarizes the documented lifecycle; it does not imply a connected worker is running.</p>
        <ProcessingLifecycle />
      </section>

      <section className="case-study-section">
        <p className="section-kicker"><span>05</span> / SECURITY BOUNDARIES</p>
        <h2>Identity stays <em>server controlled.</em></h2>
        <div className="security-principles">
          <article><strong>JWT identity</strong><p>Resolve the owner from a validated token on each protected request; never use a request supplied user_id as authority.</p></article>
          <article><strong>Ownership checks</strong><p>Apply owner and document state filters to reads, downloads, retrieval candidates, citations, and deletion operations.</p></article>
          <article><strong>Private source files</strong><p>Keep uploaded bytes in private object storage and keep credentials in server environment configuration.</p></article>
          <article><strong>Deletion across stores</strong><p>Track cleanup of source objects, relational data, and vector points; keep failures retryable and exclude pending records from retrieval.</p></article>
        </div>
        <p className="security-caveat">These are implementation and design notes. No HIPAA or other compliance certification is claimed.</p>
      </section>

      <section className="case-study-section decisions-section">
        <p className="section-kicker"><span>06</span> / OBSERVED ENGINEERING DECISIONS</p>
        <h2>Boundaries that shape <em>the system.</em></h2>
        <div className="decision-list">
          {DECISIONS.map((decision, index) => (
            <article key={decision.title}>
              <span>0{index + 1}</span>
              <div><h3>{decision.title}</h3>
                <dl className="decision-evidence">
                  <div><dt>Problem</dt><dd>{decision.problem}</dd></div>
                  <div><dt>Observed implementation</dt><dd>{decision.decision}</dd></div>
                  <div><dt>Trade-off</dt><dd>{decision.tradeoff}</dd></div>
                  <div><dt>Status</dt><dd>{decision.status}</dd></div>
                </dl>
                <p className="decision-source">Source: {decision.source}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="case-study-section lab-section">
        <p className="section-kicker"><span>07</span> / ENGINEERING LABORATORY</p>
        <h2>Evidence from <em>the codebase.</em></h2>
        <p className="case-study-section-intro">These are inspectable implementation areas, not live dashboards or performance claims.</p>
        <div className="engineering-lab-list">
          {LABS.map((lab, index) => <article key={lab.title}>
            <span className="lab-number">0{index + 1}</span><div><h3>{lab.title}</h3><p>{lab.body}</p><code>{lab.proof}</code></div><span className="lab-status">{lab.status}</span>
          </article>)}
        </div>
      </section>

      <section className="case-study-section evaluation-section">
        <p className="section-kicker"><span>08</span> / RETRIEVAL EVALUATION</p>
        <h2>Evaluation status: <em>not measured.</em></h2>
        <p className="case-study-section-intro">No labelled retrieval benchmark or answer-quality result is published. The following is a proposed experiment, not a completed evaluation.</p>
        <div className="evaluation-plan">
          <article><span>DATASET</span><p>Build a small set of synthetic, non-sensitive medical-style documents and roughly 50 labelled questions with relevant page/chunk IDs.</p></article>
          <article><span>COMPARISON</span><p>Compare lexical-only, dense-only, and hybrid retrieval using the same corpus, filters, and top-k values.</p></article>
          <article><span>METRICS</span><p>Report Recall@5, Recall@10, MRR, and NDCG@10 from a versioned script and raw result file.</p></article>
          <article><span>LIMITS</span><p>Document how synthetic examples differ from real reports. Do not infer clinical safety or answer correctness from retrieval metrics alone.</p></article>
        </div>
      </section>

      <section className="case-study-section capabilities-section">
        <p className="section-kicker"><span>09</span> / TECHNICAL CAPABILITIES</p>
        <h2>Technology grounded <em>in evidence.</em></h2>
        <p className="case-study-section-intro">These levels describe project evidence, not mastery. Commit history identifies this repository under Deepesh’s account; a line-by-line personal contribution audit has not been completed.</p>
        <div className="capability-evidence-list">
          {CAPABILITIES.map(([level, topic, proof], index) => <article key={topic}><span>0{index + 1}</span><div><strong>{topic}</strong><p>{proof}</p></div><small>{level}</small></article>)}
        </div>
      </section>

      <section className="case-study-section case-limitations">
        <p className="section-kicker"><span>10</span> / TESTING, LIMITATIONS & NEXT STEPS</p>
        <h2>What this review <em>can verify.</em></h2>
        <div className="case-study-prose">
          <p>The Niramaya backend suite was run from an isolated checkout of the public repository: 93 tests passed with five upstream deprecation warnings. No AWS, Qdrant, or model-provider services were connected. The frontend repository documents ESLint, TypeScript, and production build checks, but has no unit or browser E2E runner.</p>
          <p>The latest public frontend CI run inspected for this update failed at the production dependency audit. A local fix for the vulnerable Next.js release and a missing build-time API URL was prepared in an isolated branch; it has not been pushed or rerun in public CI. The current repository CI status remains unresolved.</p>
          <p>The project documentation says answer generation is not clinically validated and marker filtering does not prove entailment. No live deployment, user outcomes, clinical review, or retrieval benchmark is claimed.</p>
        </div>
        <h3 className="future-heading">Proposed next improvements</h3>
        <ul className="future-list"><li>Rerun public frontend CI after the isolated dependency/build fixes are reviewed and merged.</li><li>Implement the synthetic retrieval evaluation described above and publish reproducible raw results.</li><li>Run frontend browser and accessibility checks against a configured test API.</li><li>Verify deployed S3, Qdrant, and model-provider behavior before making runtime claims.</li></ul>
        <a className="button-primary" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">REVIEW THE SOURCE <span>↗</span></a>
      </section>

      <footer className="case-study-footer"><Link href="/#work">← Deepesh Singh / Selected work</Link><span>Repository-grounded summary · Last reviewed November 2026</span></footer>
    </main>
  );
}
