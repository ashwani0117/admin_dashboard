import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Define access log data type
type AccessLog = {
  id: number;
  userId: string;
  userEmail: string;
  userType: string;
  ipAddress: string;
  loginTime: string;
  logoutTime: string | null;
  status: string;
};

// Mock data
const accessLogs: AccessLog[] = [
  { 
    id: 1, 
    userId: "ADMIN001", 
    userEmail: "admin@iist.edu", 
    userType: "Administrator",
    ipAddress: "192.168.1.101", 
    loginTime: "2023-10-12T09:15:42", 
    logoutTime: "2023-10-12T17:45:30",
    status: "Success" 
  },
  { 
    id: 2, 
    userId: "STAFF002", 
    userEmail: "warden@iist.edu", 
    userType: "Warden",
    ipAddress: "192.168.1.120", 
    loginTime: "2023-10-12T08:45:17", 
    logoutTime: null,
    status: "Active" 
  },
  { 
    id: 3, 
    userId: "STUDENT042", 
    userEmail: "priya.s@student.edu", 
    userType: "Student",
    ipAddress: "192.168.1.156", 
    loginTime: "2023-10-12T07:32:05", 
    logoutTime: null,
    status: "Failed" 
  },
  { 
    id: 4, 
    userId: "STUDENT042", 
    userEmail: "priya.s@student.edu", 
    userType: "Student",
    ipAddress: "192.168.1.156", 
    loginTime: "2023-10-12T07:33:22", 
    logoutTime: "2023-10-12T16:15:10",
    status: "Success" 
  },
];

const UserAccessLogs = () => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleClearLogs = () => {
    setIsAlertDialogOpen(false);
    
    // This would be an actual API call in a real implementation
    toast({
      title: "Logs Cleared",
      description: "Access logs have been successfully cleared.",
    });
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Sr No.",
    },
    {
      accessorKey: "userId",
      header: "User ID",
    },
    {
      accessorKey: "userEmail",
      header: "User Email",
    },
    {
      accessorKey: "userType",
      header: "User Type",
    },
    {
      accessorKey: "ipAddress",
      header: "IP Address",
    },
    {
      accessorKey: "loginTime",
      header: "Login Time",
      cell: ({ row }) => {
        const date = row.getValue("loginTime") as string;
        return formatDateTime(date);
      },
    },
    {
      accessorKey: "logoutTime",
      header: "Logout Time",
      cell: ({ row }) => {
        const date = row.getValue("logoutTime") as string | null;
        return date ? formatDateTime(date) : "--";
      },
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
  ];

  return (
    <div>
      <div className="space-y-1 mb-6">
        <h2 className="page-title">User Access Logs</h2>
        <p className="page-description">Track user login activities</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Access Logs</CardTitle>
              <CardDescription>
                A history of user login activities
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-[180px]"
              />
              <Button 
                variant="destructive" 
                onClick={() => setIsAlertDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Logs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={accessLogs} 
            searchColumn="userEmail" 
            searchPlaceholder="Search by user email..."
          />
        </CardContent>
      </Card>

      {/* Clear Logs Confirmation Dialog */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to clear the logs?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all
              user access logs from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearLogs} className="bg-red-600 hover:bg-red-700">
              Clear Logs
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserAccessLogs;
