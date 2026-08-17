const getApiUrl = () => import.meta.env.VITE_API_URL;
const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/companies/0`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error fetching companies: ${response.statusText}`);
    const json = await response.json();
    return json.data?.companies || [];
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    throw error;
  }
};

export const createCompany = async (companyData) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error(`Error creating company: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('Failed to create company:', error);
    throw error;
  }
};

export const updateCompany = async (id, companyData) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/companies/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(companyData),
    });
    if (!response.ok) throw new Error(`Error updating company: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to update company ${id}:`, error);
    throw error;
  }
};

export const deleteCompany = async (id) => {
  try {
    const response = await fetch(`${getApiUrl()}/api/v1/companies/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error deleting company: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to delete company ${id}:`, error);
    throw error;
  }
};
