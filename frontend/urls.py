from django.urls import path
from django.contrib.auth import views as auth_views

from . import views

app_name = 'frontend'

urlpatterns = [
    path('', views.index_view, name='index'),
    path('math/', views.math_view, name='math'),
    path('match/', views.match_view, name='match'),
    path('game/', views.game_view, name='game'),
    path('shop/', views.shop_view, name='shop'),
    path('login/', auth_views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), 
         {'nextpage': 'frontend:login'}, name='logout'),
    path('math_arithmetic/', views.math_arithmetic_view, 
         name='math_arithmetic')

]

htmx_urlpatterns = [
    path('math_arithmetic/', views.math_arithmetic_view, name='math_arithmetic'),
    path('htmxclicked/', views.math_arithmetic_view, name='math_arithmetic')
    
]

# urlpatterns += htmx_urlpatterns