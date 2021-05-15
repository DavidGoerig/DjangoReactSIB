from django import forms

from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

"""
    Connexion form
"""

class ConnexionForm(forms.Form):
    username = forms.CharField(label="Username", max_length=30)
    password = forms.CharField(label="Password", widget=forms.PasswordInput)

"""
    User registration form, inherited from UserCreationFormConnexion form
"""

class UserForm(UserCreationForm):
    first_name = forms.CharField()
    last_name = forms.CharField()
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('first_name','last_name', 'username', 'email', 'password1' ,'password2' )
