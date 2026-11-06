"use client";

import { useState } from "react";

const CAPABILITIES = [
  { id: "programming", title: "Programming & Computer Science", number: "01", skills: ["Python", "C++", "JavaScript", "SQL", "Data structures & algorithms", "OOP", "Concurrency"], note: "Programming languages and core concepts for implementing product behavior and reasoning about systems.", status: "Topics listed; no proficiency ratings" },
  { id: "ml", title: "Machine Learning & Deep Learning", number: "02", skills: ["PyTorch", "Scikit-learn", "Neural networks", "Model training", "Model evaluation", "Experimentation"], note: "Methods for building, testing, and understanding machine-learning systems.", status: "Learning and exploration; no model benchmark published" },
  { id: "agents", title: "LLM Engineering & Agentic Systems", number: "03", skills: ["LLM applications", "Prompt engineering", "LangChain", "LangGraph", "Tool calling", "Agent orchestration", "Structured outputs", "Model integration"], note: "How model calls, tools, and application logic fit into bounded workflows.", status: "Learning and exploration; no production agent claim" },
  { id: "retrieval", title: "Retrieval & Knowledge Systems", number: "04", skills: ["Advanced RAG", "Hybrid search", "Embeddings", "Reranking", "Qdrant", "FAISS", "Retrieval evaluation", "Semantic search"], note: "Turning source documents into traceable context for useful, evidence-aware answers.", status: "Niramaya AI repository includes chunking and hybrid retrieval; quality unbenchmarked" },
  { id: "backend", title: "Backend & Distributed Systems", number: "05", skills: ["FastAPI", "Node.js", "REST APIs", "Async processing", "PostgreSQL", "Redis", "API design", "Distributed systems"], note: "Service boundaries, data ownership, background work, and lifecycle reliability.", status: "Niramaya AI repository includes FastAPI and PostgreSQL; runtime unverified" },
  { id: "infra", title: "AI Infrastructure & Cloud", number: "06", skills: ["Docker", "AWS", "Model serving", "Inference workflows", "Background workers", "Caching", "CI/CD", "Deployment"], note: "Packaging, operating, and observing AI workloads under practical constraints.", status: "Topics of interest; external runtime and deployment unverified" },
  { id: "practice", title: "Engineering Practices", number: "07", skills: ["Git", "GitHub", "Linux", "Automated testing", "CI/CD", "System design", "API documentation", "Observability", "Security engineering"], note: "Habits and safeguards that make complex software easier to change and trust.", status: "Evidence varies by topic; see the Niramaya case study" },
];

function Visualization({ type }) {
  if (type === "programming") return <svg className="cap-visual code-visual" viewBox="0 0 360 190" role="img" aria-label="Illustrative syntax-highlighted code flow"><rect x="18" y="18" width="324" height="154" rx="12"/><circle cx="38" cy="37" r="4"/><circle cx="52" cy="37" r="4"/><circle cx="66" cy="37" r="4"/><path d="M38 65h132M38 85h202M56 105h156M56 125h118M38 145h188"/></svg>;
  if (type === "ml") return <svg className="cap-visual network-visualization" viewBox="0 0 360 190" role="img" aria-label="Illustrative neural network with connected layers"><g className="network-links"><path d="M60 46 160 36 290 56M60 46 160 96 290 56M60 46 160 156 290 56M60 96 160 36 290 96M60 96 160 96 290 96M60 96 160 156 290 96M60 146 160 36 290 136M60 146 160 96 290 136M60 146 160 156 290 136"/></g><g className="network-nodes"><circle cx="60" cy="46" r="8"/><circle cx="60" cy="96" r="8"/><circle cx="60" cy="146" r="8"/><circle cx="160" cy="36" r="8"/><circle cx="160" cy="96" r="8"/><circle cx="160" cy="156" r="8"/><circle cx="290" cy="56" r="8"/><circle cx="290" cy="96" r="8"/><circle cx="290" cy="136" r="8"/></g></svg>;
  const flows = {
    agents: ["USER", "AGENT", "TOOL", "OBSERVE", "ANSWER"],
    retrieval: ["DOCS", "CHUNKS", "VECTORS", "SEARCH", "EVIDENCE"],
    backend: ["API", "SERVICE", "POSTGRES", "QUEUE", "WORKER"],
    infra: ["COMMIT", "BUILD", "TEST", "IMAGE", "DEPLOY"],
    practice: ["CODE", "REVIEW", "TEST", "RELEASE", "OBSERVE"],
  };
  return <svg className={`cap-visual pipeline-visual ${type}`} viewBox="0 0 360 190" role="img" aria-label={`Illustrative ${type} engineering flow`}>
    <path className="pipeline-line" d="M40 95H320"/>
    {(flows[type] || flows.retrieval).map((label, index) => { const x = 40 + index * 70; return <g key={label} className={`pipeline-node node-${index}`}><circle cx={x} cy="95" r="22"/><text x={x} y="139" textAnchor="middle">{label}</text><text className="node-index" x={x} y="99" textAnchor="middle">0{index + 1}</text></g>; })}
    <circle className="data-packet" cx="40" cy="95" r="5"/>
  </svg>;
}

export default function CapabilityMap() {
  const [selected, setSelected] = useState(3);
  const active = selected === null ? null : CAPABILITIES[selected];
  return <section className="capability-section section-block" id="skills" data-nav-section aria-labelledby="capability-heading">
    <div className="capability-heading"><p className="section-kicker"><span>02</span> / TECHNICAL EXPERTISE</p><h2 id="capability-heading">A map of the<br/><em>systems I explore.</em></h2><p>Technologies, systems, and engineering principles I use to design and build intelligent products. Selection reveals the concepts behind each area; no proficiency scores implied.</p></div>
    <div className="capability-map">
      <div className="capability-picker" role="group" aria-label="Technical capability categories">{CAPABILITIES.map((capability, index) => <button key={capability.id} type="button" aria-expanded={selected === index} aria-controls="capability-detail" onClick={() => setSelected(selected === index ? null : index)}><span>{capability.number}</span><strong>{capability.title}</strong><i aria-hidden="true">{selected === index ? "−" : "+"}</i></button>)}</div>
      <article className="capability-detail" id="capability-detail" aria-live="polite" hidden={!active}>{active && <><div className="capability-detail-top"><span>{active.number} / SYSTEM MAP</span><small>{active.status}</small></div><h3>{active.title}</h3><p>{active.note}</p><Visualization type={active.id}/><div className="capability-skills" aria-label="Topics in this area">{active.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></>}</article>
    </div>
  </section>;
}
