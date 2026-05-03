// // components/layout/Layout.jsx
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';

// const Layout = ({ children, user, financialYear, institutionName, onLogout }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const location = useLocation();

//   const menuItems = [
//     {
//       title: 'Admin',
//       path: '/admin',
//       items: []
//     },
//     {
//       title: 'Master',
//       path: '/master',
//       items: [
//         { title: 'Institution Creation', path: '/master/institution' },
//         { title: 'Ledger Creation', path: '/master/ledger' },
//         { title: 'Group Creation', path: '/master/group' },
//         { title: 'Voucher Type Creation', path: '/master/voucher-type' },
//         { title: 'Opening Balance', path: '/master/opening-balance' },
//         { title: 'Auto GJV', path: '/master/auto-gjv' },
//         { title: 'Add Advance & Deposits Register Details', path: '/master/advance-deposits' },
//         { title: 'Add MDR Details', path: '/master/mdr-details' },
//         { title: 'Add Payable Details', path: '/master/payable-details' },
//         { title: 'Yearwise Balance', path: '/master/yearwise-balance' }
//       ]
//     },
//     {
//       title: 'Transaction',
//       path: '/transaction',
//       items: [
//         { title: 'Daily Collection Details (MR)', path: '/transaction/daily-collection' },
//         { title: 'Bank Receipt Voucher (BRV)', path: '/transaction/bank-receipt' },
//         { title: 'Bank Payment Voucher (BPV)', path: '/transaction/bank-payment' },
//         { title: 'Journal Voucher (JV)', path: '/transaction/journal-voucher' },
//         { title: 'Inter Bank Transfer (IBT)', path: '/transaction/inter-bank-transfer' }
//       ]
//     },
//     {
//       title: 'Correction',
//       path: '/correction',
//       items: [
//         { title: 'Bank Receipt Voucher', path: '/correction/bank-receipt' },
//         { title: 'Bank Payment Voucher', path: '/correction/bank-payment' },
//         { title: 'Journal Voucher', path: '/correction/journal-voucher' },
//         { title: 'Inter Bank Transfer', path: '/correction/inter-bank-transfer' }
//       ]
//     },
//     {
//       title: 'Reconciliation',
//       path: '/reconciliation',
//       items: [
//         { title: 'Add Reconciliation', path: '/reconciliation/add' },
//         { title: 'Add Previous Reconciliation', path: '/reconciliation/previous' }
//       ]
//     },
//     {
//       title: 'Statements',
//       path: '/statements',
//       items: []
//     },
//     {
//       title: 'Reports',
//       path: '/reports',
//       items: []
//     },
//     {
//       title: 'Registers',
//       path: '/registers',
//       items: []
//     },
//     {
//       title: 'GST Returns Filing',
//       path: '/gst-returns',
//       items: []
//     },
//     {
//       title: 'IT Returns Filing',
//       path: '/it-returns',
//       items: []
//     },
//     {
//       title: 'LWF Payment',
//       path: '/lwf-payment',
//       items: []
//     },
//     {
//       title: 'Contact Us',
//       path: '/contact',
//       items: []
//     }
//   ];

//   const [openMenus, setOpenMenus] = useState({});

//   const toggleMenu = (title) => {
//     setOpenMenus(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-teal-600 to-teal-800 text-white shadow-lg">
//         <div className="flex items-center justify-between p-4">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-md hover:bg-teal-700"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h1 className="text-2xl font-bold text-yellow-300">Accrual Based Accounting System</h1>
//           </div>
          
//           <div className="flex items-center space-x-6">
//             <div className="text-right">
//               <div className="text-sm">Financial Year: {financialYear}</div>
//               <div className="text-sm">Institution: {institutionName}</div>
//             </div>
//             <div className="text-right">
//               <div className="text-sm">User: {user?.name || 'Admin'}</div>
//             </div>
//             <button
//               onClick={onLogout}
//               className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white shadow-lg`}>
//           <div className="p-4 h-screen overflow-y-auto">
//             <nav className="space-y-2">
//               {menuItems.map((item) => (
//                 <div key={item.title}>
//                   {item.items.length > 0 ? (
//                     <div>
//                       <button
//                         onClick={() => toggleMenu(item.title)}
//                         className="w-full flex items-center justify-between p-3 text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
//                       >
//                         <span className="font-medium">{item.title}</span>
//                         <svg 
//                           className={`w-4 h-4 transition-transform ${openMenus[item.title] ? 'rotate-180' : ''}`}
//                           fill="none" 
//                           stroke="currentColor" 
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                       {openMenus[item.title] && (
//                         <div className="pl-4 space-y-1">
//                           {item.items.map((subItem) => (
//                             <Link
//                               key={subItem.path}
//                               to={subItem.path}
//                               className={`block p-2 text-sm rounded-md transition-colors ${
//                                 location.pathname === subItem.path
//                                   ? 'bg-teal-100 text-teal-800 font-medium'
//                                   : 'text-gray-600 hover:bg-gray-100'
//                               }`}
//                             >
//                               {subItem.title}
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <Link
//                       to={item.path}
//                       className={`block p-3 rounded-md transition-colors ${
//                         location.pathname === item.path
//                           ? 'bg-teal-100 text-teal-800 font-medium'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`}
//                     >
//                       {item.title}
//                     </Link>
//                   )}
//                 </div>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6">
//           {children}
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
//         <p className="text-sm">Copyrights © 2025 Accrual Based Accounting System</p>
//       </footer>
//     </div>
//   );
// };

// export default Layout;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Layout = ({ children, financialYear, institutionName }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const [openMenus, setOpenMenus] = useState({});

//   // Memoize menu items to prevent infinite re-renders
//   const menuItems = useMemo(() => {
//     const allMenuItems = [
//       {
//         title: 'Dashboard',
//         path: '/',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       },
//       {
//         title: 'Admin',
//         path: '/admin',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         ),
//         items: [
//           { title: 'Ledger Creation', path: '/admin/ledger' },
//           { title: 'Group Creation', path: '/admin/group' },
//           { title: 'Fund Creation', path: '/admin/fundcreation' },
//           { title: 'Institution Creation', path: '/master/institution' },
//           { title: 'User Management', path: '/admin/users' },
//         ],
//         roles: ['Administrator']
//       },
//       {
//         title: 'Master',
//         path: '/master',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//           </svg>
//         ),
//         items: [
      
          
//           { title: 'Voucher Type Creation', path: '/master/voucher-type' },
//           { title: 'Opening Balance', path: '/master/opening-balance' },
//           { title: 'Auto GJV', path: '/master/auto-gjv' },
//           { title: 'Add Advance & Deposits Register Details', path: '/master/advance-deposits' },
//           { title: 'Add MDR Details', path: '/master/mdr-details' },
//           { title: 'Add Payable Details', path: '/master/payable-details' },
//           { title: 'Yearwise Balance', path: '/master/yearwise-balance' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Transaction',
//         path: '/transaction',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//           </svg>
//         ),
//         items: [
//           { title: 'Daily Collection Details (MR)', path: '/transaction/daily-collection' },
//           { title: 'Bank Receipt Voucher (BRV)', path: '/transaction/bank-receipt' },
//           { title: 'Bank Payment Voucher (BPV)', path: '/transaction/bank-payment' },
//           { title: 'Journal Voucher (JV)', path: '/transaction/journal-voucher' },
//           { title: 'Inter Bank Transfer (IBT)', path: '/transaction/inter-bank-transfer' }
//         ],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       },
//       {
//         title: 'Correction',
//         path: '/correction',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//           </svg>
//         ),
//         items: [
//           { title: 'Bank Receipt Voucher', path: '/correction/bank-receipt' },
//           { title: 'Bank Payment Voucher', path: '/correction/bank-payment' },
//           { title: 'Journal Voucher', path: '/correction/journal-voucher' },
//           { title: 'Inter Bank Transfer', path: '/correction/inter-bank-transfer' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Reconciliation',
//         path: '/reconciliation',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//           </svg>
//         ),
//         items: [
//           { title: 'Add Reconciliation', path: '/reconciliation/add' },
//           // { title: ' Reconciliation Entries', path: '/reconciliation/entries' },
//           { title: 'Add Previous Reconciliation', path: '/reconciliation/previous' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Reports',
//         path: '/reports',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//         ),
//         items: [
      
//           { title: 'Datewise Reports', path: '/reports/datewise' },
//           { title: 'Monthwise Reports', path: '/reports/monthwise' },
//           { title: 'Yearwise Reports', path: '/reports/yearwise' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Statements',
//         path: '/statements',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Registers',
//         path: '/registers',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'GST Returns',
//         path: '/gst-returns',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Contact Us',
//         path: '/contact',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       }
//     ];

//     // Filter menu items based on user role
//     return allMenuItems.filter(item => 
//       !item.roles || item.roles.includes(user?.role)
//     );
//   }, [user?.role]);

//   // Open parent menu if current path is a submenu item
//   useEffect(() => {
//     const currentPath = location.pathname;
//     const newOpenMenus = {};
    
//     menuItems.forEach(item => {
//       if (item.items && item.items.length > 0) {
//         const hasActiveSubItem = item.items.some(subItem => 
//           currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
//         );
//         if (hasActiveSubItem) {
//           newOpenMenus[item.title] = true;
//         }
//       }
//     });
    
//     setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
//   }, [location.pathname]);

//   const toggleMenu = (title) => {
//     setOpenMenus(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       logout();
//     }
//   };

//   // Helper function to check if a path is active
//   const isActivePath = (path) => {
//     if (path === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname === path || location.pathname.startsWith(path + '/');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
//         <div className="flex items-center justify-between px-6 py-4">
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
//               title="Toggle Sidebar"
//             >
//               <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div className="flex items-center space-x-3">
//               <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 Accrual Accounting
//               </h1>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-6">
//             <div className="hidden md:block text-right">
//               <div className="text-sm text-slate-600">FY: {financialYear || '2024-25'}</div>
//               <div className="text-sm text-slate-500">{institutionName || 'Default Institution'}</div>
//             </div>
            
//             <div className="flex items-center space-x-3">
//               <div className="hidden sm:block text-right">
//                 <div className="text-sm font-medium text-slate-700">{user?.name || 'Admin User'}</div>
//                 <div className="text-xs text-slate-500">{user?.role || 'Administrator'}</div>
//               </div>
//               <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-medium">
//                   {(user?.name || 'A').charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLogout}
//               className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
//               title="Logout"
//             >
//               <div className="flex items-center space-x-2">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span>Logout</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-lg`}>
//           <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
//             <nav className="space-y-2">
//               {menuItems.map((item) => (
//                 <div key={item.title}>
//                   {item.items.length > 0 ? (
//                     <div>
//                       <button
//                         onClick={() => toggleMenu(item.title)}
//                         className={`w-full flex items-center justify-between p-3 text-left rounded-xl transition-all duration-200 group ${
//                           isActivePath(item.path)
//                             ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                             : 'text-slate-700 hover:bg-slate-100/50'
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <div className={`transition-colors ${
//                             isActivePath(item.path)
//                               ? 'text-purple-600'
//                               : 'text-slate-500 group-hover:text-slate-700'
//                           }`}>
//                             {item.icon}
//                           </div>
//                           <span className="font-medium">{item.title}</span>
//                         </div>
//                         <svg 
//                           className={`w-4 h-4 transition-transform duration-200 ${openMenus[item.title] ? 'rotate-180' : ''}`}
//                           fill="none" 
//                           stroke="currentColor" 
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                       {openMenus[item.title] && (
//                         <div className="pl-4 space-y-1 mt-2">
//                           {item.items.map((subItem) => (
//                             <button
//                               key={subItem.path}
//                               onClick={() => handleNavigation(subItem.path)}
//                               className={`w-full text-left p-3 text-sm rounded-lg transition-all duration-200 ${
//                                 isActivePath(subItem.path)
//                                   ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                                   : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800'
//                               }`}
//                             >
//                               {subItem.title}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => handleNavigation(item.path)}
//                       className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
//                         isActivePath(item.path)
//                           ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                           : 'text-slate-700 hover:bg-slate-100/50'
//                       }`}
//                     >
//                       <div className={`transition-colors ${
//                         isActivePath(item.path)
//                           ? 'text-purple-600' 
//                           : 'text-slate-500 group-hover:text-slate-700'
//                       }`}>
//                         {item.icon}
//                       </div>
//                       <span>{item.title}</span>
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-6 min-h-[calc(100vh-80px)]">
//           <div className="max-w-7xl mx-auto">
//             {children || (
//               <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-8">
//                 <div className="text-center space-y-4">
//                   <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
//                     <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
//                     </svg>
//                   </div>
//                   <h2 className="text-2xl font-bold text-slate-800">Welcome to {user?.role === 'Administrator' ? 'Admin Dashboard' : 'Dashboard'}</h2>
//                   <p className="text-slate-600">
//                     Hello {user?.name}! Select a module from the sidebar to get started.
//                   </p>
//                   {user?.role === 'Administrator' && (
//                     <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
//                       <p className="text-purple-700 font-medium">🔧 Administrator Access</p>
//                       <p className="text-purple-600 text-sm mt-1">You have full access to all system features and settings.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Footer */}
//       <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 mt-auto">
//         <div className="text-center py-4 px-6">
//           <p className="text-sm text-slate-600">
//             © 2025 Accrual Based Accounting System • 
//             <span className="ml-2 inline-flex items-center space-x-4">
//               <span className="flex items-center space-x-1">
//                 <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 <span>Secure</span>
//               </span>
//               <span className="flex items-center space-x-1">
//                 <svg className="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//                 <span>Fast</span>
//               </span>
//               <span className="flex items-center space-x-1">
//                 <svg className="h-3 w-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                 </svg>
//                 <span>Reliable</span>
//               </span>
//             </span>
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConfirmDialog, useConfirmDialog } from "../../components/common/Popup";
const Layout = ({ children }) => {
  const { user, logout, getWorkspaceSelection } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const { dialogState, showConfirmDialog, closeDialog } = useConfirmDialog();
  const userSession = getWorkspaceSelection();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Memoize menu items to prevent infinite re-renders
  const menuItems = useMemo(() => {
    const allMenuItems = [
      {
        title: 'Dashboard',
        path: '/',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
          </svg>
        ),
        items: [],
        roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
      },
      {
        title: 'Admin',
        path: '/admin',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        items: [
          { title: 'Ledger Creation', path: '/admin/ledger' },
          { title: 'Group Creation', path: '/admin/group' },
          { title: 'Fund Creation', path: '/admin/fundcreation' },
          { title: 'Institution Creation', path: '/admin/institution' },
          { title: 'User Management', path: '/admin/users' },
          { title: 'Work Allocation', path: '/admin/allocation' },
        ],
        roles: ['Administrator']
      },
      {
        title: 'Master',
        path: '/master',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
        items: [
          { title: 'MasterLedger Creation', path: '/master/ledger' },
          { title: 'MasterEmployee Creation', path: '/master/employee' },
          { title: 'Voucher Type Creation', path: '/master/voucher-type' },
          { title: 'Opening Balance', path: '/master/opening-balance' },
          { title: 'Auto GJV', path: '/master/auto-gjv' },
          { title: 'Add Advance Register Details', path: '/master/advance-register' },
          { title: 'Add Deposits Register Details', path: '/master/deposit-register' },
          { title: 'Add MDR Details', path: '/master/mdr-details' },
          { title: 'Add Payable Details', path: '/master/payable-details' },
          { title: 'Add Previous Reconciliation', path: '/master/previous' },
          { title: 'Yearwise Balance', path: '/master/yearwise-balance' },
          { title: 'InvestmentDetails ', path: '/master/investment-details' },
          { title: 'LoanDetails ', path: '/master/loan-details' },
          { title: 'SFCGrantDetails ', path: '/master/sfcgrant-details' }
        ],
        roles: ['Administrator', 'Accountant']
      },
      {
        title: 'Transaction',
        path: '/transaction',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        ),
        items: [
          { title: 'Daily Collection Details (MR)', path: '/transaction/daily-collection' },
          { title: 'Bank Receipt Voucher (BRV)', path: '/transaction/bank-receipt' },
          { title: 'Bank Payment Voucher (BPV)', path: '/transaction/bank-payment' },
          { title: 'Journal Voucher (JV)', path: '/transaction/journal-voucher' },
          { title: 'Inter Bank Transfer (IBT)', path: '/transaction/inter-bank-transfer' }
        ],
        roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
      },
      // {
      //   title: 'Correction',
      //   path: '/correction',
      //   icon: (
      //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      //     </svg>
      //   ),
      //   items: [
      //     { title: 'Bank Receipt Voucher', path: '/correction/bank-receipt' },
      //     { title: 'Bank Payment Voucher', path: '/correction/bank-payment' },
      //     { title: 'Journal Voucher', path: '/correction/journal-voucher' },
      //     { title: 'Inter Bank Transfer', path: '/correction/inter-bank-transfer' }
      //   ],
      //   roles: ['Administrator', 'Accountant']
      // },
      {
        title: 'Reconciliation',
        path: '/reconciliation',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ),
        items: [
          { title: 'Add Reconciliation', path: '/reconciliation/add' },
         
        ],
        roles: ['Administrator', 'Accountant']
      },
      {
        title: 'Reports',
        path: '/reports',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        items: [
          { title: 'Datewise Reports', path: '/reports/datewise' },
          { title: 'Monthwise Reports', path: '/reports/monthwise' },
          { title: 'Yearwise Reports', path: '/reports/yearwise' }
        ],
        roles: ['Administrator', 'Accountant']
      },
      {
        title: 'Statements',
        path: '/statements',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        items: [],
        roles: ['Administrator', 'Accountant']
      },
      {
        title: 'Registers',
        path: '/registers',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        items: [],
        roles: ['Administrator', 'Accountant']
      },
      // {
      //   title: 'GST Returns',
      //   path: '/gst-returns',
      //   icon: (
      //     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      //     </svg>
      //   ),
      //   items: [],
      //   roles: ['Administrator', 'Accountant']
      // },
      {
        title: 'Contact Us',
        path: '/contact',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        items: [],
        roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
      }
    ];

    // Filter menu items based on user role
    return allMenuItems.filter(item => 
      !item.roles || item.roles.includes(user?.role)
    );
  }, [user?.role]);

  // Open parent menu if current path is a submenu item
  useEffect(() => {
    const currentPath = location.pathname;
    const newOpenMenus = {};
    
    menuItems.forEach(item => {
      if (item.items && item.items.length > 0) {
        const hasActiveSubItem = item.items.some(subItem => 
          currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
        );
        if (hasActiveSubItem) {
          newOpenMenus[item.title] = true;
        }
      }
    });
    
    setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
  }, [location.pathname, menuItems]);

  const toggleMenu = (title) => {
    setOpenMenus(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // const handleLogout = () => {
  //   if (window.confirm('Are you sure you want to logout?')) {
  //     logout();
  //   }
  // };
  const handleLogout = async () => {
  const confirmed = await showConfirmDialog({
    title: 'Confirm Logout',
    message: 'Are you sure you want to logout? Any unsaved changes will be lost.',
    confirmText: 'Logout',
    cancelText: 'Cancel',
    type: 'warning'
  });

  if (confirmed) {
    closeDialog();
    logout();
  } else {
    closeDialog();
  }
};

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get workspace display information
  const getWorkspaceInfo = () => {
    if (user?.role === 'Administrator') {
      return {
        institution: 'System Admin',
        funds: 'All Access'
      };
    }
    
    if (userSession?.selectedInstitution && userSession?.selectedFunds) {
      return {
        institution: userSession.selectedInstitution.institutionName,
        funds: `${userSession.selectedFunds.length} Active Funds`
      };
    }
    
    return {
      institution: 'No Institution Selected',
      funds: 'No Funds Available'
    };
  };

  const workspaceInfo = getWorkspaceInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-4 sm:px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
              aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={sidebarOpen}
              title="Toggle Sidebar"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-base font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent sm:text-xl">
                Accrual Accounting
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* Workspace Information */}
            <div className="hidden md:block text-right">
              <div className="text-sm text-slate-600 font-medium">{workspaceInfo.institution}</div>
              <div className="text-xs text-slate-500">{workspaceInfo.funds}</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-slate-700">{user?.name || 'Admin User'}</div>
                <div className="text-xs text-slate-500">{user?.role || 'Administrator'}</div>
              </div>
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {(user?.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg sm:px-4"
              title="Logout"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {isMobile && sidebarOpen && (
        <button
          type="button"
          className="fixed inset-x-0 bottom-0 top-[73px] z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar backdrop"
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isMobile
              ? `fixed bottom-0 left-0 top-[73px] z-40 w-80 max-w-[85vw] transform ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : `${sidebarOpen ? 'w-80' : 'w-0'}`
          } transition-all duration-300 overflow-hidden bg-white/95 backdrop-blur-xl border-r border-slate-200/60 shadow-lg`}
        >
          <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
            {isMobile && (
              <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-base font-semibold text-slate-800">Menu</h2>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
                  aria-label="Close sidebar"
                  title="Close Sidebar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            {/* Workspace Summary (for non-admin users) */}
            {user?.role !== 'Administrator' && userSession?.selectedFunds && (
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                <div className="text-xs font-medium text-indigo-800 mb-1">Available Funds</div>
                <div className="space-y-1">
                  {userSession.selectedFunds.slice(0, 2).map((fund) => (
                    <div key={fund.id} className="text-xs text-indigo-600 truncate">
                      • {fund.fundName}
                    </div>
                  ))}
                  {userSession.selectedFunds.length > 2 && (
                    <div className="text-xs text-indigo-500">
                      +{userSession.selectedFunds.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <nav className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.title}>
                  {item.items.length > 0 ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.title)}
                        className={`w-full flex items-center justify-between p-3 text-left rounded-xl transition-all duration-200 group ${
                          isActivePath(item.path)
                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
                            : 'text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`transition-colors ${
                            isActivePath(item.path)
                              ? 'text-purple-600'
                              : 'text-slate-500 group-hover:text-slate-700'
                          }`}>
                            {item.icon}
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        <svg 
                          className={`w-4 h-4 transition-transform duration-200 ${openMenus[item.title] ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {openMenus[item.title] && (
                        <div className="pl-4 space-y-1 mt-2">
                          {item.items.map((subItem) => (
                            <button
                              key={subItem.path}
                              onClick={() => handleNavigation(subItem.path)}
                              className={`w-full text-left p-3 text-sm rounded-lg transition-all duration-200 ${
                                isActivePath(subItem.path)
                                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
                                  : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800'
                              }`}
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                        isActivePath(item.path)
                          ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
                          : 'text-slate-700 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className={`transition-colors ${
                        isActivePath(item.path)
                          ? 'text-purple-600' 
                          : 'text-slate-500 group-hover:text-slate-700'
                      }`}>
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-80px)] min-w-0 flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {children || (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-8">
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Welcome to {user?.role === 'Administrator' ? 'Admin Dashboard' : 'Dashboard'}</h2>
                  <p className="text-slate-600">
                    Hello {user?.name}! Select a module from the sidebar to get started.
                  </p>
                  {user?.role === 'Administrator' && (
                    <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-purple-700 font-medium">Administrator Access</p>
                      <p className="text-purple-600 text-sm mt-1">You have full access to all system features and settings.</p>
                    </div>
                  )}
                  {user?.role !== 'Administrator' && userSession?.selectedInstitution && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <p className="text-indigo-700 font-medium">Current Workspace</p>
                      <p className="text-indigo-600 text-sm mt-1">
                        {userSession.selectedInstitution.institutionName} • {userSession.selectedFunds?.length || 0} funds available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

       {/* Footer */}
       <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 mt-auto">
         <div className="text-center py-4 px-6">
           <p className="text-sm text-slate-600">
             © 2025 Accrual Based Accounting System • 
             <span className="ml-2 inline-flex items-center space-x-4">
               <span className="flex items-center space-x-1">
                 <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span>Secure</span>
               </span>
               <span className="flex items-center space-x-1">
                 <svg className="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                 </svg>
                 <span>Fast</span>
               </span>
               <span className="flex items-center space-x-1">
                 <svg className="h-3 w-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
                 <span>Reliable</span>
               </span>
            </span>
           </p>
         </div>
      </footer>
      <ConfirmDialog
  isOpen={dialogState.isOpen}
  onClose={closeDialog}
  onConfirm={dialogState.onConfirm}
  title={dialogState.title}
  message={dialogState.message}
  confirmText={dialogState.confirmText}
  cancelText={dialogState.cancelText}
  type={dialogState.type}
  loading={dialogState.loading}
/>
     </div>
  );
};
<div className="min-h-screen w-full relative">
  {/* Purple Radial Bloom Light Gradient */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background: `radial-gradient(circle at center, #F3E8FF 0%, #DDD6FE 30%, #C4B5FD 60%, #A78BFA 100%)`,
    }}
  />
  {/* Your Content/Components */}
</div>
export default Layout;
// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Layout = ({ children }) => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
//   const [userSession, setUserSession] = useState(null);
//   const [openMenus, setOpenMenus] = useState({});
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if device is mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       const mobile = window.innerWidth < 768;
//       setIsMobile(mobile);
//       // Auto-close sidebar on mobile, auto-open on desktop
//       setSidebarOpen(!mobile);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Load user session data on mount
//   useEffect(() => {
//     const session = localStorage.getItem('userSession');
//     if (session) {
//       setUserSession(JSON.parse(session));
//     }
//   }, []);

//   // Close sidebar when clicking outside on mobile
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (isMobile && sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
//         setSidebarOpen(false);
//       }
//     };

//     document.addEventListener('touchstart', handleClickOutside);
//     document.addEventListener('click', handleClickOutside);
//     return () => {
//       document.removeEventListener('touchstart', handleClickOutside);
//       document.removeEventListener('click', handleClickOutside);
//     };
//   }, [isMobile, sidebarOpen]);

//   // Memoize menu items to prevent infinite re-renders
//   const menuItems = useMemo(() => {
//     const allMenuItems = [
//       {
//         title: 'Dashboard',
//         path: '/',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       },
//       {
//         title: 'Admin',
//         path: '/admin',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         ),
//         items: [
//           { title: 'Ledger Creation', path: '/admin/ledger' },
//           { title: 'Group Creation', path: '/admin/group' },
//           { title: 'Fund Creation', path: '/admin/fundcreation' },
//           { title: 'Institution Creation', path: '/admin/institution' },
//           { title: 'User Management', path: '/admin/users' },
//         ],
//         roles: ['Administrator']
//       },
//       {
//         title: 'Master',
//         path: '/master',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//           </svg>
//         ),
//         items: [
//           { title: 'Voucher Type Creation', path: '/master/voucher-type' },
//           { title: 'Opening Balance', path: '/master/opening-balance' },
//           { title: 'Auto GJV', path: '/master/auto-gjv' },
//           { title: 'Add Advance & Deposits Register Details', path: '/master/advance-deposits' },
//           { title: 'Add MDR Details', path: '/master/mdr-details' },
//           { title: 'Add Payable Details', path: '/master/payable-details' },
//           { title: 'Add Previous Reconciliation', path: '/master/previous' },
//           { title: 'Yearwise Balance', path: '/master/yearwise-balance' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Transaction',
//         path: '/transaction',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//           </svg>
//         ),
//         items: [
//           { title: 'Daily Collection Details (MR)', path: '/transaction/daily-collection' },
//           { title: 'Bank Receipt Voucher (BRV)', path: '/transaction/bank-receipt' },
//           { title: 'Bank Payment Voucher (BPV)', path: '/transaction/bank-payment' },
//           { title: 'Journal Voucher (JV)', path: '/transaction/journal-voucher' },
//           { title: 'Inter Bank Transfer (IBT)', path: '/transaction/inter-bank-transfer' },
//           { title: 'InvestmentDetails ', path: '/transaction/investment-details' },
//           { title: 'LoanDetails ', path: '/transaction/loan-details' },
//           { title: 'SFCGrantDetails ', path: '/transaction/sfcgrant-details' }
//         ],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       },
//       {
//         title: 'Reconciliation',
//         path: '/reconciliation',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
//           </svg>
//         ),
//         items: [
//           { title: 'Add Reconciliation', path: '/reconciliation/add' },
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Reports',
//         path: '/reports',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
//           </svg>
//         ),
//         items: [
//           { title: 'Datewise Reports', path: '/reports/datewise' },
//           { title: 'Monthwise Reports', path: '/reports/monthwise' },
//           { title: 'Yearwise Reports', path: '/reports/yearwise' }
//         ],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Statements',
//         path: '/statements',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Registers',
//         path: '/registers',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Accountant']
//       },
//       {
//         title: 'Contact Us',
//         path: '/contact',
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//           </svg>
//         ),
//         items: [],
//         roles: ['Administrator', 'Data Entry Clerk', 'Accountant']
//       }
//     ];

//     // Filter menu items based on user role
//     return allMenuItems.filter(item => 
//       !item.roles || item.roles.includes(user?.role)
//     );
//   }, [user?.role]);

//   // Open parent menu if current path is a submenu item
//   useEffect(() => {
//     const currentPath = location.pathname;
//     const newOpenMenus = {};
    
//     menuItems.forEach(item => {
//       if (item.items && item.items.length > 0) {
//         const hasActiveSubItem = item.items.some(subItem => 
//           currentPath === subItem.path || currentPath.startsWith(subItem.path + '/')
//         );
//         if (hasActiveSubItem) {
//           newOpenMenus[item.title] = true;
//         }
//       }
//     });
    
//     setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
//   }, [location.pathname, menuItems]);

//   const toggleMenu = (title) => {
//     setOpenMenus(prev => ({
//       ...prev,
//       [title]: !prev[title]
//     }));
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     // Close sidebar on mobile after navigation
//     if (isMobile) {
//       setSidebarOpen(false);
//     }
//   };

//   const handleMenuItemClick = (item) => {
//     // If item has no sub-items, navigate directly
//     if (item.items.length === 0) {
//       handleNavigation(item.path);
//     } else {
//       // If item has sub-items, just toggle the menu
//       toggleMenu(item.title);
//       // Close sidebar on mobile for better UX when opening sub-menus
//       if (isMobile) {
//         setSidebarOpen(false);
//       }
//     }
//   };

//   const handleLogout = () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       logout();
//     }
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   // Helper function to check if a path is active
//   const isActivePath = (path) => {
//     if (path === '/') {
//       return location.pathname === '/';
//     }
//     return location.pathname === path || location.pathname.startsWith(path + '/');
//   };

//   // Get workspace display information
//   const getWorkspaceInfo = () => {
//     if (user?.role === 'Administrator') {
//       return {
//         institution: 'System Admin',
//         funds: 'All Access'
//       };
//     }
    
//     if (userSession?.selectedInstitution && userSession?.selectedFunds) {
//       return {
//         institution: userSession.selectedInstitution.institutionName,
//         funds: `${userSession.selectedFunds.length} Active Funds`
//       };
//     }
    
//     return {
//       institution: 'No Institution Selected',
//       funds: 'No Funds Available'
//     };
//   };

//   const workspaceInfo = getWorkspaceInfo();

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Mobile Overlay */}
//       {isMobile && sidebarOpen && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"></div>
//       )}

//       {/* Header */}
//       <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm sticky top-0 z-50">
//         <div className="flex items-center justify-between px-4 sm:px-6 py-4">
//           <div className="flex items-center space-x-3 sm:space-x-4">
//             <button
//               onClick={toggleSidebar}
//               className="sidebar-toggle p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 touch-manipulation"
//               title="Toggle Sidebar"
//             >
//               <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
//                 <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               </div>
//               <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
//                 <span className="hidden sm:inline">Accrual Accounting</span>
//                 <span className="sm:hidden">Accrual</span>
//               </h1>
//             </div>
//           </div>
          
//           <div className="flex items-center space-x-3 sm:space-x-6">
//             {/* Workspace Information - Hidden on small screens */}
//             <div className="hidden lg:block text-right">
//               <div className="text-sm text-slate-600 font-medium">{workspaceInfo.institution}</div>
//               <div className="text-xs text-slate-500">{workspaceInfo.funds}</div>
//             </div>
            
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <div className="hidden sm:block text-right">
//                 <div className="text-sm font-medium text-slate-700">{user?.name || 'Admin User'}</div>
//                 <div className="text-xs text-slate-500">{user?.role || 'Administrator'}</div>
//               </div>
//               <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs sm:text-sm font-medium">
//                   {(user?.name || 'A').charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
            
//             <button
//               onClick={handleLogout}
//               className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg touch-manipulation"
//               title="Logout"
//             >
//               <div className="flex items-center space-x-1 sm:space-x-2">
//                 <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                 </svg>
//                 <span className="hidden sm:inline">Logout</span>
//               </div>
//             </button>
//           </div>
//         </div>
//       </header>

//       <div className="flex relative">
//         {/* Sidebar */}
//         <aside className={`sidebar fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transform transition-transform duration-300 ease-in-out ${
//           sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
//         } ${
//           isMobile ? 'w-80 max-w-[85vw]' : sidebarOpen ? 'w-80' : 'w-0 lg:w-16'
//         } bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-lg overflow-hidden`}>
          
//           {/* Close Button for Mobile */}
//           {isMobile && sidebarOpen && (
//             <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
//               <h3 className="text-lg font-semibold text-slate-800">Menu</h3>
//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 touch-manipulation"
//                 title="Close Menu"
//               >
//                 <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           )}

//           <div className={`p-4 ${isMobile && sidebarOpen ? 'h-[calc(100vh-140px)]' : 'h-[calc(100vh-80px)]'} overflow-y-auto ${!sidebarOpen && !isMobile ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
//             {/* Workspace Summary (for non-admin users) - Only show when sidebar is open */}
//             {sidebarOpen && user?.role !== 'Administrator' && userSession?.selectedFunds && (
//               <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
//                 <div className="text-xs font-medium text-indigo-800 mb-1">Available Funds</div>
//                 <div className="space-y-1">
//                   {userSession.selectedFunds.slice(0, 2).map((fund, index) => (
//                     <div key={fund.id} className="text-xs text-indigo-600 truncate">
//                       • {fund.fundName}
//                     </div>
//                   ))}
//                   {userSession.selectedFunds.length > 2 && (
//                     <div className="text-xs text-indigo-500">
//                       +{userSession.selectedFunds.length - 2} more
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             <nav className="space-y-2">
//               {menuItems.map((item) => (
//                 <div key={item.title}>
//                   {item.items.length > 0 ? (
//                     <div>
//                       <button
//                         onClick={() => handleMenuItemClick(item)}
//                         className={`w-full flex items-center justify-between p-3 text-left rounded-xl transition-all duration-200 group touch-manipulation ${
//                           isActivePath(item.path)
//                             ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                             : 'text-slate-700 hover:bg-slate-100/50 active:bg-slate-200/50'
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3 min-w-0 flex-1">
//                           <div className={`transition-colors flex-shrink-0 ${
//                             isActivePath(item.path)
//                               ? 'text-purple-600'
//                               : 'text-slate-500 group-hover:text-slate-700'
//                           }`}>
//                             {item.icon}
//                           </div>
//                           <span className={`font-medium truncate ${sidebarOpen || isMobile ? 'block' : 'hidden lg:hidden'}`}>
//                             {item.title}
//                           </span>
//                         </div>
//                         <svg 
//                           className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
//                             openMenus[item.title] ? 'rotate-180' : ''
//                           } ${sidebarOpen || isMobile ? 'block' : 'hidden lg:hidden'}`}
//                           fill="none" 
//                           stroke="currentColor" 
//                           viewBox="0 0 24 24"
//                         >
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                         </svg>
//                       </button>
//                       {openMenus[item.title] && (sidebarOpen || isMobile) && (
//                         <div className="pl-4 space-y-1 mt-2">
//                           {item.items.map((subItem) => (
//                             <button
//                               key={subItem.path}
//                               onClick={() => handleNavigation(subItem.path)}
//                               className={`w-full text-left p-3 text-sm rounded-lg transition-all duration-200 touch-manipulation ${
//                                 isActivePath(subItem.path)
//                                   ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                                   : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-800 active:bg-slate-200/50'
//                               }`}
//                             >
//                               {subItem.title}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <button
//                       onClick={() => handleNavigation(item.path)}
//                       className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group touch-manipulation ${
//                         isActivePath(item.path)
//                           ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-200 font-medium'
//                           : 'text-slate-700 hover:bg-slate-100/50 active:bg-slate-200/50'
//                       }`}
//                       title={!sidebarOpen && !isMobile ? item.title : ''}
//                     >
//                       <div className={`transition-colors flex-shrink-0 ${
//                         isActivePath(item.path)
//                           ? 'text-purple-600' 
//                           : 'text-slate-500 group-hover:text-slate-700'
//                       }`}>
//                         {item.icon}
//                       </div>
//                       <span className={`truncate ${sidebarOpen || isMobile ? 'block' : 'hidden lg:hidden'}`}>
//                         {item.title}
//                       </span>
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </nav>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <main className="flex-1 p-3 sm:p-6 min-h-[calc(100vh-80px)] transition-all duration-300">
//           <div className="max-w-7xl mx-auto">
//             {children || (
//               <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-4 sm:p-8">
//                 <div className="text-center space-y-4">
//                   <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center">
//                     <svg className="h-6 w-6 sm:h-8 sm:w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 5v6h8V5" />
//                     </svg>
//                   </div>
//                   <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Welcome to {user?.role === 'Administrator' ? 'Admin Dashboard' : 'Dashboard'}</h2>
//                   <p className="text-sm sm:text-base text-slate-600 px-4">
//                     Hello {user?.name}! Select a module from the sidebar to get started.
//                   </p>
//                   {user?.role === 'Administrator' && (
//                     <div className="mt-4 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
//                       <p className="text-purple-700 font-medium text-sm sm:text-base">Administrator Access</p>
//                       <p className="text-purple-600 text-xs sm:text-sm mt-1">You have full access to all system features and settings.</p>
//                     </div>
//                   )}
//                   {user?.role !== 'Administrator' && userSession?.selectedInstitution && (
//                     <div className="mt-4 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
//                       <p className="text-indigo-700 font-medium text-sm sm:text-base">Current Workspace</p>
//                       <p className="text-indigo-600 text-xs sm:text-sm mt-1">
//                         {userSession.selectedInstitution.institutionName} • {userSession.selectedFunds?.length || 0} funds available
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//        {/* Footer */}
//        <footer className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 mt-auto">
//          <div className="text-center py-3 sm:py-4 px-4 sm:px-6">
//            <p className="text-xs sm:text-sm text-slate-600">
//              © 2025 Accrual Based Accounting System • 
//              <span className="ml-2 inline-flex items-center space-x-2 sm:space-x-4">
//                <span className="flex items-center space-x-1">
//                  <svg className="h-3 w-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                  </svg>
//                  <span className="hidden sm:inline">Secure</span>
//                </span>
//                <span className="flex items-center space-x-1">
//                  <svg className="h-3 w-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
//                  </svg>
//                  <span className="hidden sm:inline">Fast</span>
//                </span>
//                <span className="flex items-center space-x-1">
//                  <svg className="h-3 w-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//                  </svg>
//                  <span className="hidden sm:inline">Reliable</span>
//                </span>
//             </span>
//            </p>
//          </div>
//       </footer>
//      </div>
//   );
// };

// export default Layout;
