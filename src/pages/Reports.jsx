import React, { useState, useEffect } from 'react';
import { 
  Download, FileDown, Users, Briefcase, FileText, 
  IndianRupee, Calendar, ArrowUp, ChevronLeft, ChevronRight, User
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

import { fetchDashboardReport, exportReport } from '../services/reportService';
import SearchBar from '../components/common/SearchBar';
import DateRangeFilter from '../components/common/DateRangeFilter';
import clientIcon from '../assets/report/total client.svg';
import employeeIcon from '../assets/report/total employee.svg';
import quotationIcon from '../assets/report/total quotation.svg';
import revenueIcon from '../assets/report/total revenue.svg';
import exportExcelIcon from '../assets/report/export excel.svg';
import exportPdfIcon from '../assets/report/export pdf.svg';
const formatCurrency = (amountStr) => {
  if (!amountStr) return '₹ 0.00';
  const numStr = String(amountStr).replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  if (isNaN(num)) return amountStr;
  return '₹ ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function Reports({ setCurrentView }) {
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
  const [searchTerm, setSearchTerm] = useState('');
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
      
      // Override colors for specific clients in the pie chart
      if (data && data.topClientsPie) {
        data.topClientsPie = data.topClientsPie.map(client => {
          if (client.name === 'Global Solutions') {
            return { ...client, color: '#1A9F9A' };
          }
          if (client.name === 'Innovatech LLC') {
            return { ...client, color: '#DFC21B' };
          }
          return client;
        });
      }
      
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
    <div className="flex flex-col min-h-full lg:h-full py-2">
      
      {/* Search and Filters */}
      <div className="mb-3 shrink-0">
        <SearchBar 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search Report..."
        >
          <DateRangeFilter 
            dateFrom={dateFrom} 
            dateTo={dateTo} 
            onDateFromChange={setDateFrom} 
            onDateToChange={setDateTo} 
          />
          <button 
            onClick={() => handleExport('excel')}
            disabled={isExportingExcel || isLoading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mx-1">
            {isExportingExcel ? (
              <span className="w-4 h-4 mr-1.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></span>
            ) : (
              <img src={exportExcelIcon} alt="Export Excel" className="h-4 w-4 mr-1.5" />
            )}
            Export Excel
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExportingPdf || isLoading}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#1A9F9A] rounded-md shadow-sm hover:bg-teal-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed ml-1">
            {isExportingPdf ? (
              <span className="w-4 h-4 mr-1.5 border-2 border-teal-600 border-t-white rounded-full animate-spin"></span>
            ) : (
              <img src={exportPdfIcon} alt="Export PDF" className="h-4 w-4 mr-1.5" />
            )}
            Export PDF
          </button>
        </SearchBar>
      </div>

      {/* Scrollable Main Area for Responsive Height */}
      <div className="flex-1 flex flex-col gap-3 min-h-0">
        
        {/* Row 1: 4 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0">
          
          {/* Total Clients */}
          <div onClick={() => setCurrentView && setCurrentView('Clients')} className="cursor-pointer hover:bg-gray-50 transition-colors bg-white p-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='bg-[#F6E2FF] p-3 rounded-xl'>
              <img src={clientIcon} alt="Total Client" className="shrink-0" />
              </div>
              <div>
                <p className="text-[18px] font-medium text-[#5F6A80]">Total Client</p>
                <h3 className="text-xl font-bold text-gray-800">{reportData?.overview?.total_clients || 0}</h3>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>

          {/* Total Employees */}
          <div onClick={() => setCurrentView && setCurrentView('Employees')} className="cursor-pointer hover:bg-gray-50 transition-colors bg-white p-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='bg-[#FFEEE2] p-3 rounded-xl'>
              <img src={employeeIcon} alt="Total Employee" className="shrink-0" />
              </div>
              <div>
                <p className="text-[18px] font-medium text-[#5F6A80]">Total Employee</p>
                <h3 className="text-xl font-bold text-gray-800">{reportData?.overview?.total_employees || 0}</h3>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>

          {/* Total Quotations */}
          <div onClick={() => setCurrentView && setCurrentView('Quotations')} className="cursor-pointer hover:bg-gray-50 transition-colors bg-white p-3 py-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='bg-[#E2F2FF] p-3 rounded-xl'>
              <img src={quotationIcon} alt="Total Quotations" className=" shrink-0" />
              </div>
              <div>
                <p className="text-[18px] font-medium text-[#5F6A80] ">Total Quotations</p>
                <h3 className="text-xl font-bold text-gray-800">{reportData?.overview?.total_quotations || 0}</h3>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>

          {/* Total Revenue */}
          <div className="bg-white p-4 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className='bg-[#E2FFEC] p-3 rounded-xl'>
              <img src={revenueIcon} alt="Total Revenue" className=" shrink-0" />
              </div>
              <div>
                <p className="text-[18px] font-medium text-[#5F6A80] ">Total Revenue</p>
                <h3 className="text-xl font-bold text-gray-800">{formatCurrency(reportData?.overview?.total_revenue_formatted || '0')}</h3>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-300" />
          </div>

        </div>

        {/* Row 2: 3 Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-none lg:flex-1 lg:min-h-[200px]">
          
          {/* Quotations Created Area Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col min-h-[250px] lg:min-h-0">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900 text-[15px]">Quotations Created</h3>
            </div>
            <div className="flex-1 min-h-0 -ml-4 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={reportData?.quotationsTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorQts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A9F9A" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1A9F9A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#5F6A80' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#5F6A80' }} tickFormatter={(val) => val < 10 ? `0${val}` : val} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  />
                  <Area type="linear" dataKey="value" stroke="#1A9F9A" strokeWidth={2} fillOpacity={1} fill="url(#colorQts)" dot={{ r: 3, fill: '#1A9F9A', stroke: '#1A9F9A', strokeWidth: 1 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trend Area Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col min-h-[250px] lg:min-h-0">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-gray-900 text-[15px]">Revenue Trend</h3>
            </div>
            <div className="flex-1 min-h-0 -ml-2 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={reportData?.revenueTrend || []} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={20}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#5F6A80' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 13, fill: '#5F6A80' }} 
                    tickFormatter={(val) => val < 10 ? `0${val}` : val}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                    formatter={(val) => `₹${val.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#1A9F9A" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Clients Donut Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col min-h-[250px] lg:min-h-0">
            <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-[15px]">Top 5 Clients by Revenue</h3>
            </div>
            
            <div className="flex-1 flex items-center justify-between min-h-0 relative">
              <div className="w-1/2 h-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData?.topClientsPie || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={75}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      stroke="none"
                    >
                      {(reportData?.topClientsPie || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(val) => `₹${val.toLocaleString()}`}
                      contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '14px', textColor: "#5F6A80" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-[#5F6A80]">
                    {reportData?.overview?.total_revenue >= 100000 
                      ? `₹${(reportData.overview.total_revenue/100000).toFixed(1)}L` 
                      : formatCurrency(reportData?.overview?.total_revenue_formatted || '0')}
                  </span>
                  <span className="text-[13px] text-[#5F6A80] font-medium mt-0.5">Total</span>
                </div>
              </div>

              {/* Legend */}
              <div className="w-1/2 flex flex-col justify-center gap-3 pl-2">
                {(reportData?.topClientsPie || []).map((client, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: client.color }} />
                      <span className="text-[12px] font-medium text-[#5F6A80] truncate w-28" title={client.name}>{client.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] font-bold text-gray-800">₹ {client.value >= 100000 ? (client.value/100000).toFixed(1) + 'L' : client.value}</div>
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
            <div className="p-4 border-b border-[#E6EBEB] flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-[15px]">Recent Quotations</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">View All <span className="text-[10px]">&rarr;</span></button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E6EBEB] text-[16px] font-bold text-[#040715] bg-[#ECF2F2]">
                    <th className="px-4 py-3 font-semibold">Quotation No</th>
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="">
                  {(reportData?.recentQuotations || []).slice(0,4).map((q, i, arr) => (
                    <React.Fragment key={i}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold text-gray-800">{q.id}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] text-gray-600 font-medium">{q.client}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] font-semibold text-gray-800 text-right">{formatCurrency(q.amount)}</td>
                      </tr>
                      {i < arr.length - 1 && (
                        <tr>
                          <td colSpan="3" className="p-0">
                            <div className="mx-4 border-t border-gray-200"></div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Clients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-[15px]">Top Clients</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">View All <span className="text-[10px]">&rarr;</span></button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[16px] font-bold text-[#040715] bg-[#ECF2F2]">
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold text-center">Quotation</th>
                    <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="">
                  {(reportData?.topClientsTable || []).slice(0,4).map((c, i, arr) => (
                    <React.Fragment key={i}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] font-bold text-gray-800">{c.client}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] text-gray-600 font-medium text-center">{c.quotations}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-[13px] font-semibold text-gray-800 text-right">{formatCurrency(c.revenue)}</td>
                      </tr>
                      {i < arr.length - 1 && (
                        <tr>
                          <td colSpan="3" className="p-0">
                            <div className="mx-4 border-t border-gray-200"></div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="font-bold text-gray-900 text-[15px]">Employee Performance</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">View All <span className="text-[10px]">&rarr;</span></button>
            </div>
            <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[16px] font-bold text-[#040715] bg-[#ECF2F2]">
                    <th className="px-4 py-3 font-semibold">Employee</th>
                    <th className="px-4 py-3 font-semibold text-center">Quotation</th>
                    <th className="px-4 py-3 font-semibold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="">
                  {(reportData?.employeesTable || []).slice(0,4).map((e, i, arr) => (
                    <React.Fragment key={i}>
                      <tr className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img src={e.avatar} alt={e.name} className="w-7 h-7 rounded-full bg-gray-100 object-cover" />
                            <div>
                              <div className="text-[13px] font-bold text-gray-800 leading-tight">{e.name}</div>
                              <div className="text-[11px] text-gray-500 font-medium mt-0.5">{e.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-[13px] text-gray-600 font-medium text-center">{e.quotations}</td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-[13px] font-semibold text-gray-800 text-right">{formatCurrency(e.revenue)}</td>
                      </tr>
                      {i < arr.length - 1 && (
                        <tr>
                          <td colSpan="3" className="p-0">
                            <div className="mx-4 border-t border-gray-200"></div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
