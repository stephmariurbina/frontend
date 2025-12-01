"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Package, Loader2, User, Mail, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [secondName, setSecondName] = useState("")
  const [firstLastName, setFirstLastName] = useState("")
  const [secondLastName, setSecondLastName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, registerCustomer } = useAuth()
  const router = useRouter()

  if (user) {
    router.push(user.role === "admin" ? "/admin" : user.role === "employee" ? "/courier" : "/my-packages")
    return null
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFirstName("")
    setSecondName("")
    setFirstLastName("")
    setSecondLastName("")
    setError("")
    setSuccess("")
  }

  const handleToggle = () => {
    resetForm()
    setIsRegister(!isRegister)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError("Credenciales incorrectas o cuenta desactivada. Contacta al administrador si el problema persiste.")
    }
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Validaciones
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (firstName.trim().length < 2) {
      setError("El primer nombre debe tener al menos 2 caracteres")
      setIsLoading(false)
      return
    }

    if (firstLastName.trim().length < 2) {
      setError("El primer apellido debe tener al menos 2 caracteres")
      setIsLoading(false)
      return
    }

    const result = await registerCustomer(email, password, {
      firstName: firstName.trim(),
      secondName: secondName.trim() || undefined,
      firstLastName: firstLastName.trim(),
      secondLastName: secondLastName.trim() || undefined,
    })

    if (result.success) {
      setSuccess("Cuenta creada exitosamente. Redirigiendo...")
      setTimeout(() => {
        router.push("/my-packages")
      }, 1500)
    } else {
      setError(result.error || "Error al crear la cuenta")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-lg">
            <Package className="text-primary-foreground" size={28} />
          </div>
          <span className="font-bold text-3xl text-primary">Nica Flex</span>
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">{isRegister ? "Crear Cuenta" : "Bienvenido"}</CardTitle>
            <CardDescription>
              {isRegister ? "Regístrate para rastrear tus paquetes" : "Ingresa a tu cuenta para continuar"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Primer Nombre *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Juan"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        minLength={2}
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondName">Segundo Nombre</Label>
                    <Input
                      id="secondName"
                      type="text"
                      placeholder="Carlos"
                      value={secondName}
                      onChange={(e) => setSecondName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstLastName">Primer Apellido *</Label>
                    <Input
                      id="firstLastName"
                      type="text"
                      placeholder="Pérez"
                      value={firstLastName}
                      onChange={(e) => setFirstLastName(e.target.value)}
                      required
                      minLength={2}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondLastName">Segundo Apellido</Label>
                    <Input
                      id="secondLastName"
                      type="text"
                      placeholder="López"
                      value={secondLastName}
                      onChange={(e) => setSecondLastName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
                {success && <div className="bg-green-500/10 text-green-600 text-sm p-3 rounded-lg">{success}</div>}

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear Cuenta"
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}

                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar Sesión"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}
                <button type="button" onClick={handleToggle} className="ml-1 text-primary font-medium hover:underline">
                  {isRegister ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </div>

            {!isRegister && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium text-center mb-3">Credenciales de Prueba</p>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Admin:</span>
                    <span className="font-mono">admin@nicaflex.com / admin123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empleado:</span>
                    <span className="font-mono">empleado@nicaflex.com / empleado123</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cliente:</span>
                    <span className="font-mono">cliente@gmail.com / cliente123</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/" className="hover:text-primary transition">
            Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  )
}
