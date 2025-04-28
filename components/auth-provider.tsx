"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, type User } from "firebase/auth"
import { getUserByUid, type UserData } from "@/lib/firestore"

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  fetchUserData: (uid: string) => Promise<UserData | null>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  fetchUserData: async () => null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (uid: string) => {
    try {
      const data = await getUserByUid(uid)
      if (data) {
        setUserData(data)
      }
      return data
    } catch (error) {
      console.error("Error fetching user data:", error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Fetch user data when auth state changes
        await fetchUserData(user.uid)
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, userData, loading, fetchUserData }}>{children}</AuthContext.Provider>
}
