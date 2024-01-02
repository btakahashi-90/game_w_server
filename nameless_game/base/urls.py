from django.urls import path, re_path

from . import views

app_name = "base"
urlpatterns = [
    path("", views.index, name="index"),
    path("play/", views.game, name="game"),
    # CHARACTER URLS
    path("characters/", views.characters, name="characters"),
    path("characters/<int:character_id>/", views.detail_character, name="detail character"),
    # MOB URLS
    path("mobs/", views.mobs, name ="mobs"),
    path("mobs/<int:mob_id>/", views.detail_mob, name="detail mob"),
    re_path("mobs/edit/(?P<mob_id>\w+)/", views.mob_edit, name="mob edit"),
]