from math import ceil, floor
import random

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import permissions, status

from mathapi import serializers
from mathapi.serializers import QuestionSerializer, MCQSerializer, StatSerializer, MCQSerializerShuffled
from mathapi.models import Coins, Pokeballs, LifetimePokeballs, Inventory, LifetimeInventory, Question, MCQuestion, Stats
from mathapi.utils.rewards import MathReward

from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
def api_root(request, fromat=None):
    return Response({
        'questions': reverse('question-list', request=request, format=format),
        'stats': reverse('stat-list', request=request, format=format)
        }
    )

class MCQuestionList(generics.ListCreateAPIView):
    queryset = MCQuestion.objects.all()
    serializer_class = MCQSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save()
            print("DONE perform creating MCQ")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("COULD NOT perform create MCQ")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serialzr = self.serializer_class(data=request.data)
        if serialzr.is_valid():
            print("Creating MCQ: {}".format(request.data))
            serialzr.save()
            return Response(serialzr.data, status=status.HTTP_201_CREATED)
        else:
            print("Could not create MCQ: {}".format(request.data))
            return Response(serialzr.errors, status=status.HTTP_400_BAD_REQUEST)


class MCQuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = MCQuestion.objects.all()
    serializer_class = MCQSerializer

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
            print("Could not create: {}".format(request.data))
            return Response(serialzr.errors, status=status.HTTP_400_BAD_REQUEST)
            

class QuestionDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class StatList(generics.ListAPIView):
    queryset = Stats.objects.all()
    serializer_class = StatSerializer

def default_view(request):
    return HttpResponse('<h1>API Home!!</h1>')

@api_view(['GET'])
def randomQuestion(request):
    random.seed()
    question_list = list(Question.objects.all())
    question = random.choice(question_list)
    serializer = QuestionSerializer(question, many=False)
    return JsonResponse(serializer.data)    

@api_view(['POST'])
def levelRandomQuestion(request):
    random.seed()
    req_data = request.data
    diff =req_data['level']
    print(f"in levelRandomQuestion: diff: {diff}")
    # question_list = Question.objects.filter(difficulty=diff)
    question_list = Question.objects.filter(difficulty=3)
    question = random.choice(question_list)
    serializer = QuestionSerializer(question, many=False)
    return JsonResponse(serializer.data)

@api_view(['POST'])
def levelRandomMCQ(request):
    random.seed()
    diff = request.data['level']
    print(f"in levelRandomMCQ: diff: {diff}")
    question_list = list(MCQuestion.objects.filter(difficulty=diff))
    question = random.choice(question_list)
    serializer = MCQSerializer(question, many=False)
    return JsonResponse(serializer.data)

@api_view(['POST'])
def getLevelRandomMCQ(request):
    random.seed()
    diff = request.data['level']
    print(f"in levelRandomMCQ: diff: {diff}")
    question_list = list(MCQuestion.objects.filter(difficulty=diff))
    question = random.choice(question_list)
    serializer = MCQSerializerShuffled(question, many=False)
    return JsonResponse(serializer.data)

@api_view(['POST'])
def checkMCQAnswer(request, pk):
    data = request.data
    user = request.user

    mcq = MCQuestion.objects.get(id=pk)
    print(f"mcq ID: {pk}")
    print(f"mcq: {mcq}")
    print(f"choice: {data['choice']}")

    correct_choice = mcq.choices.split(',')[0].strip()
    print(f"correct_choice: {correct_choice}")
    if data['choice'] == correct_choice:
        response = {
            "correct": True
        }
    else:
        response = {
            "correct": False
        }
    return JsonResponse(response)

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
    update user coins
    """

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
    lt_pb_obj = LifetimePokeballs.objects.get(user=request.user)
    request_data = request.data

    response = {"updated": True}

    if pb_obj and lt_pb_obj:
        if request_data["inc"]:
            tier = ceil(request_data["timeLeft"]/5)
            print ("timeleft: {}, tier: {}".format(request_data['timeLeft'], tier))
            pb_obj.tier4 = pb_obj.tier4 + 1
            pb_obj.tier3 = pb_obj.tier3 + 1
            pb_obj.tier2 = pb_obj.tier2 + 1
            pb_obj.tier1 = pb_obj.tier1 + 1
            lt_pb_obj.tier4 = lt_pb_obj.tier4 + 1
            lt_pb_obj.tier3 = lt_pb_obj.tier3 + 1
            lt_pb_obj.tier2 = lt_pb_obj.tier2 + 1
            lt_pb_obj.tier1 = lt_pb_obj.tier1 + 1
            if request_data["timeLeft"] < 19:
                if tier != 4:
                    pb_obj.tier4 = pb_obj.tier4 - 1
                    lt_pb_obj.tier4 = lt_pb_obj.tier4 - 1
                if tier != 3:
                    pb_obj.tier3 = pb_obj.tier3 - 1
                    lt_pb_obj.tier3 = lt_pb_obj.tier3 - 1
                if tier != 2:
                    pb_obj.tier2 = pb_obj.tier2 - 1
                    lt_pb_obj.tier2 = lt_pb_obj.tier2 - 1
                if tier != 1:
                    pb_obj.tier1 = pb_obj.tier1 - 1
                    lt_pb_obj.tier1 = lt_pb_obj.tier1 - 1
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
            print("++ Updating pokeballs and lifetime pokeballs")
            pb_obj.save()
            lt_pb_obj.save()
            response['pb1'] = pb_obj.tier1
            response['pb2'] = pb_obj.tier2
            response['pb3'] = pb_obj.tier3
            response['pb4'] = pb_obj.tier4
            response['lt_pb1'] = lt_pb_obj.tier1
            response['lt_pb2'] = lt_pb_obj.tier2
            response['lt_pb3'] = lt_pb_obj.tier3
            response['lt_pb4'] = lt_pb_obj.tier4
    else:
        print("NO pokeball object")
        response["updated"] = False

    print("response: {}".format(response))
    return JsonResponse(response)


@api_view(['POST'])
def updateInventory(request, pk):
    """
    Update user Inventory
    """
    print ("+++++++updating inventory")
    inventory_obj = Inventory.objects.get(user=request.user)
    lt_inventory_obj = LifetimeInventory.objects.get(user=request.user)
    request_data = request.data

    response = {"updated": True}

    reward_obj = MathReward()

    if inventory_obj and lt_inventory_obj:
        if request_data["inc"]:
            # tier = ceil(request_data["timeLeft"]/5)

            tier = reward_obj.get_reward_tier(request_data['timeLeft'])

            print ("timeleft: {}, tier: {}".format(request_data['timeLeft'], tier))

            inventory_obj.tier4 = inventory_obj.tier4 + tier['t4']
            inventory_obj.tier3 = inventory_obj.tier3 + tier['t3']
            inventory_obj.tier2 = inventory_obj.tier2 + tier['t2']
            inventory_obj.tier1 = inventory_obj.tier1 + tier['t1']
            inventory_obj.coins = inventory_obj.coins + tier['t']
            lt_inventory_obj.tier4 = lt_inventory_obj.tier4 + tier['t4']
            lt_inventory_obj.tier3 = lt_inventory_obj.tier3 + tier['t3']
            lt_inventory_obj.tier2 = lt_inventory_obj.tier2 + tier['t2']
            lt_inventory_obj.tier1 = lt_inventory_obj.tier1 + tier['t1']
            lt_inventory_obj.coins = lt_inventory_obj.coins + tier['t']
            
            # pass has to be increased no matter what depending of the val in request data, since it sends 0 
            # in no update is needed
            inventory_obj.passes = inventory_obj.passes + request_data["inc_pass"]
            lt_inventory_obj.passes = lt_inventory_obj.passes + request_data["inc_pass"]
        else:
            # decreasing
            if inventory_obj.tier1 > 0:
                inventory_obj.tier1 = inventory_obj.tier1 - 1
            elif inventory_obj.tier2 > 0:
                inventory_obj.tier2 = inventory_obj.tier2 - 1
            elif inventory_obj.tier3 > 0:
                inventory_obj.tier3 = inventory_obj.tier3 - 1
            elif inventory_obj.tier4 > 0:
                inventory_obj.tier4 = inventory_obj.tier4 - 1
            else:
                response["updated"] = False

        if response["updated"]:
            print("++ Updating inventory and lifetime inventory")
            inventory_obj.save()
            lt_inventory_obj.save()
            response['pb1'] = inventory_obj.tier1
            response['pb2'] = inventory_obj.tier2
            response['pb3'] = inventory_obj.tier3
            response['pb4'] = inventory_obj.tier4
            response['coin'] = inventory_obj.coins
            response['comp'] = inventory_obj.trapModules
            response['passes'] = inventory_obj.passes
            response['lt_pb1'] = lt_inventory_obj.tier1
            response['lt_pb2'] = lt_inventory_obj.tier2
            response['lt_pb3'] = lt_inventory_obj.tier3
            response['lt_pb4'] = lt_inventory_obj.tier4
            response['lt_passes'] = lt_inventory_obj.passes
    else:
        print("NO inventory object")
        response["updated"] = False

    print("response: {}".format(response))
    return JsonResponse(response)

