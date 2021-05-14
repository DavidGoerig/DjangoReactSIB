from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('', views.index ),
    url(r'^login', views.connection, name='login'),
    url(r'^disconnect', views.disconnection, name='disconnection'),
]