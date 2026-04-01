import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Mock users para demo sin backend
const MOCK_USERS = [
    { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { id: 2, username: 'brayan', password: 'barber123', role: 'barber', name: 'Brayan García' },
    { id: 3, username: 'carlos', password: 'barber123', role: 'barber', name: 'Carlos Mendoza' },
]

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Al montar, verificar si hay sesión guardada
    useEffect(() => {
        const saved = localStorage.getItem('bb_user')
        if (saved) {
            try {
                setUser(JSON.parse(saved))
            } catch {
                localStorage.removeItem('bb_user')
            }
        }
        setLoading(false)
    }, [])

    const login = async (username, password) => {
        // Simulación de llamada API
        await new Promise(r => setTimeout(r, 600))

        const found = MOCK_USERS.find(
            u => u.username === username && u.password === password
        )

        if (!found) {
            throw new Error('Usuario o contraseña incorrectos')
        }

        const { password: _, ...safeUser } = found
        setUser(safeUser)
        localStorage.setItem('bb_user', JSON.stringify(safeUser))
        return safeUser
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('bb_user')
    }

    const isAdmin = () => user?.role === 'admin'
    const isBarber = () => user?.role === 'barber'

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin, isBarber }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}
