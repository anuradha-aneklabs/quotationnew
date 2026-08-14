import React, { useState, useEffect } from 'react';
import { Plus, Filter, Loader2 } from 'lucide-react';
import QuotationsTable from '../components/quotations/QuotationsTable';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import * as quotationService from '../services/quotationService';

export default function Quotations({ setCurrentView }) {
  const [quotations, setQuotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const itemsPerPage = 10;

  useEffect(() => {
    fetchQuotations();
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

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      try {
        await quotationService.deleteQuotation(id);
        setQuotations(quotations.filter(q => q.id !== id));
      } catch (err) {
        console.error('Failed to delete quotation:', err);
        alert('Failed to delete quotation');
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
    } catch (err) {
      console.error('Failed to download PDF:', err);
      alert('Failed to download PDF');
    }
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
          onClick={() => setCurrentView('CreateQuotation')}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Quotation
        </button>
      </div>

      {/* Unified Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID, client or subject..."
        >
          {/* Right side children: Filters */}
          <div className="flex items-center space-x-3 text-gray-500">
            <Filter className="h-4 w-4" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-sm">to</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </SearchBar>
        
        {isLoading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
        ) : (
          <QuotationsTable 
            quotations={filteredQuotations} 
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
    </div>
  );
}
