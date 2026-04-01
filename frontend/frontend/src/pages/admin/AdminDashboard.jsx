import { useState, useEffect } from 'react'
import { Calendar, Users, Scissors, TrendingUp, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import AppointmentCard from '../../components/AppointmentCard'
import { appointmentsService } from '../../services/api'

export default function AdminDashboard() {
    const [stats, setStats] = useState(null)
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            appointmentsService.getStats(),
            appointmentsService.getAll(),
        ]).then(([s, a]) => {
            setStats(s.data)
            const today = new Date().toISOString().split('T')[0]
            const todayApps = a.data.filter(x => x.date === today && x.status !== 'cancelled')
            setAppointments(todayApps)
        }).finally(() => setLoading(false))
    }, [])

    return (
        <Layout withFooter={false}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Panel admin</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-sm">Resumen general del negocio</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    <StatCard
                        icon={<Calendar size={20} />}
                        label="Citas hoy"
                        value={stats?.today ?? '—'}
                        color="gold"
                    />
                    <StatCard
                        icon={<Clock size={20} />}
                        label="Próximas"
                        value={stats?.upcoming ?? '—'}
                        color="blue"
                    />
                    <StatCard
                        icon={<Users size={20} />}
                        label="Clientes"
                        value={stats?.totalClients ?? '—'}
                        color="green"
                    />
                    <StatCard
                        icon={<Scissors size={20} />}
                        label="Barberos activos"
                        value={stats?.totalBarbers ?? '—'}
                        color="purple"
                    />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                    {[
                        { to: '/admin/appointments', label: 'Gestionar citas', icon: <Calendar size={16} /> },
                        { to: '/admin/employees', label: 'Empleados', icon: <Scissors size={16} /> },
                        { to: '/admin/clients', label: 'Clientes', icon: <Users size={16} /> },
                        { to: '/barber/appointments', label: 'Nueva cita', icon: <TrendingUp size={16} /> },
                    ].map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="card-dark hover:border-gold-500/50 transition-all flex flex-col items-center text-center gap-2 py-5"
                        >
                            <div className="text-gold-500">{link.icon}</div>
                            <span className="text-white text-xs font-medium">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Today's appointments */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-display text-2xl text-white">Citas de Hoy</h2>
                    <Link to="/admin/appointments" className="text-gold-500 text-sm hover:text-gold-400 transition-colors">
                        Ver todas →
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="card-dark text-center py-12">
                        <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No hay citas programadas para hoy</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {appointments.map(a => (
                            <AppointmentCard key={a.id} appointment={a} showActions={false} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}

const colorMap = {
    gold: 'bg-gold-500/10 border-gold-500/20 text-gold-500',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
}

function StatCard({ icon, label, value, color = 'gold' }) {
    return (
        <div className="card-dark">
            <div className={`w-9 h-9 border flex items-center justify-center mb-3 ${colorMap[color]}`}>
                {icon}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
        </div>
    )
}