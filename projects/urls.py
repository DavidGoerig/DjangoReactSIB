from django.urls import path

from . import views

urlpatterns = [
    path('api/project/', views.ProjectListCreate.as_view()),
]
