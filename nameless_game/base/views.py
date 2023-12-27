from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from .models import Character, Mob

# Create your views here.
def index(request):
    c = {}
    return render(request, "base/index.html", c)

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