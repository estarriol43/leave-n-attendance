'use client'

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  getTeamMembersOnLeaveToday, 
  type MemberOnLeave 
} from "@/lib/services/calendar-service"

// Skeleton component defined inline
function TeamAvailabilitySkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TeamAvailability() {
  const [membersOnLeave, setMembersOnLeave] = useState<MemberOnLeave[]>([])
  const [totalMembers, setTotalMembers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamAvailability = async () => {
      try {
        setLoading(true)
        const data = await getTeamMembersOnLeaveToday()
        setMembersOnLeave(data.membersOnLeave)
        setTotalMembers(data.totalMembers)
      } catch (err) {
        setError("無法載入團隊資料")
        console.error(err)
      } finally {
        setLoading(false)
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

  if (loading) {
    return <TeamAvailabilitySkeleton />
  }

  const presentMembers = totalMembers - membersOnLeave.length
  const attendanceRate = (presentMembers / totalMembers) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{presentMembers}</div>
          <div className="text-sm text-muted-foreground">
            <div>今日出勤</div>
            <div>共 {totalMembers} 人</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">
            <div>出勤率</div>
          </div>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-2">今日請假 ({membersOnLeave.length} 人)</div>
        {membersOnLeave.length === 0 ? (
          <div className="text-sm text-muted-foreground">今日無團隊成員請假</div>
        ) : (
          <div className="space-y-2">
            {membersOnLeave.map((member) => (
              <div key={member.id} className="text-sm">
                {member.first_name} {member.last_name} - {member.leave_type}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 