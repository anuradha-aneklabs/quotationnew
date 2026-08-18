import React, { useState, useEffect, useRef } from 'react';
import { Search, Upload } from 'lucide-react';
import * as clientService from '../../../../services/clientService';
import logoUploadIcon from '../../../../assets/clientInformation/logo icon.svg';
import flagIcon from '../../../../assets/clientInformation/Flag.svg';
export default function ClientInfoStep({ formData, handleChange, errors, setFormData }) {
  const [logoError, setLogoError] = useState('');
  const [clients, setClients] = useState([]);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [clientSearch, setClientSearch] = useState(formData.clientName || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientService.fetchClients();
        setClients(data);
      } catch (err) {
        console.error('Failed to load clients', err);
      }
    };
    loadClients();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsClientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredClients = clients.filter(c => {
    // If user just clicks the dropdown and the search exactly matches the selected client, show all
    if (clientSearch && clientSearch === formData.clientName) return true;
    
    const term = clientSearch.toLowerCase();
    return (c.company_name?.toLowerCase().includes(term) || c.contact_person?.toLowerCase().includes(term));
  });

  const handleClientSelect = (client) => {
    const name = client.company_name;
    setClientSearch(name);
    setIsClientDropdownOpen(false);
    
    // Auto populate other fields mapping from Client API fields to Quotation fields
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: name,
      contactPerson: client.contact_person || prev.contactPerson,
      phone: client.phone || prev.phone,
      email: client.email || prev.email,
      website: client.website || prev.website,
      currency: client.currency || prev.currency,
      gstNumber: client.gst_number || prev.gstNumber,
      panNumber: client.pan_number || prev.panNumber,
      billingAddress: client.address || prev.billingAddress,
      shippingAddress: client.address || prev.shippingAddress,
      pincode: client.pincode || prev.pincode,
      country: client.country || prev.country,
      state: client.state || prev.state,
      city: client.city || prev.city
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setLogoError('');
      const img = new Image();
      img.onload = () => {
        if (img.width <= 512 && img.height <= 512) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => ({ 
              ...prev, 
              logo: reader.result,
              logoName: file.name
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setLogoError(`Image must be 512x512 pixels or smaller (Current: ${img.width}x${img.height})`);
          e.target.value = ''; // clear input
        }
      };
      img.onerror = () => {
        setLogoError('Invalid image file');
        e.target.value = '';
      };
      img.src = URL.createObjectURL(file);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <h2 className="text-lg font-bold border-b-[#DEDEDE] text-[#040715] border-b-[1px] pb-2">1. Client Information</h2>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Logo Upload */}
        <div className="w-full lg:w-[18%] shrink-0 border border-gray-200 rounded-xl p-4">
          <label className="block text-[14px] font-normal text-black mb-3">Logo</label>
          <div className={`relative flex flex-col items-center justify-center p-4 border rounded-xl h-[150px] transition-colors ${logoError ? 'border-red-500 bg-red-50' : 'border-gray-100 bg-[#FAFAFA] hover:bg-gray-50'}`}>
            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleLogoUpload} />
            {formData.logo ? (
              <div className="flex flex-col items-center">
                <img src={formData.logo} alt="Logo preview" className="h-24 w-auto object-contain mb-3" />
                <span className="text-xs text-purple-600 font-medium">Click to change logo</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-14 h-14 rounded-full bg-[#E8F5F4] flex items-center justify-center mb-4">
                  <img src={logoUploadIcon} alt="Upload Logo" className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-[14px] font-medium text-gray-900 mb-1">Upload Image</p>
                <p className="text-[11px] text-gray-500">JPG or PNG Max 2mb • 512 px</p>
              </div>
            )}
          </div>
          {logoError && <p className="mt-1.5 text-xs text-red-500">{logoError}</p>}
        </div>

        {/* Right Column: Grid Fields */}
        <div className="w-full lg:w-[82%]">
          
          {/* Top Row: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5 mb-4.5">
            {/* Client Name (Searchable Dropdown) */}
            <div className="relative" ref={wrapperRef}>
              <label className="block text-[14px] font-normal text-black mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="clientName"
                  value={clientSearch}
                  onChange={(e) => {
                    setClientSearch(e.target.value);
                    setIsClientDropdownOpen(true);
                    handleChange({ target: { name: 'clientName', value: e.target.value } });
                  }}
                  onFocus={() => setIsClientDropdownOpen(true)}
                  placeholder="TechCorp Solutions"
                  className={`w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors
                    ${errors.clientName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-[#00bda5]" />
              </div>

              {isClientDropdownOpen && clients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clients
                    .filter(c => c.company_name.toLowerCase().includes(clientSearch.toLowerCase()))
                    .map((client) => (
                      <div
                        key={client.id}
                        onClick={() => handleClientSelect(client)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                      >
                        <p className="text-sm font-medium text-gray-900">{client.company_name}</p>
                        <p className="text-xs text-gray-500">{client.email}</p>
                      </div>
                    ))}
                  {clients.filter(c => c.company_name.toLowerCase().includes(clientSearch.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No clients found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                className="w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Next Rows: 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3.5">
            {/* Phone */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-2">
                Phone/Mobile <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center bg-[#FAFAFA] w-full px-3 py-2 rounded-lg border  focus-within:ring-2 transition-colors
                ${errors.phone ? 'border-red-500 focus-within:ring-red-200' : 'border-gray-200 focus-within:border-purple-500 focus-within:ring-purple-100'}`}>
                <div className="flex items-center gap-1.5 pr-3 border-r border-gray-300">
                  <img src={flagIcon} alt="IN" className="w-5 h-4 object-cover" />
                  <span className="text-[13px] flex items-center gap-1 text-gray-700 font-medium">+91 <span className="text-gray-300 ml-1">v</span></span>
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full bg-[#FAFAFA] focus:outline-none text-sm pl-3"
                />
              </div>
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rahul@techcorp.in"
                className={`w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors
                  ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="www.techcorp.com"
                className="w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Currency */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-1">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border text-[14px] focus:outline-none focus:ring-2 transition-colors
                  ${errors.currency ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              >
                <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
                <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
              </select>
              {errors.currency && <p className="mt-1 text-xs text-red-500">{errors.currency}</p>}
            </div>

            {/* GST Number */}
            <div>
              <label className="block text-[14px]  font-normal text-black mb-1">GST Number</label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="09AABCT1234Q1Z5"
                className={`w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors uppercase
                  ${errors.gstNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
              {errors.gstNumber && <p className="mt-1 text-xs text-red-500">{errors.gstNumber}</p>}
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-[14px] font-normal text-black mb-1">PAN Number</label>
              <input
                type="text"
                name="panNumber"
                value={formData.panNumber}
                onChange={handleChange}
                placeholder="AABCT1234Q"
                className={`w-full px-3 py-2 bg-[#FAFAFA] rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors uppercase
                  ${errors.panNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
              {errors.panNumber && <p className="mt-1 text-xs text-red-500">{errors.panNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

          {/* Billing Address */}
          <div>
            <label className="block text-[14px] font-normal text-black mb-1">
              Billing Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              rows={2}
              placeholder="Enter billing address"
              className={`w-full px-3 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors resize-none bg-[#FAFAFA]
                ${errors.billingAddress ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.billingAddress && <p className="mt-1 text-xs text-red-500">{errors.billingAddress}</p>}
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[14px] font-normal text-black">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center text-[11px] text-gray-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="isShippingSameAsBilling"
                  checked={formData.isShippingSameAsBilling}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2 h-3.5 w-3.5"
                />
                Same as billing address
              </label>
            </div>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows={2}
              disabled={formData.isShippingSameAsBilling}
              placeholder="Enter shipping address"
              className={`w-full px-3 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors resize-none disabled:text-gray-500 bg-[#FAFAFA]
                ${errors.shippingAddress ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.shippingAddress && <p className="mt-1 text-xs text-red-500">{errors.shippingAddress}</p>}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">

          {/* Pincode */}
          <div>
            <label className="block text-[14px] font-normal text-black mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g. 201301"
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors bg-[#FAFAFA]
                ${errors.pincode ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="block text-[14px] font-normal text-black mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors bg-[#FAFAFA] appearance-none
                ${errors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
            </select>
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-[14px] font-normal text-black mb-2">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors bg-[#FAFAFA] appearance-none"
            >
              <option value="">Select State</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-[14px] font-normal text-black mb-2">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors bg-[#FAFAFA] appearance-none"
            >
              <option value="">Select City</option>
              <option value="Indore">Indore</option>
              <option value="Noida">Noida</option>
            </select>
          </div>

        </div>
      </div>
    </div>
  );
}
