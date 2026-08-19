export const fetchEmployees = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/employees/0`);
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.statusText}`);
    }
    const json = await response.json();
    return json.data.employees || [];
  } catch (error) {
    console.error('Failed to fetch employees:', error);
    throw error;
  }
};

export const fetchEmployeeRoles = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/employees/roles`);
    if (!response.ok) {
      throw new Error(`Error fetching roles: ${response.statusText}`);
    }
    const json = await response.json();
    // Handle both array of strings and array of objects
    const roles = json.data?.roles || json.data || json.roles || [];
    return Array.isArray(roles) ? roles : [];
  } catch (error) {
    console.error('Failed to fetch employee roles:', error);
    return []; // Return empty array on error — don't break the page
  }
};

export const createEmployee = async (employeeData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Failed to create employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error(`Error updating employee: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Failed to update employee ${id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/employees/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting employee: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Failed to delete employee ${id}:`, error);
    throw error;
  }
};
