import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Phone, FileText, Scissors, CheckCircle, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { appointmentsService, barbersService } from '../../services/api'

const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
]

const initialForm = {
    clientDoc: '', clientName: '', clientPhone: '',
    date: '', time: '', barberId: '',
}

export default function BookAppointment() {
    const [form, setForm] = useState(initialForm)
    const [barbers, setBarbers] = useState([])
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(null)

    useEffect(() => {
        barbersService.getAll().then(r => setBarbers(r.data.filter(b => b.active)))
    }, [])

    const validate = () => {
        const e = {}
        if (!form.clientDoc.trim()) e.clientDoc = 'Requerido'
        if (!form.clientName.trim()) e.clientName = 'Requerido'
        if (!form.clientPhone.trim()) e.clientPhone = 'Requerido'
        else if (!/^\d{7,10}$/.test(form.clientPhone)) e.clientPhone = 'Teléfono inválido'
        if (!form.date) e.date = 'Requerido'
        else {
            const today = new Date().toISOString().split('T')[0]
            if (form.date < today) e.date = 'Fecha no puede ser en el pasado'
        }
        if (!form.time) e.time = 'Requerido'
        if (!form.barberId) e.barberId = 'Seleccione un barbero'
        return e
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const e2 = validate()
        if (Object.keys(e2).length > 0) { setErrors(e2); return }
        setLoading(true)
        try {
            const res = await appointmentsService.create(form)
            setSuccess(res.data)
            setForm(initialForm)
        } catch (err) {
            setErrors({ general: 'Error al crear la cita. Intente de nuevo.' })
        } finally {
            setLoading(false)
        }
    }

    const today = new Date().toISOString().split('T')[0]

    if (success) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center px-4 py-20">
                    <div className="max-w-md w-full text-center">
                        <div className="w-20 h-20 bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={36} className="text-green-400" />
                        </div>
                        <h2 className="font-display text-3xl text-white mb-3">¡Cita Agendada!</h2>
                        <p className="text-gray-400 mb-8">Tu cita ha sido registrada exitosamente.</p>

                        <div className="card-dark text-left mb-8 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Cliente:</span>
                                <span className="text-white font-medium">{success.clientName}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Fecha:</span>
                                <span className="text-white font-medium">{success.date}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Hora:</span>
                                <span className="text-white font-medium">{success.time}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Barbero:</span>
                                <span className="text-white font-medium">{success.barberName}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setSuccess(null)} className="btn-outline flex-1">Nueva cita</button>
                            <Link to="/" className="btn-gold flex-1 text-center">Volver al inicio</Link>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto px-4 py-20">

                <div className="mb-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold-500 text-sm mb-6 transition-colors">
                        <ChevronLeft size={16} /> Volver
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Reservas</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Agendar Cita</h1>
                    <p className="text-gray-400 mt-2 text-sm">Completa el formulario para reservar tu turno</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {/* info personal */}
                    <div className="card-dark space-y-5">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <User size={16} className="text-gold-500" /> Información Personal
                        </h3>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Documento *</label>
                            <div className="relative">
                                <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="clientDoc"
                                    value={form.clientDoc}
                                    onChange={handleChange}
                                    placeholder="Número de documento"
                                    className={`input-field pl-9 ${errors.clientDoc ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.clientDoc && <p className="text-red-400 text-xs mt-1">{errors.clientDoc}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Nombre completo *</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    name="clientName"
                                    value={form.clientName}
                                    onChange={handleChange}
                                    placeholder="Tu nombre completo"
                                    className={`input-field pl-9 ${errors.clientName ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.clientName && <p className="text-red-400 text-xs mt-1">{errors.clientName}</p>}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Teléfono *</label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="tel"
                                    name="clientPhone"
                                    value={form.clientPhone}
                                    onChange={handleChange}
                                    placeholder="Número de teléfono"
                                    className={`input-field pl-9 ${errors.clientPhone ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.clientPhone && <p className="text-red-400 text-xs mt-1">{errors.clientPhone}</p>}
                        </div>
                    </div>

                    {/* detalle de la cita */}
                    <div className="card-dark space-y-5">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Calendar size={16} className="text-gold-500" /> Detalles de la Cita
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Fecha *</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    min={today}
                                    className={`input-field ${errors.date ? 'border-red-500' : ''}`}
                                />
                                {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Hora *</label>
                                <select
                                    name="time"
                                    value={form.time}
                                    onChange={handleChange}
                                    className={`input-field ${errors.time ? 'border-red-500' : ''}`}
                                >
                                    <option value="">Seleccionar</option>
                                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Barbero *</label>
                            <div className="grid grid-cols-2 gap-3">
                                {barbers.map(b => (
                                    <label
                                        key={b.id}
                                        className={`flex items-center gap-3 p-4 border cursor-pointer transition-all ${form.barberId == b.id
                                                ? 'border-gold-500 bg-gold-500/10'
                                                : 'border-gray-700 hover:border-gray-600'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="barberId"
                                            value={b.id}
                                            checked={form.barberId == b.id}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                        <div className="w-8 h-8 bg-gold-500/20 flex items-center justify-center shrink-0">
                                            <Scissors size={14} className="text-gold-500 rotate-45" />
                                        </div>
                                        <div>
                                            <div className="text-white text-sm font-medium">{b.name}</div>
                                            <div className="text-gray-500 text-xs">{b.specialties}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            {errors.barberId && <p className="text-red-400 text-xs mt-1">{errors.barberId}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Procesando...</>
                        ) : (
                            <><Calendar size={16} /> Confirmar Cita</>
                        )}
                    </button>
                </form>
            </div>
        </Layout>
    )
}
