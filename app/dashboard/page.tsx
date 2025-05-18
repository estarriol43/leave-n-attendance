'use client'

import { useAuth } from "@/hooks/use-auth"
import { LeaveBalanceProgress } from "@/components/leave-balance-progress"
import { RecentLeaveRequests } from "@/components/recent-leave-requests"
import { TeamAvailability } from "@/components/team-availability"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {"Welcome back! Here's an overview of your leave status and team availability."}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your remaining leave balance for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveBalanceProgress />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Team Availability</CardTitle>
            <CardDescription>Team members on leave today</CardDescription>
          </CardHeader>
          <CardContent>
            <TeamAvailability />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
          <CardDescription>Your recent leave requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentLeaveRequests />
        </CardContent>
      </Card>
    </div>
  )
} 