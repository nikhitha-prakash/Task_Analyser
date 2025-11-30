from django.urls import path
from .views import analyze_tasks, suggest_tasks, index_view

urlpatterns = [
    path('', index_view, name='home'),
    path('api/tasks/analyze/', analyze_tasks, name='analyze'),
    path('api/tasks/suggest/', suggest_tasks, name='suggest'),
]