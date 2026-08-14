import React, { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, IndianRupee } from 'lucide-react';
import Header from '../components/layout/Header';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
        
        {/* Total Clients */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#f3e8ff] text-[#9333ea] p-2 rounded-lg shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Clients</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{metrics.total_clients || 0}</h3>
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#e0f2fe] text-[#0ea5e9] p-2 rounded-lg shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Employees</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{metrics.total_employees || 0}</h3>
          </div>
        </div>

        {/* Total Quotations */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#dcfce7] text-[#16a34a] p-2 rounded-lg shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Quotations</p>
            <h3 className="text-xl font-black text-gray-900 mt-0.5">{metrics.total_quotations || 0}</h3>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="bg-[#dcfce7] text-[#16a34a] p-2 rounded-lg shrink-0">
            <IndianRupee className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-lg font-black text-gray-900 mt-0.5 leading-tight">{metrics.total_revenue_formatted || '₹0.00'}</h3>
          </div>
        </div>

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
