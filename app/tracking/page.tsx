"use client"

import type React from "react"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Search, MapPin, Package, CheckCircle2, Clock, Loader2 } from "lucide-react"
import { trackPackage } from "@/lib/api"

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("")
  const [packageInfo, setPackageInfo] = useState<any>(null)
  const [searched, setSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const id = trackingId.toUpperCase()
    const { data, error: apiError } = await trackPackage(id)

    if (apiError) {
      setError(apiError)
      setPackageInfo(null)
    } else if (data) {
      setPackageInfo(data)
    } else {
      setPackageInfo(null)
    }

    setSearched(true)
    setIsLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600"
      case "in-transit":
        return "text-blue-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in-transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Entregado"
      case "in-transit":
        return "En Transito"
      case "pending":
        return "Pendiente"
      default:
        return "Desconocido"
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Rastreo de Paquetes</h1>
          <p className="text-lg opacity-90">Sigue tu envío en tiempo real con GPS</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Ingresa tu número de rastreo (ej: NCF-2024-001)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
                Rastrear
              </button>
            </div>
          </form>

          {/* Example IDs Info */}
          <div className="bg-muted p-4 rounded-lg mb-8 text-sm">
            <p className="font-semibold mb-2">IDs de ejemplo para prueba:</p>
            <p className="text-muted-foreground">NCF-2024-001 (En Transito) o NCF-2024-002 (Entregado)</p>
          </div>

          {/* Results */}
          {searched && (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                  <p className="text-red-800 font-semibold mb-2">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {packageInfo ? (
                <div className="space-y-8">
                  {/* Status Card */}
                  <div className="bg-white border border-border rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Número de Rastreo</h2>
                        <p className="text-lg text-primary font-mono font-bold">{trackingId.toUpperCase()}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-lg font-semibold ${getStatusBadge(packageInfo.status)}`}>
                        {getStatusText(packageInfo.status)}
                      </div>
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="bg-white border border-border rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="text-primary" />
                      Ubicación en Mapa
                    </h3>
                    <div className="relative w-full h-64 md:h-96 bg-muted rounded-lg overflow-hidden">
                      <svg className="w-full h-full" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
                        {/* Simplified map background */}
                        <rect width="1000" height="600" fill="#e8f0fe" />

                        {/* USA location marker */}
                        <circle cx="200" cy="150" r="8" fill="#6b7280" />
                        <text x="200" y="130" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                          {packageInfo.origin || "Origen"}
                        </text>

                        {/* Route line */}
                        <line
                          x1="200"
                          y1="150"
                          x2={(packageInfo.latitude || 12) * 30 + 200}
                          y2={(packageInfo.longitude || -86) * 30 + 200}
                          stroke="#2563eb"
                          strokeWidth="3"
                          strokeDasharray="5,5"
                        />

                        {/* Nicaragua location marker */}
                        <circle
                          cx={(packageInfo.latitude || 12) * 30 + 200}
                          cy={(packageInfo.longitude || -86) * 30 + 200}
                          r="12"
                          fill="#2563eb"
                        />
                        <circle
                          cx={(packageInfo.latitude || 12) * 30 + 200}
                          cy={(packageInfo.longitude || -86) * 30 + 200}
                          r="18"
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2"
                          opacity="0.5"
                        />

                        {/* Destination marker */}
                        <circle cx="700" cy="400" r="8" fill="#6b7280" />
                        <text x="700" y="420" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                          Destino Final
                        </text>
                      </svg>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-border rounded-lg p-6">
                      <h4 className="font-bold text-sm text-muted-foreground mb-4">INFORMACIÓN DEL ENVÍO</h4>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Origen</p>
                          <p className="font-semibold">{packageInfo.origin}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Destino</p>
                          <p className="font-semibold">{packageInfo.destination}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Peso</p>
                          <p className="font-semibold">{packageInfo.weight}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contenido</p>
                          <p className="font-semibold">{packageInfo.content || packageInfo.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-border rounded-lg p-6">
                      <h4 className="font-bold text-sm text-muted-foreground mb-4">ENTREGA ESTIMADA</h4>
                      <div className="flex items-center gap-4">
                        <Clock className="text-secondary" size={32} />
                        <div>
                          <p className="text-sm text-muted-foreground">Fecha Estimada</p>
                          <p className="font-bold text-lg">{packageInfo.estimatedDelivery}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  {packageInfo.stages && (
                    <div className="bg-white border border-border rounded-lg p-6">
                      <h3 className="text-xl font-bold mb-6">Historial de Seguimiento</h3>
                      <div className="space-y-4">
                        {packageInfo.stages.map((stage: any, index: number) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.completed ? "bg-green-500 text-white" : "bg-gray-300 text-gray-600"}`}
                              >
                                {stage.completed ? <CheckCircle2 size={20} /> : <Package size={20} />}
                              </div>
                              {index < packageInfo.stages.length - 1 && (
                                <div className={`w-1 h-12 ${stage.completed ? "bg-green-500" : "bg-gray-300"}`} />
                              )}
                            </div>
                            <div className="flex-1 pb-4">
                              <p className="font-semibold">{stage.name}</p>
                              <p className="text-sm text-muted-foreground">{stage.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                !error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-800 font-semibold mb-2">Número de Rastreo No Encontrado</p>
                    <p className="text-red-700 text-sm">
                      El número ingresado no coincide con nuestros registros. Verifica e intenta de nuevo.
                    </p>
                  </div>
                )
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
