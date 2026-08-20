const getApiUrl = () => import.meta.env.VITE_API_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.message || errorMsg;
    } catch (e) {
      // Ignore JSON parse error on error response
    }
    throw new Error(errorMsg);
  }
  
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  }
  return await response.blob(); // For downloads
};

export const createQuotation = async (quotationData) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quotationData),
  });
  return handleResponse(response);
};

export const updateQuotation = async (id, quotationData) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quotationData),
  });
  return handleResponse(response);
};

export const getQuotation = async (id, filters = {}) => {
  let url = `${getApiUrl()}/api/v1/quotations/${id}`;
  
  if (id === 0) {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const deleteQuotation = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}`, {
    method: 'DELETE',
  });
  return handleResponse(response);
};

export const getScopesTree = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/scopes/tree`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const syncScopes = async (id, scopesData) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/scopes/sync`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scopesData),
  });
  return handleResponse(response);
};

export const getCommercial = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/commercial`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const saveCommercial = async (id, commercialData) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/commercial`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commercialData),
  });
  return handleResponse(response);
};

export const getMilestones = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/milestones`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const bulkSaveMilestones = async (id, milestonesData) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/milestones/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(milestonesData),
  });
  return handleResponse(response);
};

export const getSummary = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/summary`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const downloadPdf = async (id) => {
  const response = await fetch(`${getApiUrl()}/api/v1/quotations/${id}/download`, {
    method: 'GET',
  });
  return handleResponse(response);
};
