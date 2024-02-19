import random

from django.db import models
from django.db.models import fields
from rest_framework import serializers
from mathapi.models import Question, MCQuestion, Stats

class QuestionSerializer(serializers.ModelSerializer):

    # type need to show human readable lable
    # type = serializers.CharField(source='get_type_display')

    class Meta:
        model = Question
        fields = ['id', 'operator', 'operand1', 'operand2', 'answer', 
                   'other_answers', 'difficulty', 'type', 'ans_method']


class MCQSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQuestion
        fields = ['id', 'question', 'choices', 'difficulty', 'type']

class MCQSerializerShuffled(serializers.ModelSerializer):
    s_choices = serializers.SerializerMethodField('suffle_choices')

    def suffle_choices(self, mcq):
        choices = mcq.choices
        print(f"++++++CHOICES = {choices}")
        choices_list = [x.strip() for x in choices.split(',')]
        
        random.shuffle(choices_list)
        print(choices_list)
        print(', '.join(choices_list))
        return ', '.join(choices_list)

    class Meta:
        model = MCQuestion
        fields = ['id', 'question', 's_choices', 'difficulty', 'type']


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ['question', 'times_presented', 'times_correct']
     