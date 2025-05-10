"use client"

import { DepartmentLeaveChart } from "@/components/department-leave-chart"
import { LeaveTypeDistributionChart } from "@/components/leave-type-distribution-chart"
import { LeaveUsageChart } from "@/components/leave-usage-chart"
import { MonthlyLeaveTable } from "@/components/monthly-leave-table"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, Download } from "lucide-react"
import { useState } from "react"

// Mock data based on API spec
const leaveUsageData = {
  year: 2023,
  total_days_taken: 45,
  by_leave_type: [
    {
      leave_type: {
        id: 1,
        name: "Annual Leave",
        color_code: "#4f46e5"
      },
      days_taken: 20
    },
    {
      leave_type: {
        id: 2,
        name: "Sick Leave",
        color_code: "#ef4444"
      },
      days_taken: 15
    },
    {
      leave_type: {
        id: 3,
        name: "Personal Leave",
        color_code: "#10b981"
      },
      days_taken: 10
    }
  ],
  by_month: [
    { month: 1, days_taken: 5 },
    { month: 2, days_taken: 3 },
    { month: 3, days_taken: 6 },
    { month: 4, days_taken: 4 },
    { month: 5, days_taken: 2 },
    { month: 6, days_taken: 3 },
    { month: 7, days_taken: 5 },
    { month: 8, days_taken: 6 },
    { month: 9, days_taken: 4 },
    { month: 10, days_taken: 7 },
    { month: 11, days_taken: 0 },
    { month: 12, days_taken: 0 }
  ]
}

const leaveBalancesData = {
  year: 2023,
  employees: [
    {
      id: 1,
      employee_id: "EMP001",
      first_name: "John",
      last_name: "Doe",
      balances: [
        {
          leave_type: {
            id: 1,
            name: "Annual Leave"
          },
          quota: 7,
          used_days: 2,
          remaining_days: 5
        },
        {
          leave_type: {
            id: 2,
            name: "Sick Leave"
          },
          quota: 30,
          used_days: 3,
          remaining_days: 27
        }
      ]
    },
    {
      id: 3,
      employee_id: "EMP003",
      first_name: "Alice",
      last_name: "Johnson",
      balances: [
        {
          leave_type: {
            id: 1,
            name: "Annual Leave"
          },
          quota: 7,
          used_days: 1,
          remaining_days: 6
        },
        {
          leave_type: {
            id: 2,
            name: "Sick Leave"
          },
          quota: 30,
          used_days: 5,
          remaining_days: 25
        }
      ]
    }
  ]
}

// Department data for filtering
const departments = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Human Resources" },
  { id: 4, name: "Finance" }
]

// Leave types for filtering
const leaveTypes = [
  { id: 1, name: "Annual Leave" },
  { id: 2, name: "Sick Leave" },
  { id: 3, name: "Personal Leave" },
  { id: 4, name: "Public Holiday" }
]

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("usage")
  const [departmentId, setDepartmentId] = useState<string>("0") // 0 means all departments
  const [leaveTypeId, setLeaveTypeId] = useState<string>("0") // 0 means all leave types
  const [date, setDate] = useState<Date>(new Date())
  
  // Handle date change
  const year = date.getFullYear()
  
  // Export report function
  const handleExport = () => {
    alert(`Exporting ${activeTab} report for year ${year}`)
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Analyze leave usage and balance across your team
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="usage" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="usage">Leave Usage</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
        </TabsList>
        
        <div className="my-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="department">Department</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="leave-type">Leave Type</Label>
            <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
              <SelectTrigger id="leave-type">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Leave Types</SelectItem>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="year">Year</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="year"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  disabled={(date) => {
                    const year = date.getFullYear()
                    return year < 2020 || year > new Date().getFullYear()
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Leave Days</CardTitle>
                <CardDescription>
                  Total leave days taken in {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{leaveUsageData.total_days_taken}</div>
                <p className="text-xs text-muted-foreground mt-1">Days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>By Leave Type</CardTitle>
                <CardDescription>
                  Distribution of leave types in {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <LeaveTypeDistributionChart />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>By Department</CardTitle>
                <CardDescription>
                  Leave distribution by department in {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40">
                  <DepartmentLeaveChart />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Leave Usage</CardTitle>
                <CardDescription>
                  Leave days taken by month in {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LeaveUsageChart />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Leave Summary by Month</CardTitle>
                <CardDescription>
                  Monthly breakdown of leave usage in {year}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyLeaveTable />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="balances" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Leave Balances Overview</CardTitle>
              <CardDescription>
                Current leave balances for all employees in {departmentId === "0" ? "all departments" : departments.find(d => d.id.toString() === departmentId)?.name || ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium">Employee</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Annual Leave</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Sick Leave</th>
                      <th className="h-12 px-4 text-left align-middle font-medium">Personal Leave</th>
                      <th className="h-12 px-4 text-right align-middle font-medium">Total Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveBalancesData.employees.map((employee) => {
                      const annualLeave = employee.balances.find(b => b.leave_type.id === 1)
                      const sickLeave = employee.balances.find(b => b.leave_type.id === 2)
                      const personalLeave = employee.balances.find(b => b.leave_type.id === 3) || { quota: 14, used_days: 0, remaining_days: 14 }
                      const totalRemaining = (annualLeave?.remaining_days || 0) + (sickLeave?.remaining_days || 0) + (personalLeave?.remaining_days || 0)
                      
                      return (
                        <tr key={employee.id} className="border-b">
                          <td className="p-4 align-middle">
                            <div className="font-medium">{employee.first_name} {employee.last_name}</div>
                            <div className="text-muted-foreground text-xs">{employee.employee_id}</div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">{annualLeave?.remaining_days || 0} days remaining</span>
                              <span className="text-xs text-muted-foreground">
                                ({annualLeave?.used_days || 0} used of {annualLeave?.quota || 7})
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">{sickLeave?.remaining_days || 0} days remaining</span>
                              <span className="text-xs text-muted-foreground">
                                ({sickLeave?.used_days || 0} used of {sickLeave?.quota || 30})
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="font-medium">{personalLeave?.remaining_days || 0} days remaining</span>
                              <span className="text-xs text-muted-foreground">
                                ({personalLeave?.used_days || 0} used of {personalLeave?.quota || 14})
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <span className="font-medium">{totalRemaining} days</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
