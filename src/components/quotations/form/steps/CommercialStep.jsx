import React from 'react';
import { Clock, Calendar } from 'lucide-react';
import ModulesIcon from '../../../../assets/Commercial/ModulesIcon.svg';

export default function CommercialStep({ formData, handleChange }) {
  // Calculate Base Cost from modules
  const baseCost = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => {
      return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
    }, 0);
  }, 0);

  // Calculate Discount
  const discountValue = Number(formData.discountValue) || 0;
  const discountType = formData.discountType || 'Percentage (%)';
  const isPercentage = discountType.toLowerCase().includes('percent');
  const discountAmount = isPercentage ? (baseCost * (discountValue / 100)) : discountValue;

  // Calculate GST (18%) on discounted amount
  const discountedBase = Math.max(0, baseCost - discountAmount);
  const gstAmount = discountedBase * 0.18;

  // Final Amount
  const finalAmount = discountedBase + gstAmount;

  return (
    <div className="animate-in fade-in duration-300">
      <div>
        <div className="shrink-0 mb-4">
          <h2 className="text-lg font-bold text-[#040715] mb-3">4. Commercial</h2>
          <hr className="border-t border-[#E9ECEF]" />
        </div>

        <div className="bg-white border border-[#E9ECEF] rounded-xl shadow-sm overflow-hidden">

          {/* Modules Breakdown Table */}
          {formData.modules && formData.modules.length > 0 && (
            <div className="p-0 border-b border-[#E9ECEF]">
              <h3 className="text-[13px] font-bold text-[#040715] p-3 pb-0">Modules Breakdown</h3>

              <div className="overflow-x-auto p-3 pt-2">
                <table className="w-full text-left border-b border-[#E9ECEF]">
                  <thead className="bg-[#F6F9F9]">
                    <tr className="border-b border-[#E9ECEF]">
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715] w-12 text-center">#</th>
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715]">Module Name</th>
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715] w-[40%]">Functionalities</th>
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715] text-center whitespace-nowrap">Total Hrs</th>
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715] text-center whitespace-nowrap">Total Days</th>
                      <th className="py-2 px-3 text-[11px] font-bold text-[#040715] text-right whitespace-nowrap">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9ECEF]">
                    {formData.modules.map((m, idx) => {
                      const mCost = m.functionalities.reduce((fs, f) => {
                        return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
                      }, 0);

                      const mHours = m.functionalities.reduce((fs, f) => {
                        return fs + (Number(f.effort) || 0);
                      }, 0);

                      return (
                        <tr key={m.id || idx} className="hover:bg-gray-50/30 transition-colors bg-white">
                          <td className="py-2.5 px-3 text-center align-top">
                            <span className="text-[11px] font-semibold text-[#040715]">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 align-top">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                                <img src={ModulesIcon} alt="Module Icon" className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-[#040715] leading-snug">{m.name || `Module ${idx + 1}`}</p>
                                <p className="text-[9px] text-gray-500 mt-0.5 leading-snug">{m.description || 'No description provided'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 align-top">
                            <ul className="space-y-0.5">
                              {m.functionalities && m.functionalities.length > 0 ? (
                                m.functionalities.map((func, fIdx) => (
                                  <li key={func.id || fIdx} className="text-[10px] text-[#46505F] flex items-start gap-1 leading-tight">
                                    <span className="shrink-0">{fIdx + 1}.</span> 
                                    <span>{func.name || 'Unnamed Functionality'}</span>
                                  </li>
                                ))
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">No functionalities</span>
                              )}
                            </ul>
                          </td>
                          <td className="py-2.5 px-3 text-center align-top whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-[#1A9F9A]">
                              {String(mHours).padStart(2, '0')} Hrs
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center align-top whitespace-nowrap">
                            <span className="text-[11px] font-semibold text-[#1A9F9A]">
                              {String(Number(m.duration) || 0).padStart(2, '0')} Days
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right align-top whitespace-nowrap">
                            <span className="text-[11px] font-bold text-[#040715]">
                              ₹ {mCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total Outstanding Pricing */}
          <div className="px-4 py-2 sm:px-4 sm:py-3 border-b border-[#E9ECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 bg-white">
            <div>
              <h3 className="text-[13px] font-bold text-[#040715]">Total Outstanding Amount (Excl. GST)</h3>
              <p className="text-[11px] text-gray-500 mt-0">Total cost of the application</p>
            </div>
            <div className="text-[13px] font-bold text-[#040715] self-start sm:self-auto">
              ₹ {baseCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Discount */}
          <div className="px-4 py-2 sm:px-4 sm:py-3 border-b border-[#E9ECEF] flex flex-col lg:flex-row lg:items-center justify-between bg-white gap-2">
            <div className="w-full lg:w-1/3">
              <h3 className="text-[13px] font-bold text-[#040715]">Discount</h3>
              <p className="text-[11px] text-gray-500 mt-0">Discount on total amount</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 w-full lg:w-auto flex-1">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="px-2 py-1 border border-[#E9ECEF] rounded-[4px] text-[11px] text-[#46505F] focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] bg-white w-[120px]"
              >
                <option value="Percentage (%)">Percentage (%)</option>
                <option value="Flat Amount">Flat Amount</option>
              </select>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                step="any"
                placeholder="0"
                className="w-16 px-2 py-1 border border-[#E9ECEF] rounded-[4px] text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A]"
              />
            </div>
            <div className="text-[#E74C3C] text-[13px] font-bold self-start lg:self-auto whitespace-nowrap min-w-[100px] text-right">
              - ₹ {discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* GST */}
          <div className="px-4 py-2 sm:px-4 sm:py-3 border-b border-[#E9ECEF] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 bg-white">
            <div>
              <h3 className="text-[13px] font-bold text-[#040715]">GST</h3>
              <p className="text-[11px] text-gray-500 mt-0">18% of Total Outstanding amount</p>
            </div>
            <div className="text-[13px] font-bold text-[#040715] self-start sm:self-auto min-w-[100px] text-right">
              ₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Final Amount */}
          <div className="px-4 py-3 sm:px-4 sm:py-4 bg-[#EFFAF8] flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 rounded-b-xl">
            <div>
              <h3 className="text-[14px] font-bold text-[#040715]">Final Outstanding Amount</h3>
              <p className="text-[11px] text-gray-500 mt-0">Total amount to be paid</p>
            </div>
            <div className="text-[16px] font-bold text-[#1A9F9A] self-start sm:self-auto">
              ₹ {finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
