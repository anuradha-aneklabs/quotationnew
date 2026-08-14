export const loginUser = async (credentials) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const json = await response.json();

    if (!response.ok) {
      throw { response: { data: json, status: response.status } };
    }

    return { data: json };
  } catch (error) {
    throw error;
  }
};
