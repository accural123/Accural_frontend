import React from 'react';
import { Loader2, RefreshCw, Clock, Zap } from 'lucide-react';

const Loader = ({ 
  type = 'spinner', 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false,
  color = 'blue',
  fullScreen = false,
  showMessage = true,
  icon = null,
  className = ''
}) => {
  // Size configurations
  const sizeClasses = {
    small: {
      spinner: 'h-4 w-4',
      container: 'p-2',
      text: 'text-xs',
      dots: 'h-1 w-1'
    },
    medium: {
      spinner: 'h-8 w-8',
      container: 'p-4',
      text: 'text-sm',
      dots: 'h-2 w-2'
    },
    large: {
      spinner: 'h-12 w-12',
      container: 'p-6',
      text: 'text-base',
      dots: 'h-3 w-3'
    },
    xlarge: {
      spinner: 'h-16 w-16',
      container: 'p-8',
      text: 'text-lg',
      dots: 'h-4 w-4'
    }
  };

  // Color configurations
  const colorClasses = {
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    red: 'text-red-500',
    purple: 'text-purple-500',
    gray: 'text-gray-500',
    indigo: 'text-indigo-500'
  };

  // Icon mapping
  const iconMap = {
    spinner: Loader2,
    refresh: RefreshCw,
    clock: Clock,
    zap: Zap
  };

  const IconComponent = icon || iconMap[type] || Loader2;
  const sizeConfig = sizeClasses[size];
  const colorClass = colorClasses[color];

  // Different loader types
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex items-center space-x-1">
            <div className={`${sizeConfig.dots} bg-current rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`${sizeConfig.dots} bg-current rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`${sizeConfig.dots} bg-current rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${sizeConfig.spinner} bg-current rounded-full animate-pulse opacity-75`}></div>
        );
      
      case 'bars':
        return (
          <div className="flex items-end space-x-1">
            <div className="w-1 bg-current rounded animate-pulse" style={{ height: '16px', animationDelay: '0ms' }}></div>
            <div className="w-1 bg-current rounded animate-pulse" style={{ height: '20px', animationDelay: '150ms' }}></div>
            <div className="w-1 bg-current rounded animate-pulse" style={{ height: '12px', animationDelay: '300ms' }}></div>
            <div className="w-1 bg-current rounded animate-pulse" style={{ height: '18px', animationDelay: '450ms' }}></div>
          </div>
        );
      
      case 'spinner':
      default:
        return <IconComponent className={`${sizeConfig.spinner} animate-spin`} />;
    }
  };

  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${sizeConfig.container} ${colorClass} ${className}`}>
      {renderLoader()}
      {showMessage && message && (
        <p className={`mt-2 font-medium ${sizeConfig.text} ${colorClass}`}>
          {message}
        </p>
      )}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          {loaderContent}
        </div>
      </div>
    );
  }

  // Overlay loader
  if (overlay) {
    return (
      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
        {loaderContent}
      </div>
    );
  }

  // Regular loader
  return loaderContent;
};

// Loading Skeleton Component
const LoadingSkeleton = ({ 
  lines = 3, 
  height = 'h-4', 
  className = '',
  animate = true 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`${height} bg-gray-200 rounded ${animate ? 'animate-pulse' : ''}`}
          style={{
            width: index === lines - 1 ? '75%' : '100%'
          }}
        ></div>
      ))}
    </div>
  );
};

// Table Loading Skeleton
const TableSkeleton = ({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-gray-200 rounded animate-pulse flex-1"
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Demo component showing all loader types
const LoaderDemo = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Reusable Loader Components
      </h1>

      {/* Spinner Loaders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Spinner Loaders</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <Loader size="small" message="Small" />
          </div>
          <div className="text-center">
            <Loader size="medium" message="Medium" />
          </div>
          <div className="text-center">
            <Loader size="large" message="Large" />
          </div>
          <div className="text-center">
            <Loader size="xlarge" message="X-Large" />
          </div>
        </div>
      </div>

      {/* Different Types */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Loader Types</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <Loader type="spinner" message="Spinner" color="blue" />
          </div>
          <div className="text-center">
            <Loader type="dots" message="Dots" color="orange" />
          </div>
          <div className="text-center">
            <Loader type="pulse" message="Pulse" color="green" />
          </div>
          <div className="text-center">
            <Loader type="bars" message="Bars" color="purple" />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Color Variants</h2>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
          {['blue', 'orange', 'green', 'red', 'purple', 'gray', 'indigo'].map(color => (
            <div key={color} className="text-center">
              <Loader color={color} message={color} size="medium" />
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Examples */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Overlay & Card Loaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative bg-gray-50 rounded-lg p-6 h-32">
            <p className="text-gray-600">Content behind overlay...</p>
            <Loader overlay message="Loading data..." color="orange" />
          </div>
          <div className="bg-gray-50 rounded-lg p-6 h-32 flex items-center justify-center">
            <Loader type="dots" message="Processing..." color="indigo" />
          </div>
        </div>
      </div>

      {/* Skeleton Loaders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Skeleton Loaders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Text Skeleton</h3>
            <LoadingSkeleton lines={4} />
          </div>
          <div>
            <h3 className="font-medium mb-3">Table Skeleton</h3>
            <TableSkeleton rows={4} columns={3} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Interactive Examples</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => alert('Full screen loader would appear here')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Show Full Screen Loader
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
            <Loader type="spinner" size="small" showMessage={false} color="white" />
            <span>Loading Button</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoaderDemo;

// Export individual components for use
export { Loader, LoadingSkeleton, TableSkeleton };