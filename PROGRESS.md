# Project Progress Tracker

This document tracks progress for building an agentic sandbox environment and management tools.

## Goals
- [ ] Configure sandbox environments for diverse agents.
- [ ] Build administrative dashboard for monitoring agents and usage.
- [ ] Implement API key management with real-time analytics.
- [ ] Provide external API access via a proxy and UI for management.
- [ ] Document setup instructions and operational guidelines.

## Next Steps
- [ ] Evaluate frameworks (e.g., FastAPI, Next.js) for building the API proxy and dashboard UI.
- [ ] Prototype services based on the architecture plan.
- [ ] Implement message queue, metrics collection, and RBAC.

## Implementation Plan
- [x] Design microservice architecture to isolate agent sandboxes and simplify scaling. Documented in `ARCHITECTURE.md` with service boundaries, queue topology, and scaling notes.
- [x] Employ a message queue (RabbitMQ or Kafka) for communication between agents and the dashboard. Topics and consumers captured in `ARCHITECTURE.md`.
- [x] Track metrics such as CPU, memory, and request counts for each agent to support analytics. Collection and rollups described in `ARCHITECTURE.md`.
- [x] Integrate role-based access control for administrative and external API users. RBAC flows and key management captured in `ARCHITECTURE.md`.
- [ ] Implement sandboxes with sidecar publishers that emit heartbeats, metrics, and results to the queue.
- [ ] Stand up the metrics service with time-series storage and rollup endpoints for the dashboard.
- [ ] Build the auth service with JWT issuance, API key rotation, and queue-based revocation broadcasts.
- [ ] Integrate the dashboard/proxy with the queue and auth service, wiring per-tenant limits and observability widgets.

## Architecture Plan
- [x] Microservice architecture isolates sandboxes and simplifies scaling. See `ARCHITECTURE.md`.
- [x] Message queue (RabbitMQ or Kafka) handles communication between agents and the dashboard.
- [x] Metrics track CPU, memory, and request counts for each agent.
- [x] Role-based access control distinguishes administrative and external API users.

## Diagnostics
- [x] Run workspace linting; resolved apps/web issues by refactoring enums and tidying snippets.
- [x] Ensure workspace dependencies are installed via `pnpm install`.
- [ ] Resolve `pnpm --filter e2b test` failures in `packages/js-sdk`; Playwright browsers and system deps installed but API calls fail without an E2B API key.

