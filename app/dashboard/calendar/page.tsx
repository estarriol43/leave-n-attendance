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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { addMonths, format, subMonths, isWithinInterval, isSameDay, startOfMonth, endOfMonth } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { AvatarGroup } from "@/components/avatar-group"

interface TeamMember {
  id: number
  name: string
}

interface LeaveType {
  id: number
  name: string
  color: string
}

interface MemberOnLeave {
  id: number
  first_name: string
  last_name: string
  leave_type: string
  date?: string // Added for upcoming leaves
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

// API LeaveType response
interface ApiLeaveType {
  id: number
  name: string
  color_code: string
}

// Default leave types
const defaultLeaveTypes = [
  { id: 1, name: "Annual Leave", color: "bg-blue-500" },
  { id: 2, name: "Sick Leave", color: "bg-red-500" },
  { id: 3, name: "Personal Leave", color: "bg-green-500" },
  { id: 4, name: "Public Holiday", color: "bg-amber-500" }
]

// Add color mapping constant
const leaveTypeColorMap: Record<string, string> = {
  'red': 'bg-red-500',
  'blue': 'bg-blue-500',
  'green': 'bg-green-500',
  'yellow': 'bg-yellow-500',
  'purple': 'bg-purple-500',
  'pink': 'bg-pink-500',
  'indigo': 'bg-indigo-500',
  'orange': 'bg-orange-500',
  'amber': 'bg-amber-500',
  'lime': 'bg-lime-500',
  'emerald': 'bg-emerald-500',
  'teal': 'bg-teal-500',
  'cyan': 'bg-cyan-500',
  'sky': 'bg-sky-500',
  'violet': 'bg-violet-500',
  'fuchsia': 'bg-fuchsia-500',
  'rose': 'bg-rose-500',
  'slate': 'bg-slate-500',
  'gray': 'bg-gray-500',
  'zinc': 'bg-zinc-500',
  'neutral': 'bg-neutral-500',
  'stone': 'bg-stone-500',
}

// Helper function to get Tailwind color class
function getColorClass(colorCode: string): string {
  // Handle hex colors
  if (colorCode.startsWith('#')) {
    return `bg-[${colorCode}]`
  }
  
  // Handle color names
  const baseColor = colorCode.split('-')[0].toLowerCase()
  return leaveTypeColorMap[baseColor] || 'bg-gray-500' // Fallback to gray if color not found
}

function CalendarSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              <Skeleton key={dayIndex} className="h-12 rounded-md" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamAvailabilitySkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg fon t-medium">Today</h3>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Members on Leave</h3>
        <div className="space-y-4">
          {/* Avatar Group Skeleton */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full ring-2 ring-background" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-full -ml-2" />
          </div>
          {/* Leave Types Badges Skeleton */}
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-20" />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Upcoming Leaves</h3>
        <div className="space-y-4">
          {/* Avatar Group Skeleton */}
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full ring-2 ring-background" />
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-full -ml-2" />
          </div>
          {/* Days Count Badge Skeleton */}
          <div className="flex flex-wrap gap-1">
            <Skeleton className="h-5 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeaveTypesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={`skeleton-leavetype-${i}`} className="h-8" />
      ))}
    </div>
  )
}

// Skeleton for calendar side panel
function CalendarSidePanelSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <div className="flex items-center gap-2">
          <span className="text-sm">Available:</span>
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">On Leave:</span>
          <Skeleton className="h-5 w-12" />
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-6 w-24" />
        <div className="-space-x-2 flex">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`skeleton-avatar-${i}`} className="h-8 w-8 rounded-full ring-2 ring-background" />
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-6 w-28" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`skeleton-upcoming-${i}`} className="h-5 w-20" />
        ))}
      </div>
    </div>
  )
}

// Skeleton for members on leave
function MembersOnLeaveSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-24" />
      <div className="-space-x-2 flex">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={`skeleton-member-${i}`} className="h-8 w-8 rounded-full ring-2 ring-background" />
        ))}
      </div>
    </div>
  )
}

// Skeleton for upcoming leaves
function UpcomingLeavesSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-6 w-28" />
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`skeleton-upcoming-leave-${i}`} className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to get relative date text
function getRelativeDayText(date: Date): string {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (isSameDay(date, today)) return '今天'
  if (isSameDay(date, tomorrow)) return '明天'
  if (isSameDay(date, yesterday)) return '昨天'
  return format(date, "EEEE, MMMM d, yyyy")
}

// Component to display leave member list
function MemberLeaveList({ members }: { members: MemberOnLeave[] }) {
  return (
    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
      {members.map((member, index) => (
        <div key={`${member.id}-${member.leave_type}-${index}`} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${member.first_name}+${member.last_name}&background=random`} />
              <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <span className="text-sm">{member.first_name} {member.last_name}</span>
              {member.date && (
                <p className="text-xs text-muted-foreground">
                  {getRelativeDayText(new Date(member.date))}
                </p>
              )}
            </div>
          </div>
          <Badge variant="outline">{member.leave_type}</Badge>
        </div>
      ))}
    </div>
  )
}

// Calendar style configurations
const calendarClassNames = {
  months: "w-full",
  month: "w-full",
  table: "w-full border-collapse",
  head_row: "flex w-full",
  head_cell: "w-full text-muted-foreground rounded-none text-sm font-normal",
  row: "flex w-full mt-2",
  cell: "mx-1 w-full text-center text-sm relative p-0 [&:has([aria-selected])]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
  day: "w-full h-12 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-accent/50 transition-colors",
  day_selected: "bg-accent/70 text-accent-foreground hover:bg-accent/70 hover:text-accent-foreground focus:bg-accent/70 focus:text-accent-foreground",
  day_today: "bg-accent text-accent-foreground",
  day_outside: "text-muted-foreground opacity-50",
  day_disabled: "text-muted-foreground opacity-50",
  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
  day_hidden: "invisible",
}

// Calendar day content component
function CalendarDayContent({ date, membersOnLeave }: { date: Date, membersOnLeave: MemberOnLeave[] }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="h-full w-full flex items-center justify-center">
            <span className="relative flex items-center justify-center w-full h-full">
              {date.getDate()}
              {membersOnLeave.length > 0 && (
                <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-orange-500"></span>
              )}
            </span>
          </div>
        </TooltipTrigger>
        {membersOnLeave.length > 0 && (
          <TooltipContent>
            <div className="text-xs">
              <p className="font-medium mb-1">{format(date, "EEEE, MMMM d, yyyy")}</p>
              <ul className="space-y-1">
                {membersOnLeave.map((member, index) => (
                  <li key={`${member.id}-${member.leave_type}-${index}`}>
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

// Team availability stats component
function TeamAvailabilityStats({ 
  selectedDate, 
  teamMembersCount, 
  getMembersOnLeave 
}: { 
  selectedDate: Date | undefined
  teamMembersCount: number
  getMembersOnLeave: (date: Date) => MemberOnLeave[]
}) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-2">
      <div className="rounded-md bg-green-50 p-3 text-center">
        <p className="text-2xl font-bold text-green-600">
          {teamMembersCount > 0 ? teamMembersCount - (selectedDate ? getMembersOnLeave(selectedDate).length : getMembersOnLeave(new Date()).length) : 0}
        </p>
        <p className="text-xs text-muted-foreground">在職</p>
      </div>
      <div className="rounded-md bg-orange-50 p-3 text-center">
        <p className="text-2xl font-bold text-orange-600">
          {selectedDate ? getMembersOnLeave(selectedDate).length : getMembersOnLeave(new Date()).length}
        </p>
        <p className="text-xs text-muted-foreground">請假</p>
      </div>
    </div>
  )
}

// Leave types legend component
function LeaveTypesLegend({ 
  loadingLeaveTypes, 
  leaveTypes 
}: { 
  loadingLeaveTypes: boolean
  leaveTypes: LeaveType[]
}) {
  if (loadingLeaveTypes) {
    return <LeaveTypesSkeleton />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {leaveTypes.map((type) => (
        <div key={type.id} className="flex items-center gap-2">
          <div className={cn("h-3 w-3 rounded-full", type.color)}></div>
          <span className="text-sm">{type.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedMemberId, setSelectedMemberId] = useState<string>("0") // 0 means all members
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([{ id: 0, name: "All Members" }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(defaultLeaveTypes)
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(true)
  
  // Fetch leave types from API
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await api.get<ApiLeaveType[]>('/leave-types')
        
        const mappedLeaveTypes = response.data.map(type => ({
          id: type.id,
          name: type.name,
          color: getColorClass(type.color_code)
        }))
        
        setLeaveTypes(mappedLeaveTypes)
      } catch (err) {
        console.error('Error fetching leave types:', err)
        toast("Failed to fetch leave types", {
          description: "Using default leave types list",
        })
        // Keep using default leave types in case of error
      } finally {
        setLoadingLeaveTypes(false)
      }
    }
    
    fetchLeaveTypes()
  }, [])
  
  // Get team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await api.get<TeamListResponse>('/users/team')
        
        // Transform team members data
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
        
        // Get month start and end dates
        const firstDayOfMonth = startOfMonth(currentDate)
        const lastDayOfMonth = endOfMonth(currentDate)
        
        // Use /leave-requests/team to get team leave data
        const response = await api.get<LeaveRequestTeamListResponse>(`/leave-requests/team`, {
          params: {
            start_date: format(firstDayOfMonth, "yyyy-MM-dd"),
            end_date: format(lastDayOfMonth, "yyyy-MM-dd"),
            per_page: 100, // Request enough data to cover the month
            status: "approved" // Only get approved leaves
          }
        })
        
        // Transform API response to calendar format
        const transformedData: CalendarData = {
          year,
          month,
          days: []
        }
        
        // Create date to employees on leave mapping
        const dateToMembersMap: Record<string, MemberOnLeave[]> = {}
        
        // Process each leave request
        response.data.leave_requests.forEach(request => {
          // Only consider approved leaves
          if (request.status.toLowerCase() !== "approved") return
          
          const startDate = new Date(request.start_date)
          const endDate = new Date(request.end_date)
          
          // Check if the current leave is in this month
          let currentDay = new Date(startDate)
          
          // Iterate through each day of the leave
          while (currentDay <= endDate) {
            // Format the current date
            const formattedDate = format(currentDay, "yyyy-MM-dd")
            
            // Initialize the leave members array for this date (if it doesn't exist)
            if (!dateToMembersMap[formattedDate]) {
              dateToMembersMap[formattedDate] = []
            }
            
            // Add the leave member info
            dateToMembersMap[formattedDate].push({
              id: request.user.id,
              first_name: request.user.first_name,
              last_name: request.user.last_name,
              leave_type: request.leave_type.name
            })
            
            // Move to the next day
            currentDay.setDate(currentDay.getDate() + 1)
          }
        })
        
        // Convert the mapping to calendar data format
        Object.entries(dateToMembersMap).forEach(([date, members]) => {
          transformedData.days.push({
            date,
            members_on_leave: members
          })
        })
        
        setCalendarData(transformedData)
      } catch (err: any) {
        console.error('Error fetching calendar data:', err)
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
  const getMembersOnLeave = (date: Date): MemberOnLeave[] => {
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
  
  // Get upcoming leaves starting from selected date
  const getUpcomingLeaves = (): MemberOnLeave[] => {
    if (!calendarData || !calendarData.days) return []
    
    const referenceDate = selectedDate || new Date()
    const formattedRefDate = format(referenceDate, "yyyy-MM-dd")
    
    return calendarData.days
      .filter(day => {
        return day.date > formattedRefDate && day.members_on_leave.length > 0
      })
      .slice(0, 5) // Get next 5 days with leaves
      .flatMap(day => 
        day.members_on_leave.map(member => ({
          ...member,
          date: day.date
        }))
      )
      .slice(0, 7) // Limit to 7 total upcoming leaves
  }
  
  // Get selected day members
  const selectedDayMembers = selectedDate ? getMembersOnLeave(selectedDate) : []
  
  // Get upcoming leaves
  const upcomingLeaves = getUpcomingLeaves()
  
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>團隊行事曆</CardTitle>
          <CardDescription>
            {format(currentDate, "MMMM yyyy")} 的團隊請假排程
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <CalendarSkeleton />
              </div>
              <div>
                <TeamAvailabilitySkeleton />
              </div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-72">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <div>
                  <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                    <SelectTrigger id="team-member">
                      <SelectValue placeholder="選擇團隊成員" />
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

                <div className="rounded-md border">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentDate}
                    onMonthChange={setCurrentDate}
                    className="w-full"
                    classNames={calendarClassNames}
                    modifiers={{
                      hasLeave: hasLeave
                    }}
                    modifiersClassNames={{
                      hasLeave: "bg-orange-100 font-bold text-orange-600"
                    }}
                    components={{
                      DayContent: ({ date }) => (
                        <CalendarDayContent 
                          date={date} 
                          membersOnLeave={getMembersOnLeave(date)} 
                        />
                      )
                    }}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">
                    {selectedDate ? getRelativeDayText(selectedDate) : '今天'}
                  </h3>
                  <TeamAvailabilityStats
                    selectedDate={selectedDate}
                    teamMembersCount={teamMembers.length}
                    getMembersOnLeave={getMembersOnLeave}
                  />
                </div>

                {selectedDate && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">請假成員</h3>
                    {selectedDayMembers.length > 0 ? (
                      <div className="space-y-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="cursor-pointer">
                              <AvatarGroup 
                                users={selectedDayMembers.map(member => ({
                                  id: member.id,
                                  first_name: member.first_name,
                                  last_name: member.last_name,
                                  leave_type: member.leave_type
                                }))} 
                                max={5}
                                className="mt-2"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>請假成員名單 - {selectedDate ? format(selectedDate, "MMM d, yyyy") : ""}</DialogTitle>
                            </DialogHeader>
                            <MemberLeaveList members={selectedDayMembers} />
                          </DialogContent>
                        </Dialog>
                        
                        <div className="text-sm text-muted-foreground flex flex-wrap gap-1">
                          {Array.from(new Set(selectedDayMembers.map(m => m.leave_type))).map(leaveType => (
                            <Badge key={leaveType} variant="outline" className="text-xs">
                              {leaveType}: {selectedDayMembers.filter(m => m.leave_type === leaveType).length}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">這天沒有人請假。</p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium mb-2">即將請假</h3>
                  {upcomingLeaves.length > 0 ? (
                    <div className="space-y-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="cursor-pointer">
                            <AvatarGroup 
                              users={upcomingLeaves.map(member => ({
                                id: member.id,
                                first_name: member.first_name,
                                last_name: member.last_name,
                                leave_type: member.leave_type
                              }))} 
                              max={5}
                              className="mt-2"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>即將請假的成員</DialogTitle>
                          </DialogHeader>
                          <MemberLeaveList members={upcomingLeaves} />
                        </DialogContent>
                      </Dialog>
                      
                      <div className="text-sm flex flex-wrap gap-1">
                        <Badge variant="outline" className="text-xs">
                          未來 {upcomingLeaves.length} 天
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">近期沒有人請假。</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <div className="border-t">
          <CardContent className="pt-6">
            <div>
              <h3 className="text-sm font-medium mb-3">假別類型</h3>
              <LeaveTypesLegend
                loadingLeaveTypes={loadingLeaveTypes}
                leaveTypes={leaveTypes}
              />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
