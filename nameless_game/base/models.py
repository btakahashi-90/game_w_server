from django.db import models

# Create your models here.
class Character(models.Model):
    name = models.CharField(max_length=50)
    # stats/hp/mp
    # damage (base) - may not be necesary? Damage could be solely based on weapon/skill
    # skills/spells
    # equipment (relation)

    def __str__(self):
        return self.name
    
    def stats(self):
        return "Stats are not implemented yet for Character"

class Mob(models.Model):
    name = models.CharField(max_length=50)
    hp = models.IntegerField(default=1)
    damage = models.IntegerField(default=1)
    damage_mod = models.IntegerField(default=0) # inteded to be a raw addetitive modifier based on mobs "weapon"
    # mp = models.IntegerField(default=0) # mobs may not necessarily have MP
    # rarity?
    # TYPE?!?

    def __str__(self):
        return self.name
    
    def stats(self):
        return ({"hp": self.hp}) # return stats as a dictionary
    
# class Skill(models.Model):
#     # should spells be separate?
#     name = models.CharField(max_length=50)
#     description = models.CharField(max_length=250) # Keep em short if possible
#     damage = models.IntegerField(default=0) # Why? Because we can have status effect skills