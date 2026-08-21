import React, { useState } from 'react';
import Checkbox from '../common/Checkbox';
import hierarchyIcon from '../../assets/Masters/hierarchy.svg';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconEye from '../../assets/Employee/eye.svg';
import iconTrash from '../../assets/Employee/trash.svg';

export default function CompaniesTable({ companies, onView, onEdit, onDelete, onManageBranches }) {
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedCompanies(new Set(companies.map(c => c.companyId || c.id)));
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const handleSelectCompany = (id, checked) => {
    const newSelected = new Set(selectedCompanies);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedCompanies(newSelected);
  };

  const allSelected = companies.length > 0 && selectedCompanies.size === companies.length;

  return (
    <div className="overflow-auto flex-1 scrollbar-hide w-full">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-gray-100">
            <th className="pl-6 py-4">
              <Checkbox checked={allSelected} onChange={handleSelectAll} />
            </th>
            <th className="pr-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Company Name</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Email</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Phone</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">GSTIN</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Website</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] whitespace-nowrap">Status</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[18px] leading-[140%] text-[#040715] text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {companies.map((company) => {
            const id = company.companyId || company.id;
            const isSelected = selectedCompanies.has(id);
            const isActive = company.isActive !== false;

            return (
              <tr key={id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3">
                  <Checkbox 
                    checked={isSelected} 
                    onChange={(checked) => handleSelectCompany(id, checked)} 
                  />
                </td>
                <td className="pr-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {company.companyName || company.company_name}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {company.email || '-'}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {company.phone || '-'}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {company.gstin || '-'}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[16px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {company.website || '-'}
                </td>
                <td className="px-6 py-3">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium"
                    style={{
                      backgroundColor: isActive ? '#E2FFEC' : '#FFF3E2',
                      color: isActive ? '#0DB22B' : '#D57617'
                    }}
                  >
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => isSelected && onManageBranches(company)}
                      title="Manage Branches"
                      disabled={!isSelected}
                      className={`p-2 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors flex items-center justify-center shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={hierarchyIcon} alt="Hierarchy" className="h-4 w-4 md:h-5 md:w-5 shrink-0 object-contain" />
                    </button>
                    <button
                      onClick={() => isSelected && onEdit(company)}
                      title="Edit"
                      disabled={!isSelected}
                      className={`p-2 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors flex items-center justify-center shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={iconEdit} alt="Edit" className="h-4 w-4 md:h-5 md:w-5 shrink-0 object-contain" />
                    </button>
                    <button
                      onClick={() => isSelected && onView(company)}
                      title="View"
                      disabled={!isSelected}
                      className={`p-2 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors flex items-center justify-center shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={iconEye} alt="View" className="h-4 w-4 md:h-5 md:w-5 shrink-0 object-contain" />
                    </button>
                    <button
                      onClick={() => isSelected && onDelete(id)}
                      title="Delete"
                      disabled={!isSelected}
                      className={`p-2 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors flex items-center justify-center shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={iconTrash} alt="Delete" className="h-4 w-4 md:h-5 md:w-5 shrink-0 object-contain" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {companies.length === 0 && (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                No companies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
