import api from "./api"

export const estudianteService = {
  // Obtener estudiantes de un curso
  getEstudiantesByCurso: async (cursoId, params = {}) => {
    const response = await api.get(`/estudiantes/${cursoId}`, { params })
    return response.data
  },

  // Obtener estudiante específico
  getEstudianteById: async (cursoId, estudianteId) => {
    const response = await api.get(`/estudiantes/${cursoId}/${estudianteId}`)
    return response.data
  },

  // Agregar estudiante al curso
  addEstudiante: async (cursoId, estudianteData) => {
    const response = await api.post(`/estudiantes/${cursoId}`, estudianteData)
    return response.data
  },

  // Actualizar estudiante
  updateEstudiante: async (cursoId, estudianteId, estudianteData) => {
    const response = await api.put(`/estudiantes/${cursoId}/${estudianteId}`, estudianteData)
    return response.data
  },

  // Eliminar estudiante
  deleteEstudiante: async (cursoId, estudianteId) => {
    const response = await api.delete(`/estudiantes/${cursoId}/${estudianteId}`)
    return response.data
  },
}
