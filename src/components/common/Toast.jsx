import React, { useEffect } from 'react';
import { X, Check, AlertTriangle, Info } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: <Check className="h-5 w-5" />,
          border: 'border-green-200'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-500 to-rose-500',
          icon: <X className="h-5 w-5" />,
          border: 'border-red-200'
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-500',
          icon: <AlertTriangle className="h-5 w-5" />,
          border: 'border-amber-200'
        };
      case 'info':
        return {
          bg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: <Info className="h-5 w-5" />,
          border: 'border-blue-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-slate-500 to-gray-500',
          icon: <Info className="h-5 w-5" />,
          border: 'border-slate-200'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${config.bg} text-white px-6 py-4 rounded-xl shadow-2xl border ${config.border} backdrop-blur-sm max-w-md`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {config.icon}
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm leading-5">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <div className="mt-3 w-full bg-white/20 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-white/60 rounded-full animate-progress" 
            style={{
              animation: 'progress 4s linear forwards'
            }}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes slide-in-from-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-right {
          animation-name: slide-in-from-right;
        }
      `}</style>
    </div>
  );
};

export default Toast;