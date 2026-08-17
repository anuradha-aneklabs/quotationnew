import React from 'react';
import { Clock, Calendar, Code, Monitor } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-300 mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">4. Commercial</h2>
        <p className="text-sm text-gray-500 mb-8">Provide commercial details for this quotation.</p>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">

          {/* Modules Breakdown Table */}
          {formData.modules && formData.modules.length > 0 && (
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Modules Breakdown</h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 text-center">#</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Module Name</th>
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          Total Hours <Clock className="h-3.5 w-3.5" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          Total Days <Calendar className="h-3.5 w-3.5" />
                        </div>
                      </th>
                      <th className="py-3 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Total Cost (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.modules.map((m, idx) => {
                      const mCost = m.functionalities.reduce((fs, f) => {
                        return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
                      }, 0);

                      const mHours = m.functionalities.reduce((fs, f) => {
                        return fs + (Number(f.effort) || 0);
                      }, 0);

                      const isFrontend = m.name?.toLowerCase().includes('frontend') || m.name?.toLowerCase().includes('ui');

                      return (
                        <tr key={m.id || idx} className="hover:bg-gray-50/30 transition-colors">
                          <td className="py-4 px-4 text-center">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold mx-auto">
                              {idx + 1}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                {isFrontend ? <Monitor className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{m.name || `Module ${idx + 1}`}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{m.description || 'No description provided'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                              <Clock className="h-3.5 w-3.5" />
                              {mHours} Hrs
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600">
                              <Calendar className="h-3.5 w-3.5" />
                              {Number(m.duration) || 0} Days
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <span className="text-sm font-bold text-gray-900">
                              ₹ {mCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Total Outstanding Pricing (Excl. GST)</h3>
              <p className="text-xs text-gray-500 mt-1">Total cost of the application</p>
            </div>
            <div className="text-base sm:text-lg font-bold text-gray-900 self-start sm:self-auto">
              ₹ {baseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Discount */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between bg-gray-50/30 gap-4">
            <div className="w-full lg:w-1/3">
              <h3 className="text-sm font-bold text-gray-900">Discount</h3>
              <p className="text-xs text-gray-500 mt-1">Discount on total amount</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="flex-1 sm:flex-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 bg-white"
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
                className="w-24 sm:w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
              />
            </div>
            <div className="text-red-500 font-medium self-start lg:self-auto whitespace-nowrap">
              - ₹ {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* GST */}
          <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">GST</h3>
              <p className="text-xs text-gray-500 mt-1">18% of Total Outstanding Pricing</p>
            </div>
            <div className="text-gray-900 font-medium self-start sm:self-auto">
              ₹ {gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Final Amount */}
          <div className="p-4 sm:p-6 bg-green-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 rounded-b-2xl">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Final Outstanding Amount</h3>
              <p className="text-xs text-gray-500 mt-1">Total amount to be paid</p>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-600 self-start sm:self-auto">
              ₹ {finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
