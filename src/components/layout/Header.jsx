import React from 'react';
import searchIcon from '../../assets/Header/search-normal (1).svg';
import notificationIcon from '../../assets/Header/notification.svg';
import { ChevronDown } from 'lucide-react';

export default function Header({ title, breadcrumbs = [], description }) {
  return (
    <header className="bg-white shadow border-b border-gray-100 px-6 py-3 flex items-center justify-between shrink-0 z-10 relative">
      {/* Left side: Title and Breadcrumbs/Description */}
      <div>
        <h1 className="font-Inter font-semibold text-[22px] leading-[140%] text-[#040715]">{title}</h1>
        {description ? (
          <p className="font-Inter font-normal text-[14px] leading-[140%] text-[#46505F] mt-0.5">{description}</p>
        ) : breadcrumbs.length > 0 ? (
          <nav className="flex font-Inter font-normal text-[14px] leading-[140%] text-[#46505F] mt-0.5">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">&gt;</span>}
                <span className={index === breadcrumbs.length - 1 ? 'text-[#46505F] font-medium' : ''}>
                  {crumb}
                </span>
              </span>
            ))}
          </nav>
        ) : null}
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center space-x-6">
        
        {/* Search Bar */}
        <div className="flex items-center w-72 bg-[#FCFCFB] border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-shadow">
          <div className="pl-3 pr-2 flex items-center justify-center shrink-0">
            <img src={searchIcon} alt="Search" className="h-5 w-5 text-gray-400" />
          </div>
          <div className="h-5 w-[1px] bg-gray-200 shrink-0"></div>
          <input
            type="text"
            placeholder="Search here..."
            className="flex-1 pl-2 pr-4 py-2 bg-transparent text-sm focus:outline-none font-Inter text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Notification */}
        <button className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <img src={notificationIcon} alt="Notifications" className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-[#E53935] ring-2 ring-white text-white text-[9px] font-bold flex items-center justify-center leading-none">5</span>
        </button>

        {/* Profile */}
        <div className="flex items-center cursor-pointer pl-2">
          <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold overflow-hidden shrink-0">
            <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="Admin" className="h-full w-full object-cover" />
          </div>
          <div className="ml-3 hidden md:block">
            <p className="font-['Instrument_Sans',sans-serif] font-medium text-[16px] leading-[130%] text-black">Admin</p>
            <p className="font-['Instrument_Sans',sans-serif] font-normal text-[12px] leading-[130%] text-[#46505F]">admin@gmail.com</p>
          </div>
          <ChevronDown className="ml-4 h-5 w-5 text-gray-400" />
        </div>
        
      </div>
    </header>
  );
}
