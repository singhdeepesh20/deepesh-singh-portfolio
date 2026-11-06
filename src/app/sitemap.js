export default function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const routes = [
    ["/", "weekly", 1],
    ["/work/niramaya-ai", "monthly", 0.9],
    ["/ask", "monthly", 0.6],
    ["/journal/document-processing", "yearly", 0.6],
    ["/journal/user-scoped-retrieval", "yearly", 0.6],
  ];
  return routes.map(([path, changeFrequency, priority]) => ({ url: new URL(path, base).toString(), changeFrequency, priority }));
}
