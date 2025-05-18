import api from '../api'

export interface LeaveTypeBasic {
  id: number
  name: string
}

export interface ProxyUserOut {
  id: number
  first_name: string
  last_name: string
}

export interface LeaveRequestTeamItem {
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
  user: ProxyUserOut
}

export interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface LeaveRequestTeamListResponse {
  leave_requests: LeaveRequestTeamItem[]
  pagination: PaginationMeta
}

/**
 * Get team member leave requests
 */
export async function getTeamLeaveRequests(params?: {
  user_id?: number
  status?: string
  start_date?: string
  end_date?: string
  page?: number
  per_page?: number
}): Promise<LeaveRequestTeamListResponse> {
  const response = await api.get('/leave-requests/team', { params })
  return response.data
}

/**
 * Check if a team member is currently on leave
 */
export function isOnLeave(userId: number, leaveRequests: LeaveRequestTeamItem[]): {
  isOnLeave: boolean
  leaveType?: string
  endDate?: string
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const currentLeave = leaveRequests.find(request => {
    if (request.user.id !== userId || request.status !== 'approved') return false
    
    const startDate = new Date(request.start_date)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(request.end_date)
    endDate.setHours(0, 0, 0, 0)
    
    return today >= startDate && today <= endDate
  })
  
  if (currentLeave) {
    return {
      isOnLeave: true,
      leaveType: currentLeave.leave_type.name,
      endDate: currentLeave.end_date
    }
  }
  
  return { isOnLeave: false }
} 