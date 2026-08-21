import React from 'react';

export default function FormTextarea({
  label,
  required,
  error,
  labelClassName = "block text-[14px] font-normal text-black mb-2",
  className = "",
  ...props
}) {
  const textareaBg = className.includes('bg-') ? '' : 'bg-[#FAFAFA]';
  const textareaPy = className.includes('py-') ? '' : 'py-3';
  const baseTextareaClass = `w-full px-3 ${textareaPy} ${textareaBg} rounded-lg border text-sm focus:outline-none focus:ring-2 transition-colors resize-none`;
  const errorClass = error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#1A9F9A] focus:ring-[#1A9F9A]/20';

  return (
    <div>
      {label && (
        <label className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        className={`${baseTextareaClass} ${errorClass} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
