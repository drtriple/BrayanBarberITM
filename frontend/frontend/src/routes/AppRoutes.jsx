import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'

// Public pages
import Home from '../pages/public/Home'
import BookAppointment from '../pages/public/BookAppointment'
import MyAppointment from '../pages/public/MyAppointment'

// Auth
import Login from '../pages/auth/Login'

// Barber pages
import BarberDashboard from '../pages/barber/BarberDashboard'
import BarberAppointments from '../pages/barber/BarberAppointments'
import BarberProfile from '../pages/barber/BarberProfile'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminAppointments from '../pages/admin/AdminAppointments'
import Employees from '../pages/admin/Employees'
import Clients from '../pages/admin/Clients'

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/book" element={<BookAppointment />} />
            <Route path="/my-appointment" element={<MyAppointment />} />
            <Route path="/login" element={<Login />} />

            {/* Barber - protected */}
            <Route path="/barber/dashboard" element={
                <ProtectedRoute role="barber"><BarberDashboard /></ProtectedRoute>
            } />
            <Route path="/barber/appointments" element={
                <ProtectedRoute role="barber"><BarberAppointments /></ProtectedRoute>
            } />
            <Route path="/barber/profile" element={
                <ProtectedRoute role="barber"><BarberProfile /></ProtectedRoute>
            } />

            {/* Admin - protected */}
            <Route path="/admin/dashboard" element={
                <ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/appointments" element={
                <ProtectedRoute role="admin"><AdminAppointments /></ProtectedRoute>
            } />
            <Route path="/admin/employees" element={
                <ProtectedRoute role="admin"><Employees /></ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
                <ProtectedRoute role="admin"><Clients /></ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
