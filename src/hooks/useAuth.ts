import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { useUser } from "@/contexts/userContext"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser } = useUser()

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }

      const data = await response.json()

      setUser(data.user)
      toast.success("Logged in successfully")
      router.push(data.redirect)
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error instanceof Error ? error.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("An error occurred during logout")
    } finally {
      setIsLoading(false)
    }
  }

  return { login, logout, isLoading }
}

