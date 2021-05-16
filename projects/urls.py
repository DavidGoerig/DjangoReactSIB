from django.urls import path

from . import views

urlpatterns = [
    path('api/project/', views.ProjectListCreate.as_view()),
    path('api/project/adduser', views.add_user_to_project ),
    path('api/project/deluser', views.del_user_from_project ),
    path('api/project/delproj', views.delete_project_by_name ),
]
