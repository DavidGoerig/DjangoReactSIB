from django.db import models
"""
 I didn't achieved entirely the "vertical" implementation of User since I'm using the Django model. i'm using my own serializer, requests, etc
 but to make an example of login / disconnect and to look more like an application I used the model instead of creating it.
 
 Here is the model to use in a vertical implementation
 
 class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
"""