# Evidence needed before expanding public claims

The portfolio currently presents Niramaya AI as a repository-grounded project. Its case study reports implementation details visible in the public source and documentation, and labels deployment or service behavior as unverified.

## Evidence still missing

- **Personal contribution detail:** a verified breakdown of which modules and decisions were authored by Deepesh, beyond what repository history and project documentation establish.
- **Live system evidence:** a working demo, deployment URL, and confirmation that AWS S3, Qdrant, and a model provider are configured and operational.
- **Measured quality:** a labelled question, expected answer, and source dataset; retrieval/answer metrics; and reproducible evaluation artifacts. Keep evaluation results off the public site until this evidence exists.
- **User or clinical evidence:** user research, workflow outcomes, clinical review, or validation. No user impact or clinical effectiveness claim is currently supported.
- **Performance evidence:** production environment, representative workload, latency and resource measurements, and dated Lighthouse results.
- **Verification artifacts:** a successful current CI run and a recorded Niramaya test run. Tests exist in that repository but were not run as part of this portfolio review.
- **Visual proof:** screenshots or a short recording from a verified running Niramaya deployment, if one exists.

## Current CI note

The latest public Niramaya frontend CI run inspected for this update was run #14 on November 3, 2026. It failed at `npm audit --omit=dev`; later checks were skipped. The public log archive was inaccessible during review, so the full original audit output could not be inspected. Reproduction against that commit's manifest and lockfile identified vulnerable Next.js `15.5.27` advisories. A local fix pins `15.5.28` and supplies the public API URL required by the production build. Those changes are isolated in `/private/tmp/niramaya-ci-fix`, remain unpushed, and require a successful CI rerun before the public repository can be described as green.

## Source

- Niramaya AI public repository: <https://github.com/singhdeepesh20/Niramaya-AI>
- Repository documentation used for the case study: `docs/13-medical-data-extraction-rules.md`, `docs/16-chunking-and-embeddings.md`, `docs/17-qdrant-vector-database.md`, `docs/18-rag-retrieval-and-generation.md`, and the implementation under `app/health/` and `app/documents/`.
