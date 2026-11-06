import { PROFILE } from "@/lib/profile";

export default function Footer() {
  return (
    <footer className="portfolio-footer">
      <p>{PROFILE.name} <span>© {new Date().getFullYear()}</span></p>
      <p>AI PRODUCT ENGINEERING · ROBOTICS</p>
      <nav aria-label="Footer contact links">
        {PROFILE.email && <a href={`mailto:${PROFILE.email}`}>Email</a>}
        {PROFILE.github && <a href={PROFILE.github} target="_blank" rel="noreferrer">GitHub</a>}
        {PROFILE.linkedin && <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
        {PROFILE.resume && <a href={PROFILE.resume} target="_blank" rel="noreferrer">Resume</a>}
      </nav>
    </footer>
  );
}
