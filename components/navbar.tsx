"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User, LogOut, Package, Settings, Truck } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">NF</span>
            </div>
            <span className="font-bold text-xl text-primary hidden sm:inline">Nica Flex</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition">
              Inicio
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition">
              Quiénes Somos
            </Link>
            <Link href="/tracking" className="text-foreground hover:text-primary transition">
              Rastrear Paquete
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition">
              Contacto
            </Link>

            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <User size={18} />
                        <span className="max-w-[120px] truncate">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize mt-1">
                          {user.role === "admin" ? "Administrador" : user.role === "employee" ? "Empleado" : "Cliente"}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      {user.role === "customer" && (
                        <DropdownMenuItem asChild>
                          <Link href="/my-packages" className="cursor-pointer">
                            <Package size={16} className="mr-2" />
                            Mis Paquetes
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user.role === "employee" && (
                        <DropdownMenuItem asChild>
                          <Link href="/courier" className="cursor-pointer">
                            <Truck size={16} className="mr-2" />
                            Mis Paquetes Asignados
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {(user.role === "admin" || user.role === "employee") && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Settings size={16} className="mr-2" />
                            Panel de Administración
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                        <LogOut size={16} className="mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link href="/login">
                    <Button className="bg-primary hover:bg-primary/90">Iniciar Sesión</Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border">
            <Link href="/" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Inicio
            </Link>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Quiénes Somos
            </Link>
            <Link href="/tracking" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Rastrear Paquete
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
              Contacto
            </Link>
            {!isLoading && (
              <>
                {user ? (
                  <>
                    <div className="px-4 py-2 border-t border-border mt-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    {user.role === "customer" && (
                      <Link
                        href="/my-packages"
                        className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
                      >
                        Mis Paquetes
                      </Link>
                    )}
                    {user.role === "employee" && (
                      <Link
                        href="/courier"
                        className="block px-4 py-2 text-foreground hover:bg-muted rounded transition"
                      >
                        Mis Paquetes Asignados
                      </Link>
                    )}
                    {(user.role === "admin" || user.role === "employee") && (
                      <Link href="/admin" className="block px-4 py-2 text-foreground hover:bg-muted rounded transition">
                        Panel de Administración
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-destructive hover:bg-muted rounded transition"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block px-4 py-2">
                    <Button className="w-full bg-primary hover:bg-primary/90">Iniciar Sesión</Button>
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
