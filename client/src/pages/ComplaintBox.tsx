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
import { Eye } from "lucide-react";
import { formatDate, getStatusColor } from "@/lib/utils";

// Define complaint data type
type Complaint = {
  id: string;
  name: string;
  class: string;
  contact: string;
  email: string;
  issueDate: string;
  topic: string;
  description: string;
  status: string;
};

// Mock data
const complaints: Complaint[] = [
  { 
    id: "COMP001", 
    name: "Rahul Kumar", 
    class: "B.Tech CSE", 
    contact: "9876543210", 
    email: "rahul.k@example.com", 
    issueDate: "2023-10-07", 
    topic: "Plumbing Issue", 
    description: "Water leakage in the bathroom sink that has been going on for two days. The floor is constantly wet and it's creating a slipping hazard.",
    status: "New" 
  },
  { 
    id: "COMP002", 
    name: "Priya Sharma", 
    class: "B.Tech ECE", 
    contact: "8765432109", 
    email: "priya.s@example.com", 
    issueDate: "2023-10-05", 
    topic: "Electrical Issue", 
    description: "Power socket near the study table is not working properly. It works intermittently which makes it difficult to charge devices.",
    status: "In Progress" 
  },
  { 
    id: "COMP003", 
    name: "Ankit Singh", 
    class: "B.Tech MECH", 
    contact: "7654321098", 
    email: "ankit.s@example.com", 
    issueDate: "2023-10-01", 
    topic: "WiFi Connectivity", 
    description: "Poor WiFi connectivity in room 103. The signal drops frequently making it difficult to attend online classes and complete assignments.",
    status: "Resolved" 
  },
];

const ComplaintBox = () => {
  const [detailsComplaint, setDetailsComplaint] = useState<Complaint | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredComplaints = statusFilter === "all" 
    ? complaints 
    : complaints.filter(complaint => 
        complaint.status.toLowerCase() === statusFilter.toLowerCase()
      );

  const handleViewDetails = (complaint: Complaint) => {
    setDetailsComplaint(complaint);
    setIsDetailsDialogOpen(true);
  };

  const updateComplaintStatus = (complaintId: string, newStatus: string) => {
    // This would be replaced with an actual API call
    console.log(`Updating complaint ${complaintId} to status: ${newStatus}`);
    setIsDetailsDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "class",
      header: "Class",
    },
    {
      accessorKey: "contact",
      header: "Contact",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "issueDate",
      header: "Issue Date",
      cell: ({ row }) => {
        const date = row.getValue("issueDate") as string;
        return formatDate(new Date(date));
      },
    },
    {
      accessorKey: "topic",
      header: "Topic",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={getStatusColor(status)}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const complaint = row.original;
        
        return (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => handleViewDetails(complaint)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="space-y-1 mb-6">
        <h2 className="page-title">Complaint Box</h2>
        <p className="page-description">View and manage student complaints</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>All Complaints</CardTitle>
              <CardDescription>
                Track and resolve student complaints
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredComplaints} 
            searchColumn="name" 
            searchPlaceholder="Search complaints..."
          />
        </CardContent>
      </Card>

      {/* Complaint Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Complaint Details</DialogTitle>
            <DialogDescription>
              Complaint #{detailsComplaint?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Student Name</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Class</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.class}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Contact</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.contact}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.email}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Issue Date</p>
              <p className="text-sm text-gray-700">
                {detailsComplaint?.issueDate ? formatDate(new Date(detailsComplaint.issueDate)) : ""}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(detailsComplaint?.status || "")}>
                  {detailsComplaint?.status}
                </Badge>
                
                {detailsComplaint?.status !== "Resolved" && (
                  <Select
                    onValueChange={(value) => {
                      if (detailsComplaint) {
                        updateComplaintStatus(detailsComplaint.id, value);
                      }
                    }}
                  >
                    <SelectTrigger className="h-7 w-[120px]">
                      <SelectValue placeholder="Update" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium">Topic</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.topic}</p>
            </div>
            
            <div className="md:col-span-2 space-y-1">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-gray-700">{detailsComplaint?.description}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplaintBox;
