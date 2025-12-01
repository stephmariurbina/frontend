"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  loginUser as apiLogin,
  registerUser as apiRegister,
  registerManager,
  deleteManager,
  updateManager,
} from "./api"

export type UserRole = "admin" | "employee" | "customer"

export interface User {
  id: string
  email: string
  name: string
  firstName: string
  secondName?: string
  firstLastName: string
  secondLastName?: string
  role: UserRole
  token?: string
}

export interface NameFields {
  firstName: string
  secondName?: string
  firstLastName: string
  secondLastName?: string
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
    department?: string,
    phone?: string,
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
  const parts = [
    nameFields.firstName,
    nameFields.secondName,
    nameFields.firstLastName,
    nameFields.secondLastName,
  ].filter(Boolean)
  return parts.join(" ")
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("[v0] AuthProvider: Checking sessionStorage for saved user")
    const savedUser = sessionStorage.getItem("nicaflex_user")
    console.log("[v0] AuthProvider: savedUser from sessionStorage:", savedUser)

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log("[v0] AuthProvider: Parsed user:", parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.log("[v0] AuthProvider: Error parsing saved user, clearing storage")
        sessionStorage.removeItem("nicaflex_user")
      }
    } else {
      console.log("[v0] AuthProvider: No saved user found, user should be null")
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await apiLogin({ email, password })

    if (error || !data) {
      console.error("[v0] Login error:", error)
      return false
    }

    const loggedUser: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      firstName: data.firstName,
      secondName: data.secondName || "",
      firstLastName: data.firstLastName,
      secondLastName: data.secondLastName || "",
      role: data.role,
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
    department?: string,
    phone?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await registerManager(
      {
        email,
        password,
        firstName: nameFields.firstName,
        secondName: nameFields.secondName,
        firstLastName: nameFields.firstLastName,
        secondLastName: nameFields.secondLastName,
        role: role as "admin" | "employee",
        department,
        phone,
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
      email,
      password,
      firstName: nameFields.firstName,
      secondName: nameFields.secondName,
      firstLastName: nameFields.firstLastName,
      secondLastName: nameFields.secondLastName,
    })

    if (error || !data) {
      return { success: false, error: error || "Error al registrar" }
    }

    // Auto-login after registration
    const loggedUser: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      firstName: data.firstName,
      secondName: data.secondName || "",
      firstLastName: data.firstLastName,
      secondLastName: data.secondLastName || "",
      role: data.role,
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
