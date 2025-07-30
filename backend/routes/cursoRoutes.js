const express = require("express")
const {
  crearCurso,
  obtenerCursos,
  obtenerCursoPorId,
  actualizarCurso,
  eliminarCurso,
  obtenerPromedioCurso,
} = require("../controllers/cursoController")
const { protect } = require("../middlewares/auth")
const { validateCurso, validateObjectId } = require("../middlewares/validation")

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     CursoFarit:
 *       type: object
 *       required:
 *         - nombreCurso
 *         - descripcion
 *         - duracionHoras
 *         - nombreDocente
 *         - fechaRegistro
 *       properties:
 *         nombreCurso:
 *           type: string
 *           maxLength: 200
 *           description: Nombre del curso
 *         descripcion:
 *           type: string
 *           maxLength: 1000
 *           description: Descripción del curso
 *         duracionHoras:
 *           type: number
 *           minimum: 1
 *           maximum: 1000
 *           description: Duración del curso en horas
 *         nombreDocente:
 *           type: string
 *           maxLength: 200
 *           description: Nombre del docente
 *         fechaRegistro:
 *           type: string
 *           description: Fecha de registro del curso
 *         estudiantes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Estudiante'
 *     Estudiante:
 *       type: object
 *       required:
 *         - apellidos
 *         - nombres
 *         - email
 *       properties:
 *         apellidos:
 *           type: string
 *           maxLength: 100
 *         nombres:
 *           type: string
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *         notaFinal:
 *           type: number
 *           minimum: 0
 *           maximum: 10
 *           default: 0
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 */

// Aplicar middleware de autenticación a todas las rutas
router.use(protect)

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear nuevo curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoFarit'
 *     responses:
 *       201:
 *         description: Curso creado exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post("/", validateCurso, crearCurso)

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Obtener todos los cursos
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Elementos por página
 *       - in: query
 *         name: nombreCurso
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del curso
 *       - in: query
 *         name: nombreDocente
 *         schema:
 *           type: string
 *         description: Filtrar por nombre del docente
 *     responses:
 *       200:
 *         description: Lista de cursos
 *       401:
 *         description: No autorizado
 */
router.get("/", obtenerCursos)

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtener curso por ID
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Datos del curso
 *       404:
 *         description: Curso no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", validateObjectId, obtenerCursoPorId)

/**
 * @swagger
 * /api/cursos/{id}:
 *   put:
 *     summary: Actualizar curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CursoFarit'
 *     responses:
 *       200:
 *         description: Curso actualizado exitosamente
 *       404:
 *         description: Curso no encontrado
 *       403:
 *         description: Sin permisos
 *       401:
 *         description: No autorizado
 */
router.put("/:id", validateObjectId, validateCurso, actualizarCurso)

/**
 * @swagger
 * /api/cursos/{id}:
 *   delete:
 *     summary: Eliminar curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Curso eliminado exitosamente
 *       404:
 *         description: Curso no encontrado
 *       403:
 *         description: Sin permisos
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", validateObjectId, eliminarCurso)

/**
 * @swagger
 * /api/cursos/{id}/promedio:
 *   get:
 *     summary: Obtener promedio de notas del curso
 *     tags: [Cursos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     responses:
 *       200:
 *         description: Promedio y estadísticas del curso
 *       404:
 *         description: Curso no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id/promedio", validateObjectId, obtenerPromedioCurso)

module.exports = router
