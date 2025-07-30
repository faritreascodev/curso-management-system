const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`MongoDB conectado: ${conn.connection.host}`)
    console.log(`Base de datos: ${conn.connection.name}`)
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message)
    process.exit(1)
  }
}

// Eventos de conexión
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB desconectado")
})

mongoose.connection.on("error", (err) => {
  console.error("Error de MongoDB:", err)
})

module.exports = connectDB
