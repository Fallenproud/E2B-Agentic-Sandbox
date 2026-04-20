# Project Progress Tracker

This document tracks progress for building an agentic sandbox environment and management tools.

## Goals
- [ ] Configure sandbox environments for diverse agents.
  - [ ] Define per-agent resource profiles (CPU/memory/timeouts) and isolation guarantees.
  - [ ] Ship a reference template that demonstrates Python, JavaScript, and LLM toolchains.
  - [ ] Validate lifecycle hooks (create/heartbeat/terminate) against the queue contract.
- [ ] Build administrative dashboard for monitoring agents and usage.
  - [ ] Wire dashboards to metrics rollups (current, 1/5/60 min) and sandbox state cache.
  - [ ] Provide controls for drain, terminate, replay logs, and manual budget adjustments.
  - [ ] Add per-tenant filters and role-aware views for support vs. admin users.
- [ ] Implement API key management with real-time analytics.
  - [ ] Deliver key issuance/rotation flows with audit trails and revocation broadcasts.
  - [ ] Display live request counts, error rates, and rate-limit status per key.
  - [ ] Expose webhook/stream for key lifecycle events to downstream systems.
- [ ] Provide external API access via a proxy and UI for management.
  - [ ] Proxy calls through auth and queue publishing, enforcing rate and scope policies.
  - [ ] Offer UI self-service for key creation, scope assignment, and quota tuning.
  - [ ] Publish proxy health, latency, and saturation metrics to the dashboard.
- [ ] Document setup instructions and operational guidelines.
  - [ ] Produce runbooks for local dev, staging, and production deployments.
  - [ ] Include observability/alert playbooks and SLO definitions per service.
  - [ ] Capture onboarding guide for new contributors (queue, auth, sandbox flows).

## Next Steps
- [ ] Evaluate frameworks (e.g., FastAPI, Next.js) for building the API proxy and dashboard UI.
  - [ ] Compare FastAPI vs. NestJS for proxy/API services (auth, rate limiters, tracing).
  - [ ] Compare Next.js vs. Remix for dashboard SSR and design system integration.
  - [ ] Document the decision in `ARCHITECTURE.md` with tradeoffs and chosen stack.
- [ ] Prototype services based on the architecture plan.
  - [ ] Deliver sandbox sidecar prototype emitting heartbeats, metrics, and result chunks.
  - [ ] Stand up a thin metrics service ingesting batches into a TSDB with rollup endpoints.
  - [ ] Ship a minimal auth service issuing JWTs and broadcasting key revocations.
- [ ] Implement message queue, metrics collection, and RBAC.
  - [ ] Establish queue schemas, retention, and dead-letter policies for all topics.
  - [ ] Enforce RBAC in the proxy and dashboard using cached introspection results.
  - [ ] Verify metrics ingest/rollup and RBAC flows under load/perf tests.

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

