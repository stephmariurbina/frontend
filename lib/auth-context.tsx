"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  registerManager,
  deleteManager,
  updateManager,
} from "./api"

export type UserRole = "admin" | "user" | "mensajero" | "gerente"

export interface User {
  id: string
  email: string
  name: string
  Pnom: string
  Snom?: string
  Papellido: string
  Sapellido?: string
  role: UserRole
  token?: string
}

export interface NameFields {
  Pnom: string // Primer nombre
  Snom?: string // Segundo nombre
  Papellido: string // Primer apellido
  Sapellido?: string // Segundo apellido
  Telefono: string // Teléfono (8 caracteres)
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  registerUser: (
    email: string,
    password: string,
    nameFields: NameFields,
    role: UserRole,
  ) => Promise<{ success: boolean; error?: string }>
  registerCustomer: (
    email: string,
    password: string,
    nameFields: NameFields,
  ) => Promise<{ success: boolean; error?: string }>
  removeUser: (email: string) => Promise<{ success: boolean; error?: string }>
  updateUserStatus: (email: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>
  getToken: () => string | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const buildFullName = (nameFields: NameFields): string => {
  const parts = [nameFields.Pnom, nameFields.Snom, nameFields.Papellido, nameFields.Sapellido].filter(Boolean)
  return parts.join(" ")
}

function mapApiRoleToLocalRole(apiRole: string): UserRole {
  const roleMap: Record<string, UserRole> = {
    admin: "admin",
    employee: "mensajero",
    customer: "user",
    mensajero: "mensajero",
    gerente: "gerente",
    user: "user",
  }
  return roleMap[apiRole] || "user"
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = sessionStorage.getItem("nicaflex_user")

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        sessionStorage.removeItem("nicaflex_user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await apiLogin({ Email: email, Password: password })

    if (error || !data) {
      console.error("[v0] Login error:", error)
      return false
    }

    const mappedRole = mapApiRoleToLocalRole(data.role)

    const loggedUser: User = {
      id: data.id,
      email: data.email,
      name: data.name || `${data.Pnom || ""} ${data.Papellido || ""}`.trim(),
      Pnom: data.Pnom || "",
      Snom: data.Snom || "",
      Papellido: data.Papellido || "",
      Sapellido: data.Sapellido || "",
      role: mappedRole,
      token: data.token,
    }

    setUser(loggedUser)
    sessionStorage.setItem("nicaflex_user", JSON.stringify(loggedUser))
    return true
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("nicaflex_user")
  }

  const registerUser = async (
    email: string,
    password: string,
    nameFields: NameFields,
    role: UserRole,
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await registerManager(
      {
        Email: email,
        Password: password,
        Pnom: nameFields.Pnom,
        Snom: nameFields.Snom || "",
        Papellido: nameFields.Papellido,
        Sapellido: nameFields.Sapellido || "",
        Telefono: nameFields.Telefono,
        Rol: role,
      },
      user?.token,
    )

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  const registerCustomer = async (
    email: string,
    password: string,
    nameFields: NameFields,
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await apiRegister({
      Email: email,
      Password: password,
      Pnom: nameFields.Pnom,
      Snom: nameFields.Snom || "",
      Papellido: nameFields.Papellido,
      Sapellido: nameFields.Sapellido || "",
      Telefono: nameFields.Telefono,
    })

    if (error || !data) {
      return { success: false, error: error || "Error al registrar" }
    }

    // Auto-login after registration
    const loggedUser: User = {
      id: data.id,
      email: data.email,
      name: data.name || `${data.Pnom || ""} ${data.Papellido || ""}`.trim(),
      Pnom: data.Pnom || "",
      Snom: data.Snom || "",
      Papellido: data.Papellido || "",
      Sapellido: data.Sapellido || "",
      role: mapApiRoleToLocalRole(data.role),
      token: data.token,
    }

    setUser(loggedUser)
    sessionStorage.setItem("nicaflex_user", JSON.stringify(loggedUser))

    return { success: true }
  }

  const removeUser = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await deleteManager(email, user?.token)

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  const updateUserStatus = async (email: string, isActive: boolean): Promise<{ success: boolean; error?: string }> => {
    const { error } = await updateManager(email, { status: isActive ? "active" : "inactive" } as any, user?.token)

    if (error) {
      return { success: false, error }
    }

    return { success: true }
  }

  const getToken = () => user?.token

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        registerUser,
        registerCustomer,
        removeUser,
        updateUserStatus,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
