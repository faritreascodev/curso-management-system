const jwt = require("jsonwebtoken")
const Usuario = require("../models/Usuario")

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(" ")[1]

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Obtener usuario del token
      req.user = await Usuario.findById(decoded.id).select("-password")

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Usuario no encontrado",
        })
      }

      if (!req.user.activo) {
        return res.status(401).json({
          success: false,
          message: "Usuario inactivo",
        })
      }

      next()
    } catch (error) {
      console.error("Error en middleware de autenticación:", error)
      return res.status(401).json({
        success: false,
        message: "Token no válido",
      })
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acceso denegado, token requerido",
    })
  }
}

// Middleware para verificar roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({
        success: false,
        message: `Rol ${req.user.rol} no autorizado para acceder a este recurso`,
      })
    }
    next()
  }
}

module.exports = { protect, authorize }
