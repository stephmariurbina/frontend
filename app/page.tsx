"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { MapPin, Truck, Shield, Clock } from "lucide-react"

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Envíos Confiables desde USA a Nicaragua</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 text-balance">
            Rastreo en tiempo real, entregas rápidas y seguras. Tu confianza es nuestra prioridad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tracking"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition"
            >
              Rastrear Paquete
            </Link>
            <Link
              href="/contact"
              className="bg-primary-foreground hover:bg-primary-foreground/90 text-primary px-8 py-3 rounded-lg font-semibold transition"
            >
              Enviar Ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Por qué elegir Nica Flex</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Rastreo GPS</h3>
              <p className="text-muted-foreground">Localiza tu paquete en tiempo real desde USA hasta Nicaragua</p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Truck className="text-secondary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Envíos Rápidos</h3>
              <p className="text-muted-foreground">Entregas de 5-7 días hábiles a toda Nicaragua</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Seguridad Garantizada</h3>
              <p className="text-muted-foreground">Aseguramos tu paquete contra daños y pérdidas</p>
            </div>

            <div className="text-center">
              <div className="bg-secondary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="text-secondary" size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">Atención 24/7</h3>
              <p className="text-muted-foreground">Soporte disponible todos los días para tus consultas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para enviar tu paquete?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Contacta con nosotros hoy y obtén cotización sin compromiso
          </p>
          <Link
            href="/contact"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 rounded-lg font-semibold transition inline-block"
          >
            Solicitar Cotización
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
