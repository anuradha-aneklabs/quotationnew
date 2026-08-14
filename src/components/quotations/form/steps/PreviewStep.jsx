import React from 'react';
import { Edit2, Download, Hexagon } from 'lucide-react';

function numToWords(num) {
  // simplified for mockup
  return "Indian Rupees " + num.toLocaleString() + " Only";
}

export default function PreviewStep({ formData, onSave }) {
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
  const isPercentage = formData.discountType === 'Percentage (%)';
  const discountAmount = isPercentage ? (baseCost * (discountValue / 100)) : discountValue;
  const discountedBase = Math.max(0, baseCost - discountAmount);
  const gstAmount = discountedBase * 0.18;
  const finalAmount = discountedBase + gstAmount;
  
  const avgRate = totalEffort > 0 ? (baseCost / totalEffort) : 0;
  const totalDuration = formData.projectStartDate && formData.projectEndDate 
    ? Math.ceil(Math.abs(new Date(formData.projectEndDate) - new Date(formData.projectStartDate)) / (1000 * 60 * 60 * 24)) 
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
          <button className="flex items-center px-4 py-1.5 border border-gray-200 text-[11px] font-bold rounded-lg text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm">
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
            <p className="font-bold text-gray-900 mb-1">Aneka Labs Pvt. Ltd.</p>
            <p className="text-gray-500 mb-2">Office No. 202, 2nd Floor, Baner Road,<br />Pune - 411045, Maharashtra, India</p>
            <p className="text-gray-500 mb-1"><span className="text-gray-400">PAN:</span> AABCA1234A | <span className="text-gray-400">GSTIN:</span> 27AABCA1234A1Z5</p>
            <p className="text-gray-500"><span className="text-gray-400">Email:</span> info@anekalabs.com | <span className="text-gray-400">Phone:</span> +91 20 1234 5678</p>
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

        {/* 1. Scope of Work */}
        <div className="mb-10">
          <h3 className="text-xs font-bold text-gray-900 mb-4">1. Scope of Work</h3>
          <table className="w-full text-left text-[11px] border border-gray-200">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <th className="py-2.5 px-4 font-bold w-12 text-center border-r border-gray-200">#</th>
                <th className="py-2.5 px-4 font-bold w-1/4 border-r border-gray-200">Module / Feature</th>
                <th className="py-2.5 px-4 font-bold border-r border-gray-200">Description</th>
                <th className="py-2.5 px-4 font-bold text-center w-24 border-r border-gray-200">Total Effort</th>
                <th className="py-2.5 px-4 font-bold text-center w-40">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {formData.modules.map((m, idx) => {
                const effort = m.functionalities.reduce((s, f) => s + (Number(f.effort)||0), 0);
                return (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 px-4 text-center text-gray-500 border-r border-gray-200">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-gray-900 border-r border-gray-200">{m.name}</td>
                    <td className="py-3 px-4 text-gray-500 border-r border-gray-200">{m.description}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900 border-r border-gray-200">{effort} Hrs</td>
                    <td className="py-3 px-4 text-center text-indigo-600 font-medium">{formData.projectStartDate || '01 Aug 2026'} - {formData.projectEndDate || '10 Aug 2026'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={3} className="py-3 px-4 text-right font-bold text-gray-900 border-r border-gray-200">Total Effort</td>
                <td className="py-3 px-4 text-center font-bold text-gray-900 border-r border-gray-200">{totalEffort} Hrs</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 2x2 Grid for Summaries */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          
          {/* 2. Estimation Summary */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-900 mb-4">2. Estimation Summary</h3>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>Total Effort</span>
                <span className="font-bold text-gray-900">{totalEffort} Hrs</span>
              </div>
              <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-100">
                <span>Average Rate</span>
                <span className="font-bold text-gray-900">₹ {avgRate.toLocaleString(undefined, {maximumFractionDigits:0})} / Hr</span>
              </div>
              <div className="flex justify-between font-bold text-indigo-700 bg-indigo-50/50 p-2 rounded -mx-2">
                <span>Total Cost (Excl. GST)</span>
                <span>₹ {baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600 pt-1">
                <span>Total Working Days</span>
                <span className="font-bold text-gray-900">{totalDuration} Days</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Project Duration</span>
                <span className="font-bold text-gray-900">{totalDuration} Days</span>
              </div>
            </div>
          </div>

          {/* 3. Team & Costing Summary */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-900 mb-4">3. Team & Costing Summary</h3>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>Total Team Members</span>
                <span className="font-bold text-gray-900">{uniqueTeamMembers.size || 4}</span>
              </div>
              <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-100">
                <span>Total Labor Cost</span>
                <span className="font-bold text-gray-900">₹ {baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-indigo-700 bg-indigo-50/50 p-2 rounded -mx-2 mt-4">
                <span>Total Project Cost (Excl. GST)</span>
                <span>₹ {baseCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 4. Timeline Overview */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-900 mb-1">4. Timeline Overview</h3>
            <p className="text-[9px] text-gray-400 mb-4">{formData.projectStartDate || '01 Aug 2026'} - {formData.projectEndDate || '10 Aug 2026'}</p>
            
            <div className="relative mt-6 pt-4 border-t border-gray-100">
              <div className="absolute top-0 left-1/2 text-[8px] text-gray-400 -translate-x-1/2 bg-white px-1 -mt-2">Aug 2026</div>
              <div className="absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed border-red-300 -translate-x-1/2 z-0"></div>
              <div className="absolute bottom-[-14px] left-1/2 -translate-x-1/2 bg-red-500 text-white text-[7px] px-1 rounded z-10">Today</div>

              <div className="space-y-3 relative z-10 pb-2">
                {formData.modules.slice(0,2).map((m, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-24 text-[9px] text-gray-600 truncate">{m.name}</div>
                    <div className="flex-1 bg-gray-50 h-1.5 rounded-full relative">
                       {/* Mock progress bar positions */}
                       <div className="absolute h-1.5 bg-indigo-500 rounded-full" style={{ left: `${idx*10}%`, right: `${50 - (idx*20)}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Commercial Summary */}
          <div className="border border-gray-200 rounded-lg p-5">
            <h3 className="text-xs font-bold text-gray-900 mb-4">5. Commercial Summary</h3>
            <div className="space-y-3 text-[11px]">
              <div className="flex justify-between text-gray-600">
                <span>Total Outstanding Pricing (Excl. GST)</span>
                <span className="font-bold text-gray-900">₹ {baseCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST @ 18%</span>
                <span className="font-bold text-gray-900">₹ {gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-500 pb-3 border-b border-gray-100">
                <span>Discount</span>
                <span className="font-bold">- ₹ {discountAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-end pt-1">
                <div>
                  <div className="font-bold text-indigo-700 mb-1">Final Outstanding Amount</div>
                  <div className="text-[8px] text-gray-400 italic">({numToWords(finalAmount)})</div>
                </div>
                <div className="text-xl font-bold text-indigo-700">
                  ₹ {finalAmount.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </div>
              </div>
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
