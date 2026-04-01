import { useState, useEffect } from 'react'
import { Search, Edit2, Trash2, User, Phone, FileText, Mail, Save, X } from 'lucide-react'
import Layout from '../../components/Layout'
import { clientsService } from '../../services/api'

export default function Clients() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [editClient, setEditClient] = useState(null)
    const [editForm, setEditForm] = useState({})
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)

    const fetchClients = () => {
        setLoading(true)
        clientsService.getAll().then(r => setClients(r.data)).finally(() => setLoading(false))
    }

    useEffect(() => { fetchClients() }, [])

    const filtered = clients.filter(c =>
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.doc.includes(search) ||
        c.phone?.includes(search)
    )

    const openEdit = (c) => {
        setEditClient(c.id)
        setEditForm({ name: c.name, phone: c.phone || '', email: c.email || '' })
    }

    const handleSave = async (id) => {
        setSaving(true)
        await clientsService.update(id, editForm)
        setSaving(false)
        setEditClient(null)
        fetchClients()
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) return
        setDeleting(id)
        await clientsService.delete(id)
        setDeleting(null)
        fetchClients()
    }

    return (
        <Layout withFooter={false}>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Administración</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Clientes</h1>
                    <p className="text-gray-500 text-sm mt-1">{clients.length} clientes registrados</p>
                </div>

                {/* Search */}
                <div className="relative mb-8">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, documento o teléfono..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="input-field pl-9 max-w-md"
                    />
                </div>

                {/* Table-style list */}
                {loading ? (
                    <div className="text-center py-16">
                        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="card-dark text-center py-12">
                        <User size={32} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No se encontraron clientes</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(c => (
                            <div key={c.id} className="card-dark">
                                {editClient === c.id ? (
                                    /* Edit mode */
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Nombre</label>
                                                <input type="text" value={editForm.name}
                                                    onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                                                    className="input-field text-sm py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Teléfono</label>
                                                <input type="tel" value={editForm.phone}
                                                    onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                                    className="input-field text-sm py-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-400 mb-1">Email</label>
                                                <input type="email" value={editForm.email}
                                                    onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                                                    className="input-field text-sm py-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleSave(c.id)} disabled={saving}
                                                className="btn-gold text-xs px-4 py-2 flex items-center gap-1.5 disabled:opacity-50">
                                                <Save size={12} /> {saving ? 'Guardando...' : 'Guardar'}
                                            </button>
                                            <button onClick={() => setEditClient(null)}
                                                className="btn-ghost text-xs px-4 py-2 border border-gray-700 flex items-center gap-1.5">
                                                <X size={12} /> Cancelar
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View mode */
                                    <div className="flex items-center justify-between flex-wrap gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gold-500/10 border border-gold-500/20 flex items-center justify-center shrink-0 text-gold-500 font-bold font-display">
                                                {c.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-white font-semibold">{c.name}</h3>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                                                    <span className="flex items-center gap-1"><FileText size={10} /> {c.doc}</span>
                                                    {c.phone && <span className="flex items-center gap-1"><Phone size={10} /> {c.phone}</span>}
                                                    {c.email && <span className="flex items-center gap-1"><Mail size={10} /> {c.email}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-gold-500 font-bold text-lg">{c.visits}</div>
                                                <div className="text-gray-600 text-xs">visitas</div>
                                            </div>
                                            <button onClick={() => openEdit(c)}
                                                className="text-gray-500 hover:text-gold-500 transition-colors p-1" title="Editar">
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                disabled={deleting === c.id}
                                                className="text-gray-600 hover:text-red-400 transition-colors p-1 disabled:opacity-50" title="Eliminar"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    )
}
