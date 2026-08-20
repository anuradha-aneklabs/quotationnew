import React, { useState, useEffect, useRef } from 'react';
import { Plus, Filter, Loader2, Calendar, Search } from 'lucide-react';
import QuotationsTable from '../components/quotations/QuotationsTable';
import QuotationViewModal from '../components/quotations/QuotationViewModal';

import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import * as quotationService from '../services/quotationService';
import { useToast } from '../contexts/ToastContext';

export default function Quotations({ setCurrentView, onEditQuotation, onCreateNew }) {
  const { showToast } = useToast();
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const containerRef = useRef(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingQuote, setViewingQuote] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (containerRef.current) {
        // Search bar (~65px) + pagination (~55px) + table header (~53px) = ~173px
        const availableHeight = containerRef.current.clientHeight - 175;
        const rowHeight = 57; // Accurate height of a table row
        const calculated = Math.max(1, Math.floor(availableHeight / rowHeight));
        setItemsPerPage(calculated);
      }
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  const fetchQuotations = async () => {
    setIsLoading(true);
    try {
      const res = await quotationService.getQuotation(0); // Fetch all
      
      const quotationList = res?.data?.quotations || [];
      if (Array.isArray(quotationList)) {
        // Map backend payload to frontend format
        const mappedData = quotationList.map(q => ({
          id: q.id,
          quotationNumber: q.quotation_number,
          clientName: q.client_company || q.client_name || 'Unknown Client',
          subject: q.title || 'Untitled Quotation',
          totalDays: q.total_timeline_days || 0,
          totalAmount: q.grand_total_formatted || 0
        }));
        setQuotations(mappedData);
      } else {
         setQuotations([]); // fallback
      }
    } catch (err) {
      console.error('Failed to fetch quotations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuotations = quotations.filter(quote => {
    const term = searchTerm.toLowerCase();
    return (
      quote.quotationNumber?.toLowerCase().includes(term) ||
      quote.clientName?.toLowerCase().includes(term) ||
      quote.subject?.toLowerCase().includes(term)
    );
  });

  const paginatedQuotations = filteredQuotations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await quotationService.deleteQuotation(id);
        setQuotations(quotations.filter(q => q.id !== id));
        showToast('Quotation deleted successfully', 'error');
      } catch (err) {
        console.error('Failed to delete quotation:', err);
        showToast('Failed to delete quotation', 'error');
      }
    }
  };

  const handleDownloadClick = async (quote) => {
    try {
      const blob = await quotationService.downloadPdf(quote.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${quote.quotationNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast('PDF downloaded successfully', 'success');
    } catch (err) {
      console.error('Failed to download PDF:', err);
      showToast('Failed to download PDF', 'error');
    }
  };

  const handleViewClick = async (quote) => {
    setViewingQuote(quote);
    setIsViewModalOpen(true);
  };

  return (
    <div className="font-Inter space-y-4 flex flex-col h-full pb-6 pt-4">
      {/* Top Controls: Search, Calendar, New Btn */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-[320px]">
          <div className="flex items-center w-full bg-[#FCFCFB] border border-[#E9ECEF] rounded-[8px] overflow-hidden focus-within:border-[#1A9F9A] transition-colors h-[38px]">
            <div className="pl-3 pr-2 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-[#46505F]" />
            </div>
            <input
              type="text"
              placeholder="Search by client name, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 pr-4 py-2 bg-transparent text-[13px] text-[#040715] focus:outline-none placeholder:text-[#46505F]"
            />
          </div>
        </div>

        {/* Right: Calendar + New Button */}
        <div className="flex items-center gap-4">
          <button className="flex items-center bg-white border border-[#E9ECEF] rounded-[8px] px-3 h-[38px] hover:bg-gray-50 transition-colors cursor-pointer shadow-sm">
            <span className="text-[13px] text-[#5F6A80] font-medium mr-3 tracking-wide">
              01 Jun -18 Jun 2026
            </span>
            <Calendar className="w-[18px] h-[18px] text-[#5F6A80]" />
          </button>
          <button 
            onClick={() => onCreateNew ? onCreateNew() : setCurrentView('CreateQuotation')}
            className="h-[38px] inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[8px] hover:bg-[#13807C] transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Quotation
          </button>
        </div>
      </div>

      {/* Unified Table Container */}
      <div ref={containerRef} className="bg-white rounded-xl shadow-sm border border-[#E9ECEF] flex flex-col flex-1 min-h-0 overflow-hidden">
        
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
        ) : (
          <QuotationsTable 
            quotations={paginatedQuotations} 
            onView={handleViewClick}
            onEdit={(quote) => onEditQuotation && onEditQuotation(quote.id)}
            onDelete={handleDeleteClick}
            onDownload={handleDownloadClick}
          />
        )}
        
        <Pagination 
          totalItems={filteredQuotations.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <QuotationViewModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        quote={viewingQuote} 
      />
    </div>
  );
}
