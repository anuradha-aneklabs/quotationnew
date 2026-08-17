import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, label: 'Client Info' },
  { id: 2, label: 'Proposal Details' },
  { id: 3, label: 'Module Management' },
  { id: 4, label: 'Commercial' },
  { id: 5, label: 'Timeline' },
  { id: 6, label: 'Preview' },
];

export default function QuotationStepper({ currentStep }) {
  return (
    <div className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between shadow-sm mb-4 overflow-x-auto">
      <div className="flex items-center w-full min-w-max">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <React.Fragment key={step.id}>
              <div className="flex items-center relative group shrink-0">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors
                    ${isActive || isCompleted ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span
                  className={`ml-2 whitespace-nowrap text-sm font-medium
                    ${isActive || isCompleted ? 'text-indigo-600' : 'text-gray-400'}`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-px mx-4 transition-colors min-w-[20px] ${isCompleted ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
