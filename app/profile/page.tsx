"use client"

import { useEffect, useState } from "react"
import { LeaveBalanceProgress } from "@/components/leave-balance-progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type User = {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  position: string
  hire_date: string
  is_manager: boolean
  department: {
    id: number
    name: string
  }
  manager: {
    id: number
    first_name: string
    last_name: string
  }
  annual_leave_quota: number
  sick_leave_quota: number
  personal_leave_quota: number
  public_holiday_quota: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("http://localhost:8000/api/users/me", {
        credentials: "include",
      })
      if (res.ok) {
        const data = await res.json()
        setUserData(data)
      } else {
        console.error("Failed to fetch user profile")
      }
    }

    fetchUser()
  }, [])

  if (!userData) {
    return <div className="p-4 text-center">Loading profile...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information and leave balance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your employee details and account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://ui-avatars.com/api/?name=${userData.first_name}+${userData.last_name}&background=random`} />
                <AvatarFallback>{userData.first_name[0]}{userData.last_name[0]}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{userData.first_name} {userData.last_name}</h3>
                <p className="text-muted-foreground">{userData.position}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Employee ID</div>
                <div className="col-span-2">{userData.employee_id}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Email</div>
                <div className="col-span-2">{userData.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Department</div>
                <div className="col-span-2">{userData.department.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Manager</div>
                <div className="col-span-2">
                  {userData.manager
                    ? `${userData.manager.first_name} ${userData.manager.last_name}`
                    : "—"}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Hire Date</div>
                <div className="col-span-2">{new Date(userData.hire_date).toLocaleDateString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Role</div>
                <div className="col-span-2">{userData.is_manager ? "Manager" : "Employee"}</div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leave Balance</CardTitle>
            <CardDescription>Your current leave balance for the year 2023</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaveBalanceProgress />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-lg mb-2">Annual Leave</h3>
                <p className="text-3xl font-bold text-blue-500 mb-2">{userData.annual_leave_quota} days</p>
                <p className="text-sm text-muted-foreground">Default quota per year</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-lg mb-2">Sick Leave</h3>
                <p className="text-3xl font-bold text-red-500 mb-2">{userData.sick_leave_quota} days</p>
                <p className="text-sm text-muted-foreground">Default quota per year</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-lg mb-2">Personal Leave</h3>
                <p className="text-3xl font-bold text-green-500 mb-2">{userData.personal_leave_quota} days</p>
                <p className="text-sm text-muted-foreground">Default quota per year</p>
              </div>
              <div className="p-4 border rounded-md">
                <h3 className="font-semibold text-lg mb-2">Public Holiday</h3>
                <p className="text-3xl font-bold text-amber-500 mb-2">{userData.public_holiday_quota} days</p>
                <p className="text-sm text-muted-foreground">Default quota per year</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
