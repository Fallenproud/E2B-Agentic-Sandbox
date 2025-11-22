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
  - [ ] Emit lifecycle events and heartbeats with sandbox ID, tenant, and timestamps.
  - [ ] Batch metrics (CPU, memory, request counts, queue lag) with sequence numbers to `metrics.ingest`.
  - [ ] Stream execution output to `sandbox.results` with chunk IDs for replay.
- [ ] Stand up the metrics service with time-series storage and rollup endpoints for the dashboard.
  - [ ] Consume metric batches, enforce sequence ordering, and persist to TSDB (TimescaleDB/ClickHouse).
  - [ ] Expose rollups for current health, 1/5/60-minute CPU & memory, latency p95/p99, and error rates.
  - [ ] Emit alerts/anomaly events back to the queue for dashboard surfacing.
- [ ] Build the auth service with JWT issuance, API key rotation, and queue-based revocation broadcasts.
  - [ ] Provide JWK set rotation and token introspection endpoints; audit privileged calls.
  - [ ] Store hashed API keys with scopes and publish revocations to consumers.
  - [ ] Enforce RBAC for admin/support impersonation workflows.
- [ ] Integrate the dashboard/proxy with the queue and auth service, wiring per-tenant limits and observability widgets.
  - [ ] Subscribe to sandbox events/results; cache last-known state in Redis for fast reloads.
  - [ ] Enforce rate limits and scopes with cached introspection results.
  - [ ] Surface metrics rollups, budget alerts, uptime widgets, and admin controls (drain/terminate/replay logs).

## Architecture Plan
- [x] Microservice architecture isolates sandboxes and simplifies scaling. See `ARCHITECTURE.md`.
- [x] Message queue (RabbitMQ or Kafka) handles communication between agents and the dashboard.
- [x] Metrics track CPU, memory, and request counts for each agent.
- [x] Role-based access control distinguishes administrative and external API users.

## Diagnostics
- [x] Run workspace linting; resolved apps/web issues by refactoring enums and tidying snippets.
- [x] Ensure workspace dependencies are installed via `pnpm install`.
- [ ] Resolve `pnpm --filter e2b test` failures in `packages/js-sdk`; Playwright browsers and system deps installed but API calls fail without an E2B API key.

