// ===== src/components/common/SubmitButton.jsx =====
import React from 'react';
import { Save } from 'lucide-react';

// export const SubmitButton = ({ 
//   loading, 
//   onClick, 
//   editingId, 
//   disabled = false,
//   gradientFrom = 'from-blue-500',
//   gradientTo = 'to-green-500',
//   text = 'Submit',
//   icon: Icon = Save,
//   className = ''
// }) => (
//   <div className={`flex justify-center border-t pt-6 ${className}`}>
//     <button
//       onClick={onClick}
//       disabled={loading || disabled}
//       type="button"
//       className={`px-8 py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-medium`}
//     >
//       {loading ? (
//         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//       ) : (
//         <Icon className="h-5 w-5" />
//       )}
//       <span>{loading ? 'Processing...' : (editingId ? `Update ${text}` : `Save ${text}`)}</span>
//     </button>
//   </div>
// );

// // Default export for compatibility
// export default SubmitButton;
export const SubmitButton = ({ 
  loading, 
  onClick, 
  editingId, 
  disabled = false,
  gradientFrom = 'from-blue-500',
  gradientTo = 'to-green-500',
  text = 'Submit',
  icon: Icon = Save,
  className = ''
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    type="button"
    className={`px-8 py-3 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 font-medium ${className}`}
  >
    {loading ? (
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    ) : (
      <Icon className="h-5 w-5" />
    )}
    <span>{loading ? 'Processing...' : (editingId ? `Update ${text}` : `Save ${text}`)}</span>
  </button>
);