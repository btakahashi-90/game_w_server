from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('mobs/', views.mobs, name='mobs'),
    path('addtodo/', views.add_todo, name='add todo'),
    path('updatetodo/', views.update_todo, name='update todo'),
]