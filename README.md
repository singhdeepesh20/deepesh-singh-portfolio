# Deepesh Singh — AI Product Engineering Portfolio

A Next.js portfolio for a B.Tech Robotics student building toward AI Product Engineering. It includes an animated 3D hero, responsive layouts, and reduced-motion support.

## Run locally

```bash
npm ci
npm run dev
```

The app runs at `http://localhost:3000` by default. Use `npm run lint` and `npm run build` for static checks and a production build.

## Verified content

The site presents Niramaya AI as its flagship case study using implementation and design details documented in the public repository. Deployment, clinical validation, and retrieval benchmark results are not claimed.

## Profile configuration

Contact details are configured in `src/lib/profile.js`. Optional links such as the resume are omitted until a corresponding file or URL is configured.

Set `NEXT_PUBLIC_SITE_URL` to the deployed canonical origin before publishing so metadata, `robots.txt`, and the sitemap use the correct domain. Analytics are disabled by default. Enable them with `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only when the Supabase URL and service key are configured on the server.

Contact email delivery requires `RESEND_API_KEY`, `RESEND_FROM`, and `ADMIN_EMAIL`; the inquiry store also requires Supabase. Admin email delivery requires `RESEND_FROM` and Supabase.
