"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { cursoService } from "../services/cursoService"
import { useAuth } from "../context/AuthContext"
import Loading from "../components/Loading"
import Button from "../components/Button"
import { showAlert } from "../utils/alerts"
import classNames from "classnames"

const Dashboard = () => {
    const [cursos, setCursos] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [stats, setStats] = useState({
        totalCursos: 0,
        totalEstudiantes: 0,
        promedioGeneral: 0,
    })

    const { user } = useAuth()

    useEffect(() => {
        loadCursos()
    }, [currentPage, searchTerm])

    const loadCursos = async () => {
        try {
            setLoading(true)
            const params = {
                page: currentPage,
                limit: 10,
            }

            if (searchTerm) {
                params.nombreCurso = searchTerm
            }

            const response = await cursoService.getCursos(params)
            setCursos(response.data.cursos)
            setTotalPages(response.data.pagination.pages)

            // Calcular estadísticas
            const totalEstudiantes = response.data.cursos.reduce((sum, curso) => sum + curso.estudiantes.length, 0)
            const cursosConEstudiantes = response.data.cursos.filter((curso) => curso.estudiantes.length > 0)
            const promedioGeneral =
                cursosConEstudiantes.length > 0
                    ? cursosConEstudiantes.reduce((sum, curso) => {
                        const promedioCurso =
                            curso.estudiantes.reduce((sumNotas, est) => sumNotas + est.notaFinal, 0) / curso.estudiantes.length
                        return sum + promedioCurso
                    }, 0) / cursosConEstudiantes.length
                    : 0

            setStats({
                totalCursos: response.data.pagination.total,
                totalEstudiantes,
                promedioGeneral: Math.round(promedioGeneral * 100) / 100,
            })
        } catch (error) {
            console.error("Error cargando cursos:", error)
            showAlert.error("Error", "No se pudieron cargar los cursos")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteCurso = async (cursoId, nombreCurso) => {
        const result = await showAlert.confirmDelete(
            "¿Eliminar curso?",
            `¿Estás seguro de que deseas eliminar el curso "${nombreCurso}"?`,
        )

        if (result.isConfirmed) {
            try {
                await cursoService.deleteCurso(cursoId)
                showAlert.success("¡Eliminado!", "El curso ha sido eliminado exitosamente")
                loadCursos()
            } catch (error) {
                console.error("Error eliminando curso:", error)
                showAlert.error("Error", "No se pudo eliminar el curso")
            }
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    if (loading && cursos.length === 0) {
        return <Loading message="Cargando cursos..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">Bienvenido, {user?.nombre}</p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link to="/cursos/crear">
                        <Button variant="primary" icon="fas fa-plus">
                            Crear Curso
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100">
                            <i className="fas fa-book text-blue-600 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Cursos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalCursos}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100">
                            <i className="fas fa-users text-green-600 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Estudiantes</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalEstudiantes}</p>
                        </div>
                    </div>
                </div>

                <div className="card p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100">
                            <i className="fas fa-chart-line text-yellow-600 text-xl"></i>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Promedio General</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.promedioGeneral || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="relative flex-1 max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fas fa-search text-gray-400"></i>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar cursos..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-input w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 transition-colors duration-200"
                        />
                    </div>
                    <div className="text-sm text-gray-600">
                        Mostrando {cursos.length} de {stats.totalCursos} cursos
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <Loading message="Cargando cursos..." />
            ) : cursos.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <i className="fas fa-book text-gray-400 text-xl"></i>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cursos</h3>
                    <p className="text-gray-600 mb-6">
                        {searchTerm ? "No se encontraron cursos con ese término de búsqueda" : "Comienza creando tu primer curso"}
                    </p>
                    <Link to="/cursos/crear">
                        <Button variant="primary" icon="fas fa-plus">
                            Crear Primer Curso
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cursos.map((curso) => (
                        <div key={curso._id} className="card card-hover">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{curso.nombreCurso}</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <i className="fas fa-user-tie mr-2"></i>
                                            {curso.nombreDocente}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <i className="fas fa-clock mr-2"></i>
                                            {curso.duracionHoras} horas
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Link to={`/cursos/${curso._id}/editar`}>
                                            <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCurso(curso._id, curso.nombreCurso)}
                                            className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{curso.descripcion}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <span>
                                            <i className="fas fa-users mr-1"></i>
                                            {curso.estudiantes.length} estudiantes
                                        </span>
                                        <span>
                                            <i className="fas fa-calendar mr-1"></i>
                                            {formatDate(curso.fechaCreacion)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <Link to={`/cursos/${curso._id}`} className="flex-1">
                                        <Button variant="primary" size="sm" className="w-full" icon="fas fa-eye">
                                            Ver Detalles
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        icon="fas fa-chevron-left"
                    >
                        Anterior
                    </Button>

                    <div className="flex space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={classNames(
                                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                                    currentPage === page
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                                )}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        icon="fas fa-chevron-right"
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Dashboard
