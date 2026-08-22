import React, { useState } from 'react';
import iconEdit from '../../assets/Employee/edit-2.svg';
import iconEye from '../../assets/Employee/eye.svg';
import iconTrash from '../../assets/Employee/trash.svg';
import Checkbox from '../common/Checkbox';

export default function ClientsTable({ clients, onView, onEdit, onDelete }) {
  const [selectedClients, setSelectedClients] = useState(new Set());

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedClients(new Set(clients.map(c => c.id)));
    } else {
      setSelectedClients(new Set());
    }
  };

  const handleSelectClient = (id, checked) => {
    const newSelected = new Set(selectedClients);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedClients(newSelected);
  };

  const allSelected = clients.length > 0 && selectedClients.size === clients.length;
  return (
    <div className="overflow-auto flex-1 scrollbar-hide w-full">
      <table className="w-full min-w-[800px] text-left border-collapse">
        <thead className="sticky top-0 bg-white z-10">
          <tr>
            <th className="pl-6 py-4 w-12">
              <Checkbox checked={allSelected} onChange={handleSelectAll} />
            </th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">Company Name</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">Contact Person</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">Email</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">Phone</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">GST No</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] whitespace-nowrap">Location</th>
            <th className="px-6 py-4 font-Inter font-semibold text-[16px] leading-[140%] text-[#040715] text-right whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="">
          {clients.length > 0 && (
            <tr>
              <td colSpan="8" className="p-0">
                <div className="mx-3 border-t border-gray-100"></div>
              </td>
            </tr>
          )}
          {clients.map((client, index, arr) => {
            const isSelected = selectedClients.has(client.id);
            return (
            <React.Fragment key={client.id}>
            <tr className="hover:bg-gray-50/50 transition-colors">
              <td className="pl-6 py-3">
                <Checkbox 
                  checked={isSelected} 
                  onChange={(checked) => handleSelectClient(client.id, checked)} 
                />
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-15 h-10 border border-gray-200 rounded-[10px] shadow-sm flex items-center justify-center bg-white p-1 overflow-hidden shrink-0">
                    {client.logo ? (
                      <img src={client.logo} alt={client.company_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-500 font-bold text-xs uppercase text-center leading-tight">
                        {client.company_name?.substring(0, 2)}
                      </span>
                    )}
                  </div>
                  <span>{client.company_name}</span>
                </div>
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.contact_person || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.email || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.phone || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.gst_number || '-'}
              </td>
              <td className="px-6 py-3 font-Inter font-medium text-[14px] leading-[31px] text-[#040715] whitespace-nowrap">
                {client.address || '-'}
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center justify-end space-x-2 min-w-max">
                  <button
                    onClick={() => isSelected && onEdit(client)}
                    disabled={!isSelected}
                    className={`p-1.5 border border-gray-200 rounded-md transition-colors flex-shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <img src={iconEdit} alt="Edit" className="h-4 w-4 object-contain" />
                  </button>
                  <button
                    onClick={() => isSelected && onView(client)}
                    disabled={!isSelected}
                    className={`p-1.5 border border-gray-200 rounded-md transition-colors flex-shrink-0 ${isSelected ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                  >
                    <img src={iconEye} alt="View" className="h-4 w-4 object-contain" />
                  </button>
                  <button
                    onClick={() => isSelected && onDelete(client.id)}
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
                <td colSpan="8" className="p-0">
                  <div className="mx-3 border-t border-gray-100"></div>
                </td>
              </tr>
            )}
            </React.Fragment>
            );
          })}
          {clients.length === 0 && (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                No clients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
