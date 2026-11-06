"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { PROFILE } from "@/lib/profile";

const IntelligenceCore = dynamic(() => import("./IntelligenceCore"), { ssr: false });

const NAV_LINKS = [
  ["Home", "top"],
  ["About", "about"],
  ["Work", "work"],
  ["Engineering", "philosophy"],
  ["Contact", "contact"],
];

function ContactLinks({ className = "" }) {
  return (
    <div className={className}>
      <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>
      <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a>
      <a href={`mailto:${PROFILE.email}`}>Email <span>↗</span></a>
    </div>
  );
}

function SectionLabel({ number, children }) {
  return <div className="section-kicker"><span>{number}</span> / {children}</div>;
}

export default function AiPortfolio() {
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    const sections = [...document.querySelectorAll("[data-nav-section]")];
    if (!("IntersectionObserver" in window) || !sections.length) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".engine-nav a[href^='#']").forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ai-portfolio engineering-mind">
      <nav className="engine-nav" aria-label="Main navigation">
        <a className="engine-brand" href="#top" aria-label="Deepesh Singh home">DS<span>·</span></a>
        {NAV_LINKS.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </nav>

      <section className="ai-hero mind-hero" id="top" data-nav-section>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">AI PRODUCT ENGINEER <span>·</span> BUILDER</p>
          <h1>I build intelligent<br /><em>systems that solve<br />real problems.</em></h1>
          <p className="hero-summary">Exploring the intersection of Generative AI, retrieval systems, backend engineering, and product design.</p>
          <p className="hero-role">B.TECH ROBOTICS <b>·</b> AI ENGINEERING</p>
          <div className="hero-actions">
            <a className="button-primary" href="/work/niramaya-ai">EXPLORE NIRAMAYA AI <span>↗</span></a>
            <a className="button-secondary" href={PROFILE.github} target="_blank" rel="noreferrer">GITHUB <span>↗</span></a>
            <a className="hero-contact-link" href="#contact">CONTACT ME</a>
          </div>
        </div>
        <div className={`network-visual ${webglReady ? "webgl-ready" : ""}`} aria-hidden="true">
          <div className="network-fallback" role="img" aria-label="A restrained diagram of connected information nodes">
            <div className="network-orbit orbit-one" />
            <svg viewBox="0 0 520 520" aria-hidden="true">
              <g className="network-lines"><path d="M95 175 205 105 340 145 425 250 325 375 160 350 95 175M205 105l120 270M340 145 160 350M95 175l330 75M205 105l220 145-100 125" /></g>
              <g className="network-dots"><circle cx="95" cy="175" r="4"/><circle cx="205" cy="105" r="4"/><circle cx="340" cy="145" r="4"/><circle cx="425" cy="250" r="4"/><circle cx="325" cy="375" r="4"/><circle cx="160" cy="350" r="4"/></g>
            </svg>
          </div>
          <IntelligenceCore onReady={() => setWebglReady(true)} />
          <span className="network-caption">THE COGNITIVE CORE</span>
        </div>
        <a className="scroll-cue" href="#philosophy"><span /> SCROLL TO EXPLORE</a>
        <div className="hero-index">AI SYSTEMS / PRODUCT ENGINEERING</div>
      </section>

      <section className="ai-section philosophy-section reveal-section" id="philosophy" data-nav-section>
        <SectionLabel number="01">ENGINEERING PHILOSOPHY</SectionLabel>
        <h2>Beyond models.<br /><em>Into systems.</em></h2>
        <div className="philosophy-copy">
          <p>I am interested in what happens beyond the model.</p>
          <p>How does information become useful knowledge? How do retrieval systems find relevant context? How do we build reliable backends around probabilistic models? How do we turn technical capabilities into useful products?</p>
          <p>I learn by building, testing, investigating failures, and improving the systems I create.</p>
        </div>
        <div className="principle-list">
          <article><span>01</span><h3>Intelligent systems</h3><p>Generative AI, retrieval, and information access.</p></article>
          <article><span>02</span><h3>Software engineering</h3><p>Backend systems, data boundaries, reliability, and testing.</p></article>
          <article><span>03</span><h3>Product thinking</h3><p>Useful workflows shaped by trade-offs and iteration.</p></article>
        </div>
      </section>

      <section className="ai-section project-section reveal-section" id="work" data-nav-section>
        <SectionLabel number="02">FEATURED WORK / ONE FLAGSHIP PROJECT</SectionLabel>
        <article className="featured-project">
          <div className="featured-project-meta"><span>MEDICAL DOCUMENT INTELLIGENCE</span><span>PERSONAL ENGINEERING PROJECT</span></div>
          <div className="featured-project-title"><span className="project-index">01</span><h2>NIRAMAYA<br /><em>AI.</em></h2></div>
          <div className="featured-project-bottom">
            <div>
              <p className="featured-tagline">Transforming scattered medical reports into structured, searchable health records.</p>
              <p className="featured-description">The public repository contains a Next.js frontend, FastAPI backend, document-processing code, and a documented retrieval pipeline. Deployment and real-world outcomes are not verified.</p>
            </div>
            <div className="featured-project-actions">
              <a className="button-primary" href="/work/niramaya-ai">READ THE CASE STUDY <span>↗</span></a>
              <a className="text-link" href="https://github.com/singhdeepesh20/Niramaya-AI" target="_blank" rel="noreferrer">OPEN SOURCE REPOSITORY ↗</a>
            </div>
          </div>
          <div className="featured-project-status"><span>STATUS</span><p>Repository implementation is available for review. No live demo or clinical validation is claimed.</p></div>
        </article>
      </section>

      <section className="ai-section about-section reveal-section" id="about" data-nav-section>
        <SectionLabel number="03">ABOUT</SectionLabel>
        <div className="intro-layout">
          <h2>LEARNING<br /><em>BY BUILDING.</em></h2>
          <div className="intro-body">
            <p className="lead">I am a B.Tech Robotics student interested in building intelligent products at the intersection of AI and software engineering.</p>
            <p>My focus is understanding how AI systems work beyond the model layer—from data processing and retrieval to backend architecture, reliability, and user experience.</p>
            <p>I learn by building, testing, investigating failures, and improving the systems I create.</p>
          </div>
        </div>
      </section>

      <section className="closing-section reveal-section" id="contact" data-nav-section>
        <SectionLabel number="04">CONTACT</SectionLabel>
        <h2>LET’S BUILD<br /><em>SOMETHING MEANINGFUL.</em></h2>
        <p>Interested in AI engineering, intelligent systems, or interesting technical problems? I’d be happy to connect.</p>
        <ContactLinks className="contact-links" />
      </section>
    </div>
  );
}
