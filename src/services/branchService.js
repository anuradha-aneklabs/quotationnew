const getApiUrl = () => import.meta.env.VITE_API_URL;
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const fetchBranchesByCompany = async (companyId) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/branches/company/${companyId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error fetching branches: ${response.statusText}`);
    const json = await response.json();
    return Array.isArray(json.data) ? json.data : (json.data?.branches || json.branches || (Array.isArray(json) ? json : []));
  } catch (error) {
    console.error('Failed to fetch branches:', error);
    throw error;
  }
};

export const fetchAllBranches = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/branches/0`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error fetching branches: ${response.statusText}`);
    const json = await response.json();
    return Array.isArray(json.data) ? json.data : (json.data?.branches || json.branches || (Array.isArray(json) ? json : []));
  } catch (error) {
    console.error('Failed to fetch all branches:', error);
    throw error;
  }
};

export const createBranch = async (branchData) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/branches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(branchData),
    });
    if (!response.ok) throw new Error(`Error creating branch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to create branch:', error);
    throw error;
  }
};

export const updateBranch = async (id, branchData) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/branches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(branchData),
    });
    if (!response.ok) throw new Error(`Error updating branch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to update branch ${id}:`, error);
    throw error;
  }
};

export const deleteBranch = async (id) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/branches/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error deleting branch: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete branch ${id}:`, error);
    throw error;
  }
};
