"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "工程部",
    annual: 15,
    sick: 8,
    personal: 6,
    public: 2,
  },
  {
    name: "產品部",
    annual: 10,
    sick: 5,
    personal: 4,
    public: 1,
  },
  {
    name: "設計部",
    annual: 8,
    sick: 4,
    personal: 3,
    public: 1,
  },
  {
    name: "營運部",
    annual: 6,
    sick: 3,
    personal: 2,
    public: 1,
  },
  {
    name: "人資部",
    annual: 6,
    sick: 5,
    personal: 5,
    public: 1,
  },
]

export function DepartmentLeaveChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="annual" fill="#8884d8" name="年假" />
          <Bar dataKey="sick" fill="#82ca9d" name="病假" />
          <Bar dataKey="personal" fill="#ffc658" name="事假" />
          <Bar dataKey="public" fill="#ff8042" name="國定假日" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
