// import React, { useState } from 'react';

// const Login = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!credentials.username.trim()) {
//       newErrors.username = 'Username is required';
//     }
    
//     if (!credentials.password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (credentials.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Demo credentials - you can modify these
//       const validCredentials = [
//         { username: 'admin', password: 'admin123', role: 'Administrator', name: 'System Administrator' },
//         { username: 'clerk', password: 'clerk123', role: 'Data Entry Clerk', name: 'John Clerk' },
//         { username: 'accountant', password: 'acc123', role: 'Accountant', name: 'Jane Accountant' }
//       ];
      
//       const user = validCredentials.find(
//         u => u.username === credentials.username && u.password === credentials.password
//       );
      
//       if (user) {
//         // Call the onLogin callback with user data
//         if (onLogin) {
//           onLogin(user);
//         } else {
//           // If no callback, just show success message
//           alert(`Login successful! Welcome ${user.name} (${user.role})`);
//         }
//       } else {
//         setErrors({ submit: 'Invalid username or password' });
//       }
//     } catch (error) {
//       setErrors({ submit: 'Login failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const demoLogins = [
//     { username: 'admin', password: 'admin123', role: 'Administrator' },
//     { username: 'clerk', password: 'clerk123', role: 'Data Entry Clerk' },
//     { username: 'accountant', password: 'acc123', role: 'Accountant' }
//   ];

//   const quickLogin = (demo) => {
//     setCredentials({ username: demo.username, password: demo.password });
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center p-4">
//       <div className="max-w-md w-full space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <div className="mx-auto h-16 w-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
//             <svg className="h-10 w-10 text-teal-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h1 className="text-4xl font-bold text-yellow-300 mb-2">
//             Accrual Based Accounting System
//           </h1>
//           <p className="text-teal-100 text-lg">Secure Financial Management</p>
//           <p className="text-teal-200 text-sm mt-2">Please sign in to continue</p>
//         </div>
        
//         {/* Login Form */}
//         <div className="bg-white rounded-lg shadow-xl p-8">
//           <div className="space-y-6">
//             {/* Username Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Username <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="username"
//                 value={credentials.username}
//                 onChange={handleChange}
//                 onKeyPress={handleKeyPress}
//                 className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
//                   errors.username ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your username"
//               />
//               {errors.username && (
//                 <p className="text-red-500 text-sm mt-1">{errors.username}</p>
//               )}
//             </div>
            
//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 value={credentials.password}
//                 onChange={handleChange}
//                 onKeyPress={handleKeyPress}
//                 className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
//                   errors.password ? 'border-red-500' : 'border-gray-300'
//                 }`}
//                 placeholder="Enter your password"
//               />
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//               )}
//             </div>

//             {/* Submit Error */}
//             {errors.submit && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
//                 {errors.submit}
//               </div>
//             )}
            
//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   <span>Signing In...</span>
//                 </>
//               ) : (
//                 <span>Sign In</span>
//               )}
//             </button>
//           </div>

//           {/* Demo Credentials */}
//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <p className="text-sm text-gray-600 mb-3 text-center">Demo Credentials (Click to auto-fill):</p>
//             <div className="space-y-2">
//               {demoLogins.map((demo, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => quickLogin(demo)}
//                   className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded border text-sm transition-colors"
//                 >
//                   <span className="font-medium">{demo.username}</span> - {demo.role}
//                   <br />
//                   <span className="text-gray-500">Password: {demo.password}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center text-teal-100 text-sm">
//           <p>© 2025 Accrual Based Accounting System</p>
//           <p>Secure • Reliable • Professional</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
// import React, { useState } from 'react';

// const Login = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({
//     username: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!credentials.username.trim()) {
//       newErrors.username = 'Username is required';
//     }
    
//     if (!credentials.password.trim()) {
//       newErrors.password = 'Password is required';
//     } else if (credentials.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;
    
//     setLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       // Demo credentials - you can modify these
//       const validCredentials = [
//         { username: 'admin', password: 'admin123', role: 'Administrator', name: 'System Administrator' },
//         { username: 'clerk', password: 'clerk123', role: 'Data Entry Clerk', name: 'John Clerk' },
//         { username: 'accountant', password: 'acc123', role: 'Accountant', name: 'Jane Accountant' }
//       ];
      
//       const user = validCredentials.find(
//         u => u.username === credentials.username && u.password === credentials.password
//       );
      
//       if (user) {
//         // Call the onLogin callback with user data
//         if (onLogin) {
//           onLogin(user);
//         } else {
//           // If no callback, just show success message
//           alert(`Login successful! Welcome ${user.name} (${user.role})`);
//         }
//       } else {
//         setErrors({ submit: 'Invalid username or password' });
//       }
//     } catch (error) {
//       setErrors({ submit: 'Login failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const demoLogins = [
//     { username: 'admin', password: 'admin123', role: 'Administrator', color: 'bg-purple-500' },
//     { username: 'clerk', password: 'clerk123', role: 'Data Entry Clerk', color: 'bg-blue-500' },
//     { username: 'accountant', password: 'acc123', role: 'Accountant', color: 'bg-green-500' }
//   ];

//   const quickLogin = (demo) => {
//     setCredentials({ username: demo.username, password: demo.password });
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSubmit();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
//         <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
//         <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
//       </div>

//       <div className="max-w-md w-full space-y-8 relative z-10">
//         {/* Header */}
//         <div className="text-center space-y-4">
//           <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
//             <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//             </svg>
//           </div>
//           <div className="space-y-2">
//             <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
//               Accrual Accounting
//             </h1>
//             <p className="text-gray-400 text-sm">Secure Financial Management Platform</p>
//           </div>
//         </div>
        
//         {/* Login Form */}
//         <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
//           <div className="space-y-6">
//             {/* Username Field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-200">
//                 Username
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//                 <input
//                   type="text"
//                   name="username"
//                   value={credentials.username}
//                   onChange={handleChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
//                     errors.username ? 'border-red-500 ring-1 ring-red-500' : ''
//                   }`}
//                   placeholder="Enter your username"
//                 />
//               </div>
//               {errors.username && (
//                 <p className="text-red-400 text-sm flex items-center space-x-1">
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                   <span>{errors.username}</span>
//                 </p>
//               )}
//             </div>
            
//             {/* Password Field */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-200">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   onKeyPress={handleKeyPress}
//                   className={`w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
//                     errors.password ? 'border-red-500 ring-1 ring-red-500' : ''
//                   }`}
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
//                 >
//                   {showPassword ? (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l.122.122m0 0L12 12m-3.122-3.122L8.464 8.464m0 0L5.636 5.636m0 0L4.222 4.222m0 0L2.808 2.808" />
//                     </svg>
//                   ) : (
//                     <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-400 text-sm flex items-center space-x-1">
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                   <span>{errors.password}</span>
//                 </p>
//               )}
//             </div>

//             {/* Submit Error */}
//             {errors.submit && (
//               <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
//                 <div className="flex items-center space-x-2">
//                   <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                   </svg>
//                   <span>{errors.submit}</span>
//                 </div>
//               </div>
//             )}
            
//             {/* Submit Button */}
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   <span>Signing In...</span>
//                 </div>
//               ) : (
//                 <div className="flex items-center justify-center space-x-2">
//                   <span>Sign In</span>
//                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </div>
//               )}
//             </button>
//           </div>

//           {/* Demo Credentials */}
//           <div className="mt-8 pt-6 border-t border-white/10">
//             <p className="text-gray-300 text-sm mb-4 text-center">Quick Access</p>
//             <div className="grid gap-3">
//               {demoLogins.map((demo, index) => (
//                 <button
//                   key={index}
//                   type="button"
//                   onClick={() => quickLogin(demo)}
//                   className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-3 transition-all duration-300 transform hover:scale-[1.02]"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <div className={`w-3 h-3 rounded-full ${demo.color} shadow-lg`}></div>
//                     <div className="text-left flex-1">
//                       <div className="text-white font-medium text-sm">{demo.username}</div>
//                       <div className="text-gray-400 text-xs">{demo.role}</div>
//                     </div>
//                     <svg className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                     </svg>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center text-gray-400 text-sm space-y-1">
//           <p>© 2025 Accrual Accounting System</p>
//           <p className="flex items-center justify-center space-x-4">
//             <span className="flex items-center space-x-1">
//               <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>Secure</span>
//             </span>
//             <span className="flex items-center space-x-1">
//               <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//               </svg>
//               <span>Fast</span>
//             </span>
//             <span className="flex items-center space-x-1">
//               <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//               <span>Reliable</span>
//             </span>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, error, loading, clearError } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [localErrors, setLocalErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Clear auth errors when component mounts or when user starts typing
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear local errors when user starts typing
    if (localErrors[name]) {
      setLocalErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear auth error when user starts typing
    if (error) {
      clearError();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    const result = await login(credentials);
    // Navigation is handled automatically by AuthContext
  };

  // const demoLogins = [
  //   { username: 'admin', password: 'admin123', role: 'Administrator', color: 'bg-purple-500' },
  //   { username: 'clerk', password: 'clerk123', role: 'Data Entry Clerk', color: 'bg-blue-500' },
  //   { username: 'accountant', password: 'acc123', role: 'Accountant', color: 'bg-green-500' }
  // ];

  // const quickLogin = (demo) => {
  //   setCredentials({ username: demo.username, password: demo.password });
  //   // Clear any existing errors
  //   setLocalErrors({});
  //   if (error) {
  //     clearError();
  //   }
  // };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Accrual Accounting
            </h1>
            <p className="text-gray-400 text-sm">Secure Financial Management Platform</p>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
                    localErrors.username ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                  placeholder="Enter your username"
                />
              </div>
              {localErrors.username && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{localErrors.username}</span>
                </p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 ${
                    localErrors.password ? 'border-red-500 ring-1 ring-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l.122.122m0 0L12 12m-3.122-3.122L8.464 8.464m0 0L5.636 5.636m0 0L4.222 4.222m0 0L2.808 2.808" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {localErrors.password && (
                <p className="text-red-400 text-sm flex items-center space-x-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{localErrors.password}</span>
                </p>
              )}
            </div>

            {/* Auth Error from Context */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Sign In</span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </button>
          </div>

          {/* Demo Credentials */}
          {/* <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-300 text-sm mb-4 text-center">Quick Access</p>
            <div className="grid gap-3">
              {demoLogins.map((demo, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => quickLogin(demo)}
                  className="group relative overflow-hidden bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-3 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${demo.color} shadow-lg`}></div>
                    <div className="text-left flex-1">
                      <div className="text-white font-medium text-sm">{demo.username}</div>
                      <div className="text-gray-400 text-xs">{demo.role}</div>
                    </div>
                    <svg className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div> */}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm space-y-1">
          <p>© 2026 Accrual Accounting System</p>
          <p className="flex items-center justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Secure</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Fast</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Reliable</span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;