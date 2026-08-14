import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ActivityChart({ data = [] }) {
  // If data is empty, we can still show an empty chart or some placeholder.
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px] w-full min-w-0 flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-4 shrink-0">Monthly Quotations</h1>
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 0,
              left: -20,
              bottom: 0,
            }}
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
            />
            <Bar 
              dataKey="count" 
              fill="#6366F1" // Indigo-500/600 approx matching design
              radius={[4, 4, 0, 0]} 
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
