from multiprocessing import context
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from mathapi.models import Coins, Pokeballs, LifetimePokeballs, Inventory, LifetimeInventory
from mathapi.utils.rewards import MathReward


def get_common_context(user):
    print ("current_user: {}".format(user))

    user_inventory_obj, created = Inventory.objects.get_or_create(user=user, defaults={
        'tier4': 0,
        'tier3': 0,
        'tier2': 0,
        'tier1': 1,
        'passes': 0,
        'coins': 0,
        'trapModules': 0,
        })

    user_lifetime_inventory_obj, lf_created = LifetimeInventory.objects.get_or_create(user=user, defaults={
        'tier4': 0,
        'tier3': 0,
        'tier2': 0,
        'tier1': 1,
        'passes': 0,
        'coins': 0,
        'trapModules': 0,
        })
        
    print ("created: {}".format(created))
    print ("lifetime created: {}".format(lf_created))
    context = {
        'user' : user,
        'pb1' : user_inventory_obj.tier1,
        'pb2' : user_inventory_obj.tier2,
        'pb3' : user_inventory_obj.tier3,
        'pb4' : user_inventory_obj.tier4,
        'passes' : user_inventory_obj.passes,
        'coins' : user_inventory_obj.coins,
        'trapModules' : user_inventory_obj.trapModules,
        
        'lf_pb1' : user_lifetime_inventory_obj.tier1,
        'lf_pb2' : user_lifetime_inventory_obj.tier2,
        'lf_pb3' : user_lifetime_inventory_obj.tier3,
        'lf_pb4' : user_lifetime_inventory_obj.tier4,
        'lf_passes' : user_lifetime_inventory_obj.passes,
        'lf_coins' : user_lifetime_inventory_obj.coins,
        'lf_trapModules' : user_lifetime_inventory_obj.trapModules,
    }

    print ("Common context: {}".format(context))
    return context

# Create your views here.
@login_required
def index_view(request):
    context = get_common_context(request.user)
    print ("index_view context: {}".format(context))

    # return render(request, 'frontend/index.html', context)
    return render(request, 'frontend/home.html', context)

@login_required
def math_view(request):
    context = get_common_context(request.user)

    print ("math_view context: {}".format(context))
    return render(request, 'frontend/math.html', context)


@login_required
def math_arithmetic_view(request):
    context = get_common_context(request.user)
    # math reward tier thresholds
    rew_obj = MathReward()
    context['l4_thr'] = rew_obj.reward_threshold['t4']
    context['l3_thr'] = rew_obj.reward_threshold['t3']
    context['l2_thr'] = rew_obj.reward_threshold['t2']
    context['l1_thr'] = rew_obj.reward_threshold['t1']
    print ("++++math_arithmetic_view context: {}".format(context))
    return render(request, 
                  'frontend/math_arithmetic.html', 
                  context)

@login_required
def match_view(request):
    context = get_common_context(request.user)
    print ("match_view context: {}".format(context))
    return render(request, 'frontend/match.html', context)

@login_required
def shop_view(request):
    context = get_common_context(request.user)
    print ("match_view context: {}".format(context))
    return render(request, 'frontend/shop.html', context)

@login_required
def game_view(request):
    context = get_common_context(request.user)
    print ("match_view context: {}".format(context))
    return render(request, 'frontend/game.html', context)


# def index_view(request):
#     current_user = request.user
#     print ("current_user: {}".format(current_user))

#     user_obj, created = Coins.objects.get_or_create(user=request.user, defaults={'coins': 11})

#     context = {
#         'user' : current_user ,
#         'coins' : user_obj.coins
#     }
    
#     print ("index_view context: {}".format(context))

#     # return render(request, 'frontend/index.html')
#     return render(request, 'frontend/math.html', context)

