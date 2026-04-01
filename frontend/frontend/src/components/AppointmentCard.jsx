import { Calendar, Clock, User, Scissors, X, Check, AlertCircle } from 'lucide-react'

const STATUS_MAP = {
    pending: { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    confirmed: { label: 'Confirmada', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
    completed: { label: 'Completada', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
    cancelled: { label: 'Cancelada', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
}

export default function AppointmentCard({ appointment, onCancel, onConfirm, showActions = true }) {
    const status = STATUS_MAP[appointment.status] || STATUS_MAP.pending

    const formatDate = (dateStr) => {
        const [y, m, d] = dateStr.split('-')
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        return `${d} ${months[parseInt(m) - 1]} ${y}`
    }

    return (
        <div className="bg-charcoal-700 border border-gray-800 hover:border-gray-700 transition-colors p-5 group">
   
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-semibold text-white text-lg">{appointment.clientName}</h3>
                    <p className="text-gray-500 text-sm">Doc: {appointment.clientDoc}</p>
                </div>
                <span className={`text-xs px-2 py-1 border font-medium uppercase tracking-wider ${status.color}`}>
                    {status.label}
                </span>
            </div>

            {/* Detalle */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} className="text-gold-500 shrink-0" />
                    {formatDate(appointment.date)}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock size={14} className="text-gold-500 shrink-0" />
                    {appointment.time}
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Scissors size={14} className="text-gold-500 shrink-0" />
                    {appointment.barberName}
                </div>
                {appointment.clientPhone && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <User size={14} className="text-gold-500 shrink-0" />
                        {appointment.clientPhone}
                    </div>
                )}
            </div>

            {/* Acciones */}
            {showActions && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <div className="flex gap-2 pt-3 border-t border-gray-800">
                    {onConfirm && appointment.status === 'pending' && (
                        <button
                            onClick={() => onConfirm(appointment.id)}
                            className="flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 border border-green-400/30 hover:border-green-400/60 px-3 py-1.5 transition-all"
                        >
                            <Check size={12} /> Confirmar
                        </button>
                    )}
                    {onCancel && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 px-3 py-1.5 transition-all"
                        >
                            <X size={12} /> Cancelar
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
