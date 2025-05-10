"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addMonths, format, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

// Mock data based on API spec
const calendarData = {
  year: 2023,
  month: 10,
  days: [
    {
      date: "2023-10-15",
      members_on_leave: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          leave_type: "Annual Leave"
        },
        {
          id: 3,
          first_name: "Alice",
          last_name: "Johnson",
          leave_type: "Sick Leave"
        }
      ]
    },
    {
      date: "2023-10-16",
      members_on_leave: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          leave_type: "Annual Leave"
        }
      ]
    },
    {
      date: "2023-10-17",
      members_on_leave: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          leave_type: "Annual Leave"
        }
      ]
    },
    {
      date: "2023-10-18",
      members_on_leave: [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          leave_type: "Annual Leave"
        }
      ]
    },
    {
      date: "2023-10-20",
      members_on_leave: [
        {
          id: 4,
          first_name: "Robert",
          last_name: "Wilson",
          leave_type: "Personal Leave"
        }
      ]
    },
    {
      date: "2023-10-25",
      members_on_leave: [
        {
          id: 2,
          first_name: "Jane",
          last_name: "Smith",
          leave_type: "Annual Leave"
        },
        {
          id: 5,
          first_name: "Emily",
          last_name: "Davis",
          leave_type: "Sick Leave"
        }
      ]
    }
  ]
}

// Format month number to name
const getMonthName = (month: number) => {
  return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })
}

// Team members for filtering
const teamMembers = [
  { id: 0, name: "All Members" },
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alice Johnson" },
  { id: 4, name: "Robert Wilson" },
  { id: 5, name: "Emily Davis" }
]

// Leave types for legend
const leaveTypes = [
  { name: "Annual Leave", color: "bg-blue-500" },
  { name: "Sick Leave", color: "bg-red-500" },
  { name: "Personal Leave", color: "bg-green-500" },
  { name: "Public Holiday", color: "bg-amber-500" }
]

export default function TeamCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedMemberId, setSelectedMemberId] = useState<string>("0") // 0 means all members
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
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
                  {calendarData.days
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
                  {calendarData.days
                    .filter(day => {
                      const dayDate = new Date(day.date)
                      const today = new Date()
                      return dayDate > today && dayDate <= new Date(today.setDate(today.getDate() + 7))
                    }).length === 0 && (
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
