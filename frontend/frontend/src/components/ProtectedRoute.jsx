import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protege rutas según el rol requerido.
 * Si no está autenticado → redirige a /login
 * Si el rol no coincide → redirige al dashboard correspondiente
 */
export default function ProtectedRoute({ children, role }) {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
                <div className="text-gold-500 text-center">
                    <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span className="text-sm text-gray-400">Cargando...</span>
                </div>
            </div>
        )
    }

    if (!user) return <Navigate to="/login" replace />

    if (role && user.role !== role) {
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/barber/dashboard'} replace />
    }

    return children
}
