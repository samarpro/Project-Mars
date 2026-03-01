"""DRF API views for Project Mars backend endpoints."""

from __future__ import annotations

from typing import Any

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Block, Document, Insight, InsightEvent, Mode, Space, WritingSession
from .serializers import (
    CreateDocumentSerializer,
    CreateInsightEventSerializer,
    CreateSessionSerializer,
    CreateSpaceSerializer,
    DocumentSerializer,
    InsightSerializer,
    SaveBlocksSerializer,
    SpaceSerializer,
    UserSummarySerializer,
    WritingSessionSerializer,
)
from .services import generate_insights_for_session, segment_blocks, sentiment_score, update_journal_post_session_state


def _demo_user() -> User:
    """Return the default local demo user, creating it when absent."""
    user, _ = User.objects.get_or_create(username="demo", defaults={"email": "demo@projectmars.local"})
    if not user.first_name:
        user.first_name = "Demo"
        user.save(update_fields=["first_name"])
    return user


def _resolve_user(payload: dict[str, Any]) -> User:
    """Resolve request user from payload `user_id` with demo fallback."""
    user_id = payload.get("user_id")
    if user_id:
        return get_object_or_404(User, id=user_id)
    return _demo_user()


def _ensure_default_space(user: User) -> Space:
    """Ensure the personal default space exists for the given user."""
    space, _ = Space.objects.get_or_create(user=user, name="Personal")
    return space


@api_view(["GET"])
def health(_: Request) -> Response:
    """Health endpoint used by clients to verify API availability."""
    return Response({"status": "ok", "service": "project-mars-api"})


@api_view(["GET"])
def bootstrap(_: Request) -> Response:
    """Return bootstrap data required to initialize the frontend workspace."""
    user = _demo_user()
    default_space = _ensure_default_space(user)
    spaces = Space.objects.filter(user=user)
    documents = Document.objects.filter(user=user, space=default_space)[:10]

    payload = {
        "user": UserSummarySerializer(user).data,
        "default_space": SpaceSerializer(default_space).data,
        "spaces": SpaceSerializer(spaces, many=True).data,
        "documents": DocumentSerializer(documents, many=True).data,
    }
    return Response(payload)


@api_view(["GET", "POST"])
def spaces_view(request: Request) -> Response:
    """List or create spaces for a resolved user identity."""
    if request.method == "GET":
        user_id = request.query_params.get("user_id")
        if user_id and not user_id.isdigit():
            return Response({"error": "user_id must be an integer"}, status=status.HTTP_400_BAD_REQUEST)
        payload: dict[str, Any] = {"user_id": int(user_id)} if user_id else {}
        user = _resolve_user(payload)
        spaces = Space.objects.filter(user=user)
        return Response({"spaces": SpaceSerializer(spaces, many=True).data})

    serializer = CreateSpaceSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    user = _resolve_user(serializer.validated_data)
    name = serializer.validated_data["name"].strip()
    space, _ = Space.objects.get_or_create(user=user, name=name)
    return Response({"space": SpaceSerializer(space).data}, status=status.HTTP_201_CREATED)


@api_view(["GET", "POST"])
def documents_view(request: Request) -> Response:
    """List documents in a space or create a new mode-scoped document."""
    if request.method == "GET":
        space_id = request.query_params.get("space_id")
        if not space_id:
            return Response({"error": "space_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        docs = Document.objects.filter(space_id=space_id)
        return Response({"documents": DocumentSerializer(docs, many=True).data})

    serializer = CreateDocumentSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    payload = serializer.validated_data
    user = _resolve_user(payload)
    space = get_object_or_404(Space, id=payload["space_id"], user=user)

    doc = Document.objects.create(
        user=user,
        space=space,
        title=(payload.get("title") or "Untitled").strip() or "Untitled",
        mode=payload.get("mode") or Mode.JOURNAL,
    )
    return Response({"document": DocumentSerializer(doc).data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def sessions_view(request: Request) -> Response:
    """Create a writing session bound to mode, space, and optional document."""
    serializer = CreateSessionSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    payload = serializer.validated_data
    user = _resolve_user(payload)
    space = get_object_or_404(Space, id=payload["space_id"], user=user)

    document = None
    document_id = payload.get("document_id")
    if document_id:
        document = get_object_or_404(Document, id=document_id, user=user, space=space)

    session = WritingSession.objects.create(user=user, space=space, document=document, mode=payload["mode"])
    return Response({"session": WritingSessionSerializer(session).data}, status=status.HTTP_201_CREATED)


@api_view(["POST"])
def complete_session(request: Request, session_id: int) -> Response:
    """Finalize a writing session and generate mode-aware insights."""
    del request
    session = get_object_or_404(WritingSession, id=session_id)

    if session.is_active:
        session.is_active = False
        session.ended_at = timezone.now()
        session.save(update_fields=["is_active", "ended_at"])

    if session.mode == Mode.JOURNAL:
        update_journal_post_session_state(session.user, session)

    insights = generate_insights_for_session(session)
    return Response({"session": WritingSessionSerializer(session).data, "insight_count": len(insights)})


@api_view(["POST"])
def document_blocks(request: Request, document_id: int) -> Response:
    """Persist segmented document blocks and trigger insight generation when allowed."""
    serializer = SaveBlocksSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    session = get_object_or_404(WritingSession, id=payload["session_id"], document_id=document_id)

    document = session.document
    if not document:
        return Response({"error": "session has no document"}, status=status.HTTP_400_BAD_REQUEST)

    text = payload.get("text", "").strip()
    finalize = payload.get("finalize", False)

    document.content = text
    document.save(update_fields=["content", "updated_at"])

    Block.objects.filter(document=document).delete()
    parts = segment_blocks(text)

    new_blocks: list[Block] = []
    for idx, part in enumerate(parts):
        block = Block.objects.create(
            user=session.user,
            space=session.space,
            document=document,
            order_index=idx,
            text=part,
            sentiment_score=round(sentiment_score(part), 4),
        )
        new_blocks.append(block)

    insights: list[Insight] = []
    if session.mode == Mode.LEARNING or finalize:
        insights = generate_insights_for_session(session)

    if finalize and session.is_active:
        session.is_active = False
        session.ended_at = timezone.now()
        session.save(update_fields=["is_active", "ended_at"])
        if session.mode == Mode.JOURNAL:
            update_journal_post_session_state(session.user, session)

    return Response(
        {
            "document_id": document.id,
            "block_count": len(new_blocks),
            "insight_count": len(insights),
            "session": WritingSessionSerializer(session).data,
        }
    )


@api_view(["GET"])
def insights_view(request: Request) -> Response:
    """Return generated insights for a writing session in descending score order."""
    session_id = request.query_params.get("session_id")
    if not session_id:
        return Response({"error": "session_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    insights = Insight.objects.filter(session_id=session_id).select_related("source_block", "current_block")
    return Response({"insights": InsightSerializer(insights, many=True).data})


@api_view(["POST"])
def insight_event(request: Request, insight_id: int) -> Response:
    """Record user interaction events for an insight lifecycle."""
    serializer = CreateInsightEventSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    payload = serializer.validated_data

    insight = get_object_or_404(Insight, id=insight_id)
    session = None
    session_id = payload.get("session_id")
    if session_id:
        session = WritingSession.objects.filter(id=session_id).first()

    event = InsightEvent.objects.create(
        insight=insight,
        session=session,
        event_type=payload["event_type"],
        metadata=payload.get("metadata") or {},
    )
    return Response({"event_id": event.id, "created_at": event.created_at.isoformat()}, status=status.HTTP_201_CREATED)
