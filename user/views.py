from django.shortcuts import render, redirect

from .serializers import UserSerializer, CurrentUserSerializer
from .forms import ConnexionForm, UserForm

from assessment import const

from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.middleware.csrf import get_token

from frontend.views import index

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response

"""
    User list creation API route
    Inherit:
        ListCreateAPIView: Used for read-write endpoints to represent a collection of model
        instances.Provides get and post method handlers.
    Returns:
        UserSerializer (id, first_Name, last_name, email, password, username)
"""
class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

"""
    current user get API route
    Returns:
        Response (JSON): the current user if it exist, the object filled with "Not defined now" otherwise
"""
@api_view(['GET'])
def get_current_user(request):
    # a boolean to check if ser exist to cm
    user_exist = True
    try:
        user = request.user
    except UserProfile.DoesNotExist:
        user_exist = False
    # Return NULL or Anonymous user
    if not user_exist or request.user.is_anonymous:
        return Response({
            'username': "Not defined now",
            'first_name': "Not defined now",
            'last_name': "Not defined now",
            'email': "Not defined now"
        })
    # Return founded user
    return Response({
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email
    })


"""
    This function handle connection and registration forms requests
    If the request method is POST (so the form return), it try to authenticate the user and if it works redirect to the home.

    Args:
        request: object containing view information (GET, POST, temp variables, etc).

    Returns:
        render: with local variables and a link to the template
        or
        redirection to home page
"""
def handler_connect_registration_forms(request):
    form_connect = ConnexionForm()
    form_register = UserForm()
    # get the post request of the connexion
    if request.method == "POST":
        if "connect" in request.POST:
            form_connect, error = connect_user_with_forms(request, form_connect)
            if error is None:
                return redirect(index)  # redirect to index in frontend view
        if "register" in request.POST:
            form_register, error = register_user_with_forms(request, form_register)
            if error is None:
                return redirect(index)  # redirect to index in frontend view
    return render(request, 'frontend/login.html', locals())

"""
    This function handle the user connection using the connection form
    Args:
        form_connect: connection form (user/forms.py: ConnexionForm)

    Returns:
        form_connect: updated form
        error: error message to display
"""
def connect_user_with_forms(request, form_connect):
    error = None
    # get the user connection form in the post request
    form_connect = ConnexionForm(request.POST)
    if form_connect.is_valid():
        username = form_connect.cleaned_data["username"]
        password = form_connect.cleaned_data["password"]
        user = authenticate(username=username, password=password)  # are the information correct?
        if user:  # if the object isnt None
            login(request, user)  # we need to connect the user
        else:  # otherwise display an error
            error = const.ERROR_CONNECTION
    return form_connect, error

"""
    This function handle the user registration using the registration form
    Args:
        form_register: connection form (UserForm())

    Returns:
        form_register: updated form
        error: error message to display
"""
def register_user_with_forms(request, form_register):
    error = None
    # get the user registration form in the post request
    form_register = UserForm(request.POST)
    if form_register.is_valid():
        form_register.save()
        username = form_register.cleaned_data.get('username')
        raw_password = form_register.cleaned_data.get('password1')
        user = authenticate(username=username, password=raw_password)
        if user:  # if the object isnt None
            login(request, user)  # we need to connect the user
        else:  # otherwise display an error
            error = const.ERROR_REGISTRATION
    return form_register, error

"""
    This function handle the user disconnection
    Returns:
        redirect: to login next
"""
def disconnect_user(request):
    logout(request)
    return redirect("/login/?next=/")
