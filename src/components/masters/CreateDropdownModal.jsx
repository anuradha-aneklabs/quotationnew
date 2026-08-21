import React, { useState, useEffect } from 'react';
import { X, GripVertical, Plus, Loader2 } from 'lucide-react';
import iconTrash from '../../assets/Employee/trash.svg';

export default function CreateDropdownModal({ isOpen, onClose, onSave, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    options: ['', '', '']
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.dropdownName || '',
          description: initialData.description || '',
          isActive: initialData.status !== false,
          options: initialData.options && initialData.options.length > 0
            ? initialData.options.map(opt => opt.optionLabel) 
            : ['', '', '']
        });
      } else {
        setFormData({
          name: '',
          description: '',
          isActive: true,
          options: ['', '', '']
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

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedOptions = formData.options.map((opt, index) => ({
      optionLabel: opt,
      optionValue: opt,
      displayOrder: index
    }));

    onSave({
      dropdownName: formData.name,
      description: formData.description,
      status: formData.isActive,
      options: formattedOptions
    });
  };

  const inputClass = "w-full px-4 py-2.5 text-[13px] text-[#040715] placeholder:text-[#8D98A9] bg-[#FAFAFA] border border-[#E9ECEF] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] transition-colors disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[500px] relative flex flex-col h-auto max-h-[95vh] animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#E9ECEF] shrink-0">
          <h2 className="text-[16px] font-bold text-[#040715]">
            {initialData ? 'Edit Dropdown' : 'Create New Dropdown'}
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
          <form id="dropdownForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-x-5 gap-y-5">
              
              {/* Dropdown Name */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Dropdown Name <span className="text-[#E73B3B]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="e.g. Priority"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Description <span className="text-[#8D98A9] font-normal">(optional)</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Add a short note about this dropdown..."
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[13px] font-medium text-[#040715]">
                    Options <span className="text-[#E73B3B]">*</span>
                  </label>
                  <span className="text-[11px] text-[#8D98A9]">Drag handles to reorder</span>
                </div>
                <p className="text-[11px] text-[#8D98A9] mb-3">Add the options that will appear in this dropdown.</p>
                
                <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                  {formData.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <button type="button" className="text-[#8D98A9] hover:text-[#46505F] cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className={inputClass}
                        placeholder={`Option ${idx + 1}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeOption(idx)}
                        disabled={formData.options.length <= 1}
                        className="p-1.5 bg-white shadow-[0px_1px_4px_rgba(0,0,0,0.1)] rounded-[6px] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                      >
                        <img src={iconTrash} alt="Delete Option" className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addOption}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-[#1A9F9A] text-[#1A9F9A] rounded-[8px] hover:bg-[#1A9F9A]/5 text-[13px] font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add More Option
                </button>
              </div>

              {/* Is Active Toggle */}
              <div className="flex items-center gap-3 mt-2">
                <label htmlFor="dropdownIsActive" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="dropdownIsActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-[36px] h-[20px] bg-[#E9ECEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:bg-[#1A9F9A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
                <label htmlFor="dropdownIsActive" className="text-[13px] font-medium text-[#040715] cursor-pointer select-none">
                  {formData.isActive ? 'Active Dropdown' : 'Inactive Dropdown'}
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
            form="dropdownForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-6 py-2.5 text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[8px] hover:bg-[#14807b] focus:outline-none transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              initialData ? 'Update Dropdown' : 'Create Dropdown'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
