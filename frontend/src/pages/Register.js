"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import FormInput from "../components/FormInput"
import Button from "../components/Button"
import { validators } from "../utils/validators"
import { showAlert } from "../utils/alerts"

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        confirmPassword: "",
        rol: "docente",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    const { register, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    // Redirigir si ya está autenticado
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard", { replace: true })
        }
    }, [isAuthenticated, navigate])

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

        // Validar nombre
        const nombreError = validators.required(formData.nombre, "El nombre")
        if (nombreError) newErrors.nombre = nombreError
        else {
            const lengthError = validators.length(formData.nombre, "El nombre", 2, 50)
            if (lengthError) newErrors.nombre = lengthError
        }

        // Validar email
        const emailError = validators.email(formData.email)
        if (emailError) newErrors.email = emailError

        // Validar contraseña
        const passwordError = validators.password(formData.password)
        if (passwordError) newErrors.password = passwordError

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirma tu contraseña"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)

        try {
            const { confirmPassword, ...userData } = formData
            const result = await register(userData)

            if (result.success) {
                showAlert.success("¡Registro exitoso!", `Bienvenido ${result.user.nombre}`)
                navigate("/dashboard", { replace: true })
            } else {
                showAlert.error("Error en el registro", result.message)
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
                        <i className="fas fa-user-plus text-2xl text-blue-600"></i>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">Crear Cuenta</h2>
                    <p className="mt-2 text-sm text-gray-600">Únete a CursoFarit y gestiona tus cursos</p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="card p-6">
                        <FormInput
                            label="Nombre Completo"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                            required
                            error={errors.nombre}
                            icon="fas fa-user"
                        />

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

                        <div className="mb-4">
                            <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                                Rol
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <i className="fas fa-user-tag text-gray-400"></i>
                                </div>
                                <select
                                    id="rol"
                                    name="rol"
                                    value={formData.rol}
                                    onChange={handleChange}
                                    className="form-input w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 transition-colors duration-200"
                                    required
                                >
                                    <option value="docente">Docente</option>
                                    <option value="admin">Administrador</option>
                                </select>
                            </div>
                        </div>

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

                        <FormInput
                            label="Confirmar Contraseña"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            error={errors.confirmPassword}
                            icon="fas fa-lock"
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            disabled={loading}
                            className="w-full"
                            icon="fas fa-user-plus"
                        >
                            {loading ? "Creando cuenta..." : "Crear Cuenta"}
                        </Button>
                    </div>

                    {/* Links */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            ¿Ya tienes una cuenta?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
