import React from 'react';
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
  ChevronDown
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
  { name: 'Masters', icon: Layers, hasSubmenu: true },
  { name: 'Reports', icon: BarChart2 },
  { name: 'Approvals', icon: CheckCircle },
  { name: 'Settings', icon: Settings },
];

export default function Sidebar({ currentView, setCurrentView }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0 hidden md:flex">
      <div className="h-16 flex items-center px-6 mt-2 mb-4 ">
        <img src={logo} alt="ANEKA QuotePro" className="h-20 w-50" />
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = currentView === item.name;
          return (
            <a
              key={item.name}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (setCurrentView) setCurrentView(item.name);
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
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </a>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <a
          href="#"
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Logout
        </a>
      </div>
    </aside>
  );
}
