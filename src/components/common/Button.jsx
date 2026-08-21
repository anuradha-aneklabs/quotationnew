import React from 'react';

export default function Button({
  type = 'button',
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center px-5 py-2.5 text-[14px] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-[#1A9F9A] hover:bg-teal-600 focus:ring-teal-500',
    secondary: 'text-gray-700 bg-[#FAFAFA] border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
