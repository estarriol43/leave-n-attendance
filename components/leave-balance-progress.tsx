'use client'

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyLeaveBalance, type LeaveBalanceResponse } from "@/lib/services/leave-balance-service"

// Skeleton component defined inline
function LeaveBalanceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-2 w-full" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

interface LeaveTypeInfo {
  id: number
  name: string
  color_code: string
}

interface LeaveRequestSummary {
  id: number
  request_id: string
  start_date: string
  end_date: string
  days_count: number
  status: string
}

interface LeaveBalanceItem {
  leave_type: LeaveTypeInfo
  quota: number
  used_days: number
  remaining_days: number
  leave_requests: LeaveRequestSummary[]
}

interface LeaveBalanceProgressProps {
  title: string
  total: number
  value: number
  remainingDays: number
  colorCode: string
}

export function LeaveBalanceProgress({
  title,
  total,
  value,
  remainingDays,
  colorCode = "#4f46e5"
}: LeaveBalanceProgressProps) {
  const percentageUsed = total === 0 ? 0 : Math.round((value / total) * 100)
  const percentageLeft = 100 - percentageUsed

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-sm text-muted-foreground">
          剩餘 {remainingDays} / {total} 天
        </span>
      </div>
      <div className="space-y-1">
        <Progress
          value={percentageLeft}
          className="h-2"
          indicatorClassName=""
          style={{
            '--progress-indicator': colorCode,
          } as React.CSSProperties}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>剩餘 {percentageLeft}%</span>
          <span>已使用 {percentageUsed}%</span>
        </div>
      </div>
    </div>
  )
}

// Legacy component that fetches its own data
export function LeaveBalanceProgressLegacy() {
  const [balanceData, setBalanceData] = useState<LeaveBalanceResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaveBalances = async () => {
      try {
        setLoading(true)
        const data = await getMyLeaveBalance()
        setBalanceData(data)
        setError(null)
      } catch (err) {
        console.error('取得請假餘額失敗:', err)
        setError('無法取得請假餘額')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaveBalances()
  }, [])

  if (loading) return <LeaveBalanceSkeleton />
  if (error) return <div className="p-4 text-destructive">{error}</div>
  if (!balanceData) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {balanceData.balances.map((item) => (
        <LeaveBalanceProgress
          key={item.leave_type.id}
          title={item.leave_type.name}
          total={item.quota}
          value={item.used_days}
          remainingDays={item.remaining_days}
          colorCode={item.leave_type.color_code}
        />
      ))}
    </div>
  )
} 