# GRUPO 09 - 2025 - PROYINF

Este es el repositorio del "Grupo 09", cuyos integrantes son:

* Emile Allué - 202273564-3
* Matías Farías - 202273589-9
* Consuelo Gálvez - 202273594-5
* Lucas Rodríguez - 202273533-3

* **Tutor**: Maximiliano Alexander Tapia Castillo


## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/MatthewBlitztanz/GRUPO09-2025-PROYINF/wiki#grupo-09)


## Videos

* [Video de presentación del cliente](https://aula.usm.cl/pluginfile.php/6994529/mod_resource/content/1/video1943571039.mp4)


## Aspectos técnicos relevantes

### Tecnologías utilizadas

- **Backend**: Python (Django)
- **Frontend**: HTML, CSS, JavaScript
- **Base de datos**: SQLite
- **Control de versiones**: GitHub
  
## Estructura del proyecto

```
GRUPO09-2025-PROYINF/
├── proyecto/
│   ├── core/
│   │   ├── templates/
│   │   │   └── core/
│   │   ├── views.py
│   │   ├── urls.py
│   ├── plataforma_paes/
│   ├── manage.py
│   ├── requirements.txt
│   └── db.sqlite3
├── README.md
└── .gitignore
```

### Pasos para levantar el proyecto

1. **Clonar el repositorio**

```bash
git clone https://github.com/MatthewBlitztanz/GRUPO09-2025-PROYINF.git
```

2. **Entrar a la carpeta del proyecto**

```bash
cd GRUPO09-2025-PROYINF/proyecto
```

3. **Instalar dependencias**

```bash
pip install -r requirements.txt
```

4. **Aplicar migraciones**

```bash
python manage.py migrate
```

5. **Levantar el servidor**

```bash
python manage.py runserver
```

6. **Acceder desde el navegador**

```
http://127.0.0.1:8000/
```

## Rutas principales

- `/` → Página de login (selección de tipo de usuario)  
- `/banco/` → Banco de preguntas
- `/menu/alumno/` → Menú para alumno  
- `/menu/externo/` → Menú para visualizador externo  
- `/admin/` → Panel administrativo de Django

