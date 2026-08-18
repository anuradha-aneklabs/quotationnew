import React from 'react';
import clientIcon from '../../../assets/addQuotationSteper/client info.svg';
import proposalIcon from '../../../assets/addQuotationSteper/proposal info.svg';
import moduleIcon from '../../../assets/addQuotationSteper/module management.svg';
import commercialIcon from '../../../assets/addQuotationSteper/commercial.svg';
import timelineIcon from '../../../assets/addQuotationSteper/timeline.svg';
import previewIcon from '../../../assets/addQuotationSteper/preview.svg';

const steps = [
  { id: 1, label: 'Client Details', icon: clientIcon },
  { id: 2, label: 'Proposal Details', icon: proposalIcon },
  { id: 3, label: 'Module Management', icon: moduleIcon },
  { id: 4, label: 'Commercial', icon: commercialIcon },
  { id: 5, label: 'Timeline', icon: timelineIcon },
  { id: 6, label: 'Preview', icon: previewIcon },
];

export default function QuotationStepper({ currentStep }) {
  return (
    <div className="w-full pt-6 pb-12 mb-2 relative z-0 overflow-visible">
      <div className="flex items-center justify-between w-[85%] max-w-[850px] mx-auto relative">
        {/* Connector Line Background (Zigzag for upcoming) */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[6px] -z-10" 
          style={{ 
            left: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='6' viewBox='0 0 12 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 3 L3 0 L9 6 L12 3' fill='none' stroke='%23d1d5db' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'left center'
          }}
        />
        
        {/* Active Connector Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#00bda5] -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const isDone = isActive || isCompleted;

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              <div
                className={`flex items-center justify-center w-[40px] h-[40px] rounded-full border-[2px] bg-white transition-colors z-10
                  ${isDone ? 'border-[#00bda5]' : 'border-gray-200'}`}
              >
                <img 
                  src={step.icon} 
                  alt={step.label} 
                  className={`w-4 h-4 object-contain ${!isDone ? 'opacity-40 grayscale' : ''}`} 
                />
              </div>
              
              <span
                className="absolute top-[50px] text-gray-800 text-[12px] font-medium whitespace-nowrap text-center"
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
