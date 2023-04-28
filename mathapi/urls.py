from nturl2path import url2pathname
from django.urls import path

from rest_framework.urlpatterns import format_suffix_patterns
from mathapi import views

urlpatterns = [
    path('index/', views.default_view, name='default'),
    # path('', views.api_root),
    path('questions/', views.QuestionList.as_view(), name='question-list'),
    path('questions/<int:pk>/', views.QuestionDetail.as_view(), name='question-detail'),
    path('stats/', views.StatList.as_view(), name='stat-list'),
    path('', views.default_view, name='default'),
    path('randomQuestion/', views.randomQuestion, name='api-randomQuestion'),
    path('questions/<int:pk>/checkAnswer/', views.checkAnswer, name='api-checkAnswer'),
    path('users/<int:pk>/updateCoins/', views.updateCoins, name='api-updateCoins'),
    path('users/<int:pk>/updatePokeballs/', views.updatePokeballs, name='api-updatePokeballs'),
    path('users/<int:pk>/updateInventory/', views.updateInventory, name='api-updateInventory'),
]

urlpatterns = format_suffix_patterns(urlpatterns)