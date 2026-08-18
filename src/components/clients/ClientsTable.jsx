import React from 'react';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconEye from '../../assets/Employee/eye.svg';
import iconTrash from '../../assets/Employee/trash.svg';

export default function ClientsTable({ clients, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-auto flex-1 scrollbar-hide w-full">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Company Name</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Contact Person</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Email</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Phone</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">GST No</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Location</th>
            <th className="px-6 py-4 font-['Inter',sans-serif] font-semibold text-[18px] leading-[140%] text-[#040715] text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.company_name}
              </td>
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.contact_person || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.email || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.phone || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.gst_number || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-semibold text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.location || client.city || '-'}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(client)}
                    className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <img src={iconEdit} alt="Edit" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onView(client)}
                    className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <img src={iconEye} alt="View" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(client.id)}
                    className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <img src={iconTrash} alt="Delete" className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
