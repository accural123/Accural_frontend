// import React, { useState, useRef, useEffect } from 'react';
// import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
// import ErrorMessage from './ErrorMessage';

// const VoiceInput = ({
//   onTranscript,
//   onError,
//   language = 'en-IN',
//   continuous = false,
//   interimResults = false,
//   className = '',
//   buttonSize = 'md',
//   showStatus = true,
//   autoStop = true,
//   maxDuration = 30000, // 30 seconds max recording
//   placeholder = 'Click microphone to start recording...',
//   disabled = false
// }) => {
//   const [isListening, setIsListening] = useState(false);
//   const [isSupported, setIsSupported] = useState(true);
//   const [error, setError] = useState('');
//   const [transcript, setTranscript] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const recognitionRef = useRef(null);
//   const timeoutRef = useRef(null);

//   // Check browser support on mount
//   useEffect(() => {
//     const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
//     setIsSupported(supported);
    
//     if (!supported) {
//       setError('Speech recognition not supported in this browser');
//       onError?.('Speech recognition not supported in this browser');
//     }
//   }, [onError]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current);
//       }
//     };
//   }, []);

//   const startListening = () => {
//     if (!isSupported || disabled) return;

//     try {
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       const recognition = new SpeechRecognition();
      
//       recognitionRef.current = recognition;
      
//       // Configure recognition
//       recognition.continuous = continuous;
//       recognition.interimResults = interimResults;
//       recognition.lang = language;
//       recognition.maxAlternatives = 1;

//       // Event handlers
//       recognition.onstart = () => {
//         setIsListening(true);
//         setError('');
//         setTranscript('');
//         setConfidence(0);
        
//         // Auto-stop after maxDuration if autoStop is enabled
//         if (autoStop) {
//           timeoutRef.current = setTimeout(() => {
//             stopListening();
//           }, maxDuration);
//         }
//       };

//       recognition.onresult = (event) => {
//         let finalTranscript = '';
//         let interimTranscript = '';
        
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//           const result = event.results[i];
//           const transcript = result[0].transcript;
          
//           if (result.isFinal) {
//             finalTranscript += transcript;
//             setConfidence(result[0].confidence);
//           } else {
//             interimTranscript += transcript;
//           }
//         }
        
//         const fullTranscript = finalTranscript || interimTranscript;
//         setTranscript(fullTranscript);
        
//         // Call the callback with the transcript
//         if (finalTranscript && onTranscript) {
//           onTranscript(finalTranscript, result[0]?.confidence || 0);
//         }
//       };

//       recognition.onerror = (event) => {
//         let errorMessage = 'Speech recognition error';
        
//         switch (event.error) {
//           case 'no-speech':
//             errorMessage = 'No speech detected. Please try again.';
//             break;
//           case 'audio-capture':
//             errorMessage = 'Microphone not accessible. Please check permissions.';
//             break;
//           case 'not-allowed':
//             errorMessage = 'Microphone access denied. Please allow microphone permissions.';
//             break;
//           case 'network':
//             errorMessage = 'Network error occurred. Please check your connection.';
//             break;
//           case 'service-not-allowed':
//             errorMessage = 'Speech service not allowed. Please try again.';
//             break;
//           default:
//             errorMessage = `Speech recognition error: ${event.error}`;
//         }
        
//         setError(errorMessage);
//         setIsListening(false);
//         onError?.(errorMessage);
        
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//         }
//       };

//       recognition.onend = () => {
//         setIsListening(false);
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current);
//         }
//       };

//       // Start recognition
//       recognition.start();
      
//     } catch (err) {
//       const errorMessage = 'Failed to initialize speech recognition';
//       setError(errorMessage);
//       setIsListening(false);
//       onError?.(errorMessage);
//     }
//   };

//   const stopListening = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       recognitionRef.current = null;
//     }
    
//     if (timeoutRef.current) {
//       clearTimeout(timeoutRef.current);
//       timeoutRef.current = null;
//     }
    
//     setIsListening(false);
//   };

//   const toggleListening = () => {
//     if (isListening) {
//       stopListening();
//     } else {
//       startListening();
//     }
//   };

//   // Button size variants
//   const sizeClasses = {
//     sm: 'h-8 w-8 text-xs',
//     md: 'h-10 w-10 text-sm',
//     lg: 'h-12 w-12 text-base'
//   };

//   const iconSizes = {
//     sm: 'h-3 w-3',
//     md: 'h-4 w-4',
//     lg: 'h-5 w-5'
//   };

//   if (!isSupported) {
//     return (
//       <div className={`flex items-center space-x-2 ${className}`}>
//         <button
//           disabled
//           className={`${sizeClasses[buttonSize]} bg-gray-200 text-gray-400 rounded-full flex items-center justify-center cursor-not-allowed`}
//           title="Speech recognition not supported"
//         >
//           <MicOff className={iconSizes[buttonSize]} />
//         </button>
//         {showStatus && (
//           <span className="text-xs text-red-500">Not supported</span>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className={`flex flex-col space-y-2 ${className}`}>
//       <div className="flex items-center space-x-2">
//         <button
//           type="button"
//           onClick={toggleListening}
//           disabled={disabled}
//           className={`${sizeClasses[buttonSize]} rounded-full flex items-center justify-center transition-all duration-200 ${
//             disabled
//               ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//               : isListening
//               ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse shadow-lg'
//               : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
//           }`}
//           title={isListening ? 'Stop recording' : 'Start voice input'}
//         >
//           {isListening ? (
//             <MicOff className={iconSizes[buttonSize]} />
//           ) : (
//             <Mic className={iconSizes[buttonSize]} />
//           )}
//         </button>
        
//         {showStatus && (
//           <div className="flex flex-col">
//             <span className={`text-xs font-medium ${
//               isListening 
//                 ? 'text-red-600' 
//                 : error 
//                 ? 'text-red-500' 
//                 : 'text-gray-500'
//             }`}>
//               {isListening 
//                 ? 'Listening...' 
//                 : error 
//                 ? 'Error' 
//                 : 'Ready'}
//             </span>
            
//             {confidence > 0 && (
//               <span className="text-xs text-gray-400">
//                 Confidence: {Math.round(confidence * 100)}%
//               </span>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Live transcript display */}
//       {transcript && showStatus && (
//         <div className="bg-blue-50 border border-blue-200 rounded-md p-2">
//           <p className="text-sm text-blue-800">{transcript}</p>
//         </div>
//       )}
      

//    <ErrorDisplay error={error} onClear={clearError} />
      
//       {/* Recording indicator */}
//       {isListening && (
//         <div className="flex items-center space-x-2">
//           <div className="flex space-x-1">
//             <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
//             <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
//             <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
//           </div>
//           <span className="text-xs text-gray-500">
//             Recording... (max {maxDuration / 1000}s)
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VoiceInput;
// components/common/VoiceInputField.jsx
import React, { useState } from 'react';
import { VoiceInputButton } from './VoiceInputButton';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { Languages } from 'lucide-react';

export const VoiceInputField = ({ 
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
  voiceOptions = {},
  showToast, // Function to show toast messages
  showLangToggle = true // Show language toggle button
}) => {
  const [currentLang, setCurrentLang] = useState(voiceOptions.lang || 'ta-IN');

  const handleVoiceResult = (transcript, appendToExisting) => {
    const newValue = appendToExisting && value 
      ? value + (value ? ' ' : '') + transcript 
      : transcript;
    
    // Create a synthetic event to match FormField expectations
    const syntheticEvent = {
      target: {
        name: name,
        value: newValue
      }
    };
    
    onChange(syntheticEvent);
  };

  const handleVoiceError = (error) => {
    if (showToast) {
      showToast(error, 'error');
    } else {
      console.error('Voice input error:', error);
    }
  };

  const { isListening, isSupported, startListening, stopListening } = useVoiceInput(
    handleVoiceResult,
    handleVoiceError
  );

  const handleVoiceClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening({
        continuous: false,
        interimResults: false,
        lang: currentLang,
        appendToExisting: voiceOptions.appendToExisting !== false,
        maxAlternatives: voiceOptions.maxAlternatives || 1
      });
    }
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'ta-IN' ? 'en-IN' : 'ta-IN');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex items-center space-x-2">
          {showLangToggle && isSupported && (
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 transition-colors"
              title="Switch language"
            >
              {/* <Languages className="h-3 w-3" /> */}
              {/* <span className="font-medium">{currentLang === 'ta-IN' ? 'தமிழ்' : 'EN'}</span> */}
            </button>
          )}
          <VoiceInputButton
            isListening={isListening}
            isSupported={isSupported}
            onClick={handleVoiceClick}
            currentLang={currentLang}
            size="sm"
            variant="primary"
          />
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || `Enter ${label.toLowerCase()} (or use voice input)`}
        rows={rows}
        required={required}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {isListening && (
        <div className="flex items-center space-x-2 text-xs">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-red-600 font-medium">
            Recording in {currentLang === 'ta-IN' ? 'Tamil (தமிழ்)' : 'English'}... Click Stop to end
          </span>
        </div>
      )}
    </div>
  );
};