# Career Intel AI

A private Hono service that extracts structured job details with the AI SDK, OpenAI, and Zod. It does not store jobs; the NestJS API owns draft creation and PostgreSQL.

## Setup

1. Run `pnpm install`.
2. Copy `.env.example` to `.env` and set `OPENAI_API_KEY`, `OPENAI_MODEL`, and a long random `EXTRACTOR_TOKEN`.
3. Run `pnpm dev` (default: `127.0.0.1:3001`).
4. Configure the same token and `JOB_EXTRACTOR_URL=http://127.0.0.1:3001` in `career-intel-server`.

`POST /extract-job` accepts `{ "description": "...", "url": "" }` with `Authorization: Bearer <EXTRACTOR_TOKEN>`. It returns structured fields and requirements. `GET /health` is a local health check. The service validates both request and model output, does not fetch the posting URL, and keeps the OpenAI key server side.

Run `pnpm test`, `pnpm build`, and `pnpm start` to verify or run compiled code. Live OpenAI extraction requires a valid API key and model in `.env`.
