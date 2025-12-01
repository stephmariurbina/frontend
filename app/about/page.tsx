"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CheckCircle2 } from "lucide-react"

export default function About() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Quiénes Somos</h1>
          <p className="text-lg opacity-90">Líderes en logística internacional entre USA y Nicaragua</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-4">Nuestra Historia</h2>
              <p className="text-muted-foreground mb-4">
                Nica Flex fue fundada en 2018 con la misión de simplificar los envíos desde Estados Unidos hacia
                Nicaragua. Comenzamos como una pequeña operación y hemos crecido para ser la empresa de confianza de
                miles de clientes.
              </p>
              <p className="text-muted-foreground">
                Nuestro compromiso con la excelencia y la innovación nos ha posicionado como líderes en la industria de
                la logística internacional.
              </p>
            </div>

            <div className="bg-muted rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-6">Nuestros Números</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">5,000+</div>
                  <p className="text-muted-foreground">Clientes Satisfechos</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">15,000+</div>
                  <p className="text-muted-foreground">Paquetes Entregados</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <p className="text-muted-foreground">Tasa de Satisfacción</p>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Nuestros Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-border rounded-lg p-6">
                <CheckCircle2 className="text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-3">Confiabilidad</h3>
                <p className="text-muted-foreground">Garantizamos entregas puntuales y seguras en todo momento.</p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <CheckCircle2 className="text-secondary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-3">Transparencia</h3>
                <p className="text-muted-foreground">Información clara y detallada en cada paso del envío.</p>
              </div>

              <div className="border border-border rounded-lg p-6">
                <CheckCircle2 className="text-primary mb-4" size={32} />
                <h3 className="font-bold text-lg mb-3">Innovación</h3>
                <p className="text-muted-foreground">Tecnología de punta para optimizar cada envío.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
