from django import forms

"""
    All class for creating ORM's forms.

    class Meta define:
        which model is used
        which fields are used
        
        here the field are setted more precisely (Django documentation)
"""

class ConnexionForm(forms.Form):
    username = forms.CharField(label="Username", max_length=30)
    password = forms.CharField(label="Password", widget=forms.PasswordInput)