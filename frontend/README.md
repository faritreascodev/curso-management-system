# Frontend - Sistema de Gestión de Cursos

Aplicación React para la gestión de cursos y estudiantes con interfaz moderna y responsiva.

## Instalación

```bash
npm install
cp .env.example .env
npm start
```

## Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:3000/api
```

## Scripts

```bash
npm start          # Servidor desarrollo
npm run build      # Build producción
npm test           # Ejecutar tests
```

## Estructura

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/       # Componentes reutilizables
│   ├── context/          # Context API
│   ├── pages/            # Páginas principales
│   ├── services/         # Servicios API
│   ├── utils/            # Utilidades
│   ├── App.js
│   └── index.js
└── package.json
```

## Componentes Principales

### Páginas
- **Login/Register**: Autenticación de usuarios
- **Dashboard**: Vista principal con estadísticas
- **CursoDetail**: Detalles del curso y gestión de estudiantes
- **CreateCurso/EditCurso**: Formularios de curso

### Componentes
- **Navbar**: Navegación principal
- **PrivateRoute**: Protección de rutas
- **Modal**: Modal reutilizable
- **FormInput**: Input con validaciones
- **Button**: Botón con variantes

## Rutas

```
/                    # Redirige a /dashboard
/login               # Página de login
/register            # Página de registro
/dashboard           # Dashboard principal (protegida)
/cursos/crear        # Crear curso (protegida)
/cursos/:id          # Detalles curso (protegida)
/cursos/:id/editar   # Editar curso (protegida)
```

## Servicios API

### authService
```javascript
login(email, password)
register(userData)
getCurrentUser()
logout()
```

### cursoService
```javascript
getCursos(params)
getCursoById(id)
createCurso(data)
updateCurso(id, data)
deleteCurso(id)
```

### estudianteService
```javascript
getEstudiantesByCurso(cursoId, params)
createEstudiante(cursoId, data)
updateEstudiante(cursoId, id, data)
deleteEstudiante(cursoId, id)
```

## Validaciones

```javascript
// Ejemplos de validadores
validators.required(value, fieldName)
validators.email(email)
validators.password(password)
validators.number(value, fieldName, min, max)
```

## Estilos

- **TailwindCSS**: Framework CSS principal
- **Responsive**: Mobile-first design
- **Componentes**: Estilos modulares y reutilizables

## Autenticación

- **JWT**: Token almacenado en localStorage
- **Context**: Estado global con AuthContext
- **Interceptores**: Axios con token automático
- **Rutas protegidas**: Middleware de autenticación

## Características

- Interfaz responsiva
- Validaciones en tiempo real
- Alertas con SweetAlert2
- Búsqueda y filtros
- Paginación
- Estados de carga
- Manejo de errores
