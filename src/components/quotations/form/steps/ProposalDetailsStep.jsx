import React from 'react';
import { Calendar } from 'lucide-react';

export default function ProposalDetailsStep({ formData, handleChange, errors }) {
  const engagementTypes = [
    {
      id: 'Fixed Price',
      title: 'Fixed Price',
      desc: 'Project will be delivered with a fixed scope and timeline.'
    },
    {
      id: 'Time & Material',
      title: 'Time & Material',
      desc: 'Project will be billed based on actual time and resources used.'
    },
    {
      id: 'Dedicated Resource',
      title: 'Dedicated Resource',
      desc: 'Dedicated resources will work exclusively on this project.'
    },
    {
      id: 'Other',
      title: 'Other',
      desc: 'Custom engagement model.'
    }
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">2. Proposal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Subject / Proposal Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Subject / Proposal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="proposalTitle"
              value={formData.proposalTitle}
              onChange={handleChange}
              placeholder="e.g. eye testing website"
              className={`w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors text-sm
                ${errors.proposalTitle ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.proposalTitle && <p className="mt-0.5 text-[10px] text-red-500">{errors.proposalTitle}</p>}
          </div>

          {/* Sector / Domain Name */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Sector / Domain Name</label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              placeholder="e.g. health"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          {/* Quotation Number */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Quotation Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="quotationNumber"
              value={formData.quotationNumber}
              onChange={handleChange}
              disabled
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 focus:outline-none transition-colors text-sm"
            />
            {errors.quotationNumber && <p className="mt-0.5 text-[10px] text-red-500">{errors.quotationNumber}</p>}
          </div>

          {/* Proposal Date */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Proposal Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="proposalDate"
                value={formData.proposalDate}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors text-sm
                  ${errors.proposalDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
            </div>
            {errors.proposalDate && <p className="mt-0.5 text-[10px] text-red-500">{errors.proposalDate}</p>}
          </div>

          {/* Valid Till */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Valid Till <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="validTill"
                value={formData.validTill}
                onChange={handleChange}
                className={`w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors text-sm
                  ${errors.validTill ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
              />
            </div>
            {errors.validTill && <p className="mt-0.5 text-[10px] text-red-500">{errors.validTill}</p>}
          </div>

          {/* Revision / Version */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Revision / Version</label>
            <select
              name="revision"
              value={formData.revision}
              onChange={handleChange}
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors bg-white text-sm"
            >
              <option value="1.0">1.0</option>
              <option value="1.1">1.1</option>
              <option value="2.0">2.0</option>
            </select>
          </div>

          {/* Prepared By */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prepared By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="preparedBy"
              value={formData.preparedBy}
              onChange={handleChange}
              placeholder="e.g. anuradha"
              className={`w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors text-sm
                ${errors.preparedBy ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            />
            {errors.preparedBy && <p className="mt-0.5 text-[10px] text-red-500">{errors.preparedBy}</p>}
          </div>

          {/* Designation */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. developer"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors text-sm"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors text-sm"
            />
          </div>

        </div>

        {/* Project Summary */}
        <div className="mt-4 relative">
          <label className="block text-xs font-medium text-gray-700 mb-1">Project Summary / Understanding</label>
          <textarea
            name="projectSummary"
            value={formData.projectSummary}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            placeholder="using this website user can test their website and according to the result user can start treatment..."
            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors resize-none text-sm"
          />
          <div className="absolute -bottom-5 right-0 text-[10px] text-gray-500">
            {formData.projectSummary.length} / 1000
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
        {/* Engagement Type */}
        <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
          <label className="block text-xs font-medium text-gray-700 mb-3">
            Engagement Type <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            {engagementTypes.map((type) => (
              <label 
                key={type.id}
                className={`flex items-start p-2 rounded-lg border cursor-pointer transition-colors
                  ${formData.engagementType === type.id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex items-center h-4">
                  <input
                    type="radio"
                    name="engagementType"
                    value={type.id}
                    checked={formData.engagementType === type.id}
                    onChange={handleChange}
                    className="w-3.5 h-3.5 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                </div>
                <div className="ml-2.5">
                  <span className={`block text-xs font-medium ${formData.engagementType === type.id ? 'text-purple-900' : 'text-gray-900'}`}>
                    {type.title}
                  </span>
                  <span className="block text-[10px] text-gray-500 mt-0.5">{type.desc}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.engagementType && <p className="mt-1.5 text-[10px] text-red-500">{errors.engagementType}</p>}
        </div>

        {/* Pricing & Currency */}
        <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm flex flex-col space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Pricing Currency <span className="text-red-500">*</span>
            </label>
            <select
              name="pricingCurrency"
              value={formData.pricingCurrency}
              onChange={handleChange}
              className={`w-full px-3 py-1.5 rounded-lg border focus:outline-none focus:ring-2 transition-colors bg-white text-sm
                ${errors.pricingCurrency ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100'}`}
            >
              <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
              <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
              <option value="EUR - Euro (€)">EUR - Euro (€)</option>
              <option value="GBP - British Pound (£)">GBP - British Pound (£)</option>
            </select>
            {errors.pricingCurrency && <p className="mt-0.5 text-[10px] text-red-500">{errors.pricingCurrency}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Exchange Rate (for reference)</label>
            <input
              type="text"
              name="exchangeRate"
              value={formData.exchangeRate}
              onChange={handleChange}
              placeholder="e.g. 1 USD = 83.0000 INR"
              className="w-full px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-colors text-sm"
            />
            <p className="mt-1.5 text-[10px] text-gray-500">Note: All internal calculations are in INR. The proposal will be generated in the selected currency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
