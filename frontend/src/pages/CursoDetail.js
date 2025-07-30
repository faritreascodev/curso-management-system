"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { cursoService } from "../services/cursoService"
import { estudianteService } from "../services/estudianteService"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/Loading"
import Button from "../components/Button"
import Modal from "../components/Modal"
import FormInput from "../components/FormInput"
import { showAlert } from "../utils/alerts"
import { validators } from "../utils/validators"
import classNames from "classnames"

const CursoDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [curso, setCurso] = useState(null)
    const [estudiantes, setEstudiantes] = useState([])
    const [estadisticas, setEstadisticas] = useState(null)
    const [loading, setLoading] = useState(true)
    const [loadingEstudiantes, setLoadingEstudiantes] = useState(false)

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [selectedEstudiante, setSelectedEstudiante] = useState(null)

    // Form states
    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        email: "",
        notaFinal: "",
    })
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)

    // Search and filters
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("nombres")
    const [sortOrder, setSortOrder] = useState("asc")

    useEffect(() => {
        loadCursoDetail()
    }, [id])

    useEffect(() => {
        if (curso) {
            loadEstudiantes()
        }
    }, [curso, searchTerm, sortBy, sortOrder])

    const loadCursoDetail = async () => {
        try {
            setLoading(true)
            const response = await cursoService.getCursoById(id)
            setCurso(response.data.curso)
            setEstadisticas(response.data.estadisticas)
        } catch (error) {
            console.error("Error cargando curso:", error)
            showAlert.error("Error", "No se pudo cargar el curso")
            navigate("/dashboard")
        } finally {
            setLoading(false)
        }
    }

    const loadEstudiantes = async () => {
        try {
            setLoadingEstudiantes(true)
            const params = {}
            if (searchTerm) params.search = searchTerm
            if (sortBy) params.sortBy = sortBy
            if (sortOrder) params.sortOrder = sortOrder

            const response = await estudianteService.getEstudiantesByCurso(id, params)
            setEstudiantes(response.data.estudiantes)
        } catch (error) {
            console.error("Error cargando estudiantes:", error)

            // Mostrar error más específico
            const errorMessage = error.response?.data?.message || "No se pudieron cargar los estudiantes"
            showAlert.error("Error", errorMessage)

            // Si es error 400, podría ser problema de ID
            if (error.response?.status === 400) {
                console.log("ID del curso:", id)
                console.log("¿Es válido el ID?", /^[0-9a-fA-F]{24}$/.test(id))
            }
        } finally {
            setLoadingEstudiantes(false)
        }
    }

    const resetForm = () => {
        setFormData({
            nombres: "",
            apellidos: "",
            email: "",
            notaFinal: "",
        })
        setErrors({})
        setSelectedEstudiante(null)
    }

    const handleOpenAddModal = () => {
        resetForm()
        setShowAddModal(true)
    }

    const handleOpenEditModal = (estudiante) => {
        setFormData({
            nombres: estudiante.nombres,
            apellidos: estudiante.apellidos,
            email: estudiante.email,
            notaFinal: estudiante.notaFinal.toString(),
        })
        setSelectedEstudiante(estudiante)
        setErrors({})
        setShowEditModal(true)
    }

    const handleCloseModals = () => {
        setShowAddModal(false)
        setShowEditModal(false)
        resetForm()
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        const nombresError = validators.required(formData.nombres, "Los nombres")
        if (nombresError) newErrors.nombres = nombresError

        const apellidosError = validators.required(formData.apellidos, "Los apellidos")
        if (apellidosError) newErrors.apellidos = apellidosError

        const emailError = validators.email(formData.email)
        if (emailError) newErrors.email = emailError

        if (formData.notaFinal) {
            const notaError = validators.number(formData.notaFinal, "La nota final", 0, 10)
            if (notaError) newErrors.notaFinal = notaError
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmitEstudiante = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setSubmitting(true)

        try {
            const estudianteData = {
                ...formData,
                notaFinal: formData.notaFinal ? Number.parseFloat(formData.notaFinal) : 0,
            }

            if (selectedEstudiante) {
                // Editar estudiante
                await estudianteService.updateEstudiante(id, selectedEstudiante._id, estudianteData)
                showAlert.success("¡Actualizado!", "Estudiante actualizado exitosamente")
            } else {
                // Agregar estudiante
                await estudianteService.addEstudiante(id, estudianteData)
                showAlert.success("¡Agregado!", "Estudiante agregado exitosamente")
            }

            handleCloseModals()
            loadEstudiantes()
            loadCursoDetail() // Recargar para actualizar estadísticas
        } catch (error) {
            console.error("Error guardando estudiante:", error)
            const message = error.response?.data?.message || "Error al guardar el estudiante"
            showAlert.error("Error", message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteEstudiante = async (estudiante) => {
        const result = await showAlert.confirmDelete(
            "¿Eliminar estudiante?",
            `¿Estás seguro de que deseas eliminar a ${estudiante.nombres} ${estudiante.apellidos}?`,
        )

        if (result.isConfirmed) {
            try {
                await estudianteService.deleteEstudiante(id, estudiante._id)
                showAlert.success("¡Eliminado!", "Estudiante eliminado exitosamente")
                loadEstudiantes()
                loadCursoDetail() // Recargar para actualizar estadísticas
            } catch (error) {
                console.error("Error eliminando estudiante:", error)
                showAlert.error("Error", "No se pudo eliminar el estudiante")
            }
        }
    }

    const getNotaColor = (nota) => {
        if (nota >= 7) return "text-green-600 bg-green-100"
        if (nota >= 5) return "text-yellow-600 bg-yellow-100"
        return "text-red-600 bg-red-100"
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
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

    const canEdit = curso.creadoPor === user?.id || user?.rol === "admin"

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-4">
                    <li>
                        <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <i className="fas fa-chevron-right text-gray-400"></i>
                    </li>
                    <li className="text-gray-900 font-medium">Detalles del Curso</li>
                </ol>
            </nav>

            {/* Course Header */}
            <div className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">{curso.nombreCurso}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <i className="fas fa-user-tie mr-2"></i>
                                    <strong>Docente:</strong> {curso.nombreDocente}
                                </p>
                                <p className="text-sm text-gray-600 mb-2">
                                    <i className="fas fa-clock mr-2"></i>
                                    <strong>Duración:</strong> {curso.duracionHoras} horas
                                </p>
                                <p className="text-sm text-gray-600">
                                    <i className="fas fa-calendar mr-2"></i>
                                    <strong>Fecha de registro:</strong> {curso.fechaRegistro}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <i className="fas fa-calendar-plus mr-2"></i>
                                    <strong>Creado:</strong> {formatDate(curso.fechaCreacion)}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <i className="fas fa-user mr-2"></i>
                                    <strong>Creado por:</strong> {curso.creadoPor?.nombre || "Usuario"}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
                            <p className="text-gray-600">{curso.descripcion}</p>
                        </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                        <div className="flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                            {canEdit && (
                                <Link to={`/cursos/${curso._id}/editar`}>
                                    <Button variant="outline" icon="fas fa-edit" className="w-full bg-transparent">
                                        Editar Curso
                                    </Button>
                                </Link>
                            )}
                            <Link to="/dashboard">
                                <Button variant="secondary" icon="fas fa-arrow-left" className="w-full">
                                    Volver
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            {estadisticas && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{estadisticas.totalEstudiantes}</div>
                        <div className="text-sm text-gray-600">Estudiantes</div>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{estadisticas.promedio || "N/A"}</div>
                        <div className="text-sm text-gray-600">Promedio</div>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{estadisticas.aprobados}</div>
                        <div className="text-sm text-gray-600">Aprobados</div>
                    </div>
                    <div className="card p-4 text-center">
                        <div className="text-2xl font-bold text-red-600">{estadisticas.desaprobados}</div>
                        <div className="text-sm text-gray-600">Reprobados</div>
                    </div>
                </div>
            )}

            {/* Students Section */}
            <div className="card">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Estudiantes</h2>
                        {canEdit && (
                            <Button variant="primary" icon="fas fa-user-plus" onClick={handleOpenAddModal} className="mt-4 sm:mt-0">
                                Agregar Estudiante
                            </Button>
                        )}
                    </div>

                    {/* Search and Sort */}
                    <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar estudiantes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="form-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 transition-colors duration-200"
                            />
                        </div>

                        <div className="flex space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="form-input px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 transition-colors duration-200"
                            >
                                <option value="nombres">Ordenar por Nombres</option>
                                <option value="apellidos">Ordenar por Apellidos</option>
                                <option value="email">Ordenar por Email</option>
                                <option value="notaFinal">Ordenar por Nota</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            >
                                <i className={`fas fa-sort-${sortOrder === "asc" ? "up" : "down"}`}></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {loadingEstudiantes ? (
                        <Loading message="Cargando estudiantes..." />
                    ) : estudiantes.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                                <i className="fas fa-users text-gray-400 text-xl"></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay estudiantes</h3>
                            <p className="text-gray-600 mb-6">
                                {searchTerm ? "No se encontraron estudiantes con ese término" : "Este curso aún no tiene estudiantes"}
                            </p>
                            {canEdit && (
                                <Button variant="primary" icon="fas fa-user-plus" onClick={handleOpenAddModal}>
                                    Agregar Primer Estudiante
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estudiante
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nota Final
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Estado
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        {canEdit && (
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {estudiantes.map((estudiante) => (
                                        <tr key={estudiante._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <span className="text-blue-600 text-sm font-medium">
                                                            {estudiante.nombres.charAt(0)}
                                                            {estudiante.apellidos.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {estudiante.nombres} {estudiante.apellidos}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{estudiante.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={classNames(
                                                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                                        getNotaColor(estudiante.notaFinal),
                                                    )}
                                                >
                                                    {estudiante.notaFinal.toFixed(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={classNames(
                                                        "inline-flex px-2 py-1 text-xs font-semibold rounded-full",
                                                        estudiante.notaFinal >= 7 ? "text-green-800 bg-green-100" : "text-red-800 bg-red-100",
                                                    )}
                                                >
                                                    {estudiante.notaFinal >= 7 ? "Aprobado" : "Reprobado"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(estudiante.fechaCreacion)}
                                            </td>
                                            {canEdit && (
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleOpenEditModal(estudiante)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEstudiante(estudiante)}
                                                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Student Modal */}
            <Modal isOpen={showAddModal} onClose={handleCloseModals} title="Agregar Estudiante" size="md">
                <form onSubmit={handleSubmitEstudiante}>
                    <FormInput
                        label="Nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        placeholder="Nombres del estudiante"
                        required
                        error={errors.nombres}
                        icon="fas fa-user"
                    />

                    <FormInput
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        placeholder="Apellidos del estudiante"
                        required
                        error={errors.apellidos}
                        icon="fas fa-user"
                    />

                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@ejemplo.com"
                        required
                        error={errors.email}
                        icon="fas fa-envelope"
                    />

                    <FormInput
                        label="Nota Final (0-10)"
                        type="number"
                        name="notaFinal"
                        value={formData.notaFinal}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        min="0"
                        max="10"
                        step="0.1"
                        error={errors.notaFinal}
                        icon="fas fa-star"
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="outline" onClick={handleCloseModals} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting} disabled={submitting} icon="fas fa-save">
                            {submitting ? "Guardando..." : "Agregar Estudiante"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Student Modal */}
            <Modal isOpen={showEditModal} onClose={handleCloseModals} title="Editar Estudiante" size="md">
                <form onSubmit={handleSubmitEstudiante}>
                    <FormInput
                        label="Nombres"
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        placeholder="Nombres del estudiante"
                        required
                        error={errors.nombres}
                        icon="fas fa-user"
                    />

                    <FormInput
                        label="Apellidos"
                        name="apellidos"
                        value={formData.apellidos}
                        onChange={handleInputChange}
                        placeholder="Apellidos del estudiante"
                        required
                        error={errors.apellidos}
                        icon="fas fa-user"
                    />

                    <FormInput
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="email@ejemplo.com"
                        required
                        error={errors.email}
                        icon="fas fa-envelope"
                    />

                    <FormInput
                        label="Nota Final (0-10)"
                        type="number"
                        name="notaFinal"
                        value={formData.notaFinal}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        min="0"
                        max="10"
                        step="0.1"
                        error={errors.notaFinal}
                        icon="fas fa-star"
                    />

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="outline" onClick={handleCloseModals} disabled={submitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" loading={submitting} disabled={submitting} icon="fas fa-save">
                            {submitting ? "Guardando..." : "Actualizar Estudiante"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default CursoDetail
