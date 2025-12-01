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
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    email: "",
    role: "employee" as "admin" | "employee",
    department: "",
    phone: "",
    password: "",
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
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const buildFullName = () => {
    const parts = [
      newEmployee.firstName,
      newEmployee.secondName,
      newEmployee.firstLastName,
      newEmployee.secondLastName,
    ].filter(Boolean)
    return parts.join(" ")
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage("")

    const { data, error } = await registerManager(
      {
        email: newEmployee.email,
        password: newEmployee.password,
        firstName: newEmployee.firstName.trim(),
        secondName: newEmployee.secondName.trim() || undefined,
        firstLastName: newEmployee.firstLastName.trim(),
        secondLastName: newEmployee.secondLastName.trim() || undefined,
        role: newEmployee.role,
        department: newEmployee.department,
        phone: newEmployee.phone,
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
      firstName: "",
      secondName: "",
      firstLastName: "",
      secondLastName: "",
      email: "",
      role: "employee",
      department: "",
      phone: "",
      password: "",
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
                {/* ... existing form fields ... */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Primer Nombre *</Label>
                    <Input
                      id="firstName"
                      placeholder="Juan"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondName">Segundo Nombre</Label>
                    <Input
                      id="secondName"
                      placeholder="Carlos"
                      value={newEmployee.secondName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, secondName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstLastName">Primer Apellido *</Label>
                    <Input
                      id="firstLastName"
                      placeholder="Pérez"
                      value={newEmployee.firstLastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, firstLastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondLastName">Segundo Apellido</Label>
                    <Input
                      id="secondLastName"
                      placeholder="López"
                      value={newEmployee.secondLastName}
                      onChange={(e) => setNewEmployee({ ...newEmployee, secondLastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@nicaflex.com"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contraseña para el empleado"
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol *</Label>
                    <Select
                      value={newEmployee.role}
                      onValueChange={(value: "admin" | "employee") => setNewEmployee({ ...newEmployee, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employee">Empleado</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento *</Label>
                    <Select
                      value={newEmployee.department}
                      onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Gerencia">Gerencia</SelectItem>
                        <SelectItem value="Logística">Logística</SelectItem>
                        <SelectItem value="Atención al Cliente">Atención al Cliente</SelectItem>
                        <SelectItem value="Aduanas">Aduanas</SelectItem>
                        <SelectItem value="Almacén">Almacén</SelectItem>
                        <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="+505 8888-0000"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  />
                </div>

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

      {errorMessage && (
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
                  <TableHead>Departamento</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  {isAdmin && <TableHead className="text-right">Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                          {emp.role === "admin" ? "Admin" : "Empleado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
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

      {!isAdmin && (
        <p className="text-sm text-muted-foreground text-center mt-4">
          Solo los administradores pueden agregar o modificar empleados
        </p>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Empleado</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de eliminar a <strong>{employeeToDelete?.name}</strong>? Esta acción eliminará su cuenta del
              sistema y no podrá iniciar sesión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
