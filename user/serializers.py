from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.fields import CurrentUserDefault
from rest_framework.views import APIView

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name', 'last_name', 'email', 'password', 'username')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class CurrentUserSerializer(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)