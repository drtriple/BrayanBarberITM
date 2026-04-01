import { useState, useEffect } from 'react'
import { Calendar, Clock, User, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import AppointmentCard from '../../components/AppointmentCard'
import { useAuth } from '../../context/AuthContext'
import { appointmentsService } from '../../services/api'

export default function BarberDashboard() {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        appointmentsService.getByBarber(user.id).then(res => {
            setAppointments(res.data)
        }).finally(() => setLoading(false))
    }, [user.id])

    const today = new Date().toISOString().split('T')[0]
    const upcoming = appointments.filter(a => a.date >= today && a.status !== 'cancelled')
    const todayApps = appointments.filter(a => a.date === today && a.status !== 'cancelled')

    return (
        <Layout withFooter={false}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Panel del barbero</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Hola, {user.name.split(' ')[0]}</h1>
                    <p className="text-gray-500 mt-1 text-sm">Aquí tienes el resumen de tu agenda</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    <StatCard icon={<Calendar size={20} />} label="Citas hoy" value={todayApps.length} />
                    <StatCard icon={<TrendingUp size={20} />} label="Próximas citas" value={upcoming.length} />
                    <StatCard icon={<User size={20} />} label="Total citas" value={appointments.length} />
                </div>

                {/* Upcoming appointments */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-display text-2xl text-white">Próximas Citas</h2>
                    <Link to="/barber/appointments" className="text-gold-500 text-sm hover:text-gold-400 transition-colors">
                        Ver todas →
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        Cargando citas...
                    </div>
                ) : upcoming.length === 0 ? (
                    <div className="card-dark text-center py-12">
                        <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No tienes citas próximas</p>
                        <Link to="/barber/appointments" className="btn-gold inline-block mt-4 text-xs">Nueva cita</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcoming.slice(0, 4).map(a => (
                            <AppointmentCard key={a.id} appointment={a} showActions={false} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

function StatCard({ icon, label, value }) {
    return (
        <div className="card-dark">
            <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500">
                    {icon}
                </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
    )
}
