import { useState, useEffect } from 'react'
import { Plus, Edit2, ToggleLeft, ToggleRight, Scissors, X, Save } from 'lucide-react'
import Layout from '../../components/Layout'
import { barbersService } from '../../services/api'

const emptyForm = { name: '', phone: '', username: '', specialties: '' }

export default function Employees() {
    const [barbers, setBarbers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [editId, setEditId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    const fetchBarbers = () => {
        setLoading(true)
        barbersService.getAll().then(r => setBarbers(r.data)).finally(() => setLoading(false))
    }

    useEffect(() => { fetchBarbers() }, [])

    const openCreate = () => {
        setForm(emptyForm)
        setEditMode(false)
        setEditId(null)
        setErrors({})
        setShowModal(true)
    }

    const openEdit = (b) => {
        setForm({ name: b.name, phone: b.phone, username: b.username, specialties: b.specialties || '' })
        setEditMode(true)
        setEditId(b.id)
        setErrors({})
        setShowModal(true)
    }

    const handleToggle = async (id) => {
        await barbersService.toggle(id)
        fetchBarbers()
    }

    const handleSave = async (e) => {
        e.preventDefault()
        const errs = {}
        if (!form.name.trim()) errs.name = 'Requerido'
        if (!form.username.trim()) errs.username = 'Requerido'
        if (Object.keys(errs).length > 0) { setErrors(errs); return }
        setSaving(true)
        try {
            if (editMode) {
                await barbersService.update(editId, form)
            } else {
                await barbersService.create(form)
            }
            setShowModal(false)
            fetchBarbers()
        } catch { setErrors({ general: 'Error al guardar' }) }
        finally { setSaving(false) }
    }

    return (
        <Layout withFooter={false}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Equipo</span>
                        </div>
                        <h1 className="font-display text-4xl text-white">Empleados</h1>
                    </div>
                    <button onClick={openCreate} className="btn-gold flex items-center gap-2 text-xs">
                        <Plus size={14} /> Nuevo barbero
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {barbers.map(b => (
                            <div key={b.id} className="card-dark group">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0">
                                            <Scissors size={18} className="text-gold-500 rotate-45" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">{b.name}</h3>
                                            <p className="text-gray-500 text-xs">@{b.username}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 border ${b.active
                                                ? 'text-green-400 border-green-400/30 bg-green-400/10'
                                                : 'text-gray-500 border-gray-700 bg-gray-800'
                                            }`}>
                                            {b.active ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>

                                {b.specialties && (
                                    <p className="text-gray-500 text-xs mt-3 pl-16">{b.specialties}</p>
                                )}
                                {b.phone && (
                                    <p className="text-gray-500 text-xs mt-1 pl-16">{b.phone}</p>
                                )}

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                                    <button
                                        onClick={() => openEdit(b)}
                                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 transition-all"
                                    >
                                        <Edit2 size={11} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleToggle(b.id)}
                                        className={`flex items-center gap-1.5 text-xs border px-3 py-1.5 transition-all ${b.active
                                                ? 'text-red-400 border-red-400/30 hover:border-red-400/60'
                                                : 'text-green-400 border-green-400/30 hover:border-green-400/60'
                                            }`}
                                    >
                                        {b.active ? <><ToggleRight size={12} /> Desactivar</> : <><ToggleLeft size={12} /> Activar</>}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
                    <div className="bg-charcoal-700 border border-gray-700 w-full max-w-md p-6">
                        <h3 className="font-display text-2xl text-white mb-6">
                            {editMode ? 'Editar Barbero' : 'Nuevo Barbero'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {errors.general && <p className="text-red-400 text-xs">{errors.general}</p>}
                            {[
                                { name: 'name', label: 'Nombre completo' },
                                { name: 'username', label: 'Usuario (login)' },
                                { name: 'phone', label: 'Teléfono' },
                                { name: 'specialties', label: 'Especialidades' },
                            ].map(f => (
                                <div key={f.name}>
                                    <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1">{f.label}</label>
                                    <input type="text" value={form[f.name]}
                                        onChange={e => { setForm(p => ({ ...p, [f.name]: e.target.value })); setErrors(p => ({ ...p, [f.name]: '' })) }}
                                        className={`input-field ${errors[f.name] ? 'border-red-500' : ''}`}
                                    />
                                    {errors[f.name] && <p className="text-red-400 text-xs mt-1">{errors[f.name]}</p>}
                                </div>
                            ))}
                            {!editMode && (
                                <div className="bg-charcoal-800 border border-gray-700 px-3 py-2 text-xs text-gray-500">
                                    Contraseña por defecto: <span className="text-gold-500">barber123</span>
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 text-xs">Cancelar</button>
                                <button type="submit" disabled={saving} className="btn-gold flex-1 text-xs disabled:opacity-50">
                                    {saving ? 'Guardando...' : <><Save size={12} /> {editMode ? 'Actualizar' : 'Registrar'}</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}
