"use client";

import { useEffect } from "react";
import { PROFILE } from "@/lib/profile";
import AvatarIllustration from "./AvatarIllustration";
import PortfolioPrompt from "./PortfolioPrompt";

const NAV_LINKS = [
  ["Me", "about"],
  ["Projects", "work"],
  ["Skills", "skills"],
  ["Engineering", "engineering"],
  ["Contact", "contact"],
];

export default function AiPortfolio() {
  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-nav-section]")];
    if (!("IntersectionObserver" in window) || !sections.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".top-nav a[href^='#']").forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="editorial-portfolio">
      <header className="top-nav-wrap">
        <nav className="top-nav" aria-label="Main navigation">
          <div className="brand-block">
            <span className="brand-badge">DS</span>
            <span className="brand-name">Deepesh Singh</span>
            <span className="brand-slash">/</span>
            <span className="brand-title">AI Product Engineer</span>
          </div>

          <div className="nav-links">
            {NAV_LINKS.map(([label, id]) => (
              <a key={id} href={`#${id}`}>{label}</a>
            ))}
            <a className="lets-talk" href={`mailto:${PROFILE.email}`}>Let&apos;s talk <span>↗</span></a>
          </div>
        </nav>
      </header>

      <section className="hero-shell" id="top" data-nav-section>
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="availability-line">Available for thoughtful problems</div>
            <p className="eyebrow">HEY, I&apos;M DEEPESH <span>👋</span></p>
            <h1>
              AI Product
              <span className="serif-italic">Engineer</span>
            </h1>
            <p className="lead-copy">
              I build intelligent products with <span className="highlight">RAG</span>, AI agents, and
              scalable backend systems.
            </p>
            <p className="sub-copy">
              Exploring the intersection of artificial intelligence, software engineering, and real-world problem solving.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#work">Explore the work <span>↗</span></a>
              <a className="secondary-button" href="#about">A little more about me <span>↓</span></a>
            </div>

            <div className="assistant-inline" aria-label="Portfolio assistant panel">
              <PortfolioPrompt />
            </div>
          </div>

          <div className="hero-visual" aria-label="Portrait illustration">
            <div className="floating-tag">building useful intelligence ✧</div>
            <div className="avatar-wrap">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <AvatarIllustration />
              <div className="mini-badge">B.Tech · Robotics</div>
            </div>
            <div className="watermark">DEEPESH SINGH</div>
          </div>
        </div>
      </section>

      <section className="section-block about-block" id="about" data-nav-section>
        <div className="section-kicker">01 / A BIT ABOUT ME</div>
        <h2>Curiosity, with an engineering habit.</h2>
        <p className="section-lead">I like the space between a research idea and the moment it becomes genuinely useful.</p>

        <div className="about-split">
          <div className="about-text">
            <p>
              I&apos;m a Robotics engineering student focused on building intelligent software products.
            </p>
            <p>
              My interests lie in AI engineering, retrieval-augmented generation, agentic systems, backend architecture,
              and the principles required to turn AI research into useful products.
            </p>
          </div>

          <div className="graph-block" aria-label="System graph illustration">
            <svg viewBox="0 0 300 160" role="img" aria-label="Connected system graph">
              <path d="M30 70 L95 40 L160 80 L220 48 L270 88" />
              <path d="M95 40 L95 110 L160 80 L220 128 L270 88" />
              <path d="M30 70 L95 110 L160 80 L220 128" />
              <g>
                <circle cx="30" cy="70" r="5" />
                <circle cx="95" cy="40" r="5" />
                <circle cx="160" cy="80" r="5" />
                <circle cx="220" cy="48" r="5" />
                <circle cx="270" cy="88" r="5" />
                <circle cx="95" cy="110" r="5" />
                <circle cx="220" cy="128" r="5" />
              </g>
            </svg>
            <div className="graph-note">
              I enjoy understanding systems deeply — from data processing and retrieval pipelines to APIs,
              infrastructure, and user experience.
              <div className="graph-italic">Reliable over impressive.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block work-block" id="work" data-nav-section>
        <div className="section-kicker">02 / SELECTED WORK</div>
        <h2>One flagship. Many questions.</h2>
        <p className="section-lead">A closer look at the product thinking, systems, and trade-offs behind the work.</p>

        <article className="project-card">
          <div className="project-visual">
            <div className="project-orbit project-orbit-one" />
            <div className="project-orbit project-orbit-two" />
            <div className="project-mark">N</div>
            <div className="project-labels">
              <span>reports</span>
              <span>evidence</span>
              <span>clarity</span>
            </div>
          </div>

          <div className="project-info">
            <div className="meta-row">
              <span className="meta-tag">AI Healthcare · RAG · AI Backend</span>
              <span className="meta-status">• Engineering prototype</span>
            </div>
            <h3>Niramaya <span>AI</span></h3>
            <p>
              An intelligent medical document platform designed to transform scattered medical reports into searchable,
              structured, and context-aware health records.
            </p>

            <div className="tech-stack">
              {['Next.js', 'FastAPI', 'PostgreSQL', 'S3 / MinIO', 'Qdrant', 'RAG'].map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="project-actions">
              <a className="primary-button dark" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">Read the repository <span>↗</span></a>
              <a className="secondary-link" href="/work/niramaya-ai">Explore the system <span>↗</span></a>
            </div>

            <div className="transparency-note">
              Verified from the public repository. Optional cloud services and live integrations are not presented as verified here.
            </div>
          </div>
        </article>
      </section>

      <section className="section-block architecture-block" id="skills" data-nav-section>
        <div className="section-kicker">03 / UNDER THE HOOD</div>
        <h2>Niramaya is less about <span className="serif-italic">magic.</span> More about boundaries.</h2>
        <p className="section-lead right-offset">
          Medical information deserves an architecture that knows what it can prove. This is the system view — implemented,
          optional, and planned capabilities kept distinct.
        </p>

        <div className="architecture-layout">
          <div className="arch-list">
            {[
              ['01', 'Next.js frontend', 'Interface'],
              ['02', 'FastAPI backend', 'Orchestration'],
              ['03', 'PostgreSQL', 'Canonical store'],
              ['04', 'Object storage', 'Private bytes'],
              ['05', 'Processing worker', 'Async reliability'],
              ['06', 'Qdrant / retrieval', 'Semantic index'],
              ['07', 'RAG orchestration', 'Evidence assembly'],
            ].map(([index, label, hint]) => (
              <button key={label} className="arch-item" type="button">
                <span>{index}</span>
                <strong>{label}</strong>
                <small>{hint}</small>
                <em>↗</em>
              </button>
            ))}
          </div>

          <div className="arch-detail">
            <div className="detail-head">
              <span>SELECTED COMPONENT</span>
              <span>02</span>
            </div>
            <h3>FastAPI backend</h3>
            <p>
              Coordinates auth, document workflows, evidence retrieval, and safe response boundaries.
            </p>
            <div className="key-matrix">
              <div><label>Input / Output</label><strong>Request → services</strong></div>
              <div><label>Status</label><strong>Documented in repo</strong></div>
            </div>
          </div>
        </div>

        <div className="pipeline-wrap">
          <div className="section-kicker pipeline-kicker">DOCUMENT PROCESSING PIPELINE</div>
          <div className="pipeline-row">
            {['Upload', 'Validate', 'Queue', 'Extract', 'OCR fallback', 'Chunk', 'Embed', 'Index'].map((step, index) => (
              <div className="pipeline-step" key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
                {index < 7 && <em>→</em>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-block expertise-block" id="engineering" data-nav-section>
        <div className="section-kicker">04 / TECHNICAL EXPERTISE</div>
        <h2>A map of how I build.</h2>
        <p className="section-lead">No progress bars. Just the systems, tools, and mental models I keep reaching for.</p>

        <div className="expertise-grid">
          {[
            ['01', 'Programming & CS', 'Python · C++ · JavaScript · SQL · Data structures · OOP · Concurrency', 'programming'],
            ['02', 'Machine Learning', 'PyTorch · Scikit-learn · Neural networks · Model training · Model evaluation', 'ml'],
            ['03', 'LLM & Agents', 'LangChain · LangGraph · Tool calling · Structured outputs · Agent orchestration', 'agents'],
            ['04', 'Retrieval Systems', 'RAG · Embeddings · Qdrant · FAISS · Reranking · Hybrid search', 'retrieval'],
            ['05', 'Backend & Distributed', 'FastAPI · Node.js · REST APIs · Async processing · PostgreSQL · Redis', 'backend'],
            ['06', 'AI Infrastructure', 'Docker · AWS · Model serving · Caching · CI/CD · Deployment', 'infra'],
            ['07', 'Engineering Practice', 'Git · Linux · Testing · API docs · Observability · Security engineering', 'practice'],
          ].map(([index, label, skillText, visual]) => (
            <article className="expert-card" key={label}>
              <div className="expert-head">
                <span>{index}</span>
                <span className="chevron">⌄</span>
              </div>
              <div className={`mini-visual ${visual}`} aria-hidden="true">
                <span />
              </div>
              <h3>{label}</h3>
              <p>{skillText}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="philosophy-panel" id="philosophy" data-nav-section>
        <div className="section-kicker kicker-light">05 / ENGINEERING PHILOSOPHY</div>
        <div className="philosophy-inner">
          <div className="philosophy-copy-block">
            <h2>Make the invisible <span className="serif-italic light">understandable.</span></h2>
            <p>
              Good engineering is not just the thing that runs. It is the thing another person can reason about six months later.
            </p>
          </div>

          <div className="principles-list">
            {[
              'Understand the problem before selecting technology.',
              'Design systems around reliability and maintainability.',
              'Prefer measurable quality over assumptions.',
              'Treat security and privacy as core architecture concerns.',
              'Build for real-world constraints, not just demos.',
              'Keep learning through implementation and experimentation.',
            ].map((item, index) => (
              <div className="principle-row" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-panel" data-nav-section>
        <div className="section-kicker kicker-lavender">06 / ENGINEERING JOURNAL</div>
        <div className="journal-inner">
          <h2>Notes from the <span className="serif-italic">workbench.</span></h2>
          <div className="journal-side">
            <p>RAG engineering, AI agents, backend architecture, system design, machine learning, robotics.</p>
            <div className="journal-tag">• Engineering notes and technical explorations coming soon.</div>
          </div>
        </div>
      </section>

      <section className="contact-block" id="contact" data-nav-section>
        <div className="section-kicker">07 / SAY HELLO</div>
        <div className="contact-inner">
          <div className="contact-copy">
            <h2>Have an <span className="serif-italic">interesting</span><br />problem to solve?</h2>
            <p>
              I&apos;m always interested in exploring intelligent systems, engineering ideas, and opportunities to build useful products.
            </p>
          </div>

          <div className="contact-links-panel">
            <a href={`mailto:${PROFILE.email}`}>mr.deepesh.singh00@gmail.com <span>↗</span></a>
            <div className="small-links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
            <div className="mail-note">Opens your email client — no message is stored here.</div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© 2026 Deepesh Singh</span>
        <span>Built with curiosity &amp; careful boundaries</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
