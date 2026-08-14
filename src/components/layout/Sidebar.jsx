import React, { useState } from 'react';
import { 
  Home, 
  FileText, 
  Briefcase, 
  Users, 
  UserPlus, 
  BookOpen, 
  AlignLeft, 
  Coins, 
  LayoutTemplate, 
  Layers, 
  BarChart2, 
  CheckCircle, 
  Settings, 
  LogOut,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import logo from '../../assets/logo.png';

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Quotations', icon: FileText },
  { name: 'Proposals', icon: Briefcase },
  { name: 'Clients', icon: Users },
  { name: 'Employees', icon: UserPlus },
  { name: 'Scope Library', icon: BookOpen },
  { name: 'Standard Clauses', icon: AlignLeft },
  { name: 'Currency Master', icon: Coins },
  { name: 'Templates', icon: LayoutTemplate },
  { 
    name: 'Masters', 
    icon: Layers, 
    hasSubmenu: true,
    subItems: [
      { name: 'Tax Masters' },
      { name: 'Dropdown Masters' }
    ]
  },
  { name: 'Reports', icon: BarChart2 },
  { name: 'Approvals', icon: CheckCircle },
  { name: 'Settings', icon: Settings },
];

export default function Sidebar({ currentView, setCurrentView, setToken }) {
  const [expandedMenus, setExpandedMenus] = useState({
    'Masters': currentView === 'Tax Masters' || currentView === 'Dropdown Masters'
  });

  const toggleSubmenu = (name) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 hidden md:flex">
      <div className="h-16 flex items-center px-6 mt-2 mb-4 ">
        <img src={logo} alt="ANEKA QuotePro" className="h-20 w-50" />
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
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
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
                        className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          isSubActive 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div className="w-5 flex justify-center mr-3">
                          {isSubActive ? (
                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
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

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            if (setToken) setToken(null);
          }}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </button>
      </div>
    </aside>
  );
}
