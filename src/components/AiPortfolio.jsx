"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PROFILE } from "@/lib/profile";

const IntelligenceCore = dynamic(() => import("./IntelligenceCore"), { ssr: false });

const architecture = [
  { id: "client", label: "Next.js client", layer: "PRODUCT", role: "Collects document and question inputs and presents answers with supporting evidence.", input: "Document upload or question", output: "Product interface for records and responses", decision: "The repository contains a Next.js frontend alongside the API.", evidence: "frontend/ · README architecture" },
  { id: "auth", label: "Identity + ownership", layer: "AUTHORIZATION", role: "Resolves the signed-in user and scopes record access to that owner.", input: "JWT-authenticated request", output: "Server-resolved user identity", decision: "The ask endpoint requires an authenticated user; ownership filters are built server-side.", evidence: "app/health/ · POST /api/v1/health/ask" },
  { id: "api", label: "FastAPI", layer: "API", role: "Validates requests and coordinates document workflows and question retrieval.", input: "Validated upload or question request", output: "Processing workflow or scoped retrieval request", decision: "The ask endpoint constrains fields and releases the user lookup transaction before remote retrieval calls.", evidence: "app/health/ · app/documents/" },
  { id: "storage", label: "Private S3 storage", layer: "STORAGE · README-DESCRIBED", role: "Repository architecture documentation describes private S3 storage for uploaded source files.", input: "Uploaded document object", output: "Stored source document for processing", decision: "The README describes private object storage; deployment and access policy were not independently exercised.", evidence: "Niramaya-AI README · storage configuration not verified here" },
  { id: "ingest", label: "Extract + chunk", layer: "DOCUMENT PROCESSING", role: "Builds page-aware text, table, and entity content into retrieval chunks.", input: "Extracted document pages and structured values", output: "Page-associated chunks for indexing", decision: "The documented chunker keeps page boundaries and uses configurable character length and overlap.", evidence: "app/health/chunking.py · docs/16-chunking-and-embeddings.md" },
  { id: "postgres", label: "PostgreSQL", layer: "DATA + LEXICAL SEARCH", role: "Stores structured health records and serves mandatory lexical search.", input: "Current-generation records and chunks", output: "Owner-scoped lexical candidates", decision: "PostgreSQL remains the source of truth; lexical retrieval works when vector services are unavailable.", evidence: "app/health/ · Alembic migrations" },
  { id: "qdrant", label: "Qdrant + embeddings", layer: "RETRIEVAL · OPTIONAL", role: "Provides dense candidate retrieval when the vector service is available.", input: "Question embedding and server-owned filters", output: "Dense candidate identifiers", decision: "Dense results are revalidated against PostgreSQL ownership and current extraction generation before use.", evidence: "app/health/embeddings.py · optional Qdrant service" },
  { id: "fusion", label: "Rank + validate", layer: "RETRIEVAL", role: "Combines lexical and dense candidates, then assembles evidence from validated records.", input: "Validated lexical and dense candidates", output: "Ranked evidence set", decision: "Reciprocal Rank Fusion combines result lists; the documented system does not use a learned reranker.", evidence: "docs/18-rag-retrieval-and-generation.md" },
  { id: "answer", label: "Evidence response", layer: "GENERATION · OPTIONAL", role: "Returns evidence or asks an LLM to draft a bounded, cited response.", input: "Evidence excerpts within a context limit", output: "Answer with evidence and citations, or insufficient-evidence response", decision: "Generation can be disabled; no matching evidence means no LLM call. The docs explicitly say this is not clinically validated.", evidence: "docs/18-rag-retrieval-and-generation.md" },
];

const retrievalSteps = [
  { label: "Question", text: "The ask endpoint validates the question and filters. The authenticated user is resolved from the request, not from a client-supplied owner identifier." },
  { label: "Dense search", text: "When configured, the question is embedded and Qdrant returns candidates under server-owned user, document, date, and type filters. Vector errors can fall back to lexical retrieval." },
  { label: "Lexical search", text: "PostgreSQL full-text search is the required retrieval path. The docs describe owner and current-extraction-generation constraints in the database query." },
  { label: "Validate + fuse", text: "Dense candidate IDs are re-resolved against PostgreSQL, then dense and lexical rankings are combined with Reciprocal Rank Fusion. No learned reranker is documented." },
  { label: "Evidence response", text: "Evidence is assembled from database records and bounded by a context limit. With no chunks, generation is skipped and the system reports insufficient evidence." },
];

const labItems = {
  retrieval: { label: "RETRIEVAL ENGINEERING", status: "IMPLEMENTED · DOCUMENTED", title: "Hybrid retrieval with a lexical fallback", body: "PostgreSQL full-text search is mandatory. Qdrant dense search is optional; validated candidates are fused with Reciprocal Rank Fusion. The repository documents failure behavior and known limitations.", proof: "docs/16-chunking-and-embeddings.md · docs/18-rag-retrieval-and-generation.md" },
  backend: { label: "BACKEND ENGINEERING", status: "IMPLEMENTED · CODE", title: "Authenticated, constrained question flow", body: "The FastAPI ask route validates request fields, requires an authenticated user, and uses server-resolved ownership filters. The repository includes SQLAlchemy models and Alembic migrations.", proof: "app/health/ · alembic/ · tests/" },
  reliability: { label: "RELIABILITY ENGINEERING", status: "IMPLEMENTED · REPOSITORY", title: "Degrade safely when optional services fail", body: "The retrieval documentation describes lexical fallback when embeddings or Qdrant fail, plus explicit provider and timeout errors. Tests and CI workflows are present in the repository; passing status was not verified here.", proof: ".github/ · tests/ · docs/18-rag-retrieval-and-generation.md" },
  security: { label: "SECURITY ENGINEERING", status: "IMPLEMENTED · DOCUMENTED", title: "Re-check ownership before evidence assembly", body: "Dense candidate IDs are resolved again against PostgreSQL under the authenticated owner and current extraction generation. The generation prompt treats report content as untrusted and disables tools.", proof: "docs/18-rag-retrieval-and-generation.md · app/health/" },
};

const capabilities = [
  { group: "AI PRODUCT ENGINEERING", level: "HANDS-ON · REPOSITORY EVIDENCE", tools: "Python · FastAPI · LLM question answering" },
  { group: "RETRIEVAL SYSTEMS", level: "HANDS-ON · REPOSITORY EVIDENCE", tools: "PostgreSQL full-text search · Qdrant · embeddings · hybrid retrieval" },
  { group: "BACKEND ENGINEERING", level: "HANDS-ON · REPOSITORY EVIDENCE", tools: "FastAPI · PostgreSQL · SQLAlchemy · REST APIs" },
  { group: "FRONTEND ENGINEERING", level: "HANDS-ON · THIS PORTFOLIO", tools: "React · Next.js · JavaScript · Three.js · React Three Fiber" },
  { group: "INFRASTRUCTURE", level: "REPOSITORY CONFIGURATION PRESENT", tools: "Docker · AWS/S3 configuration · GitHub Actions" },
];

function ContactLinks({ className = "" }) {
  return <div className={className}>
    {PROFILE.email && <a href={`mailto:${PROFILE.email}`}>EMAIL <span>↗</span></a>}
    {PROFILE.github && <a href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>}
    {PROFILE.linkedin && <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a>}
    {PROFILE.resume ? <a href={PROFILE.resume} target="_blank" rel="noreferrer">RÉSUMÉ <span>↗</span></a> : <span className="resume-unconfigured">RÉSUMÉ · LINK TO ADD</span>}
  </div>;
}

function SectionLabel({ number, children }) {
  return <div className="section-kicker"><span>{number}</span> / {children}</div>;
}

export default function AiPortfolio() {
  const [selectedNode, setSelectedNode] = useState(architecture[1]);
  const [selectedStep, setSelectedStep] = useState(0);
  const [activeLab, setActiveLab] = useState("retrieval");
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-nav-section]")];
    if (!("IntersectionObserver" in window) || !sections.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".engine-nav a").forEach((link) => link.toggleAttribute("aria-current", link.hash === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="ai-portfolio">
    <section className="ai-hero" id="top" data-nav-section>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> DEEPESH SINGH <span className="hero-location">ROBOTICS ENGINEERING STUDENT</span></p>
        <h1>AI PRODUCT<br /><span>ENGINEER</span><span className="accent-period">.</span></h1>
        <p className="hero-manifesto">I engineer intelligent products by building the systems behind them.</p>
        <p className="hero-summary">Exploring the intersection of generative AI, retrieval systems, backend architecture, and product engineering.</p>
        <div className="hero-actions">
          <a className="button-primary" href="#niramaya">EXPLORE NIRAMAYA AI <span>↘</span></a>
          <a className="button-secondary" href={PROFILE.github} target="_blank" rel="noreferrer">VIEW GITHUB <span>↗</span></a>
          <a className="hero-contact-link" href="#contact">CONTACT ME</a>
        </div>
        <div className="hero-signal"><span>01</span> FLAGSHIP SYSTEM <i /> DOCUMENT INTELLIGENCE</div>
      </div>
      <div className={`network-visual ${webglReady ? "webgl-ready" : ""}`}>
        <div className="network-fallback" role="img" aria-label="Connected points forming an abstract intelligence sphere">
          <div className="network-orbit orbit-one" /><div className="network-orbit orbit-two" />
          <svg viewBox="0 0 520 520" aria-hidden="true"><g className="network-lines"><path d="M95 175 205 105 340 145 425 250 325 375 160 350 95 175M205 105l120 270M340 145 160 350M95 175l330 75M205 105l220 145-100 125" /></g><g className="network-dots"><circle cx="95" cy="175" r="5"/><circle cx="205" cy="105" r="5"/><circle cx="340" cy="145" r="5"/><circle cx="425" cy="250" r="5"/><circle cx="325" cy="375" r="5"/><circle cx="160" cy="350" r="5"/></g></svg>
        </div>
        <IntelligenceCore onReady={() => setWebglReady(true)} />
        <span className="network-caption">THE INTELLIGENCE ENGINE</span><span className="network-coordinate">01 / SYSTEMS IN MOTION</span>
      </div>
      <a className="scroll-cue" href="#about"><span /> SCROLL TO EXPLORE</a>
      <div className="hero-index">GENERATIVE AI / RETRIEVAL / SYSTEMS</div>
    </section>

    <nav className="engine-nav" aria-label="Portfolio sections"><a className="engine-brand" href="#top">DS<span>·</span></a>
      {[ ["Home", "top"], ["About", "about"], ["Niramaya AI", "niramaya"], ["Architecture", "architecture"], ["Engineering", "engineering"], ["Contact", "contact"] ].map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
    </nav>

    <section className="ai-section intro-section reveal-section" id="about" data-nav-section>
      <SectionLabel number="01">ABOUT THE ENGINEER</SectionLabel>
      <div className="intro-layout"><h2>BEYOND THE<br /><em>INTERFACE.</em></h2><div className="intro-body"><p className="lead">I am a Robotics engineering student focused on building intelligent software systems.</p><p>My interests lie in Generative AI, retrieval systems, intelligent agents, and backend engineering. I enjoy exploring the engineering decisions behind AI products — from data processing and retrieval to system reliability, security, and the product experience.</p></div></div>
      <div className="focus-grid"><article><span>01</span><h3>Intelligent Systems</h3><p>Useful AI products shaped by the systems around the model.</p></article><article><span>02</span><h3>Retrieval &amp; Knowledge</h3><p>Finding, validating, and presenting relevant evidence.</p></article><article><span>03</span><h3>Backend Architecture</h3><p>APIs, data boundaries, and failure-aware workflows.</p></article></div>
    </section>

    <section className="ai-section project-section reveal-section" id="niramaya" data-nav-section>
      <SectionLabel number="02">FLAGSHIP PRODUCT</SectionLabel>
      <div className="flagship-heading"><span className="project-index">01 / CASE STUDY</span><div><h2>NIRAMAYA<br /><em>AI.</em></h2><p>From scattered medical documents to structured, searchable health intelligence.</p></div></div>
      <div className="project-story-grid"><div><span className="mini-label">THE PROBLEM SPACE</span><p className="lead">Medical information can be scattered across documents, making it difficult to search and understand as a connected record.</p><p>Niramaya explores how document processing, structured data, retrieval, and AI can make personal health information more accessible. This is a software project, not a clinically validated product.</p><a className="text-link" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">EXPLORE THE SOURCE REPOSITORY ↗</a></div>
        <div className="project-facts"><div><span>PROJECT STATUS</span><b>Repository implementation · deployment unverified</b></div><div><span>CORE FLOW</span><b>Upload → extract → index → retrieve evidence</b></div><div><span>DOCUMENTED DESIGN</span><b>PostgreSQL source of truth · optional dense retrieval</b></div><div><span>LIMITATION</span><b>Not clinically validated · no published retrieval scores found</b></div></div></div>
      <div className="evidence-strip"><span>REPOSITORY EVIDENCE</span><a href="https://github.com/singhdeepesh20/Niramaya-AI/tree/main/docs" target="_blank" rel="noreferrer">Architecture &amp; retrieval docs ↗</a><a href="https://github.com/singhdeepesh20/Niramaya-AI/tree/main/tests" target="_blank" rel="noreferrer">Test suite source ↗</a><a href="https://github.com/singhdeepesh20/Niramaya-AI/actions" target="_blank" rel="noreferrer">CI status ↗</a></div>
    </section>

    <section className="ai-section architecture-section reveal-section" id="architecture" data-nav-section>
      <SectionLabel number="03">INTERACTIVE SYSTEM ARCHITECTURE</SectionLabel>
      <div className="section-heading-row"><div><h2>FOLLOW THE<br /><em>EVIDENCE.</em></h2></div><p>Repository-backed overview of the documented Niramaya question-answering path. Select a component to inspect its responsibility and evidence.</p></div>
      <div className="architecture-layout"><div className="architecture-nodes" role="group" aria-label="Niramaya architecture components">{architecture.map((node, index) => <button key={node.id} className={`architecture-node ${selectedNode.id === node.id ? "selected" : ""}`} aria-pressed={selectedNode.id === node.id} onClick={() => setSelectedNode(node)}><span className="node-index">0{index + 1}</span><span className="node-layer">{node.layer}</span><strong>{node.label}</strong><span className="node-arrow">↗</span></button>)}</div>
        <article className="architecture-detail" aria-live="polite"><p className="mini-label">{selectedNode.layer} / COMPONENT DETAIL</p><h3>{selectedNode.label}</h3><p>{selectedNode.role}</p><dl><div><dt>INPUT</dt><dd>{selectedNode.input}</dd></div><div><dt>OUTPUT</dt><dd>{selectedNode.output}</dd></div><div><dt>ENGINEERING DECISION</dt><dd>{selectedNode.decision}</dd></div><div><dt>REPOSITORY EVIDENCE</dt><dd>{selectedNode.evidence}</dd></div></dl><a className="text-link" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">VERIFY IN REPOSITORY ↗</a></article></div>
      <div className="architecture-flow" aria-label="High-level flow"><span>QUESTION</span><i>→</i><span>AUTH + FILTERS</span><i>→</i><span>LEXICAL / DENSE</span><i>→</i><span>VALIDATE + FUSE</span><i>→</i><span>EVIDENCE RESPONSE</span></div>
    </section>

    <section className="ai-section retrieval-section reveal-section" id="retrieval" data-nav-section>
      <SectionLabel number="04">INSIDE THE RETRIEVAL ENGINE</SectionLabel>
      <div className="section-heading-row"><div><h2>ENGINEERING THE<br /><em>RETRIEVAL LAYER.</em></h2></div><p>Documented implementation decisions, not benchmark claims. No measured retrieval scores are published here.</p></div>
      <div className="retrieval-layout"><div className="retrieval-steps" role="tablist" aria-label="Retrieval request stages">{retrievalSteps.map((step, index) => <button key={step.label} role="tab" aria-selected={selectedStep === index} className={selectedStep === index ? "active" : ""} onClick={() => setSelectedStep(index)}><span>0{index + 1}</span>{step.label}<i>↗</i></button>)}</div><article className="retrieval-explanation" role="tabpanel"><span className="mini-label">REQUEST FLOW / 0{selectedStep + 1}</span><h3>{retrievalSteps[selectedStep].label}</h3><p>{retrievalSteps[selectedStep].text}</p><div className="retrieval-note"><b>KNOWN LIMITATION</b><span>No learned reranker or published retrieval evaluation results are documented.</span></div></article></div>
      <div className="tradeoff-grid"><div><span>LEXICAL</span><p>Predictable term matching and required fallback; can miss semantically related wording.</p></div><div><span>DENSE</span><p>Can surface semantic matches; depends on embedding and vector services being available.</p></div><div><span>HYBRID</span><p>Candidate lists are fused with Reciprocal Rank Fusion, then constrained by database ownership checks.</p></div></div>
    </section>

    <section className="ai-section lab-section reveal-section" id="engineering" data-nav-section>
      <SectionLabel number="05">ENGINEERING LABORATORY / BEYOND THE DEMO</SectionLabel>
      <div className="section-heading-row"><div><h2>THE WORK<br /><em>UNDERNEATH.</em></h2></div><p>Four engineering lenses on code and design documented in the Niramaya repository. Repository presence does not imply production deployment.</p></div>
      <div className="lab-tabs" role="tablist" aria-label="Engineering areas">{Object.entries(labItems).map(([id, item]) => <button key={id} role="tab" aria-selected={activeLab === id} className={activeLab === id ? "active" : ""} onClick={() => setActiveLab(id)}>{item.label}</button>)}</div>
      <article className="lab-detail" role="tabpanel"><div><span className="mini-label">{labItems[activeLab].status}</span><h3>{labItems[activeLab].title}</h3></div><div><p>{labItems[activeLab].body}</p><span className="lab-proof">EVIDENCE / {labItems[activeLab].proof}</span></div></article>
      <div className="verification-note"><span>STATUS NOTE</span><p>The repository includes tests and CI configuration. I have not run the test suite in this review, and the latest visible GitHub check was not verified as passing.</p></div>
    </section>

    <section className="ai-section evaluation-section reveal-section" id="evaluation" data-nav-section>
      <SectionLabel number="06">EVALUATION / PROPOSED, NOT MEASURED</SectionLabel>
      <div className="evaluation-layout"><div><h2>MEASURE<br /><em>WHAT MATTERS.</em></h2><p>A reproducible comparison can test whether hybrid retrieval improves evidence discovery for this project. No results are claimed because I found no published evaluation scores.</p></div><div className="evaluation-plan"><div><span>01 / DATASET</span><p>Build ~50 labelled questions over non-sensitive sample documents, with relevant source chunks marked before running retrieval.</p></div><div><span>02 / COMPARISON</span><p>Run lexical-only and fused retrieval with the same corpus, filters, and top-K settings.</p></div><div><span>03 / METRICS</span><p>Report Recall@K, MRR, Precision@K, and NDCG where multiple relevant chunks are labelled.</p></div><div><span>04 / REPORT</span><p>Publish dataset version, configuration, per-query results, limitations, and a reproducible command.</p></div></div></div>
    </section>

    <section className="ai-section capability-section reveal-section" id="capabilities" data-nav-section>
      <SectionLabel number="07">TECHNICAL CAPABILITIES</SectionLabel>
      <div className="section-heading-row"><div><h2>TOOLS WITH<br /><em>CONTEXT.</em></h2></div><p>Grouped by evidence source. This is a working profile, not a claim of equal depth in every tool.</p></div>
      <div className="capability-list">{capabilities.map((item, index) => <article key={item.group}><span className="cap-index">0{index + 1}</span><div><h3>{item.group}</h3><p>{item.tools}</p></div><span className="cap-level">{item.level}</span></article>)}</div>
    </section>

    <section className="closing-section reveal-section" id="contact" data-nav-section>
      <SectionLabel number="08">CONTACT</SectionLabel><h2>LET’S BUILD<br /><em>SOMETHING INTELLIGENT.</em></h2><p>Interested in AI engineering, intelligent systems, and building useful products.</p><ContactLinks className="contact-links" />
    </section>
  </div>;
}
