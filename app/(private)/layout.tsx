"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { MainSidebar } from "@/components/sidebar/main-sidebar"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        router.push('/auth/signin')
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [auth, router])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <MainSidebar />
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}