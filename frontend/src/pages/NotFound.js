"use client"

import { Link } from "react-router-dom"
import Button from "../components/Button"

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100 mb-8">
                    <i className="fas fa-exclamation-triangle text-red-600 text-4xl"></i>
                </div>

                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
                <p className="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>

                <div className="space-y-4">
                    <Link to="/dashboard">
                        <Button variant="primary" size="lg" icon="fas fa-home" className="w-full">
                            Ir al Dashboard
                        </Button>
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="w-full text-blue-600 hover:text-blue-800 font-medium"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFound
