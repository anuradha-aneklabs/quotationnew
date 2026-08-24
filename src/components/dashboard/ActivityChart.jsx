import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ActivityChart({ data = [] }) {
  const chartData = data.map((item, index) => {
    const prevItem = index > 0 ? data[index - 1] : null;
    return {
      month: item.month,
      thisMonth: item.thisMonth !== undefined ? item.thisMonth : (item.count || 0),
      lastMonth: item.lastMonth !== undefined ? item.lastMonth : (item.last_month_count !== undefined ? item.last_month_count : (prevItem ? prevItem.count || 0 : 0)),
    };
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-h-[400px] w-full min-w-0 flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h1 className="text-xl font-bold text-[#0D1933]">Monthly Quotations</h1>
        <div className="flex items-center gap-4 text-[12px] font-medium text-gray-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A9F9A]"></div>
            <span>This Month</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#AEDCDB]"></div>
            <span>Last Month</span>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 w-full relative">
        <div className="absolute inset-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
                tickFormatter={(value) => value.toString().padStart(2, '0')}
              />
              <Bar 
                dataKey="thisMonth" 
                fill="#1A9F9A" 
                barSize={12}
              />
              <Bar 
                dataKey="lastMonth" 
                fill="#AEDCDB" 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
