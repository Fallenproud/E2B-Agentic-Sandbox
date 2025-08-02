# Agentic Sandbox Architecture

This document outlines a proposed microservice design for isolating agent sandboxes and supporting a scalable management platform.

## Services

- **Sandbox Service** – launches isolated sandboxes for each agent. Each sandbox exposes a small API for executing code and reporting resource usage.
- **Dashboard Service** – provides the administrative UI and public API proxy. It communicates with sandboxes through the message queue and aggregates metrics.
- **Auth Service** – issues and validates API keys and JWT tokens. Implements role-based access control (RBAC) for administrators, internal services, and external API users.
- **Metrics Service** – collects CPU, memory, and request-count metrics from sandboxes and stores them in a time-series database for analytics.

## Communication

All services communicate asynchronously through a message queue such as RabbitMQ or Kafka. Sandboxes publish lifecycle events and execution results. The dashboard subscribes to these messages to update real-time views and trigger follow-up actions.

## Scaling and Isolation

Each sandbox runs in its own lightweight container, allowing horizontal scaling by adding more sandbox instances. Stateless services (dashboard, auth, metrics) scale independently, ensuring that heavy sandbox workloads do not affect the control plane.

## Metrics

Sandboxes expose resource usage data which the metrics service scrapes at regular intervals. Example metrics include:

- CPU utilization
- Memory consumption
- Request counts and durations

These metrics feed dashboards and alerts to support capacity planning and cost analysis.

## Role-Based Access Control

The auth service maintains user roles (e.g., admin, standard user, read-only). API keys and tokens encode these roles so that services can enforce permissions consistently. Administrative endpoints require elevated roles, while external API consumers receive limited capabilities.

