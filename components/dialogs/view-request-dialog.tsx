"use client"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LeaveRequest, ProxyUserOut, isTeamLeaveRequest } from "@/lib/services/leave-request"

interface ViewRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  formatName: (person: ProxyUserOut | null | undefined) => string;
}

export function ViewRequestDialog({ isOpen, onOpenChange, request, formatName }: ViewRequestDialogProps) {
  if (!request) return null;
  
  // Check if we have user info (for team requests)
  const userInfo = isTeamLeaveRequest(request) ? request.user : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>請假申請詳情</DialogTitle>
          <DialogDescription>請假申請的詳細資訊。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">申請編號:</div>
            <div className="col-span-2">{request.request_id}</div>
          </div>
          {userInfo && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">員工:</div>
              <div className="col-span-2">{formatName(userInfo)}</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">假別:</div>
            <div className="col-span-2">{request.leave_type.name}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">期間:</div>
            <div className="col-span-2">
              {request.start_date} 至 {request.end_date}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">請假天數:</div>
            <div className="col-span-2">{request.days_count}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">請假原因:</div>
            <div className="col-span-2">{request.reason}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">狀態:</div>
            <div className="col-span-2">
              <Badge
                variant={
                  request.status.toLowerCase() === "approved"
                    ? "default"
                    : request.status.toLowerCase() === "rejected"
                      ? "destructive"
                      : "outline"
                }
              >
                {request.status.toLowerCase() === "approved" 
                  ? "已核准" 
                  : request.status.toLowerCase() === "rejected"
                    ? "已拒絕"
                    : request.status.toLowerCase() === "pending"
                      ? "審核中"
                      : request.status}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">代理人:</div>
            <div className="col-span-2">{formatName(request.proxy_person)}</div>
          </div>
          {request.approver && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">審核人:</div>
              <div className="col-span-2">{formatName(request.approver)}</div>
            </div>
          )}
          {request.rejection_reason && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">拒絕原因:</div>
              <div className="col-span-2">{request.rejection_reason}</div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">建立時間:</div>
            <div className="col-span-2">{new Date(request.created_at).toLocaleString()}</div>
          </div>
          {request.approved_at && (
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">核准時間:</div>
              <div className="col-span-2">{new Date(request.approved_at).toLocaleString()}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>關閉</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 