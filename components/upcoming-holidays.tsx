'use client'

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { getUpcomingHolidays, Holiday } from "@/lib/services/holiday"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

function UpcomingHolidaySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      ))}
    </div>
  )
}

export function UpcomingHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true)
        const data = await getUpcomingHolidays()
        setHolidays(data)
      } catch (err) {
        setError("無法載入假日資料")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHolidays()
  }, [])

  if (error) {
    return (
      <div className="text-sm text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  if (loading) {
    return <UpcomingHolidaySkeleton />
  }

  if (holidays.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        <p>近期沒有公休假日</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {holidays.map((holiday) => {
        const holidayDate = new Date(holiday.date)
        const today = new Date()
        const daysUntil = differenceInDays(holidayDate, today)
        
        return (
          <div key={holiday.id} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="font-medium">{holiday.name}</div>
              <div className="text-sm text-muted-foreground">
                {format(holidayDate, 'yyyy年MM月dd日')}
                {holiday.description && ` - ${holiday.description}`}
              </div>
            </div>
            <Badge variant="outline" className="ml-auto">
              {daysUntil === 0 
                ? '今天' 
                : daysUntil === 1 
                  ? '明天' 
                  : `${daysUntil}天後`}
            </Badge>
          </div>
        )
      })}
    </div>
  )
} 