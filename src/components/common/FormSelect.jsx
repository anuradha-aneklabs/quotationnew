import React from 'react';
import arrowIcon from '../../assets/proposal detail/arrow-down.svg';

export default function FormSelect({
  label,
  required,
  error,
  options,
  labelClassName = "block text-[14px] font-normal text-black mb-2",
  className = "",
  children,
  ...props
}) {
  const selectBg = className.includes('bg-') ? '' : 'bg-[#FAFAFA]';
  const selectPy = className.includes('py-') ? '' : 'py-2';
  const baseSelectClass = `w-full px-3 ${selectPy} pr-10 ${selectBg} rounded-lg border text-[14px] focus:outline-none focus:ring-2 transition-colors appearance-none`;
  const errorClass = error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-purple-500 focus:ring-purple-100';

  return (
    <div>
      {label && (
        <label className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={`${baseSelectClass} ${errorClass} ${className}`}
          {...props}
        >
          {children || options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <img src={arrowIcon} alt="arrow" className="w-4 h-4 opacity-70" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
