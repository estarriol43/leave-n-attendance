"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Clock, FileText, LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from '@/hooks/use-auth'

// 定義 Notification 介面
interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "leave" | "team" | "document" | string
}

const fakeData: Notification[] = [
  {
    id: "1",
    title: "Leave Request Approved",
    description: "Your leave request for Oct 15-18 has been approved by Jane Smith.",
    time: "10 minutes ago",
    read: false,
    type: "leave",
  },
  {
    id: "2",
    title: "New Team Member",
    description: "Welcome Emily Davis to the team! She will be joining as a Frontend Developer.",
    time: "2 hours ago",
    read: false,
    type: "team",
  },
  {
    id: "3",
    title: "Leave Request Pending",
    description: "Your leave request for Dec 24-31 is pending approval from Jane Smith.",
    time: "1 day ago",
    read: true,
    type: "leave",
  },
]

export function Navbar() {
  const router = useRouter()
  const { user, logout, loading: userLoading } = useAuth()

  // 使用 Notification 介面作為 useState 的類型
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // 模擬從伺服器獲取數據
    const fetchNotifications = async () => {
      // 模擬延遲
      await new Promise((resolve) => setTimeout(resolve, 500))
      setNotifications(fakeData)
    }

    fetchNotifications()
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "leave":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "team":
        return <User className="h-5 w-5 text-green-500" />
      case "document":
        return <FileText className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="border-b bg-background mb-4" data-testid="navbar">
      <div className="flex h-fit items-center pr-2 md:pr-4 pb-4">
        <SidebarTrigger className="absolute" data-testid="sidebar-trigger" />
        <div className="ml-auto flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
                data-testid="notification-button"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
                    data-testid="notification-badge"
                  >
                    {unreadCount}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              collisionPadding={24}
              sideOffset={12}
              className="w-80 p-0"
              data-testid="notification-popover"
            >
              <div className="flex flex-col">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You have {unreadCount} unread notification
                    {unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="divide-y">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-4 p-4 ${
                          !notification.read ? "bg-muted/50" : ""
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium leading-none">{notification.title}</p>
                            {!notification.read && (
                              <Badge
                                className="h-1.5 w-1.5 rounded-full p-0"
                                data-testid={`notification-unread-${notification.id}`}
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center py-12 text-center"
                      data-testid="no-notifications"
                    >
                      <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg">All caught up!</h3>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        {"You have no notifications at the moment. We'll notify you when there are new updates."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
                data-testid="user-menu-button"
              >
                <Avatar>
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                    data-testid="user-avatar"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56"
              align="end"
              forceMount
              data-testid="user-menu"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {userLoading ? '載入中...' : user ? `${user.first_name} ${user.last_name}` : '未登入'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userLoading ? '' : user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
                data-testid="menu-profile"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                data-testid="menu-settings"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { logout(); router.push("/login") }}
                data-testid="menu-logout"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
