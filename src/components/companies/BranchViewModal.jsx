import React from 'react';
import { X } from 'lucide-react';

export default function BranchViewModal({ isOpen, onClose, branch }) {
  if (!isOpen || !branch) return null;

  const valueClass = "w-full px-4 py-2.5 text-[13px] text-[#040715] bg-[#FAFAFA] border border-[#E9ECEF] rounded-[8px] min-h-[42px] flex items-center";
  const labelClass = "block text-[13px] font-medium text-[#040715] mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[16px] overflow-hidden shadow-2xl w-full max-w-[700px] relative flex flex-col h-auto max-h-[95vh] animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E9ECEF] shrink-0">
          <h2 className="text-[16px] font-bold text-[#040715]">
            View Branch
          </h2>
          <button
            onClick={onClose}
            className="text-[#5F6A80] hover:text-[#040715] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto">
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Branch Name */}
              <div className="md:col-span-2">
                <label className={labelClass}>Branch Name</label>
                <div className={valueClass}>{branch.branchName || branch.branch_name || '-'}</div>
              </div>

              {/* Address Line 1 */}
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <div className={valueClass}>{branch.addressLine1 || branch.address_line1 || '-'}</div>
              </div>

              {/* Address Line 2 */}
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 2</label>
                <div className={valueClass}>{branch.addressLine2 || branch.address_line2 || '-'}</div>
              </div>

              {/* City */}
              <div>
                <label className={labelClass}>City</label>
                <div className={valueClass}>{branch.city || '-'}</div>
              </div>

              {/* State */}
              <div>
                <label className={labelClass}>State</label>
                <div className={valueClass}>{branch.state || '-'}</div>
              </div>

              {/* Country */}
              <div>
                <label className={labelClass}>Country</label>
                <div className={valueClass}>{branch.country || '-'}</div>
              </div>

              {/* Pincode */}
              <div>
                <label className={labelClass}>Pincode</label>
                <div className={valueClass}>{branch.pincode || '-'}</div>
              </div>

              {/* Email */}
              <div>
                <label className={labelClass}>Email</label>
                <div className={valueClass}>{branch.email || '-'}</div>
              </div>

              {/* Phone */}
              <div>
                <label className={labelClass}>Phone</label>
                <div className={valueClass}>{branch.phone || '-'}</div>
              </div>

              {/* Toggles Display (Status & Default) */}
              <div className="md:col-span-2 flex flex-wrap gap-8 mt-2">
                <div className="flex items-center gap-3">
                  <label className="text-[13px] font-medium text-[#040715] mb-0">Status:</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium ${
                    branch.isActive !== false ? 'bg-[#E2FFEC] text-[#0DB22B]' : 'bg-[#FFF3E2] text-[#D57617]'
                  }`}>
                    {branch.isActive !== false ? 'Active Branch' : 'Inactive Branch'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[13px] font-medium text-[#040715] mb-0">Default Branch:</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-xs font-medium ${
                    branch.isDefault ? 'bg-[#E2FFEC] text-[#0DB22B]' : 'bg-[#F3F4F6] text-[#46505F]'
                  }`}>
                    {branch.isDefault ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center px-6 py-4 border-t border-[#E9ECEF] shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-medium text-[#46505F] bg-[#FCFCFB] border border-[#E9ECEF] rounded-[8px] hover:bg-gray-50 focus:outline-none transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
