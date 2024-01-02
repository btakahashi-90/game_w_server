from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse
from django.core.exceptions import MultipleObjectsReturned
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
    # for now, on page load we're going to send mobs in via context
    # otherwise we have to keep mobs and mob data directly in the js, and that defeats the purpose of the project...
    mobs_data = Mob.objects.all()
    mobs = {}
    for mob in mobs_data:
        mobs[mob.name] = mob.stats()
    c["mobs"] = mobs
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

def mob_edit(request, mob_id):
    c = {}
    if request.method == "POST":
        # Save the mob data back to the server
        # Get POST values
        # There's got to be a better way to do this...
        # Duplicating effors to ensure name is not "null"/empty string
        if request.POST['name'] != '':
            proceed = True
            if mob_id != 'new':
                mob = get_object_or_404(Mob, id=mob_id) # yes...we 404. Someone somehow is trying to modify a non-existent entry
            else:
                # Here we create a new mob instance IF a mob with the same name doesn't exist...
                mob = Mob.objects.filter(name=request.POST['name']).exists()
                if not mob:
                    mob = Mob()
                else:
                    proceed = False
                    c['message'] = "Mob with this name already exists. Form reset, please use a unique name."
            if proceed:
                stats = {}
                # we already KNOW name isn't blank, so...just leave it be
                stats["name"] = request.POST['name']
                if request.POST['hp'] != '':
                    stats["hp"] = request.POST['hp']
                else:
                    stats["hp"] = 1
                if request.POST['damage'] != '':
                    stats["damage"] = request.POST['damage']
                else:
                    stats["damage"] = 1
                if request.POST['dmod'] != '':
                    stats["dmod"] = request.POST['dmod']
                else:
                    stats["dmod"] = 0
                if request.POST['dr'] != '':
                    stats["dr"] = request.POST['dr']
                else:
                    stats["dr"] = 0
                update_mob(mob, stats)
                mob_id = mob.id

    if mob_id != 'new':
            c["mob"] = get_object_or_404(Mob, id=mob_id)
    else:
        c["mob"] = {"name": 'new', "id": 'new'}

    
    return render(request, "base/mob_edit.html", c)

def update_mob(mob, stats):
    mob.name = stats['name']
    mob.hp = stats["hp"]
    mob.damage = stats["damage"]
    mob.damage_mod = stats["dmod"]
    mob.damage_reduction = stats["dr"]
    mob.save()