# GRUPO 06 - 2025 - PROYINF

## ¡Proyecto en progreso 2025-2!

Este es el repositorio del "Grupo 06", cuyos integrantes son:

* Emile Allué - 202273564-3
* Matías Farías - 202273589-9
* Consuelo Gálvez - 202273594-5
* ~~Lucas Rodríguez - 202273533-3~~ (Vuela alto Lucas <3)

* **Tutor**: Carlos Arévalo Guajardo

---

## Wiki

Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/MatthewBlitztanz/GRUPO09-2025-PROYINF/wiki#grupo-09)

---

## Videos

* [Video de presentación del cliente](https://aula.usm.cl/pluginfile.php/6994529/mod_resource/content/1/video1943571039.mp4)
* [Video de presentación del prototipo - Hito 3](https://github.com/user-attachments/assets/c3d7f87e-63c3-4e61-a3a3-ebf36b12f966)
* [Video de resultados finales PROYINF](https://youtu.be/SasXkmcKAYw)

---

## Aspectos técnicos relevantes

### Tecnologías utilizadas

- **Backend**: Node.js
- **Frontend**: React
- **Base de datos**: PostgreSQL
- **Control de versiones**: GitHub

---
  
## Estructura del proyecto

```
plataforma_PAES/
├── README.md
├── backend/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── schema.sql
│   ├── seed.sql
│   ├── db.js
│   └── routes/
│       ├── auth.js
│       ├── alumnos.js
│       ├── ensayos.js
│       ├── preguntas.js
│       ├── reportes.js
│       └── notas.js
│   └── config/
│       └── passport.js
└── frontend/
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── index.js
        └── assets/
            └── UserContext.js
        └── assets/
            └── google-icon.png
        └── components/
            ├── Login.jsx
            ├── MenuProfesor.jsx
            ├── BancoPreguntas.jsx
            ├── VerAlumnos.jsx
            ├── CrearEnsayo.jsx
            ├── VerReportes.jsx
            ├── VerEnsayos.jsx
            ├── DetalleReporte.jsx
            ├── ProtectedRoute.jsx
            ├── VerNotas.jsx
            ├── MenuAlumno.jsx
            ├── MenuExterno.jsx
            ├── ResolverEnsayo.jsx
            ├── ResultadoDetalle.jsx
            ├── ResultadosCompletos.jsx
            ├── ResultadosProfe.jsx
            └── Navbar.jsx
```

---

## Requisitos:

- Node.js ≥ 16.x  
- npm (incluido con Node.js)  
- PostgreSQL ≥ 12.x  

---

## Dependencias 

### Backend (`backend/package.json`)

- express  
- cors  
- dotenv  
- pg  
- nodemon (solo para desarrollo)

### Frontend (`frontend/package.json`)

- react  
- react-dom  
- react-router-dom  
- react-scripts

---

## Levantamiento del proyecto
    
### 1. Clona el repositorio

```bash
git clone https://github.com/MatthewBlitztanz/GRUPO09-2025-PROYINF.git
cd GRUPO09-2025-PROYINF
```

### 2. Configura la base de datos

#### 2.1. Conéctate a PostgreSQL:

```bash
psql -h localhost -U postgres -d postgres
```

#### 2.2. Dentro del prompt de `psql`:

```sql
CREATE DATABASE plataforma_paes ENCODING 'UTF8';
\c plataforma_paes
```

Crea las tablas necesarias: `usuarios`, `preguntas`, `reportes`, `reportes_preguntas`, `notas`.  

```bash
cd backend
psql -h localhost -U postgres -d plataforma_paes -f schema.sql --encoding=UTF8
```

### 3. Arranca el backend

#### 3.1. Cargar datos iniciales (opcional):

```bash
cd backend
psql -h localhost -U postgres -d plataforma_paes -f seed.sql --encoding=UTF8
```

#### 3.2. Copia el archivo `.env` de ejemplo o créalo manualmente:

```bash
cp .env.example .env
```

Edita `.env` y ajusta la variable `DATABASE_URL` con tu contraseña de PostgreSQL.

#### 3.3. Instala dependencias y ejecuta el servidor:

```bash
npm install
npm run dev
```

- Deberías ver el mensaje: **API corriendo en http://localhost:4000**

### 4. Arranca el frontend

```bash
cd ../frontend
npm install
npm start
```

- Se abrirá automáticamente el navegador en: **http://localhost:3000**

---

## ¡Listo! 😒👌

¡¡¡Ya tienes la plataforma funcionando en modo local!!!
