import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import DropdownMastersTable from '../components/masters/DropdownMastersTable';
import CreateDropdownModal from '../components/masters/CreateDropdownModal';

import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchDropdowns, fetchDropdownById, createDropdown, updateDropdown, deleteDropdown } from '../services/dropdownMasterService';
import { useToast } from '../contexts/ToastContext';

export default function DropdownMasters() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDropdown, setEditingDropdown] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [dropdownToDelete, setDropdownToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadDropdowns = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchDropdowns();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDropdowns();
  }, []);

  const filteredItems = items
    .filter(item => {
      if (statusFilter === 'active') return item.status === true;
      if (statusFilter === 'inactive') return item.status === false;
      return true; // 'all'
    })
    .filter(item => 
      (item.dropdownName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleAddClick = () => {
    setEditingDropdown(null);
    setIsModalOpen(true);
  };

  const handleEditClick = async (dropdown) => {
    try {
      setIsLoading(true);
      const fullDetails = await fetchDropdownById(dropdown.id);
      setEditingDropdown(fullDetails);
      setIsModalOpen(true);
    } catch (err) {
      showToast(`Failed to fetch dropdown details: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDropdownToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!dropdownToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDropdown(dropdownToDelete);
      await loadDropdowns();
      setIsDeleteModalOpen(false);
      setDropdownToDelete(null);
      showToast('Dropdown deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete dropdown: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveDropdown = async (dropdownData) => {
    setIsSubmitting(true);
    try {
      if (editingDropdown) {
        await updateDropdown(editingDropdown.id, dropdownData);
      } else {
        await createDropdown(dropdownData);
      }
      await loadDropdowns();
      setIsModalOpen(false);
      showToast(editingDropdown ? 'Dropdown updated successfully' : 'Dropdown created successfully', 'success');
    } catch (err) {
      showToast(`Failed to save dropdown: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-Inter space-y-4 flex flex-col h-full pb-6 pt-4">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Search Bar */}
        <div className="flex-1 max-w-[320px]">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Dropdown..."
          />
        </div>

        {/* Right: Dropdown + New Button */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-[#E9ECEF] text-[#46505F] text-[13px] rounded-[8px] pl-3 pr-8 h-[38px] focus:outline-none focus:border-[#1A9F9A] transition-colors cursor-pointer shadow-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#46505F]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          
          <button
            onClick={handleAddClick}
            className="inline-flex items-center justify-center px-4 h-[38px] text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[8px] hover:bg-[#14807b] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Dropdown
          </button>
        </div>
      </div>

      {/* Unified Table Container */}
      <div className="bg-white rounded-[12px] shadow-sm border border-[#E9ECEF] flex flex-col flex-1 min-h-0">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-gray-500">Loading dropdowns...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
          </div>
        ) : (
          <DropdownMastersTable 
            items={filteredItems} 
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
        
        <Pagination 
          totalItems={filteredItems.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      <CreateDropdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDropdown}
        initialData={editingDropdown}
        isSubmitting={isSubmitting}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDropdownToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Dropdown"
        message="Are you sure you want to delete this dropdown?"
        confirmText="Delete Dropdown"
        isSubmitting={isDeleting}
      />
    </div>
  );
}
