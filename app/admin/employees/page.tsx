"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Trash2, UserCheck, UserX, Eye, EyeOff, Check, X, Loader2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/lib/auth-context"
import { getManagerRoles, registerManager, deleteManager, updateManager, type ManagerResponse } from "@/lib/api"

type EmployeeRole = "admin" | "user" | "mensajero" | "gerente"

const getRoleDisplayName = (role: EmployeeRole): string => {
  const roleNames: Record<EmployeeRole, string> = {
    admin: "Administrador",
    user: "Usuario",
    mensajero: "Mensajero",
    gerente: "Gerente",
  }
  return roleNames[role] || role
}

export default function AdminEmployeesPage() {
  const { user } = useAuth()
  const [employees, setEmployees] = useState<ManagerResponse[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<ManagerResponse | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    Pnom: "",
    Snom: "",
    Papellido: "",
    Sapellido: "",
    Email: "",
    Rol: "user" as EmployeeRole,
    Telefono: "",
    Password: "",
  })

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    loadEmployees()
  }, [user])

  const loadEmployees = async () => {
    setIsLoading(true)
    const { data, error } = await getManagerRoles(user?.token)
    if (data) {
      setEmployees(data)
    } else if (error) {
      setErrorMessage(error)
    }
    setIsLoading(false)
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const buildFullName = () => {
    const parts = [newEmployee.Pnom, newEmployee.Snom, newEmployee.Papellido, newEmployee.Sapellido].filter(Boolean)
    return parts.join(" ")
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    // Validate phone is 8 digits
    if (newEmployee.Telefono.length !== 8) {
      setErrorMessage("El teléfono debe tener exactamente 8 dígitos")
      setIsSubmitting(false)
      return
    }

    const { data, error } = await registerManager(
      {
        Email: newEmployee.Email,
        Password: newEmployee.Password,
        Pnom: newEmployee.Pnom.trim(),
        Snom: newEmployee.Snom.trim(),
        Papellido: newEmployee.Papellido.trim(),
        Sapellido: newEmployee.Sapellido.trim(),
        Telefono: newEmployee.Telefono,
        Rol: newEmployee.Rol,
      },
      user?.token,
    )

    if (error) {
      setErrorMessage(error)
      setIsSubmitting(false)
      return
    }

    // Reload employees list
    await loadEmployees()

    const fullName = buildFullName()
    setNewEmployee({
      Pnom: "",
      Snom: "",
      Papellido: "",
      Sapellido: "",
      Email: "",
      Rol: "user",
      Telefono: "",
      Password: "",
    })
    setIsAddDialogOpen(false)
    setShowPassword(false)
    setIsSubmitting(false)

    setSuccessMessage(`Empleado "${fullName}" creado exitosamente.`)
    setTimeout(() => setSuccessMessage(""), 5000)
  }

  const handleToggleStatus = async (id: string) => {
    const emp = employees.find((e) => e.id === id)
    if (!emp) return

    const newStatus = emp.status === "active" ? "inactive" : "active"

    const { error } = await updateManager(emp.email, { status: newStatus } as any, user?.token)

    if (error) {
      setErrorMessage(error)
      return
    }

    // Update local state
    setEmployees(employees.map((e) => (e.id === id ? { ...e, status: newStatus } : e)))
  }

  const handleDeleteClick = (emp: ManagerResponse) => {
    setEmployeeToDelete(emp)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!employeeToDelete) return

    const { error } = await deleteManager(employeeToDelete.email, user?.token)

    if (error) {
      setErrorMessage(error)
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
      return
    }

    // Update local state
    setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id))

    setSuccessMessage(`Empleado "${employeeToDelete.name}" eliminado del sistema`)
    setTimeout(() => setSuccessMessage(""), 5000)

    setDeleteDialogOpen(false)
    setEmployeeToDelete(null)
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
          <h1 className="text-3xl font-bold">Gestión de Empleados</h1>
          <p className="text-muted-foreground">Administra los usuarios del sistema</p>
        </div>
        {isAdmin && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
                <DialogDescription>
                  Crea una nueva cuenta de empleado. El empleado podrá iniciar sesión con estas credenciales.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="Pnom">Primer Nombre *</Label>
                    <Input
                      id="Pnom"
                      placeholder="Juan"
                      value={newEmployee.Pnom}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Pnom: e.target.value })}
                      required
                      maxLength={30}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Snom">Segundo Nombre</Label>
                    <Input
                      id="Snom"
                      placeholder="Carlos"
                      value={newEmployee.Snom}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Snom: e.target.value })}
                      maxLength={30}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="Papellido">Primer Apellido *</Label>
                    <Input
                      id="Papellido"
                      placeholder="Pérez"
                      value={newEmployee.Papellido}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Papellido: e.target.value })}
                      required
                      maxLength={30}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Sapellido">Segundo Apellido</Label>
                    <Input
                      id="Sapellido"
                      placeholder="López"
                      value={newEmployee.Sapellido}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Sapellido: e.target.value })}
                      maxLength={30}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Email">Correo Electrónico *</Label>
                  <Input
                    id="Email"
                    type="email"
                    placeholder="correo@nicaflex.com"
                    value={newEmployee.Email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, Email: e.target.value })}
                    required
                    maxLength={60}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Telefono">Teléfono *</Label>
                  <Input
                    id="Telefono"
                    type="tel"
                    placeholder="88889999"
                    value={newEmployee.Telefono}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, Telefono: e.target.value.replace(/\D/g, "").slice(0, 8) })
                    }
                    required
                    minLength={8}
                    maxLength={8}
                  />
                  <p className="text-xs text-muted-foreground">8 dígitos sin espacios ni guiones</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña para el empleado"
                      value={newEmployee.Password}
                      onChange={(e) => setNewEmployee({ ...newEmployee, Password: e.target.value })}
                      required
                      minLength={6}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Mínimo 6 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="Rol">Rol *</Label>
                  <Select
                    value={newEmployee.Rol}
                    onValueChange={(value: EmployeeRole) => setNewEmployee({ ...newEmployee, Rol: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="mensajero">Mensajero</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    {errorMessage}
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Crear Empleado
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={18} className="text-green-600" />
          </div>
          <p className="text-green-800 text-sm">{successMessage}</p>
          <button onClick={() => setSuccessMessage("")} className="ml-auto text-green-600 hover:text-green-800">
            <X size={18} />
          </button>
        </div>
      )}

      {errorMessage && !isAddDialogOpen && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <X size={18} className="text-red-600" />
          </div>
          <p className="text-red-800 text-sm">{errorMessage}</p>
          <button onClick={() => setErrorMessage("")} className="ml-auto text-red-600 hover:text-red-800">
            <X size={18} />
          </button>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Buscar por nombre, email o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{employees.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{employees.filter((e) => e.status === "active").length}</p>
            <p className="text-sm text-muted-foreground">Activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">
              {employees.filter((e) => e.status === "inactive").length}
            </p>
            <p className="text-sm text-muted-foreground">Inactivos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{employees.filter((e) => e.role === "admin").length}</p>
            <p className="text-sm text-muted-foreground">Admins</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No se encontraron empleados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium">{emp.name}</TableCell>
                      <TableCell className="text-muted-foreground">{emp.email}</TableCell>
                      <TableCell>
                        <Badge variant={emp.role === "admin" ? "default" : "secondary"}>
                          {getRoleDisplayName(emp.role as EmployeeRole)}
                        </Badge>
                      </TableCell>
                      <TableCell>{emp.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            emp.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }
                        >
                          {emp.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{emp.createdAt}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={emp.status === "active" ? "Desactivar cuenta" : "Activar cuenta"}
                              onClick={() => handleToggleStatus(emp.id)}
                            >
                              {emp.status === "active" ? (
                                <UserX size={16} className="text-orange-600" />
                              ) : (
                                <UserCheck size={16} className="text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              title="Eliminar empleado"
                              onClick={() => handleDeleteClick(emp)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar empleado?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente a {employeeToDelete?.name} del sistema. Esta acción no se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
