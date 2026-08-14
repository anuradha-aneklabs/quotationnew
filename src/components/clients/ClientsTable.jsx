import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function ClientsTable({ clients, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Person</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">GST</th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">{client.company_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.contact_person}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.phone}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{client.gst_number}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button className="text-gray-400 hover:text-indigo-600 transition-colors">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(client)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(client.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
