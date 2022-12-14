import imp
from math import ceil, floor
import random

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import permissions, status
from mathapi import serializers

from mathapi.serializers import QuestionSerializer, StatSerializer
from mathapi.models import Coins, Pokeballs, Question, Stats

from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def api_root(request, fromat=None):
    return Response({
        'questions': reverse('question-list', request=request, format=format),
        'stats': reverse('stat-list', request=request, format=format)
        }
    )

class QuestionList(generics.ListCreateAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            print("DONE perform creating")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("COULD NOT perform create")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serialzr = self.serializer_class(data=request.data)
        if serialzr.is_valid():
            print("Creating: {}".format(request.data))
            serialzr.save()
            return Response(serialzr.data, status=status.HTTP_201_CREATED)
        else:
            print("Could not creating: {}".format(request.data))
            return Response(serialzr.errors, status=status.HTTP_400_BAD_REQUEST)
            

class StatList(generics.ListAPIView):
    queryset = Stats.objects.all()
    serializer_class = StatSerializer

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


def default_view(request):
    return HttpResponse('<h1>API Home!!</h1>')

@api_view(['GET'])
def randomQuestion(request):
    random.seed()
    question = random.choice(list(Question.objects.all()))
    serializer = QuestionSerializer(question, many=False)
    return JsonResponse(serializer.data)
    


@api_view(['POST'])
def checkAnswer(request, pk):
    """
    payload: a json object. eg. {answer: 11}
    Check if the answer is same as the answer store in database.
    respond: a json object. {correct: True}

    TODO:
        set signal to save an entry in stats table
    """
    # received_json_data = json.loads(request.body.decode('utf-8'))
    print ("data sent = {}".format(request.data))
    data = request.data

    user=request.user
    print("request user: {}".format(user))

    question = Question.objects.get(id=pk)
    
    print("answer sent = {}".format(data['answer']))
    print("answer type sent = {}".format(type(data['answer'])))
    print ("user: {}".format(request.user))

    if question.answer == int(data['answer']):
        response = {
            "correct": True
        }
    else:
        response = {
            "correct": False
        }

    print (question.id)
    print (question.answer)
    return JsonResponse(response)


@api_view(['POST'])
def updateCoins(request, pk):
    """
    update user coins"""

    print("+++ in updateCoins")
    coins_obj = Coins.objects.get(user=request.user)
    req_data = request.data
    
    if coins_obj:
        coins_obj.coins = coins_obj.coins + req_data['amount']
        print ("coin inc = {}".format(req_data['amount']))
        coins_obj.save()

        response = {
            "updated" : True
        }
    else:
        print ("OOPS!!!")
        response = {
            "updated" : False
        }

    response["coins"] = coins_obj.coins
    print ("response: {}".format(response))
    return JsonResponse(response)

@api_view(['POST'])
def updatePokeballs(request, pk):
    """
    Update user pokeballs
    """
    print ("updating pokeballs")
    pb_obj = Pokeballs.objects.get(user=request.user)
    request_data = request.data

    response = {"updated": True}

    if pb_obj:
        if request_data["inc"]:
            tier = ceil(request_data["timeLeft"]/5)
            print ("timeleft: {}, tier: {}".format(request_data['timeLeft'], tier))
            pb_obj.tier4 = pb_obj.tier4 + 1
            pb_obj.tier3 = pb_obj.tier3 + 1
            pb_obj.tier2 = pb_obj.tier2 + 1
            pb_obj.tier1 = pb_obj.tier1 + 1
            if request_data["timeLeft"] < 19:
                if tier != 4:
                    pb_obj.tier4 = pb_obj.tier4 - 1
                if tier != 3:
                    pb_obj.tier3 = pb_obj.tier3 - 1
                if tier != 2:
                    pb_obj.tier2 = pb_obj.tier2 - 1
                if tier != 1:
                    pb_obj.tier1 = pb_obj.tier1 - 1
        else:
            # decreasing
            if pb_obj.tier1 > 0:
                pb_obj.tier1 = pb_obj.tier1 - 1
            elif pb_obj.tier2 > 0:
                pb_obj.tier2 = pb_obj.tier2 - 1
            elif pb_obj.tier3 > 0:
                pb_obj.tier3 = pb_obj.tier3 - 1
            elif pb_obj.tier4 > 0:
                pb_obj.tier4 = pb_obj.tier4 - 1
            else:
                response["updated"] = False

        if response["updated"]:
            print("++ Updating pokeballs")
            pb_obj.save()
            response['pb1'] = pb_obj.tier1
            response['pb2'] = pb_obj.tier2
            response['pb3'] = pb_obj.tier3
            response['pb4'] = pb_obj.tier4
    else:
        print("NO pokeball object")
        response["updated"] = False

    print("response: {}".format(response))
    return JsonResponse(response)

