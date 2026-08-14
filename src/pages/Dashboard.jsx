import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle2, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import ActivityChart from '../components/dashboard/ActivityChart';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuotationsTable from '../components/dashboard/QuotationsTable';
import { fetchDashboardData } from '../services/dashboardService';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 flex items-center justify-center min-h-[50vh]">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-100">
          Error: {error}
        </div>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};

  return (
    <div className="space-y-4">
      <Header title="Dashboard" />
      <p className="text-gray-600 text-medium -mt-5">Welcome back! Here's an overview of your quotation metrics.</p>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={FileText} 
          iconBgColor="bg-indigo-50" 
          iconColor="text-indigo-600" 
          value={metrics.total_quotations || 0} 
          label="Total Quotations" 
        />
        <StatCard 
          icon={Clock} 
          iconBgColor="bg-amber-50" 
          iconColor="text-amber-500" 
          value={metrics.draft_quotations || 0} 
          label="Draft Quotations" 
        />
        <StatCard 
          icon={CheckCircle2} 
          iconBgColor="bg-emerald-50" 
          iconColor="text-emerald-500" 
          value={metrics.approved_quotations || 0} 
          label="Approved Quotations" 
        />
        <StatCard 
          icon={Users} 
          iconBgColor="bg-blue-50" 
          iconColor="text-blue-500" 
          value={metrics.total_clients || 0} 
          label="Total Clients" 
        />
      </div>

      {/* Middle Section: Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 min-w-0">
          <ActivityChart data={dashboardData?.monthly_quotations || []} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity activities={dashboardData?.recent_activity || []} />
        </div>
      </div>

      {/* Bottom Section: Table */}
      <div>
        <QuotationsTable quotations={dashboardData?.recent_quotations || []} />
      </div>
    </div>
  );
}
