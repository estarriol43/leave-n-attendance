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
import { Textarea } from "@/components/ui/textarea"
import { Check, Eye, MoreHorizontal, X } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"

// 定義 LeaveRequest 型別
interface LeaveType {
  id: number
  name: string
}

interface ProxyUser {
  id: number
  first_name: string
  last_name: string
}

interface LeaveRequest {
  id: number
  request_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  days_count: number
  reason: string
  status: string
  proxy_person: ProxyUser
  approver?: ProxyUser | null
  approved_at?: string | null
  created_at: string
  rejection_reason?: string | null
  user?: ProxyUser
}

interface PaginationMeta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

interface LeaveRequestListResponse {
  leave_requests: LeaveRequest[]
  pagination: PaginationMeta
}

// 定義 Props 型別
interface LeaveRequestsTableProps {
  type: "my-requests" | "pending-approval" | "team-requests"
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function LeaveRequestsTable({ type }: LeaveRequestsTableProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  })

  useEffect(() => {
    fetchLeaveRequests()
  }, [type, pagination.page])

  const fetchLeaveRequests = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let endpoint = '';
      
      switch (type) {
        case 'my-requests':
          endpoint = `/leave-requests?page=${pagination.page}&per_page=${pagination.per_page}`;
          break;
        case 'pending-approval':
          endpoint = `/leave-requests/pending?page=${pagination.page}&per_page=${pagination.per_page}`;
          break;
        case 'team-requests':
          endpoint = `/leave-requests/team?page=${pagination.page}&per_page=${pagination.per_page}`;
          break;
      }
      
      const response = await api.get<LeaveRequestListResponse>(endpoint);
      
      setLeaveRequests(response.data.leave_requests);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
      setError('Failed to fetch leave requests. Please try again later.');
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsViewDialogOpen(true)
  }

  const handleApprove = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsApproveDialogOpen(true)
  }

  const handleReject = (request: LeaveRequest) => {
    setSelectedRequest(request)
    setIsRejectDialogOpen(true)
  }

  const confirmApprove = async () => {
    if (!selectedRequest) return
    
    try {
      await api.post(
        `/api/leave-requests/${selectedRequest.id}/approve`,
        {}
      );
      
      toast.success("Request approved", {
        description: `Leave request ${selectedRequest.request_id} has been approved.`,
      });
      
      fetchLeaveRequests(); // Refresh the data
    } catch (err) {
      console.error('Error approving leave request:', err);
      toast.error('Failed to approve leave request');
    }
    
    setIsApproveDialogOpen(false);
  }

  const confirmReject = async () => {
    if (!selectedRequest) return
    if (!rejectReason) {
      toast.error("Rejection reason required", {
        description: "Please provide a reason for rejecting this request.",
      })
      return
    }

    try {
      await api.post(
        `/api/leave-requests/${selectedRequest.id}/reject`,
        { rejection_reason: rejectReason }
      );
      
      toast.success("Request rejected", {
        description: `Leave request ${selectedRequest.request_id} has been rejected.`,
      });
      
      fetchLeaveRequests(); // Refresh the data
    } catch (err) {
      console.error('Error rejecting leave request:', err);
      toast.error('Failed to reject leave request');
    }
    
    setIsRejectDialogOpen(false);
    setRejectReason("");
  }

  // Format the proxy person's name
  const formatName = (person: ProxyUser | null | undefined) => {
    if (!person) return '-';
    return `${person.first_name} ${person.last_name}`;
  };

  if (loading && leaveRequests.length === 0) {
    return <div className="text-center py-4">Loading leave requests...</div>;
  }
  
  if (error && leaveRequests.length === 0) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            {(type === "pending-approval" || type === "team-requests") && <TableHead>Employee</TableHead>}
            <TableHead>Type</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Proxy Person</TableHead>
            {type !== "pending-approval" && <TableHead>Approver</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={type === "pending-approval" ? 7 : 8} className="text-center">
                No leave requests found
              </TableCell>
            </TableRow>
          ) : (
            leaveRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.request_id}</TableCell>
                {(type === "pending-approval" || type === "team-requests") && (
                  <TableCell>{request.user ? formatName(request.user) : "You"}</TableCell>
                )}
                <TableCell>{request.leave_type.name}</TableCell>
                <TableCell>
                  {request.start_date} to {request.end_date}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      request.status.toLowerCase() === "approved"
                        ? "default"
                        : request.status.toLowerCase() === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatName(request.proxy_person)}</TableCell>
                {type !== "pending-approval" && <TableCell>{formatName(request.approver)}</TableCell>}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(request)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {type === "pending-approval" && request.status.toLowerCase() === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => handleApprove(request)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(request)}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {pagination.total_pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setPagination({...pagination, page: Math.max(1, pagination.page - 1)})}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span>
            Page {pagination.page} of {pagination.total_pages}
          </span>
          <Button 
            variant="outline" 
            onClick={() => setPagination({...pagination, page: Math.min(pagination.total_pages, pagination.page + 1)})}
            disabled={pagination.page >= pagination.total_pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* View Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>Detailed information about the leave request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Request ID:</div>
                <div className="col-span-2">{selectedRequest.request_id}</div>
              </div>
              {selectedRequest.user && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Employee:</div>
                  <div className="col-span-2">{formatName(selectedRequest.user)}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Leave Type:</div>
                <div className="col-span-2">{selectedRequest.leave_type.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Period:</div>
                <div className="col-span-2">
                  {selectedRequest.start_date} to {selectedRequest.end_date}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Days Count:</div>
                <div className="col-span-2">{selectedRequest.days_count}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Reason:</div>
                <div className="col-span-2">{selectedRequest.reason}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">
                  <Badge
                    variant={
                      selectedRequest.status.toLowerCase() === "approved"
                        ? "default"
                        : selectedRequest.status.toLowerCase() === "rejected"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Proxy Person:</div>
                <div className="col-span-2">{formatName(selectedRequest.proxy_person)}</div>
              </div>
              {selectedRequest.approver && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Approver:</div>
                  <div className="col-span-2">{formatName(selectedRequest.approver)}</div>
                </div>
              )}
              {selectedRequest.rejection_reason && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Rejection Reason:</div>
                  <div className="col-span-2">{selectedRequest.rejection_reason}</div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Created At:</div>
                <div className="col-span-2">{new Date(selectedRequest.created_at).toLocaleString()}</div>
              </div>
              {selectedRequest.approved_at && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Approved At:</div>
                  <div className="col-span-2">{new Date(selectedRequest.approved_at).toLocaleString()}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Request Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>Are you sure you want to approve this leave request?</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Request ID:</div>
                <div className="col-span-2">{selectedRequest.request_id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Employee:</div>
                <div className="col-span-2">{selectedRequest.user ? formatName(selectedRequest.user) : "You"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Leave Type:</div>
                <div className="col-span-2">{selectedRequest.leave_type.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Period:</div>
                <div className="col-span-2">
                  {selectedRequest.start_date} to {selectedRequest.end_date}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Days Count:</div>
                <div className="col-span-2">{selectedRequest.days_count}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmApprove}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Request Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this leave request.</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Request ID:</div>
                <div className="col-span-2">{selectedRequest.request_id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Employee:</div>
                <div className="col-span-2">{selectedRequest.user ? formatName(selectedRequest.user) : "You"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Leave Type:</div>
                <div className="col-span-2">{selectedRequest.leave_type.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Period:</div>
                <div className="col-span-2">
                  {selectedRequest.start_date} to {selectedRequest.end_date}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="font-medium">Rejection Reason:</div>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this request"
                  className="resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
