import { useState, useEffect } from 'react'
import { Plus, Calendar, Filter } from 'lucide-react'
import Layout from '../../components/Layout'
import AppointmentCard from '../../components/AppointmentCard'
import { useAuth } from '../../context/AuthContext'
import { appointmentsService, barbersService } from '../../services/api'

const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

export default function BarberAppointments() {
    const { user } = useAuth()
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('upcoming') // upcoming | past | all
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ clientDoc: '', clientName: '', clientPhone: '', date: '', time: '' })
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    const today = new Date().toISOString().split('T')[0]

    const fetchApps = () => {
        setLoading(true)
        appointmentsService.getByBarber(user.id)
            .then(r => setAppointments(r.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchApps() }, [])

    const filtered = appointments.filter(a => {
        if (filter === 'upcoming') return a.date >= today && a.status !== 'cancelled'
        if (filter === 'past') return a.date < today || a.status === 'completed'
        return true
    })

    const handleCancel = async (id) => {
        if (!window.confirm('¿Cancelar esta cita?')) return
        await appointmentsService.cancel(id)
        fetchApps()
    }

    const validate = () => {
        const e = {}
        if (!form.clientDoc.trim()) e.clientDoc = 'Requerido'
        if (!form.clientName.trim()) e.clientName = 'Requerido'
        if (!form.clientPhone.trim()) e.clientPhone = 'Requerido'
        if (!form.date) e.date = 'Requerido'
        if (!form.time) e.time = 'Requerido'
        return e
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        const e2 = validate()
        if (Object.keys(e2).length > 0) { setErrors(e2); return }
        setSaving(true)
        try {
            await appointmentsService.create({ ...form, barberId: user.id })
            setShowModal(false)
            setForm({ clientDoc: '', clientName: '', clientPhone: '', date: '', time: '' })
            fetchApps()
        } catch {
            setErrors({ general: 'Error al guardar' })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Layout withFooter={false}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Agenda</span>
                        </div>
                        <h1 className="font-display text-4xl text-white">Mis Citas</h1>
                    </div>
                    <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-xs">
                        <Plus size={14} /> Nueva cita
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-8">
                    {[['upcoming', 'Próximas'], ['past', 'Pasadas'], ['all', 'Todas']].map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setFilter(val)}
                            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all ${filter === val
                                    ? 'bg-gold-500 text-black border-gold-500'
                                    : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-16 text-gray-500">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card-dark text-center py-12">
                        <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No hay citas en esta categoría</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filtered.map(a => (
                            <AppointmentCard
                                key={a.id}
                                appointment={a}
                                onCancel={filter !== 'past' ? handleCancel : null}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal nueva cita */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                    <div className="bg-charcoal-700 border border-gray-700 w-full max-w-md p-6">
                        <h3 className="font-display text-2xl text-white mb-6">Nueva Cita</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}
                            {[
                                { name: 'clientDoc', label: 'Documento', type: 'text' },
                                { name: 'clientName', label: 'Nombre del cliente', type: 'text' },
                                { name: 'clientPhone', label: 'Teléfono', type: 'tel' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                                    <input
                                        type={f.type}
                                        value={form[f.name]}
                                        onChange={e => { setForm(p => ({ ...p, [f.name]: e.target.value })); setErrors(p => ({ ...p, [f.name]: '' })) }}
                                        className={`input-field ${errors[f.name] ? 'border-red-500' : ''}`}
                                    />
                                    {errors[f.name] && <p className="text-red-400 text-xs mt-1">{errors[f.name]}</p>}
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha</label>
                                    <input type="date" min={today} value={form.date}
                                        onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                                        className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Hora</label>
                                    <select value={form.time}
                                        onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                                        className={`input-field ${errors.time ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 text-xs">Cancelar</button>
                                <button type="submit" disabled={saving} className="btn-gold flex-1 text-xs disabled:opacity-50">
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}
