import { Bell, Calendar, ClipboardList, Home, PieChart, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "儀表板", url: "/dashboard", icon: Home },
  { title: "請假申請", url: "/dashboard/leave-requests", icon: ClipboardList },
  { title: "行事曆", url: "/dashboard/calendar", icon: Calendar },
  { title: "團隊", url: "/dashboard/team", icon: Users },
  { title: "通知", url: "/dashboard/notifications", icon: Bell },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>請假與考勤系統</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
