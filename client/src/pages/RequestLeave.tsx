import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn, formatDate, getStatusColor } from "@/lib/utils";

// Define leave request data type
type LeaveRequest = {
  id: number;
  rollNo: string;
  studentName: string;
  stream: string;
  permissionType: string;
  reason: string;
  leaveDate: string;
  returnDate: string;
  placeOfVisit: string;
  contactNo: string;
  status: "Pending" | "Approved" | "Rejected";
};

// Mock data
const leaveRequests: LeaveRequest[] = [
  { 
    id: 1, 
    rollNo: "CSE2023001", 
    studentName: "Rahul Kumar", 
    stream: "B.Tech Computer Science", 
    permissionType: "Home Visit", 
    reason: "Need to visit home for sister's wedding ceremony. Will return after the function is over. All assignments have been submitted in advance.",
    leaveDate: "2023-10-10T09:00", 
    returnDate: "2023-10-15T18:00", 
    placeOfVisit: "Delhi, Home Address",
    contactNo: "9876543210",
    status: "Pending" 
  },
  { 
    id: 2, 
    rollNo: "CS2023042", 
    studentName: "Priya Sharma", 
    stream: "B.Tech Computer Science", 
    permissionType: "Medical", 
    reason: "Need to visit doctor for regular health checkup and medication.",
    leaveDate: "2023-10-05T09:00", 
    returnDate: "2023-10-12T18:00", 
    placeOfVisit: "City Hospital",
    contactNo: "8765432109",
    status: "Approved" 
  },
  { 
    id: 3, 
    rollNo: "MECH2023007", 
    studentName: "Ankit Singh", 
    stream: "B.Tech Mechanical", 
    permissionType: "Event Participation", 
    reason: "Selected to represent college in tech fest at IIT Delhi.",
    leaveDate: "2023-10-08T10:00", 
    returnDate: "2023-10-09T20:00", 
    placeOfVisit: "IIT Delhi",
    contactNo: "7654321098",
    status: "Pending" 
  },
];

const RequestLeave = () => {
  const [detailsRequest, setDetailsRequest] = useState<LeaveRequest | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();

  const filteredRequests = statusFilter === "all" 
    ? leaveRequests 
    : leaveRequests.filter(request => request.status.toLowerCase() === statusFilter.toLowerCase());

  const handleViewDetails = (request: LeaveRequest) => {
    setDetailsRequest(request);
    setIsDetailsDialogOpen(true);
  };

  const handleApprove = (request: LeaveRequest) => {
    toast({
      title: "Leave Request Approved",
      description: `Leave request for ${request.studentName} has been approved.`,
    });
  };

  const handleReject = (request: LeaveRequest) => {
    toast({
      title: "Leave Request Rejected",
      description: `Leave request for ${request.studentName} has been rejected.`,
    });
  };

  const columns = [
    {
      accessorKey: "rollNo",
      header: "Roll No",
    },
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "stream",
      header: "Stream",
    },
    {
      accessorKey: "permissionType",
      header: "Permission Type",
    },
    {
      accessorKey: "leaveDate",
      header: "Leave Date",
      cell: ({ row }) => {
        const date = row.getValue("leaveDate") as string;
        return formatDate(new Date(date));
      },
    },
    {
      accessorKey: "returnDate",
      header: "Return Date",
      cell: ({ row }) => {
        const date = row.getValue("returnDate") as string;
        return formatDate(new Date(date));
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={cn(
            "status-badge",
            getStatusColor(status)
          )}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;
        const isPending = request.status === "Pending";
        
        return (
          <div className="flex space-x-2">
            {isPending && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => handleApprove(request)}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleReject(request)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleViewDetails(request)}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="space-y-1 mb-6">
        <h2 className="page-title">Leave Requests</h2>
        <p className="page-description">Manage student leave requests</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>
                View and manage all leave requests
              </CardDescription>
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredRequests} 
            searchColumn="studentName" 
            searchPlaceholder="Search by student name..."
          />
        </CardContent>
      </Card>

      {/* Leave Request Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              Leave request information for {detailsRequest?.studentName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-sm text-gray-700">{detailsRequest?.studentName}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Roll Number</p>
              <p className="text-sm text-gray-700">{detailsRequest?.rollNo}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Course</p>
              <p className="text-sm text-gray-700">{detailsRequest?.stream}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Contact Number</p>
              <p className="text-sm text-gray-700">{detailsRequest?.contactNo}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Leave From</p>
              <p className="text-sm text-gray-700">
                {detailsRequest?.leaveDate ? formatDate(new Date(detailsRequest.leaveDate)) : ""}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Return On</p>
              <p className="text-sm text-gray-700">
                {detailsRequest?.returnDate ? formatDate(new Date(detailsRequest.returnDate)) : ""}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Permission Type</p>
              <p className="text-sm text-gray-700">{detailsRequest?.permissionType}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge className={cn(
                "status-badge",
                getStatusColor(detailsRequest?.status || "")
              )}>
                {detailsRequest?.status}
              </Badge>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium">Place of Visit</p>
              <p className="text-sm text-gray-700">{detailsRequest?.placeOfVisit}</p>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium">Reason for Leave</p>
              <p className="text-sm text-gray-700">{detailsRequest?.reason}</p>
            </div>
          </div>
          
          <DialogFooter>
            {detailsRequest?.status === "Pending" && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleReject(detailsRequest);
                    setIsDetailsDialogOpen(false);
                  }}
                >
                  Reject
                </Button>
                <Button 
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    handleApprove(detailsRequest);
                    setIsDetailsDialogOpen(false);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RequestLeave;
