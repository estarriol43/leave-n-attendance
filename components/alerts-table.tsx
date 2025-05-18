"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Clock, MoreHorizontal } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface Alert {
  id: string
  severity: "High" | "Medium" | "Low"
  message: string
  source: string
  timestamp: string
  status: "Active" | "Acknowledged" | "Resolved"
  resolvedAt?: string
  acknowledgedAt?: string
}

// Sample data for system alerts
const alerts: Alert[] = [
  {
    id: "ALERT-001",
    severity: "High",
    message: "資料庫連線逾時",
    source: "資料庫",
    timestamp: "2023-10-15 14:32:45",
    status: "Active",
  },
  {
    id: "ALERT-002",
    severity: "Medium",
    message: "API 回應時間超過閾值",
    source: "API 閘道",
    timestamp: "2023-10-15 15:10:22",
    status: "Active",
  },
  {
    id: "ALERT-003",
    severity: "Low",
    message: "CPU 使用率超過 80%",
    source: "應用程式伺服器",
    timestamp: "2023-10-15 12:45:18",
    status: "Resolved",
    resolvedAt: "2023-10-15 13:15:32",
  },
  {
    id: "ALERT-004",
    severity: "Low",
    message: "記憶體使用率超過 75%",
    source: "應用程式伺服器",
    timestamp: "2023-10-15 11:22:05",
    status: "Resolved",
    resolvedAt: "2023-10-15 11:45:12",
  },
  {
    id: "ALERT-005",
    severity: "Medium",
    message: "登入失敗嘗試次數超過閾值",
    source: "認證服務",
    timestamp: "2023-10-14 22:15:33",
    status: "Acknowledged",
    acknowledgedAt: "2023-10-14 22:20:45",
  },
]

export function AlertsTable() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false)

  const handleView = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsViewDialogOpen(true)
  }

  const handleResolve = (alert: Alert) => {
    setSelectedAlert(alert)
    setIsResolveDialogOpen(true)
  }

  const confirmResolve = () => {
    if (selectedAlert) {
      // In a real application, you would call your API to resolve the alert
      toast("警報已解決", {
        description: `警報 ${selectedAlert.id} 已標記為已解決。`,
      })
    }
    setIsResolveDialogOpen(false)
  }

  const getStatusIcon = (status: Alert["status"]) => {
    switch (status) {
      case "Active":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case "Acknowledged":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  const getSeverityBadge = (severity: Alert["severity"]) => {
    switch (severity) {
      case "High":
        return <Badge variant="destructive">高</Badge>
      case "Medium":
        return <Badge className="bg-amber-500">中</Badge>
      case "Low":
        return <Badge variant="outline">低</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>警報 ID</TableHead>
            <TableHead>嚴重程度</TableHead>
            <TableHead>訊息</TableHead>
            <TableHead>來源</TableHead>
            <TableHead>時間戳記</TableHead>
            <TableHead>狀態</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">{alert.id}</TableCell>
              <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
              <TableCell>{alert.message}</TableCell>
              <TableCell>{alert.source}</TableCell>
              <TableCell>{alert.timestamp}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(alert.status)}
                  <span>
                    {alert.status === "Active" ? "活躍" : 
                     alert.status === "Acknowledged" ? "已確認" : 
                     alert.status === "Resolved" ? "已解決" : alert.status}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">操作</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(alert)}>查看詳情</DropdownMenuItem>
                    {alert.status !== "Resolved" && (
                      <DropdownMenuItem onClick={() => handleResolve(alert)}>標記為已解決</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Alert Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>警報詳情</DialogTitle>
            <DialogDescription>關於警報的詳細資訊。</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">警報 ID:</div>
                <div className="col-span-2">{selectedAlert.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">嚴重程度:</div>
                <div className="col-span-2">{getSeverityBadge(selectedAlert.severity)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">訊息:</div>
                <div className="col-span-2">{selectedAlert.message}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">來源:</div>
                <div className="col-span-2">{selectedAlert.source}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">時間戳記:</div>
                <div className="col-span-2">{selectedAlert.timestamp}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">狀態:</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedAlert.status)}
                    <span>
                      {selectedAlert.status === "Active" ? "活躍" : 
                       selectedAlert.status === "Acknowledged" ? "已確認" : 
                       selectedAlert.status === "Resolved" ? "已解決" : selectedAlert.status}
                    </span>
                  </div>
                </div>
              </div>
              {selectedAlert.resolvedAt && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">解決時間:</div>
                  <div className="col-span-2">{selectedAlert.resolvedAt}</div>
                </div>
              )}
              {selectedAlert.acknowledgedAt && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">確認時間:</div>
                  <div className="col-span-2">{selectedAlert.acknowledgedAt}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>關閉</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Resolve Alert Dialog */}
      <Dialog open={isResolveDialogOpen} onOpenChange={setIsResolveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>解決警報</DialogTitle>
            <DialogDescription>您確定要將此警報標記為已解決嗎？</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">警報 ID:</div>
                <div className="col-span-2">{selectedAlert.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">訊息:</div>
                <div className="col-span-2">{selectedAlert.message}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResolveDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={confirmResolve}>解決</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
