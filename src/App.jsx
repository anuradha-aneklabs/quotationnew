import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Clients from './pages/Clients';
import Quotations from './pages/Quotations';
import CreateQuotation from './pages/CreateQuotation';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('Dashboard');
  const [editQuotationId, setEditQuotationId] = useState(null);

  const handleEditQuotation = (id) => {
    setEditQuotationId(id);
    setCurrentView('CreateQuotation');
  };

  const handleCreateNew = () => {
    setEditQuotationId(null);
    setCurrentView('CreateQuotation');
  };

  return (
    <DashboardLayout currentView={currentView} setCurrentView={setCurrentView}>
      {currentView === 'Dashboard' && <Dashboard />}
      {currentView === 'Employees' && <Employees />}
      {currentView === 'Clients' && <Clients />}
      {currentView === 'Quotations' && <Quotations setCurrentView={setCurrentView} onEditQuotation={handleEditQuotation} onCreateNew={handleCreateNew} />}
      {currentView === 'CreateQuotation' && <CreateQuotation setCurrentView={setCurrentView} editId={editQuotationId} />}
    </DashboardLayout>
  );
}

export default App;
