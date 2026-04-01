import { Instagram, Facebook, Phone, MapPin, Clock } from 'lucide-react'
import BrayanLogo from '../assets/logos/Logo Principal3.svg'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="bg-charcoal-800 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <img
                                src={BrayanLogo}
                                alt="Brayan Barber"
                                className="h-20 w-auto"
                            />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Precisión en cada corte. Estilo que define carácter. Tu barbería de confianza.
                        </p>
                        <div className="flex gap-3 mt-4">
                            <a href="#" className="w-8 h-8 border border-gray-700 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center text-gray-400 transition-all">
                                <Instagram size={14} />
                            </a>
                            <a href="#" className="w-8 h-8 border border-gray-700 hover:border-gold-500 hover:text-gold-500 flex items-center justify-center text-gray-400 transition-all">
                                <Facebook size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Servicios</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/book" className="hover:text-gold-500 transition-colors">Agendar cita</Link></li>
                            <li><Link to="/my-appointment" className="hover:text-gold-500 transition-colors">Consultar cita</Link></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Contacto</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-center gap-2">
                                <Phone size={14} className="text-gold-500 shrink-0" />
                                +57 300 000 0000
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={14} className="text-gold-500 shrink-0" />
                                Calle 79 #45-97, Medellín
                            </li>
                            <li className="flex items-center gap-2">
                                <Clock size={14} className="text-gold-500 shrink-0" />
                                Martes-Domingo: 10:00am - 7:00pm
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
                    <span>© 2026 YouDev. Todos los derechos reservados.</span>
                    <span>Diseñado con React</span>
                </div>
            </div>
        </footer>
    )
}
