import api from "./api"

export const cursoService = {
    // Obtener todos los cursos
    getCursos: async (params = {}) => {
        const response = await api.get("/cursos", { params })
        return response.data
    },

    // Obtener curso por ID
    getCursoById: async (id) => {
        const response = await api.get(`/cursos/${id}`)
        return response.data
    },

    // Crear nuevo curso
    createCurso: async (cursoData) => {
        const response = await api.post("/cursos", cursoData)
        return response.data
    },

    // Actualizar curso
    updateCurso: async (id, cursoData) => {
        const response = await api.put(`/cursos/${id}`, cursoData)
        return response.data
    },

    // Eliminar curso
    deleteCurso: async (id) => {
        const response = await api.delete(`/cursos/${id}`)
        return response.data
    },

    // Obtener promedio del curso
    getCursoPromedio: async (id) => {
        const response = await api.get(`/cursos/${id}/promedio`)
        return response.data
    },
}
