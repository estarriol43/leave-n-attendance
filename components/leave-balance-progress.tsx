'use client'

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Progress } from "@/components/ui/progress"

interface LeaveType {
  id: number
  name: string
  color_code: string
}

interface LeaveBalanceItem {
  leave_type: LeaveType
  quota: number
  used_days: number
  remaining_days: number
}

export function LeaveBalanceProgress() {
  const [balances, setBalances] = useState<LeaveBalanceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get("/leave-balances")
      .then(res => {
        if (res.data && res.data.balances) {
          setBalances(res.data.balances)
        } else {
          console.warn('API 回應格式不符合預期:', res.data)
          setBalances([])
        }
        setError(null)
      })
      .catch(err => {
        console.error('取得請假餘額失敗:', err)
        setError(`無法取得請假餘額: ${err.message}`)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 text-muted-foreground">載入中...</div>
  if (error) return <div className="p-4 text-destructive">{error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {balances.map((item) => {
        const percentageUsed = item.quota === 0 ? 0 : Math.round((item.used_days / item.quota) * 100)
        const percentageLeft = 100 - percentageUsed
        return (
          <div key={item.leave_type.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{item.leave_type.name}</span>
              <span className="text-sm text-muted-foreground">
                {item.remaining_days} / {item.quota} days remaining
              </span>
            </div>
            <div className="space-y-1">
              <Progress
                value={percentageLeft}
                className="h-2"
                indicatorClassName=""
                style={{
                  '--progress-indicator': item.leave_type.color_code,
                } as React.CSSProperties}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{percentageLeft}% remaining</span>
                <span>{percentageUsed}% used</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
