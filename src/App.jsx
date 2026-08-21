import React, { useState, useEffect } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Clients from './pages/Clients';
import Companies from './pages/Companies';
import Quotations from './pages/Quotations';
import CreateQuotation from './pages/CreateQuotation';
import TaxMasters from './pages/TaxMasters';
import DropdownMasters from './pages/DropdownMasters';
import Login from './pages/Login';
import Reports from './pages/Reports';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'Dashboard';
  });
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [editQuotationId, setEditQuotationId] = useState(() => {
    const saved = localStorage.getItem('editQuotationId');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    if (editQuotationId) {
      localStorage.setItem('editQuotationId', JSON.stringify(editQuotationId));
    } else {
      localStorage.removeItem('editQuotationId');
    }
  }, [editQuotationId]);

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
    <ToastProvider>
      <DashboardLayout currentView={currentView} setCurrentView={setCurrentView} setToken={setToken}>
        {currentView === 'Dashboard' && <Dashboard />}
        {currentView === 'Employees' && <Employees />}
        {currentView === 'Clients' && <Clients />}
        {currentView === 'Quotations' && <Quotations setCurrentView={setCurrentView} onEditQuotation={(id) => { setEditQuotationId(id); setCurrentView('CreateQuotation'); }} onCreateNew={() => { setEditQuotationId(null); setCurrentView('CreateQuotation'); }} />}
        {currentView === 'CreateQuotation' && <CreateQuotation setCurrentView={setCurrentView} editId={editQuotationId} />}
        {currentView === 'Companies' && <Companies />}
        {currentView === 'Tax Masters' && <TaxMasters />}
        {currentView === 'Dropdown Masters' && <DropdownMasters />}
        {currentView === 'Reports' && <Reports />}
      </DashboardLayout>
    </ToastProvider>
  );
}

export default App;
