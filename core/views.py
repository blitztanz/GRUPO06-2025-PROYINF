from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse

def login_view(request):
    if request.method == 'GET' and request.GET.get('tipo'):
        tipo_usuario = request.GET.get('tipo')
        if tipo_usuario == 'profesor':
            return redirect('menu_profesor')
        elif tipo_usuario == 'alumno':
            return redirect('menu_alumno')
        elif tipo_usuario == 'externo':
            return redirect('menu_externo')
    return render(request, 'core/login.html')

def login_view(request):
    return render(request, 'core/login.html')

def menu_profesor(request):
    return render(request, 'core/menu_profesor.html')

def menu_alumno(request):
    return render(request, 'core/menu_alumno.html')

def ver_banco(request):
    preguntas = []  # Todavía no hay base de datos, lista vacía por ahora
    return render(request, 'core/banco.html', {'preguntas': preguntas})

def menu_externo(request):
    return render(request, 'core/menu_externo.html')