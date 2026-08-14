import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Clients from './pages/Clients';
import Quotations from './pages/Quotations';
import CreateQuotation from './pages/CreateQuotation';
import TaxMasters from './pages/TaxMasters';
import DropdownMasters from './pages/DropdownMasters';
import Login from './pages/Login';
import Reports from './pages/Reports';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  return (
    <DashboardLayout currentView={currentView} setCurrentView={setCurrentView} setToken={setToken}>
      {currentView === 'Dashboard' && <Dashboard />}
      {currentView === 'Employees' && <Employees />}
      {currentView === 'Clients' && <Clients />}
      {currentView === 'Quotations' && <Quotations setCurrentView={setCurrentView} />}
      {currentView === 'CreateQuotation' && <CreateQuotation setCurrentView={setCurrentView} />}
      {currentView === 'Tax Masters' && <TaxMasters />}
      {currentView === 'Dropdown Masters' && <DropdownMasters />}
      {currentView === 'Reports' && <Reports />}
    </DashboardLayout>
  );
}

export default App;
