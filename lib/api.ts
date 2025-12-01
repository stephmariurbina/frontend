const API_BASE_URL = "https://software-0ofx.onrender.com"

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return { error: errorData.message || `Error: ${response.status}` }
    }

    const data = await response.json()
    return { data }
  } catch (error) {
    console.error("[v0] API Error:", error)
    return { error: "Error de conexión con el servidor" }
  }
}

// ==================== USER ENDPOINTS ====================

export interface UserRegisterData {
  Pnom: string // Primer nombre (max 30)
  Snom: string // Segundo nombre (max 30)
  Papellido: string // Primer apellido (max 30)
  Sapellido: string // Segundo apellido (max 30)
  Email: string // Email (max 60)
  Password: string // Password (min 6)
  Telefono: string // Teléfono (8 caracteres)
}

export interface UserLoginData {
  Email: string
  Password: string
}

export interface UserLoginResponse {
  id: string
  email: string
  name: string
  Pnom: string
  Snom?: string
  Papellido: string
  Sapellido?: string
  role: "admin" | "user" | "mensajero" | "gerente"
  token?: string
}

// POST /user/register - Register a new customer
export async function registerUser(data: UserRegisterData) {
  return apiRequest<UserLoginResponse>("/user/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// POST /user/login - Login user
export async function loginUser(data: UserLoginData) {
  return apiRequest<UserLoginResponse>("/user/login", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// ==================== DIRECCION ENDPOINTS ====================

export interface CreateDireccionData {
  calle: string // max 40
  ciudad: string // max 40
  departamento: string // max 30
  codigoPostal: string // max 20
  pais: string // max 60
}

// POST /user/dirección - Add user address
export async function addUserAddress(address: CreateDireccionData, token?: string) {
  return apiRequest("/user/dirección", {
    method: "POST",
    body: JSON.stringify(address),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// GET /user/misDirecciones - Get user addresses
export async function getUserAddresses(token?: string) {
  return apiRequest<any[]>("/user/misDirecciones", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// GET /user/tracking/{codigo} - Track package by code
export async function trackPackage(codigo: string) {
  return apiRequest<any>(`/user/tracking/${codigo}`)
}

// ==================== ADMIN MANAGER ENDPOINTS ====================

export interface ManagerRegisterData {
  Pnom: string // Primer nombre (max 30)
  Snom: string // Segundo nombre (max 30)
  Papellido: string // Primer apellido (max 30)
  Sapellido: string // Segundo apellido (max 30)
  Email: string // Email (max 60)
  Password: string // Password (min 6)
  Telefono: string // Teléfono (8 caracteres)
  Rol: string // Rol del usuario
}

export interface ManagerResponse {
  id: string
  email: string
  name: string
  Pnom: string
  Snom?: string
  Papellido: string
  Sapellido?: string
  role: "admin" | "user" | "mensajero" | "gerente"
  department?: string
  phone?: string
  status: "active" | "inactive"
  createdAt: string
}

// POST /admin/manager/register - Register a new manager/employee
export async function registerManager(data: ManagerRegisterData, token?: string) {
  return apiRequest<ManagerResponse>("/admin/manager/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// PUT /admin/manager/update/{email} - Update manager by email
export async function updateManager(email: string, data: Partial<ManagerRegisterData>, token?: string) {
  return apiRequest<ManagerResponse>(`/admin/manager/update/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// DELETE /admin/manager/delete/{email} - Delete manager by email
export async function deleteManager(email: string, token?: string) {
  return apiRequest(`/admin/manager/delete/${encodeURIComponent(email)}`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// GET /admin/manager/roles - Get all managers/employees
export async function getManagerRoles(token?: string) {
  return apiRequest<ManagerResponse[]>("/admin/manager/roles", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// ==================== ADMIN PACKAGES ENDPOINTS ====================

export interface PackageCreateData {
  Pnom: string
  Snom: string
  Papellido: string
  Sapellido: string
  ID_Direccion_Origen: number
  ID_Direccion_Destino: number
  n_Receptor: string
  Peso: number // min 0.1
  Largo?: number
  Ancho?: number
  Alto?: number
  nombreEstado: string
}

export interface PackageResponse {
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
  assignedTo?: string
  assignedToName?: string
  createdAt: string
  coordinates?: { lat: number; lng: number }
  history?: Array<{
    status: string
    location: string
    date: string
    time: string
    completed: boolean
  }>
}

// POST /admin/paquetes/crear - Create a new package
export async function createPackage(data: PackageCreateData, token?: string) {
  return apiRequest<PackageResponse>("/admin/paquetes/crear", {
    method: "POST",
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// GET /admin/paquetes/reportes - Get all packages (reports)
export async function getPackagesReports(token?: string) {
  return apiRequest<PackageResponse[]>("/admin/paquetes/reportes", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// ==================== COURIER ENDPOINTS ====================

// GET /courier/paquetes - Get packages assigned to courier
export async function getCourierPackages(token?: string) {
  return apiRequest<PackageResponse[]>("/courier/paquetes", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}

// PUT /courier/paquetes/{id} - Update package status (custom endpoint)
export async function updatePackageStatus(
  id: string,
  data: { currentStatus: string; location?: string },
  token?: string,
) {
  return apiRequest<PackageResponse>(`/courier/paquetes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
