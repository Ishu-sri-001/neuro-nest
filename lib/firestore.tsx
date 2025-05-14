import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

// User interface
export interface UserData {
  uid: string
  email: string | null
  firstName?: string
  lastName?: string
  displayName?: string | null
  photoURL?: string | null
  createdAt?: any
  lastLogin?: any
  credits: number
}


 // Create a new user document in Firestore
export async function createUserDocument(uid: string, data: Omit<UserData, "uid">): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    ...data,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  })
}


export async function updateUserCredits(uid: string, credits: number): Promise<void> {
  try {
    // Assuming you have a users collection in Firestore
    const userRef = doc(db, "users", uid)
    await updateDoc(userRef, {
      credits: credits,
    })
  } catch (error) {
    console.error("Error updating user credits:", error)
    throw error
  }
}


// Get user data by UID 
export async function getUserByUid(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))

    if (userDoc.exists()) {
      return userDoc.data() as UserData
    }

    return null
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}


 // Update user data
export async function updateUserData(uid: string, data: Partial<UserData>): Promise<void> {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}


// Update user's last login timestamp 
export async function updateUserLastLogin(uid: string): Promise<void> {
  const userRef = doc(db, "users", uid)
  await updateDoc(userRef, {
    lastLogin: serverTimestamp(),
  })
}


 // Get user by email 
export async function getUserByEmail(email: string): Promise<UserData | null> {
  try {
    const usersRef = collection(db, "users")
    const q = query(usersRef, where("email", "==", email))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as UserData
    }

    return null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}
