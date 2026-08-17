import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function BranchesTable({ branches, onView, onEdit, onDelete }) {
  return (
    <div className="flex-1 w-full overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Branch Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">City</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">State</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Default</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {branches.map((branch) => (
            <tr key={branch.branchId || branch.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">{branch.branchName || branch.branch_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{branch.city || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{branch.state || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{branch.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{branch.email || '-'}</td>
              <td className="px-6 py-4">
                {branch.isDefault ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                    Default
                  </span>
                ) : (
                  <span className="text-gray-400 text-xs">—</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => onView(branch)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(branch)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(branch.branchId || branch.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {branches.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No branches found for this company.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
