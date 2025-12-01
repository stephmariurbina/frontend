"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getPackagesReports,
  createPackage,
  getManagerRoles,
  type PackageResponse,
  type ManagerResponse,
} from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

export default function AdminPackagesPage() {
  const { user } = useAuth()
  const [packages, setPackages] = useState<PackageResponse[]>([])
  const [employees, setEmployees] = useState<ManagerResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<PackageResponse | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newPackage, setNewPackage] = useState({
    trackingId: "",
    description: "",
    weight: "",
    origin: "",
    destination: "",
    sender: "",
    receiver: "",
    receiverEmail: "",
    currentStatus: "En procesamiento",
    estimatedDelivery: "",
    assignedTo: "default",
  })

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    setIsLoading(true)

    const [employeesResult, packagesResult] = await Promise.all([
      getManagerRoles(user?.token),
      getPackagesReports(user?.token),
    ])

    if (employeesResult.data) {
      setEmployees(employeesResult.data)
    }

    if (packagesResult.data) {
      setPackages(packagesResult.data)
    }

    setIsLoading(false)
  }

  const activeEmployees = employees.filter((emp) => emp.status === "active" && emp.role === "employee")

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generateTrackingId = () => {
    const year = new Date().getFullYear()
    const num = String(packages.length + 1).padStart(3, "0")
    return `NCF-${year}-${num}`
  }

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data, error } = await createPackage(
      {
        ...newPackage,
        trackingId: newPackage.trackingId || generateTrackingId(),
        assignedTo: newPackage.assignedTo === "default" ? undefined : newPackage.assignedTo,
      },
      user?.token,
    )

    if (error) {
      console.error("[v0] Error creating package:", error)
      setIsSubmitting(false)
      return
    }

    await loadData()

    setNewPackage({
      trackingId: "",
      description: "",
      weight: "",
      origin: "",
      destination: "",
      sender: "",
      receiver: "",
      receiverEmail: "",
      currentStatus: "En procesamiento",
      estimatedDelivery: "",
      assignedTo: "default",
    })
    setIsAddDialogOpen(false)
    setIsSubmitting(false)
  }

  const handleAssignEmployee = async () => {
    if (!selectedPackage || !selectedEmployee) return

    const emp = employees.find((e) => e.email === selectedEmployee)
    setPackages(
      packages.map((pkg) =>
        pkg.id === selectedPackage.id ? { ...pkg, assignedTo: selectedEmployee, assignedToName: emp?.name } : pkg,
      ),
    )

    setIsAssignDialogOpen(false)
    setSelectedPackage(null)
    setSelectedEmployee("")
  }

  const openAssignDialog = (pkg: PackageResponse) => {
    setSelectedPackage(pkg)
    setSelectedEmployee(pkg.assignedTo || "")
    setIsAssignDialogOpen(true)
  }

  const handleDeletePackage = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este paquete?")) {
      setPackages(packages.filter((pkg) => pkg.id !== id))
    }
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
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Paquetes</h1>
          <p className="text-muted-foreground">Administra todos los envíos del sistema</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Nuevo Paquete
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Paquete</DialogTitle>
              <DialogDescription>Completa la información del nuevo envío</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddPackage} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingId">ID de Rastreo (opcional)</Label>
                  <Input
                    id="trackingId"
                    placeholder={generateTrackingId()}
                    value={newPackage.trackingId}
                    onChange={(e) => setNewPackage({ ...newPackage, trackingId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso *</Label>
                  <Input
                    id="weight"
                    placeholder="ej: 2.5 kg"
                    value={newPackage.weight}
                    onChange={(e) => setNewPackage({ ...newPackage, weight: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción del Contenido *</Label>
                <Input
                  id="description"
                  placeholder="ej: Electrónicos, ropa, etc."
                  value={newPackage.description}
                  onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen *</Label>
                  <Input
                    id="origin"
                    placeholder="ej: Miami, FL"
                    value={newPackage.origin}
                    onChange={(e) => setNewPackage({ ...newPackage, origin: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino *</Label>
                  <Input
                    id="destination"
                    placeholder="ej: Managua, Nicaragua"
                    value={newPackage.destination}
                    onChange={(e) => setNewPackage({ ...newPackage, destination: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sender">Remitente *</Label>
                  <Input
                    id="sender"
                    placeholder="Nombre del remitente"
                    value={newPackage.sender}
                    onChange={(e) => setNewPackage({ ...newPackage, sender: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiver">Destinatario *</Label>
                  <Input
                    id="receiver"
                    placeholder="Nombre del destinatario"
                    value={newPackage.receiver}
                    onChange={(e) => setNewPackage({ ...newPackage, receiver: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverEmail">Email del Destinatario *</Label>
                  <Input
                    id="receiverEmail"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={newPackage.receiverEmail}
                    onChange={(e) => setNewPackage({ ...newPackage, receiverEmail: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Fecha Estimada de Entrega *</Label>
                  <Input
                    id="estimatedDelivery"
                    placeholder="ej: 30 Nov, 2025"
                    value={newPackage.estimatedDelivery}
                    onChange={(e) => setNewPackage({ ...newPackage, estimatedDelivery: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado Inicial</Label>
                  <Select
                    value={newPackage.currentStatus}
                    onValueChange={(value) => setNewPackage({ ...newPackage, currentStatus: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En procesamiento">En procesamiento</SelectItem>
                      <SelectItem value="En tránsito">En tránsito</SelectItem>
                      <SelectItem value="En aduana">En aduana</SelectItem>
                      <SelectItem value="Entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Asignar Mensajero</Label>
                  <Select
                    value={newPackage.assignedTo}
                    onValueChange={(value) => setNewPackage({ ...newPackage, assignedTo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sin asignar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Sin asignar</SelectItem>
                      {activeEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.email}>
                          {emp.name} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Crear Paquete
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Mensajero</DialogTitle>
            <DialogDescription>Asigna un mensajero al paquete {selectedPackage?.trackingId}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Mensajero</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mensajero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Sin asignar</SelectItem>
                  {activeEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.email}>
                      {emp.name} - {emp.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAssignEmployee}>Asignar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por ID, destinatario o destino..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Rastreo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Destinatario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Mensajero</TableHead>
                  <TableHead>Entrega Est.</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No se encontraron paquetes
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-mono font-medium">{pkg.trackingId}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{pkg.description}</TableCell>
                      <TableCell>{pkg.destination}</TableCell>
                      <TableCell>{pkg.receiver}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(pkg.currentStatus)}>
                          {pkg.currentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {pkg.assignedToName ? (
                          <span className="text-sm">{pkg.assignedToName}</span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>{pkg.estimatedDelivery}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Asignar mensajero"
                            onClick={() => openAssignDialog(pkg)}
                          >
                            <UserPlus size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" title="Ver detalles">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Eliminar"
                            onClick={() => handleDeletePackage(pkg.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
