const Usuario = require("../models/Usuario")
const { generateToken } = require("../config/jwt")

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email })
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El usuario ya existe con este email",
      })
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol: rol || "docente",
    })

    // Generar token
    const token = generateToken({ id: usuario._id })

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Verificar si el usuario existe y obtener la contraseña
    const usuario = await Usuario.findOne({ email }).select("+password")
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        success: false,
        message: "Usuario inactivo",
      })
    }

    // Verificar contraseña
    const isMatch = await usuario.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Generar token
    const token = generateToken({ id: usuario._id })

    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        token,
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener perfil del usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: {
        usuario: {
          id: usuario._id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
          fechaCreacion: usuario.fechaCreacion,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  register,
  login,
  getMe,
}
