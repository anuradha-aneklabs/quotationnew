import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import TaxMastersTable from '../components/masters/TaxMastersTable';
import CreateTaxModal from '../components/masters/CreateTaxModal';

import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchTaxes, createTax, updateTax, deleteTax } from '../services/taxMasterService';
import { useToast } from '../contexts/ToastContext';

export default function TaxMasters() {
  const { showToast } = useToast();
  const [taxes, setTaxes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTax, setEditingTax] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadTaxes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTaxes();
      setTaxes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTaxes();
  }, []);

  const filteredTaxes = taxes
    .filter(tax => tax.status === true)
    .filter(tax => 
      (tax.taxName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tax.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddClick = () => {
    setEditingTax(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (tax) => {
    setEditingTax(tax);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setTaxToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!taxToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteTax(taxToDelete);
      await loadTaxes();
      setIsDeleteModalOpen(false);
      setTaxToDelete(null);
      showToast('Tax deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete tax: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveTax = async (taxData) => {
    setIsSubmitting(true);
    try {
      if (editingTax) {
        await updateTax(editingTax.id, taxData);
      } else {
        await createTax(taxData);
      }
      await loadTaxes();
      setIsModalOpen(false);
      showToast(editingTax ? 'Tax updated successfully' : 'Tax created successfully', 'success');
    } catch (err) {
      showToast(`Failed to save tax: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex flex-col h-full pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-500 text-sm">Manage tax components used in quotations and invoices.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Tax
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tax..."
        />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-gray-500">Loading taxes...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
          </div>
        ) : (
          <TaxMastersTable 
            taxes={filteredTaxes} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
        
        <Pagination 
          totalItems={filteredTaxes.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateTaxModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTax}
        initialData={editingTax}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTaxToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Tax"
        message="Are you sure you want to delete this tax component? This action cannot be undone."
        confirmText="Delete Tax"
        isSubmitting={isDeleting}
      />
    </div>
  );
}
