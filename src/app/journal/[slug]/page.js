import Link from "next/link";
import { notFound } from "next/navigation";
import { ARTICLES } from "../articles";

export function generateStaticParams() { return Object.keys(ARTICLES).map((slug) => ({ slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  return article ? { title: `${article.title} | Engineering Journal`, description: article.description, openGraph: { title: article.title, description: article.description, type: "article", publishedTime: article.date } } : {};
}

export default async function JournalArticle({ params }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();
  return <main className="journal-page"><nav><Link href="/#journal">← Engineering journal</Link><Link href="/">Deepesh Singh / DS</Link></nav><article><p className="eyebrow">ENGINEERING JOURNAL <span>·</span> {article.tags.join(" / ")}</p><h1>{article.title}</h1><p className="journal-deck">{article.description}</p><p className="journal-meta">{new Date(`${article.date}T12:00:00Z`).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })} · {article.readingTime}</p>{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside>Implementation details are based on the public Niramaya AI repository. Service deployment and external integrations are unverified.</aside><Link className="button-primary" href="/projects/niramaya-ai">READ THE CASE STUDY ↗</Link></article></main>;
}
