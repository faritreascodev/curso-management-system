"use client"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Loading from "./Loading"

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        // Redirigir a login y guardar la ubicación actual
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

export default PrivateRoute
