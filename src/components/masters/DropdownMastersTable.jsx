import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function DropdownMastersTable({ items, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <th className="px-6 py-4">DROPDOWN NAME</th>
            <th className="px-6 py-4">DESCRIPTION</th>
            <th className="px-6 py-4">TOTAL OPTIONS</th>
            <th className="px-6 py-4">STATUS</th>
            <th className="px-6 py-4">CREATED ON</th>
            <th className="px-6 py-4 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-medium text-indigo-600">{item.dropdownName}</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-700">{item.description || '-'}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700">
                  {item.totalOptions !== undefined ? item.totalOptions : 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.status 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {item.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-700">{formatDate(item.createdAt)}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                No items found. Add a new dropdown value to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
