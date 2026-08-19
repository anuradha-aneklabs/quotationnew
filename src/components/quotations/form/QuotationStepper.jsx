import React from 'react';
import clientIcon from '../../../assets/addQuotationSteper/client info.svg';
import proposalIcon from '../../../assets/addQuotationSteper/proposal info.svg';
import moduleIcon from '../../../assets/addQuotationSteper/module management.svg';
import commercialIcon from '../../../assets/addQuotationSteper/commercial.svg';
import timelineIcon from '../../../assets/addQuotationSteper/timeline.svg';
import previewIcon from '../../../assets/addQuotationSteper/preview.svg';
import zigzagLineIcon from '../../../assets/addQuotationSteper/steper-zic-zac-line.svg';
import tickIcon from '../../../assets/addQuotationSteper/tick-circle.svg';

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
        {/* Connector Line Background (Wavy for upcoming) */}
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 h-[12px] z-0" 
          style={{ 
            left: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 100, 100)}%`,
            backgroundImage: `url("${zigzagLineIcon}")`,
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'left center',
          }}
        />
        
        {/* Active Connector Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[#1A9F9A] z-0 transition-all duration-300"
          style={{ width: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 100, 100)}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-[42px] h-[42px] rounded-full flex items-center justify-center relative transition-all duration-300
                  ${isCompleted ? 'border-2 border-[#1A9F9A] bg-[#E6F5F4]' : isActive ? 'border-2 border-[#1A9F9A] bg-white shadow-[0_0_10px_rgba(26,159,154,0.2)]' : 'border border-gray-200 bg-white shadow-sm'}
                `}
              >
                {isActive && (
                  <div className="absolute -top-[20px] left-1/2 -translate-x-1/2">
                    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L1.33975 6.75C-0.326922 4.36442 1.3806 1 4.2859 1H5.7141C8.6194 1 10.3269 4.36442 8.66025 6.75L5 12Z" fill="#1A9F9A"/>
                    </svg>
                  </div>
                )}
                {isCompleted ? (
                  <img src={tickIcon} alt="completed" className="w-5 h-5 object-contain transition-all duration-300" />
                ) : isActive ? (
                  <div 
                    className="w-5 h-5 transition-all duration-300 bg-[#1A9F9A]"
                    style={{
                      WebkitMaskImage: `url("${step.icon}")`,
                      WebkitMaskSize: 'contain',
                      WebkitMaskRepeat: 'no-repeat',
                      WebkitMaskPosition: 'center',
                      maskImage: `url("${step.icon}")`,
                      maskSize: 'contain',
                      maskRepeat: 'no-repeat',
                      maskPosition: 'center',
                    }}
                  />
                ) : (
                  <img 
                    src={step.icon} 
                    alt={step.label}
                    className="w-5 h-5 object-contain transition-all duration-300 opacity-40 grayscale"
                  />
                )}
              </div>
              
              <div className="absolute top-[50px] flex flex-col items-center">
                <span
                  className={`text-[12px] font-medium whitespace-nowrap text-center ${isActive ? 'text-[#040715] font-bold' : isCompleted ? 'text-gray-400' : 'text-[#040715]'}`}
                >
                  {step.label}
                </span>
                {isActive && (
                  <div className="w-[18px] h-[2px] bg-[#1A9F9A] mt-[4px] rounded-full" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
