from django.shortcuts import render, redirect
from .serializers import UserSerializer
from rest_framework import generics
from .forms import ConnexionForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import logout
from .forms import ConnexionForm
from frontend.views import index

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

"""
    This function handle connection and registration forms
    If the request method is POST (so the form return), it try to authenticate the user and if it works redirect to the home.

    Args:
        request: object containing view information (GET, POST, temp variables, etc).

    Returns:
        render: with local variables and a link to the template
        or
        redirection to home page
"""
def handler_connect_registration_forms(request):
    error = False
    # get the post request of the connexion
    if request.method == "POST":
        if "connect" in request.POST:
            # get the user form in the post request
            form_connect = ConnexionForm(request.POST)
            if form_connect.is_valid():
                username = form_connect.cleaned_data["username"]
                password = form_connect.cleaned_data["password"]
                user = authenticate(username=username, password=password)  # are the information correct?
                if user:  # if the object isnt None
                    login(request, user)  # we need to connect the user
                    return redirect(index) # redirect to index in frontend view
                else:  # otherwise display an error
                    error_connexion = True
        if "register" in request.POST:
            # get the user form in the post request
            form_register = UserCreationForm(request.POST)
            if form_register.is_valid():
                form_register.save()
                username = form_register.cleaned_data.get('username')
                raw_password = form_register.cleaned_data.get('password1')
                user = authenticate(username=username, password=raw_password)
                login(request, user)
                if user:  # if the object isnt None
                    login(request, user)  # we need to connect the user
                    return redirect(index)  # redirect to index in frontend view
                else:  # otherwise display an error
                    error_signup = True
    else:
        form_connect = ConnexionForm()
        form_register = UserCreationForm()
    return render(request, 'frontend/login.html', locals())

def disconnect_user(request):
    logout(request)
    return redirect("/login/?next=/")
