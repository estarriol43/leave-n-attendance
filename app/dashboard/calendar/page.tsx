"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addMonths, format, subMonths, isWithinInterval, isSameDay, startOfMonth, endOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface TeamMember {
  id: number
  name: string
}

interface LeaveType {
  name: string
  color: string
}

interface MemberOnLeave {
  id: number
  first_name: string
  last_name: string
  leave_type: string
}

interface CalendarDay {
  date: string
  members_on_leave: MemberOnLeave[]
}

interface CalendarData {
  year: number
  month: number
  days: CalendarDay[]
}

// API 回應型別
interface LeaveTypeBasic {
  id: number
  name: string
}

interface ProxyUserOut {
  id: number
  first_name: string
  last_name: string
}

interface LeaveRequestTeamItem {
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

interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

interface LeaveRequestTeamListResponse {
  leave_requests: LeaveRequestTeamItem[]
  pagination: PaginationMeta
}

// 團隊成員 API 回應型別
interface TeamMemberOut {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  position: string
  email: string
}

interface TeamListResponse {
  team_members: TeamMemberOut[]
}

// Leave types for legend
const leaveTypes: LeaveType[] = [
  { name: "Annual Leave", color: "bg-blue-500" },
  { name: "Sick Leave", color: "bg-red-500" },
  { name: "Personal Leave", color: "bg-green-500" },
  { name: "Public Holiday", color: "bg-amber-500" }
]

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedMemberId, setSelectedMemberId] = useState<string>("0") // 0 means all members
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ id: 0, name: "All Members" }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 獲取團隊成員
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get<TeamListResponse>('/users/team')
        
        // 轉換團隊成員數據格式
        const membersList: TeamMember[] = [
          { id: 0, name: "All Members" },
          ...response.data.team_members.map(member => ({
            id: member.id,
            name: `${member.first_name} ${member.last_name}`
          }))
        ]
        
        setTeamMembers(membersList)
      } catch (err) {
        console.error('Error fetching team members:', err)
        toast("Failed to fetch team members", {
          description: "Using default team members list",
        })
      }
    }
    
    fetchTeamMembers()
  }, [])
  
  // Fetch calendar data from API and transform to calendar format
  useEffect(() => {
    const fetchCalendarData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth() + 1 // JavaScript months are 0-indexed
        
        // 獲取本月開始和結束日期
        const firstDayOfMonth = startOfMonth(currentDate)
        const lastDayOfMonth = endOfMonth(currentDate)
        
        console.log('Fetching calendar data with params:', {
          start_date: format(firstDayOfMonth, "yyyy-MM-dd"),
          end_date: format(lastDayOfMonth, "yyyy-MM-dd"),
          per_page: 100,
          status: "approved"
        })
        
        // 使用 /leave-requests/team 獲取團隊請假數據
        console.log('API Request URL:', '/leave-requests/team')
        const response = await api.get<LeaveRequestTeamListResponse>(`/leave-requests/team`, {
          params: {
            start_date: format(firstDayOfMonth, "yyyy-MM-dd"),
            end_date: format(lastDayOfMonth, "yyyy-MM-dd"),
            per_page: 100, // 請求足夠多的數據以涵蓋整個月
            status: "approved" // 只獲取已批准的請假
          }
        })
        
        console.log('API Response:', response.data)
        
        // 將 API 回應轉換為日曆格式
        const transformedData: CalendarData = {
          year,
          month,
          days: []
        }
        
        // 創建日期到員工請假映射
        const dateToMembersMap: Record<string, MemberOnLeave[]> = {}
        
        // 處理每個請假記錄
        response.data.leave_requests.forEach(request => {
          // 只考慮已批准的請假
          if (request.status.toLowerCase() !== "approved") return
          
          const startDate = new Date(request.start_date)
          const endDate = new Date(request.end_date)
          
          // 檢查當前請假是否在本月內
          let currentDay = new Date(startDate)
          
          // 遍歷請假的每一天
          while (currentDay <= endDate) {
            // 格式化當前日期
            const formattedDate = format(currentDay, "yyyy-MM-dd")
            
            // 初始化該日期的請假成員數組（如果不存在）
            if (!dateToMembersMap[formattedDate]) {
              dateToMembersMap[formattedDate] = []
            }
            
            // 添加請假成員信息
            dateToMembersMap[formattedDate].push({
              id: request.user.id,
              first_name: request.user.first_name,
              last_name: request.user.last_name,
              leave_type: request.leave_type.name
            })
            
            // 移動到下一天
            currentDay.setDate(currentDay.getDate() + 1)
          }
        })
        
        // 將映射轉換為日曆數據格式
        Object.entries(dateToMembersMap).forEach(([date, members]) => {
          transformedData.days.push({
            date,
            members_on_leave: members
          })
        })
        
        setCalendarData(transformedData)
      } catch (err: any) {
        console.error('Error fetching calendar data:', err)
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        })
        setError('Failed to fetch calendar data')
        toast("Failed to fetch calendar data", {
          description: "Please try again later.",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchCalendarData()
  }, [currentDate])
  
  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(prevDate => subMonths(prevDate, 1))
  }
  
  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(prevDate => addMonths(prevDate, 1))
  }
  
  // Get members on leave for the selected date
  const getMembersOnLeave = (date: Date) => {
    if (!calendarData) return []
    
    const formattedDate = format(date, "yyyy-MM-dd")
    const dayData = calendarData.days.find(day => day.date === formattedDate)
    
    if (!dayData) return []
    
    if (selectedMemberId === "0") {
      return dayData.members_on_leave
    } else {
      return dayData.members_on_leave.filter(
        member => member.id.toString() === selectedMemberId
      )
    }
  }
  
  // Check if a date has members on leave
  const hasLeave = (date: Date) => {
    if (!calendarData) return false
    
    const formattedDate = format(date, "yyyy-MM-dd")
    const dayData = calendarData.days.find(day => day.date === formattedDate)
    
    if (!dayData) return false
    
    if (selectedMemberId === "0") {
      return dayData.members_on_leave.length > 0
    } else {
      return dayData.members_on_leave.some(
        member => member.id.toString() === selectedMemberId
      )
    }
  }
  
  // Get selected day members
  const selectedDayMembers = selectedDate ? getMembersOnLeave(selectedDate) : []
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Calendar</h1>
          <p className="text-muted-foreground">
            View team member availability and leave schedules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[120px] text-center font-medium">
            {format(currentDate, "MMMM yyyy")}
          </div>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Leave Calendar</CardTitle>
            <CardDescription>
              Team member leave schedules for {format(currentDate, "MMMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-72">
                <p>Loading calendar data...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-72">
                <p className="text-red-500">{error}</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  month={currentDate}
                  onMonthChange={setCurrentDate}
                  className="rounded-md border"
                  modifiers={{
                    hasLeave: hasLeave
                  }}
                  modifiersClassNames={{
                    hasLeave: "bg-orange-100 font-bold text-orange-600"
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const membersOnLeave = getMembersOnLeave(date)
                      return (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-full w-full p-2 flex items-center justify-center">
                                {date.getDate()}
                                {membersOnLeave.length > 0 && (
                                  <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                                )}
                              </div>
                            </TooltipTrigger>
                            {membersOnLeave.length > 0 && (
                              <TooltipContent>
                                <div className="text-xs">
                                  <p className="font-medium mb-1">{format(date, "EEEE, MMMM d, yyyy")}</p>
                                  <ul className="space-y-1">
                                    {membersOnLeave.map((member, index) => (
                                      <li key={index}>
                                        {member.first_name} {member.last_name} - {member.leave_type}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )
                    }
                  }}
                />

                <div className="space-y-6 flex-1">
                  <div>
                    <Label htmlFor="team-member">Filter by Team Member</Label>
                    <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                      <SelectTrigger id="team-member">
                        <SelectValue placeholder="Select team member" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id.toString()}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Legend</h3>
                    <div className="space-y-2">
                      {leaveTypes.map((type, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${type.color}`}></div>
                          <span className="text-sm">{type.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <h3 className="font-medium mb-3">
                        {format(selectedDate, "EEEE, MMMM d, yyyy")}
                      </h3>
                      {selectedDayMembers.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">Team members on leave:</p>
                          {selectedDayMembers.map((member, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`} />
                                <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{member.first_name} {member.last_name}</p>
                                <p className="text-xs text-muted-foreground">{member.leave_type}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No team members on leave for this date.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Availability</CardTitle>
            <CardDescription>Current team availability status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Today</h3>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="rounded-md bg-green-50 p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">9</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div className="rounded-md bg-orange-50 p-3 text-center">
                    <p className="text-2xl font-bold text-orange-600">3</p>
                    <p className="text-xs text-muted-foreground">On Leave</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">On Leave Today</h3>
                <div className="space-y-2">
                  {getMembersOnLeave(new Date()).map((member, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`} />
                          <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.first_name} {member.last_name}</span>
                      </div>
                      <Badge variant="outline">{member.leave_type}</Badge>
                    </div>
                  ))}
                  {getMembersOnLeave(new Date()).length === 0 && (
                    <p className="text-sm text-muted-foreground">No one is on leave today.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Upcoming Leaves</h3>
                <div className="space-y-3">
                  {calendarData?.days
                    .filter(day => {
                      const dayDate = new Date(day.date)
                      const today = new Date()
                      return dayDate > today && dayDate <= new Date(today.setDate(today.getDate() + 7))
                    })
                    .slice(0, 3)
                    .flatMap(day => 
                      day.members_on_leave.map((member, memberIndex) => ({
                        date: day.date,
                        member,
                        key: `${day.date}-${memberIndex}`
                      }))
                    )
                    .map(({ date, member, key }) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`} />
                            <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm">{member.first_name} {member.last_name}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(date), "MMM d")}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">{member.leave_type}</Badge>
                      </div>
                    ))
                  }
                  {(!calendarData || calendarData.days
                    .filter(day => {
                      const dayDate = new Date(day.date)
                      const today = new Date()
                      return dayDate > today && dayDate <= new Date(today.setDate(today.getDate() + 7))
                    }).length === 0) && (
                    <p className="text-sm text-muted-foreground">No upcoming leaves in the next week.</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
