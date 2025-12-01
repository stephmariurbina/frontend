"use client"

import { useState } from "react"
import { FileText, Download, TrendingUp, Package, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllPackages } from "@/lib/packages-data"
import { EMPLOYEES_DB } from "@/lib/employees-data"

export default function AdminReportsPage() {
  const packages = getAllPackages()
  const employees = EMPLOYEES_DB

  const [reportType, setReportType] = useState("packages")
  const [dateRange, setDateRange] = useState("month")
  const [generatedReport, setGeneratedReport] = useState<null | {
    title: string
    data: Array<{ label: string; value: string | number }>
    summary: string
  }>(null)

  const generateReport = () => {
    let report = {
      title: "",
      data: [] as Array<{ label: string; value: string | number }>,
      summary: "",
    }

    if (reportType === "packages") {
      const total = packages.length
      const delivered = packages.filter((p) => p.currentStatus === "Entregado").length
      const inTransit = packages.filter((p) => p.currentStatus === "En tránsito").length
      const processing = packages.filter((p) => p.currentStatus === "En procesamiento").length
      const inCustoms = packages.filter((p) => p.currentStatus === "En aduana").length

      report = {
        title: "Reporte de Paquetes",
        data: [
          { label: "Total de Paquetes", value: total },
          { label: "Entregados", value: delivered },
          { label: "En Tránsito", value: inTransit },
          { label: "En Procesamiento", value: processing },
          { label: "En Aduana", value: inCustoms },
          { label: "Tasa de Entrega", value: `${((delivered / total) * 100).toFixed(1)}%` },
        ],
        summary: `Durante el período seleccionado se procesaron ${total} paquetes, de los cuales ${delivered} fueron entregados exitosamente, representando una tasa de entrega del ${((delivered / total) * 100).toFixed(1)}%.`,
      }
    } else if (reportType === "destinations") {
      const destinations: Record<string, number> = {}
      packages.forEach((p) => {
        const city = p.destination.split(",")[0].trim()
        destinations[city] = (destinations[city] || 0) + 1
      })

      report = {
        title: "Reporte por Destinos",
        data: Object.entries(destinations)
          .sort((a, b) => b[1] - a[1])
          .map(([city, count]) => ({ label: city, value: count })),
        summary: `Los destinos más frecuentes son ${Object.entries(destinations)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([city]) => city)
          .join(", ")}.`,
      }
    } else if (reportType === "employees") {
      const active = employees.filter((e) => e.status === "active").length
      const inactive = employees.filter((e) => e.status === "inactive").length
      const admins = employees.filter((e) => e.role === "admin").length

      const departments: Record<string, number> = {}
      employees.forEach((e) => {
        departments[e.department] = (departments[e.department] || 0) + 1
      })

      report = {
        title: "Reporte de Empleados",
        data: [
          { label: "Total de Empleados", value: employees.length },
          { label: "Activos", value: active },
          { label: "Inactivos", value: inactive },
          { label: "Administradores", value: admins },
          ...Object.entries(departments).map(([dept, count]) => ({
            label: `Dpto. ${dept}`,
            value: count,
          })),
        ],
        summary: `La empresa cuenta con ${employees.length} empleados, ${active} activos y ${inactive} inactivos, distribuidos en ${Object.keys(departments).length} departamentos.`,
      }
    }

    setGeneratedReport(report)
  }

  const downloadReport = () => {
    if (!generatedReport) return

    const content = `
${generatedReport.title}
${"=".repeat(40)}
Fecha de generación: ${new Date().toLocaleDateString("es-NI")}
Período: ${dateRange === "week" ? "Última semana" : dateRange === "month" ? "Último mes" : "Último año"}

DATOS:
${generatedReport.data.map((d) => `• ${d.label}: ${d.value}`).join("\n")}

RESUMEN:
${generatedReport.summary}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reporte-${reportType}-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground">Genera reportes detallados del sistema</p>
      </div>

      {/* Report Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Configurar Reporte
          </CardTitle>
          <CardDescription>Selecciona el tipo de reporte y el rango de fechas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="packages">
                    <span className="flex items-center gap-2">
                      <Package size={16} />
                      Paquetes
                    </span>
                  </SelectItem>
                  <SelectItem value="destinations">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      Destinos
                    </span>
                  </SelectItem>
                  <SelectItem value="employees">
                    <span className="flex items-center gap-2">
                      <TrendingUp size={16} />
                      Empleados
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Última semana</SelectItem>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={generateReport} className="w-full gap-2">
                <FileText size={18} />
                Generar Reporte
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Report */}
      {generatedReport && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{generatedReport.title}</CardTitle>
              <CardDescription>
                Generado el {new Date().toLocaleDateString("es-NI")} | Período:{" "}
                {dateRange === "week" ? "Última semana" : dateRange === "month" ? "Último mes" : "Último año"}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={downloadReport} className="gap-2 bg-transparent">
              <Download size={18} />
              Descargar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {generatedReport.data.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-primary">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <h4 className="font-semibold mb-2">Resumen</h4>
              <p className="text-muted-foreground">{generatedReport.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Reports */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => {
            setReportType("packages")
            generateReport()
          }}
        >
          <CardContent className="p-6 text-center">
            <Package className="mx-auto text-primary mb-3" size={32} />
            <h3 className="font-semibold">Reporte Rápido de Paquetes</h3>
            <p className="text-sm text-muted-foreground">Ver estadísticas de envíos</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => {
            setReportType("destinations")
            generateReport()
          }}
        >
          <CardContent className="p-6 text-center">
            <MapPin className="mx-auto text-primary mb-3" size={32} />
            <h3 className="font-semibold">Reporte de Destinos</h3>
            <p className="text-sm text-muted-foreground">Análisis por ubicaciones</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition"
          onClick={() => {
            setReportType("employees")
            generateReport()
          }}
        >
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto text-primary mb-3" size={32} />
            <h3 className="font-semibold">Reporte de Personal</h3>
            <p className="text-sm text-muted-foreground">Estado del equipo</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
