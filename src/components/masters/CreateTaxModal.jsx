import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import Button from '../common/Button';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[500px] relative flex flex-col h-auto max-h-[95vh] animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center mx-6 py-4 border-b border-[#E9ECEF] shrink-0">
          <h2 className="text-[18px] font-semibold text-[#040715]">
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
                <FormInput
                  label="Tax Name"
                  required
                  name="taxName"
                  value={formData.taxName}
                  onChange={handleChange}
                  placeholder="e.g. Service Tax"
                />
              </div>

              {/* Tax Type */}
              <div>
                <FormInput
                  label="Tax Type"
                  required
                  name="taxType"
                  value={formData.taxType}
                  onChange={handleChange}
                  placeholder="e.g. GST"
                />
              </div>

              {/* Tax Rate */}
              <div>
                <FormInput
                  label="Tax Rate"
                  required
                  type="number"
                  step="0.01"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  placeholder="e.g. 18"
                  suffix={<span className="text-[#46505F] text-[13px]">%</span>}
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <FormTextarea
                  label={<>Description <span className="text-[#46505F] font-normal">(optional)</span></>}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
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
        <div className="flex justify-between items-center mx-6 py-4 shrink-0">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="taxForm"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Tax' : 'Create Tax'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
