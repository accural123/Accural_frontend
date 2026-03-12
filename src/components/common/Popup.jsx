// // components/common/Popup.jsx
// import React, { useEffect } from 'react';
// import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

// export const Popup = ({ 
//   isOpen, 
//   onClose, 
//   title, 
//   children, 
//   type = 'default',
//   size = 'md',
//   showCloseButton = true,
//   closeOnOverlayClick = true,
//   closeOnEscape = true,
//    hideConfirm = false
// }) => {
//   // Handle escape key
//   useEffect(() => {
//     if (!isOpen || !closeOnEscape) return;
    
//     const handleEscape = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       }
//     };
    
//     document.addEventListener('keydown', handleEscape);
//     return () => document.removeEventListener('keydown', handleEscape);
//   }, [isOpen, closeOnEscape, onClose]);

//   // Prevent body scroll when popup is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   const getTypeStyles = () => {
//     switch (type) {
//       case 'success':
//         return {
//           headerBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
//           icon: CheckCircle,
//           iconColor: 'text-green-600'
//         };
//       case 'warning':
//         return {
//           headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
//           icon: AlertTriangle,
//           iconColor: 'text-yellow-600'
//         };
//       case 'error':
//         return {
//           headerBg: 'bg-gradient-to-r from-red-500 to-pink-500',
//           icon: AlertCircle,
//           iconColor: 'text-red-600'
//         };
//       case 'info':
//         return {
//           headerBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
//           icon: Info,
//           iconColor: 'text-blue-600'
//         };
//       default:
//         return {
//           headerBg: 'bg-gradient-to-r from-slate-500 to-gray-500',
//           icon: null,
//           iconColor: 'text-gray-600'
//         };
//     }
//   };

//   const getSizeStyles = () => {
//     switch (size) {
//       case 'sm':
//         return 'max-w-md';
//       case 'lg':
//         return 'max-w-2xl';
//       case 'xl':
//         return 'max-w-4xl';
//       case 'full':
//         return 'max-w-7xl mx-4';
//       default:
//         return 'max-w-lg';
//     }
//   };

//   const { headerBg, icon: Icon, iconColor } = getTypeStyles();
//   const sizeClass = getSizeStyles();

//   const handleOverlayClick = (e) => {
//     if (closeOnOverlayClick && e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay */}
//       <div 
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
//         onClick={handleOverlayClick}
//       />
      
//       {/* Modal */}
//       <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/60 ${sizeClass} w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
//         {/* Header */}
//         {title && (
//           <div className={`${headerBg} px-6 py-4 flex items-center justify-between`}>
//             <div className="flex items-center space-x-3">
//               {Icon && <Icon className="h-6 w-6 text-white" />}
//               <h2 className="text-xl font-semibold text-white">{title}</h2>
//             </div>
//             {showCloseButton && (
//               <button
//                 onClick={onClose}
//                 className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
//                 title="Close"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             )}
//           </div>
//         )}
        
//         {/* Content */}
//         <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
//           {children}
//         </div>
        
//         {/* Close button if no title */}
//         {!title && showCloseButton && (
//           <button
//             onClick={onClose}
//             className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg z-10"
//             title="Close"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Confirmation Dialog Component
// export const ConfirmDialog = ({ 
//   isOpen, 
//   onClose, 
//   onConfirm, 
//   title = "Confirm Action", 
//   message, 
//   confirmText = "Confirm", 
//   cancelText = "Cancel",
//   type = 'warning',
//   loading = false 
// }) => {
//   const handleConfirm = async () => {
//     if (onConfirm) {
//       await onConfirm();
//     }
//     onClose();
//   };

//   return (
//     <Popup 
//       isOpen={isOpen} 
//       onClose={onClose} 
//       title={title} 
//       type={type} 
//       size="sm"
//       closeOnOverlayClick={!loading}
//       closeOnEscape={!loading}
//     >
//       <div className="p-6">
//         <p className="text-gray-700 mb-6 text-lg">{message}</p>
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {cancelText}
//           </button>
//           <button
//             onClick={handleConfirm}
//             disabled={loading}
//             className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
//               type === 'error' 
//                 ? 'bg-red-500 hover:bg-red-600' 
//                 : type === 'warning'
//                 ? 'bg-yellow-500 hover:bg-yellow-600'
//                 : 'bg-blue-500 hover:bg-blue-600'
//             }`}
//           >
//             {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
//             <span>{confirmText}</span>
//           </button>
//         </div>
//       </div>
//     </Popup>
//   );
// };

// // Hook for managing popup state
// export const usePopup = () => {
//   const [popupState, setPopupState] = React.useState({
//     isOpen: false,
//     type: 'default',
//     title: '',
//     content: null,
//     size: 'md'
//   });

//   const openPopup = (config) => {
//     setPopupState({
//       isOpen: true,
//       type: config.type || 'default',
//       title: config.title || '',
//       content: config.content || null,
//       size: config.size || 'md'
//     });
//   };

//   const closePopup = () => {
//     setPopupState(prev => ({ ...prev, isOpen: false }));
//   };

//   return {
//     popupState,
//     openPopup,
//     closePopup
//   };
// };

// // Hook for confirmation dialogs
// export const useConfirmDialog = () => {
//   const [dialogState, setDialogState] = React.useState({
//     isOpen: false,
//     title: '',
//     message: '',
//     onConfirm: null,
//     confirmText: 'Confirm',
//     cancelText: 'Cancel',
//     type: 'warning',
//     loading: false
//   });

//   const showConfirmDialog = (config) => {
//     return new Promise((resolve) => {
//       setDialogState({
//         isOpen: true,
//         title: config.title || 'Confirm Action',
//         message: config.message || '',
//         confirmText: config.confirmText || 'Confirm',
//         cancelText: config.cancelText || 'Cancel',
//         type: config.type || 'warning',
//         loading: false,
//         onConfirm: () => {
//           setDialogState(prev => ({ ...prev, loading: true }));
//           resolve(true);
//         }
//       });
//     });
//   };

//   const closeDialog = () => {
//     setDialogState(prev => ({ ...prev, isOpen: false, loading: false }));
//   };

//   return {
//     dialogState,
//     showConfirmDialog,
//     closeDialog
//   };
// };

import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

export const Popup = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  type = 'default',
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          headerBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'warning':
        return {
          headerBg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        };
      case 'error':
        return {
          headerBg: 'bg-gradient-to-r from-red-500 to-pink-500',
          icon: AlertCircle,
          iconColor: 'text-red-600'
        };
      case 'info':
        return {
          headerBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          icon: Info,
          iconColor: 'text-blue-600'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-slate-500 to-gray-500',
          icon: null,
          iconColor: 'text-gray-600'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-7xl mx-4';
      default:
        return 'max-w-lg';
    }
  };

  const { headerBg, icon: Icon, iconColor } = getTypeStyles();
  const sizeClass = getSizeStyles();

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
      />
      
      {/* Modal */}
      <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/60 ${sizeClass} w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        {title && (
          <div className={`${headerBg} px-6 py-4 flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              {Icon && <Icon className="h-6 w-6 text-white" />}
              <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/20 rounded-lg"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
        
        {/* Close button if no title */}
        {!title && showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg z-10"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

// Confirmation Dialog Component
export const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = 'warning',
  loading = false,
  hideConfirm = false // New prop to hide confirm button
}) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onClose();
  };

  return (
    <Popup 
      isOpen={isOpen} 
      onClose={onClose} 
      title={title} 
      type={type} 
      size="sm"
      closeOnOverlayClick={!loading}
      closeOnEscape={!loading}
    >
      <div className="p-6">
        <p className="text-gray-700 mb-6 text-lg">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          {!hideConfirm && (
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                type === 'error' 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : type === 'warning'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
              <span>{confirmText}</span>
            </button>
          )}
        </div>
      </div>
    </Popup>
  );
};

// Hook for managing popup state
export const usePopup = () => {
  const [popupState, setPopupState] = React.useState({
    isOpen: false,
    type: 'default',
    title: '',
    content: null,
    size: 'md'
  });

  const openPopup = (config) => {
    setPopupState({
      isOpen: true,
      type: config.type || 'default',
      title: config.title || '',
      content: config.content || null,
      size: config.size || 'md'
    });
  };

  const closePopup = () => {
    setPopupState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    popupState,
    openPopup,
    closePopup
  };
};

// Hook for confirmation dialogs
export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = React.useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    type: 'warning',
    loading: false,
    hideConfirm: false // New property
  });

  const showConfirmDialog = (config) => {
    return new Promise((resolve) => {
      setDialogState({
        isOpen: true,
        title: config.title || 'Confirm Action',
        message: config.message || '',
        confirmText: config.confirmText || 'Confirm',
        cancelText: config.cancelText || 'Cancel',
        type: config.type || 'warning',
        hideConfirm: config.hideConfirm || false, // Support hideConfirm in config
        loading: false,
        onConfirm: () => {
          setDialogState(prev => ({ ...prev, loading: true }));
          resolve(true);
        }
      });
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false, loading: false }));
  };

  return {
    dialogState,
    showConfirmDialog,
    closeDialog
  };
};