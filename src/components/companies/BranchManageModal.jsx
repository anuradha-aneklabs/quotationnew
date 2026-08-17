import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import BranchesTable from './BranchesTable';
import BranchModal from './BranchModal';
import BranchViewModal from './BranchViewModal';
import ConfirmModal from '../common/ConfirmModal';
import { fetchBranchesByCompany, createBranch, updateBranch, deleteBranch } from '../../services/branchService';
import { useToast } from '../../contexts/ToastContext';

export default function BranchManageModal({ isOpen, onClose, company }) {
  const { showToast } = useToast();
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingBranch, setViewingBranch] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBranches = async () => {
    if (!company) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchBranchesByCompany(company.companyId || company.id);
      setBranches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && company) {
      loadBranches();
    } else {
      setBranches([]);
    }
  }, [isOpen, company]);

  if (!isOpen || !company) return null;

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setIsBranchModalOpen(true);
  };

  const handleViewBranch = (branch) => {
    setViewingBranch(branch);
    setIsViewModalOpen(true);
  };

  const handleDeleteBranch = (id) => {
    setBranchToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (!branchToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBranch(branchToDelete);
      await loadBranches();
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
      showToast('Branch deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete branch: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveBranch = async (branchData) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.branchId || editingBranch.id, branchData);
        showToast('Branch updated successfully', 'success');
      } else {
        await createBranch(branchData);
        showToast('Branch added successfully', 'success');
      }
      await loadBranches();
      setIsBranchModalOpen(false);
    } catch (err) {
      showToast(`Failed to save branch: ${err.message}`, 'error');
    }
  };

  return (
    <>
      {/* Branch Manage Modal (z-40 so it sits below branch sub-modals at z-50) */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 overflow-y-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl relative flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Branches — <span className="text-indigo-600">{company.companyName || company.company_name}</span>
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">Manage all branches for this company</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAddBranch}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="text-gray-500">Loading branches...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
              </div>
            ) : (
              <BranchesTable
                branches={branches}
                onView={handleViewBranch}
                onEdit={handleEditBranch}
                onDelete={handleDeleteBranch}
              />
            )}
          </div>
        </div>
      </div>

      {/* Branch Add/Edit Sub-Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSave={handleSaveBranch}
        branchData={editingBranch}
        companyId={company?.companyId || company?.id}
      />

      {/* Branch View Sub-Modal */}
      <BranchViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        branch={viewingBranch}
      />

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBranchToDelete(null);
        }}
        onConfirm={confirmDeleteBranch}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        confirmText="Delete Branch"
        isSubmitting={isDeleting}
      />
    </>
  );
}
