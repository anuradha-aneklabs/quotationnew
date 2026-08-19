
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import EmployeesTable from '../components/employees/EmployeesTable';
import EmployeeModal from '../components/employees/EmployeeModal';
import EmployeeViewModal from '../components/employees/EmployeeViewModal';

import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import ConfirmModal from '../components/common/ConfirmModal';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee, fetchEmployeeRoles } from '../services/employeeService';
import { useToast } from '../contexts/ToastContext';
import useItemsPerPage from '../hooks/useItemsPerPage';

export default function Employees() {
  const { showToast } = useToast();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = useItemsPerPage();

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

  const loadRoles = async () => {
    setRolesLoading(true);
    const data = await fetchEmployeeRoles();
    setRoles(data);
    setRolesLoading(false);
  };

  useEffect(() => {
    loadEmployees();
    loadRoles();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      (emp.name || '').toLowerCase().includes(term) ||
      (emp.role || '').toLowerCase().includes(term) ||
      (emp.assigned_project || '').toLowerCase().includes(term)
    );
    const matchesRole = selectedRole === '' || (emp.role || emp.designation || '') === selectedRole;
    return matchesSearch && matchesRole;
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
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-3">

      <SearchBar 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by name, role or project..."
      >
        <div className="flex items-center gap-3">
          {/* Role Filter Dropdown */}
          <div className="relative border border-gray-200 rounded-md bg-white hover:border-gray-300 transition-colors">
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
              disabled={rolesLoading}
              className="appearance-none bg-transparent pl-3 pr-8 py-2 text-sm font-medium text-[#46505F] focus:outline-none cursor-pointer disabled:opacity-60"
            >
              <option value="">All Role</option>
              {roles.map((role, idx) => {
                const roleLabel = typeof role === 'string' ? role : role.role || role.name || role;
                return <option key={idx} value={roleLabel}>{roleLabel}</option>;
              })}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#46505F]">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          <button 
            onClick={handleAddClick}
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#1A9F9A] rounded-md hover:bg-teal-600 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </SearchBar>

      {/* Unified Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden mb-4">
        
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
