import React from 'react';
import { Search, Upload } from 'lucide-react';

export default function ClientInfoStep({ formData, handleChange, errors, setFormData }) {
  const [logoError, setLogoError] = React.useState('');

  const handleLogoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setLogoError('');
      const img = new Image();
      img.onload = () => {
        if (img.width === 512 && img.height === 512) {
          setFormData(prev => ({ ...prev, logo: file }));
        } else {
          setLogoError(`Image must be exactly 512x512 pixels (Current: ${img.width}x${img.height})`);
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
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">1. Client Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Client Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Select Client"
                className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                  ${errors.clientName ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="e.g. Rahul Verma"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone/Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="rahul.verma@technova.com"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="www.technova.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency <span className="text-red-500">*</span>
            </label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors bg-white
                ${errors.currency ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            >
              <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
              <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
              <option value="EUR - Euro (€)">EUR - Euro (€)</option>
              <option value="GBP - British Pound (£)">GBP - British Pound (£)</option>
            </select>
            {errors.currency && <p className="mt-1 text-xs text-red-500">{errors.currency}</p>}
          </div>

          {/* GST Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="09AABCT1234Q1Z5"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors uppercase"
            />
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              placeholder="AABCT1234Q"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors uppercase"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
            <div className={`flex items-center justify-between px-4 py-2.5 border rounded-lg ${logoError ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}>
              <span className="text-sm text-gray-500 flex items-center flex-1 truncate mr-2">
                {formData.logo ? (
                  <span className="text-indigo-600 font-medium truncate">{formData.logo.name}</span>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">No logo uploaded</span>
                  </>
                )}
              </span>
              <label className="px-3 py-1 text-xs font-medium bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer transition-colors whitespace-nowrap">
                Upload Image
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
              </label>
            </div>
            {logoError && <p className="mt-1 text-xs text-red-500">{logoError}</p>}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Billing Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Billing Address <span className="text-red-500">*</span>
            </label>
            <textarea
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              rows={3}
              placeholder="Enter billing address..."
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors resize-none
                ${errors.billingAddress ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.billingAddress && <p className="mt-1 text-xs text-red-500">{errors.billingAddress}</p>}
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Shipping Address <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="isShippingSameAsBilling"
                  checked={formData.isShippingSameAsBilling}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 mr-2"
                />
                Same as billing address
              </label>
            </div>
            <textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              rows={3}
              disabled={formData.isShippingSameAsBilling}
              placeholder="Enter shipping address..."
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors resize-none disabled:bg-gray-50 disabled:text-gray-500
                ${errors.shippingAddress ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.shippingAddress && <p className="mt-1 text-xs text-red-500">{errors.shippingAddress}</p>}
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">

          {/* Pincode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g. 201301"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                ${errors.pincode ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. India"
              className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors
                ${errors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. Uttar Pradesh"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. Noida"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors"
            />
          </div>

        </div>
      </div>
    </div>
  );
}
