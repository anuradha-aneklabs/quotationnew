import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div 
        aria-live="assertive" 
        className="pointer-events-none fixed inset-0 flex flex-col items-end px-4 py-6 sm:items-end sm:p-6 z-[100] gap-2"
      >
        {toasts.map((toast) => (
          <Toast 
            key={toast.id} 
            id={toast.id} 
            message={toast.message} 
            type={toast.type} 
            onClose={removeToast} 
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
