import api from "@/lib/api"

export interface LeaveTypeBasic {
  id: number
  name: string
}

export interface ProxyUserOut {
  id: number
  first_name: string
  last_name: string
}

export interface LeaveRequestListItem {
  id: number
  request_id: string
  leave_type: LeaveTypeBasic
  start_date: string
  end_date: string
  days_count: number
  reason: string
  status: string
  proxy_person: ProxyUserOut
  approver?: ProxyUserOut | null
  approved_at?: string | null
  created_at: string
  rejection_reason?: string | null
}

export interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface LeaveRequestListResponse {
  leave_requests: LeaveRequestListItem[]
  pagination: PaginationMeta
}

export interface LeaveRequestFilters {
  status?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}

export async function getMyLeaveRequests(filters: LeaveRequestFilters = {}): Promise<LeaveRequestListResponse> {
  try {
    const response = await api.get<LeaveRequestListResponse>("/leave-requests", { 
      params: filters 
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch my leave requests:", error)
    throw error
  }
}

export async function getRecentLeaveRequests(limit: number = 3): Promise<LeaveRequestListResponse> {
  return getMyLeaveRequests({ per_page: limit })
}

export interface TeamLeaveRequestFilters extends LeaveRequestFilters {
  user_id?: number
}

export interface LeaveRequestTeamItem extends LeaveRequestListItem {
  user: ProxyUserOut
}

export interface LeaveRequestTeamListResponse {
  leave_requests: LeaveRequestTeamItem[]
  pagination: PaginationMeta
}

export async function getTeamLeaveRequests(filters: TeamLeaveRequestFilters = {}): Promise<LeaveRequestTeamListResponse> {
  try {
    const response = await api.get<LeaveRequestTeamListResponse>("/leave-requests/team", { 
      params: filters 
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch team leave requests:", error)
    throw error
  }
} 