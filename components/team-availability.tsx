'use client'

import { useState, useEffect } from "react"
import { getTeamMembersOnLeaveToday, LeaveRequestTeamItem } from "@/app/services/team"

export function TeamAvailability() {
  const [isLoading, setIsLoading] = useState(true)
  const [totalMembers, setTotalMembers] = useState(0)
  const [onLeaveMembers, setOnLeaveMembers] = useState<LeaveRequestTeamItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamAvailability = async () => {
      try {
        setIsLoading(true)
        const data = await getTeamMembersOnLeaveToday()
        setTotalMembers(data.totalMembers)
        setOnLeaveMembers(data.onLeaveMembers)
      } catch (err) {
        setError("無法載入團隊資料")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamAvailability()
  }, [])

  if (error) {
    return (
      <div className="text-sm text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  const presentMembers = totalMembers - onLeaveMembers.length

  return (
    <div className="space-y-4">
      <div className="text-3xl font-bold">{presentMembers}/{totalMembers}</div>
      <div className="text-sm text-muted-foreground">
        <p>團隊成員出勤人數: {presentMembers}</p>
        <p>團隊成員休假人數: {onLeaveMembers.length}</p>
      </div>
      {onLeaveMembers.length > 0 && (
        <div className="text-sm">
          <p className="font-medium">今日休假人員:</p>
          <ul className="list-disc list-inside text-muted-foreground">
            {onLeaveMembers.map((member) => (
              <li key={member.id}>
                {member.user.first_name} {member.user.last_name} ({member.leave_type.name})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 