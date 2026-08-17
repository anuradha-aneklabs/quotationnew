import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = "Search...", children }) {
  return (
    <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 flex-wrap gap-4">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 sm:text-sm transition-colors"
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
