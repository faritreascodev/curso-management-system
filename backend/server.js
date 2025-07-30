const app = require("./app")
const connectDB = require("./config/database")

// Conectar a la base de datos
connectDB()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`)
  console.log(`API Docs disponible en: http://localhost:${PORT}/api-docs`)
  console.log(`Entorno: ${process.env.NODE_ENV}`)
})

// Manejo de errores no capturados
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error no manejado: ${err.message}`)
  server.close(() => {
    process.exit(1)
  })
})

process.on("uncaughtException", (err) => {
  console.log(`Excepción no capturada: ${err.message}`)
  process.exit(1)
})
