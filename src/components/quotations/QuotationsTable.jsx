import React from 'react';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';

export default function QuotationsTable({ quotations, onEdit, onDelete, onView, onDownload }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Quotation Number</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Client Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Subject</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Total Days</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Total Amount</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {quotations.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">{quote.quotationNumber}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{quote.clientName}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{quote.subject}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{quote.totalDays} Days</td>
              <td className="px-6 py-4 text-sm font-medium text-emerald-500">
                {quote.totalAmount}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button 
                    onClick={() => onView && onView(quote)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit && onEdit(quote)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDownload && onDownload(quote)}
                    className="text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(quote.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {quotations.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No quotations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
