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
          logo: clientData.logo || '', 
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

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setErrors(prev => ({ ...prev, logo: "Image size must be less than 2MB" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, logo: reader.result }));
        setErrors(prev => ({ ...prev, logo: '' }));
      };
      reader.readAsDataURL(file); // Converts to base64 string
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: '' }));
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
              
              {/* Logo Upload Box */}
              <div className="md:col-span-1 md:row-span-2">
                <label className="block text-[13px] font-medium text-[#040715] mb-1.5">Logo</label>
                <div className="relative flex flex-col items-center justify-center w-full h-[120px] border-2 border-dashed border-[#E9ECEF] rounded-[8px] bg-[#FAFAFA] hover:bg-gray-50 transition-colors group cursor-pointer overflow-hidden">
                  {formData.logo ? (
                    <>
                      <img src={formData.logo} alt="Company Logo" className="w-full h-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); removeLogo(); }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50 text-red-500 z-10"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className="p-2 bg-[#E2FFEC] text-[#1A9F9A] rounded-full mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        </div>
                        <p className="text-[12px] font-medium text-[#040715]">Upload Image</p>
                        <p className="text-[10px] text-[#8D98A9] mt-1">JPG or PNG Max 2MB</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                        onChange={handleLogoUpload} 
                        disabled={isSubmitting}
                      />
                    </label>
                  )}
                </div>
                {errors.logo && <p className="mt-1 text-xs text-red-500">{errors.logo}</p>}
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
