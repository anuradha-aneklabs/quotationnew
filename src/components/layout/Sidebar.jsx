import React, { useState } from 'react';
import { 
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import logo from '../../assets/peoplexlogo.svg';

import iconDashboard from '../../assets/SideBar/Dashboard.svg';
import iconQuotations from '../../assets/SideBar/Quotation.svg';
import iconProposals from '../../assets/SideBar/Proposals.svg';
import iconClients from '../../assets/SideBar/Clients.svg';
import iconEmployees from '../../assets/SideBar/Empoyee.svg';
import iconScopeLibrary from '../../assets/SideBar/ScopeLibrary.svg';
import iconStandardClauses from '../../assets/SideBar/StandardClause.svg';
import iconCurrencyMaster from '../../assets/SideBar/CurrencyMaster.svg';
import iconTemplates from '../../assets/SideBar/Templates.svg';
import iconMasters from '../../assets/SideBar/Master.svg';
import iconReports from '../../assets/SideBar/Reports.svg';
import iconApprovals from '../../assets/SideBar/Approvals.svg';
import iconSettings from '../../assets/SideBar/Settings.svg';
import iconLogout from '../../assets/SideBar/logout (1).svg';

const navItems = [
  { name: 'Dashboard', icon: iconDashboard },
  { name: 'Quotations', icon: iconQuotations },
  { name: 'Proposals', icon: iconProposals },
  { name: 'Clients', icon: iconClients },
  { name: 'Employees', icon: iconEmployees },
  { name: 'Scope Library', icon: iconScopeLibrary },
  { name: 'Standard Clauses', icon: iconStandardClauses },
  { name: 'Currency Master', icon: iconCurrencyMaster },
  { name: 'Templates', icon: iconTemplates },
  { 
    name: 'Masters', 
    icon: iconMasters, 
    hasSubmenu: true,
    subItems: [
      { name: 'Tax Masters' },
      { name: 'Dropdown Masters' },
      { name: 'Companies' }
    ]
  },
  { name: 'Reports', icon: iconReports },
  { name: 'Approvals', icon: iconApprovals },
  { name: 'Settings', icon: iconSettings },
];

export default function Sidebar({ currentView, setCurrentView, setToken, isOpen, onClose }) {
  const [expandedMenus, setExpandedMenus] = useState({
    'Masters': currentView === 'Tax Masters' || currentView === 'Dropdown Masters' || currentView === 'Companies'
  });

  const toggleSubmenu = (name) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 mt-2 mb-4">
        <img src={logo} alt="ANEKA QuotePro" className="w-[140px] h-auto ml-2" />
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide pb-4">
        {navItems.map((item) => {
          const isActive = currentView === item.name;
          const isExpanded = expandedMenus[item.name];
          
          return (
            <div key={item.name}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.hasSubmenu) {
                    toggleSubmenu(item.name);
                  } else {
                    if (setCurrentView) setCurrentView(item.name);
                  }
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                  isActive 
                    ? 'bg-teal-50 text-teal-600 border-teal-500' 
                    : 'text-gray-600 border-transparent hover:bg-[#ECF4F7] hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <img src={item.icon} alt="" className={`mr-3 h-5 w-5 ${!isActive ? 'opacity-70 grayscale' : ''}`} />
                  {item.name}
                </div>
                {item.hasSubmenu && (
                  isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  )
                )}
              </a>
              
              {/* Submenu rendering */}
              {item.hasSubmenu && isExpanded && (
                <div className="mt-1 space-y-1">
                  {item.subItems.map((subItem) => {
                    const isSubActive = currentView === subItem.name;
                    return (
                      <a
                        key={subItem.name}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (setCurrentView) setCurrentView(subItem.name);
                        }}
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border-l-4 ${
                          isSubActive 
                            ? 'bg-teal-50 text-teal-600 border-teal-500' 
                            : 'text-gray-600 border-transparent hover:bg-[#ECF4F7] hover:text-gray-900'
                        }`}
                      >
                        <div className="w-5 flex justify-center mr-3">
                          {isSubActive ? (
                            <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                          ) : (
                            <div className="w-1.5 h-1.5 border border-gray-400 rounded-sm"></div>
                          )}
                        </div>
                        {subItem.name}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            if (setToken) setToken(null);
          }}
          className="w-full flex items-center px-3 py-2 font-['Instrument_Sans',sans-serif] font-medium text-[15px] leading-[130%] text-[#FF4343] rounded-lg hover:bg-red-50 transition-colors"
        >
          <img src={iconLogout} alt="" className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
      </aside>
    </>
  );
}
