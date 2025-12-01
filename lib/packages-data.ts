export interface PackageStatus {
  status: string
  location: string
  date: string
  time: string
  completed: boolean
}

export interface PackageInfo {
  id: string
  trackingId: string
  description: string
  weight: string
  origin: string
  destination: string
  sender: string
  receiver: string
  receiverEmail: string
  currentStatus: string
  estimatedDelivery: string
  createdAt: string
  history: PackageStatus[]
  coordinates: { lat: number; lng: number }
  assignedTo?: string // email del mensajero asignado
  assignedToName?: string // nombre del mensajero
}

// Base de datos simulada de paquetes
export const PACKAGES_DB: PackageInfo[] = [
  {
    id: "1",
    trackingId: "NCF-2024-001",
    description: "Electrónicos - Laptop y accesorios",
    weight: "3.5 kg",
    origin: "Miami, FL",
    destination: "Managua, Nicaragua",
    sender: "Tech Store Miami",
    receiver: "María López",
    receiverEmail: "cliente@gmail.com",
    currentStatus: "En tránsito",
    estimatedDelivery: "28 Nov, 2025",
    createdAt: "20 Nov, 2025",
    coordinates: { lat: 14.634915, lng: -87.849487 },
    history: [
      { status: "Paquete recibido", location: "Miami, FL", date: "20 Nov", time: "09:30 AM", completed: true },
      { status: "En procesamiento", location: "Miami, FL", date: "21 Nov", time: "02:15 PM", completed: true },
      { status: "En tránsito", location: "Honduras", date: "24 Nov", time: "11:00 AM", completed: true },
      { status: "En aduana", location: "Managua, NI", date: "27 Nov", time: "Pendiente", completed: false },
      { status: "En camino a entrega", location: "Managua, NI", date: "28 Nov", time: "Pendiente", completed: false },
    ],
    assignedTo: "mensajero1@example.com",
    assignedToName: "Juan Pérez",
  },
  {
    id: "2",
    trackingId: "NCF-2024-002",
    description: "Ropa y calzado",
    weight: "2.1 kg",
    origin: "Los Angeles, CA",
    destination: "León, Nicaragua",
    sender: "Fashion Express",
    receiver: "María López",
    receiverEmail: "cliente@gmail.com",
    currentStatus: "Entregado",
    estimatedDelivery: "15 Nov, 2025",
    createdAt: "10 Nov, 2025",
    coordinates: { lat: 12.4346, lng: -86.878 },
    history: [
      { status: "Paquete recibido", location: "Los Angeles, CA", date: "10 Nov", time: "10:00 AM", completed: true },
      { status: "En procesamiento", location: "Los Angeles, CA", date: "11 Nov", time: "03:30 PM", completed: true },
      { status: "En tránsito", location: "Guatemala", date: "13 Nov", time: "08:45 AM", completed: true },
      { status: "En aduana", location: "Managua, NI", date: "14 Nov", time: "02:00 PM", completed: true },
      { status: "Entregado", location: "León, NI", date: "15 Nov", time: "11:30 AM", completed: true },
    ],
    assignedTo: "mensajero2@example.com",
    assignedToName: "Ana Sánchez",
  },
  {
    id: "3",
    trackingId: "NCF-2024-003",
    description: "Repuestos de vehículo",
    weight: "8.2 kg",
    origin: "Houston, TX",
    destination: "Chinandega, Nicaragua",
    sender: "Auto Parts TX",
    receiver: "María López",
    receiverEmail: "cliente@gmail.com",
    currentStatus: "En procesamiento",
    estimatedDelivery: "02 Dic, 2025",
    createdAt: "25 Nov, 2025",
    coordinates: { lat: 29.7604, lng: -95.3698 },
    history: [
      { status: "Paquete recibido", location: "Houston, TX", date: "25 Nov", time: "04:00 PM", completed: true },
      { status: "En procesamiento", location: "Houston, TX", date: "26 Nov", time: "09:00 AM", completed: true },
      { status: "En tránsito", location: "---", date: "---", time: "Pendiente", completed: false },
      { status: "En aduana", location: "---", date: "---", time: "Pendiente", completed: false },
      { status: "En camino a entrega", location: "---", date: "---", time: "Pendiente", completed: false },
    ],
    assignedTo: "mensajero3@example.com",
    assignedToName: "Carlos Hernández",
  },
  {
    id: "4",
    trackingId: "NCF-2024-004",
    description: "Medicamentos y suplementos",
    weight: "1.2 kg",
    origin: "New York, NY",
    destination: "Granada, Nicaragua",
    sender: "Health Plus NY",
    receiver: "Carlos Martínez",
    receiverEmail: "empleado@nicaflex.com",
    currentStatus: "En aduana",
    estimatedDelivery: "29 Nov, 2025",
    createdAt: "22 Nov, 2025",
    coordinates: { lat: 11.9344, lng: -85.956 },
    history: [
      { status: "Paquete recibido", location: "New York, NY", date: "22 Nov", time: "11:30 AM", completed: true },
      { status: "En procesamiento", location: "New York, NY", date: "23 Nov", time: "01:00 PM", completed: true },
      { status: "En tránsito", location: "México", date: "25 Nov", time: "06:00 AM", completed: true },
      { status: "En aduana", location: "Managua, NI", date: "26 Nov", time: "03:45 PM", completed: true },
      { status: "En camino a entrega", location: "Granada, NI", date: "29 Nov", time: "Pendiente", completed: false },
    ],
    assignedTo: "mensajero4@example.com",
    assignedToName: "Laura Gómez",
  },
  {
    id: "5",
    trackingId: "NCF-2024-005",
    description: "Juguetes y artículos para niños",
    weight: "4.5 kg",
    origin: "Orlando, FL",
    destination: "Masaya, Nicaragua",
    sender: "Toys Paradise",
    receiver: "Ana García",
    receiverEmail: "ana.garcia@email.com",
    currentStatus: "En tránsito",
    estimatedDelivery: "30 Nov, 2025",
    createdAt: "23 Nov, 2025",
    coordinates: { lat: 15.2045, lng: -88.4536 },
    history: [
      { status: "Paquete recibido", location: "Orlando, FL", date: "23 Nov", time: "02:00 PM", completed: true },
      { status: "En procesamiento", location: "Orlando, FL", date: "24 Nov", time: "10:30 AM", completed: true },
      { status: "En tránsito", location: "Guatemala", date: "26 Nov", time: "07:15 AM", completed: true },
      { status: "En aduana", location: "---", date: "---", time: "Pendiente", completed: false },
      { status: "En camino a entrega", location: "---", date: "---", time: "Pendiente", completed: false },
    ],
    assignedTo: "mensajero5@example.com",
    assignedToName: "Pedro Jiménez",
  },
]

export function getPackagesByEmail(email: string): PackageInfo[] {
  return PACKAGES_DB.filter((pkg) => pkg.receiverEmail.toLowerCase() === email.toLowerCase())
}

export function getPackageByTrackingId(trackingId: string): PackageInfo | undefined {
  return PACKAGES_DB.find((pkg) => pkg.trackingId.toLowerCase() === trackingId.toLowerCase())
}

export function getAllPackages(): PackageInfo[] {
  return PACKAGES_DB
}
