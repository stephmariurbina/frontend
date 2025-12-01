"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState } from "react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: "", email: "", phone: "", message: "" })
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
          <p className="text-lg opacity-90">¿Preguntas? Estamos aquí para ayudarte</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Información de Contacto</h2>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <Mail className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Email</h3>
                    <a href="mailto:info@nicaflex.com" className="text-primary hover:underline">
                      info@nicaflex.com
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Respondemos en menos de 24 horas</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Phone className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Teléfono</h3>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      +1 (555) 123-4567
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Disponible de Lunes a Viernes, 8am - 6pm</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MapPin className="text-primary flex-shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold mb-2">Ubicaciones</h3>
                    <p className="text-sm">
                      <strong>USA:</strong> Miami, Florida
                    </p>
                    <p className="text-sm">
                      <strong>Nicaragua:</strong> Managua
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-12 pt-8 border-t border-border">
                <h3 className="font-bold mb-4">Síguenos</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-primary hover:text-primary/70 font-semibold">
                    Facebook
                  </a>
                  <a href="#" className="text-primary hover:text-primary/70 font-semibold">
                    Instagram
                  </a>
                  <a href="#" className="text-primary hover:text-primary/70 font-semibold">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-muted rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Envíanos un Mensaje</h2>

              {submitted && (
                <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg mb-6">
                  ¡Gracias por tu mensaje! Te contactaremos pronto.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="tu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Mensaje</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-semibold transition"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
