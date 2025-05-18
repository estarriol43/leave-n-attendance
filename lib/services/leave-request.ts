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

export interface CreateLeaveRequest {
  leave_type_id: number
  start_date: string
  end_date: string
  reason: string
  proxy_user_id: number
}

export function isOnLeave(userId: number, leaveRequests: LeaveRequestTeamItem[]): { 
  isOnLeave: boolean; 
  leaveType?: string; 
  endDate?: string; 
} {
  const today = new Date()
  const currentLeave = leaveRequests.find(request => {
    if (request.user.id !== userId || request.status !== 'approved') return false
    const startDate = new Date(request.start_date)
    const endDate = new Date(request.end_date)
    return today >= startDate && today <= endDate
  })

  return currentLeave 
    ? { 
        isOnLeave: true, 
        leaveType: currentLeave.leave_type.name,
        endDate: currentLeave.end_date 
      }
    : { isOnLeave: false }
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
  leave_type_id?: number
  employee_id?: number
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

export async function getPendingLeaveRequests(filters: TeamLeaveRequestFilters = {}): Promise<LeaveRequestTeamListResponse> {
  // For pending approval, always set status to pending
  const pendingFilters = { ...filters, status: 'pending' }
  
  try {
    const response = await api.get<LeaveRequestTeamListResponse>("/leave-requests/team", { 
      params: pendingFilters 
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch pending leave requests:", error)
    throw error
  }
}

export async function approveLeaveRequest(leaveRequestId: number): Promise<void> {
  try {
    await api.patch(`/leave-requests/${leaveRequestId}/approve`, {})
  } catch (error) {
    console.error("Failed to approve leave request:", error)
    throw error
  }
}

export async function rejectLeaveRequest(leaveRequestId: number, rejectionReason: string): Promise<void> {
  try {
    await api.patch(`/leave-requests/${leaveRequestId}/reject`, { 
      rejection_reason: rejectionReason 
    })
  } catch (error) {
    console.error("Failed to reject leave request:", error)
    throw error
  }
}

export type LeaveRequest = LeaveRequestListItem | LeaveRequestTeamItem

export function isTeamLeaveRequest(request: LeaveRequest): request is LeaveRequestTeamItem {
  return 'user' in request
}

export async function createLeaveRequest(data: CreateLeaveRequest) {
  try {
    const response = await api.post("/leave-requests", data)
    return response.data
  } catch (error) {
    console.error("Failed to create leave request:", error)
    throw error
  }
} 