// // components/common/VoiceInputButton.jsx
// import React from 'react';
// import { Mic, MicOff } from 'lucide-react';

// export const VoiceInputButton = ({ 
//   isListening, 
//   isSupported = true, 
//   onClick, 
//   disabled = false,
//   size = 'sm',
//   variant = 'primary'
// }) => {
//   const getSizeClasses = () => {
//     switch (size) {
//       case 'xs':
//         return 'px-2 py-1 text-xs';
//       case 'sm':
//         return 'px-3 py-1 text-xs';
//       case 'md':
//         return 'px-4 py-2 text-sm';
//       case 'lg':
//         return 'px-6 py-3 text-base';
//       default:
//         return 'px-3 py-1 text-xs';
//     }
//   };

//   const getVariantClasses = () => {
//     if (!isSupported) {
//       return 'bg-gray-100 text-gray-400 cursor-not-allowed';
//     }

//     switch (variant) {
//       case 'primary':
//         return isListening 
//           ? 'bg-red-100 text-red-700 border-red-200' 
//           : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
//       case 'secondary':
//         return isListening 
//           ? 'bg-red-50 text-red-600 border-red-300' 
//           : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-300';
//       case 'success':
//         return isListening 
//           ? 'bg-red-100 text-red-700 border-red-200' 
//           : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
//       default:
//         return isListening 
//           ? 'bg-red-100 text-red-700 border-red-200' 
//           : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
//     }
//   };

//   if (!isSupported) {
//     return (
//       <button
//         type="button"
//         disabled
//         className={`flex items-center space-x-2 rounded-md transition-colors cursor-not-allowed border ${getSizeClasses()} ${getVariantClasses()}`}
//         title="Voice input not supported in this browser"
//       >
//         <MicOff className="h-3 w-3" />
//         <span>Not Supported</span>
//       </button>
//     );
//   }

//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center space-x-2 rounded-md transition-colors border ${getSizeClasses()} ${getVariantClasses()} ${
//         disabled ? 'opacity-50 cursor-not-allowed' : ''
//       }`}
//       title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
//     >
//       <Mic className={`h-3 w-3 ${isListening ? 'animate-pulse' : ''}`} />
//       <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
//     </button>
//   );
// };

// // components/common/VoiceInputField.jsx - Complete field with voice input
// import React from 'react';
// import { FormField } from './FormField';
// import { VoiceInputButton } from './VoiceInputButton';
// import { useVoiceInput } from '../../hooks/useVoiceInput';

// export const VoiceInputField = ({ 
//   label,
//   name,
//   value,
//   onChange,
//   placeholder,
//   rows = 3,
//   required = false,
//   error,
//   voiceOptions = {},
//   showToast // Function to show toast messages
// }) => {
//   const handleVoiceResult = (transcript, appendToExisting) => {
//     const newValue = appendToExisting && value 
//       ? value + (value ? ' ' : '') + transcript 
//       : transcript;
    
//     // Create a synthetic event to match FormField expectations
//     const syntheticEvent = {
//       target: {
//         name: name,
//         value: newValue
//       }
//     };
    
//     onChange(syntheticEvent);
//   };

//   const handleVoiceError = (error) => {
//     if (showToast) {
//       showToast(error, 'error');
//     } else {
//       console.error('Voice input error:', error);
//     }
//   };

//   const { isListening, isSupported, startListening } = useVoiceInput(
//     handleVoiceResult,
//     handleVoiceError
//   );

//   const handleVoiceClick = () => {
//     startListening({
//       continuous: false,
//       interimResults: false,
//       lang: voiceOptions.lang || 'en-IN',
//       appendToExisting: voiceOptions.appendToExisting !== false,
//       maxAlternatives: voiceOptions.maxAlternatives || 1
//     });
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <label className="block text-sm font-medium text-gray-700">
//           {label} {required && <span className="text-red-500">*</span>}
//         </label>
//         <VoiceInputButton
//           isListening={isListening}
//           isSupported={isSupported}
//           onClick={handleVoiceClick}
//           size="sm"
//           variant="primary"
//         />
//       </div>
//       <textarea
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder || `Enter ${label.toLowerCase()} (or use voice input)`}
//         rows={rows}
//         required={required}
//         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//           error ? 'border-red-300' : 'border-gray-300'
//         }`}
//       />
//       {error && (
//         <p className="mt-1 text-sm text-red-600">{error}</p>
//       )}
//     </div>
//   );
// };

// components/common/VoiceInputButton.jsx
import React from 'react';
import { Mic, MicOff } from 'lucide-react';

export const VoiceInputButton = ({ 
  isListening, 
  isSupported = true, 
  onClick, 
  disabled = false,
  size = 'sm',
  variant = 'primary',
  currentLang = 'ta-IN' // Added current language
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs';
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  const getVariantClasses = () => {
    if (!isSupported) {
      return 'bg-gray-100 text-gray-400 cursor-not-allowed';
    }

    switch (variant) {
      case 'primary':
        return isListening 
          ? 'bg-red-100 text-red-700 border-red-200 shadow-md' 
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
      case 'secondary':
        return isListening 
          ? 'bg-red-50 text-red-600 border-red-300' 
          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-300';
      case 'success':
        return isListening 
          ? 'bg-red-100 text-red-700 border-red-200' 
          : 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
      default:
        return isListening 
          ? 'bg-red-100 text-red-700 border-red-200' 
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
    }
  };

  const getLangLabel = () => {
    return currentLang === 'ta-IN' ? 'தமிழ்' : 'EN';
  };

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className={`flex items-center space-x-2 rounded-md transition-colors cursor-not-allowed border ${getSizeClasses()} ${getVariantClasses()}`}
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-3 w-3" />
        <span>Not Supported</span>
      </button>
    );
  }

  return (
    // <button
    //   type="button"
    //   onClick={onClick}
    //   disabled={disabled}
    //   className={`flex items-center space-x-2 rounded-md transition-all duration-200 border ${getSizeClasses()} ${getVariantClasses()} ${
    //     disabled ? 'opacity-50 cursor-not-allowed' : ''
    //   }`}
    //   title={isListening ? 'Click to stop listening' : `Click to start voice input (${getLangLabel()})`}
    // >
    //   <Mic className={`h-3.5 w-3.5 ${isListening ? 'animate-pulse' : ''}`} />
    //   <span className="font-medium">
    //     {isListening ? 'Stop' : `Voice (${getLangLabel()})`}
    //   </span>
    // </button>
    <div>
      
    </div>
  );
};