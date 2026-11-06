# Deepesh Singh — AI Product Engineering Portfolio

A Next.js portfolio for a B.Tech Robotics student building toward AI Product Engineering. It includes a conversational homepage, an illustrated avatar, a lightweight ambient background, an interactive engineering capability map, responsive layouts, and reduced-motion support.

## Run locally

```bash
npm ci
npm run dev
```

The app runs at `http://localhost:3000` by default. Use `npm run lint` and `npm run build` for static checks and a production build.

## Verified content

The homepage presents Niramaya AI as its flagship project. The technical case study is available at `/projects/niramaya-ai`; it distinguishes repository implementation from unverified deployment and external services. No clinical validation, user outcomes, or retrieval benchmark results are claimed. Project cards are configured in `src/lib/projects.js`.

## Profile configuration

Contact details are configured in `src/lib/profile.js`. `public/resume.pdf` is a placeholder for the resume download; replace it with the real resume before publishing.

Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical origin before publishing so metadata, `robots.txt`, and the sitemap use the correct domain. Analytics are disabled by default. Enable them with `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only when the Supabase URL and service key are configured on the server.

Contact email delivery requires `RESEND_API_KEY`, `RESEND_FROM`, and `ADMIN_EMAIL`; the inquiry store also requires Supabase. Admin email delivery requires `RESEND_FROM` and Supabase.

## Portfolio assistant

`/ask` and the homepage input use a portfolio assistant backed by curated public notes. Without external credentials, the server performs deterministic local keyword retrieval and returns relevant source passages. If the API cannot be reached, the browser uses the same local notes. Unsupported questions receive the explicit verified-information fallback. When configured, the server embeds questions through an OpenAI-compatible embeddings endpoint, retrieves only passages marked `scope: portfolio` from Qdrant, and streams a bounded answer from an OpenAI-compatible chat-completions endpoint. Server credentials are never sent to the browser.

1. Copy `.env.example` to `.env`. Fill in `LLM_API_KEY`, `LLM_MODEL`, and `EMBEDDING_MODEL`. For local `npm run dev`, use `QDRANT_URL=http://localhost:6333`; Compose overrides it to the Qdrant service hostname. Set `LLM_BASE_URL` for a compatible provider other than OpenAI.
2. Start Qdrant locally with `docker compose up -d qdrant`, or set `QDRANT_URL` to an independently managed Qdrant service.
3. Run `npm run ingest:portfolio` to embed and index the curated public portfolio passages. Re-run it after changing the ingestion script's knowledge content.
4. Start the web app with `npm run dev` or `docker compose up --build`.

The ingestion script indexes only its explicit, public portfolio text. It does not crawl files or retrieve private documents. The assistant uses an in-memory per-process rate limit; use an edge or shared rate limiter for multi-instance deployments. Configure `NEXT_PUBLIC_SITE_URL` with the canonical production origin so metadata and sitemap URLs are correct.

## Container setup

`docker compose up --build` starts the Next.js application and a local Qdrant service. Qdrant is not required to run the portfolio itself. The compose file does not add PostgreSQL because this portfolio frontend does not connect to Niramaya AI's database; the Niramaya case study describes that separate project's implementation.
