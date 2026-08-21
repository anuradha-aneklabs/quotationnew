import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
      <div className="bg-white rounded-[16px] shadow-2xl w-full max-w-[600px] relative flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mx-6 py-4 border-b border-[#E9ECEF]">
          <h2 className="text-[18px] font-semibold text-[#040715]">
            {companyData ? 'Edit Company' : 'Add New Company'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-[#5F6A80] hover:text-[#040715] transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="px-6 py-5 overflow-y-auto">
          <form id="companyForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5">

              {/* Company Name - Full Width */}
              <div className="md:col-span-2">
                <FormInput
                  label="Company Name"
                  required
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Technologies Pvt. Ltd."
                  disabled={isSubmitting}
                  error={errors.companyName}
                />
              </div>

              {/* Email */}
              <div>
                <FormInput
                  label="Email"
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter company email"
                  disabled={isSubmitting}
                  error={errors.email}
                />
              </div>

              {/* Phone */}
              <div>
                <FormInput
                  label="Phone"
                  required
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter 10 digit mobile number"
                  disabled={isSubmitting}
                  error={errors.phone}
                />
              </div>

              {/* PAN */}
              <div>
                <FormInput
                  label="PAN"
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="Enter PAN Number"
                  disabled={isSubmitting}
                  error={errors.pan}
                />
              </div>

              {/* GSTIN */}
              <div>
                <FormInput
                  label="GSTIN"
                  type="text"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  disabled={isSubmitting}
                  error={errors.gstin}
                />
              </div>

              {/* Website - Full Width */}
              <div className="md:col-span-2">
                <FormInput
                  label="Website"
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter company website"
                  disabled={isSubmitting}
                  error={errors.website}
                />
              </div>

              {/* Is Active Toggle */}
              <div className="md:col-span-2 flex items-center gap-3">
                <label htmlFor="isActive" className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="sr-only peer"
                  />
                  <div className="w-[36px] h-[20px] bg-[#E9ECEF] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[16px] peer-checked:bg-[#1A9F9A] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-disabled:opacity-50 peer-disabled:cursor-not-allowed"></div>
                </label>
                <label htmlFor="isActive" className="text-[13px] font-medium text-[#040715] cursor-pointer select-none">
                  {formData.isActive ? 'Active Company' : 'Inactive Company'}
                </label>
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mx-6 py-4">
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
            form="companyForm"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              companyData ? 'Update Company' : 'Save Company'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
