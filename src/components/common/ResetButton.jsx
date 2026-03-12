import React from 'react';
import { RefreshCw } from 'lucide-react';

export const ResetButton = ({ 
  onClick, 
  loading = false, 
  disabled = false,
  text = "Reset",
  size = "default", // "small", "default", "large"
  variant = "default" // "default", "outline", "ghost"
}) => {
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-2.5",
    large: "px-8 py-3 text-lg"
  };

  const variantClasses = {
    default: "bg-gray-500 text-white hover:bg-gray-600 border-gray-500",
    outline: "bg-transparent text-gray-600 border border-gray-400 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 border-transparent"
  };

  const iconSizes = {
    small: "h-3 w-3",
    default: "h-4 w-4",
    large: "h-5 w-5"
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        rounded-lg transition-colors flex items-center space-x-2 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-gray-300
      `.trim()}
    >
      <RefreshCw className={`${iconSizes[size]} ${loading ? 'animate-spin' : ''}`} />
      <span>{text}</span>
    </button>
  );
};
