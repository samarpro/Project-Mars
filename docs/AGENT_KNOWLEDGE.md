# Project Mars Agent Knowledge Base

## Project One-Liner
Project Mars is a writing app with an intelligence layer that proactively links what the user writes now to relevant blocks from what they wrote before.

## Product Intent
- Turn passive note archives into active contextual insight.
- Help users see evolved thinking and avoid repeated mistakes.
- Increase writing retention by making writing sessions more valuable.

## Core Modes
### Journal Mode
- User writes without interruption.
- Insights appear only after session end.
- Target insight types: contradictions, repeated reflections, emotional patterns.

### Learning Mode
- User writes learning notes.
- Insights can appear in-flow with restraint.
- Target insight types: conceptual overlaps and prerequisite links.

## Strict Rules Agents Must Respect
- Never interrupt Journal mode with in-flow insights.
- Always enforce user and space boundaries for retrieval.
- Always include source citation and relation reason when presenting insights.
- Do not implement out-of-scope MVP features unless explicitly requested.

## MVP Scope Snapshot
### In
- Native writing.
- Mode selection before session.
- Block-level segmentation and retrieval.
- Mode-specific insight timing.
- Journal streak and sentiment trend basics.
- Insight analytics events.

### Out
- External imports.
- Team/shared knowledge base.
- Advanced personalization ML.

## Canonical Terms
- Writing Session: time-bound writing instance with a selected mode.
- Block: retrievable paragraph/passage unit from a document.
- Insight: surfaced link between current block and historical block.
- Relation Type: semantic reason the link was surfaced.
- Space Boundary: isolation scope for cross-referencing.

## Current Product Decisions
- Document type in use: PRD.
- Primary audience: Execution Team.
- MVP scope: Core writing + two modes.
- North-star KPI: Writing retention (D7, D30).

## Default Interface Contracts
- `POST /sessions` to start mode-scoped writing.
- `POST /documents/{id}/blocks` to persist segmented text.
- `GET /insights?session_id=...` to retrieve contextual insights.
- `POST /insights/{id}/events` to track insight lifecycle.

## Required Analytics Events
- `session_started`
- `session_completed`
- `insight_shown`
- `insight_opened`
- `insight_dismissed`
- `insight_marked_useful`
- `streak_updated`

## Agent Guardrails for Code Changes
- Preserve mode timing behavior first.
- Preserve boundary-safe retrieval first.
- Prefer explainable heuristics over opaque behavior.
- Add tests for mode logic and scope boundaries when changing retrieval or surfacing.

## Read Order for New Agents
1. `PD.md`
2. `docs/PRD.md`
3. Backend API/schema docs (when available)
4. Analytics event specification (when available)
