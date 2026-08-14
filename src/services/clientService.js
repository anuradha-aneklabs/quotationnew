export const fetchClients = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    // Using id = 0 to fetch all clients as per instructions
    const response = await fetch(`${apiUrl}/api/v1/clients/0`);
    
    if (!response.ok) {
      throw new Error(`Error fetching clients: ${response.statusText}`);
    }
    
    const json = await response.json();
    return json.data?.clients || [];
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Error creating client: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Failed to create client:', error);
    throw error;
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/clients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      throw new Error(`Error updating client: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Failed to update client ${id}:`, error);
    throw error;
  }
};

export const deleteClient = async (id) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/clients/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting client: ${response.statusText}`);
    }

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(`Failed to delete client ${id}:`, error);
    throw error;
  }
};
