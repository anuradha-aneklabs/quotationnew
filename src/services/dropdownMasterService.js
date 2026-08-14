export const fetchDropdowns = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/dropdown-masters`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching dropdowns: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data?.data || json.data || [];
  } catch (error) {
    console.error('Failed to fetch dropdowns:', error);
    throw error;
  }
};

export const fetchDropdownById = async (id) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/dropdown-masters/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error fetching dropdown details`);
    }
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error(`Failed to fetch dropdown ${id}:`, error);
    throw error;
  }
};

export const createDropdown = async (dropdownData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/dropdown-masters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(dropdownData),
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
    console.error('Failed to create dropdown:', error);
    throw error;
  }
};

export const updateDropdown = async (id, dropdownData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/dropdown-masters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(dropdownData),
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
    console.error(`Failed to update dropdown ${id}:`, error);
    throw error;
  }
};

export const deleteDropdown = async (id) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/dropdown-masters/${id}`, {
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
    console.error(`Failed to delete dropdown ${id}:`, error);
    throw error;
  }
};
