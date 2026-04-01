import { Link } from 'react-router-dom'
import { Scissors, Star, Clock, MapPin, ChevronRight, Calendar, Search } from 'lucide-react'
import BrayanLogo from '../../assets/logos/Logo Principal3.svg'
import Layout from '../../components/Layout'

const SERVICES = [
    { name: 'Corte Clásico', desc: 'Tijera y máquina con acabado impecable', price: '$25.000' },
    { name: 'Degradado', desc: 'Fade perfecto a cualquier nivel', price: '$30.000' },
    { name: 'Barba', desc: 'Perfilado y arreglo profesional', price: '$20.000' },
    { name: 'Corte + Barba', desc: 'Combo completo para lucir perfecto', price: '$45.000' },
]

const TESTIMONIALS = [
    { name: 'Carlos M.', text: 'El mejor corte que me han hecho. Atención de primera.', stars: 5 },
    { name: 'Andrés P.', text: 'Ambiente increíble, barberos muy profesionales.', stars: 5 },
    { name: 'Diego R.', text: 'Ya llevo 2 años viniendo y nunca me han fallado.', stars: 5 },
]

export default function Home() {
    return (
        <Layout>
            <section className="relative min-h-screen flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-charcoal-900">
                    <div className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `repeating-linear-gradient(45deg, #C49A3C 0px, #C49A3C 1px, transparent 1px, transparent 60px)`,
                        }}
                    />
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-charcoal-800 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
                    <div className="animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em] font-semibold">Barbería Premium</span>
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-black text-white leading-none mb-6">
                            EL ARTE<br />
                            <span className="text-gold-500">DEL CORTE</span><br />
                            PERFECTO
                        </h1>
                        <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
                            Más de 3 años dando estilo y confianza. Barberos expertos, ambiente exclusivo.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/book" className="btn-gold flex items-center gap-2">
                                <Calendar size={16} />
                                Agendar cita
                            </Link>
                            <Link to="/my-appointment" className="btn-outline flex items-center gap-2">
                                <Search size={16} />
                                Mi cita
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block animate-fade-in-up animate-delay-200">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-full h-full border border-gold-500/30" />
                            <div className="bg-charcoal-700 border border-gray-700 p-10 relative">
                                <Link to="/" className="flex items-center gap-2 mb-4">
                                    <img
                                        src={BrayanLogo}
                                        alt="Brayan Barber"
                                        className="h-40 w-auto"
                                    />
                                </Link>
                                <div className="mt-8 grid grid-cols-2 gap-6 pt-6 border-t border-gray-700">
                                    <div>
                                        <div className="text-3xl font-bold text-gold-500">3+</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Años de experiencia</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-gold-500">100+</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider">Clientes felices</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* cita */}
            <section className="bg-gold-500 py-5">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-black font-semibold text-sm uppercase tracking-wider">
                        ¿Listo para lucir increíble? Agenda tu cita hoy mismo
                    </p>
                    <Link to="/book" className="bg-black text-white text-sm font-semibold px-6 py-2 hover:bg-charcoal-700 transition-colors whitespace-nowrap flex items-center gap-2">
                        Reservar ahora <ChevronRight size={14} />
                    </Link>
                </div>
            </section>

            {/* SERVICIOS */}
            <section className="py-24 bg-charcoal-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Lo que ofrecemos</span>
                            <div className="gold-line" />
                        </div>
                        <h2 className="section-title">Nuestros Servicios</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SERVICES.map((service, i) => (
                            <div key={i} className="card-dark group hover:border-gold-500/50 transition-all duration-300 cursor-default">
                                <div className="w-10 h-0.5 bg-gold-500 mb-5 group-hover:w-full transition-all duration-500" />
                                <h3 className="text-white font-semibold text-lg mb-2">{service.name}</h3>
                                <p className="text-gray-500 text-sm mb-4">{service.desc}</p>
                                <div className="text-gold-500 font-bold text-xl">{service.price}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TESTIMONIOS */}
            <section className="py-24 bg-charcoal-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="gold-line" />
                            <span className="text-gold-500 text-xs uppercase tracking-[0.3em]">Clientes</span>
                            <div className="gold-line" />
                        </div>
                        <h2 className="section-title">Lo que dicen nuestros clientes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="card-dark">
                                <div className="flex mb-4">
                                    {Array.from({ length: t.stars }).map((_, s) => (
                                        <Star key={s} size={14} className="text-gold-500 fill-gold-500" />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="text-gold-500 font-semibold text-sm">— {t.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INFO */}
            <section className="py-16 bg-charcoal-900 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                                <MapPin size={20} className="text-gold-500" />
                            </div>
                            <div>
                                <div className="text-white font-semibold mb-1">Ubicación</div>
                                <div className="text-gray-500 text-sm">Calle 79 #45-97, Medellín</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                                <Clock size={20} className="text-gold-500" />
                            </div>
                            <div>
                                <div className="text-white font-semibold mb-1">Horario</div>
                                <div className="text-gray-500 text-sm">Martes-Domingo: 10:00am - 7:00pm</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/30 flex items-center justify-center">
                                <Scissors size={20} className="text-gold-500 rotate-45" />
                            </div>
                            <div>
                                <div className="text-white font-semibold mb-1">Reservas</div>
                                <div className="text-gray-500 text-sm">Online 24/7 o llamando al local</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}
