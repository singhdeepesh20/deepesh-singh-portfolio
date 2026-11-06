"use client";

import { useEffect } from "react";
import { PROFILE } from "@/lib/profile";
import { PROJECTS } from "@/lib/projects";
import { ARTICLES } from "@/app/journal/articles";
import AvatarIllustration from "./AvatarIllustration";
import CapabilityMap from "./CapabilityMap";
import PortfolioPrompt from "./PortfolioPrompt";

const NAV_LINKS = [
  ["About", "about"],
  ["Projects", "work"],
  ["Expertise", "skills"],
  ["Journal", "journal"],
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
            <div className="availability-line">Seeking AI Engineering / AI Backend Engineering internships — 2027</div>
            <p className="eyebrow">HEY, I&apos;M DEEPESH <span>👋</span></p>
            <h1>
              AI Product
              <span className="serif-italic">Engineer</span>
            </h1>
            <p className="lead-copy">
              I build intelligent products with <span className="highlight">retrieval-augmented generation</span>, AI agents, and reliable backend systems.
            </p>
            <p className="sub-copy">
              Build systems that are useful, reliable, measurable, and understandable.
            </p>

            <div className="hero-actions">
              <a className="primary-button" href="#work">Explore Projects <span>↗</span></a>
              {PROFILE.resume && <a className="secondary-button" href={PROFILE.resume} target="_blank" rel="noreferrer">Download Resume <span>↓</span></a>}
              <a className="secondary-button" href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
              <a className="secondary-button" href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
              <a className="secondary-button" href={`mailto:${PROFILE.email}`}>Contact <span>↗</span></a>
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

        {PROJECTS.map((project) => <article className="project-card" key={project.id}>
          <div className="project-visual">
            <div className="project-orbit project-orbit-one" />
            <div className="project-orbit project-orbit-two" />
            <div className="project-mark">N</div>
            <div className="project-labels">
              <span aria-label="Product illustration, not a screenshot">system illustration</span>
              <span>reports</span>
              <span>evidence</span>
            </div>
          </div>

          <div className="project-info">
            <div className="meta-row">
              <span className="meta-tag">{project.category}</span>
              <span className="meta-status">• {project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p className="project-problem"><strong>Problem:</strong> {project.problem}</p>
            <p>{project.description}</p>

            <div className="tech-stack">
              {project.technologies.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className="project-actions">
              <a className="primary-button dark" href={project.repositoryUrl} target="_blank" rel="noreferrer">GitHub repository <span>↗</span></a>
              <a className="secondary-link" href={project.caseStudyUrl}>Read the case study <span>↗</span></a>
              {project.demoUrl && <a className="secondary-link" href={project.demoUrl} target="_blank" rel="noreferrer">Live demo <span>↗</span></a>}
            </div>

            <div className="transparency-note" aria-label="Project evidence">
              {project.implementationStatus} Evidence: {project.evidence.join(" · ")}
            </div>
          </div>
        </article>)}
      </section>

      <CapabilityMap />

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

      <section className="journal-panel" id="journal" data-nav-section aria-labelledby="journal-heading">
        <div className="section-kicker kicker-lavender">06 / ENGINEERING JOURNAL</div>
        <div className="journal-inner">
          <h2 id="journal-heading">Notes from the <span className="serif-italic">workbench.</span></h2>
          <div className="journal-side">
            <p>Technical notes on retrieval, document processing, backend architecture, and system reliability.</p>
            <div className="journal-tag">Educational explanations and repository-grounded notes; no invented personal milestones.</div>
          </div>
        </div>
        <div className="journal-articles">
          {Object.entries(ARTICLES).map(([slug, article]) => (
            <article className="journal-article" key={slug}>
              <p className="journal-article-meta">{article.tags.join(" · ")} <span> / </span>{article.readingTime}</p>
              <h3><a href={`/journal/${slug}`}>{article.title} <span aria-hidden="true">↗</span></a></h3>
              <p>{article.description}</p>
              <a className="journal-read-link" href={`/journal/${slug}`}>Read the note <span aria-hidden="true">↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-block" id="contact" data-nav-section>
        <div className="section-kicker">07 / SAY HELLO</div>
        <div className="contact-inner">
          <div className="contact-copy">
            <h2>Have an <span className="serif-italic">interesting</span><br />problem to solve?</h2>
            <p>Seeking AI Engineering and AI Backend Engineering internship opportunities for 2027. I&apos;m interested in building useful, reliable intelligent products.</p>
          </div>

          <div className="contact-links-panel">
            <a href={`mailto:${PROFILE.email}`}>mr.deepesh.singh00@gmail.com <span>↗</span></a>
            <div className="small-links">
              <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              {PROFILE.resume && <a href={PROFILE.resume} target="_blank" rel="noreferrer">Resume</a>}
            </div>
            <div className="mail-note">Opens your email client — no message is stored here.</div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© 2026 Deepesh Singh</span>
        <span>Built with curiosity &amp; careful boundaries</span>
        <nav aria-label="Footer navigation">
          <a href="#work">Projects</a>
          <a href="#journal">Journal</a>
          <a href="#contact">Contact</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          {PROFILE.resume && <a href={PROFILE.resume} target="_blank" rel="noreferrer">Resume</a>}
          <a href="#top">Back to top ↑</a>
        </nav>
      </footer>
    </main>
  );
}
