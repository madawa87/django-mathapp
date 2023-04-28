from django.contrib import admin

from .models import Coins
from .models import Question
from .models import Pokeballs, LifetimePokeballs, Inventory, LifetimeInventory

# Register your models here.

class CoinAdmin(admin.ModelAdmin):
    fields = ('user', 'coins')
    list_display = ('user', 'coins')
    list_filter = ('user', 'coins')

class QuestionAdmin(admin.ModelAdmin):
    fields = ('operator', 'operand1', 'operand2', 'answer')
    list_display = ('operator', 'operand1', 'operand2', 'answer')
    list_filter = ('operator', 'answer')

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
admin.site.register(Pokeballs, PokeballsAdmin)
admin.site.register(LifetimePokeballs, LifetimePokeballsAdmin)
admin.site.register(Inventory, InventoryAdmin)
admin.site.register(LifetimeInventory, LifetimeInventoryAdmin)