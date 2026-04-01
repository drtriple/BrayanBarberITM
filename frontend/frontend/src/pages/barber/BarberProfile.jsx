import { useState } from 'react'
import { User, Phone, Lock, Save, CheckCircle } from 'lucide-react'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'

export default function BarberProfile() {
    const { user } = useAuth()
    const [profile, setProfile] = useState({ name: user.name, phone: '3001111111' })
    const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' })
    const [profileSaved, setProfileSaved] = useState(false)
    const [passSaved, setPassSaved] = useState(false)
    const [passError, setPassError] = useState('')
    const [saving, setSaving] = useState(false)

    const handleProfileSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        await new Promise(r => setTimeout(r, 600))
        setSaving(false)
        setProfileSaved(true)
        setTimeout(() => setProfileSaved(false), 3000)
    }

    const handlePassSave = async (e) => {
        e.preventDefault()
        setPassError('')
        if (passForm.current !== 'barber123') { setPassError('Contraseña actual incorrecta'); return }
        if (passForm.newPass.length < 6) { setPassError('La nueva contraseña debe tener al menos 6 caracteres'); return }
        if (passForm.newPass !== passForm.confirm) { setPassError('Las contraseñas no coinciden'); return }
        setSaving(true)
        await new Promise(r => setTimeout(r, 600))
        setSaving(false)
        setPassSaved(true)
        setPassForm({ current: '', newPass: '', confirm: '' })
        setTimeout(() => setPassSaved(false), 3000)
    }

    return (
        <Layout withFooter={false}>
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="gold-line" />
                        <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Cuenta</span>
                    </div>
                    <h1 className="font-display text-4xl text-white">Mi Perfil</h1>
                </div>

                {/* Avatar */}
                <div className="card-dark mb-6 flex items-center gap-5">
                    <div className="w-16 h-16 bg-gold-500 flex items-center justify-center text-black text-2xl font-bold font-display shrink-0">
                        {user.name.charAt(0)}
                    </div>
                    <div>
                        <div className="text-white font-semibold text-lg">{user.name}</div>
                        <div className="text-gold-500 text-xs uppercase tracking-widest">Barbero</div>
                        <div className="text-gray-500 text-sm mt-0.5">@{user.username}</div>
                    </div>
                </div>

                {/* Profile form */}
                <div className="card-dark mb-6">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                        <User size={16} className="text-gold-500" /> Información Personal
                    </h3>
                    <form onSubmit={handleProfileSave} className="space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Nombre completo</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Teléfono</label>
                            <input
                                type="tel"
                                value={profile.phone}
                                onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" disabled={saving} className="btn-gold w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                            {profileSaved
                                ? <><CheckCircle size={14} /> Guardado</>
                                : saving
                                    ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> Guardando...</>
                                    : <><Save size={14} /> Guardar cambios</>
                            }
                        </button>
                    </form>
                </div>

                {/* Password form */}
                <div className="card-dark">
                    <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
                        <Lock size={16} className="text-gold-500" /> Cambiar Contraseña
                    </h3>
                    <form onSubmit={handlePassSave} className="space-y-4">
                        {passError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2">
                                {passError}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Contraseña actual</label>
                            <input type="password" value={passForm.current}
                                onChange={e => setPassForm(p => ({ ...p, current: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Nueva contraseña</label>
                            <input type="password" value={passForm.newPass}
                                onChange={e => setPassForm(p => ({ ...p, newPass: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Confirmar contraseña</label>
                            <input type="password" value={passForm.confirm}
                                onChange={e => setPassForm(p => ({ ...p, confirm: e.target.value }))}
                                className="input-field"
                            />
                        </div>
                        <button type="submit" disabled={saving} className="btn-gold w-full flex items-center justify-center gap-2 text-sm disabled:opacity-50">
                            {passSaved
                                ? <><CheckCircle size={14} /> Contraseña actualizada</>
                                : <><Lock size={14} /> Cambiar contraseña</>
                            }
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    )
}
