from rest_framework.decorators import api_view
from rest_framework.response import Response
from base.models import Mob
from todo.models import Todo

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, World'})

@api_view(['GET'])
def mobs(request):
    mob_data = Mob.objects.all()
    mob_list = []
    for mob in mob_data:
        mob_list.append(mob.stats())

    r = {
        'message': 'a list of mobs?',
        'mobs': mob_list
    }
    return Response(r)

@api_view(['POST'])
def add_todo(request):
    new_todo = Todo()
    new_todo.title = request.data['title']
    new_todo.description = request.data['description']
    new_todo.save()
    return Response({'message': 'OK'})

@api_view(['POST'])
def update_todo(request):
    # This needs a "safety", use try/except with Django DNE exception (https://docs.djangoproject.com/en/5.0/ref/exceptions/)
    todo = Todo.objects.get(id=request.data['id'])
    todo.title = request.data['title']
    todo.description = request.data['description']
    todo.save()
    # Could definitely use a better message...
    return Response({'message': 'Updated: ' + todo.title + ' : ' + todo.description})