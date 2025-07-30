const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Curso Management System API",
      version: "1.0.0",
      description: "API completa para el sistema de gestión de cursos",
      contact: {
        name: "Soporte API By Farit Reasco",
        email: "areasco1306nnca@gmail.com",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://cursosfarit.com"
            : `http://localhost:${process.env.PORT || 3000}`,
        description: process.env.NODE_ENV === "production" ? "Servidor de Producción" : "Servidor de Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa tu token JWT en el formato: Bearer {token}",
        },
      },
      responses: {
        UnauthorizedError: {
          description: "Token de acceso faltante o inválido",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Acceso denegado, token requerido",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Error de validación de datos",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Errores de validación",
                  },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: {
                          type: "string",
                        },
                        message: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: "Recurso no encontrado",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Recurso no encontrado",
                  },
                },
              },
            },
          },
        },
        ServerError: {
          description: "Error interno del servidor",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Error interno del servidor",
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Autenticación",
        description: "Endpoints para registro, login y gestión de usuarios",
      },
      {
        name: "Cursos",
        description: "CRUD completo de cursos",
      },
      {
        name: "Estudiantes",
        description: "Gestión de estudiantes dentro de los cursos",
      },
    ],
  },
  apis: ["./routes/*.js"], // Rutas donde están los comentarios de Swagger
}

const specs = swaggerJsdoc(options)

const swaggerSetup = (app) => {
  // Configuración personalizada de Swagger UI
  const swaggerOptions = {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 5px; }
    `,
    customSiteTitle: "Curso Management API Docs",
    // customfavIcon: "/favicon.ico",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
  }

  // Ruta para la documentación
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions))

  // Ruta para obtener el JSON de Swagger
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json")
    res.send(specs)
  })

  console.log("Swagger configurado correctamente")
  console.log(`Documentación disponible en: /api-docs`)
}

module.exports = swaggerSetup