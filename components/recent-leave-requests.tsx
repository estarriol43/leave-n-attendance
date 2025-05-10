'use client'

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LeaveType {
  id: number
  name: string
}

interface Approver {
  id: number
  first_name: string
  last_name: string
}

interface LeaveRequest {
  id: number
  request_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  status: string
  approver?: Approver | null
}

export function RecentLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get("/leave-requests")
      .then(res => {
        if (res.data && res.data.leave_requests) {
          setRequests(res.data.leave_requests)
        } else {
          console.warn('回應格式不符合預期:', res.data)
          setRequests([])
        }
        setError(null)
      })
      .catch(err => {
        console.error('取得請假紀錄失敗:', err)
        setError(`無法取得請假紀錄: ${err.message}`)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-4 text-muted-foreground">載入中...</div>
  if (error) return <div className="p-4 text-destructive">{error}</div>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Request ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Period</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Approver</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">無請假紀錄</TableCell>
          </TableRow>
        ) : (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell className="font-medium">{request.request_id}</TableCell>
              <TableCell>{request.leave_type?.name}</TableCell>
              <TableCell>
                {request.start_date} to {request.end_date}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "Approved"
                      ? "default"
                      : request.status === "Rejected"
                      ? "destructive"
                      : "outline"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {request.approver
                  ? `${request.approver.first_name} ${request.approver.last_name}`
                  : "-"}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
