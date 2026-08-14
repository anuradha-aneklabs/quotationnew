import React from 'react';

export default function CommercialStep({ formData, handleChange }) {
  // Calculate Base Cost from modules
  const baseCost = formData.modules.reduce((sum, m) => {
    return sum + m.functionalities.reduce((fs, f) => {
      return fs + f.teamAllocations.reduce((ts, tm) => ts + (Number(tm.cost) || 0), 0);
    }, 0);
  }, 0);

  // Calculate Discount
  const discountValue = Number(formData.discountValue) || 0;
  const isPercentage = formData.discountType === 'Percentage (%)';
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

          {/* Total Outstanding Pricing */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Total Outstanding Pricing (Excl. GST)</h3>
              <p className="text-xs text-gray-500 mt-1">Total cost of the application</p>
            </div>
            <div className="text-lg font-bold text-gray-900">
              ₹ {baseCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Discount */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
            <div className="w-1/3">
              <h3 className="text-sm font-bold text-gray-900">Discount</h3>
              <p className="text-xs text-gray-500 mt-1">Discount on total amount</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 bg-white"
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
                className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500"
              />
            </div>
            <div className="text-red-500 font-medium">
              - ₹ {discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* GST */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">GST</h3>
              <p className="text-xs text-gray-500 mt-1">18% of Total Outstanding Pricing</p>
            </div>
            <div className="text-gray-900 font-medium">
              ₹ {gstAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Final Amount */}
          <div className="p-6 bg-green-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Final Outstanding Amount</h3>
              <p className="text-xs text-gray-500 mt-1">Total amount to be paid</p>
            </div>
            <div className="text-2xl font-bold text-green-600">
              ₹ {finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
