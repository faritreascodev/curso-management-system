"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import FormInput from "../components/FormInput"
import Button from "../components/Button"
import { validators } from "../utils/validators"
import { showAlert } from "../utils/alerts"

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const { login, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || "/dashboard"
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, navigate, location])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        // Validar email
        const emailError = validators.email(formData.email)
        if (emailError) newErrors.email = emailError

        // Validar contraseña
        const passwordError = validators.password(formData.password)
        if (passwordError) newErrors.password = passwordError

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const result = await login(formData.email, formData.password)

            if (result.success) {
                showAlert.success("¡Bienvenido!", `Hola ${result.user.nombre}`)
                const from = location.state?.from?.pathname || "/dashboard"
                navigate(from, { replace: true })
            } else {
                showAlert.error("Error de autenticación", result.message)
            }
        } catch (error) {
            showAlert.error("Error", "Ocurrió un error inesperado")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
                    <p className="mt-2 text-sm text-gray-600">Accede a tu cuenta de CursoFarit</p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="card p-6">
                        <FormInput
                            label="Correo Electrónico"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                            error={errors.email}
                            icon="fas fa-envelope"
                        />

                        <FormInput
                            label="Contraseña"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            error={errors.password}
                            icon="fas fa-lock"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                            icon="fas fa-sign-in-alt"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </Button>
                    </div>

                    {/* Links */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-info-circle mr-2"></i>
                        Credenciales de prueba:
                    </h3>
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>
                            <strong>Admin:</strong> admin@cursos.com / admin123
                        </p>
                        <p>
                            <strong>Docente:</strong> juan.perez@cursos.com / docente123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
