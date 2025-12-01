"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useAuth } from "@/lib/auth-context"
import { getPackagesByEmail, type PackageInfo } from "@/lib/packages-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "entregado":
      return "bg-green-100 text-green-800 border-green-200"
    case "en tránsito":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "en procesamiento":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "en aduana":
      return "bg-orange-100 text-orange-800 border-orange-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "entregado":
      return <CheckCircle2 className="text-green-600" size={20} />
    case "en tránsito":
      return <Truck className="text-blue-600" size={20} />
    case "en procesamiento":
      return <Clock className="text-yellow-600" size={20} />
    case "en aduana":
      return <AlertCircle className="text-orange-600" size={20} />
    default:
      return <Package className="text-gray-600" size={20} />
  }
}

export default function MyPackagesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [packages, setPackages] = useState<PackageInfo[]>([])
  const [filteredPackages, setFilteredPackages] = useState<PackageInfo[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      const userPackages = getPackagesByEmail(user.email)
      setPackages(userPackages)
      setFilteredPackages(userPackages)
    }
  }, [user])

  useEffect(() => {
    let result = packages

    if (searchTerm) {
      result = result.filter(
        (pkg) =>
          pkg.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pkg.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((pkg) => pkg.currentStatus.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredPackages(result)
  }, [searchTerm, statusFilter, packages])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Mis Paquetes</h1>
            <p className="text-primary-foreground/80">
              Hola {user.name}, aquí puedes ver el historial de todos tus envíos
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="Buscar por ID o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="en procesamiento">En procesamiento</SelectItem>
                  <SelectItem value="en tránsito">En tránsito</SelectItem>
                  <SelectItem value="en aduana">En aduana</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Packages List */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredPackages.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Package className="mx-auto text-muted-foreground mb-4" size={48} />
                  <h3 className="text-lg font-medium mb-2">No se encontraron paquetes</h3>
                  <p className="text-muted-foreground mb-4">
                    {packages.length === 0
                      ? "Aún no tienes paquetes registrados"
                      : "No hay paquetes que coincidan con tu búsqueda"}
                  </p>
                  <Link href="/tracking">
                    <Button>Rastrear un paquete</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-primary">{packages.length}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {packages.filter((p) => p.currentStatus === "En tránsito").length}
                      </p>
                      <p className="text-sm text-muted-foreground">En tránsito</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {packages.filter((p) => p.currentStatus === "En aduana").length}
                      </p>
                      <p className="text-sm text-muted-foreground">En aduana</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {packages.filter((p) => p.currentStatus === "Entregado").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Entregados</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Package Cards */}
                {filteredPackages.map((pkg) => (
                  <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <Link href={`/tracking?id=${pkg.trackingId}`}>
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="p-3 bg-primary/10 rounded-lg">{getStatusIcon(pkg.currentStatus)}</div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-mono font-semibold text-primary">{pkg.trackingId}</span>
                                  <Badge variant="outline" className={getStatusColor(pkg.currentStatus)}>
                                    {pkg.currentStatus}
                                  </Badge>
                                </div>
                                <p className="text-sm text-foreground mb-2">{pkg.description}</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {pkg.origin} → {pkg.destination}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    Entrega: {pkg.estimatedDelivery}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="text-sm">Ver detalles</span>
                              <ChevronRight size={20} />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
