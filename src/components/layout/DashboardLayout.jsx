import React from 'react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children, currentView, setCurrentView }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pt-6 px-6 pb-0">
          <div className=" mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
