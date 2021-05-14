from django.urls import path, re_path
from django.conf.urls import url
from . import views

urlpatterns = [
    path('api/user/', views.UserListCreate.as_view() ),
    url(r'^login', views.connection, name='login'),
    url(r'^deconnect', views.deconnection, name='deconnection'),
]