import Link from "next/link";
import ChatAssistant from "./ChatAssistant";

export const metadata = { title: "Ask My Portfolio | AI Assistant", description: "Ask questions about Deepesh Singh's verified portfolio, projects, and engineering interests." };

export default function AskPage() {
  return <main className="journal-page ask-page"><nav><Link href="/">← Back to portfolio</Link><Link href="/projects/niramaya-ai">Niramaya AI case study ↗</Link></nav><header><p className="eyebrow">AI PORTFOLIO ASSISTANT <span>·</span> RETRIEVAL GROUNDED</p><h1>Ask my<br />portfolio.</h1><p className="journal-deck">A focused assistant for questions about my work and engineering interests. Answers use curated public portfolio material, with an optional server side model.</p></header><ChatAssistant /><p className="assistant-config-note">Answers are limited to verified portfolio information. Local portfolio retrieval works without credentials; model and Qdrant settings, when configured, remain server-side.</p></main>;
}
