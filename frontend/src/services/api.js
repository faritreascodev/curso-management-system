import axios from "axios"

// Configuración base de Axios
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        // Si el token es inválido o expiró, redirigir a login
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/login"
        }

        return Promise.reject(error)
    },
)

export default api
