from django.db import models
from django.contrib.auth.models import User

class Question(models.Model):
    operator = models.CharField(max_length=1)
    operand1 = models.IntegerField()
    operand2 = models.IntegerField()
    answer = models.IntegerField()
    # category = models.ForeignKey()
    # times_presented = models.IntegerField(default=0)
    # times_correct = models.IntegerField(default=0)



class Stats(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    user = models.ForeignKey('auth.User', related_name='stats', on_delete=models.CASCADE)

    times_presented = models.IntegerField(default=0)
    times_correct = models.IntegerField(default=0)


class Coins(models.Model):
    user = models.ForeignKey('auth.User', related_name='coins', on_delete=models.CASCADE)
    coins = models.IntegerField()

class Pokeballs(models.Model):
    user = models.ForeignKey('auth.User', related_name='pokeballs', on_delete=models.CASCADE)
    # standard ball
    tier1 = models.IntegerField(default=0)
    tier2 = models.IntegerField(default=0)
    tier3 = models.IntegerField(default=0)
    # master ball
    tier4 = models.IntegerField(default=0)

class LifetimePokeballs(models.Model):
    user = models.ForeignKey('auth.User', related_name='lf_pokeballs', on_delete=models.CASCADE)
    tier1 = models.IntegerField(default=0)
    tier2 = models.IntegerField(default=0)
    tier3 = models.IntegerField(default=0)
    tier4 = models.IntegerField(default=0)
    
class Inventory(models.Model):
    user = models.ForeignKey('auth.User', related_name='current_inventory', on_delete=models.CASCADE)
    tier1 = models.IntegerField(default=0)
    tier2 = models.IntegerField(default=0)
    tier3 = models.IntegerField(default=0)
    tier4 = models.IntegerField(default=0)

    passes = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    trapModules = models.IntegerField(default=0)
    

class LifetimeInventory(models.Model):
    user = models.ForeignKey('auth.User', related_name='lifetime_inventory', on_delete=models.CASCADE)
    tier1 = models.IntegerField(default=0)
    tier2 = models.IntegerField(default=0)
    tier3 = models.IntegerField(default=0)
    tier4 = models.IntegerField(default=0)

    passes = models.IntegerField(default=0)
    coins = models.IntegerField(default=0)
    trapModules = models.IntegerField(default=0)

class Pokemon(models.Model):
    # user = models.ForeignKey('auth.User', related_name='pokemon', on_delete=models.CASCADE)
    name = models.CharField(max_length=128)
    image = models.ImageField(upload_to='files/pokemon')


class UserPokemon(models.Model):
    """
    Pokemons that users caught.
    """
    user = models.ForeignKey('auth.User', related_name='user_pokemon', on_delete=models.CASCADE)
    pokemon = models.ForeignKey(Pokemon, on_delete=models.PROTECT)
    time_caught = models.DateTimeField("Time of capture")
