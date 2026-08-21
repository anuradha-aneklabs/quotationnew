import React from 'react';

export default function Checkbox({ checked, onChange, disabled, className = '' }) {
  return (
    <div 
      className={`relative flex items-center justify-center w-[16px] h-[16px] rounded-[3px] cursor-pointer transition-colors ${
        checked 
          ? 'bg-[#1A9F9A] border-[#1A9F9A]' 
          : 'bg-white border-[#E6EBEB]'
      } border ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={(e) => {
        if (!disabled && onChange) {
          e.stopPropagation();
          onChange(!checked);
        }
      }}
    >
      {checked && (
        <svg 
          width="10" 
          height="8" 
          viewBox="0 0 10 8" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M1.5 4.5L3.5 6.5L8.5 1.5" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
