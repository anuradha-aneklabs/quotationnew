import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CompaniesTable from '../components/companies/CompaniesTable';
import CompanyModal from '../components/companies/CompanyModal';
import CompanyViewModal from '../components/companies/CompanyViewModal';
import BranchManageModal from '../components/companies/BranchManageModal';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchCompanies, createCompany, updateCompany, deleteCompany } from '../services/companyService';
import { useToast } from '../contexts/ToastContext';

export default function Companies() {
  const { showToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCompany, setViewingCompany] = useState(null);

  // Branch management modal
  const [isBranchManageOpen, setIsBranchManageOpen] = useState(false);
  const [selectedCompanyForBranches, setSelectedCompanyForBranches] = useState(null);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter(company => {
    const term = searchTerm.toLowerCase();
    return (
      (company.companyName || company.company_name || '').toLowerCase().includes(term) ||
      (company.email || '').toLowerCase().includes(term) ||
      (company.gstin || '').toLowerCase().includes(term)
    );
  });

  const handleAddClick = () => {
    setEditingCompany(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleViewClick = (company) => {
    setViewingCompany(company);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setCompanyToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleManageBranches = (company) => {
    setSelectedCompanyForBranches(company);
    setIsBranchManageOpen(true);
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteCompany(companyToDelete);
      await loadCompanies();
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
      showToast('Company deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete company: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (editingCompany) {
        await updateCompany(editingCompany.companyId || editingCompany.id, companyData);
      } else {
        await createCompany(companyData);
      }
      await loadCompanies();
      setIsModalOpen(false);
      showToast(
        editingCompany ? 'Company updated successfully' : 'Company created successfully',
        'success'
      );
    } catch (err) {
      showToast(`Failed to save company: ${err.message}`, 'error');
    }
  };

  const paginatedCompanies = filteredCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 flex flex-col h-full pb-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Header title="Companies" />
          <p className="text-gray-500 text-sm -mt-5">Manage your companies and their branches.</p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </button>
      </div>

      {/* Unified Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search companies..."
        />

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-gray-500">Loading companies...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
          </div>
        ) : (
          <CompaniesTable
            companies={paginatedCompanies}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onManageBranches={handleManageBranches}
          />
        )}

        <Pagination
          totalItems={filteredCompanies.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Company Modal */}
      <CompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCompany}
        companyData={editingCompany}
      />

      {/* View Company Modal */}
      <CompanyViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        company={viewingCompany}
      />

      {/* Branch Management Modal */}
      <BranchManageModal
        isOpen={isBranchManageOpen}
        onClose={() => setIsBranchManageOpen(false)}
        company={selectedCompanyForBranches}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCompanyToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Company"
        message="Are you sure you want to delete this company? All associated branches will also be removed. This action cannot be undone."
        confirmText="Delete Company"
        isSubmitting={isDeleting}
      />
    </div>
  );
}
