"use client"

import { useState } from "react"
import { Eye, Filter } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data for audit logs
const auditLogs = [
  {
    id: "LOG-001",
    action: "登入",
    user: "john.doe@example.com",
    timestamp: "2023-10-15 14:32:45",
    details: "使用者成功登入",
    ip: "192.168.1.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
  {
    id: "LOG-002",
    action: "請假申請",
    user: "john.doe@example.com",
    timestamp: "2023-10-15 14:45:22",
    details: "建立請假申請 REQ-004",
    ip: "192.168.1.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
  {
    id: "LOG-003",
    action: "請假核准",
    user: "jane.smith@example.com",
    timestamp: "2023-10-15 15:10:18",
    details: "核准請假申請 REQ-003",
    ip: "192.168.1.2",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
  {
    id: "LOG-004",
    action: "請假拒絕",
    user: "jane.smith@example.com",
    timestamp: "2023-10-15 15:15:33",
    details: "拒絕請假申請 REQ-002，原因：專案關鍵期限",
    ip: "192.168.1.2",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
  {
    id: "LOG-005",
    action: "登出",
    user: "john.doe@example.com",
    timestamp: "2023-10-15 16:30:45",
    details: "使用者登出",
    ip: "192.168.1.1",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
]

export function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState<any | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [actionFilters, setActionFilters] = useState<string[]>([])

  const handleView = (log: any) => {
    setSelectedLog(log)
    setIsViewDialogOpen(true)
  }

  const toggleActionFilter = (action: string) => {
    setActionFilters((prev) => (prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]))
  }

  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)))

  const filteredLogs =
    actionFilters.length > 0 ? auditLogs.filter((log) => actionFilters.includes(log.action)) : auditLogs

  return (
    <>
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              篩選
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {uniqueActions.map((action) => (
              <DropdownMenuCheckboxItem
                key={action}
                checked={actionFilters.includes(action)}
                onCheckedChange={() => toggleActionFilter(action)}
              >
                {action}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>日誌 ID</TableHead>
            <TableHead>操作</TableHead>
            <TableHead>使用者</TableHead>
            <TableHead>時間戳記</TableHead>
            <TableHead>詳細資訊</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">{log.id}</TableCell>
              <TableCell>
                <Badge variant="outline">{log.action}</Badge>
              </TableCell>
              <TableCell>{log.user}</TableCell>
              <TableCell>{log.timestamp}</TableCell>
              <TableCell className="max-w-xs truncate">{log.details}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleView(log)}>
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">查看</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Log Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>審計日誌詳情</DialogTitle>
            <DialogDescription>有關審計日誌的詳細資訊。</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">日誌 ID:</div>
                <div className="col-span-2">{selectedLog.id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">操作:</div>
                <div className="col-span-2">
                  <Badge variant="outline">{selectedLog.action}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">使用者:</div>
                <div className="col-span-2">{selectedLog.user}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">時間戳記:</div>
                <div className="col-span-2">{selectedLog.timestamp}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">詳細資訊:</div>
                <div className="col-span-2">{selectedLog.details}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">IP 位址:</div>
                <div className="col-span-2">{selectedLog.ip}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">用戶代理:</div>
                <div className="col-span-2 break-words text-xs">{selectedLog.userAgent}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>關閉</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
