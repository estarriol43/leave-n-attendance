"use client"

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

interface ApproveRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  formatName: (person: ProxyUserOut | null | undefined) => string;
  onConfirm: () => void;
}

export function ApproveRequestDialog({ isOpen, onOpenChange, request, formatName, onConfirm }: ApproveRequestDialogProps) {
  if (!request) return null;
  
  // Check if we have user info (for team requests)
  const userInfo = isTeamLeaveRequest(request) ? request.user : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>核准請假申請</DialogTitle>
          <DialogDescription>您確定要核准這個請假申請嗎？</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">申請編號:</div>
            <div className="col-span-2">{request.request_id}</div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-medium">員工:</div>
            <div className="col-span-2">{userInfo ? formatName(userInfo) : "您"}</div>
          </div>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirm}>核准</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 