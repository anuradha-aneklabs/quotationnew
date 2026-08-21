import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ClientsTable from '../components/clients/ClientsTable';
import ClientModal from '../components/clients/ClientModal';
import ClientViewModal from '../components/clients/ClientViewModal';

import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchClients, createClient, updateClient, deleteClient } from '../services/clientService';
import { useToast } from '../contexts/ToastContext';
import useItemsPerPage from '../hooks/useItemsPerPage';

export default function Clients() {
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingClient, setViewingClient] = useState(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useItemsPerPage();

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const term = searchTerm.toLowerCase();
    return (
      (client.company_name || '').toLowerCase().includes(term) ||
      (client.contact_person || '').toLowerCase().includes(term) ||
      (client.email || '').toLowerCase().includes(term)
    );
  });

  const handleAddClick = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleViewClick = (client) => {
    setViewingClient(client);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setClientToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete);
      await loadClients();
      setIsDeleteModalOpen(false);
      setClientToDelete(null);
      showToast('Client deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete client: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveClient = async (clientData) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
      } else {
        await createClient(clientData);
      }
      await loadClients();
      setIsModalOpen(false);
      showToast(editingClient ? 'Client updated successfully' : 'Client created successfully', 'success');
    } catch (err) {
      showToast(`Failed to save client: ${err.message}`, 'error');
    }
  };

  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3 pt-2">

      <SearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search clients....."
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleAddClick}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#1A9F9A] rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </button>
        </div>
      </SearchBar>

      {/* Unified Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden mb-4">

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-gray-500">Loading clients...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
          </div>
        ) : (
          <ClientsTable
            clients={paginatedClients}
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}

        <Pagination
          totalItems={filteredClients.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        clientData={editingClient}
      />

      {/* View Modal */}
      <ClientViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        client={viewingClient}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setClientToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Client"
        message="Are you sure you want to delete this client? This action cannot be undone."
        confirmText="Delete Client"
        isSubmitting={isDeleting}
      />
    </div>
  );
}
