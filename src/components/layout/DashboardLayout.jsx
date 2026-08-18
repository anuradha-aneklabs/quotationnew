import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import logo from '../../assets/peoplexlogo.svg';
import Header from './Header';

export default function DashboardLayout({ children, currentView, setCurrentView, setToken }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getHeaderProps = (view) => {
    switch (view) {
      case 'CreateQuotation': return { title: 'Create New Quotations', breadcrumbs: ['Dashboard', 'Quotations', 'Create New Quotation'] };
      case 'Quotations': return { title: 'Quotations', breadcrumbs: ['Dashboard', 'Quotations'] };
      case 'Dashboard': return { title: 'Dashboard', description: "Welcome back! Here's an overview of your quotation metrics." };
      case 'Employees': return { title: 'Employees', breadcrumbs: ['Dashboard', 'Employees'] };
      case 'Clients': return { title: 'Clients', breadcrumbs: ['Dashboard', 'Clients'] };
      case 'Companies': return { title: 'Companies', breadcrumbs: ['Dashboard', 'Masters', 'Companies'] };
      case 'Tax Masters': return { title: 'Tax Masters', breadcrumbs: ['Dashboard', 'Masters', 'Tax Masters'] };
      case 'Dropdown Masters': return { title: 'Dropdown Masters', breadcrumbs: ['Dashboard', 'Masters', 'Dropdown Masters'] };
      case 'Reports': return { title: 'Reports', breadcrumbs: ['Dashboard', 'Reports'] };
      default: return { title: view, breadcrumbs: ['Dashboard', view] };
    }
  };

  const headerProps = getHeaderProps(currentView);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={(view) => {
          if (setCurrentView) setCurrentView(view);
          setIsMobileMenuOpen(false); // Auto close on mobile navigation
        }} 
        setToken={setToken} 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 shrink-0">
          <img src={logo} alt="ANEKA QuotePro" className="h-10 w-auto" />
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-500 hover:text-gray-900 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Global Desktop Header */}
        <div className="hidden md:block">
          <Header title={headerProps.title} breadcrumbs={headerProps.breadcrumbs} description={headerProps.description} />
        </div>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-6 px-4 md:px-6 pb-0">
          <div className=" mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
