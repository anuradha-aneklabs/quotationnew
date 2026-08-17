import React, { useState, useEffect, useRef } from 'react';
import { Plus, Filter, Loader2 } from 'lucide-react';
import QuotationsTable from '../components/quotations/QuotationsTable';
import QuotationViewModal from '../components/quotations/QuotationViewModal';
import Header from '../components/layout/Header';
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
    <div className="space-y-6 flex flex-col h-full pb-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Header title="Quotations" />
          <p className="text-gray-500 text-sm -mt-5">Manage and track all your quotations.</p>
        </div>
        <button 
          onClick={() => onCreateNew ? onCreateNew() : setCurrentView('CreateQuotation')}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </button>
      </div>

      {/* Unified Table Container */}
      <div ref={containerRef} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID, client or subject..."
        >
          {/* Right side children: Filters */}
          <div className="flex items-center gap-2 text-gray-500 w-full min-w-max">
            <Filter className="h-4 w-4 shrink-0" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 min-w-[130px]"
            />
            <span className="text-sm shrink-0">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1 min-w-[130px]"
            />
          </div>
        </SearchBar>
        
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
