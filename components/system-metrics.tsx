"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for system metrics
const cpuData = [
  { time: "00:00", value: 45 },
  { time: "01:00", value: 42 },
  { time: "02:00", value: 40 },
  { time: "03:00", value: 38 },
  { time: "04:00", value: 35 },
  { time: "05:00", value: 38 },
  { time: "06:00", value: 42 },
  { time: "07:00", value: 48 },
  { time: "08:00", value: 55 },
  { time: "09:00", value: 62 },
  { time: "10:00", value: 68 },
  { time: "11:00", value: 72 },
  { time: "12:00", value: 75 },
  { time: "13:00", value: 78 },
  { time: "14:00", value: 80 },
  { time: "15:00", value: 82 },
  { time: "16:00", value: 85 },
  { time: "17:00", value: 80 },
  { time: "18:00", value: 75 },
  { time: "19:00", value: 70 },
  { time: "20:00", value: 65 },
  { time: "21:00", value: 60 },
  { time: "22:00", value: 55 },
  { time: "23:00", value: 50 },
]

const memoryData = [
  { time: "00:00", value: 60 },
  { time: "01:00", value: 58 },
  { time: "02:00", value: 55 },
  { time: "03:00", value: 52 },
  { time: "04:00", value: 50 },
  { time: "05:00", value: 52 },
  { time: "06:00", value: 55 },
  { time: "07:00", value: 58 },
  { time: "08:00", value: 62 },
  { time: "09:00", value: 65 },
  { time: "10:00", value: 68 },
  { time: "11:00", value: 72 },
  { time: "12:00", value: 75 },
  { time: "13:00", value: 78 },
  { time: "14:00", value: 80 },
  { time: "15:00", value: 82 },
  { time: "16:00", value: 85 },
  { time: "17:00", value: 82 },
  { time: "18:00", value: 78 },
  { time: "19:00", value: 75 },
  { time: "20:00", value: 72 },
  { time: "21:00", value: 68 },
  { time: "22:00", value: 65 },
  { time: "23:00", value: 62 },
]

const apiResponseData = [
  { time: "00:00", value: 110 },
  { time: "01:00", value: 105 },
  { time: "02:00", value: 100 },
  { time: "03:00", value: 95 },
  { time: "04:00", value: 90 },
  { time: "05:00", value: 95 },
  { time: "06:00", value: 100 },
  { time: "07:00", value: 110 },
  { time: "08:00", value: 120 },
  { time: "09:00", value: 130 },
  { time: "10:00", value: 140 },
  { time: "11:00", value: 150 },
  { time: "12:00", value: 160 },
  { time: "13:00", value: 170 },
  { time: "14:00", value: 180 },
  { time: "15:00", value: 190 },
  { time: "16:00", value: 200 },
  { time: "17:00", value: 190 },
  { time: "18:00", value: 180 },
  { time: "19:00", value: 170 },
  { time: "20:00", value: 160 },
  { time: "21:00", value: 150 },
  { time: "22:00", value: 140 },
  { time: "23:00", value: 130 },
]

const errorRateData = [
  { time: "00:00", value: 0.02 },
  { time: "01:00", value: 0.02 },
  { time: "02:00", value: 0.01 },
  { time: "03:00", value: 0.01 },
  { time: "04:00", value: 0.01 },
  { time: "05:00", value: 0.01 },
  { time: "06:00", value: 0.02 },
  { time: "07:00", value: 0.02 },
  { time: "08:00", value: 0.03 },
  { time: "09:00", value: 0.04 },
  { time: "10:00", value: 0.05 },
  { time: "11:00", value: 0.06 },
  { time: "12:00", value: 0.07 },
  { time: "13:00", value: 0.08 },
  { time: "14:00", value: 0.09 },
  { time: "15:00", value: 0.1 },
  { time: "16:00", value: 0.09 },
  { time: "17:00", value: 0.08 },
  { time: "18:00", value: 0.07 },
  { time: "19:00", value: 0.06 },
  { time: "20:00", value: 0.05 },
  { time: "21:00", value: 0.04 },
  { time: "22:00", value: 0.03 },
  { time: "23:00", value: 0.02 },
]

export function SystemMetrics() {
  const [timeRange, setTimeRange] = useState("24h")

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={timeRange === "1h" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("1h")}>
          1h
        </Button>
        <Button variant={timeRange === "6h" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("6h")}>
          6h
        </Button>
        <Button variant={timeRange === "24h" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("24h")}>
          24h
        </Button>
        <Button variant={timeRange === "7d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("7d")}>
          7d
        </Button>
        <Button variant={timeRange === "30d" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30d")}>
          30d
        </Button>
      </div>

      <Tabs defaultValue="cpu">
        <TabsList>
          <TabsTrigger value="cpu">CPU 使用率</TabsTrigger>
          <TabsTrigger value="memory">記憶體使用率</TabsTrigger>
          <TabsTrigger value="api">API 回應時間</TabsTrigger>
          <TabsTrigger value="error">錯誤率</TabsTrigger>
        </TabsList>
        <TabsContent value="cpu" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuData}>
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: "CPU 使用率 (%)", angle: -90, position: "insideLeft" }} domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="memory" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={memoryData}>
                    <XAxis dataKey="time" />
                    <YAxis
                      label={{ value: "記憶體使用率 (%)", angle: -90, position: "insideLeft" }}
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={apiResponseData}>
                    <XAxis dataKey="time" />
                    <YAxis label={{ value: "回應時間 (毫秒)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ff7300" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="error" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={errorRateData}>
                    <XAxis dataKey="time" />
                    <YAxis
                      label={{ value: "錯誤率 (%)", angle: -90, position: "insideLeft" }}
                      domain={[0, 0.2]}
                      tickFormatter={(value) => `${value * 100}`}
                    />
                    <Tooltip formatter={(value: number) => [`${value * 100}%`, "錯誤率"]} />
                    <Line type="monotone" dataKey="value" stroke="#ff0000" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
