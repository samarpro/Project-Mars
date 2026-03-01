from django.urls import path

from . import views

urlpatterns = [
    path("health", views.health, name="health"),
    path("bootstrap", views.bootstrap, name="bootstrap"),
    path("spaces", views.spaces_view, name="spaces"),
    path("documents", views.documents_view, name="documents"),
    path("sessions", views.sessions_view, name="sessions"),
    path("sessions/<int:session_id>/complete", views.complete_session, name="complete-session"),
    path("documents/<int:document_id>/blocks", views.document_blocks, name="document-blocks"),
    path("insights", views.insights_view, name="insights"),
    path("insights/<int:insight_id>/events", views.insight_event, name="insight-events"),
]
