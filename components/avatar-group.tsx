import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export interface User {
  id: string | number
  name?: string
  first_name?: string
  last_name?: string
  image?: string
  leave_type?: string
}

interface AvatarGroupProps {
  users: User[]
  max?: number
  size?: "sm" | "md" | "lg"
  className?: string
  showTooltip?: boolean
  onClick?: () => void
}

export function AvatarGroup({ 
  users, 
  max = 4, 
  size = "md", 
  className, 
  showTooltip = false,
  onClick 
}: AvatarGroupProps) {
  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-10 w-10 text-base",
  }

  const visibleUsers = users.slice(0, max)
  const remainingCount = users.length - max

  // Helper to get user name
  const getUserName = (user: User) => {
    if (user.name) return user.name
    if (user.first_name && user.last_name) return `${user.first_name} ${user.last_name}`
    return "User"
  }

  // Helper to get avatar text
  const getAvatarText = (user: User) => {
    if (user.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    }
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`
    }
    return "U"
  }

  return (
    <div 
      className={cn("flex items-center", className, onClick && "cursor-pointer")} 
      onClick={onClick}
    >
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <Avatar
            key={`${user.id}-${index}`}
            className={cn(
              sizeClasses[size],
              "ring-2 ring-background transition-transform hover:z-10 hover:-translate-y-1",
            )}
          >
            <AvatarImage 
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=random`} 
              alt={getUserName(user)} 
            />
            <AvatarFallback>
              {getAvatarText(user)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {remainingCount > 0 && (
        <div
          className={cn(
            sizeClasses[size],
            "ring-2 ring-background flex items-center justify-center rounded-full bg-muted font-medium -ml-2",
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
