import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EmployeesTable from '../components/employees/EmployeesTable';
import EmployeeModal from '../components/employees/EmployeeModal';
import EmployeeViewModal from '../components/employees/EmployeeViewModal';
import Header from '../components/layout/Header';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employeeService';
import { useToast } from '../contexts/ToastContext';

export default function Employees() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadEmployees = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    // Use snake_case properties from API response
    return (
      (emp.name || '').toLowerCase().includes(term) ||
      (emp.role || '').toLowerCase().includes(term) ||
      (emp.assigned_project || '').toLowerCase().includes(term)
    );
  });

  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleViewClick = (employee) => {
    setViewingEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setEmployeeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteEmployee(employeeToDelete);
      await loadEmployees();
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      showToast('Employee deleted successfully', 'error');
    } catch (err) {
      showToast(`Failed to delete employee: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
      } else {
        await createEmployee(employeeData);
      }
      // Refresh list on success
      await loadEmployees();
      setIsModalOpen(false);
      showToast(editingEmployee ? 'Employee updated successfully' : 'Employee added successfully', 'success');
    } catch (err) {
      showToast(`Failed to save employee: ${err.message}`, 'error');
    }
  };

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 flex flex-col h-full pb-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Header title="Employees" />
          <p className="text-gray-500 text-sm -mt-5">Manage your team and track project assignments.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </button>
      </div>

      {/* Unified Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0">
        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, role or project..."
        />
        
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-gray-500">Loading employees...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <span className="text-red-500 bg-red-50 px-4 py-3 rounded-lg">Error: {error}</span>
          </div>
        ) : (
          <EmployeesTable 
            employees={paginatedEmployees} 
            onView={handleViewClick}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}
        
        <Pagination 
          totalItems={filteredEmployees.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Modal */}
      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeData={editingEmployee}
      />

      {/* View Modal */}
      <EmployeeViewModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        employee={viewingEmployee}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete Employee"
        isSubmitting={isDeleting}
      />
    </div>
  );
}
