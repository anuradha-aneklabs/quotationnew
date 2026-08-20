import React from 'react';
import { Eye, Pencil, Trash2, Download } from 'lucide-react';

export default function QuotationsTable({ quotations, onEdit, onDelete, onView, onDownload }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[1000px]">
        <thead>
          <tr className="border-b border-[#E9ECEF] bg-white">
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715]">Quotation ID</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715]">Client Name</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715]">Subject</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715]">Total Days</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715]">Total Amount</th>
            <th className="px-6 py-4 text-[13px] font-semibold text-[#040715] text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E9ECEF]">
          {quotations.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-[13px] font-medium text-[#040715]">{quote.quotationNumber}</td>
              <td className="px-6 py-4 text-[13px] font-medium text-[#040715]">{quote.clientName}</td>
              <td className="px-6 py-4 text-[13px] font-medium text-[#040715]">{quote.subject}</td>
              <td className="px-6 py-4 text-[13px] font-medium text-[#040715]">{quote.totalDays} Days</td>
              <td className="px-6 py-4 text-[13px] font-medium text-[#040715]">
                {quote.totalAmount}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center space-x-2">
                  <button 
                    onClick={() => onEdit && onEdit(quote)}
                    className="p-1.5 border border-[#E6EBEB] bg-white text-[#1A9F9A] rounded-[6px] hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => onView && onView(quote)}
                    className="p-1.5 border border-[#E6EBEB] bg-white text-[#1A9F9A] rounded-[6px] hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => onDownload && onDownload(quote)}
                    className="p-1.5 border border-[#E6EBEB] bg-white text-[#1A9F9A] rounded-[6px] hover:bg-gray-50 shadow-sm transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={() => onDelete && onDelete(quote.id)}
                    className="p-1.5 border border-[#E6EBEB] bg-white text-[#E53935] rounded-[6px] hover:bg-red-50 shadow-sm transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {quotations.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-[#46505F] text-[13px]">
                No quotations found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
