"use client"

import { createContext, type ReactNode, useContext } from "react"
import { useQuery, useMutation, type UseMutationResult } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

// User type
type User = {
  id: number
  username: string
  fullName: string
  role: string
}

type LoginData = {
  username: string
  password: string
}

type RegisterData = LoginData & {
  fullName: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  loginMutation: UseMutationResult<User, Error, LoginData>
  logoutMutation: UseMutationResult<void, Error, void>
  registerMutation: UseMutationResult<User, Error, RegisterData>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const router = useRouter()

  // Use Next.js API routes instead of direct API calls
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      const res = await fetch("/api/user", {
        credentials: "include",
      })

      if (res.status === 401) {
        return null
      }

      if (!res.ok) {
        throw new Error("Failed to fetch user")
      }

      return res.json()
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData): Promise<User> => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Invalid credentials")
      }

      return res.json()
    },
    onSuccess: (user: User) => {
      refetch()
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.fullName}!`,
      })
      router.push("/")
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
    },
  })

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData): Promise<User> => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Registration failed")
      }

      return res.json()
    },
    onSuccess: (user: User) => {
      refetch()
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.fullName}!`,
      })
      router.push("/")
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async (): Promise<void> => {
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Logout failed")
      }
    },
    onSuccess: () => {
      refetch()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
      router.push("/auth")
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

