import React from 'react';
import { Edit2, Download, Hexagon, FileText, Calendar, Percent, Tag, IndianRupee } from 'lucide-react';

function numToWords(num) {
  // simplified for mockup
  return "Indian Rupees " + num.toLocaleString() + " Only";
}

export default function PreviewStep({ formData, onSave, onEdit }) {
  // Calculations
  const baseCost = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => {
      return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
    }, 0);
  }, 0);

  const totalEffort = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => fs + (Number(f.effort) || 0), 0);
  }, 0);

  const uniqueTeamMembers = new Set();
  formData.modules.forEach(m => {
    m.functionalities.forEach(f => {
      f.teamAllocations.forEach(tm => {
        if (tm.memberId) uniqueTeamMembers.add(tm.memberId);
      });
    });
  });

  const discountValue = Number(formData.discountValue) || 0;
  const discountType = formData.discountType || 'Percentage (%)';
  const isPercentage = discountType.toLowerCase().includes('percent');
  const discountAmount = isPercentage ? (baseCost * (discountValue / 100)) : discountValue;
  const discountedBase = Math.max(0, baseCost - discountAmount);
  const gstAmount = discountedBase * 0.18;
  const finalAmount = discountedBase + gstAmount;

  const avgRate = totalEffort > 0 ? (baseCost / totalEffort) : 0;
  const totalDuration = formData.projectStartDate && formData.projectEndDate
    ? Math.ceil(Math.abs(new Date(formData.projectEndDate) - new Date(formData.projectStartDate)) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">8. Preview</h2>
          <p className="text-xs text-gray-500">Review your quotation before generating the final proposal.</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onEdit} className="flex items-center px-4 py-1.5 border border-gray-200 text-[11px] font-bold rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
            <Edit2 className="h-3.5 w-3.5 mr-1.5" />
            Edit Quotation
          </button>
          <button className="flex items-center px-4 py-1.5 border border-indigo-200 text-[11px] font-bold rounded-lg text-indigo-700 hover:bg-indigo-50 transition-colors bg-white shadow-sm">
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* A4 Document Wrapper */}
      <div className="bg-white border border-gray-200 shadow-sm mx-auto overflow-hidden text-gray-800" style={{ maxWidth: '1000px', minHeight: '1414px', padding: '40px 50px' }}>

        {/* Document Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center transform rotate-12">
              <Hexagon className="h-8 w-8 text-white -rotate-12" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-gray-900 tracking-tight">Aneka Labs</h1>
              <p className="text-[10px] text-gray-500 font-medium">Building Digital Excellence</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-900 tracking-widest uppercase mb-2">Quotation</h2>
            <p className="text-xs font-bold text-gray-700">{formData.quotationNumber}</p>
            <p className="text-[10px] text-gray-500 mt-1">Date: {formData.proposalDate || '12 Aug 2026'}</p>
            <p className="text-[10px] text-gray-500">Valid Till: {formData.validTill || '14 Aug 2026'}</p>
          </div>
        </div>

        {/* Address Blocks */}
        <div className="flex justify-between items-start mb-8 text-[11px]">
          <div className="w-1/2 pr-8">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">From,</p>
            <p className="font-bold text-gray-900 mb-1">
              {formData.companyDetails?.companyName || 'Aneka Labs Pvt. Ltd.'}
              {formData.companyDetails?.branchName && ` - ${formData.companyDetails.branchName}`}
            </p>
            <p className="text-gray-500 mb-2">
              {formData.companyDetails?.branchAddress1 || 'Office No. 202, 2nd Floor, Baner Road'},<br />
              {formData.companyDetails?.branchCity || 'Pune'} - {formData.companyDetails?.branchPincode || '411045'}, {formData.companyDetails?.branchState || 'Maharashtra'}, {formData.companyDetails?.branchCountry || 'India'}
            </p>
            <p className="text-gray-500 mb-1">
              <span className="text-gray-400">PAN:</span> {formData.companyDetails?.pan || 'N/A'} | <span className="text-gray-400">GSTIN:</span> {formData.companyDetails?.gstin || 'N/A'}
            </p>
            <p className="text-gray-500">
              <span className="text-gray-400">Email:</span> {formData.companyDetails?.email || formData.companyDetails?.branchEmail || 'hello@anekalabs.com'} | <span className="text-gray-400">Website:</span> {formData.companyDetails?.website || 'www.anekalabs.com'}
            </p>
          </div>
          <div className="w-1/2 pl-8">
            <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">To,</p>
            <p className="font-bold text-gray-900 mb-1">{formData.clientName || 'New Company'}</p>
            <p className="text-gray-500 mb-2">{formData.billingAddress || 'vijay nagar'}</p>
            <p className="text-gray-500 mb-1"><span className="text-gray-400">PAN:</span> {formData.panNumber || 'ADHFJ8378E'} | <span className="text-gray-400">GSTIN:</span> {formData.gstNumber || '22ASDFR0986A2Z2'}</p>
            <p className="text-gray-500"><span className="text-gray-400">Email:</span> {formData.email || 'client@example.com'} | <span className="text-gray-400">Phone:</span> {formData.phone || '9876543210'}</p>
          </div>
        </div>

        {/* Subject & Scope */}
        <div className="bg-indigo-50/50 rounded-lg p-5 mb-10 text-[11px]">
          <div className="flex mb-3">
            <span className="font-bold text-indigo-700 w-20 shrink-0">Subject:</span>
            <span className="font-bold text-gray-900">{formData.proposalTitle || 'crm'}</span>
          </div>
          <div className="flex">
            <span className="font-bold text-indigo-700 w-20 shrink-0">Scope:</span>
            <span className="text-gray-700 font-medium">{formData.projectSummary || 'Design, development, testing and deployment as per the agreed scope.'}</span>
          </div>
        </div>

        {/* 1. Scope of Work & Commercial Summary */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 mb-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">1. Scope of Work & Commercial Summary</h3>
          </div>

          {/* Table */}
          <div className="border border-gray-100 rounded-lg overflow-x-auto mb-6">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-700">
                  <th className="py-3.5 px-4 font-bold text-center w-12 border-r border-gray-100 text-xs">#</th>
                  <th className="py-3.5 px-4 font-bold border-r border-gray-100 w-1/4 text-xs">Module / Feature</th>
                  <th className="py-3.5 px-4 font-bold border-r border-gray-100 text-xs">Description</th>
                  <th className="py-3.5 px-4 font-bold text-center border-r border-gray-100 w-32 text-xs">Total Effort</th>
                  <th className="py-3.5 px-4 font-bold text-center w-56 text-xs">Timeline</th>
                </tr>
              </thead>
              <tbody>
                {formData.modules.map((m, idx) => {
                  const effort = m.functionalities.reduce((s, f) => s + (Number(f.effort)||0), 0);
                  return (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-4 px-4 text-center text-gray-600 border-r border-gray-100 text-xs">{idx + 1}</td>
                      <td className="py-4 px-4 font-bold text-gray-900 border-r border-gray-100 text-xs">{m.name}</td>
                      <td className="py-4 px-4 text-gray-600 border-r border-gray-100 text-xs">{m.description}</td>
                      <td className="py-4 px-4 text-center font-bold text-gray-900 border-r border-gray-100 text-xs">{effort} Hrs</td>
                      <td className="py-4 px-4 text-center text-indigo-600 font-medium text-xs">
                        {formData.projectStartDate || '2026-08-01'} - {formData.projectEndDate || '2026-08-31'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50/70 border-t border-gray-100">
                  <td colSpan={3} className="py-3.5 px-4 text-right font-bold text-gray-900 border-r border-gray-100 text-xs">Total Effort</td>
                  <td className="py-3.5 px-4 text-center font-bold text-gray-900 border-r border-gray-100 text-xs">{totalEffort} Hrs</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Commercial Summary Row */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
            
            {/* Base Cost */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 py-2 px-1">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shrink-0">
                  <IndianRupee className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium leading-tight">Total Outstanding Pricing<br/>(Excl. GST)</p>
              </div>
              <p className="text-lg font-bold text-gray-900 pl-[46px]">₹ {baseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            
            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-gray-100 shrink-0 my-2"></div>
            
            {/* GST */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 py-2 px-1">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shrink-0">
                  <Percent className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium">GST @ 18%</p>
              </div>
              <p className="text-lg font-bold text-gray-900 pl-[46px]">₹ {gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px bg-gray-100 shrink-0 my-2"></div>

            {/* Discount */}
            <div className="flex-1 flex flex-col justify-center gap-1.5 py-2 px-1">
              <div className="flex items-center gap-3">
                <div className="bg-red-50 text-red-500 p-2.5 rounded-xl shrink-0">
                  <Tag className="h-4 w-4" />
                </div>
                <p className="text-[11px] text-gray-500 font-medium">Discount</p>
              </div>
              <p className="text-lg font-bold text-red-500 pl-[46px]">- ₹ {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            {/* Final Amount */}
            <div className="flex-[1.2] bg-[#f8f9fe] rounded-xl p-4 flex flex-col justify-center items-center text-center">
              <p className="text-[13px] font-bold text-indigo-600 mb-0.5">Final Outstanding Amount</p>
              <p className="text-2xl font-black text-indigo-700 mb-0.5">
                ₹ {finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-gray-500 italic font-medium">({numToWords(finalAmount)})</p>
            </div>

          </div>
        </div>

        {/* 2. Timeline Overview */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-gray-100 p-6 mb-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900">2. Timeline Overview</h3>
          </div>
          <p className="text-[11px] text-gray-500 mb-10 ml-8">{formData.projectStartDate || '2026-08-01'} - {formData.projectEndDate || '2026-08-31'}</p>
          
          <div className="relative mt-8 pt-6 pb-6">
            <div className="absolute top-0 left-[60%] text-[10px] text-gray-500 -translate-x-1/2 bg-white px-2 -mt-2">Aug 2026</div>
            <div className="absolute top-0 bottom-0 left-[60%] w-px border-l border-dashed border-red-300 -translate-x-1/2 z-0"></div>
            <div className="absolute bottom-0 left-[60%] -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 translate-y-1/2">Today</div>

            <div className="space-y-6 relative z-10 px-4">
              {formData.modules.map((m, idx) => {
                const left = 20 + (idx * 5);
                const right = 20 + ((formData.modules.length - idx) * 5);
                return (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-24 text-[13px] text-gray-700 truncate">{m.name}</div>
                    <div className="flex-1 bg-gray-50/50 h-2 rounded-full relative">
                      <div className="absolute h-2 bg-[#4f46e5] rounded-full shadow-sm" style={{ left: `${left}%`, right: `${right}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gray-50/50 border border-gray-200 rounded-lg p-5 text-[10px] text-gray-600">
          <h3 className="text-xs font-bold text-indigo-700 mb-3">Important Notes</h3>
          <ul className="list-disc pl-4 space-y-2">
            <li>This quotation is valid till {formData.validTill || '14 Aug 2026'}.</li>
            <li>All payments to be made as per agreed payment terms mentioned in the proposal.</li>
            <li>Taxes will be charged as applicable at the time of invoicing.</li>
            <li>Any additional scope of work will be charged extra.</li>
          </ul>
        </div>

      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onSave}
          className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Finish
        </button>
      </div>
    </div>
  );
}
