import React from 'react';
import { Eye, Pencil, Trash2, GitBranch } from 'lucide-react';

export default function CompaniesTable({ companies, onView, onEdit, onDelete, onManageBranches }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Company Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">GSTIN</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Website</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {companies.map((company) => (
            <tr key={company.companyId || company.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 text-sm font-medium text-indigo-600">{company.companyName || company.company_name}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{company.email || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{company.phone || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{company.gstin || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{company.website || '-'}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  company.isActive !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {company.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => onManageBranches(company)}
                    title="Manage Branches"
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <GitBranch className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onView(company)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(company)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(company.companyId || company.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
