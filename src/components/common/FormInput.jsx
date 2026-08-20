import React from 'react';
import calendarIcon from '../../assets/proposal detail/calendar.svg';

export default function FormInput({
  label,
  required,
  error,
  labelClassName = "block text-[14px] font-normal text-black mb-2",
  className = "",
  type = "text",
  ...props
}) {
  const inputBg = className.includes('bg-') ? '' : 'bg-[#FAFAFA]';
  const inputPy = className.includes('py-') ? '' : 'py-2';
  const paddingRight = type === 'date' ? 'pr-10' : '';
  const baseInputClass = `w-full px-3 ${paddingRight} ${inputPy} ${inputBg} rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors relative`;
  const errorClass = error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100';

  return (
    <div>
      {label && (
        <label className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          className={`${baseInputClass} ${errorClass} ${className} ${type === 'date' ? '[&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-10 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:z-10' : ''}`}
          {...props}
        />
        {type === 'date' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <img src={calendarIcon} alt="calendar" className="w-5 h-5 opacity-70" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
