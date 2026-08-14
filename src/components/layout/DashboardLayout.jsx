import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';
import logo from '../../assets/logo.png';

export default function DashboardLayout({ children, currentView, setCurrentView, setToken }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-6 px-4 md:px-6 pb-0">
          <div className=" mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
