"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import classNames from "classnames"

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/login")
        setIsMenuOpen(false)
    }

    const isActivePath = (path) => {
        return location.pathname === path
    }

    if (!isAuthenticated) {
        return (
            <nav className="bg-white shadow-lg border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
                            <span className="text-xl font-bold text-gray-800">CursoFarit</span>
                        </Link>

                        <div className="flex space-x-4">
                            <Link
                                to="/login"
                                className={classNames(
                                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                                    isActivePath("/login") ? "bg-blue-600 text-white" : "text-gray-600 hover:text-blue-600",
                                )}
                            >
                                Iniciar Sesión
                            </Link>
                            <Link
                                to="/register"
                                className={classNames(
                                    "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                                    isActivePath("/register")
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-600 hover:text-blue-600 border border-gray-300 hover:border-blue-600",
                                )}
                            >
                                Registrarse
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
                        <span className="text-xl font-bold text-gray-800">CursoFarit</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/dashboard"
                            className={classNames(
                                "px-3 py-2 rounded-lg font-medium transition-colors duration-200",
                                isActivePath("/dashboard") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600",
                            )}
                        >
                            <i className="fas fa-tachometer-alt mr-2"></i>
                            Dashboard
                        </Link>

                        <Link
                            to="/cursos/crear"
                            className={classNames(
                                "px-3 py-2 rounded-lg font-medium transition-colors duration-200",
                                isActivePath("/cursos/crear") ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-blue-600",
                            )}
                        >
                            <i className="fas fa-plus mr-2"></i>
                            Crear Curso
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            <div className="flex items-center space-x-3">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">{user?.nombre}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
                                </div>
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-medium">{user?.nombre?.charAt(0).toUpperCase()}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                                    title="Cerrar Sesión"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none"
                        >
                            <i className={`fas ${isMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-3">
                            <Link
                                to="/dashboard"
                                className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className="fas fa-tachometer-alt mr-2"></i>
                                Dashboard
                            </Link>

                            <Link
                                to="/cursos/crear"
                                className="px-3 py-2 text-gray-600 hover:text-blue-600 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <i className="fas fa-plus mr-2"></i>
                                Crear Curso
                            </Link>

                            <div className="px-3 py-2 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-700">{user?.nombre}</p>
                                <p className="text-xs text-gray-500 capitalize mb-2">{user?.rol}</p>
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-medium">
                                    <i className="fas fa-sign-out-alt mr-2"></i>
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
