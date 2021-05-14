from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from user import views

@login_required
def index(request):
    return render(request, 'frontend/index.html')

def connection(request):
    return views.handler_connect_registration_forms(request)
"""
            This function is used to disconnect the user

            Args:
                request: object containing view information (GET, POST, temp variables, etc).

            Returns:
                redirection to connection page
"""

def disconnection(request):
    return views.disconnect_user(request)