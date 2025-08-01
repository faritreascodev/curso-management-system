const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

// Importar rutas
const authRoutes = require("./routes/authRoutes")
const cursoRoutes = require("./routes/cursoRoutes")
const estudianteRoutes = require("./routes/estudianteRoutes")

// Importar middleware de errores
const errorHandler = require("./middlewares/errorHandler")

// Importar configuración de Swagger
const swaggerSetup = require("./swagger/swaggerConfig")

const app = express()

// Middleware de seguridad
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: "Demasiadas peticiones desde esta IP, intenta de nuevo en 15 minutos.",
  },
})
app.use("/api/", limiter)

// CORS
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://faritreasco.com" : "*",
    credentials: true,
  }),
)

// Body parser
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Swagger Documentation
swaggerSetup(app)

// Rutas principales
app.use("/api/auth", authRoutes)
app.use("/api/cursos", cursoRoutes)
app.use("/api/estudiantes", estudianteRoutes)

// Ruta de salud del servidor
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
})

// Ruta 404
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta ${req.originalUrl} no encontrada`,
  })
})

// Middleware de manejo de errores (notaaa: debe ir al final)
app.use(errorHandler)

module.exports = app
