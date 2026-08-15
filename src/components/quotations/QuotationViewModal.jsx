import React, { useEffect, useState } from 'react';
import { X, FileText, Calendar, IndianRupee, Loader2 } from 'lucide-react';
import * as quotationService from '../../services/quotationService';

export default function QuotationViewModal({ isOpen, onClose, quote }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && quote?.id) {
      fetchDetails(quote.id);
    } else {
      setDetails(null);
    }
  }, [isOpen, quote]);

  const fetchDetails = async (id) => {
    setLoading(true);
    try {
      // Trying to fetch the summary if endpoint exists and has detailed data
      const res = await quotationService.getSummary(id);
      if (res && res.data) {
        setDetails(res.data);
      } else {
        setDetails(null);
      }
    } catch (err) {
      console.error("Failed to fetch quotation details:", err);
      // fallback to just using the basic `quote` prop if summary fetch fails
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !quote) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-indigo-600" />
              Quotation Details
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{quote.quotationNumber}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-sm text-gray-500">Loading details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Client Name</p>
                    <p className="text-sm font-medium text-gray-900">{quote.clientName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                    <p className="text-sm font-medium text-gray-900">{quote.subject}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 rounded-xl p-4 bg-white flex items-start space-x-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">{quote.totalAmount || '₹ 0.00'}</p>
                  </div>
                </div>
                
                <div className="border border-gray-100 rounded-xl p-4 bg-white flex items-start space-x-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Duration</p>
                    <p className="text-lg font-bold text-gray-900">{quote.totalDays || 0} Days</p>
                  </div>
                </div>
              </div>
              
              {/* Additional Details from Summary (if available) */}
              {details && details.quotation && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/30 text-sm">
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="text-gray-500">Proposal Date:</div>
                    <div className="font-medium text-right">{details.quotation.proposal_date || 'N/A'}</div>
                    
                    <div className="text-gray-500">Valid Till:</div>
                    <div className="font-medium text-right">{details.quotation.valid_till || 'N/A'}</div>
                    
                    <div className="text-gray-500">Total Modules:</div>
                    <div className="font-medium text-right">{details.scopes?.length || 0}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
        
      </div>
    </div>
  );
}
