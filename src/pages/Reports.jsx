import React, { useState, useEffect } from 'react';
import { 
  Download, FileDown, Users, Briefcase, FileText, 
  IndianRupee, Calendar, ArrowUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import { fetchDashboardReport, exportReport } from '../services/reportService';

export default function Reports() {
  const getInitialDates = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    const formatDate = (date) => {
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return [date.getFullYear(), month, day].join('-');
    };
    
    return { start: formatDate(firstDay), end: formatDate(lastDay) };
  };

  const initialDates = getInitialDates();
  const [dateFrom, setDateFrom] = useState(initialDates.start);
  const [dateTo, setDateTo] = useState(initialDates.end);
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  useEffect(() => {
    loadData();
  }, [dateFrom, dateTo]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDashboardReport({ startDate: dateFrom, endDate: dateTo });
      setReportData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      if (format === 'excel') setIsExportingExcel(true);
      if (format === 'pdf') setIsExportingPdf(true);
      await exportReport(format, { startDate: dateFrom, endDate: dateTo });
    } catch (error) {
      console.error('Error exporting file:', error);
    } finally {
      setIsExportingExcel(false);
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full lg:h-full bg-[#f8fafc] -m-6 p-4">
      
      {/* Header */}
      <div className="flex justify-between items-start shrink-0 mb-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Comprehensive overview of your quotation performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleExport('excel')}
            disabled={isExportingExcel || isLoading}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isExportingExcel ? (
              <span className="w-3.5 h-3.5 mr-1.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
            ) : (
              <Download className="h-3.5 w-3.5 mr-1.5" />
            )}
            Export Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExportingPdf || isLoading}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white bg-[#5B2FE8] rounded-md shadow-sm hover:bg-[#4B24CC] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isExportingPdf ? (
              <span className="w-3.5 h-3.5 mr-1.5 border-2 border-[#4B24CC] border-t-white rounded-full animate-spin"></span>
            ) : (
              <FileDown className="h-3.5 w-3.5 mr-1.5" />
            )}
            Export PDF
          </button>
        </div>
      </div>

      {/* Date Filter */}
      <div className="flex items-center mb-3 shrink-0">
        <div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm">
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm text-gray-700 outline-none w-28 bg-transparent"
            />
            <span className="text-gray-400 text-sm">-</span>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm text-gray-700 outline-none w-28 bg-transparent"
            />
            <Calendar className="h-3 w-3 text-gray-400 ml-1" />
          </div>
        </div>
      </div>

      {/* Scrollable Main Area for Responsive Height */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        
        {/* Row 1: 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          
          {/* Total Clients */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-[#f3e8ff] text-[#9333ea] p-2 rounded-lg shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Clients</p>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">{reportData?.overview?.total_clients || 0}</h3>
            </div>
          </div>

          {/* Total Employees */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-[#e0f2fe] text-[#0ea5e9] p-2 rounded-lg shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Employees</p>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">{reportData?.overview?.total_employees || 0}</h3>
            </div>
          </div>

          {/* Total Quotations */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-[#dcfce7] text-[#16a34a] p-2 rounded-lg shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Quotations</p>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">{reportData?.overview?.total_quotations || 0}</h3>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <div className="bg-[#dcfce7] text-[#16a34a] p-2 rounded-lg shrink-0">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
              <h3 className="text-lg font-black text-gray-900 mt-0.5 leading-tight">{reportData?.overview?.total_revenue_formatted || '₹0.00'}</h3>
            </div>
          </div>

        </div>

        {/* Row 2: 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-none lg:flex-1 lg:min-h-[200px]">
          
          {/* Quotations Created Area Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col min-h-[250px] lg:min-h-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Quotations Created</h3>
                <p className="text-[10px] text-gray-500">Trend of quotations created over time</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 -ml-4 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData?.quotationsTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#colorQts)" dot={{ r: 3, fill: '#fff', stroke: '#8B5CF6', strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend Area Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col min-h-[250px] lg:min-h-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Revenue Trend</h3>
                <p className="text-[10px] text-gray-500">Revenue generated over time</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 -ml-2 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData?.revenueTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8' }} 
                    tickFormatter={(val) => `₹${val/100000}L`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" dot={{ r: 3, fill: '#fff', stroke: '#10B981', strokeWidth: 1.5 }} activeDot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Clients Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 flex flex-col min-h-[250px] lg:min-h-0">
            <h3 className="font-bold text-gray-900 text-sm">Top 5 Clients by Revenue</h3>
            <p className="text-[10px] text-gray-500 mb-2">Revenue contribution by clients</p>
            
            <div className="flex-1 flex items-center justify-between min-h-0 relative">
              <div className="w-1/2 h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData?.topClientsPie || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={55}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {(reportData?.topClientsPie || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => `₹${val.toLocaleString()}`}
                      contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-black text-gray-900">
                    {reportData?.overview?.total_revenue >= 100000 
                      ? `₹${(reportData.overview.total_revenue/100000).toFixed(1)}L` 
                      : reportData?.overview?.total_revenue_formatted || '₹0'}
                  </span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-1/2 flex flex-col justify-center gap-1.5 pl-1">
                {(reportData?.topClientsPie || []).map((client, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: client.color }} />
                      <span className="text-[9px] font-semibold text-gray-700 truncate w-14" title={client.name}>{client.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] font-bold text-gray-900">₹{client.value >= 100000 ? (client.value/100000).toFixed(1) + 'L' : client.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: 3 Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-none lg:flex-1 lg:min-h-[200px] pb-2">
          
          {/* Recent Quotations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-sm">Recent Quotations</h3>
              <button className="text-xs font-semibold text-[#5B2FE8] hover:text-[#4B24CC]">View All</button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                    <th className="px-3 py-2 font-semibold">QUOTATION NO.</th>
                    <th className="px-3 py-2 font-semibold">CLIENT</th>
                    <th className="px-3 py-2 font-semibold text-right">AMOUNT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(reportData?.recentQuotations || []).slice(0,5).map((q, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">{q.id}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 font-medium">{q.client}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-gray-900 text-right">{q.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-sm">Top Clients</h3>
              <button className="text-xs font-semibold text-[#5B2FE8] hover:text-[#4B24CC]">View All</button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                    <th className="px-3 py-2 font-semibold">CLIENT</th>
                    <th className="px-3 py-2 font-semibold text-center">QUOTATIONS</th>
                    <th className="px-3 py-2 font-semibold text-right">REVENUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(reportData?.topClientsTable || []).slice(0,5).map((c, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-bold text-gray-900">{c.client}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600 font-medium text-center">{c.quotations}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs font-semibold text-gray-900 text-right">{c.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-sm">Employee Performance</h3>
              <button className="text-xs font-semibold text-[#5B2FE8] hover:text-[#4B24CC]">View All</button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                    <th className="px-3 py-2 font-semibold">EMPLOYEE</th>
                    <th className="px-3 py-2 font-semibold text-center">QUOTS</th>
                    <th className="px-3 py-2 font-semibold text-right">REVENUE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(reportData?.employeesTable || []).slice(0,5).map((e, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img src={e.avatar} alt={e.name} className="w-5 h-5 rounded-full bg-gray-100" />
                          <div>
                            <div className="text-xs font-bold text-gray-900 leading-tight">{e.name}</div>
                            <div className="text-[9px] text-gray-500 font-medium">{e.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs text-gray-600 font-medium text-center">{e.quotations}</td>
                      <td className="px-3 py-1.5 whitespace-nowrap text-xs font-semibold text-gray-900 text-right">{e.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
