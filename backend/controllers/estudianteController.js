const CursoFarit = require("../models/CursoFarit")

// @desc    Agregar estudiante a curso
// @route   POST /api/estudiantes/:cursoId
// @access  Private
const agregarEstudiante = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.cursoId,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Verificar permisos
    if (curso.creadoPor.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para agregar estudiantes a este curso",
      })
    }

    // Verificar si el email ya existe en el curso
    const emailExiste = curso.estudiantes.some((est) => est.email === req.body.email)
    if (emailExiste) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un estudiante con este email en el curso",
      })
    }

    // Agregar estudiante
    curso.estudiantes.push(req.body)
    await curso.save()

    const estudianteAgregado = curso.estudiantes[curso.estudiantes.length - 1]

    res.status(201).json({
      success: true,
      message: "Estudiante agregado exitosamente",
      data: {
        estudiante: estudianteAgregado,
        totalEstudiantes: curso.estudiantes.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener estudiantes de un curso
// @route   GET /api/estudiantes/:cursoId
// @access  Private
const obtenerEstudiantesCurso = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.cursoId,
      activo: true,
    }).select("nombreCurso estudiantes")

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Filtros opcionales
    let estudiantes = curso.estudiantes

    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase()
      estudiantes = estudiantes.filter(
        (est) =>
          est.nombres.toLowerCase().includes(searchTerm) ||
          est.apellidos.toLowerCase().includes(searchTerm) ||
          est.email.toLowerCase().includes(searchTerm),
      )
    }

    // Ordenamiento
    if (req.query.sortBy) {
      const sortField = req.query.sortBy
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1

      estudiantes.sort((a, b) => {
        if (sortField === "notaFinal") {
          return (a[sortField] - b[sortField]) * sortOrder
        }
        return a[sortField].localeCompare(b[sortField]) * sortOrder
      })
    }

    res.status(200).json({
      success: true,
      data: {
        cursoId: curso._id,
        nombreCurso: curso.nombreCurso,
        estudiantes,
        total: estudiantes.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener estudiante específico
// @route   GET /api/estudiantes/:cursoId/:estudianteId
// @access  Private
const obtenerEstudiante = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.cursoId,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    const estudiante = curso.estudiantes.id(req.params.estudianteId)
    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      })
    }

    res.status(200).json({
      success: true,
      data: {
        cursoId: curso._id,
        nombreCurso: curso.nombreCurso,
        estudiante,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Actualizar estudiante
// @route   PUT /api/estudiantes/:cursoId/:estudianteId
// @access  Private
const actualizarEstudiante = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.cursoId,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Verificar permisos
    if (curso.creadoPor.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para editar estudiantes de este curso",
      })
    }

    const estudiante = curso.estudiantes.id(req.params.estudianteId)
    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      })
    }

    // Verificar email único si se está cambiando
    if (req.body.email && req.body.email !== estudiante.email) {
      const emailExiste = curso.estudiantes.some(
        (est) => est.email === req.body.email && est._id.toString() !== req.params.estudianteId,
      )
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: "Ya existe un estudiante con este email en el curso",
        })
      }
    }

    // Actualizar campos
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        estudiante[key] = req.body[key]
      }
    })

    await curso.save()

    res.status(200).json({
      success: true,
      message: "Estudiante actualizado exitosamente",
      data: { estudiante },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Eliminar estudiante
// @route   DELETE /api/estudiantes/:cursoId/:estudianteId
// @access  Private
const eliminarEstudiante = async (req, res, next) => {
  try {
    const curso = await CursoFarit.findOne({
      _id: req.params.cursoId,
      activo: true,
    })

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: "Curso no encontrado",
      })
    }

    // Verificar permisos
    if (curso.creadoPor.toString() !== req.user.id && req.user.rol !== "admin") {
      return res.status(403).json({
        success: false,
        message: "No tienes permisos para eliminar estudiantes de este curso",
      })
    }

    const estudiante = curso.estudiantes.id(req.params.estudianteId)
    if (!estudiante) {
      return res.status(404).json({
        success: false,
        message: "Estudiante no encontrado",
      })
    }

    // Eliminar estudiante
    curso.estudiantes.pull(req.params.estudianteId)
    await curso.save()

    res.status(200).json({
      success: true,
      message: "Estudiante eliminado exitosamente",
      data: {
        totalEstudiantes: curso.estudiantes.length,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  agregarEstudiante,
  obtenerEstudiantesCurso,
  obtenerEstudiante,
  actualizarEstudiante,
  eliminarEstudiante,
}
