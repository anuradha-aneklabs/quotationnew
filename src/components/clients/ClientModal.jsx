import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import Button from '../common/Button';

export default function ClientModal({ isOpen, onClose, onSave, clientData }) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    panNumber: '',
    gstNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (clientData) {
        // Map from API snake_case to form camelCase if editing
        setFormData({
          companyName: clientData.company_name || '',
          contactPerson: clientData.contact_person || '',
          email: clientData.email || '',
          phone: clientData.phone || '',
          address: clientData.address || '',
          panNumber: clientData.pan_number || '',
          gstNumber: clientData.gst_number || ''
        });
      } else {
        setFormData({
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
          address: '',
          panNumber: '',
          gstNumber: ''
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, clientData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'panNumber') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
    } else if (name === 'gstNumber') {
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
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact Person Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    if (!formData.panNumber.trim()) {
      newErrors.panNumber = 'PAN Number is required';
    } else if (!/^[A-Z0-9]{10}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'PAN must be exactly 10 capital letters and numbers';
    }
    
    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = 'GST Number is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = 'Enter a valid GST number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        // Map form camelCase to API snake_case payload
        const payload = {
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pan_number: formData.panNumber,
          gst_number: formData.gstNumber,
          currency: 'INR',
          country: 'India',
          state: '',
          city: '',
          status: 'ACTIVE'
        };
        await onSave(payload);
        // onClose is called by parent on success
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto relative flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#040715]">
              {clientData ? 'Edit Client' : 'Add New Client'}
            </h2>
            <button 
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="clientForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company Name */}
              <FormInput
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Acme Corp"
                disabled={isSubmitting}
                error={errors.companyName}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

              {/* Contact Person Name */}
              <FormInput
                label="Contact Person Name"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                disabled={isSubmitting}
                error={errors.contactPerson}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

              {/* Email */}
              <FormInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@acme.com"
                disabled={isSubmitting}
                error={errors.email}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

              {/* Phone */}
              <FormInput
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
                error={errors.phone}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

              {/* Address (Full Width) */}
              <div className="md:col-span-2">
                <FormTextarea
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={3}
                  disabled={isSubmitting}
                  error={errors.address}
                  required
                  labelClassName="block mb-2"
                  className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
                />
              </div>

              {/* PAN Number */}
              <FormInput
                label="PAN Number"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                disabled={isSubmitting}
                error={errors.panNumber}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

              {/* GST Number */}
              <FormInput
                label="GST Number"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                disabled={isSubmitting}
                error={errors.gstNumber}
                required
                labelClassName="block mb-2"
                className="py-2.5 focus:ring-indigo-100 focus:border-indigo-500"
              />

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 py-4 px-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="clientForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              'Save Client'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
