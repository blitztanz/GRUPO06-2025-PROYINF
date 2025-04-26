from django.shortcuts import render, redirect

# Create your views here.
from django.http import HttpResponse

def login_view(request):
    if 'tipo' in request.GET:
        tipo_usuario = request.GET['tipo']
        print("TIPO DE USUARIO:", tipo_usuario)

        if tipo_usuario == 'profesor':
            return redirect('menu_profesor')
        elif tipo_usuario == 'alumno':
            return redirect('menu_alumno')
        elif tipo_usuario == 'externo':
            return redirect('menu_externo')
        else:
            print("Tipo de usuario inválido:", tipo_usuario)

    return render(request, 'core/login.html')

def menu_profesor(request):
    return render(request, 'core/menu_profesor.html')

def menu_alumno(request):
    return render(request, 'core/menu_alumno.html')

def ver_banco(request):
    preguntas = []
    return render(request, 'core/banco.html', {'preguntas': preguntas})

def menu_externo(request):
    return render(request, 'core/menu_externo.html')