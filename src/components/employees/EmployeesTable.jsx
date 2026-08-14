import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';

export default function EmployeesTable({ employees, onView, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Assigned Project</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider">Hourly Rate</th>
            <th className="px-6 py-4 text-xs font-semibold text-black-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-indigo-600">{employee.name}</span>
                  <span className="text-xs text-gray-400">{employee.employee_code || `ID: ${employee.id}`}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.role || employee.designation}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{employee.phone || '-'}</td>
              <td className="px-6 py-4">
                {employee.assigned_project ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {employee.assigned_project}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {String(employee.hourly_rate).startsWith('₹') ? employee.hourly_rate : `₹${Number(employee.hourly_rate || 0).toFixed(2)}`}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end space-x-3">
                  <button 
                    onClick={() => onView(employee)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onEdit(employee)}
                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(employee.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {employees.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
