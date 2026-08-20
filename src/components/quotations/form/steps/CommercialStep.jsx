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
            <div className="p-0">
              <h3 className="text-[13px] font-bold text-[#040715] px-4 pt-4 pb-2">Modules Breakdown</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F6F9F9]">
                    <tr className="border-b border-[#E9ECEF]">
                      <th className="py-2.5 pl-4 pr-0 text-[14px] font-bold text-[#040715] w-[40px] text-left">#</th>
                      <th className="py-2.5 pl-2 pr-3 text-[14px] font-bold text-[#040715] w-[36%] text-left">Module Name</th>
                      <th className="py-2.5 px-3 text-[14px] font-bold text-[#040715] w-[36%] text-left">Functionalities</th>
                      <th className="py-2.5 px-3 text-[14px] font-bold text-[#040715] w-[90px] text-center whitespace-nowrap">Total Hrs</th>
                      <th className="py-2.5 px-3 text-[14px] font-bold text-[#040715] w-[90px] text-center whitespace-nowrap">Total Days</th>
                      <th className="py-2.5 px-3 pr-8 text-[14px] font-bold text-[#040715] w-[110px] text-right whitespace-nowrap">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.modules.map((m, idx) => {
                      const mCost = m.functionalities.reduce((fs, f) => {
                        return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
                      }, 0);

                      const mHours = m.functionalities.reduce((fs, f) => {
                        return fs + (Number(f.effort) || 0);
                      }, 0);

                      return (
                        <React.Fragment key={m.id || idx}>
                          <tr className="hover:bg-gray-50/30 transition-colors bg-white">
                          <td className="py-2.5 pl-4 pr-0 align-top w-[40px]">
                            <div className="w-[26px] h-[26px] rounded-[4px] bg-white border border-[#E9ECEF] flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-[11px] font-semibold text-[#040715]">
                                {String(idx + 1).padStart(2, '0')}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 pl-2 pr-3 align-top w-[26%]">
                            <div className="flex items-start gap-2.5">
                              <div className="w-[26px] h-[26px] flex items-center justify-center shrink-0 bg-[#E8F8F7] rounded-[4px] p-1.5 mt-0.5">
                                <img src={ModulesIcon} alt="Module Icon" className="w-full h-full object-contain" />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#040715] leading-snug">{m.name || `Module ${idx + 1}`}</p>
                                <p className="text-[12px] text-#46505F-500 mt-0.5 leading-snug">{m.description || 'No description provided'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 align-top w-[22%]">
                            <ul className="space-y-0.5">
                              {m.functionalities && m.functionalities.length > 0 ? (
                                m.functionalities.map((func, fIdx) => (
                                  <li key={func.id || fIdx} className="text-[12px] text-#46505F flex items-start gap-1 leading-tight">
                                    <span className="shrink-0">{fIdx + 1}.</span> 
                                    <span>{func.name || 'Unnamed Functionality'}</span>
                                  </li>
                                ))
                              ) : (
                                <span className="text-[12px] text-gray-400 italic">No functionalities</span>
                              )}
                            </ul>
                          </td>
                          <td className="py-2.5 px-3 text-center align-top whitespace-nowrap w-[90px]">
                            <span className="text-[12px] font-medium text-[#1A9F9A] mt-0.5 block">
                              {String(mHours).padStart(2, '0')} Hrs
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center align-top whitespace-nowrap w-[90px]">
                            <span className="text-[12px] font-medium text-[#1A9F9A] mt-0.5 block">
                              {String(Number(m.duration) || 0).padStart(2, '0')} Days
                            </span>
                          </td>
                          <td className="py-2.5 px-3 pr-8 text-right align-top whitespace-nowrap w-[110px]">
                            <span className="text-[11px] font-bold text-[#040715] mt-0.5 block">
                              ₹ {mCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </td>
                        </tr>
                        {idx !== formData.modules.length - 1 && (
                          <tr>
                            <td colSpan="6" className="p-0">
                              <div className="mx-4 border-b border-[#E9ECEF]"></div>
                            </td>
                          </tr>
                        )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mx-4 border-b border-[#E9ECEF]"></div>
            </div>
          )}

          {/* Total Outstanding Pricing */}
          <div className="bg-white px-4">
            <div className="py-3 border-b border-[#E9ECEF] flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-semibold text-[#040715]">Total Outstanding Amount (Excl. GST)</h3>
                <p className="text-[13px] text-[#46505F] mt-0 hidden sm:block">Total cost of the application</p>
              </div>
              <div className="text-[13px] font-bold text-[#040715] text-right sm:pr-4 shrink-0">
                ₹ {baseCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Discount */}
          <div className="bg-white px-4">
            <div className="py-3 border-b border-[#E9ECEF] flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-2">
              <div className="w-full md:w-1/3">
                <h3 className="text-[13px] font-semibold text-[#040715]">Discount</h3>
                <p className="text-[13px] text-[#46505F] mt-0 hidden sm:block">Discount on total amount</p>
              </div>
              <div className="flex flex-row flex-wrap items-center justify-between w-full md:w-auto md:flex-1 gap-2">
                <div className="flex items-center gap-2">
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="px-2 py-1 border border-[#E9ECEF] rounded-[8px] text-[12px] text-[#46505F] focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] bg-[#FAFAFA] w-[110px] sm:w-[120px]"
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
                    className="w-16 px-2 py-1 border border-[#E9ECEF] rounded-[8px] text-[11px] text-center focus:outline-none focus:ring-1 focus:ring-[#1A9F9A] focus:border-[#1A9F9A] bg-[#FAFAFA]"
                  />
                </div>
                <div className="text-[#E74C3C] text-[13px] font-bold whitespace-nowrap text-right sm:pr-4">
                  - ₹ {discountAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* GST */}
          <div className="bg-white px-4">
            <div className="py-3 border-b border-[#E9ECEF] flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="text-[13px] font-semibold text-[#040715]">GST</h3>
                <p className="text-[13px] text-[#46505F] mt-0 hidden sm:block">18% of Total Outstanding amount</p>
              </div>
              <div className="text-[13px] font-bold text-[#040715] text-right sm:pr-4 shrink-0">
                ₹ {gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Final Amount */}
          <div className="bg-[#EFFAF8] rounded-b-xl">
            <div className="px-4 py-4 flex flex-row items-center justify-between gap-2">
              <div>
                <h3 className="text-[14px] font-bold text-[#040715]">Final Outstanding Amount</h3>
                <p className="text-[11px] text-gray-500 mt-0 hidden sm:block">Total amount to be paid</p>
              </div>
              <div className="text-[16px] font-bold text-[#1A9F9A] text-right sm:pr-4 shrink-0">
                ₹ {finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
