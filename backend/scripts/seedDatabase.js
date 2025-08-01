const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const Usuario = require("../models/Usuario")
const CursoFarit = require("../models/CursoFarit")

const seedDatabase = async () => {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        console.log("Conectado a MongoDB para seeding")

        // Limpiar datos existentes
        await Usuario.deleteMany({})
        await CursoFarit.deleteMany({})
        console.log("Datos existentes eliminados")

        // Crear usuarios de prueba
        const usuarios = [
            {
                nombre: "Administrador Sistema",
                email: "admin@cursos.com",
                password: "admin123",
                rol: "admin",
            },
            {
                nombre: "Juan Pérez Docente",
                email: "juan.perez@cursos.com",
                password: "docente123",
                rol: "docente",
            },
            {
                nombre: "María García Profesora",
                email: "maria.garcia@cursos.com",
                password: "docente123",
                rol: "docente",
            },
        ]

        const usuariosCreados = await Usuario.create(usuarios)
        console.log("Usuarios de prueba creados")

        // Crear cursos de prueba
        const cursos = [
            {
                nombreCurso: "Desarrollo Web Full Stack",
                descripcion:
                    "Curso completo de desarrollo web con tecnologías modernas incluyendo React, Node.js, Express y MongoDB.",
                duracionHoras: 120,
                nombreDocente: "Juan Pérez Docente",
                fechaRegistro: "2024-01-15",
                creadoPor: usuariosCreados[1]._id,
                estudiantes: [
                    {
                        apellidos: "González Martínez",
                        nombres: "Carlos Alberto",
                        email: "carlos.gonzalez@email.com",
                        notaFinal: 9.5,
                    },
                    {
                        apellidos: "López Fernández",
                        nombres: "Ana María",
                        email: "ana.lopez@email.com",
                        notaFinal: 8.0,
                    },
                    {
                        apellidos: "Rodríguez Silva",
                        nombres: "Miguel Ángel",
                        email: "miguel.rodriguez@email.com",
                        notaFinal: 9.8,
                    },
                    {
                        apellidos: "Herrera Castro",
                        nombres: "Lucía Elena",
                        email: "lucia.herrera@email.com",
                        notaFinal: 7.8,
                    },
                    {
                        apellidos: "Moreno Jiménez",
                        nombres: "Pedro Luis",
                        email: "pedro.moreno@email.com",
                        notaFinal: 5.5,
                    },
                ],
            },
            {
                nombreCurso: "Inteligencia Artificial y Machine Learning",
                descripcion: "Introducción práctica a la inteligencia artificial, machine learning y deep learning con Python.",
                duracionHoras: 80,
                nombreDocente: "María García Profesora",
                fechaRegistro: "2024-02-01",
                creadoPor: usuariosCreados[2]._id,
                estudiantes: [
                    {
                        apellidos: "Vargas Mendoza",
                        nombres: "Roberto Carlos",
                        email: "roberto.vargas@email.com",
                        notaFinal: 6.5,
                    },
                    {
                        apellidos: "Jiménez Torres",
                        nombres: "Patricia Isabel",
                        email: "patricia.jimenez@email.com",
                        notaFinal: 9.0,
                    },
                    {
                        apellidos: "Morales Ruiz",
                        nombres: "Diego Fernando",
                        email: "diego.morales@email.com",
                        notaFinal: 8.2,
                    },
                    {
                        apellidos: "Castro Vega",
                        nombres: "Sofía Alejandra",
                        email: "sofia.castro@email.com",
                        notaFinal: 4.8,
                    },
                ],
            },
            {
                nombreCurso: "Diseño UX/UI Avanzado",
                descripcion: "Curso especializado en diseño de experiencia de usuario y interfaces modernas.",
                duracionHoras: 60,
                nombreDocente: "Juan Pérez Docente",
                fechaRegistro: "2024-02-15",
                creadoPor: usuariosCreados[1]._id,
                estudiantes: [
                    {
                        apellidos: "Sánchez Vega",
                        nombres: "Valentina",
                        email: "valentina.sanchez@email.com",
                        notaFinal: 10.0,
                    },
                    {
                        apellidos: "Ramírez Ortega",
                        nombres: "Andrés Felipe",
                        email: "andres.ramirez@email.com",
                        notaFinal: 7.2,
                    },
                    {
                        apellidos: "Torres Mendez",
                        nombres: "Isabella María",
                        email: "isabella.torres@email.com",
                        notaFinal: 5.9,
                    },
                ],
            },
        ]

        await CursoFarit.create(cursos)
        console.log("Cursos de prueba creados")

        console.log("\nBase de datos poblada exitosamente!")
        console.log("\nUsuarios creados:")
        console.log("   Admin: admin@cursos.com / admin123")
        console.log("   Docente 1: juan.perez@cursos.com / docente123")
        console.log("   Docente 2: maria.garcia@cursos.com / docente123")

        process.exit(0)
    } catch (error) {
        console.error("Error poblando la base de datos:", error)
        process.exit(1)
    }
}

// Ejecutar el seeding
seedDatabase()
