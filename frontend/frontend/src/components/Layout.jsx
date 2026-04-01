import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Layout principal: Navbar + contenido + Footer
 * withFooter permite ocultar el footer en paneles internos
 */
export default function Layout({ children, withFooter = true }) {
    return (
        <div className="min-h-screen flex flex-col bg-charcoal-900">
            <Navbar />
            <main className="flex-1 pt-16">
                {children}
            </main>
            {withFooter && <Footer />}
        </div>
    )
}
