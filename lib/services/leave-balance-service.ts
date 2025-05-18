import api from "@/lib/api"

export interface LeaveTypeInfo {
  id: number
  name: string
  color_code: string
}

export interface LeaveRequestSummary {
  id: number
  request_id: string
  start_date: string
  end_date: string
  days_count: number
  status: string
}

export interface LeaveBalanceItem {
  leave_type: LeaveTypeInfo
  quota: number
  used_days: number
  remaining_days: number
  leave_requests: LeaveRequestSummary[]
}

export interface LeaveBalanceResponse {
  year: number
  balances: LeaveBalanceItem[]
}

export async function getMyLeaveBalance(): Promise<LeaveBalanceResponse> {
  try {
    const response = await api.get<LeaveBalanceResponse>("/leave-balances")
    return response.data
  } catch (error) {
    console.error("Failed to fetch leave balance:", error)
    throw error
  }
}

export async function getUserLeaveBalance(userId: number): Promise<LeaveBalanceResponse> {
  try {
    const response = await api.get<LeaveBalanceResponse>(`/leave-balances/${userId}`)
    return response.data
  } catch (error) {
    console.error(`Failed to fetch leave balance for user ${userId}:`, error)
    throw error
  }
} 