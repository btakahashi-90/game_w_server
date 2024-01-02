from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Character, Mob
import json
from django.core.serializers import serialize

# Create your views here.
def index(request):
    c = {}
    return render(request, "base/index.html", c)

# Game, might be better to port to a separate views file
def game(request):
    c = {}
    # This might cause problems in the future, but I don't think so
    # for now, on page load we're going to send in mobs in via context
    # otherwise we have to keep mobs and mob data in the js, and that defeats the purpose of the project...
    mobs_data = Mob.objects.all() # Yup...we do this in the "mobs" function, however we don't want to return a render here so we do it again
    serialized_mobs = serialize("json", mobs_data)
    serialized_mobs = json.loads(serialized_mobs)
    c["mobs"] = serialized_mobs
    return render(request, "base/game.html", c)

# CHARACTER VIEWS
def characters(request):
    c = {}
    c["characters"] = Character.objects.all() # This should be changed to filter to exclude deleted/dead/unused if desired later
    return render(request, "base/characters.html", c)

def detail_character(request, character_id):
    c = {}
    c["character"] = get_object_or_404(Character, id=character_id)
    return render(request, "base/character_detail.html", c)
    
# MOB VIEWS
def mobs(request):
    c = {}
    c["mobs"] = Mob.objects.all() # This should be changed to filter to exclude deleted if desired later
    return render(request, "base/mobs.html", c)

def detail_mob(request, mob_id):
    c = {}
    c["mob"] = get_object_or_404(Mob, id=mob_id)
    return render(request, "base/mob_detail.html", c)