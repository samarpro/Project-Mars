from django.conf import settings
from django.db import models


class Mode(models.TextChoices):
    JOURNAL = "JOURNAL", "Journal"
    LEARNING = "LEARNING", "Learning"


class InsightRelationType(models.TextChoices):
    CONTRADICTION = "CONTRADICTION", "Contradiction"
    REPETITION = "REPETITION", "Repetition"
    EMOTIONAL_PATTERN = "EMOTIONAL_PATTERN", "Emotional Pattern"
    CONCEPTUAL_OVERLAP = "CONCEPTUAL_OVERLAP", "Conceptual Overlap"
    PREREQUISITE_LINK = "PREREQUISITE_LINK", "Prerequisite Link"


class InsightEventType(models.TextChoices):
    INSIGHT_SHOWN = "INSIGHT_SHOWN", "Insight Shown"
    INSIGHT_OPENED = "INSIGHT_OPENED", "Insight Opened"
    INSIGHT_DISMISSED = "INSIGHT_DISMISSED", "Insight Dismissed"
    INSIGHT_MARKED_USEFUL = "INSIGHT_MARKED_USEFUL", "Insight Marked Useful"


class Space(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="spaces")
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.user_id}:{self.name}"


class Document(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="documents")
    space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="documents")
    title = models.CharField(max_length=255)
    mode = models.CharField(max_length=20, choices=Mode.choices)
    content = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self) -> str:
        return self.title


class Block(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="blocks")
    space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="blocks")
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="blocks")
    order_index = models.PositiveIntegerField()
    text = models.TextField()
    sentiment_score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["document_id", "order_index"]


class WritingSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sessions")
    space = models.ForeignKey(Space, on_delete=models.CASCADE, related_name="sessions")
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True, related_name="sessions")
    mode = models.CharField(max_length=20, choices=Mode.choices)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["-started_at"]


class Insight(models.Model):
    session = models.ForeignKey(WritingSession, on_delete=models.CASCADE, related_name="insights")
    current_block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, blank=True, related_name="insight_targets")
    source_block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True, blank=True, related_name="insight_sources")
    relation_type = models.CharField(max_length=40, choices=InsightRelationType.choices)
    reason_text = models.TextField()
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-score", "-created_at"]


class InsightEvent(models.Model):
    insight = models.ForeignKey(Insight, on_delete=models.CASCADE, related_name="events")
    session = models.ForeignKey(WritingSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="insight_events")
    event_type = models.CharField(max_length=32, choices=InsightEventType.choices)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class SentimentSnapshot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sentiment_snapshots")
    space = models.ForeignKey(Space, on_delete=models.SET_NULL, null=True, blank=True, related_name="sentiment_snapshots")
    document = models.ForeignKey(Document, on_delete=models.SET_NULL, null=True, blank=True, related_name="sentiment_snapshots")
    session = models.ForeignKey(WritingSession, on_delete=models.SET_NULL, null=True, blank=True, related_name="sentiment_snapshots")
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class StreakState(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="streak_state")
    current_streak = models.PositiveIntegerField(default=0)
    longest_streak = models.PositiveIntegerField(default=0)
    last_entry_date = models.DateField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"user={self.user_id} current={self.current_streak}"
