export const fetchDashboardData = async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/v1/dashboard`);
    
    if (!response.ok) {
      throw new Error(`Error fetching dashboard data: ${response.statusText}`);
    }
    
    const json = await response.json();
    
    // The API wraps the response in a "data" object
    const payload = json.data || {};
    
    // Transform / Slice data as required
    return {
      metrics: payload.metrics || {},
      monthly_quotations: payload.monthly_quotations || [],
      recent_activity: (payload.recent_activity || []).slice(0, 5),
      recent_quotations: (payload.recent_quotations || []).slice(0, 4)
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
};
