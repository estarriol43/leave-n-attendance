import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Mail } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useRouter } from "next/navigation"

export interface TeamMember {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  position: string
  email: string
  department?: string
  status: "Available" | "On Leave"
  leaveType?: string
  leaveUntil?: string
  isCurrentUser?: boolean
}

interface TeamMemberCardProps {
  member: TeamMember
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const router = useRouter()
  
  return (
    <Card className="flex flex-col overflow-hidden justify-between">
      <CardContent className="p-0">
        <div className={`h-2 ${member.status === "Available" ? "bg-green-500" : "bg-amber-500"}`} />
        <div className="flex flex-col items-center text-center p-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={`/placeholder.svg?height=100&width=100&text=${member.first_name[0]}${member.last_name[0]}`} alt={`${member.first_name} ${member.last_name}`} />
            <AvatarFallback>
              {member.first_name[0]}{member.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">{member.first_name} {member.last_name}</h3>
            {member.isCurrentUser && (
              <Badge variant="secondary">You</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{member.position}</p>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={member.status === "Available" ? "default" : "outline"} className="mb-4">
                {member.status}
              </Badge>
            </TooltipTrigger>
            {member.status === "On Leave" && (
              <TooltipContent>
                <p>{member.leaveType}</p>
                <p>Until {member.leaveUntil && formatDate(member.leaveUntil)}</p>
              </TooltipContent>
            )}
          </Tooltip>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{member.email}</span>
            </div>
            {member.department && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="rounded-sm">
                  {member.department}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="w-full bg-muted/50 px-6 py-3 flex justify-center">
        <Button 
          className="w-full" 
          variant="ghost" 
          size="sm"
          onClick={() => router.push(`/dashboard/profile/${member.id}`)}
        >
          View Profile
        </Button>
      </CardFooter>
    </Card>
  )
}
