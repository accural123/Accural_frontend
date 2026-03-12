
import { useState, useCallback, useRef } from 'react';

export const useVoiceInput = (onResult, onError) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef(null);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const startListening = useCallback((options = {}) => {
    const {
      continuous = false,
      interimResults = false,
      lang = 'ta-IN',
      appendToExisting = true,
      maxAlternatives = 1
    } = options;

    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false);
      if (onError) {
        onError('Voice recognition not supported in this browser');
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Configure recognition
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;
    recognition.maxAlternatives = maxAlternatives;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event) => {
      let transcript = '';
      
      // Get the latest result
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      
      if (transcript && onResult) {
        onResult(transcript.trim(), appendToExisting);
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition error. Please try again.';
      switch (event.error) {
        case 'network':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 'not-allowed':
          errorMessage = 'Microphone access denied. Please allow microphone access.';
          break;
        case 'no-speech':
          errorMessage = 'No speech detected. Please try speaking again.';
          break;
        case 'audio-capture':
          errorMessage = 'No microphone found. Please connect a microphone.';
          break;
        default:
          errorMessage = `Speech recognition error: ${event.error}`;
      }
      
      if (onError) {
        onError(errorMessage);
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
      if (onError) {
        onError('Failed to start voice recognition');
      }
    }
  }, [onResult, onError]);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening
  };
};