export const fetchDashboardReport = async (filters = {}) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const queryParams = new URLSearchParams();
    
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.clientId) queryParams.append('clientId', filters.clientId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);

    const url = `${apiUrl}/api/v1/reports/dashboard${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to fetch report data');
    }

    const data = await response.json();
    return data.data; // Accessing the generic ApiResponse 'data' property
  } catch (error) {
    console.error('Error fetching dashboard report:', error);
    throw error;
  }
};

export const exportReport = async (format = 'excel', filters = {}) => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const queryParams = new URLSearchParams();
    
    queryParams.append('format', format);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.clientId) queryParams.append('clientId', filters.clientId);
    if (filters.employeeId) queryParams.append('employeeId', filters.employeeId);

    const url = `${apiUrl}/api/v1/reports/export?${queryParams.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to export report as ${format}`);
    }

    // Handle file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `Reports_Analytics.${format === 'excel' ? 'xlsx' : 'pdf'}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
    
  } catch (error) {
    console.error(`Error exporting report as ${format}:`, error);
    throw error;
  }
};
