export const validateStep1 = (data) => {
  const errors = {};
  if (!data.clientName?.trim()) errors.clientName = 'Client Name is required';
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  if (!data.phone?.trim()) {
    errors.phone = 'Phone is required';
  } else if (data.phone.trim().length !== 10) {
    errors.phone = 'Phone must be exactly 10 digits';
  }
  
  if (!data.currency?.trim()) errors.currency = 'Currency is required';
  if (!data.billingAddress?.trim()) errors.billingAddress = 'Billing Address is required';
  if (!data.shippingAddress?.trim()) errors.shippingAddress = 'Shipping Address is required';
  
  if (!data.pincode?.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (data.pincode.trim().length !== 6) {
    errors.pincode = 'Pincode must be exactly 6 digits';
  }
  
  if (!data.country?.trim()) errors.country = 'Country is required';

  return errors;
};

export const validateStep2 = (data) => {
  const errors = {};
  if (!data.proposalTitle?.trim()) errors.proposalTitle = 'Proposal Title is required';
  if (!data.quotationNumber?.trim()) errors.quotationNumber = 'Quotation Number is required';
  if (!data.proposalDate) errors.proposalDate = 'Proposal Date is required';
  if (!data.validTill) errors.validTill = 'Valid Till Date is required';
  if (!data.preparedBy?.trim()) errors.preparedBy = 'Prepared By is required';
  if (!data.engagementType?.trim()) errors.engagementType = 'Engagement Type is required';
  if (!data.pricingCurrency?.trim()) errors.pricingCurrency = 'Pricing Currency is required';

  return errors;
};

export const validateStep3 = (data) => {
  const errors = {};
  if (!data.projectStartDate) errors.projectStartDate = 'Start Date is required';
  if (!data.projectEndDate) errors.projectEndDate = 'End Date is required';
  
  if (!data.modules || data.modules.length === 0) {
    errors.modules = 'At least one module is required';
  } else {
    data.modules.forEach((mod, modIdx) => {
      if (!mod.name?.trim()) errors[`module_${modIdx}_name`] = 'Module name is required';
      
      if (!mod.functionalities || mod.functionalities.length === 0) {
        errors[`module_${modIdx}_func`] = 'At least one functionality is required';
      } else {
        mod.functionalities.forEach((func, funcIdx) => {
          if (!func.name?.trim()) errors[`module_${modIdx}_func_${funcIdx}_name`] = 'Functionality name is required';
          if (!func.effort) errors[`module_${modIdx}_func_${funcIdx}_effort`] = 'Effort is required';
          if (!func.duration) errors[`module_${modIdx}_func_${funcIdx}_duration`] = 'Duration is required';
        });
      }
    });
  }

  return errors;
};
