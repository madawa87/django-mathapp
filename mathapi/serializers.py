from django.db import models
from django.db.models import fields
from rest_framework import serializers
from mathapi.models import Question, Stats

class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = ['id', 'operator', 'operand1', 'operand2', 'answer']


class StatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = ['question', 'times_presented', 'times_correct']
     