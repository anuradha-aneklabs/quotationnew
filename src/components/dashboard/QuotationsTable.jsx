import React from 'react';

export default function QuotationsTable({ quotations = [] }) {
  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0]; // simple YYYY-MM-DD
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900">Recent Quotations</h2>
        <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600">View All</a>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-xs font-semibold text-black-500 uppercase tracking-wider">Quotation ID</th>
              <th className="px-6 py-3 text-xs font-semibold text-black-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-xs font-semibold text-black-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-xs font-semibold text-black-500 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {quotations.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-600">{row.quotation_number}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{row.client}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row.date)}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.amount_formatted}</td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                  No recent quotations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
