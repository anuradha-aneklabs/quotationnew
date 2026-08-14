import React from 'react';
import { X } from 'lucide-react';

export default function ClientViewModal({ isOpen, onClose, client }) {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Client Details
          </h2>
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
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Company Name</p>
              <p className="text-base font-semibold text-gray-900">{client.company_name || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Contact Person</p>
              <p className="text-base font-semibold text-gray-900">{client.contact_person || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-base font-semibold text-gray-900">{client.email || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Phone</p>
              <p className="text-base font-semibold text-gray-900">{client.phone || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
              <p className="text-base font-semibold text-gray-900">{client.address || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">PAN Number</p>
              <p className="text-base font-semibold text-gray-900">{client.pan_number || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">GST Number</p>
              <p className="text-base font-semibold text-gray-900">{client.gst_number || '-'}</p>
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
