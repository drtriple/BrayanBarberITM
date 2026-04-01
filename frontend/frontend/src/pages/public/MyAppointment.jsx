import { useState } from 'react'
import { Search, Calendar, Clock, Scissors, X, ChevronLeft, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { appointmentsService } from '../../services/api'

export default function MyAppointment() {
    const [doc, setDoc] = useState('')
    const [appointment, setAppointment] = useState(undefined)
    const [loading, setLoading] = useState(false)
    const [cancelling, setCancelling] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const [error, setError] = useState('')

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!doc.trim()) { setError('Ingresa tu número de documento'); return }
        setLoading(true)
        setError('')
        setCancelled(false)
        try {
            const res = await appointmentsService.getByDoc(doc.trim())
            setAppointment(res.data)
        } catch {
            setError('Error al buscar la cita. Intenta de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async () => {
        if (!window.confirm('¿Seguro que deseas cancelar tu cita?')) return
        setCancelling(true)
        try {
            await appointmentsService.cancel(appointment.id)
            setCancelled(true)
            setAppointment(null)
        } catch {
            setError('Error al cancelar. Intenta de nuevo.')
        } finally {
            setCancelling(false)
        }
    }

    const formatDate = (d) => {
        if (!d) return ''
        const [y, m, day] = d.split('-')
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return `${parseInt(day)} de ${months[parseInt(m) - 1]} de ${y}`
    }

    return (
        <Layout>
            <div className="max-w-lg mx-auto px-4 py-20">
                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-500 text-sm mb-6 transition-colors">
                        <ChevronLeft size={16} /> Volver
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Consultas</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Mi Próxima Cita</h1>
                    <p className="text-gray-400 mt-2 text-sm">Ingresa tu documento para consultar o cancelar tu cita</p>
                </div>

                {/* Search form */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={doc}
                                onChange={e => { setDoc(e.target.value); setError('') }}
                                placeholder="Número de documento"
                                className="input-field pl-9 w-full"
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-gold px-5 whitespace-nowrap disabled:opacity-50">
                            {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : 'Buscar'}
                        </button>
                    </div>
                    {error && (
                        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                            <AlertCircle size={12} /> {error}
                        </p>
                    )}
                </form>

                {/* confirmacion ca */}
                {cancelled && (
                    <div className="bg-green-500/10 border border-green-500/30 p-5 text-center">
                        <div className="text-green-400 text-2xl mb-2">✓</div>
                        <p className="text-green-400 font-semibold">Cita cancelada exitosamente</p>
                        <p className="text-gray-500 text-sm mt-1">Puedes agendar una nueva cita cuando quieras</p>
                        <Link to="/book" className="btn-gold inline-block mt-4 text-xs">Agendar nueva cita</Link>
                    </div>
                )}

                {/* No appointment found */}
                {appointment === null && !cancelled && (
                    <div className="card-dark text-center py-10">
                        <div className="w-14 h-14 bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4">
                            <Calendar size={22} className="text-gray-500" />
                        </div>
                        <p className="text-white font-semibold mb-2">Sin citas próximas</p>
                        <p className="text-gray-500 text-sm mb-6">No encontramos citas pendientes con ese documento</p>
                        <Link to="/book" className="btn-gold text-xs">Agendar nueva cita</Link>
                    </div>
                )}

                {/* Appointment found */}
                {appointment && !cancelled && (
                    <div className="animate-fade-in-up">
                        <div className="card-dark">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-white font-semibold text-xl">{appointment.clientName}</h2>
                                    <p className="text-gray-500 text-sm">Doc: {appointment.clientDoc}</p>
                                </div>
                                <span className="text-xs bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-2 py-1 uppercase tracking-wider">
                                    Pendiente
                                </span>
                            </div>

                            <div className="space-y-4 border-t border-gray-800 pt-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                                        <Calendar size={15} className="text-gold-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Fecha</div>
                                        <div className="text-white font-medium">{formatDate(appointment.date)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                                        <Clock size={15} className="text-gold-500" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Hora</div>
                                        <div className="text-white font-medium">{appointment.time}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                                        <Scissors size={15} className="text-gold-500 rotate-45" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Barbero</div>
                                        <div className="text-white font-medium">{appointment.barberName}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-5 mt-5 border-t border-gray-800">
                                <button
                                    onClick={handleCancel}
                                    disabled={cancelling}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 py-3 transition-all disabled:opacity-50"
                                >
                                    {cancelling
                                        ? <><div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" /> Cancelando...</>
                                        : <><X size={14} /> Cancelar cita</>
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}
