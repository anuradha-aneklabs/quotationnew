import React from 'react';
import calendarIcon from '../../assets/proposal detail/calendar.svg';

export default function DateRangeFilter({ dateFrom, dateTo, onDateFromChange, onDateToChange }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm mx-2">
      <input 
        type="date" 
        value={dateFrom} 
        onChange={(e) => onDateFromChange(e.target.value)}
        className="text-sm text-gray-700 outline-none w-[110px] bg-transparent"
      />
      <span className="text-gray-400 text-sm">-</span>
      <input 
        type="date" 
        value={dateTo} 
        onChange={(e) => onDateToChange(e.target.value)}
        className="text-sm text-gray-700 outline-none w-[110px] bg-transparent"
      />
      <img src={calendarIcon} alt="calendar" className="h-4 w-4 text-gray-400 ml-1 opacity-70" />
    </div>
  );
}
