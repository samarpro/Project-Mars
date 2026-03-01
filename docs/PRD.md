# Project Mars PRD

## Document Control
- Product: Project Mars
- Document Type: Product Requirements Document (PRD)
- Audience: Execution Team (Product, Engineering, Design, Data)
- Owner: Product
- Status: Draft
- Last Updated: 2026-02-28

## Summary
Project Mars is a mode-aware writing environment that proactively connects current writing with prior writing at block level. The MVP focuses on individual users, core writing workflows, and two writing modes with different insight timing behavior.

## Problem Statement
Frequent writers accumulate large personal text libraries, but those libraries become passive storage. Relevant prior insights remain hidden, causing repeated mistakes, duplicated effort, and lost context.

## Vision
Make past thinking available to present thinking at the exact moment it is relevant.

## Product Principles
- Relevance over volume.
- Explainability over opaque suggestions.
- Minimal interruption, especially in Journal mode.
- User trust through strict scope boundaries and source citations.

## Goals and Non-Goals
### Goals
- Enable users to write in Journal or Learning mode.
- Surface block-level cross-references from prior writing.
- Preserve uninterrupted journaling flow.
- Improve writing retention through meaningful insight support.

### Non-Goals (MVP)
- External imports (Notion, Google Docs, PDF ingestion).
- Team/shared knowledge-base features.
- Advanced ML personalization.
- Multi-platform offline sync.

## Users and Personas
- Reflective writer: uses journaling for self-understanding and pattern recognition.
- Active learner: takes notes and wants faster conceptual understanding.
- General frequent writer: wants prior ideas to be discoverable in context.

## MVP Scope
### In Scope
- Native note/journal writing.
- Mode selection before each writing session.
- Document block segmentation (paragraph/passage level).
- Cross-reference retrieval constrained by user and selected space.
- Journal mode post-session insight surfacing.
- Learning mode in-flow insight surfacing with frequency controls.
- Journal sentiment tracking and journaling streaks.
- Insight interaction logging for analytics.

### Out of Scope
- External content imports.
- Collaboration features.
- Cross-user recommendations.

## Functional Requirements
- FR-1: Users must choose `JOURNAL` or `LEARNING` mode before session start.
- FR-2: Saved documents must be segmented into retrievable blocks.
- FR-3: Retrieval must run only on user-owned content and active scope boundaries.
- FR-4: Journal mode must not show insights while actively writing.
- FR-5: Journal mode must show insights after session end/submission.
- FR-6: Learning mode may surface insights during writing with cooldown controls.
- FR-7: Journal insights must support relation types `CONTRADICTION`, `REPETITION`, `EMOTIONAL_PATTERN`.
- FR-8: Learning insights must support relation types `CONCEPTUAL_OVERLAP`, `PREREQUISITE_LINK`.
- FR-9: Every surfaced insight must include source block citation and relation reason.
- FR-10: The system must support insight events `shown`, `opened`, `dismissed`, and `marked_useful`.
- FR-11: Journal sessions must update streak state.
- FR-12: Journal entries must update sentiment trend snapshots.

## Non-Functional Requirements
- NFR-1: Learning mode insight generation target latency: under 2 seconds after save/pause trigger.
- NFR-2: Journal mode interruption rate target: 0 in active writing state.
- NFR-3: All retrieval operations must enforce space boundary constraints.
- NFR-4: Insight cards must remain explainable with source references.
- NFR-5: Event logging must be complete enough to compute retention and insight funnel metrics.

## Core User Flows
### Flow 1: Journal Session
1. User selects space.
2. User selects `JOURNAL` mode.
3. User writes without interruptions.
4. User ends session.
5. System surfaces relevant post-session insights.
6. User reviews, opens, or dismisses insights.
7. System records events, sentiment snapshot, and streak update.

### Flow 2: Learning Session
1. User selects space.
2. User selects `LEARNING` mode.
3. User writes notes.
4. System periodically evaluates current blocks and surfaces in-flow conceptual links.
5. User opens or dismisses insight cards.
6. System records events and continues with cooldown-aware surfacing.

## Public Interfaces and Types
### Enums
- Mode: `JOURNAL | LEARNING`
- InsightRelationType: `CONTRADICTION | REPETITION | EMOTIONAL_PATTERN | CONCEPTUAL_OVERLAP | PREREQUISITE_LINK`
- InsightEventType: `INSIGHT_SHOWN | INSIGHT_OPENED | INSIGHT_DISMISSED | INSIGHT_MARKED_USEFUL`

### Product-Level API Contracts
- `POST /sessions`
  - Input: `user_id`, `space_id`, `mode`
  - Output: `session_id`, `started_at`
- `POST /documents/{document_id}/blocks`
  - Input: ordered blocks with text and metadata
  - Output: persisted block IDs and indexing status
- `GET /insights?session_id={id}`
  - Output: ranked insights with source block and relation reason
- `POST /insights/{insight_id}/events`
  - Input: `event_type`, `session_id`, optional feedback payload
  - Output: acknowledgment

### Data Entities
- User
- Space
- Document
- Block
- WritingSession
- Insight
- InsightEvent
- SentimentSnapshot
- StreakState

## Metrics
### North-Star KPI
- Writing Retention
  - D7 and D30 retention for active writers.

### Supporting Metrics
- Insight open rate.
- Insight usefulness rate.
- Session completion rate.
- Journal streak continuation rate.
- Average insights viewed per session.

## Analytics Events
- `session_started`
- `session_completed`
- `insight_shown`
- `insight_opened`
- `insight_dismissed`
- `insight_marked_useful`
- `streak_updated`

## Risks and Mitigations
- Risk: irrelevant insights reduce trust.
  - Mitigation: confidence thresholds, feedback loop, relation reason display.
- Risk: interruption fatigue.
  - Mitigation: strict Journal mode suppression and Learning cooldown controls.
- Risk: boundary violations across spaces.
  - Mitigation: hard scope filters in retrieval layer and test coverage.

## Dependencies
- Text segmentation pipeline.
- Retrieval/ranking engine for block-level matching.
- Insight event pipeline and analytics storage.
- Sentiment analysis component for journal trending.

## Rollout Plan
### Phase 1
- Core writing, mode selection, block storage, baseline insight surfacing.

### Phase 2
- Improve ranking quality and relation confidence tuning.

### Phase 3
- Add external imports.

### Phase 4
- Add shared/team scenarios.

## Acceptance Criteria
- AC-1: User cannot start a writing session without selecting a mode.
- AC-2: Journal mode produces no in-flow insight interruptions.
- AC-3: Journal mode shows post-session insights with source citations.
- AC-4: Learning mode surfaces at least one valid in-flow insight in supported scenarios.
- AC-5: No insight may reference content outside active user and space scope.
- AC-6: Insight lifecycle events are emitted and queryable for analytics.
- AC-7: D7 and D30 retention dashboards can be computed from captured events.

## Testing Scenarios
- TS-1: Journal uninterrupted flow test.
- TS-2: Journal post-session contradiction retrieval test.
- TS-3: Learning in-flow conceptual overlap surfacing test.
- TS-4: Space boundary isolation test.
- TS-5: Insight citation integrity test.
- TS-6: Event pipeline completeness test.
- TS-7: Streak and sentiment update accuracy test.

## Assumptions and Defaults
- This PRD targets single-user MVP only.
- MVP excludes external import sources.
- Writing retention is the primary business KPI.
- Suggestions are generated from user-authored internal content only.
