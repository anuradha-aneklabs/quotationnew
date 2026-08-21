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
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'

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
      setViewMode('list');
      loadBranches();
    } else {
      setBranches([]);
    }
  }, [isOpen, company]);

  if (!isOpen || !company) return null;

  const handleAddBranch = () => {
    setEditingBranch(null);
    setViewMode('form');
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setViewMode('form');
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
      // Immediately remove from local state
      setBranches(prev => prev.filter(b => (b.branchId || b.id) !== branchToDelete));
      setIsDeleteModalOpen(false);
      setBranchToDelete(null);
      showToast('Branch deleted successfully', 'success');
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
      setViewMode('list');
    } catch (err) {
      showToast(`Failed to save branch: ${err.message}`, 'error');
    }
  };

  return (
    <>
      {/* Branch Manage Modal */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#040715]/40 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
        <div className={`bg-white rounded-[16px] overflow-hidden shadow-2xl w-full ${viewMode === 'form' ? 'max-w-[700px] h-auto max-h-[95vh]' : 'max-w-[1000px] h-[550px]'} relative flex flex-col animate-in zoom-in-95 duration-200 my-auto`}>
          {/* Header */}
          <div className="flex justify-between items-center mx-6 py-4 shrink-0">
            <div>
              <h2 className="text-[18px] font-semibold text-[#040715]">
                {viewMode === 'form' ? (editingBranch ? 'Edit Branch' : 'Add New Branch') : 'Branches'} - <span className="text-[#1A9F9A] font-medium">{company.companyName || company.company_name}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {viewMode === 'list' && (
                <button
                  onClick={handleAddBranch}
                  className="inline-flex items-center justify-center px-4 py-2 text-[13px] font-medium text-white bg-[#1A9F9A] rounded-[4px] hover:bg-[#14807b] transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Branch
                </button>
              )}
              <button
                onClick={onClose}
                className="text-[#5F6A80] hover:text-[#040715] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 bg-white">
            {viewMode === 'form' ? (
              <BranchModal
                isOpen={true}
                onClose={() => setViewMode('list')}
                onSave={handleSaveBranch}
                branchData={editingBranch}
                companyId={company?.companyId || company?.id}
              />
            ) : isLoading ? (
              <div className="flex items-center justify-center py-16">
                <span className="text-gray-500 text-[13px]">Loading branches...</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <span className="text-red-500 bg-red-50 px-4 py-3 rounded-[8px] text-[13px]">Error: {error}</span>
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
        message="Are you sure you want to delete this branch?"
        confirmText="Delete Branch"
        isSubmitting={isDeleting}
      />
    </>
  );
}
