"""DRF serializers for Project Mars API contracts."""

from __future__ import annotations

from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Document, Insight, InsightEventType, Mode, Space, WritingSession


class SpaceSerializer(serializers.ModelSerializer):
    """Serializes space objects for API responses."""

    class Meta:
        model = Space
        fields = ["id", "name"]


class DocumentSerializer(serializers.ModelSerializer):
    """Serializes persisted document metadata."""

    class Meta:
        model = Document
        fields = ["id", "title", "mode", "space_id", "updated_at"]


class WritingSessionSerializer(serializers.ModelSerializer):
    """Serializes writing session state for client coordination."""

    class Meta:
        model = WritingSession
        fields = ["id", "space_id", "document_id", "mode", "is_active", "started_at", "ended_at"]


class BootstrapSerializer(serializers.Serializer):
    """Top-level bootstrap response payload for initial client hydration."""

    user = serializers.DictField()
    default_space = SpaceSerializer()
    spaces = SpaceSerializer(many=True)
    documents = DocumentSerializer(many=True)


class CreateSpaceSerializer(serializers.Serializer):
    """Validates create-space requests."""

    user_id = serializers.IntegerField(required=False)
    name = serializers.CharField(max_length=120)


class CreateDocumentSerializer(serializers.Serializer):
    """Validates create-document requests."""

    user_id = serializers.IntegerField(required=False)
    space_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255, required=False, allow_blank=True)
    mode = serializers.ChoiceField(choices=[Mode.JOURNAL, Mode.LEARNING], required=False)


class CreateSessionSerializer(serializers.Serializer):
    """Validates create-session requests."""

    user_id = serializers.IntegerField(required=False)
    space_id = serializers.IntegerField()
    document_id = serializers.IntegerField(required=False, allow_null=True)
    mode = serializers.ChoiceField(choices=[Mode.JOURNAL, Mode.LEARNING])


class SaveBlocksSerializer(serializers.Serializer):
    """Validates block sync payloads for a document session."""

    session_id = serializers.IntegerField()
    text = serializers.CharField(required=False, allow_blank=True, default="")
    finalize = serializers.BooleanField(required=False, default=False)


class InsightSerializer(serializers.ModelSerializer):
    """Serializes computed insights with source/current excerpts for display."""

    source_text = serializers.SerializerMethodField()
    current_text = serializers.SerializerMethodField()

    class Meta:
        model = Insight
        fields = [
            "id",
            "relation_type",
            "reason_text",
            "score",
            "source_text",
            "current_text",
            "created_at",
        ]

    def get_source_text(self, obj: Insight) -> str:
        return obj.source_block.text[:260] if obj.source_block else ""

    def get_current_text(self, obj: Insight) -> str:
        return obj.current_block.text[:260] if obj.current_block else ""


class CreateInsightEventSerializer(serializers.Serializer):
    """Validates insight event tracking requests."""

    event_type = serializers.ChoiceField(
        choices=[
            InsightEventType.INSIGHT_SHOWN,
            InsightEventType.INSIGHT_OPENED,
            InsightEventType.INSIGHT_DISMISSED,
            InsightEventType.INSIGHT_MARKED_USEFUL,
        ]
    )
    session_id = serializers.IntegerField(required=False, allow_null=True)
    metadata = serializers.DictField(required=False, default=dict)


class UserSummarySerializer(serializers.ModelSerializer):
    """Serializes minimal user identity for bootstrap payloads."""

    class Meta:
        model = User
        fields = ["id", "username"]
