import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LeaveRequestsTable } from "@/components/leave-requests-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LeaveRequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground">Manage your leave requests and approvals</p>
        </div>
        <Button asChild>
          <Link href="/leave-requests/new">
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="pending-approval">Pending Approval</TabsTrigger>
          <TabsTrigger value="team-requests">Team Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="my-requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>My Leave Requests</CardTitle>
              <CardDescription>View and manage your leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable type="my-requests" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending-approval" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approval</CardTitle>
              <CardDescription>Leave requests waiting for your approval</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable type="pending-approval" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team-requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Requests</CardTitle>
              <CardDescription>View all leave requests from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable type="team-requests" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
