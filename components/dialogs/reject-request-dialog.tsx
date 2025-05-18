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
import { Textarea } from "@/components/ui/textarea"
import { LeaveRequest, ProxyUserOut, isTeamLeaveRequest } from "@/lib/services/leave-request"

interface RejectRequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  formatName: (person: ProxyUserOut | null | undefined) => string;
  rejectReason: string;
  onRejectReasonChange: (reason: string) => void;
  onConfirm: () => void;
}

export function RejectRequestDialog({ 
  isOpen, 
  onOpenChange, 
  request, 
  formatName,
  rejectReason,
  onRejectReasonChange,
  onConfirm 
}: RejectRequestDialogProps) {
  if (!request) return null;
  
  // Check if we have user info (for team requests)
  const userInfo = isTeamLeaveRequest(request) ? request.user : null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>拒絕請假申請</DialogTitle>
          <DialogDescription>請提供拒絕這個請假申請的理由。</DialogDescription>
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
          <div className="grid gap-2">
            <div className="font-medium">拒絕原因:</div>
            <Textarea
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              placeholder="請提供拒絕此申請的原因"
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            拒絕
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 