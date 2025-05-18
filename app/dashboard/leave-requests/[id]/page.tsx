"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, CheckCircle, Clock, FileText, Paperclip, User, UserCheck, XCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

// Mock data based on API spec
const leaveRequestData = {
  id: 1,
  request_id: "REQ-001",
  user: {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    employee_id: "EMP001"
  },
  leave_type: {
    id: 1,
    name: "Annual Leave",
    color_code: "#4f46e5"
  },
  start_date: "2023-10-15",
  end_date: "2023-10-18",
  days_count: 4,
  reason: "Family vacation to visit relatives in Taipei. We plan to have a family reunion and celebrate my parents' anniversary.",
  status: "Approved",
  proxy_person: {
    id: 3,
    first_name: "Alice",
    last_name: "Johnson"
  },
  approver: {
    id: 2,
    first_name: "Jane",
    last_name: "Smith"
  },
  approved_at: "2023-10-10T14:30:00Z",
  created_at: "2023-10-05T09:15:00Z",
  attachments: [
    {
      id: 1,
      file_name: "vacation_docs.pdf",
      file_type: "application/pdf",
      file_size: 1024000,
      uploaded_at: "2023-10-05T09:20:00Z"
    }
  ]
}

export default function LeaveRequestDetailsPage({ params }: { params: { id: string } }) {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isStatusUpdating, setIsStatusUpdating] = useState(false)
  
  // Mock approval/rejection functionality
  const handleApprove = () => {
    setIsStatusUpdating(true)
    // Simulate API call
    setTimeout(() => {
      toast("Leave request approved", {
        description: `Leave request ${leaveRequestData.request_id} has been approved successfully.`
      })
      setIsStatusUpdating(false)
    }, 1500)
  }
  
  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast("Rejection reason required", {
        description: "Please provide a reason for rejecting this request."
      })
      return
    }
    
    setIsStatusUpdating(true)
    // Simulate API call
    setTimeout(() => {
      toast("Leave request rejected", {
        description: `Leave request ${leaveRequestData.request_id} has been rejected.`
      })
      setIsRejectDialogOpen(false)
      setIsStatusUpdating(false)
    }, 1500)
  }
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Request Details</h1>
          <p className="text-muted-foreground">
            Review and manage leave request {leaveRequestData.request_id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/leave-requests">
              Back to Requests
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle>{leaveRequestData.leave_type.name} Request</CardTitle>
                <CardDescription>
                  Submitted on {new Date(leaveRequestData.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge 
                className={
                  leaveRequestData.status === "Approved" 
                    ? "bg-green-500" 
                    : leaveRequestData.status === "Rejected" 
                      ? "bg-red-500" 
                      : ""
                }
              >
                {leaveRequestData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Date Range</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(leaveRequestData.start_date).toLocaleDateString()} to {new Date(leaveRequestData.end_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{leaveRequestData.days_count} days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Requested By</p>
                    <p className="text-sm text-muted-foreground">
                      {leaveRequestData.user.first_name} {leaveRequestData.user.last_name} ({leaveRequestData.user.employee_id})
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <UserCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Proxy Person</p>
                    <p className="text-sm text-muted-foreground">
                      {leaveRequestData.proxy_person.first_name} {leaveRequestData.proxy_person.last_name}
                    </p>
                  </div>
                </div>
                {leaveRequestData.approver && (
                  <div className="flex items-start gap-2">
                    <UserCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Approved/Rejected By</p>
                      <p className="text-sm text-muted-foreground">
                        {leaveRequestData.approver.first_name} {leaveRequestData.approver.last_name}
                      </p>
                    </div>
                  </div>
                )}
                {leaveRequestData.approved_at && (
                  <div className="flex items-start gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Response Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(leaveRequestData.approved_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Reason</h3>
              <div className="p-3 bg-muted rounded-md text-sm">
                {leaveRequestData.reason}
              </div>
            </div>

            {leaveRequestData.attachments && leaveRequestData.attachments.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Attachments</h3>
                <div className="space-y-2">
                  {leaveRequestData.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{attachment.file_name}</span>
                        <span className="text-xs text-muted-foreground">({formatFileSize(attachment.file_size)})</span>
                      </div>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          {leaveRequestData.status === "Pending" && (
            <CardFooter className="flex justify-end gap-2 border-t pt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsRejectDialogOpen(true)}
                disabled={isStatusUpdating}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={isStatusUpdating}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </CardFooter>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Timeline</CardTitle>
            <CardDescription>History of this leave request</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-px before:h-full before:bg-muted">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                  <FileText className="h-3 w-3 text-primary-foreground" />
                </div>
                <h3 className="font-medium">Request Created</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(leaveRequestData.created_at).toLocaleString()}
                </p>
              </div>
              
              {leaveRequestData.attachments && leaveRequestData.attachments.length > 0 && (
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Paperclip className="h-3 w-3 text-primary" />
                  </div>
                  <h3 className="font-medium">Attachments Added</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(leaveRequestData.attachments[0].uploaded_at).toLocaleString()}
                  </p>
                </div>
              )}
              
              {leaveRequestData.status !== "Pending" && (
                <div className="relative pl-8">
                  <div className={`absolute left-0 top-1 h-6 w-6 rounded-full ${
                    leaveRequestData.status === "Approved" ? "bg-green-500" : "bg-red-500"
                  } flex items-center justify-center`}>
                    {leaveRequestData.status === "Approved" ? (
                      <CheckCircle className="h-3 w-3 text-white" />
                    ) : (
                      <XCircle className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <h3 className="font-medium">Request {leaveRequestData.status}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(leaveRequestData.approved_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    By {leaveRequestData.approver.first_name} {leaveRequestData.approver.last_name}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea 
              placeholder="Rejection reason" 
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
              disabled={isStatusUpdating}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isStatusUpdating}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 