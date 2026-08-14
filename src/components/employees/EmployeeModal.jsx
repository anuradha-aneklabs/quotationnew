import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function EmployeeModal({ isOpen, onClose, onSave, employeeData }) {
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    email: '',
    phone: '',
    role: '',
    hourlyRate: '',
    assignedProject: '',
    department: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (employeeData) {
        setFormData({
          name: employeeData.name || '',
          id: employeeData.employee_code || '',
          email: employeeData.email || '',
          phone: employeeData.phone || '',
          role: employeeData.role || employeeData.designation || '',
          hourlyRate: employeeData.hourly_rate ? String(employeeData.hourly_rate).replace('₹', '') : '',
          assignedProject: employeeData.assigned_project || '',
          department: employeeData.department || ''
        });
      } else {
        setFormData({
          name: '',
          id: '',
          email: '',
          phone: '',
          role: '',
          hourlyRate: '',
          assignedProject: '',
          department: ''
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, employeeData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'phone') {
      newValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'hourlyRate') {
      newValue = value.replace(/[^0-9.]/g, '');
      const parts = newValue.split('.');
      if (parts.length > 2) {
        newValue = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }));
    // Clear error for the field being typed in
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Employee Name is required';
    if (!formData.id.trim()) newErrors.id = 'Employee ID is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be exactly 10 digits';
    }
    
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    
    if (!formData.hourlyRate.toString().trim()) {
      newErrors.hourlyRate = 'Hourly Rate is required';
    } else if (isNaN(Number(formData.hourlyRate))) {
       newErrors.hourlyRate = 'Must be a number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          name: formData.name,
          employee_code: formData.id,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          designation: formData.role, // Mapping role to designation as well based on API
          department: formData.department || 'Engineering',
          hourly_rate: Number(formData.hourlyRate),
          assigned_project: formData.assignedProject
        };
        await onSave(payload);
        // onClose is handled by parent on success
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto pt-10 pb-10">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 my-auto relative flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            {employeeData ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="employeeForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Employee Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Employee Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g. EMP-004"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.id ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.id && <p className="mt-1 text-xs text-red-500">{errors.id}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@quotemaster.com"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. UI/UX Designer"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.role ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role}</p>}
              </div>

              {/* Hourly Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Hourly Rate <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  disabled={isSubmitting}
                  className={`w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50 ${
                    errors.hourlyRate ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'
                  }`}
                />
                {errors.hourlyRate && <p className="mt-1 text-xs text-red-500">{errors.hourlyRate}</p>}
              </div>

              {/* Assigned Project */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Assigned Project
                </label>
                <input
                  type="text"
                  name="assignedProject"
                  value={formData.assignedProject}
                  onChange={handleChange}
                  placeholder="e.g. Project Apollo (Optional)"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Sales (Optional)"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition-colors disabled:opacity-50 disabled:bg-gray-50"
                />
              </div>

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="employeeForm"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              'Save Employee'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
