import DashboardStats from "@/components/dashboard/DashboardStats";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import ActivityList from "@/components/dashboard/ActivityList";
import QuickActions from "@/components/dashboard/QuickActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="page-title">Dashboard</h2>
        <p className="page-description">Overview of your hostel management system</p>
      </div>
      
      {/* Statistics */}
      <DashboardStats />
      
      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OccupancyChart />
        <ActivityList />
      </div>
      
      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
};

export default Dashboard;
