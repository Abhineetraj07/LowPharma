import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#1A1A2E',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 9999,
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}>
          {toast}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
