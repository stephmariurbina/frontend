"use client"

import { useState, useEffect } from "react"
import { Package, MapPin, Clock, CheckCircle, Truck, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { getCourierPackages, updatePackageStatus, type PackageResponse } from "@/lib/api"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function CourierPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [packages, setPackages] = useState<PackageResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedPackage, setSelectedPackage] = useState<PackageResponse | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && (!user || user.role === "customer")) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadPackages()
    }
  }, [user])

  const loadPackages = async () => {
    setIsLoading(true)
    const { data, error } = await getCourierPackages(user?.token)
    if (data) {
      setPackages(data)
    } else if (error) {
      console.error("[v0] Error loading courier packages:", error)
    }
    setIsLoading(false)
  }

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || pkg.currentStatus.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const openUpdateDialog = (pkg: PackageResponse) => {
    setSelectedPackage(pkg)
    setNewStatus(pkg.currentStatus)
    setNewLocation("")
    setIsUpdateDialogOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!selectedPackage || !newStatus) return

    setIsSubmitting(true)
    const { data, error } = await updatePackageStatus(
      selectedPackage.id,
      { currentStatus: newStatus, location: newLocation || selectedPackage.destination },
      user?.token,
    )

    if (error) {
      console.error("[v0] Error updating package status:", error)
      setIsSubmitting(false)
      return
    }

    // Reload packages
    await loadPackages()
    setIsUpdateDialogOpen(false)
    setSelectedPackage(null)
    setIsSubmitting(false)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return "bg-green-100 text-green-800"
      case "en tránsito":
        return "bg-blue-100 text-blue-800"
      case "en procesamiento":
        return "bg-yellow-100 text-yellow-800"
      case "en aduana":
        return "bg-orange-100 text-orange-800"
      case "en camino a entrega":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "entregado":
        return <CheckCircle className="text-green-600" size={20} />
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

  const stats = {
    total: packages.length,
    pending: packages.filter((p) => p.currentStatus !== "Entregado").length,
    delivered: packages.filter((p) => p.currentStatus === "Entregado").length,
    inTransit: packages.filter((p) => p.currentStatus === "En tránsito").length,
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role === "customer") {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mis Paquetes Asignados</h1>
          <p className="text-muted-foreground">Bienvenido, {user.name}. Gestiona los paquetes que tienes asignados.</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="text-primary" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Truck className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inTransit}</p>
                  <p className="text-sm text-muted-foreground">En tránsito</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.delivered}</p>
                  <p className="text-sm text-muted-foreground">Entregados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Buscar por ID, destinatario o destino..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="en procesamiento">En procesamiento</SelectItem>
                  <SelectItem value="en tránsito">En tránsito</SelectItem>
                  <SelectItem value="en aduana">En aduana</SelectItem>
                  <SelectItem value="en camino a entrega">En camino a entrega</SelectItem>
                  <SelectItem value="entregado">Entregado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de paquetes */}
        {filteredPackages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="mx-auto text-muted-foreground mb-4" size={48} />
              <h3 className="text-xl font-semibold mb-2">No tienes paquetes asignados</h3>
              <p className="text-muted-foreground">
                Cuando te asignen paquetes, aparecerán aquí para que puedas gestionarlos.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredPackages.map((pkg) => (
              <Card key={pkg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-muted rounded-lg">{getStatusIcon(pkg.currentStatus)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-primary">{pkg.trackingId}</span>
                          <Badge variant="outline" className={getStatusColor(pkg.currentStatus)}>
                            {pkg.currentStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{pkg.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin size={14} className="text-muted-foreground" />
                            {pkg.destination}
                          </span>
                          <span className="text-muted-foreground">
                            Destinatario: <span className="text-foreground">{pkg.receiver}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Peso: <span className="text-foreground">{pkg.weight}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="text-sm text-right">
                        <p className="text-muted-foreground">Entrega estimada</p>
                        <p className="font-medium">{pkg.estimatedDelivery}</p>
                      </div>
                      <Button onClick={() => openUpdateDialog(pkg)} disabled={pkg.currentStatus === "Entregado"}>
                        {pkg.currentStatus === "Entregado" ? "Entregado" : "Actualizar Estado"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog para actualizar estado */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Estado del Paquete</DialogTitle>
              <DialogDescription>Paquete: {selectedPackage?.trackingId}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Nuevo Estado</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="En procesamiento">En procesamiento</SelectItem>
                    <SelectItem value="En tránsito">En tránsito</SelectItem>
                    <SelectItem value="En aduana">En aduana</SelectItem>
                    <SelectItem value="En camino a entrega">En camino a entrega</SelectItem>
                    <SelectItem value="Entregado">Entregado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Ubicación Actual (opcional)</Label>
                <Input
                  placeholder="ej: Managua, Nicaragua"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateStatus} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Actualizar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}
