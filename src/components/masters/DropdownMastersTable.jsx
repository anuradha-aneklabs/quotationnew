import React, { useState } from 'react';
import Checkbox from '../common/Checkbox';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconTrash from '../../assets/Employee/trash.svg';

export default function DropdownMastersTable({ items, onEdit, onDelete }) {
  const [selectedItems, setSelectedItems] = useState(new Set());

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(items.map(t => t.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id, checked) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  const allSelected = items.length > 0 && selectedItems.size === items.length;

  return (
    <div className="overflow-auto flex-1 scrollbar-hide w-full">
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 w-12">
              <Checkbox checked={allSelected} onChange={handleSelectAll} />
            </th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] whitespace-nowrap">Dropdown Name</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] whitespace-nowrap">Description</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] whitespace-nowrap">Total Option</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] whitespace-nowrap">Created On</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] whitespace-nowrap">Status</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[15px] leading-[140%] text-[#040715] text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isSelected = selectedItems.has(item.id);
            const isActive = item.status !== false;

            return (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3 w-12">
                  <Checkbox 
                    checked={isSelected} 
                    onChange={(checked) => handleSelectItem(item.id, checked)} 
                  />
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {item.dropdownName}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715]">
                  {item.description || '-'}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {item.totalOptions !== undefined ? item.totalOptions : 0}
                </td>
                <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                  {formatDate(item.createdAt)}
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
                      onClick={() => isSelected && onEdit(item)}
                      title="Edit"
                      disabled={!isSelected}
                      className={`p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={iconEdit} alt="Edit" className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => isSelected && onDelete(item.id)}
                      title="Delete"
                      disabled={!isSelected}
                      className={`p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] transition-colors ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    >
                      <img src={iconTrash} alt="Delete" className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan="7" className="px-6 py-8 text-center text-gray-500 font-Inter">
                No dropdowns found. Add a new dropdown to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
