import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function CompanyModal({ isOpen, onClose, onSave, companyData }) {
  const [formData, setFormData] = useState({
    companyName: '',
    pan: '',
    gstin: '',
    email: '',
    phone: '',
    website: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (companyData) {
        setFormData({
          companyName: companyData.companyName || companyData.company_name || '',
          pan: companyData.pan || '',
          gstin: companyData.gstin || '',
          email: companyData.email || '',
          phone: companyData.phone || '',
          website: companyData.website || '',
          isActive: companyData.isActive !== false,
        });
      } else {
        setFormData({
          companyName: '',
          pan: '',
          gstin: '',
          email: '',
          phone: '',
          website: '',
          isActive: true,
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, companyData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'pan') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'gstin') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company Name is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan)) {
      newErrors.pan = 'PAN must be in format: ABCDE1234F';
    }
    if (formData.gstin && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Enter a valid GSTIN (e.g. 22AAAAA0000A1Z5)';
    }
    if (formData.website && !/^(https?:\/\/)?([\w-]+\.)+[\w]{2,}(\/\S*)?$/.test(formData.website)) {
      newErrors.website = 'Enter a valid website URL';
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
          companyName: formData.companyName.trim(),
          pan: formData.pan.trim() || undefined,
          gstin: formData.gstin.trim() || undefined,
          email: formData.email.trim() || undefined,
          phone: formData.phone.trim() || undefined,
          website: formData.website.trim() || undefined,
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
            {companyData ? 'Edit Company' : 'Add New Company'}
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
        <div className="p-6 overflow-y-auto">
          <form id="companyForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Company Name - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Technologies Pvt. Ltd."
                  disabled={isSubmitting}
                  className={inputClass('companyName')}
                />
                {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@acme.com"
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

              {/* PAN */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">PAN</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  disabled={isSubmitting}
                  className={inputClass('pan')}
                />
                {errors.pan && <p className="mt-1 text-xs text-red-500">{errors.pan}</p>}
              </div>

              {/* GSTIN */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">GSTIN</label>
                <input
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  disabled={isSubmitting}
                  className={inputClass('gstin')}
                />
                {errors.gstin && <p className="mt-1 text-xs text-red-500">{errors.gstin}</p>}
              </div>

              {/* Website - Full Width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">Website</label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.acme.com"
                  disabled={isSubmitting}
                  className={inputClass('website')}
                />
                {errors.website && <p className="mt-1 text-xs text-red-500">{errors.website}</p>}
              </div>

              {/* Is Active Toggle */}
              <div className="md:col-span-2 flex items-center gap-3">
                <div className="relative inline-block">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <label
                    htmlFor="isActive"
                    className="flex cursor-pointer w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-600 transition-colors peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"
                  >
                    <span className="inline-block w-5 h-5 bg-white rounded-full shadow translate-x-0.5 translate-y-0.5 peer-checked:translate-x-[22px] transition-transform duration-200" />
                  </label>
                </div>
                <label htmlFor="isActive" className="text-sm font-medium text-gray-900 cursor-pointer select-none">
                  Active Company
                </label>
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
            form="companyForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              companyData ? 'Update Company' : 'Save Company'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
