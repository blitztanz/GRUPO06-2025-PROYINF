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
* [Video de presentación prototipo *Hito 3*](https://aula.usm.cl/pluginfile.php/6994529/mod_resource/content/1/video1943571039.mp4)


## Aspectos técnicos relevantes

### Tecnologías utilizadas

- **Backend**: Node.js
- **Frontend**: React
- **Base de datos**: PostgreSQL
- **Control de versiones**: GitHub
  
## Estructura del proyecto

```
plataforma_PAES/
├── .gitignore
├── README.md
├── backend/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── db.js
│   └── routes/
│       ├── auth.js
│       ├── alumnos.js
│       ├── preguntas.js
│       ├── reportes.js
│       └── notas.js
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   ├── index.html
    │   └── <!-- otros assets estáticos -->
    └── src/
        ├── App.js
        ├── index.js
        ├── hooks/
        │   └── useAuth.js
        └── components/
            ├── Login.jsx
            ├── MenuProfesor.jsx
            ├── VerAlumnos.jsx
            ├── CrearReporte.jsx
            ├── VerReportes.jsx
            ├── DetalleReporte.jsx
            ├── VerNotas.jsx
            ├── MenuAlumno.jsx
            ├── MenuExterno.jsx
            └── Notas.jsx

```

Requisitos:
    Node.js ≥ 16.x

    npm (viene con Node.js)

    PostgreSQL ≥ 12.x

Dependencias principales del backend (en backend/package.json):
java
Copiar
Editar
express
cors
dotenv
pg
nodemon (dev)
Dependencias principales del frontend (en frontend/package.json):

nginx
Copiar
Editar
react
react-dom
react-scripts
react-router-dom
Cómo levantar el proyecto
Clona el repositorio

bash
Copiar
Editar
git clone https://github.com/MatthewBlitztanz/GRUPO09-2025-PROYINF.git
cd GRUPO09-2025-PROYINF
Configura la base de datos

bash
Copiar
Editar
# Conéctate a Postgres
psql -h localhost -U postgres -d postgres

# En el prompt de psql:
CREATE DATABASE plataforma_paes;
\c plataforma_paes

# Crea tablas (si no existen)
-- Usuarios, preguntas, reportes, reportes_preguntas, notas
-- (Consulta el README para el script SQL completo)
Arranca el backend

# Dar datos iniciales locales:
cd backend
psql -h localhost -U postgres -d plataforma_paes -f seed.sql


bash
Copiar
Editar
cd backend
cp .env.example .env   # o crea .env manualmente
# Ajusta DATABASE_URL en .env con tu contraseña de Postgres
npm install
npm run dev
Debes ver: API corriendo en http://localhost:4000

Arranca el frontend

bash
Copiar
Editar
cd ../frontend
npm install
npm start
El navegador abrirá http://localhost:3000


