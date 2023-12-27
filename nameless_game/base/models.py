from django.db import models

# Create your models here.
class Character(models.Model):
    name = models.CharField(max_length=50)
    # stats/hp/mp
    # equipment (relation)

    def __str__(self):
        return self.name
    
    def stats(self):
        return "Stats are not implemented yet for Character"

class Mob(models.Model):
    name = models.CharField(max_length=50)
    hp = models.IntegerField(default=1)
    # mp = models.IntegerField(default=0) # mobs may not necessarily have MP

    def __str__(self):
        return self.name
    
    def stats(self):
        return ({"hp": self.hp}) # return stats as a dictionary