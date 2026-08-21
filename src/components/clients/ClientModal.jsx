import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import FormTextarea from '../common/FormTextarea';
import Button from '../common/Button';
import logoIcon from '../../assets/clientInformation/logo icon.svg';

export default function ClientModal({ isOpen, onClose, onSave, clientData }) {
  const [formData, setFormData] = useState({
    logo: null,
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
          logo: null, // Depending on API, you might have clientData.logo_url
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
          logo: null,
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, logo: 'Image size must be less than 2MB' }));
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, logo: 'Only JPG and PNG are allowed' }));
      } else {
        setFormData(prev => ({ ...prev, logo: file }));
        setErrors(prev => ({ ...prev, logo: '' }));
      }
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
        // Note: For file uploads, FormData might be needed if API expects multipart/form-data.
        // Assuming onSave handles it or we send logo if required.
        const payload = {
          logo: formData.logo,
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Logo Upload */}
              <div className="md:row-span-2 flex flex-col">
                <label className="block text-[14px] font-medium text-gray-700 mb-2">Logo</label>
                <div className={`flex-1 border ${errors.logo ? 'border-red-500' : 'border-[#E9ECEF]'} rounded-[12px] flex flex-col items-center justify-center p-4 bg-[#FAFAFA] hover:bg-gray-50 transition-colors cursor-pointer relative min-h-[160px]`}>
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleLogoChange}
                    disabled={isSubmitting}
                  />
                  {formData.logo ? (
                     <img src={URL.createObjectURL(formData.logo)} alt="Logo Preview" className="w-16 h-16 object-contain mb-2" />
                  ) : (
                     <>
                       <div className="w-12 h-12 rounded-full bg-[#E6F5F5] flex items-center justify-center mb-3">
                         <img src={logoIcon} alt="Upload" className="w-6 h-6 object-contain" />
                       </div>
                       <span className="text-[#040715] font-medium text-[13px] mb-1 text-center">Upload Image</span>
                       <span className="text-[#5F6A80] text-[11px] text-center leading-[14px]">JPG or PNG Max<br/>2mb • 512 px</span>
                     </>
                  )}
                </div>
                {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
              </div>

              {/* Company Name */}
              <FormInput
                label={<>Company Name <span className="text-[#F1511B]">*</span></>}
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company Name"
                disabled={isSubmitting}
                error={errors.companyName}
              />

              {/* Contact Person Name */}
              <FormInput
                label={<>Contact Person Name <span className="text-[#F1511B]">*</span></>}
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Enter contact person name"
                disabled={isSubmitting}
                error={errors.contactPerson}
              />

              {/* Email */}
              <FormInput
                type="email"
                label={<>Email <span className="text-[#F1511B]">*</span></>}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                disabled={isSubmitting}
                error={errors.email}
              />

              {/* Phone */}
              <FormInput
                label={<>Phone <span className="text-[#F1511B]">*</span></>}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={isSubmitting}
                error={errors.phone}
              />
            </div>

            {/* Address (Full Width) */}
            <div>
              <FormTextarea
                label={<>Address <span className="text-[#F1511B]">*</span></>}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter company address"
                rows={3}
                disabled={isSubmitting}
                error={errors.address}
              />
            </div>

            {/* PAN & GST */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* PAN Number */}
              <FormInput
                label={<>PAN Number <span className="text-[#F1511B]">*</span></>}
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="Enter PAN number"
                disabled={isSubmitting}
                error={errors.panNumber}
              />

              {/* GST Number */}
              <FormInput
                label={<>GST Number <span className="text-[#F1511B]">*</span></>}
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="Enter GST number"
                disabled={isSubmitting}
                error={errors.gstNumber}
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
