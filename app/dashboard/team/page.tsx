"use client"

import { useState, useEffect } from "react"
import { TeamMember, TeamMemberCard } from "@/components/team-member-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTeamMembers } from "@/lib/services/team"
import { getTeamLeaveRequests, LeaveRequestTeamItem, isOnLeave } from "@/lib/services/leave-request"
import { formatDate } from "@/lib/utils"
import { getCurrentUser, UserProfile } from "@/lib/services/user"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestTeamItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [departments, setDepartments] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Fetch current user profile
        const userProfile = await getCurrentUser()
        setCurrentUser(userProfile)
        
        // Fetch team members
        const teamData = await getTeamMembers()
        
        // Fetch leave requests
        const leaveData = await getTeamLeaveRequests({
          status: 'approved' // Only get approved leave requests
        })
        
        setLeaveRequests(leaveData.leave_requests)
        
        // Transform team data to match our component's expected format
        const processedTeamMembers = teamData.map(member => {
          // Check if the member is currently on leave
          const memberLeaveStatus = isOnLeave(member.id, leaveData.leave_requests)
          
          return {
            id: member.id,
            employee_id: member.employee_id,
            first_name: member.first_name,
            last_name: member.last_name,
            position: member.position,
            email: member.email,
            department: member.department.name,
            status: memberLeaveStatus.isOnLeave ? "On Leave" : "Available",
            leaveType: memberLeaveStatus.leaveType,
            leaveUntil: memberLeaveStatus.endDate,
            isCurrentUser: member.id === userProfile.id
          } as TeamMember
        })
        
        // Add current user to team members if not already included
        const currentUserInTeam = processedTeamMembers.some(member => member.id === userProfile.id)
        
        if (!currentUserInTeam) {
          // Check if current user is on leave
          const userLeaveStatus = isOnLeave(userProfile.id, leaveData.leave_requests)
          
          // Add current user to team members list
          processedTeamMembers.push({
            id: userProfile.id,
            employee_id: userProfile.employee_id,
            first_name: userProfile.first_name,
            last_name: userProfile.last_name,
            position: userProfile.position,
            email: userProfile.email,
            department: userProfile.department.name,
            status: userLeaveStatus.isOnLeave ? "On Leave" : "Available",
            leaveType: userLeaveStatus.leaveType,
            leaveUntil: userLeaveStatus.endDate,
            isCurrentUser: true
          })
        }
        
        setTeamMembers(processedTeamMembers)
        
        // Extract unique departments
        const deptSet = new Set<string>()
        processedTeamMembers.forEach(member => {
          if (member.department) {
            deptSet.add(member.department)
          }
        })
        
        // Add "All" at the beginning of departments list
        setDepartments(['All', ...Array.from(deptSet)])
      } catch (err) {
        console.error('Error fetching team data:', err)
        setError('Failed to load team data. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading team data...</div>
  }
  
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">View team members and their current status</p>
      </div>

      <Tabs defaultValue="All">
        <TabsList className="mb-4">
          {departments.map((dept) => (
            <TabsTrigger key={dept} value={dept}>
              {dept}
            </TabsTrigger>
          ))}
        </TabsList>

        {departments.map((dept) => (
          <TabsContent key={dept} value={dept}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {teamMembers
                .filter((member) => dept === "All" || member.department === dept)
                .map((member) => (
                  <TeamMemberCard key={member.id} member={member} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
