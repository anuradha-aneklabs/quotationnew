export const fetchTaxes = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/tax-masters`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure auth
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching taxes: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data?.data || json.data || [];
  } catch (error) {
    console.error('Failed to fetch taxes:', error);
    throw error;
  }
};

export const createTax = async (taxData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/tax-masters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(taxData),
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || `Error: ${response.statusText}`;
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage += '\\nDetails: ' + err.errors.map(e => `${e.field || 'field'}: ${e.message}`).join(', ');
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create tax:', error);
    throw error;
  }
};

export const updateTax = async (id, taxData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/tax-masters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(taxData),
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || `Error: ${response.statusText}`;
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage += '\\nDetails: ' + err.errors.map(e => `${e.field || 'field'}: ${e.message}`).join(', ');
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to update tax ${id}:`, error);
    throw error;
  }
};

export const deleteTax = async (id) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/tax-masters/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      const err = await response.json();
      let errorMessage = err.message || `Error: ${response.statusText}`;
      if (err.errors && Array.isArray(err.errors)) {
        errorMessage += '\\nDetails: ' + err.errors.map(e => `${e.field || 'field'}: ${e.message}`).join(', ');
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to delete tax ${id}:`, error);
    throw error;
  }
};
