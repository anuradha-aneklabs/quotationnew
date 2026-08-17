import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast({ id, message, type = 'success', onClose }) {
  const [progress, setProgress] = React.useState(100);

  useEffect(() => {
    // Start progress bar animation
    const raf = requestAnimationFrame(() => {
      // Need a tiny delay for transition to register after initial mount
      setTimeout(() => setProgress(0), 10);
    });

    const timer = setTimeout(() => {
      onClose(id);
    }, 3000); // auto dismiss after 3 seconds

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const bgs = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  };

  return (
    <div className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg border ${bgs[type]} animate-in fade-in slide-in-from-top-2 duration-300 relative`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {icons[type]}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-900">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Animated Progress Line */}
      <div className="h-[3px] w-full bg-black/5 absolute bottom-0 left-0">
        <div 
          className={`h-full transition-all duration-[3000ms] ease-linear ${progressColors[type]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
