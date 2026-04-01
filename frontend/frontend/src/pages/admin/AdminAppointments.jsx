import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Edit2, X, Check } from 'lucide-react'
import Layout from '../../components/Layout'
import AppointmentCard from '../../components/AppointmentCard'
import { appointmentsService, barbersService } from '../../services/api'

const TIME_SLOTS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']

const emptyForm = { clientDoc: '', clientName: '', clientPhone: '', date: '', time: '', barberId: '' }

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState([])
    const [barbers, setBarbers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})

    const today = new Date().toISOString().split('T')[0]

    const fetchAll = () => {
        setLoading(true)
        Promise.all([appointmentsService.getAll(), barbersService.getAll()])
            .then(([a, b]) => { setAppointments(a.data); setBarbers(b.data.filter(x => x.active)) })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchAll() }, [])

    const filtered = appointments.filter(a => {
        const matchSearch = !search || a.clientName.toLowerCase().includes(search.toLowerCase()) || a.clientDoc.includes(search)
        const matchFilter =
            filter === 'all' ? true :
                filter === 'today' ? a.date === today :
                    filter === 'upcoming' ? a.date >= today && a.status !== 'cancelled' :
                        filter === 'cancelled' ? a.status === 'cancelled' : true
        return matchSearch && matchFilter
    })

    const handleCancel = async (id) => {
        if (!window.confirm('¿Cancelar esta cita?')) return
        await appointmentsService.cancel(id)
        fetchAll()
    }

    const handleConfirm = async (id) => {
        await appointmentsService.update(id, { status: 'confirmed' })
        fetchAll()
    }

    const openCreate = () => {
        setForm(emptyForm)
        setEditMode(false)
        setEditId(null)
        setErrors({})
        setShowModal(true)
    }

    const openEdit = (app) => {
        setForm({
            clientDoc: app.clientDoc,
            clientName: app.clientName,
            clientPhone: app.clientPhone,
            date: app.date,
            time: app.time,
            barberId: app.barberId,
        })
        setEditMode(true)
        setEditId(app.id)
        setErrors({})
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.clientDoc) errs.clientDoc = 'Requerido'
        if (!form.clientName) errs.clientName = 'Requerido'
        if (!form.date) errs.date = 'Requerido'
        if (!form.time) errs.time = 'Requerido'
        if (!form.barberId) errs.barberId = 'Requerido'
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setSaving(true)
        try {
            if (editMode) {
                await appointmentsService.update(editId, form)
            } else {
                await appointmentsService.create(form)
            }
            setShowModal(false)
            fetchAll()
        } catch { setErrors({ general: 'Error al guardar' }) }
        finally { setSaving(false) }
    }

    return (
        <Layout withFooter={false}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Administración</span>
                        </div>
                        <h1 className="font-display text-4xl text-white">Gestión de Citas</h1>
                    </div>
                    <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-xs">
                        <Plus size={14} /> Nueva cita
                    </button>
                </div>

                {/* Search + filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o documento..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="input-field pl-9"
                        />
                    </div>
                    <div className="flex gap-2">
                        {[['all', 'Todas'], ['today', 'Hoy'], ['upcoming', 'Próximas'], ['cancelled', 'Canceladas']].map(([val, lbl]) => (
                            <button key={val} onClick={() => setFilter(val)}
                                className={`px-3 py-2 text-xs uppercase tracking-wider border transition-all ${filter === val ? 'bg-gold-500 text-black border-gold-500' : 'border-gray-700 text-gray-400 hover:border-gray-500'
                                    }`}
                            >{lbl}</button>
                        ))}
                    </div>
                </div>

                {/* Count */}
                <div className="text-gray-500 text-xs mb-4">{filtered.length} citas encontradas</div>

                {/* List */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card-dark text-center py-12">
                        <Calendar size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No se encontraron citas</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(a => (
                            <div key={a.id} className="relative group">
                                <AppointmentCard appointment={a} onCancel={handleCancel} onConfirm={handleConfirm} />
                                <button
                                    onClick={() => openEdit(a)}
                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gold-500"
                                    title="Editar"
                                >
                                    <Edit2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                    <div className="bg-charcoal-700 border border-gray-700 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="font-display text-2xl text-white mb-6">
                            {editMode ? 'Editar Cita' : 'Nueva Cita'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}
                            {[
                                { name: 'clientDoc', label: 'Documento', type: 'text' },
                                { name: 'clientName', label: 'Nombre del cliente', type: 'text' },
                                { name: 'clientPhone', label: 'Teléfono', type: 'tel' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                                    <input type={f.type} value={form[f.name] || ''}
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
                                    <select value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))}
                                        className={`input-field ${errors.time ? 'border-red-500' : ''}`}
                                    >
                                        <option value="">Seleccionar</option>
                                        {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Barbero</label>
                                <select value={form.barberId} onChange={e => setForm(p => ({ ...p, barberId: parseInt(e.target.value) }))}
                                    className={`input-field ${errors.barberId ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar barbero</option>
                                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                {errors.barberId && <p className="text-red-400 text-xs mt-1">{errors.barberId}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 text-xs">Cancelar</button>
                                <button type="submit" disabled={saving} className="btn-gold flex-1 text-xs disabled:opacity-50">
                                    {saving ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}
