"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/services/user"

export default function ProfileRedirect() {
  const router = useRouter()

  useEffect(() => {
    const redirectToUserProfile = async () => {
      try {
        const currentUser = await getCurrentUser()
        router.replace(`/dashboard/profile/${currentUser.id}`)
      } catch (error) {
        console.error("Failed to fetch current user data:", error)
      }
    }
    redirectToUserProfile()
  }, [router])

  return (
    <div className="p-4 text-center">Redirecting to your profile...</div>
  )
}
