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
    tier1 = models.IntegerField(default=0)
    tier2 = models.IntegerField(default=0)
    tier3 = models.IntegerField(default=0)
    tier4 = models.IntegerField(default=0)

    