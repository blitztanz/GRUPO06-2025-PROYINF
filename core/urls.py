from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('menu/', views.menu_profesor, name='menu_profesor'),
    path('banco/', views.ver_banco, name='ver_banco'),
    path('menu/alumno/', views.menu_alumno, name='menu_alumno'),
    path('menu/externo/', views.menu_externo, name='menu_externo'),
]
