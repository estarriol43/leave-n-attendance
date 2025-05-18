import api from '../api'

export interface DepartmentInfo {
  id: number
  name: string
}

export interface TeamMemberResponse {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  position: string
  email: string
  department: DepartmentInfo
}

export interface TeamListResponse {
  team_members: TeamMemberResponse[]
}

/**
 * Get current user's team members
 */
export async function getTeamMembers(): Promise<TeamListResponse> {
  const response = await api.get('/users/team')
  return response.data
}

/**
 * Check if a team member is on leave today
 * This is a helper function to be used with the team member API response
 */
export function getTeamMemberStatus(teamMember: TeamMemberResponse): { 
  status: 'Available' | 'On Leave',
  leaveType?: string,
  leaveUntil?: string
} {
  // This is a placeholder - in a real app, we would need to get this information
  // from another endpoint like approved leave requests
  return { status: 'Available' }
} 