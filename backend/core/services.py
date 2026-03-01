import re
from datetime import timedelta
from typing import Iterable

from django.contrib.auth.models import User
from django.db.models import QuerySet
from django.utils import timezone

from .models import (
    Block,
    Insight,
    InsightRelationType,
    Mode,
    SentimentSnapshot,
    StreakState,
    WritingSession,
)

POSITIVE_WORDS = {
    "good",
    "great",
    "better",
    "happy",
    "calm",
    "confident",
    "progress",
    "win",
    "clear",
    "learned",
}
NEGATIVE_WORDS = {
    "bad",
    "worse",
    "stuck",
    "anxious",
    "angry",
    "sad",
    "confused",
    "failed",
    "hard",
    "overwhelmed",
}
STOP_WORDS = {
    "the",
    "and",
    "that",
    "this",
    "with",
    "from",
    "into",
    "about",
    "your",
    "have",
    "were",
    "been",
    "what",
    "when",
    "where",
    "there",
    "because",
    "just",
    "very",
    "more",
    "some",
    "than",
}


def segment_blocks(text: str) -> list[str]:
    """Split raw note content into paragraph-sized retrievable blocks."""
    parts = [part.strip() for part in re.split(r"\n\s*\n", text) if part.strip()]
    return parts or [text.strip()] if text.strip() else []


def tokenize(text: str) -> set[str]:
    """Return normalized non-stopword tokens used for similarity heuristics."""
    words = re.findall(r"[a-zA-Z]{4,}", text.lower())
    return {word for word in words if word not in STOP_WORDS}


def sentiment_score(text: str) -> float:
    """Compute a simple lexical sentiment score in the range [-1, 1]."""
    tokens = tokenize(text)
    if not tokens:
        return 0.0
    pos = len(tokens.intersection(POSITIVE_WORDS))
    neg = len(tokens.intersection(NEGATIVE_WORDS))
    return (pos - neg) / max(len(tokens), 1)


def jaccard(a: set[str], b: set[str]) -> float:
    """Measure token overlap between two sets using Jaccard similarity."""
    if not a or not b:
        return 0.0
    union = a.union(b)
    if not union:
        return 0.0
    return len(a.intersection(b)) / len(union)


def classify_relation(mode: str, current: Block, source: Block) -> tuple[str, float, str] | None:
    """Classify the semantic relation between current and source blocks for a mode."""
    current_tokens = tokenize(current.text)
    source_tokens = tokenize(source.text)
    overlap = jaccard(current_tokens, source_tokens)
    if overlap < 0.12:
        return None

    sentiment_gap = abs(current.sentiment_score - source.sentiment_score)
    opposite_direction = current.sentiment_score * source.sentiment_score < 0

    if mode == Mode.JOURNAL:
        if overlap > 0.22 and opposite_direction and sentiment_gap > 0.2:
            return (
                InsightRelationType.CONTRADICTION,
                overlap + sentiment_gap,
                "You expressed an opposite emotional direction on a similar topic before.",
            )
        if overlap > 0.25:
            return (
                InsightRelationType.REPETITION,
                overlap,
                "This theme appears similar to a prior journal reflection.",
            )
        if sentiment_gap > 0.3:
            return (
                InsightRelationType.EMOTIONAL_PATTERN,
                sentiment_gap,
                "Your emotional tone differs meaningfully from a past entry.",
            )
        return None

    prerequisite_terms = {"basics", "foundation", "intro", "introduction", "fundamental"}
    if overlap > 0.22:
        return (
            InsightRelationType.CONCEPTUAL_OVERLAP,
            overlap,
            "This concept overlaps with something you already wrote about.",
        )
    if tokenize(source.text).intersection(prerequisite_terms):
        return (
            InsightRelationType.PREREQUISITE_LINK,
            0.15 + overlap,
            "A prior foundational note may help with this concept.",
        )
    return None


def generate_insights_for_session(session: WritingSession) -> list[Insight]:
    """Regenerate top insight candidates for a writing session from local blocks."""
    if not session.document:
        return []

    session.insights.all().delete()

    current_blocks: QuerySet[Block] = Block.objects.filter(document=session.document).order_by("order_index")
    candidate_blocks: QuerySet[Block] = (
        Block.objects.filter(user=session.user, space=session.space)
        .exclude(document=session.document)
        .order_by("-created_at")[:300]
    )

    insights: list[Insight] = []
    for current_block in current_blocks:
        best_for_current: list[tuple[float, Block, str, str]] = []
        for source_block in candidate_blocks:
            classified = classify_relation(session.mode, current_block, source_block)
            if not classified:
                continue
            relation_type, score, reason = classified
            best_for_current.append((score, source_block, relation_type, reason))

        best_for_current.sort(key=lambda item: item[0], reverse=True)
        for score, source_block, relation_type, reason in best_for_current[:2]:
            insight = Insight.objects.create(
                session=session,
                current_block=current_block,
                source_block=source_block,
                relation_type=relation_type,
                reason_text=reason,
                score=round(score, 4),
            )
            insights.append(insight)

    return insights


def _average_sentiment(blocks: Iterable[Block]) -> float:
    """Calculate average block sentiment with safe empty fallback."""
    blocks_list = list(blocks)
    if not blocks_list:
        return 0.0
    return sum(block.sentiment_score for block in blocks_list) / len(blocks_list)


def update_journal_post_session_state(user: User, session: WritingSession) -> StreakState:
    """Update streak state and sentiment snapshot after a journal session finalizes."""
    today = timezone.now().date()
    streak, _ = StreakState.objects.get_or_create(user=user)

    if streak.last_entry_date == today:
        pass
    elif streak.last_entry_date == today - timedelta(days=1):
        streak.current_streak += 1
    else:
        streak.current_streak = 1

    streak.longest_streak = max(streak.longest_streak, streak.current_streak)
    streak.last_entry_date = today
    streak.save()

    if session.document:
        blocks = session.document.blocks.all()
        if blocks.exists():
            avg = _average_sentiment(blocks)
            SentimentSnapshot.objects.create(
                user=user,
                space=session.space,
                document=session.document,
                session=session,
                score=round(avg, 4),
            )

    return streak
