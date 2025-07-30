import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import PrivateRoute from "./components/PrivateRoute"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import CursoDetail from "./pages/CursoDetail"
import CreateCurso from "./pages/CreateCurso"
import EditCurso from "./pages/EditCurso"
import NotFound from "./pages/NotFound"

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <main className="container mx-auto px-4 py-8">
                        <Routes>
                            {/* Rutas públicas */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Rutas protegidas */}
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/cursos/crear"
                                element={
                                    <PrivateRoute>
                                        <CreateCurso />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/cursos/:id"
                                element={
                                    <PrivateRoute>
                                        <CursoDetail />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/cursos/:id/editar"
                                element={
                                    <PrivateRoute>
                                        <EditCurso />
                                    </PrivateRoute>
                                }
                            />

                            {/* Redirección por defecto */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />

                            {/* Página 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App
