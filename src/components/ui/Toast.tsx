import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  text: string;
  variant?: 'default' | 'success';
}

interface ToastContextType {
  show: (text: string, variant?: 'default' | 'success') => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((text: string, variant: 'default' | 'success' = 'default') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, text, variant }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`toast-item ${toast.variant === 'success' ? 'toast-success' : ''}`}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return { show: () => {} };
  }
  return context;
}

export function Toast({ message, onClose }: { message: string; onClose?: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-item">
      {message}
    </div>
  );
}
