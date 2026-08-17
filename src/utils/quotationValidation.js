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

  if (data.panNumber?.trim() && data.panNumber.trim().length !== 10) {
    errors.panNumber = 'PAN Number must be exactly 10 characters';
  }

  if (data.gstNumber?.trim() && data.gstNumber.trim().length !== 15) {
    errors.gstNumber = 'GST Number must be exactly 15 characters';
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
  if (!data.companyId?.toString().trim()) errors.companyId = 'Company Name is required';
  if (!data.branchId?.toString().trim()) errors.branchId = 'Branch Name is required';
  if (!data.proposalTitle?.toString().trim()) errors.proposalTitle = 'Proposal Title is required';
  if (!data.quotationNumber?.toString().trim()) errors.quotationNumber = 'Quotation Number is required';
  if (!data.proposalDate) errors.proposalDate = 'Proposal Date is required';
  if (!data.validTill) errors.validTill = 'Valid Till Date is required';
  if (!data.preparedBy?.toString().trim()) errors.preparedBy = 'Prepared By is required';
  if (!data.engagementType?.toString().trim()) errors.engagementType = 'Engagement Type is required';
  if (!data.pricingCurrency?.toString().trim()) errors.pricingCurrency = 'Pricing Currency is required';

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
        const totalModuleEffort = mod.functionalities.reduce((sum, f) => sum + (Number(f.effort) || 0), 0);
        let totalModuleTeamEffort = 0;

        mod.functionalities.forEach((func, funcIdx) => {
          if (!func.name?.trim()) errors[`module_${modIdx}_func_${funcIdx}_name`] = 'Functionality name is required';
          if (!func.effort) errors[`module_${modIdx}_func_${funcIdx}_effort`] = 'Effort is required';
          if (!func.duration) errors[`module_${modIdx}_func_${funcIdx}_duration`] = 'Duration is required';
          
          totalModuleTeamEffort += (func.teamAllocations || []).reduce((sum, tm) => sum + (Number(tm.effort) || 0), 0);
        });

        if (totalModuleTeamEffort > totalModuleEffort) {
          const lastFuncIdx = mod.functionalities.length - 1;
          errors[`module_${modIdx}_func_${lastFuncIdx}_team`] = `Total team effort (${totalModuleTeamEffort}h) exceeds module effort (${totalModuleEffort}h)`;
        }
      }
    });
  }

  return errors;
};
