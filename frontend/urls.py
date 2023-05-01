from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.index_view, name='index'),
    path('math/', views.math_view, name='math'),
    path('match/', views.match_view, name='match'),
    path('game/', views.game_view, name='game'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), {'nextpage': 'frontend:login'}, name='logout'),

]
