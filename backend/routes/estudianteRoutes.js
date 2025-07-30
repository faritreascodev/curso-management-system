const express = require("express")
const {
  agregarEstudiante,
  obtenerEstudiantesCurso,
  obtenerEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
} = require("../controllers/estudianteController")
const { protect } = require("../middlewares/auth")
const { validateEstudiante, validateEstudianteId, validateCursoId } = require("../middlewares/validation")

const router = express.Router()

// Aplicar middleware de autenticación a todas las rutas
router.use(protect)

/**
 * @swagger
 * /api/estudiantes/{cursoId}:
 *   post:
 *     summary: Agregar estudiante a curso
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudiante'
 *     responses:
 *       201:
 *         description: Estudiante agregado exitosamente
 *       400:
 *         description: Error de validación o email duplicado
 *       404:
 *         description: Curso no encontrado
 *       403:
 *         description: Sin permisos
 *       401:
 *         description: No autorizado
 */
router.post("/:cursoId", validateCursoId, validateEstudiante, agregarEstudiante)

/**
 * @swagger
 * /api/estudiantes/{cursoId}:
 *   get:
 *     summary: Obtener estudiantes de un curso
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por nombre, apellido o email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [nombres, apellidos, email, notaFinal]
 *         description: Campo para ordenar
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Orden ascendente o descendente
 *     responses:
 *       200:
 *         description: Lista de estudiantes del curso
 *       404:
 *         description: Curso no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:cursoId", validateCursoId, obtenerEstudiantesCurso)

/**
 * @swagger
 * /api/estudiantes/{cursoId}/{estudianteId}:
 *   get:
 *     summary: Obtener estudiante específico
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Datos del estudiante
 *       404:
 *         description: Curso o estudiante no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:cursoId/:estudianteId", validateEstudianteId, obtenerEstudiante)

/**
 * @swagger
 * /api/estudiantes/{cursoId}/{estudianteId}:
 *   put:
 *     summary: Actualizar estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Estudiante'
 *     responses:
 *       200:
 *         description: Estudiante actualizado exitosamente
 *       400:
 *         description: Error de validación o email duplicado
 *       404:
 *         description: Curso o estudiante no encontrado
 *       403:
 *         description: Sin permisos
 *       401:
 *         description: No autorizado
 */
router.put("/:cursoId/:estudianteId", validateEstudianteId, validateEstudiante, actualizarEstudiante)

/**
 * @swagger
 * /api/estudiantes/{cursoId}/{estudianteId}:
 *   delete:
 *     summary: Eliminar estudiante
 *     tags: [Estudiantes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cursoId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del curso
 *       - in: path
 *         name: estudianteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estudiante
 *     responses:
 *       200:
 *         description: Estudiante eliminado exitosamente
 *       404:
 *         description: Curso o estudiante no encontrado
 *       403:
 *         description: Sin permisos
 *       401:
 *         description: No autorizado
 */
router.delete("/:cursoId/:estudianteId", validateEstudianteId, eliminarEstudiante)

module.exports = router
