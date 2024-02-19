from nturl2path import url2pathname
from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns
from mathapi import views

urlpatterns = [
    path('', views.default_view, name='default'),
    path('index/', views.default_view, name='default'),
    # path('', views.api_root),
    path('questions/', views.QuestionList.as_view(), name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetail.as_view(), name='question-detail'),
    path('questions/<int:pk>/checkAnswer/', views.checkAnswer, name='api-checkAnswer'),
    path('randomQuestion/', views.randomQuestion, name='api-randomQuestion'),
    path('levelRandomQuestion/', views.levelRandomQuestion, name='api-levelRandomQuestion'),

    path('mcquestions/', views.MCQuestionList.as_view(), name='mcquestion-list'),
    path('mcquestions/<int:pk>/', views.MCQuestionDetail.as_view(), name='mcquestion-detail'),
    path('mcquestions/<int:pk>/checkMCQChoice/', views.checkMCQAnswer, name='api-MCQCheckAnswer'),
    path('levelRandomMCQ/', views.levelRandomMCQ, name='api-levelRandomMCQ'),
    path('getLevelRandomMCQ/', views.getLevelRandomMCQ, name='api-getLevelRandomMCQ'),

    path('stats/', views.StatList.as_view(), name='stat-list'),
    path('users/<int:pk>/updateCoins/', views.updateCoins, name='api-updateCoins'),
    path('users/<int:pk>/updatePokeballs/', views.updatePokeballs, name='api-updatePokeballs'),
    path('users/<int:pk>/updateInventory/', views.updateInventory, name='api-updateInventory'),
]

urlpatterns = format_suffix_patterns(urlpatterns)