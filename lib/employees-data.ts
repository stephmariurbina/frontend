export interface Employee {
  id: string
  name: string
  email: string
  role: "admin" | "employee"
  department: string
  phone: string
  status: "active" | "inactive"
  createdAt: string
}

export const EMPLOYEES_DB: Employee[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@nicaflex.com",
    role: "admin",
    department: "Gerencia",
    phone: "+505 8888-1111",
    status: "active",
    createdAt: "01 Ene, 2024",
  },
  {
    id: "2",
    name: "Carlos Martínez",
    email: "empleado@nicaflex.com",
    role: "employee",
    department: "Logística",
    phone: "+505 8888-2222",
    status: "active",
    createdAt: "15 Feb, 2024",
  },
  {
    id: "3",
    name: "Laura Pérez",
    email: "laura.perez@nicaflex.com",
    role: "employee",
    department: "Atención al Cliente",
    phone: "+505 8888-3333",
    status: "active",
    createdAt: "20 Mar, 2024",
  },
  {
    id: "4",
    name: "Roberto Sánchez",
    email: "roberto.sanchez@nicaflex.com",
    role: "employee",
    department: "Aduanas",
    phone: "+505 8888-4444",
    status: "inactive",
    createdAt: "10 Abr, 2024",
  },
]
