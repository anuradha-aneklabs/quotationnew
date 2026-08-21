import React from 'react';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconEye from '../../assets/Employee/eye.svg';
import iconTrash from '../../assets/Employee/trash.svg';

export default function BranchesTable({ branches, onView, onEdit, onDelete }) {
  return (
    <div className="flex-1 w-full overflow-auto scrollbar-hide">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-[#E9ECEF]">
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">Branch Name</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">City</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">State</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">Phone</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">Email</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] whitespace-nowrap">Default</th>
            <th className="px-6 py-4 font-Inter font-bold text-[13px] leading-[140%] text-[#040715] text-right whitespace-nowrap">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E9ECEF]">
          {branches.map((branch) => (
            <tr key={branch.branchId || branch.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-3 font-Inter font-medium text-[13px] leading-[31px] text-[#46505F] whitespace-nowrap">{branch.branchName || branch.branch_name}</td>
              <td className="px-6 py-3 font-Inter font-medium text-[13px] leading-[31px] text-[#46505F] whitespace-nowrap">{branch.city || '-'}</td>
              <td className="px-6 py-3 font-Inter font-medium text-[13px] leading-[31px] text-[#46505F] whitespace-nowrap">{branch.state || '-'}</td>
              <td className="px-6 py-3 font-Inter font-medium text-[13px] leading-[31px] text-[#46505F] whitespace-nowrap">{branch.phone || '-'}</td>
              <td className="px-6 py-3 font-Inter font-medium text-[13px] leading-[31px] text-[#46505F] whitespace-nowrap">{branch.email || '-'}</td>
              <td className="px-6 py-3">
                {branch.isDefault || branch.is_default ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium bg-[#E2FFEC] text-[#0DB22B]">
                    Default
                  </span>
                ) : (
                  <span className="text-[#46505F] text-[13px]">-</span>
                )}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => onEdit(branch)}
                    title="Edit"
                    className="p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={iconEdit} alt="Edit" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onView(branch)}
                    title="View"
                    className="p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={iconEye} alt="View" className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(branch.branchId || branch.id)}
                    title="Delete"
                    className="p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img src={iconTrash} alt="Delete" className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {branches.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500 text-[13px]">
                No branches found for this company.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
