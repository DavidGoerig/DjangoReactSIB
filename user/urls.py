from django.urls import path
from . import views

urlpatterns = [
    path('api/user/', views.UserListCreate.as_view() ),
    path('api/user/current', views.get_current_user ),
]