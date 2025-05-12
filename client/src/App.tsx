import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import ChangePassword from "@/pages/ChangePassword";
import AddCourse from "@/pages/courses/AddCourse";
import ManageCourses from "@/pages/courses/ManageCourses";
import AddRoom from "@/pages/rooms/AddRoom";
import ManageRooms from "@/pages/rooms/ManageRooms";
import AddStudent from "@/pages/students/AddStudent";
import ManageStudents from "@/pages/students/ManageStudents";
import TakeAttendance from "@/pages/TakeAttendance";
import RequestLeave from "@/pages/RequestLeave";
import ComplaintBox from "@/pages/ComplaintBox";
import UserAccessLogs from "@/pages/UserAccessLogs";

function Router() {
  const [location] = useLocation();

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/change-password" component={ChangePassword} />
        <Route path="/courses/add" component={AddCourse} />
        <Route path="/courses/manage" component={ManageCourses} />
        <Route path="/rooms/add" component={AddRoom} />
        <Route path="/rooms/manage" component={ManageRooms} />
        <Route path="/students/add" component={AddStudent} />
        <Route path="/students/manage" component={ManageStudents} />
        <Route path="/take-attendance" component={TakeAttendance} />
        <Route path="/request-leave" component={RequestLeave} />
        <Route path="/complaint-box" component={ComplaintBox} />
        <Route path="/user-access-logs" component={UserAccessLogs} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
