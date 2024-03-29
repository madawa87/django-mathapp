from django.contrib import admin

from .models import Coins
from .models import Question, MCQuestion
from .models import Pokeballs, LifetimePokeballs, Inventory, LifetimeInventory

# Register your models here.

class CoinAdmin(admin.ModelAdmin):
    fields = ('user', 'coins')
    list_display = ('user', 'coins')
    list_filter = ('user', 'coins')

class QuestionAdmin(admin.ModelAdmin):
    fields = ('operator', 'operand1', 'operand2', 'answer', 'q_string', 
              'difficulty', 'type', 'ans_method', 'other_answers')
    list_display = ('operator', 'operand1', 'operand2', 'answer', 'q_string', 
                    'difficulty', 'type', 'ans_method')
    list_filter = ('operator', 'answer', 'q_string', 'difficulty', 'type', 'ans_method')

class MCQuestionAdmin(admin.ModelAdmin):
    fields = ('question', 'choices', 'difficulty', 'type')
    list_display = ('question', 'choices', 'difficulty', 'type')
    list_filter = ('difficulty', 'type')

class PokeballsAdmin(admin.ModelAdmin):
    fields = ('user', 'tier1', 'tier2', 'tier3', 'tier4')
    list_display = ('user', 'tier1', 'tier2', 'tier3', 'tier4')
    list_filter = ('user',)

class LifetimePokeballsAdmin(admin.ModelAdmin):
    fields = ('user', 'tier1', 'tier2', 'tier3', 'tier4')
    list_display = ('user', 'tier1', 'tier2', 'tier3', 'tier4')
    list_filter = ('user',)

class InventoryAdmin(admin.ModelAdmin):
    fields = ('user', 'tier1', 'tier2', 'tier3', 'tier4', 'passes')
    list_display = ('user', 'tier1', 'tier2', 'tier3', 'tier4', 'passes')
    list_filter = ('user',)

class LifetimeInventoryAdmin(admin.ModelAdmin):
    fields = ('user', 'tier1', 'tier2', 'tier3', 'tier4', 'passes')
    list_display = ('user', 'tier1', 'tier2', 'tier3', 'tier4', 'passes')
    list_filter = ('user',)

admin.site.register(Coins, CoinAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(MCQuestion, MCQuestionAdmin)
admin.site.register(Pokeballs, PokeballsAdmin)
admin.site.register(LifetimePokeballs, LifetimePokeballsAdmin)
admin.site.register(Inventory, InventoryAdmin)
admin.site.register(LifetimeInventory, LifetimeInventoryAdmin)