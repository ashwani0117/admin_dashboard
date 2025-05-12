import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Header from "./Header";

type LayoutProps = {
  children: React.ReactNode;
};

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/change-password": "Change Password",
  "/courses/add": "Add Course",
  "/courses/manage": "Manage Courses",
  "/rooms/add": "Add Room",
  "/rooms/manage": "Manage Rooms",
  "/students/add": "Add Student",
  "/students/manage": "Manage Students",
  "/take-attendance": "Take Attendance",
  "/request-leave": "Leave Requests",
  "/complaint-box": "Complaint Box",
  "/user-access-logs": "User Access Logs",
};

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Close sidebar on mobile when location changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pageTitle = pageTitles[location] || "Not Found";

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed sidebar for desktop */}
      <Sidebar />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-40 w-64 md:hidden">
            <Sidebar />
          </div>
        </>
      )}
      
      {/* Main content area */}
      <div className="flex-1 md:ml-64 flex flex-col overflow-hidden">
        <Header title={pageTitle} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
