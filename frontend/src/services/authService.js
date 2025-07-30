import api from "./api"

export const authService = {
    // Iniciar sesión
    login: async (email, password) => {
        const response = await api.post("/auth/login", { email, password })
        return response.data
    },

    // Registrar usuario
    register: async (userData) => {
        const response = await api.post("/auth/register", userData)
        return response.data
    },

    // Obtener usuario actual
    getCurrentUser: async () => {
        const response = await api.get("/auth/me")
        return response.data.data.usuario
    },

    // Cerrar sesión (limpiar token local)
    logout: () => {
        localStorage.removeItem("token")
    },
}
