from django.contrib import admin

from .models import Block, Document, Insight, InsightEvent, SentimentSnapshot, Space, StreakState, WritingSession


admin.site.register(Space)
admin.site.register(Document)
admin.site.register(Block)
admin.site.register(WritingSession)
admin.site.register(Insight)
admin.site.register(InsightEvent)
admin.site.register(SentimentSnapshot)
admin.site.register(StreakState)
