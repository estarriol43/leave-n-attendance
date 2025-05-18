"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Inter } from "next/font/google"
import type React from "react"
import { Toaster } from "sonner"
import "../globals.css"
import { useAuth } from "@/hooks/use-auth"
const inter = Inter({ subsets: ["latin"] })


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useAuth()
  
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <SidebarProvider>
            <AppSidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Navbar />
              {children}
            </main>
          </SidebarProvider>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
} 