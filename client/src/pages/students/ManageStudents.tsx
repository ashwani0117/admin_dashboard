import { useState } from "react";
import { Link } from "wouter";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  MoreHorizontal, 
  Pencil, 
  Eye,
  Trash
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

// Define student data type
type Student = {
  id: number;
  name: string;
  registrationNo: string;
  contactNo: string;
  roomNo: string;
  stayingFrom: string;
  course: string;
};

// Mock data
const students: Student[] = [
  { 
    id: 1, 
    name: "Rahul Kumar", 
    registrationNo: "CSE2023001", 
    contactNo: "9876543210", 
    roomNo: "101", 
    stayingFrom: "2023-08-10", 
    course: "B.Tech CSE" 
  },
  { 
    id: 2, 
    name: "Priya Sharma", 
    registrationNo: "ECE2023005", 
    contactNo: "9876543211", 
    roomNo: "102", 
    stayingFrom: "2023-08-12", 
    course: "B.Tech ECE" 
  },
  { 
    id: 3, 
    name: "Ankit Singh", 
    registrationNo: "MECH2023007", 
    contactNo: "9876543212", 
    roomNo: "103", 
    stayingFrom: "2023-08-15", 
    course: "B.Tech MECH" 
  },
];

const ManageStudents = () => {
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [detailsStudent, setDetailsStudent] = useState<Student | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (student: Student) => {
    setDetailsStudent(student);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Simulate delete operation
    toast({
      title: "Student Removed",
      description: `Student "${studentToDelete?.name}" has been removed.`,
    });
    setIsDeleteDialogOpen(false);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "S.No",
    },
    {
      accessorKey: "name",
      header: "Student Name",
      cell: ({ row }) => {
        const name = row.getValue("name") as string;
        const course = row.original.course as string;
        
        return (
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-xs text-gray-500">{course}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "registrationNo",
      header: "Registration No",
    },
    {
      accessorKey: "contactNo",
      header: "Contact No",
    },
    {
      accessorKey: "roomNo",
      header: "Room No",
    },
    {
      accessorKey: "stayingFrom",
      header: "Staying From",
      cell: ({ row }) => {
        const date = row.getValue("stayingFrom") as string;
        return formatDate(new Date(date));
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(student)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit", student.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteClick(student)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="page-title">Manage Students</h2>
          <p className="page-description">View and manage all students</p>
        </div>
        <Link href="/students/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Students</CardTitle>
          <CardDescription>
            A list of all students in the hostel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={students} 
            searchColumn="name" 
            searchPlaceholder="Search students..."
          />
        </CardContent>
      </Card>

      {/* Student Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>
              Detailed information about {detailsStudent?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-gray-700">{detailsStudent?.name}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Registration No</p>
              <p className="text-sm text-gray-700">{detailsStudent?.registrationNo}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Course</p>
              <p className="text-sm text-gray-700">{detailsStudent?.course}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Contact No</p>
              <p className="text-sm text-gray-700">{detailsStudent?.contactNo}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Room No</p>
              <p className="text-sm text-gray-700">{detailsStudent?.roomNo}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Staying From</p>
              <p className="text-sm text-gray-700">
                {detailsStudent?.stayingFrom ? formatDate(new Date(detailsStudent.stayingFrom)) : ""}
              </p>
            </div>
            
            <div className="col-span-2 space-y-1">
              <p className="text-sm font-medium">Guardian Information</p>
              <p className="text-sm text-gray-700">Rajesh Kumar (Father), Contact: 9876543200</p>
            </div>
            
            <div className="col-span-2 space-y-1">
              <p className="text-sm font-medium">Permanent Address</p>
              <p className="text-sm text-gray-700">123 Main Street, New Delhi, India 110001</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to remove this student?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently remove the
              student <span className="font-medium">{studentToDelete?.name}</span> and
              their data from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageStudents;
