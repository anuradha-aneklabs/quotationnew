import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import * as employeeService from '../../../../services/employeeService';
import * as companyService from '../../../../services/companyService';
import * as branchService from '../../../../services/branchService';
import FormInput from '../../../common/FormInput';
import FormSelect from '../../../common/FormSelect';
import FormTextarea from '../../../common/FormTextarea';

export default function ProposalDetailsStep({ formData, handleChange, errors }) {
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await employeeService.fetchEmployees();
        setEmployees(data);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    
    const loadCompanies = async () => {
      try {
        const data = await companyService.fetchCompanies();
        setCompanies(data || []);
      } catch (err) {
        console.error("Failed to fetch companies", err);
      }
    };

    loadEmployees();
    loadCompanies();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      if (!formData.companyId) {
        setBranches([]);
        return;
      }
      try {
        const data = await branchService.fetchBranchesByCompany(formData.companyId);
        setBranches(data || []);
      } catch (err) {
        console.error("Failed to fetch branches", err);
      }
    };
    loadBranches();
  }, [formData.companyId]);

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
        <h2 className="text-lg font-bold text-gray-900 mb-4 border-b-1 border-[#DEDEDE]">2. Proposal Details</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Company Name */}
          <div className="md:col-span-6 lg:col-span-4">
            <FormSelect
              label="Company Name"
              required
              name="companyId"
              value={formData.companyId || ''}
              onChange={(e) => {
                handleChange(e);
                handleChange({ target: { name: 'branchId', value: '' } });
              }}
              error={errors.companyId}
            >
              <option value="">Select Company</option>
              {companies.map(comp => (
                <option key={comp.id || comp.companyId} value={comp.id || comp.companyId}>{comp.company_name || comp.companyName || comp.name}</option>
              ))}
            </FormSelect>
          </div>

          {/* Branch Name */}
          <div className="md:col-span-6 lg:col-span-4">
            <FormSelect
              label="Branch Name"
              required
              name="branchId"
              value={formData.branchId || ''}
              onChange={handleChange}
              disabled={!formData.companyId}
              error={formData.companyId ? errors.branchId : null}
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id || branch.branchId} value={branch.id || branch.branchId}>{branch.branch_name || branch.branchName || branch.name}</option>
              ))}
            </FormSelect>
          </div>

          {/* Subject / Proposal Title */}
          <div className="md:col-span-12 lg:col-span-4">
            <FormInput
              label="Subject / Proposal Title"
              required
              name="proposalTitle"
              value={formData.proposalTitle}
              onChange={handleChange}
              placeholder="Enter title here..."
              error={errors.proposalTitle}
            />
          </div>

          {/* Sector / Domain Name */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Sector / Domain Name"
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              placeholder="Enter sector name here..."
            />
          </div>

          {/* Quotation Number */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Quotation Number"
              required
              name="quotationNumber"
              value={formData.quotationNumber}
              onChange={handleChange}
              disabled
              error={errors.quotationNumber}
            />
          </div>

          {/* Proposal Date */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Proposal Date"
              required
              type="date"
              name="proposalDate"
              value={formData.proposalDate}
              min={today}
              onChange={handleChange}
              error={errors.proposalDate}
            />
          </div>

          {/* Valid Till */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Valid Till"
              required
              type="date"
              name="validTill"
              value={formData.validTill}
              min={formData.proposalDate || today}
              onChange={handleChange}
              error={errors.validTill}
            />
          </div>

          {/* Revision / Version */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormSelect
              label="Revision / Version"
              name="revision"
              value={formData.revision}
              onChange={handleChange}
            >
              <option value="1.0">1.0</option>
              <option value="1.1">1.1</option>
              <option value="2.0">2.0</option>
            </FormSelect>
          </div>

          {/* Prepared By */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormSelect
              label="Prepared By"
              required
              name="preparedBy"
              value={formData.preparedBy}
              onChange={(e) => {
                handleChange(e);
                const selectedEmp = employees.find(emp => String(emp.id) === String(e.target.value));
                if (selectedEmp) {
                  handleChange({ target: { name: 'designation', value: selectedEmp.designation || selectedEmp.role || '' }});
                  handleChange({ target: { name: 'department', value: selectedEmp.department || '' }});
                } else {
                  handleChange({ target: { name: 'designation', value: '' }});
                  handleChange({ target: { name: 'department', value: '' }});
                }
              }}
              error={errors.preparedBy}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </FormSelect>
          </div>

          {/* Designation */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g. developer"
            />
          </div>

          {/* Department */}
          <div className="md:col-span-6 lg:col-span-3">
            <FormInput
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g. Engineering"
            />
          </div>

        </div>

        {/* Project Summary */}
        <div className="mt-4 relative">
          <FormTextarea
            label="Project Summary / Understanding"
            name="projectSummary"
            value={formData.projectSummary}
            onChange={handleChange}
            rows={3}
            maxLength={1000}
            placeholder="using this website user can test their website and according to the result user can start treatment..."
          />
          <div className="absolute -bottom-1 right-1 text-[10px] text-gray-500">
            {formData.projectSummary.length} / 1000
          </div>
        </div>
      </div>

      <div className="mt-6">
        {/* Engagement Type */}
        <div className="mb-3">
          <label className="block text-[14px] font-normal text-black mb-3">
            Engagement Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementTypes.map((type) => (
              <label 
                key={type.id}
                className={`flex items-start p-1 rounded-lg border cursor-pointer transition-colors
                  ${formData.engagementType === type.id 
                    ? 'border-[#1A9F9A] bg-[#1A9F9A]/[0.02]' 
                    : 'border-gray-200 bg-[#FAFAFA] hover:bg-gray-50'}`}
              >
                <div className="flex items-center h-4 mt-1">
                  <input
                    type="radio"
                    name="engagementType"
                    value={type.id}
                    checked={formData.engagementType === type.id}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#1A9F9A] border-gray-300 focus:ring-[#1A9F9A]"
                  />
                </div>
                <div className="ml-3">
                  <span className={`block text-[13px] font-medium ${formData.engagementType === type.id ? 'text-black' : 'text-gray-700'}`}>
                    {type.title}
                  </span>
                  <span className="block text-[10px] text-gray-500 mt-1 leading-snug">{type.desc}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.engagementType && <p className="mt-1.5 text-xs text-red-500">{errors.engagementType}</p>}
        </div>

        {/* Currency */}
        <div>
          <label className="block text-[14px] font-normal text-black mb-2">
            Currency
          </label>
          <div className="p-4 border border-gray-200 rounded-xl bg-white flex flex-col space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Pricing Currency"
                required
                name="pricingCurrency"
                value={formData.pricingCurrency}
                onChange={handleChange}
                error={errors.pricingCurrency}
              >
                <option value="USD - US Dollar ($)">USD - US Dollar ($)</option>
                <option value="INR - Indian Rupee (₹)">INR - Indian Rupee (₹)</option>
                <option value="EUR - Euro (€)">EUR - Euro (€)</option>
                <option value="GBP - British Pound (£)">GBP - British Pound (£)</option>
              </FormSelect>

              <FormInput
                label="Exchange Rate (for reference)"
                name="exchangeRate"
                value={formData.exchangeRate}
                onChange={handleChange}
                placeholder="e.g. 1 USD = 83.0000 INR"
              />
            </div>
            <p className="text-[12px] text-gray-500">
              <span className="font-medium text-black">Note:</span> All internal calculations are in INR. The proposal will be generated in the selected currency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
