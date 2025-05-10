'use client'

import { useAuth } from "@/hooks/use-auth"
import { LeaveBalanceProgress } from "@/components/leave-balance-progress"
import { RecentLeaveRequests } from "@/components/recent-leave-requests"
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
            <div className="space-y-4">
              <div className="text-3xl font-bold">3/12</div>
              <div className="text-sm text-muted-foreground">
                <p>Team members present: 9</p>
                <p>Team members on leave: 3</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">On leave today:</p>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>John Doe (Annual Leave)</li>
                  <li>Jane Smith (Sick Leave)</li>
                  <li>Mike Johnson (Personal Leave)</li>
                </ul>
              </div>
            </div>
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