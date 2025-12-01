"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Package, Loader2, User, Mail, Lock, Phone } from "lucide-react"
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
  const [pnom, setPnom] = useState("")
  const [snom, setSnom] = useState("")
  const [papellido, setPapellido] = useState("")
  const [sapellido, setSapellido] = useState("")
  const [telefono, setTelefono] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, user, registerCustomer } = useAuth()
  const router = useRouter()

  if (user) {
    if (user.role === "admin" || user.role === "gerente") {
      router.push("/admin")
    } else if (user.role === "mensajero") {
      router.push("/courier")
    } else {
      router.push("/my-packages")
    }
    return null
  }

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setPnom("")
    setSnom("")
    setPapellido("")
    setSapellido("")
    setTelefono("")
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

    if (pnom.trim().length < 2) {
      setError("El primer nombre debe tener al menos 2 caracteres")
      setIsLoading(false)
      return
    }

    if (papellido.trim().length < 2) {
      setError("El primer apellido debe tener al menos 2 caracteres")
      setIsLoading(false)
      return
    }

    if (telefono.length !== 8) {
      setError("El teléfono debe tener exactamente 8 dígitos")
      setIsLoading(false)
      return
    }

    const result = await registerCustomer(email, password, {
      Pnom: pnom.trim(),
      Snom: snom.trim() || undefined,
      Papellido: papellido.trim(),
      Sapellido: sapellido.trim() || undefined,
      Telefono: telefono,
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
                    <Label htmlFor="pnom">Primer Nombre *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input
                        id="pnom"
                        type="text"
                        placeholder="Juan"
                        value={pnom}
                        onChange={(e) => setPnom(e.target.value)}
                        required
                        maxLength={30}
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="snom">Segundo Nombre</Label>
                    <Input
                      id="snom"
                      type="text"
                      placeholder="Carlos"
                      value={snom}
                      onChange={(e) => setSnom(e.target.value)}
                      maxLength={30}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="papellido">Primer Apellido *</Label>
                    <Input
                      id="papellido"
                      type="text"
                      placeholder="Pérez"
                      value={papellido}
                      onChange={(e) => setPapellido(e.target.value)}
                      required
                      maxLength={30}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sapellido">Segundo Apellido</Label>
                    <Input
                      id="sapellido"
                      type="text"
                      placeholder="López"
                      value={sapellido}
                      onChange={(e) => setSapellido(e.target.value)}
                      maxLength={30}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      maxLength={60}
                      className="h-11 pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <Input
                      id="telefono"
                      type="tel"
                      placeholder="88889999"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 8))}
                      required
                      minLength={8}
                      maxLength={8}
                      className="h-11 pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">8 dígitos sin espacios ni guiones</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña *</Label>
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
                  <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
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
