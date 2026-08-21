import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function CreateTaxModal({ isOpen, onClose, onSave, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    taxType: '',
    isActive: true,
    taxName: '',
    taxRate: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          taxType: initialData.taxType || '',
          isActive: initialData.status !== false,
          taxName: initialData.taxName || '',
          taxRate: initialData.taxRate || '',
          description: initialData.description || '',
        });
      } else {
        setFormData({
          taxType: '',
          isActive: true,
          taxName: '',
          taxRate: '',
          description: '',
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      taxType: formData.taxType,
      taxName: formData.taxName,
      taxRate: parseFloat(formData.taxRate),
      description: formData.description,
      status: formData.isActive
    });
  };

  const inputClass = "w-full px-4 py-2.5 text-[13px] text-[#040715] placeholder:text-[#8D98A9] bg-[#FAFAFA] border border-[#E9ECEF] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] transition-colors disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[500px] relative flex flex-col h-auto max-h-[95vh] animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E9ECEF] shrink-0">
          <h2 className="text-[16px] font-bold text-[#040715]">
            {initialData ? 'Edit Tax' : 'Create New Tax'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#5F6A80] hover:text-[#040715] transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto">
          <form id="taxForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              
              {/* Tax Name */}
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Tax Name <span className="text-[#E73B3B]">*</span>
                </label>
                <input
                  type="text"
                  name="taxName"
                  value={formData.taxName}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Service Tax"
                  required
                />
              </div>

              {/* Tax Type */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Tax Type <span className="text-[#E73B3B]">*</span>
                </label>
                <input
                  type="text"
                  name="taxType"
                  value={formData.taxType}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. GST"
                  required
                />
              </div>

              {/* Tax Rate */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Tax Rate <span className="text-[#E73B3B]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    name="taxRate"
                    value={formData.taxRate}
                    onChange={handleChange}
                    className={`${inputClass} pr-8`}
                    placeholder="e.g. 18"
                    required
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#46505F] text-[13px]">%</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Description <span className="text-[#8D98A9] font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Add a short note about this tax component..."
                />
              </div>

              {/* Is Active Toggle */}
              <div className="col-span-2 flex items-center gap-3">
                <label htmlFor="taxIsActive" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="taxIsActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-[36px] h-[20px] bg-[#E9ECEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:bg-[#1A9F9A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
                <label htmlFor="taxIsActive" className="text-[13px] font-medium text-[#040715] cursor-pointer select-none">
                  {formData.isActive ? 'Active Tax' : 'Inactive Tax'}
                </label>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-[#E9ECEF] shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-[13px] font-medium text-[#46505F] bg-[#FCFCFB] border border-[#E9ECEF] rounded-[8px] hover:bg-gray-50 focus:outline-none transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="taxForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-2.5 text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[8px] hover:bg-[#14807b] focus:outline-none transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Tax' : 'Create Tax'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
