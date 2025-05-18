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
          <h1 className="text-3xl font-bold tracking-tight">請假申請</h1>
          <p className="text-muted-foreground">管理您的請假申請與核准</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/leave-requests/new">
            <Plus className="mr-2 h-4 w-4" />
            新增申請
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="my-requests">
        <TabsList>
          <TabsTrigger value="my-requests">我的申請</TabsTrigger>
          <TabsTrigger value="pending-approval">待核准</TabsTrigger>
          <TabsTrigger value="team-requests">團隊申請</TabsTrigger>
        </TabsList>
        <TabsContent value="my-requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>我的請假申請</CardTitle>
              <CardDescription>查看和管理您的請假申請</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable type="my-requests" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending-approval" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>待核准申請</CardTitle>
              <CardDescription>等待您核准的請假申請</CardDescription>
            </CardHeader>
            <CardContent>
              <LeaveRequestsTable type="pending-approval" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team-requests" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>團隊申請</CardTitle>
              <CardDescription>查看團隊所有的請假申請</CardDescription>
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
