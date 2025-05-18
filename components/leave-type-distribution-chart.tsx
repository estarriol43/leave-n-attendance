"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "年假", value: 45, color: "#8884d8" },
  { name: "病假", value: 25, color: "#82ca9d" },
  { name: "事假", value: 20, color: "#ffc658" },
  { name: "國定假日", value: 10, color: "#ff8042" },
]

export function LeaveTypeDistributionChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "百分比"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
