import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Nica Flex</h3>
            <p className="text-sm opacity-90">Especialistas en envíos desde Estados Unidos hacia Nicaragua</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="opacity-90 hover:opacity-100 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="opacity-90 hover:opacity-100 transition">
                  Quiénes Somos
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="opacity-90 hover:opacity-100 transition">
                  Rastrear Paquete
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:info@nicaflex.com" className="opacity-90 hover:opacity-100 transition">
                  info@nicaflex.com
                </a>
              </li>
              <li>
                <a href="tel:+15551234567" className="opacity-90 hover:opacity-100 transition">
                  +1 (555) 123-4567
                </a>
              </li>
              <li>USA - Nicaragua</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Síguenos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="opacity-90 hover:opacity-100 transition">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm opacity-90">
          <p>&copy; 2025 Nica Flex. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
