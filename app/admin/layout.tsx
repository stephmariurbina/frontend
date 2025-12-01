"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Package, Users, FileText, LayoutDashboard, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Paquetes", icon: Package },
  { href: "/admin/employees", label: "Empleados", icon: Users },
  { href: "/admin/reports", label: "Reportes", icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    console.log("[v0] AdminLayout: isLoading:", isLoading, "user:", user)
    if (!isLoading) {
      if (!user) {
        console.log("[v0] AdminLayout: No user, redirecting to /login")
        router.push("/login")
      } else if (user.role !== "admin" && user.role !== "employee") {
        console.log("[v0] AdminLayout: User role not admin/employee, redirecting to /")
        router.push("/")
      } else {
        console.log("[v0] AdminLayout: User authenticated with role:", user.role)
      }
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">NF</span>
              </div>
              <div>
                <span className="font-bold text-lg text-primary block">Nica Flex</span>
                <span className="text-xs text-muted-foreground">Panel Admin</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3 px-4">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.role === "admin" ? "Administrador" : "Empleado"}
              </p>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 bg-transparent" onClick={handleLogout}>
              <LogOut size={18} />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
