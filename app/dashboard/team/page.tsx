import { TeamMember, TeamMemberCard } from "@/components/team-member-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



// Sample team data
const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    position: "Software Engineer",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=JD",
    department: "Engineering",
    status: "Available",
  },
  {
    id: "2",
    name: "Alice Smith",
    position: "Product Manager",
    email: "alice.smith@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=AS",
    department: "Product",
    status: "On Leave",
    leaveType: "Sick Leave",
    leaveUntil: "Oct 19, 2023",
  },
  {
    id: "3",
    name: "Tom Wilson",
    position: "UX Designer",
    email: "tom.wilson@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=TW",
    department: "Design",
    status: "On Leave",
    leaveType: "Personal Leave",
    leaveUntil: "Oct 17, 2023",
  },
  {
    id: "4",
    name: "Mary Roberts",
    position: "Frontend Developer",
    email: "mary.roberts@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=MR",
    department: "Engineering",
    status: "Available",
  },
  {
    id: "5",
    name: "Kevin Lee",
    position: "Backend Developer",
    email: "kevin.lee@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=KL",
    department: "Engineering",
    status: "Available",
  },
  {
    id: "6",
    name: "Patricia Quinn",
    position: "QA Engineer",
    email: "patricia.quinn@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=PQ",
    department: "Engineering",
    status: "Available",
  },
  {
    id: "7",
    name: "Michael Johnson",
    position: "DevOps Engineer",
    email: "michael.johnson@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=MJ",
    department: "Operations",
    status: "Available",
  },
  {
    id: "8",
    name: "Sarah Davis",
    position: "HR Manager",
    email: "sarah.davis@example.com",
    avatar: "/placeholder.svg?height=100&width=100&text=SD",
    department: "HR",
    status: "Available",
  },
]

const departments = ["All", "Engineering", "Product", "Design", "Operations", "HR"]

export default function TeamPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground">View team members and their current status</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Team Overview</CardTitle>
          <CardDescription>Current team status and availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">{teamMembers.length}</div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">{teamMembers.filter((m) => m.status === "Available").length}</div>
              <div className="text-sm text-muted-foreground">Available</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">{teamMembers.filter((m) => m.status === "On Leave").length}</div>
              <div className="text-sm text-muted-foreground">On Leave</div>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
              <div className="text-3xl font-bold">{new Set(teamMembers.map((m) => m.department)).size}</div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <TeamMemberCard key={member.id} member={member as TeamMember} />
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
