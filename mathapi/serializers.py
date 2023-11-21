from django.db import models
from django.db.models import fields
from rest_framework import serializers
from mathapi.models import Question, Stats

class QuestionSerializer(serializers.ModelSerializer):

    # type need to show human readable lable
    # type = serializers.CharField(source='get_type_display')

    class Meta:
        model = Question
        fields = ['id', 'operator', 'operand1', 'operand2', 'answer', 
                   'other_answers', 'difficulty', 'type', 'ans_method']


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ['question', 'times_presented', 'times_correct']
     