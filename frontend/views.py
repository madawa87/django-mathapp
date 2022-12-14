from multiprocessing import context
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from mathapi.models import Coins, Pokeballs


def get_common_context(user):
    print ("current_user: {}".format(user))

    userPB_obj, created = Pokeballs.objects.get_or_create(user=user, defaults={
        'tier4': 0,
        'tier3': 0,
        'tier2': 0,
        'tier1': 1
        })
    print ("created: {}".format(created))
    context = {
        'user' : user,
        'pb1' : userPB_obj.tier1,
        'pb2' : userPB_obj.tier2,
        'pb3' : userPB_obj.tier3,
        'pb4' : userPB_obj.tier4,
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
def match_view(request):
    context = get_common_context(request.user)
    print ("match_view context: {}".format(context))
    return render(request, 'frontend/match.html', context)


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

