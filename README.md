# Sistema de Gestión de Cursos

Sistema completo de gestión de cursos desarrollado con Node.js/Express (backend) y React (frontend).

## Características

- Autenticación JWT (login/register)
- CRUD completo de cursos
- Gestión de estudiantes por curso
- Cálculo automático de estadísticas
- Roles de usuario (admin/docente)
- Interfaz responsiva
- API REST documentada con Swagger

## Tecnologías

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Swagger para documentación

**Frontend:**
- React 18
- React Router DOM
- Axios
- TailwindCSS
- SweetAlert2

## Estructura del Proyecto

```
curso-management-system/
├── backend/          # API REST con Node.js/Express
├── frontend/         # Aplicación React
└── README.md         # Este archivo :p
```

## Instalación Rápida

### 1. Clonar repositorio
```bash
git clone https://github.com/faritreascodev/curso-management-system.git
cd curso-management-system
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tus configuraciones
npm run dev
```

### 3. Configurar Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configurar REACT_APP_API_URL=http://localhost:3000/api
npm start
```

## URLs de Acceso

- Frontend: http://localhost:3001
- Backend API: http://localhost:3000/api
- Documentación: http://localhost:3000/api-docs

## Credenciales de Prueba

```
Admin: admin@cursos.com / admin123
Docente: juan.perez@cursos.com / docente123
```

## Funcionalidades

### Cursos
- Crear, editar, eliminar cursos
- Búsqueda y filtros
- Estadísticas automáticas

### Estudiantes
- Agregar estudiantes a cursos
- Gestión de notas (0-10)
- Email único por curso
- Cálculo de promedios

### Usuarios
- Registro y autenticación
- Roles: admin (acceso total), docente (solo sus cursos)
- Sesiones persistentes

## Documentación Detallada

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## Contribución

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request
