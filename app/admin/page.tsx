"use client"

import { Package, Users, Truck, CheckCircle2, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPackages } from "@/lib/packages-data"
import { EMPLOYEES_DB } from "@/lib/employees-data"

export default function AdminDashboard() {
  const packages = getAllPackages()
  const employees = EMPLOYEES_DB

  const stats = {
    totalPackages: packages.length,
    inTransit: packages.filter((p) => p.currentStatus === "En tránsito").length,
    delivered: packages.filter((p) => p.currentStatus === "Entregado").length,
    processing: packages.filter((p) => p.currentStatus === "En procesamiento").length,
    inCustoms: packages.filter((p) => p.currentStatus === "En aduana").length,
    activeEmployees: employees.filter((e) => e.status === "active").length,
  }

  const recentPackages = packages.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen general del sistema</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paquetes</p>
                <p className="text-3xl font-bold">{stats.totalPackages}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Package className="text-primary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Tránsito</p>
                <p className="text-3xl font-bold">{stats.inTransit}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Truck className="text-blue-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entregados</p>
                <p className="text-3xl font-bold">{stats.delivered}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Empleados Activos</p>
                <p className="text-3xl font-bold">{stats.activeEmployees}</p>
              </div>
              <div className="p-3 bg-secondary/20 rounded-full">
                <Users className="text-secondary" size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp size={20} />
              Estado de Paquetes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>En procesamiento</span>
                </div>
                <span className="font-semibold">{stats.processing}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>En tránsito</span>
                </div>
                <span className="font-semibold">{stats.inTransit}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>En aduana</span>
                </div>
                <span className="font-semibold">{stats.inCustoms}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Entregados</span>
                </div>
                <span className="font-semibold">{stats.delivered}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Paquetes Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPackages.map((pkg) => (
                <div key={pkg.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-mono text-sm font-medium">{pkg.trackingId}</p>
                    <p className="text-xs text-muted-foreground">{pkg.destination}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      pkg.currentStatus === "Entregado"
                        ? "bg-green-100 text-green-800"
                        : pkg.currentStatus === "En tránsito"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {pkg.currentStatus}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
