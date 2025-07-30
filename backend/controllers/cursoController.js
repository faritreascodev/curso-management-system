const CursoFarit = require("../models/CursoFarit")

// @desc    Crear nuevo curso
// @route   POST /api/cursos
// @access  Private
const crearCurso = async (req, res, next) => {
  try {
    const cursoData = {
      ...req.body,
      creadoPor: req.user.id,
    }

    const curso = await CursoFarit.create(cursoData)

    res.status(201).json({
      success: true,
      message: "Curso creado exitosamente",
      data: { curso },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener todos los cursos
// @route   GET /api/cursos
// @access  Private
const obtenerCursos = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Filtros opcionales
    const filtros = { activo: true }

    if (req.query.nombreCurso) {
      filtros.nombreCurso = { $regex: req.query.nombreCurso, $options: "i" }
    }

    if (req.query.nombreDocente) {
      filtros.nombreDocente = { $regex: req.query.nombreDocente, $options: "i" }
    }

    const cursos = await CursoFarit.find(filtros)
      .populate("creadoPor", "nombre email")
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit)

    const total = await CursoFarit.countDocuments(filtros)

    res.status(200).json({
      success: true,
      data: {
        cursos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener curso por ID
// @route   GET /api/cursos/:id
// @access  Private
const obtenerCursoPorId = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.id,
      activo: true,
    }).populate("creadoPor", "nombre email")

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Agregar estadísticas del curso
    const estadisticas = curso.obtenerEstadisticas()

    res.status(200).json({
      success: true,
      data: {
        curso,
        estadisticas,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Actualizar curso
// @route   PUT /api/cursos/:id
// @access  Private
const actualizarCurso = async (req, res, next) => {
  try {
    let curso = await CursoFarit.findOne({
      _id: req.params.id,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Verificar permisos (solo el creador o admin puede editar)
    if (curso.creadoPor.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para editar este curso",
      })
    }

    curso = await CursoFarit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("creadoPor", "nombre email")

    res.status(200).json({
      success: true,
      message: "Curso actualizado exitosamente",
      data: { curso },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Eliminar curso (soft delete)
// @route   DELETE /api/cursos/:id
// @access  Private
const eliminarCurso = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.id,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Verificar permisos (solo el creador o admin puede eliminar)
    if (curso.creadoPor.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar este curso",
      })
    }

    // Soft delete
    curso.activo = false
    await curso.save()

    res.status(200).json({
      success: true,
      message: "Curso eliminado exitosamente",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener promedio de notas del curso
// @route   GET /api/cursos/:id/promedio
// @access  Private
const obtenerPromedioCurso = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.id,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    const promedio = curso.calcularPromedioNotas()
    const estadisticas = curso.obtenerEstadisticas()

    res.status(200).json({
      success: true,
      data: {
        cursoId: curso._id,
        nombreCurso: curso.nombreCurso,
        promedio,
        estadisticas,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  crearCurso,
  obtenerCursos,
  obtenerCursoPorId,
  actualizarCurso,
  eliminarCurso,
  obtenerPromedioCurso,
}
