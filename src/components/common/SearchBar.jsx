import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search...", children }) {
  return (
    <div className="px-0 py-2 flex items-center justify-between shrink-0 flex-wrap gap-4">
      <div className="flex items-center w-[320px] bg-[#FCFCFB] border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
        <div className="pl-3 pr-2 flex items-center justify-center shrink-0">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-5 w-[1px] bg-gray-300 shrink-0"></div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 pl-2 pr-4 py-2 bg-transparent text-sm focus:outline-none placeholder-[#5F6A80] text-gray-700"
        />
      </div>
      {children && (
        <div className="flex items-center w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {children}
        </div>
      )}
    </div>
  );
}
