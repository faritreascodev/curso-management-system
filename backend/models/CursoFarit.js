const mongoose = require("mongoose")

const estudianteSchema = new mongoose.Schema({
  apellidos: {
    type: String,
    required: [true, "Los apellidos son obligatorios"],
    trim: true,
    maxlength: [100, "Los apellidos no pueden exceder 100 caracteres"],
  },
  nombres: {
    type: String,
    required: [true, "Los nombres son obligatorios"],
    trim: true,
    maxlength: [100, "Los nombres no pueden exceder 100 caracteres"],
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Por favor ingresa un email válido"],
  },
  notaFinal: {
    type: Number,
    min: [0, "La nota no puede ser menor a 0"],
    max: [10, "La nota no puede ser mayor a 10"],
    default: 0,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
})

const cursoFaritSchema = new mongoose.Schema({
  nombreCurso: {
    type: String,
    required: [true, "El nombre del curso es obligatorio"],
    trim: true,
    maxlength: [200, "El nombre del curso no puede exceder 200 caracteres"],
  },
  descripcion: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    trim: true,
    maxlength: [1000, "La descripción no puede exceder 1000 caracteres"],
  },
  duracionHoras: {
    type: Number,
    required: [true, "La duración en horas es obligatoria"],
    min: [1, "La duración debe ser al menos 1 hora"],
    max: [1000, "La duración no puede exceder 1000 horas"],
  },
  nombreDocente: {
    type: String,
    required: [true, "El nombre del docente es obligatorio"],
    trim: true,
    maxlength: [200, "El nombre del docente no puede exceder 200 caracteres"],
  },
  fechaRegistro: {
    type: String,
    required: [true, "La fecha de registro es obligatoria"],
  },
  estudiantes: [estudianteSchema],
  creadoPor: {
    type: mongoose.Schema.ObjectId,
    ref: "Usuario",
    required: true,
  },
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
  activo: {
    type: Boolean,
    default: true,
  },
})

// Índice para mejorar rendimiento en búsquedas
cursoFaritSchema.index({ nombreCurso: 1, activo: 1 })
cursoFaritSchema.index({ nombreDocente: 1 })

// Validación personalizada para email único por curso
cursoFaritSchema.pre("save", function (next) {
  const emails = this.estudiantes.map((est) => est.email)
  const emailsUnicos = [...new Set(emails)]

  if (emails.length !== emailsUnicos.length) {
    const error = new Error("No puede haber emails duplicados en el mismo curso")
    error.name = "ValidationError"
    return next(error)
  }

  next()
})

// Método para calcular promedio de notas
cursoFaritSchema.methods.calcularPromedioNotas = function () {
  if (this.estudiantes.length === 0) return 0

  const sumaNotas = this.estudiantes.reduce((suma, estudiante) => suma + estudiante.notaFinal, 0)
  return Math.round((sumaNotas / this.estudiantes.length) * 100) / 100
}

// Método para obtener estadísticas del curso
cursoFaritSchema.methods.obtenerEstadisticas = function () {
  const estudiantes = this.estudiantes
  const totalEstudiantes = estudiantes.length

  if (totalEstudiantes === 0) {
    return {
      totalEstudiantes: 0,
      promedio: 0,
      notaMaxima: 0,
      notaMinima: 0,
      aprobados: 0,
      desaprobados: 0,
    }
  }

  const notas = estudiantes.map((est) => est.notaFinal)
  const promedio = this.calcularPromedioNotas()
  const notaMaxima = Math.max(...notas)
  const notaMinima = Math.min(...notas)
  const aprobados = estudiantes.filter((est) => est.notaFinal >= 7).length
  const desaprobados = totalEstudiantes - aprobados

  return {
    totalEstudiantes,
    promedio,
    notaMaxima,
    notaMinima,
    aprobados,
    desaprobados,
  }
}

module.exports = mongoose.model("CursoFarit", cursoFaritSchema)
