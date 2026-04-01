import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, User } from 'lucide-react'
import BrayanLogo from '../assets/logos/Logo Principal3.svg'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        logout()
        navigate('/')
        setOpen(false)
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal-900/95 backdrop-blur border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={BrayanLogo}
                            alt="Brayan Barber"
                            className="h-10 w-auto"
                        />
                    </Link>

                    {/* Pc Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {!user && (
                            <>
                                <Link to="/" className={`btn-ghost text-sm ${isActive('/') ? 'text-gold-500' : ''}`}>Inicio</Link>
                                <Link to="/book" className={`btn-ghost text-sm ${isActive('/book') ? 'text-gold-500' : ''}`}>Agendar</Link>
                                <Link to="/my-appointment" className={`btn-ghost text-sm ${isActive('/my-appointment') ? 'text-gold-500' : ''}`}>Mi cita</Link>
                                <Link to="/login" className="btn-gold ml-4 text-xs">Iniciar sesión</Link>
                            </>
                        )}

                        {user?.role === 'barber' && (
                            <>
                                <Link to="/barber/dashboard" className={`btn-ghost text-sm ${isActive('/barber/dashboard') ? 'text-gold-500' : ''}`}>Dashboard</Link>
                                <Link to="/barber/appointments" className={`btn-ghost text-sm ${isActive('/barber/appointments') ? 'text-gold-500' : ''}`}>Citas</Link>
                                <Link to="/barber/profile" className={`btn-ghost text-sm ${isActive('/barber/profile') ? 'text-gold-500' : ''}`}>Perfil</Link>
                            </>
                        )}

                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin/dashboard" className={`btn-ghost text-sm ${isActive('/admin/dashboard') ? 'text-gold-500' : ''}`}>Dashboard</Link>
                                <Link to="/admin/appointments" className={`btn-ghost text-sm ${isActive('/admin/appointments') ? 'text-gold-500' : ''}`}>Citas</Link>
                                <Link to="/admin/employees" className={`btn-ghost text-sm ${isActive('/admin/employees') ? 'text-gold-500' : ''}`}>Empleados</Link>
                                <Link to="/admin/clients" className={`btn-ghost text-sm ${isActive('/admin/clients') ? 'text-gold-500' : ''}`}>Clientes</Link>
                            </>
                        )}

                        {user && (
                            <div className="flex items-center gap-3 ml-4 border-l border-gray-700 pl-4">
                                <div className="text-right">
                                    <div className="text-xs text-gold-500 font-semibold uppercase tracking-wider">{user.role}</div>
                                    <div className="text-sm text-white">{user.name}</div>
                                </div>
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors" title="Cerrar sesión">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* telefono toggle */}
                    <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setOpen(!open)}>
                        {open ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* telefono menu */}
            {open && (
                <div className="md:hidden bg-charcoal-800 border-t border-gray-800 px-4 py-4 space-y-1">
                    {!user && (
                        <>
                            <MobileLink to="/" onClick={() => setOpen(false)}>Inicio</MobileLink>
                            <MobileLink to="/book" onClick={() => setOpen(false)}>Agendar cita</MobileLink>
                            <MobileLink to="/my-appointment" onClick={() => setOpen(false)}>Mi cita</MobileLink>
                            <MobileLink to="/login" onClick={() => setOpen(false)}>Iniciar sesión</MobileLink>
                        </>
                    )}
                    {user?.role === 'barber' && (
                        <>
                            <MobileLink to="/barber/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileLink>
                            <MobileLink to="/barber/appointments" onClick={() => setOpen(false)}>Citas</MobileLink>
                            <MobileLink to="/barber/profile" onClick={() => setOpen(false)}>Perfil</MobileLink>
                            <button onClick={handleLogout} className="w-full text-left text-red-400 py-2 px-2 text-sm">Cerrar sesión</button>
                        </>
                    )}
                    {user?.role === 'admin' && (
                        <>
                            <MobileLink to="/admin/dashboard" onClick={() => setOpen(false)}>Dashboard</MobileLink>
                            <MobileLink to="/admin/appointments" onClick={() => setOpen(false)}>Citas</MobileLink>
                            <MobileLink to="/admin/employees" onClick={() => setOpen(false)}>Empleados</MobileLink>
                            <MobileLink to="/admin/clients" onClick={() => setOpen(false)}>Clientes</MobileLink>
                            <button onClick={handleLogout} className="w-full text-left text-red-400 py-2 px-2 text-sm">Cerrar sesión</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    )
}

function MobileLink({ to, children, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className="block text-gray-300 hover:text-gold-500 py-2 px-2 text-sm transition-colors"
        >
            {children}
        </Link>
    )
}
