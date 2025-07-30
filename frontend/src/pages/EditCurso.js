"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { cursoService } from "../services/cursoService"
import { useAuth } from "../context/AuthContext"
import FormInput from "../components/FormInput"
import Button from "../components/Button"
import Loading from "../components/Loading"
import { validators } from "../utils/validators"
import { showAlert } from "../utils/alerts"

const EditCurso = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [curso, setCurso] = useState(null)
    const [formData, setFormData] = useState({
        nombreCurso: "",
        descripcion: "",
        duracionHoras: "",
        nombreDocente: "",
        fechaRegistro: "",
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadCurso()
    }, [id])

    const loadCurso = async () => {
        try {
            setLoading(true)
            const response = await cursoService.getCursoById(id)
            const cursoData = response.data.curso

            // Verificar permisos
            if (cursoData.creadoPor !== user?.id && user?.rol !== "admin") {
                showAlert.error("Sin permisos", "No tienes permisos para editar este curso")
                navigate("/dashboard")
                return
            }

            setCurso(cursoData)
            setFormData({
                nombreCurso: cursoData.nombreCurso,
                descripcion: cursoData.descripcion,
                duracionHoras: cursoData.duracionHoras.toString(),
                nombreDocente: cursoData.nombreDocente,
                fechaRegistro: cursoData.fechaRegistro,
            })
        } catch (error) {
            console.error("Error cargando curso:", error)
            showAlert.error("Error", "No se pudo cargar el curso")
            navigate("/dashboard")
        } finally {
            setLoading(false)
        }
    }

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

        // Validar nombre del curso
        const nombreError = validators.required(formData.nombreCurso, "El nombre del curso")
        if (nombreError) {
            newErrors.nombreCurso = nombreError
        } else {
            const lengthError = validators.length(formData.nombreCurso, "El nombre del curso", 3, 200)
            if (lengthError) newErrors.nombreCurso = lengthError
        }

        // Validar descripción
        const descripcionError = validators.required(formData.descripcion, "La descripción")
        if (descripcionError) {
            newErrors.descripcion = descripcionError
        } else {
            const lengthError = validators.length(formData.descripcion, "La descripción", 10, 1000)
            if (lengthError) newErrors.descripcion = lengthError
        }

        // Validar duración
        const duracionError = validators.number(formData.duracionHoras, "La duración", 1, 1000)
        if (duracionError) newErrors.duracionHoras = duracionError

        // Validar nombre del docente
        const docenteError = validators.required(formData.nombreDocente, "El nombre del docente")
        if (docenteError) {
            newErrors.nombreDocente = docenteError
        } else {
            const lengthError = validators.length(formData.nombreDocente, "El nombre del docente", 3, 200)
            if (lengthError) newErrors.nombreDocente = lengthError
        }

        // Validar fecha de registro
        const fechaError = validators.required(formData.fechaRegistro, "La fecha de registro")
        if (fechaError) newErrors.fechaRegistro = fechaError

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setSubmitting(true)

        try {
            const cursoData = {
                ...formData,
                duracionHoras: Number.parseInt(formData.duracionHoras),
            }

            await cursoService.updateCurso(id, cursoData)

            showAlert.success("¡Curso actualizado!", "El curso ha sido actualizado exitosamente")
            navigate(`/cursos/${id}`)
        } catch (error) {
            console.error("Error actualizando curso:", error)
            const message = error.response?.data?.message || "Error al actualizar el curso"
            showAlert.error("Error", message)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return <Loading message="Cargando curso..." />
    }

    if (!curso) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Curso no encontrado</h2>
                <Link to="/dashboard">
                    <Button variant="primary" className="mt-4">
                        Volver al Dashboard
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                    <li>
                        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <i className="fas fa-chevron-right text-gray-400"></i>
                    </li>
                    <li>
                        <Link to={`/cursos/${id}`} className="text-gray-500 hover:text-gray-700">
                            {curso.nombreCurso}
                        </Link>
                    </li>
                    <li>
                        <i className="fas fa-chevron-right text-gray-400"></i>
                    </li>
                    <li className="text-gray-900 font-medium">Editar</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                    <i className="fas fa-edit text-blue-600 text-xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
                <p className="mt-2 text-gray-600">Modifica la información del curso</p>
            </div>

            {/* Form */}
            <div className="card p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormInput
                        label="Nombre del Curso"
                        name="nombreCurso"
                        value={formData.nombreCurso}
                        onChange={handleChange}
                        placeholder="Ej: Desarrollo Web Full Stack"
                        required
                        error={errors.nombreCurso}
                        icon="fas fa-book"
                    />

                    <div className="mb-4">
                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <i className="fas fa-align-left text-gray-400"></i>
                            </div>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe el contenido y objetivos del curso..."
                                required
                                rows={4}
                                className={`form-input w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 ${errors.descripcion ? "border-red-300 focus:border-red-500" : "border-gray-300 focus:border-blue-500"
                                    }`}
                            />
                        </div>
                        {errors.descripcion && (
                            <p className="mt-1 text-sm text-red-600">
                                <i className="fas fa-exclamation-circle mr-1"></i>
                                {errors.descripcion}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            label="Duración (horas)"
                            type="number"
                            name="duracionHoras"
                            value={formData.duracionHoras}
                            onChange={handleChange}
                            placeholder="40"
                            required
                            min="1"
                            max="1000"
                            error={errors.duracionHoras}
                            icon="fas fa-clock"
                        />

                        <FormInput
                            label="Fecha de Registro"
                            type="date"
                            name="fechaRegistro"
                            value={formData.fechaRegistro}
                            onChange={handleChange}
                            required
                            error={errors.fechaRegistro}
                            icon="fas fa-calendar"
                        />
                    </div>

                    <FormInput
                        label="Nombre del Docente"
                        name="nombreDocente"
                        value={formData.nombreDocente}
                        onChange={handleChange}
                        placeholder="Ej: Dr. Juan Pérez"
                        required
                        error={errors.nombreDocente}
                        icon="fas fa-user-tie"
                    />

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                        <Link to={`/cursos/${id}`}>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={submitting}
                                className="w-full sm:w-auto bg-transparent"
                                icon="fas fa-times"
                            >
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={submitting}
                            disabled={submitting}
                            className="w-full sm:w-auto"
                            icon="fas fa-save"
                        >
                            {submitting ? "Guardando cambios..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Course Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <i className="fas fa-info-circle text-gray-400"></i>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-800">Información del curso</h3>
                        <div className="mt-2 text-sm text-gray-600">
                            <p>
                                <strong>Creado:</strong> {new Date(curso.fechaCreacion).toLocaleDateString("es-ES")}
                            </p>
                            <p>
                                <strong>Estudiantes:</strong> {curso.estudiantes?.length || 0}
                            </p>
                            <p>
                                <strong>ID:</strong> {curso._id}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCurso
