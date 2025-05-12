import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Define student data type for attendance
type AttendanceStudent = {
  id: number;
  name: string;
  rollNo: string;
  roomNo: string;
  course: string;
  attendance: "present" | "absent" | null;
};

// Mock data
const students: AttendanceStudent[] = [
  { 
    id: 1, 
    name: "Rahul Kumar", 
    rollNo: "CSE2023001", 
    roomNo: "101", 
    course: "B.Tech CSE",
    attendance: null
  },
  { 
    id: 2, 
    name: "Priya Sharma", 
    rollNo: "CS2023042", 
    roomNo: "201", 
    course: "B.Tech CSE",
    attendance: null
  },
  { 
    id: 3, 
    name: "Ankit Singh", 
    rollNo: "MECH2023007", 
    roomNo: "102", 
    course: "B.Tech MECH",
    attendance: null
  },
  { 
    id: 4, 
    name: "Sneha Verma", 
    rollNo: "EC2023022", 
    roomNo: "201", 
    course: "B.Tech ECE",
    attendance: null
  },
];

const TakeAttendance = () => {
  const [studentsData, setStudentsData] = useState<AttendanceStudent[]>(students);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>("all");
  const { toast } = useToast();

  const filteredStudents = selectedCourse === "all" 
    ? studentsData 
    : studentsData.filter(student => student.course === selectedCourse);

  const presentCount = studentsData.filter(s => s.attendance === "present").length;
  const absentCount = studentsData.filter(s => s.attendance === "absent").length;

  const handleAttendanceChange = (studentId: number, status: "present" | "absent") => {
    setStudentsData(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, attendance: status } 
          : student
      )
    );
  };

  const handleMarkAll = (status: "present" | "absent") => {
    setStudentsData(prev => 
      prev.map(student => ({ ...student, attendance: status }))
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Validate if all students have attendance marked
    const unmarkedStudents = studentsData.filter(s => s.attendance === null);
    if (unmarkedStudents.length > 0) {
      toast({
        title: "Incomplete Attendance",
        description: `${unmarkedStudents.length} students don't have attendance marked.`,
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Attendance Submitted",
        description: `Attendance for ${studentsData.length} students has been recorded.`,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Sr No.",
    },
    {
      accessorKey: "name",
      header: "Student Name",
    },
    {
      accessorKey: "rollNo",
      header: "Student Roll",
    },
    {
      accessorKey: "course",
      header: "Course",
    },
    {
      accessorKey: "roomNo",
      header: "Room No",
    },
    {
      id: "attendance",
      header: "Attendance",
      cell: ({ row }) => {
        const student = row.original;
        
        return (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                student.attendance === "present" && "bg-green-100 text-green-600 border-green-600"
              )}
              onClick={() => handleAttendanceChange(student.id, "present")}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="sr-only">Present</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-full",
                student.attendance === "absent" && "bg-red-100 text-red-600 border-red-600"
              )}
              onClick={() => handleAttendanceChange(student.id, "absent")}
            >
              <XCircle className="h-4 w-4" />
              <span className="sr-only">Absent</span>
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="space-y-1 mb-6">
        <h2 className="page-title">Take Attendance</h2>
        <p className="page-description">Mark attendance for students</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select 
            value={selectedCourse} 
            onValueChange={setSelectedCourse}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="B.Tech CSE">B.Tech Computer Science</SelectItem>
              <SelectItem value="B.Tech ECE">B.Tech Electronics</SelectItem>
              <SelectItem value="B.Tech MECH">B.Tech Mechanical</SelectItem>
              <SelectItem value="B.Tech CIVIL">B.Tech Civil</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            type="date" 
            className="w-[200px]" 
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => handleMarkAll("present")}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark All Present
          </Button>
          <Button 
            variant="outline" 
            className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleMarkAll("absent")}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Mark All Absent
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Student Attendance</CardTitle>
          <CardDescription>
            Date: {new Date().toLocaleDateString()} | 
            Total: {studentsData.length} | 
            Present: {presentCount} | 
            Absent: {absentCount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={filteredStudents} 
            searchColumn="name" 
            searchPlaceholder="Search students..."
          />
        </CardContent>
        <CardFooter className="flex justify-end py-4">
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Attendance"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TakeAttendance;
