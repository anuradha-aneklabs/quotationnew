import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

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
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
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

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="clientForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Acme Corp"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.companyName ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
              </div>

              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="e.g. John Doe"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.contactPerson ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@acme.com"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Address (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  rows={3}
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              {/* PAN Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.panNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.panNumber && <p className="mt-1 text-xs text-red-500">{errors.panNumber}</p>}
              </div>

              {/* GST Number */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  GST Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.gstNumber ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.gstNumber && <p className="mt-1 text-xs text-red-500">{errors.gstNumber}</p>}
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
            form="clientForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-[#1A9F9A] rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              'Save Client'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
