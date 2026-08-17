import React from 'react';
import { X, GitBranch } from 'lucide-react';

function DetailRow({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value || '-'}</p>
    </div>
  );
}

export default function BranchViewModal({ isOpen, onClose, branch }) {
  if (!isOpen || !branch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <GitBranch className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Branch Details</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <DetailRow label="Branch Name" value={branch.branchName || branch.branch_name} />
            </div>
            <div className="md:col-span-2">
              <DetailRow label="Address Line 1" value={branch.addressLine1 || branch.address_line1} />
            </div>
            <div className="md:col-span-2">
              <DetailRow label="Address Line 2" value={branch.addressLine2 || branch.address_line2} />
            </div>
            <DetailRow label="City" value={branch.city} />
            <DetailRow label="State" value={branch.state} />
            <DetailRow label="Country" value={branch.country} />
            <DetailRow label="Pincode" value={branch.pincode} />
            <DetailRow label="Email" value={branch.email} />
            <DetailRow label="Phone" value={branch.phone} />
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Default Branch</p>
              {branch.isDefault ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                  Yes
                </span>
              ) : (
                <span className="text-gray-400 text-sm">No</span>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                branch.isActive !== false
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {branch.isActive !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
