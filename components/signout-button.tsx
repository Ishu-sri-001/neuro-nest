"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface SignOutProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  onSignOutSuccess?: () => void
  children?: React.ReactNode
}

export default function SignOut({
  variant = "default",
  size = "default",
  className = "",
  onSignOutSuccess,
  children,
}: SignOutProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    
    try {
      await signOut(auth)
      
      // Call the optional success callback if provided
      if (onSignOutSuccess) {
        onSignOutSuccess()
      } else {
        // Default behavior: redirect to home/login page
        router.push("/")
      }
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={loading}
    >
      {loading ? (
        "Signing out..."
      ) : children ? (
        children
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      )}
    </Button>
  )
}