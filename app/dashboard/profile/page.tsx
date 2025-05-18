"use client"

import { useEffect, useState } from "react"
import { LeaveBalanceProgress } from "@/components/leave-balance-progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

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
}

interface LeaveType {
  id: number
  name: string
  color_code: string
}

interface LeaveBalanceItem {
  leave_type: LeaveType
  quota: number
  used_days: number
  remaining_days: number
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<User | null>(null)
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: ""
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, balancesResponse] = await Promise.all([
          api.get('/users/me'),
          api.get('/leave-balances')
        ])
        
        setUserData(userResponse.data)
        
        // Initialize form data with user data
        setFormData({
          first_name: userResponse.data.first_name,
          last_name: userResponse.data.last_name,
          email: userResponse.data.email,
          position: userResponse.data.position
        })
        
        if (balancesResponse.data && balancesResponse.data.balances) {
          setLeaveBalances(balancesResponse.data.balances)
        }
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      const response = await api.put('/users/me', formData)
      
      if (response.data) {
        setUserData(prev => ({
          ...prev!,
          ...formData
        }))
        toast.success("個人資料已更新成功")
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to update profile", error)
      toast.error("更新個人資料失敗，請稍後再試")
    } finally {
      setLoading(false)
    }
  }

  if (loading || !userData) {
    return <div className="p-4 text-center">Loading profile...</div>
  }

  // Get leave quotas by type
  const getLeaveQuota = (typeName: string) => {
    const balance = leaveBalances.find(b => 
      b.leave_type.name.toLowerCase().includes(typeName.toLowerCase())
    )
    return balance ? balance.quota : 0
  }
  
  const getRemainingDays = (typeName: string) => {
    const balance = leaveBalances.find(b => 
      b.leave_type.name.toLowerCase().includes(typeName.toLowerCase())
    )
    return balance ? balance.remaining_days : 0
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center">
        <Card className="w-[25rem] lg:w-[30rem] max-w-full mx-4">
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
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input 
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input 
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <h3 className="text-lg font-semibold">{userData.first_name} {userData.last_name}</h3>
                )}
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
                {isEditing ? (
                  <div className="col-span-2">
                    <Input 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                ) : (
                  <div className="col-span-2">{userData.email}</div>
                )}
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
                <div className="col-span-2">
                  <Badge variant={userData.is_manager ? "default" : "secondary"}>
                    {userData.is_manager ? "Manager" : "Employee"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form data to original values
                      setFormData({
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        position: userData.position
                      })
                    }} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)} 
                  className="w-full"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
