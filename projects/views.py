from rest_framework import generics
from django.contrib.auth.models import User

from .models import Project
from .serializers import ProjectSerializer


from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status

class ProjectListCreate(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


"""
    API request DEL at 'api/project/delproj'
    Aim to add del project
    Return:
        Response:
            - 202 if proj deleted
            - 404 if project doesn't exist
"""


@api_view(['POST'])
def delete_project_by_name(request):
    if request.method == 'POST':
        if 'name' not in request.data:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        project_name = request.data['name'] # TODO: check if exist it list, return HTTP 404 otherwise
        try:
            Project.objects.filter(name=project_name).delete()
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_202_ACCEPTED)


"""
    API request PUT at 'api/project/adduser'
    Aim to add a user to a project if: user exist, project exist, user not already in project
    
    Return:
        Response:
            - 202 if user added
            - 406 if user already in project
            - 404 if user or project doesn't exist
"""

@api_view(['PUT'])
def add_user_to_project(request):
    if request.method == 'PUT':
        if 'username' not in request.data:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        username = request.data['username']
        if 'project_name' not in request.data:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        project_name = request.data['project_name']
        print("wtf", project_name, username)
        print(Project.objects.all())
        try:
            project = Project.objects.get(name=project_name)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if check_and_update_project_users_adding(project, user):
            return Response(status=status.HTTP_202_ACCEPTED)
        else:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


"""
    API request PUT at 'api/project/deluser'
    Aim to del a user from a project if: user exist, project exist, user already in project

    Return:
        Response:
            - 202 if user deleted
            - 406 if user not in project
            - 404 if user or project doesn't exist
"""
@api_view(['POST']) # with DEL request it seems that the data is not in request.DATA
def del_user_from_project(request):
    if request.method == 'POST':
        if 'username' not in request.data:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        username = request.data['username']
        if 'project_name' not in request.data:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        project_name = request.data['project_name'] ## HERE
        try:
            project = Project.objects.get(name=project_name)
        except Project.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if check_and_update_project_users_delete(project, user):
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
        else:
            return Response(status=status.HTTP_202_ACCEPTED)

"""
    Convert string "<id>:<username>;..." to {id1: username1, ...}
    
    This function can cause multiple problem (if username contain : or ;, can be changed by other characters or
    multiple charcaters but it still not the best solution. Need to check everything (number of members in the split, etc.)
    
    Using this double key with id and username is to have another control than just using a list of id
    
    Arg:
        user_string: string containing users contained in the project
    
    Return:
        user_dict: users stored in a dictionary
"""
def from_string_to_dict(user_string):
    user_dict = {}
    for user in user_string.split(";"):
        splitted_user = user.split(":")
        if len(splitted_user) == 2:
            user_dict[int(splitted_user[0])]= splitted_user[1]
    return user_dict


"""
    Convert string "<id>:<username>;..." to {id1: username1, ...}

    This function can cause multiple problem (if username contain : or ;, can be changed by other characters or
    multiple charcaters but it still not the best solution. Need to check everything (number of members in the split, etc.)

    Using this double key with id and username is to have another control than just using a list of id
    
    Arg:
        user_dict: users stored in a dictionary
    
    Return:
        user_string: string containing users contained in the project
"""


def from_dict_to_string(user_dict):
    user_strings = []
    for user_id_key in user_dict:
        user_strings.append(str(user_id_key) + ":" + user_dict[user_id_key])
    return ';'.join(user_strings)


"""
    Check if user in dict, return False if not
    
    Arg:
        user_dict_proj: users stored in a dictionary
        user_to_find: user to find

"""
def check_if_user_in_dict(user_dict_proj, user_to_find):
    if not user_dict_proj:
        return False
    if user_to_find.id in user_dict_proj:
        if user_dict_proj[user_to_find.id] == user_to_find.username:
            return True
        return  False
    return False

"""
    Add an user to the list
    Arg:
        user_dict_proj: users stored in a dictionary
        user: user to add
    
    Return:
        user_dict_proj: users stored in a dictionary (updated)
"""
def add_user_to_list(user_list_proj, user):
    user_list_proj[user.id] = user.username
    return user_list_proj


"""
    Add an user to the list
    Arg:
        user_dict_proj: users stored in a dictionary
        user: user to del

    Return:
        user_dict_proj: users stored in a dictionary (updated)
"""
def del_user_from_dict(user_list_proj, user):
    user_list_proj.pop(user.id, None)
    return user_list_proj


"""
    handle check of project users and its update (adding user)
    Arg:
        project: project to update
        user: user to add to the project

    Return:
        Boolean: True if the user is added to project, False otherwise
"""
def check_and_update_project_users_adding(project, user):
    user_list_proj = from_string_to_dict(project.associated_users)
    if check_if_user_in_dict(user_list_proj, user):
        return False
    else:
        updated_list_proj = add_user_to_list(user_list_proj, user)
        project.associated_users = from_dict_to_string(updated_list_proj)
        project.save()
        return True


"""
    handle check of project users and its update (delete user)
    Arg:
        project: project to update
        user: user to delete from the project

    Return:
        Boolean: True if the user is deleted from project, False otherwise
"""
def check_and_update_project_users_delete(project, user):
    user_list_proj = from_string_to_dict(project.associated_users)
    if check_if_user_in_dict(user_list_proj, user):
        project.associated_users = from_dict_to_string(del_user_from_dict(user_list_proj, user))
        project.save()
        return False
    else:
        return True