import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, AlertCircle, User, Lock } from 'lucide-react'
import BrayanLogo from '../../assets/logos/Logo Principal4.svg'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.username || !form.password) { setError('Completa todos los campos'); return }
        setLoading(true)
        try {
            const user = await login(form.username, form.password)
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/barber/dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-charcoal-900 flex">
           
            <div className="hidden lg:flex lg:w-1/2 bg-charcoal-800 border-r border-gray-800 flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, #C49A3C 0px, #C49A3C 1px, transparent 1px, transparent 60px)`,
                    }}
                />
                <div className="relative text-center">
                    <Link to="/" className="flex items-center gap-2 mb-4">
                        <img
                            src={BrayanLogo}
                            alt="Brayan Barber"
                            className="h-50 w-auto"
                        />
                    </Link>
                    <div className="w-16 h-0.5 bg-gold-500 mx-auto mb-6" />
                    <p className="text-gray-500 text-sm max-w-xs">
                        Panel de gestión para administradores y barberos del equipo Brayan Barber.
                    </p>

                    <div className="mt-12 space-y-3 text-left">
                        <div className="text-xs text-gray-600 uppercase tracking-widest mb-3">Accesos demo</div>
                        <div className="bg-charcoal-700 border border-gray-700 px-4 py-3 text-xs">
                            <span className="text-gold-500 font-bold">Admin:</span>{' '}
                            <span className="text-gray-400">admin / admin123</span>
                        </div>
                        <div className="bg-charcoal-700 border border-gray-700 px-4 py-3 text-xs">
                            <span className="text-gold-500 font-bold">Barbero:</span>{' '}
                            <span className="text-gray-400">brayan / barber123</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* panel derecho - formulario login */}
            <div className="flex-1 flex items-center justify-center px-6">
                <div className="w-full max-w-sm">
                    {/* logo para telefono */}
                    <div className="lg:hidden text-center mb-10">
                       <Link to="/" className="flex items-center gap-2 mb-4">
                            <img
                                src={BrayanLogo}
                                alt="Brayan Barber"
                                className="h-40 w-auto"
                            />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Acceso</span>
                        </div>
                        <h2 className="font-display text-3xl text-white">Iniciar Sesión</h2>
                        <p className="text-gray-500 text-sm mt-2">Ingresa tus credenciales para continuar</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm flex items-center gap-2">
                                <AlertCircle size={14} /> {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Usuario</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    placeholder="Tu usuario"
                                    autoComplete="username"
                                    className="input-field pl-9"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Contraseña</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Tu contraseña"
                                    autoComplete="current-password"
                                    className="input-field pl-9 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                                >
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                        >
                            {loading
                                ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Ingresando...</>
                                : 'Ingresar'
                            }
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <Link to="/" className="text-gray-500 hover:text-gold-500 text-sm transition-colors">
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
