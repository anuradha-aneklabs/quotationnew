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
    `w-full px-4 py-2.5 text-[13px] text-[#040715] placeholder:text-[#8D98A9] bg-[#FAFAFA] border rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
      errors[field]
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : 'border-[#E9ECEF]'
    }`;

  return (
    <div className="flex flex-col">
      {/* Form Content */}
      <div className="p-6">
        <form id="branchForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Branch Name - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  Branch Name <span className="text-[#E73B3B]">*</span>
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
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Address Line 1</label>
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
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Address Line 2</label>
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
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  City <span className="text-[#E73B3B]">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  disabled={isSubmitting}
                  className={inputClass('city')}
                />
              </div>

              {/* State */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">
                  State <span className="text-[#E73B3B]">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter State"
                  disabled={isSubmitting}
                  className={inputClass('state')}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  disabled={isSubmitting}
                  className={inputClass('country')}
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter Pincode"
                  disabled={isSubmitting}
                  className={inputClass('pincode')}
                />
                {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  disabled={isSubmitting}
                  className={inputClass('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  disabled={isSubmitting}
                  className={inputClass('phone')}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>
              {/* Toggles Row */}
              <div className="flex items-center gap-3">
                <label htmlFor="branchIsActive" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="branchIsActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-[36px] h-[20px] bg-[#E9ECEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:bg-[#1A9F9A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
                <label htmlFor="branchIsActive" className="text-[13px] font-medium text-[#040715] cursor-pointer select-none">
                  {formData.isActive ? 'Active Branch' : 'Inactive Branch'}
                </label>
              </div>

              <div className="flex items-center gap-3">
                <label htmlFor="isDefault" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-[36px] h-[20px] bg-[#E9ECEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:bg-[#1A9F9A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
                <label htmlFor="isDefault" className="text-[13px] font-medium text-[#040715] cursor-pointer select-none">
                  Set as Default Branch
                </label>
              </div>

            </div>
          </form>
        </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 py-4 border-t border-[#E9ECEF]">
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
          form="branchForm"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-2.5 text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[8px] hover:bg-[#14807b] focus:outline-none transition-colors disabled:opacity-50"
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
  );
}
