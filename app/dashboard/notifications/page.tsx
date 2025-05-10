"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCheck, MailOpen } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

// Mock data based on API spec
const notificationsData = {
  notifications: [
    {
      id: 1,
      title: "Leave Request Approved",
      message: "Your leave request (REQ-001) has been approved by Jane Smith.",
      related_to: "leave_request",
      related_id: 1,
      is_read: false,
      created_at: "2023-10-10T14:35:00Z"
    },
    {
      id: 2,
      title: "New Leave Request",
      message: "John Doe has submitted a new leave request (REQ-003) for your approval.",
      related_to: "leave_request",
      related_id: 3,
      is_read: true,
      created_at: "2023-10-05T09:20:00Z"
    },
    {
      id: 3,
      title: "Leave Request Rejected",
      message: "Your leave request (REQ-004) has been rejected by Jane Smith. Reason: Critical project deadline.",
      related_to: "leave_request",
      related_id: 4,
      is_read: false,
      created_at: "2023-10-16T11:50:00Z"
    },
    {
      id: 4,
      title: "Team Member on Leave",
      message: "Alice Johnson will be on leave from Oct 15 to Oct 18.",
      related_to: "team_calendar",
      related_id: 2,
      is_read: true,
      created_at: "2023-10-12T10:15:00Z"
    },
    {
      id: 5,
      title: "Leave Balance Updated",
      message: "Your annual leave balance has been updated. You have 5 days remaining.",
      related_to: "leave_balance",
      related_id: 1,
      is_read: false,
      created_at: "2023-10-08T08:30:00Z"
    }
  ],
  pagination: {
    total: 5,
    page: 1,
    per_page: 10,
    total_pages: 1
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationsData.notifications)
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "unread") return !notification.is_read
    if (activeTab === "read") return notification.is_read
    return true // "all" tab
  })
  
  // Mark a single notification as read
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, is_read: true } 
          : notification
      )
    )
    
    // Simulate API call
    toast("Notification marked as read", {
      description: "The notification has been marked as read successfully."
    })
  }
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, is_read: true }))
    )
    
    // Simulate API call
    toast("All notifications marked as read", {
      description: `${notifications.filter(n => !n.is_read).length} notifications marked as read successfully.`
    })
  }
  
  // Format date to relative time (e.g., "2 hours ago")
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)
    
    if (diffDay > 0) {
      return diffDay === 1 ? "yesterday" : `${diffDay} days ago`
    } else if (diffHour > 0) {
      return `${diffHour} ${diffHour === 1 ? "hour" : "hours"} ago`
    } else if (diffMin > 0) {
      return `${diffMin} ${diffMin === 1 ? "minute" : "minutes"} ago`
    } else {
      return "just now"
    }
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your notifications
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={markAllAsRead}
          disabled={!notifications.some(n => !n.is_read)}
        >
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No notifications</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {activeTab === "unread" 
                  ? "You have no unread notifications." 
                  : activeTab === "read" 
                    ? "You have no read notifications."
                    : "You have no notifications at this time."}
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className={`py-4 ${!notification.is_read ? "bg-muted/50" : ""}`}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(notification.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => {
                        // Here you would navigate to the related item
                        toast("Navigating to related item", {
                          description: `Going to ${notification.related_to} with ID ${notification.related_id}`,
                        })
                      }}
                    >
                      View Details
                    </Button>
                    {!notification.is_read && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <MailOpen className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <div className="text-sm text-muted-foreground">
            Showing {filteredNotifications.length} of {notificationsData.pagination.total} notifications
          </div>
          {/* Add pagination controls here if needed */}
        </CardFooter>
      </Card>
    </div>
  )
}
