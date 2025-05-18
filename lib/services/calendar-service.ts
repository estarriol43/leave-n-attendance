import api from "@/lib/api"

export interface MemberOnLeave {
  id: number
  first_name: string
  last_name: string
  leave_type: string
}

export interface DayInfo {
  date: string
  members_on_leave: MemberOnLeave[]
}

export interface TeamCalendarResponse {
  year: number
  month: number
  days: DayInfo[]
}

export async function getTeamCalendar(year: number, month: number): Promise<TeamCalendarResponse> {
  try {
    const response = await api.get<TeamCalendarResponse>("/calendar/team", {
      params: { year, month }
    })
    return response.data
  } catch (error) {
    console.error("Failed to fetch team calendar:", error)
    throw error
  }
}

export async function getTeamMembersOnLeaveToday(): Promise<{
  membersOnLeave: MemberOnLeave[]
  totalMembers: number
}> {
  try {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth() + 1
    
    // Get team calendar data
    const calendarData = await getTeamCalendar(year, month)
    
    // Find today's data
    const todayString = today.toISOString().split('T')[0]
    const todayInfo = calendarData.days.find(day => day.date === todayString)
    const membersOnLeave = todayInfo?.members_on_leave || []
    
    // TODO: Get total team members from team API
    // For now using a placeholder value
    const totalMembers = 10
    
    return {
      membersOnLeave,
      totalMembers
    }
  } catch (error) {
    console.error("Failed to fetch team members on leave today:", error)
    throw error
  }
} 