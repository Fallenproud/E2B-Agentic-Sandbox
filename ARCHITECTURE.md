# Agentic Sandbox Architecture

This document outlines a proposed microservice design for isolating agent sandboxes and supporting a scalable management platform.

## Services

- **Sandbox Service** – launches isolated sandboxes for each agent. Each sandbox exposes a small API for executing code and reporting resource usage. A lightweight sidecar publishes heartbeats and metrics.
- **Dashboard Service** – provides the administrative UI and public API proxy. It communicates with sandboxes through the message queue and aggregates metrics. The proxy hides internal addressing and enforces per-tenant limits.
- **Auth Service** – issues and validates API keys and JWT tokens. Implements role-based access control (RBAC) for administrators, internal services, and external API users. Includes token introspection endpoints for other services.
- **Metrics Service** – collects CPU, memory, and request-count metrics from sandboxes and stores them in a time-series database for analytics. Exposes aggregation APIs for the dashboard.

## Communication

All services communicate asynchronously through a message queue such as RabbitMQ or Kafka. Sandboxes publish lifecycle events and execution results. The dashboard subscribes to these messages to update real-time views and trigger follow-up actions. Requests that must return immediately (e.g., issuing tokens) use direct HTTP calls between services.

### Queue Topology

- **Topics/Exchanges**
  - `sandbox.events` for lifecycle changes (created, ready, terminated).
  - `sandbox.results` for execution output streams.
  - `metrics.ingest` for periodic metric batches from sandboxes.
  - `audit.auth` for authentication and authorization audit trails.
- **Consumers**
  - Dashboard: subscribes to `sandbox.events` and `sandbox.results` to drive UI and notify users.
  - Metrics service: consumes `metrics.ingest` and exposes rollups via HTTP.
  - Auth service: consumes `audit.auth` for compliance and anomaly detection.

## Scaling and Isolation

Each sandbox runs in its own lightweight container, allowing horizontal scaling by adding more sandbox instances. Stateless services (dashboard, auth, metrics) scale independently, ensuring that heavy sandbox workloads do not affect the control plane.

## Metrics

Sandboxes expose resource usage data which the metrics service scrapes at regular intervals. The sidecar pushes deltas to the queue to avoid backpressure on scrapers. Example metrics include:

- CPU utilization
- Memory consumption
- Request counts and durations
- Queue lag for sandbox jobs

These metrics feed dashboards and alerts to support capacity planning and cost analysis. The dashboard queries the metrics service for rollups (p95 latency, total runtime per sandbox, error rates) to power real-time widgets.

## Role-Based Access Control

The auth service maintains user roles (e.g., admin, standard user, read-only). API keys and tokens encode these roles so that services can enforce permissions consistently. Administrative endpoints require elevated roles, while external API consumers receive limited capabilities.

### RBAC Flows

1. User authenticates with the auth service; a JWT is minted with roles and tenant identifiers.
2. Dashboard receives the token and performs local validation (signature + expiry) before forwarding to internal services.
3. Queue consumers validate embedded scopes on messages that request privileged actions (e.g., reading another tenant’s metrics).
4. Audit events for authentication, authorization failures, and privileged actions are emitted to `audit.auth`.

### Key Management

- Short-lived JWTs for UI sessions and service-to-service calls.
- Long-lived API keys for external automation; keys map to service accounts with scoped permissions.
- Rotation policy enforced via the auth service with automatic revocation broadcasts over the queue.

## Implementation Playbook (remaining milestones)

### Sandbox sidecar
- Emit `sandbox.events` (created/ready/terminated) and heartbeat pings with sandbox ID, tenant, and timestamp.
- Batch metrics to `metrics.ingest` every 15–30 seconds with CPU, memory, request counts, and queue lag plus sequence numbers for deduplication.
- Stream execution output to `sandbox.results` with chunk IDs to support replay in the dashboard.
- Expose a minimal HTTP endpoint for liveness and a control endpoint to request graceful shutdowns from the dashboard.

### Metrics service
- Accept metric batches from the queue and validate sequence numbers to drop stale messages.
- Write samples to a time-series store (TimescaleDB or ClickHouse) keyed by sandbox, tenant, and timestamp.
- Provide rollup endpoints: current health, 1/5/60-minute CPU & memory averages, p95/p99 latency, and request error rates.
- Emit alerts or anomaly events back to the queue for the dashboard to surface in real time.

### Auth service
- Sign JWTs with rotating keys (JWK set) and publish key-rotation events so services can refresh caches.
- Maintain API key hashes with scopes; publish revocation messages consumed by the dashboard proxy and sandbox service.
- Offer token introspection and impersonation-for-support endpoints guarded by admin roles; audit all privileged calls to `audit.auth`.

### Dashboard / API proxy
- Subscribe to `sandbox.events` and `sandbox.results` for live views; persist last-known state in a cache (Redis) for fast reloads.
- Enforce rate limits and scopes from the auth service; cache introspection results with short TTLs.
- Integrate metrics rollups for per-tenant limits, budget alerts, and uptime widgets.
- Add administrative controls to drain/terminate sandboxes and replay execution logs from `sandbox.results`.
