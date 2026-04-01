import axios from 'axios'

// Base URL - se puede cambiar cuando el backend esté listo
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor para incluir token de autenticación
api.interceptors.request.use(config => {
  const user = localStorage.getItem('bb_user')
  if (user) {
    const parsed = JSON.parse(user)
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`
    }
  }
  return config
})

// DATOS MOCK
const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

let mockAppointments = [
  { id: 1, clientName: 'Juan Pérez', clientDoc: '12345678', clientPhone: '3001234567', date: '2025-08-15', time: '09:00', barberId: 2, barberName: 'Brayan García', status: 'pending' },
  { id: 2, clientName: 'Luis Torres', clientDoc: '87654321', clientPhone: '3109876543', date: '2025-08-15', time: '10:00', barberId: 3, barberName: 'Carlos Mendoza', status: 'pending' },
  { id: 3, clientName: 'Pedro Gómez', clientDoc: '11223344', clientPhone: '3152345678', date: '2025-08-16', time: '11:00', barberId: 2, barberName: 'Brayan García', status: 'confirmed' },
  { id: 4, clientName: 'Mario Ríos', clientDoc: '55667788', clientPhone: '3203456789', date: '2025-07-20', time: '09:00', barberId: 2, barberName: 'Brayan García', status: 'completed' },
  { id: 5, clientName: 'Andrés Silva', clientDoc: '99887766', clientPhone: '3004567890', date: '2025-07-21', time: '10:30', barberId: 3, barberName: 'Carlos Mendoza', status: 'completed' },
]

let mockClients = [
  { id: 1, name: 'Juan Pérez', doc: '12345678', phone: '3001234567', email: 'juan@email.com', visits: 5 },
  { id: 2, name: 'Luis Torres', doc: '87654321', phone: '3109876543', email: 'luis@email.com', visits: 3 },
  { id: 3, name: 'Pedro Gómez', doc: '11223344', phone: '3152345678', email: 'pedro@email.com', visits: 8 },
  { id: 4, name: 'Mario Ríos', doc: '55667788', phone: '3203456789', email: 'mario@email.com', visits: 2 },
]

let mockBarbers = [
  { id: 2, name: 'Brayan García', phone: '3001111111', username: 'brayan', active: true, specialties: 'Corte clásico, degradado' },
  { id: 3, name: 'Carlos Mendoza', phone: '3002222222', username: 'carlos', active: true, specialties: 'Diseños, barba' },
]

let nextAppId = 6

// APPOINTMENTS

export const appointmentsService = {
  getAll: async () => {
    await delay()
    return { data: mockAppointments }
  },

  getByDoc: async (doc) => {
    await delay()
    const today = new Date().toISOString().split('T')[0]
    const upcoming = mockAppointments
      .filter(a => a.clientDoc === doc && a.date >= today && a.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    return { data: upcoming[0] || null }
  },

  getByBarber: async (barberId) => {
    await delay()
    return { data: mockAppointments.filter(a => a.barberId === barberId) }
  },

  create: async (appointment) => {
    await delay()
    const barber = mockBarbers.find(b => b.id === parseInt(appointment.barberId))
    const newApp = {
      id: nextAppId++,
      ...appointment,
      barberName: barber?.name || 'Barbero',
      status: 'pending',
    }
    mockAppointments.push(newApp)
    return { data: newApp }
  },

  update: async (id, data) => {
    await delay()
    mockAppointments = mockAppointments.map(a => a.id === id ? { ...a, ...data } : a)
    return { data: mockAppointments.find(a => a.id === id) }
  },

  cancel: async (id) => {
    await delay()
    mockAppointments = mockAppointments.map(a =>
      a.id === id ? { ...a, status: 'cancelled' } : a
    )
    return { data: { success: true } }
  },

  getStats: async () => {
    await delay()
    const today = new Date().toISOString().split('T')[0]
    return {
      data: {
        today: mockAppointments.filter(a => a.date === today).length,
        totalClients: mockClients.length,
        totalBarbers: mockBarbers.filter(b => b.active).length,
        upcoming: mockAppointments.filter(a => a.date >= today && a.status !== 'cancelled').length,
      }
    }
  }
}

//CLIENTS

export const clientsService = {
  getAll: async () => {
    await delay()
    return { data: mockClients }
  },

  update: async (id, data) => {
    await delay()
    mockClients = mockClients.map(c => c.id === id ? { ...c, ...data } : c)
    return { data: mockClients.find(c => c.id === id) }
  },

  delete: async (id) => {
    await delay()
    mockClients = mockClients.filter(c => c.id !== id)
    return { data: { success: true } }
  },
}

// BARBERS

export const barbersService = {
  getAll: async () => {
    await delay()
    return { data: mockBarbers }
  },

  create: async (data) => {
    await delay()
    const newBarber = { id: Date.now(), ...data, active: true }
    mockBarbers.push(newBarber)
    return { data: newBarber }
  },

  update: async (id, data) => {
    await delay()
    mockBarbers = mockBarbers.map(b => b.id === id ? { ...b, ...data } : b)
    return { data: mockBarbers.find(b => b.id === id) }
  },

  toggle: async (id) => {
    await delay()
    mockBarbers = mockBarbers.map(b =>
      b.id === id ? { ...b, active: !b.active } : b
    )
    return { data: mockBarbers.find(b => b.id === id) }
  },
}

export default api
