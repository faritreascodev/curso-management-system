"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { cursoService } from "../services/cursoService"
import FormInput from "../components/FormInput"
import Button from "../components/Button"
import { validators } from "../utils/validators"
import { showAlert } from "../utils/alerts"

const CreateCurso = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        nombreCurso: "",
        descripcion: "",
        duracionHoras: "",
        nombreDocente: "",
        fechaRegistro: new Date().toISOString().split("T")[0], // Fecha actual
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

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

        setLoading(true)

        try {
            const cursoData = {
                ...formData,
                duracionHoras: Number.parseInt(formData.duracionHoras),
            }

            const response = await cursoService.createCurso(cursoData)

            showAlert.success("¡Curso creado!", "El curso ha sido creado exitosamente")
            navigate(`/cursos/${response.data.curso._id}`)
        } catch (error) {
            console.error("Error creando curso:", error)
            const message = error.response?.data?.message || "Error al crear el curso"
            showAlert.error("Error", message)
        } finally {
            setLoading(false)
        }
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
                    <li className="text-gray-900 font-medium">Crear Curso</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="text-center mb-8">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 mb-4">
                    <i className="fas fa-plus text-blue-600 text-xl"></i>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Curso</h1>
                <p className="mt-2 text-gray-600">Completa la información para crear un nuevo curso</p>
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
                        <Link to="/dashboard">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={loading}
                                className="w-full sm:w-auto bg-transparent"
                                icon="fas fa-times"
                            >
                                Cancelar
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            className="w-full sm:w-auto"
                            icon="fas fa-save"
                        >
                            {loading ? "Creando curso..." : "Crear Curso"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Help Text */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <i className="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Consejos para crear un buen curso</h3>
                        <div className="mt-2 text-sm text-blue-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Usa un nombre descriptivo y claro para el curso</li>
                                <li>Incluye los objetivos principales en la descripción</li>
                                <li>Especifica la duración realista del curso</li>
                                <li>Después de crear el curso podrás agregar estudiantes</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCurso
