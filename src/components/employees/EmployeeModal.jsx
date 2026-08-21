import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';

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
        <div className="px-6 pt-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-[#040715]">
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
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form id="employeeForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Employee Name */}
              <FormInput
                label="Employee Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jane Doe"
                disabled={isSubmitting}
                error={errors.name}
                required
                className="py-2.5"
              />

              {/* Employee ID */}
              <FormInput
                label="Employee ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="e.g. EMP-004"
                disabled={isSubmitting}
                error={errors.id}
                required
                className="py-2.5"
              />

              {/* Email */}
              <FormInput
                type="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@quotemaster.com"
                disabled={isSubmitting}
                error={errors.email}
                required
                className="py-2.5"
              />

              {/* Phone */}
              <FormInput
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                disabled={isSubmitting}
                error={errors.phone}
                required
                className="py-2.5"
              />

              {/* Role */}
              <FormInput
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. UI/UX Designer"
                disabled={isSubmitting}
                error={errors.role}
                required
                className="py-2.5"
              />

              {/* Hourly Rate */}
              <FormInput
                label="Hourly Rate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="e.g. 50"
                disabled={isSubmitting}
                error={errors.hourlyRate}
                required
                className="py-2.5"
              />

              {/* Assigned Project */}
              <FormInput
                label="Assigned Project"
                name="assignedProject"
                value={formData.assignedProject}
                onChange={handleChange}
                placeholder="e.g. Project Apollo (Optional)"
                disabled={isSubmitting}
                className="py-2.5"
              />

              {/* Department */}
              <FormInput
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g. Sales (Optional)"
                disabled={isSubmitting}
                className="py-2.5"
              />

            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-between gap-3 py-4 px-6">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="employeeForm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Saving...
              </>
            ) : (
              'Save Employee'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
