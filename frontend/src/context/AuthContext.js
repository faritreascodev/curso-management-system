"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import { isTokenValid } from "../utils/tokenUtils"

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de AuthProvider")
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Verificar autenticación al cargar la aplicación
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem("token")

                if (token && isTokenValid(token)) {
                    // Obtener datos del usuario actual
                    const userData = await authService.getCurrentUser()
                    setUser(userData)
                    setIsAuthenticated(true)
                } else {
                    // Token inválido o expirado
                    localStorage.removeItem("token")
                    setUser(null)
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error("Error verificando autenticación:", error)
                localStorage.removeItem("token")
                setUser(null)
                setIsAuthenticated(false)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password)
            const { token, usuario } = response.data

            // Guardar token en localStorage
            localStorage.setItem("token", token)

            // Actualizar estado
            setUser(usuario)
            setIsAuthenticated(true)

            return { success: true, user: usuario }
        } catch (error) {
            console.error("Error en login:", error)
            return {
                success: false,
                message: error.response?.data?.message || "Error al iniciar sesión",
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await authService.register(userData)
            const { token, usuario } = response.data

            // Guardar token en localStorage
            localStorage.setItem("token", token)

            // Actualizar estado
            setUser(usuario)
            setIsAuthenticated(true)

            return { success: true, user: usuario }
        } catch (error) {
            console.error("Error en registro:", error)
            return {
                success: false,
                message: error.response?.data?.message || "Error al registrar usuario",
            }
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        setIsAuthenticated(false)
    }

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
