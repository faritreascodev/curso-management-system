# Sistema de Gestión de Cursos - Backend

## Descripción

Backend completo y profesional para el sistema de gestión de cursos **CursoFarit**. Desarrollado con Node.js, Express, MongoDB y JWT para autenticación.

## Características

- **Autenticación JWT** completa (registro, login, middleware)
- **CRUD completo de cursos** con validaciones
- **Gestión de estudiantes** como subdocumentos
- **Validación de email único** por curso
- **Cálculo de promedios** y estadísticas
- **Documentación Swagger** automática
- **Middleware de seguridad** (helmet, rate limiting)
- **Manejo profesional de errores**
- **Código modular y escalable**

## Tecnologías

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Swagger** - Documentación de API
- **bcryptjs** - Encriptación de contraseñas

## Estructura del Proyecto

\`\`\`
backend/
├── config/           # Configuración (DB, JWT)
├── controllers/      # Lógica de negocio
├── routes/           # Rutas de la API
├── models/           # Modelos de Mongoose
├── middlewares/      # Middleware personalizados
├── swagger/          # Configuración de Swagger
├── scripts/          # Scripts de utilidad
├── app.js            # Configuración de Express
├── server.js         # Servidor principal
└── .env              # Variables de entorno
```

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/faritreascodev/curso-management-system.git
cd curso-management-system/backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Iniciar MongoDB**
```bash
# Asegúrate de que MongoDB esté ejecutándose
mongod
```

5. **Poblar la base de datos (opcional)**
```bash
node scripts/seedDatabase.js
```

6. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Perfil del usuario

### Cursos
- `GET /api/cursos` - Listar cursos
- `POST /api/cursos` - Crear curso
- `GET /api/cursos/:id` - Obtener curso por ID
- `PUT /api/cursos/:id` - Actualizar curso
- `DELETE /api/cursos/:id` - Eliminar curso
- `GET /api/cursos/:id/promedio` - Promedio del curso

### Estudiantes
- `POST /api/estudiantes/:cursoId` - Agregar estudiante
- `GET /api/estudiantes/:cursoId` - Listar estudiantes
- `GET /api/estudiantes/:cursoId/:estudianteId` - Obtener estudiante
- `PUT /api/estudiantes/:cursoId/:estudianteId` - Actualizar estudiante
- `DELETE /api/estudiantes/:cursoId/:estudianteId` - Eliminar estudiante

## Documentación

La documentación completa de la API está disponible en:
```
http://localhost:3000/api-docs
```

## Autenticación

Todas las rutas (excepto registro y login) requieren autenticación JWT:

```javascript
Headers: {
  "Authorization": "Bearer <tu_jwt_token>"
}
```

## Modelo de Datos

### Usuario
```javascript
{
  nombre: String,
  email: String (único),
  password: String (encriptado),
  rol: String (admin|docente),
  activo: Boolean,
  fechaCreacion: Date
}
```

### CursoFarit
```javascript
{
  nombreCurso: String,
  descripcion: String,
  duracionHoras: Number,
  nombreDocente: String,
  fechaRegistro: String,
  estudiantes: [EstudianteSchema],
  creadoPor: ObjectId,
  fechaCreacion: Date,
  activo: Boolean
}
```

### Estudiante (Subdocumento)
```javascript
{
  apellidos: String,
  nombres: String,
  email: String (único por curso),
  notaFinal: Number (0-20),
  fechaCreacion: Date
}
```

## Datos de Prueba

Después de ejecutar el script de seeding:

**Usuarios:**
- Admin: `admin@cursos.com` / `admin123`
- Docente 1: `juan.perez@cursos.com` / `docente123`
- Docente 2: `maria.garcia@cursos.com` / `docente123`

## Seguridad

- Contraseñas encriptadas con bcrypt
- Tokens JWT seguros
- Rate limiting
- Helmet para headers de seguridad
- Validación de datos de entrada
- Sanitización de errores

## Despliegue

### Variables de Entorno de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=tu_jwt_secret_super_seguro
PORT=3000
```

### Scripts Disponibles
```bash
npm start          # Iniciar en producción
npm run dev        # Iniciar en desarrollo
npm run seed       # Poblar base de datos
```