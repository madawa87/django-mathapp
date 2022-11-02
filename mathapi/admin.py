from django.contrib import admin

from .models import Coins
from .models import Question

# Register your models here.

class CoinAdmin(admin.ModelAdmin):
    fields = ('user', 'coins')
    list_display = ('user', 'coins')
    list_filter = ('user', 'coins')

class QuestionAdmin(admin.ModelAdmin):
    fields = ('operator', 'operand1', 'operand2', 'answer')
    list_display = ('operator', 'operand1', 'operand2', 'answer')
    list_filter = ('operator', 'answer')

admin.site.register(Coins, CoinAdmin)
admin.site.register(Question, QuestionAdmin)