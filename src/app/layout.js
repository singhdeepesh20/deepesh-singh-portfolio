import "./globals.css";
import TrackVisit from "@/components/TrackVisit";
import { Analytics } from "@vercel/analytics/next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "";
const METADATA_BASE = BASE || "http://localhost:3000";

export const viewport = { themeColor: "#08090b" };

export const metadata = {
  metadataBase: new URL(METADATA_BASE),
  title: { default: "Deepesh Singh — AI Product Engineer", template: "%s — Deepesh Singh" },
  description: "Deepesh Singh is a Robotics Engineering student exploring generative AI, retrieval systems, agentic architectures, and reliable backend infrastructure.",
  keywords: ["AI Product Engineer", "Generative AI", "RAG", "Agentic AI", "Backend Engineering", "Robotics"],
  authors: [{ name: "Deepesh Singh" }],
  creator: "Deepesh Singh",
  ...(BASE ? { alternates: { canonical: BASE } } : {}),
  openGraph: { type: "website", locale: "en_US", ...(BASE ? { url: BASE } : {}), siteName: "Deepesh Singh — AI Product Engineer", title: "Deepesh Singh | AI Product Engineer", description: "Explore the engineering work, AI systems, RAG architectures, and projects of Deepesh Singh.", images: ["/social-card.svg"] },
  twitter: { card: "summary_large_image", title: "Deepesh Singh | AI Product Engineer", description: "Explore the engineering work, AI systems, RAG architectures, and projects of Deepesh Singh.", images: ["/social-card.svg"] },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Deepesh Singh",
  ...(BASE ? { url: BASE } : {}),
  jobTitle: "AI Product Engineer",
  description: "Robotics Engineering student interested in generative AI, retrieval systems, agentic architectures, and backend engineering.",
  knowsAbout: ["Generative AI", "Retrieval-Augmented Generation", "Agentic AI", "Backend Engineering", "Distributed Systems", "Robotics"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ── Resource hints ── */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://ip-api.com" />

        {/* ── Structured Data for Google + AI bots ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* ── LLMs.txt discovery (AI chatbot standard) ── */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site info" />

        {/* ── Google Search Console verification ── */}
        {process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION} />
        )}

        {/* ── Bing Webmaster Tools verification ── */}
        {process.env.NEXT_PUBLIC_BING_VERIFICATION && (
          <meta name="msvalidate.01" content={process.env.NEXT_PUBLIC_BING_VERIFICATION} />
        )}
      </head>
      <body>
        <TrackVisit />
        {children}
        <Analytics />
      </body>
    </html>
  );
}

