import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function BranchModal({ isOpen, onClose, onSave, branchData, companyId }) {
  const [formData, setFormData] = useState({
    branchName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    email: '',
    phone: '',
    isDefault: false,
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (branchData) {
        setFormData({
          branchName: branchData.branchName || branchData.branch_name || '',
          addressLine1: branchData.addressLine1 || branchData.address_line1 || '',
          addressLine2: branchData.addressLine2 || branchData.address_line2 || '',
          city: branchData.city || '',
          state: branchData.state || '',
          country: branchData.country || 'India',
          pincode: branchData.pincode || '',
          email: branchData.email || '',
          phone: branchData.phone || '',
          isDefault: branchData.isDefault || branchData.is_default || false,
          isActive: branchData.isActive !== false,
        });
      } else {
        setFormData({
          branchName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          country: 'India',
          pincode: '',
          email: '',
          phone: '',
          isDefault: false,
          isActive: true,
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, branchData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pincode') {
      newValue = value.replace(/\D/g, '').slice(0, 6);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch Name is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          companyId: companyId,
          branchName: formData.branchName.trim(),
          addressLine1: formData.addressLine1.trim() || undefined,
          addressLine2: formData.addressLine2.trim() || undefined,
          city: formData.city.trim() || undefined,
          state: formData.state.trim() || undefined,
          country: formData.country.trim() || undefined,
          pincode: formData.pincode.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          isDefault: formData.isDefault,
          isActive: formData.isActive,
        };
        await onSave(payload);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {branchData ? 'Edit Branch' : 'Add New Branch'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form id="branchForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Branch Name - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="branchName"
                  value={formData.branchName}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai Head Office"
                  disabled={isSubmitting}
                  className={inputClass('branchName')}
                />
                {errors.branchName && <p className="mt-1 text-xs text-red-500">{errors.branchName}</p>}
              </div>

              {/* Address Line 1 - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Street address, Building name"
                  disabled={isSubmitting}
                  className={inputClass('addressLine1')}
                />
              </div>

              {/* Address Line 2 - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Address Line 2</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Area, Landmark"
                  disabled={isSubmitting}
                  className={inputClass('addressLine2')}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai"
                  disabled={isSubmitting}
                  className={inputClass('city')}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Maharashtra"
                  disabled={isSubmitting}
                  className={inputClass('state')}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. India"
                  disabled={isSubmitting}
                  className={inputClass('country')}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  disabled={isSubmitting}
                  className={inputClass('pincode')}
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="branch@company.com"
                  disabled={isSubmitting}
                  className={inputClass('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number"
                  disabled={isSubmitting}
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Toggles Row */}
              <div className="md:col-span-2 flex flex-wrap gap-6">
                {/* Is Default */}
                <div className="flex items-center gap-3">
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="isDefault"
                      className="flex cursor-pointer w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition-colors peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                    >
                      <span className="inline-block w-5 h-5 bg-white rounded-full shadow translate-x-0.5 translate-y-0.5 peer-checked:translate-x-[22px] transition-transform duration-200" />
                    </label>
                  </div>
                  <label htmlFor="isDefault" className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                    Set as Default Branch
                  </label>
                </div>

                {/* Is Active */}
                <div className="flex items-center gap-3">
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      id="branchIsActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="sr-only peer"
                    />
                    <label
                      htmlFor="branchIsActive"
                      className="flex cursor-pointer w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition-colors peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                    >
                      <span className="inline-block w-5 h-5 bg-white rounded-full shadow translate-x-0.5 translate-y-0.5 peer-checked:translate-x-[22px] transition-transform duration-200" />
                    </label>
                  </div>
                  <label htmlFor="branchIsActive" className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                    Active Branch
                  </label>
                </div>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="branchForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              branchData ? 'Update Branch' : 'Save Branch'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
