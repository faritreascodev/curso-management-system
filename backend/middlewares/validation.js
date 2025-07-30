const { body, param, validationResult } = require("express-validator")
const mongoose = require("mongoose")

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array(),
    })
  }
  next()
}

// Validaciones para autenticación
const validateRegister = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),

  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),

  body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol").optional().isIn(["admin", "docente"]).withMessage("El rol debe ser admin o docente"),

  handleValidationErrors,
]

const validateLogin = [
  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es obligatoria"),

  handleValidationErrors,
]

// Validaciones para cursos
const validateCurso = [
  body("nombreCurso")
    .trim()
    .notEmpty()
    .withMessage("El nombre del curso es obligatorio")
    .isLength({ max: 200 })
    .withMessage("El nombre del curso no puede exceder 200 caracteres"),

  body("descripcion")
    .trim()
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede exceder 1000 caracteres"),

  body("duracionHoras").isInt({ min: 1, max: 1000 }).withMessage("La duración debe ser un número entre 1 y 1000 horas"),

  body("nombreDocente")
    .trim()
    .notEmpty()
    .withMessage("El nombre del docente es obligatorio")
    .isLength({ max: 200 })
    .withMessage("El nombre del docente no puede exceder 200 caracteres"),

  body("fechaRegistro").notEmpty().withMessage("La fecha de registro es obligatoria"),

  handleValidationErrors,
]

// Validaciones para estudiantes
const validateEstudiante = [
  body("apellidos")
    .trim()
    .notEmpty()
    .withMessage("Los apellidos son obligatorios")
    .isLength({ max: 100 })
    .withMessage("Los apellidos no pueden exceder 100 caracteres"),

  body("nombres")
    .trim()
    .notEmpty()
    .withMessage("Los nombres son obligatorios")
    .isLength({ max: 100 })
    .withMessage("Los nombres no pueden exceder 100 caracteres"),

  body("email").isEmail().withMessage("Debe ser un email válido").normalizeEmail(),

  body("notaFinal").optional().isFloat({ min: 0, max: 10 }).withMessage("La nota debe ser un número entre 0 y 10"),

  handleValidationErrors,
]

// Validación para parámetros de ID
const validateObjectId = [
  param("id").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("ID no válido")
    }
    return true
  }),
  handleValidationErrors,
]

const validateCursoId = [
  param("cursoId").custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error("ID de curso no válido")
    }
    return true
  }),
  handleValidationErrors,
]

const validateEstudianteId = [
  param("cursoId").isMongoId().withMessage("ID de curso no válido"),

  param("estudianteId").isMongoId().withMessage("ID de estudiante no válido"),

  handleValidationErrors,
]

module.exports = {
  validateRegister,
  validateLogin,
  validateCurso,
  validateEstudiante,
  validateObjectId,
  validateCursoId,
  validateEstudianteId,
  handleValidationErrors,
}
