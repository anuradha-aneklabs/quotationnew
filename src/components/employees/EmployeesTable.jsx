import React, { useState } from 'react';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconEye from '../../assets/Employee/eye.svg';
import iconTrash from '../../assets/Employee/trash.svg';
import Checkbox from '../common/Checkbox';

export default function EmployeesTable({ employees, onView, onEdit, onDelete }) {
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedEmployees(new Set(employees.map(e => e.id)));
    } else {
      setSelectedEmployees(new Set());
    }
  };

  const handleSelectEmployee = (id, checked) => {
    const newSelected = new Set(selectedEmployees);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedEmployees(newSelected);
  };

  const allSelected = employees.length > 0 && selectedEmployees.size === employees.length;
  return (
    <div className="overflow-auto flex-1 scrollbar-hide w-full">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th className="pl-6 py-4 w-12">
              <Checkbox checked={allSelected} onChange={handleSelectAll} />
            </th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">ID</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Name</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Role</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Email</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Phone</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Assign Project</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Hourly Rate</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {employees.length > 0 && (
            <tr>
              <td colSpan="9" className="p-0">
                <div className="mx-3 border-t border-gray-100"></div>
              </td>
            </tr>
          )}
          {employees.map((employee, index, arr) => {
            const isSelected = selectedEmployees.has(employee.id);
            return (
            <React.Fragment key={employee.id}>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="pl-6 py-3">
                  <Checkbox 
                    checked={isSelected} 
                    onChange={(checked) => handleSelectEmployee(employee.id, checked)} 
                  />
                </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {employee.employee_code || `EMP${String(employee.id).padStart(3, '0')}`}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {employee.name}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {employee.role || employee.designation}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {employee.email}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {employee.phone || '-'}
              </td>
              <td className="px-6 py-3 whitespace-nowrap">
                {employee.assigned_project ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-[#E2F3FF] text-[#0E5C9D]">
                    {employee.assigned_project}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                {String(employee.hourly_rate).startsWith('₹') ? employee.hourly_rate : `₹ ${Number(employee.hourly_rate || 0).toFixed(2)}`}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-end space-x-2 min-w-max">
                  <button
                    onClick={() => isSelected && onEdit(employee)}
                    disabled={!isSelected}
                    className={`p-1.5 border border-gray-200 rounded-md transition-colors flex-shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <img src={iconEdit} alt="Edit" className="h-4 w-4 object-contain" />
                  </button>
                  <button
                    onClick={() => isSelected && onView(employee)}
                    disabled={!isSelected}
                    className={`p-1.5 border border-gray-200 rounded-md transition-colors flex-shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <img src={iconEye} alt="View" className="h-4 w-4 object-contain" />
                  </button>
                  <button
                    onClick={() => isSelected && onDelete(employee.id)}
                    disabled={!isSelected}
                    className={`p-1.5 border border-gray-200 rounded-md transition-colors flex-shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <img src={iconTrash} alt="Delete" className="h-4 w-4 object-contain" />
                  </button>
                </div>
              </td>
            </tr>
            {index < arr.length - 1 && (
              <tr>
                <td colSpan="9" className="p-0">
                  <div className="mx-3 border-t border-gray-100"></div>
                </td>
              </tr>
            )}
            </React.Fragment>
            );
          })}
          {employees.length === 0 && (
            <tr>
              <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
