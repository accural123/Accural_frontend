
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';

// Popup Components (integrated from your Popup.jsx)
const Popup = ({ 
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
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
      />
      
      <div className={`relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/60 ${sizeClass} w-full mx-4 max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}>
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
        
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {children}
        </div>
        
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

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = 'warning',
  loading = false 
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
        </div>
      </div>
    </Popup>
  );
};

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [contactInfo, setContactInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [editingItem, setEditingItem] = useState(null);

  // Popup states
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'default',
    title: '',
    message: ''
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'warning'
  });

  // Popup helper functions
  const showNotification = (type, title, message) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }));
  };

  const showConfirm = (title, message, onConfirm, type = 'warning') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      type
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Load contact information from API
  useEffect(() => {
    fetchContactInfo();
    checkAdminAuth();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch('/api/contact-info');
      if (response.ok) {
        const data = await response.json();
        setContactInfo(data);
      } else {
        setContactInfo(getDefaultContactInfo());
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
      setContactInfo(getDefaultContactInfo());
    } finally {
      setLoading(false);
    }
  };

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/admin/check-auth', {
        credentials: 'include'
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password: adminPassword })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setAdminPassword('');
        setIsAdminMode(false);
        showNotification('success', 'Login Successful', 'Admin controls are now available.');
      } else {
        showNotification('error', 'Login Failed', 'Invalid password. Please try again.');
      }
    } catch (error) {
      showNotification('error', 'Authentication Error', 'Failed to connect to authentication service.');
    }
  };

  const handleSaveContactInfo = async (item) => {
    try {
      const response = await fetch('/api/admin/contact-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(item)
      });

      if (response.ok) {
        setContactInfo(prev => prev.map(info => 
          info.id === item.id ? item : info
        ));
        setEditingItem(null);
        showNotification('success', 'Update Successful', 'Contact information has been updated successfully.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Failed to update contact information. Please try again.';
        showNotification('error', 'Update Failed', errorMessage);
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      showNotification('error', 'Network Error', 'Unable to connect to the server. Please check your connection and try again.');
    }
  };

  const getDefaultContactInfo = () => [
    {
      id: 'email',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Support',
      details: 'support@accrualaccounting.com',
      description: 'Send us an email anytime!',
      enabled: true
    },
    {
      id: 'phone',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 8am to 6pm',
      enabled: true
    },
    {
      id: 'address',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Office Address',
      details: '123 Business Street, Suite 100',
      description: 'New York, NY 10001',
      enabled: true
    },
    {
      id: 'hours',
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Business Hours',
      details: 'Monday - Friday',
      description: '8:00 AM - 6:00 PM EST',
      enabled: true
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification('success', 'Message Sent!', 'Thank you for your message! We will get back to you soon.');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          priority: 'medium'
        });
      } else {
        showNotification('error', 'Send Failed', 'There was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showNotification('error', 'Network Error', 'Unable to send your message. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    showConfirm(
      'Confirm Logout',
      'Are you sure you want to logout from admin mode?',
      () => {
        setIsAuthenticated(false);
        setEditingItem(null);
        showNotification('info', 'Logged Out', 'You have been successfully logged out from admin mode.');
      },
      'info'
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const enabledContactInfo = contactInfo.filter(item => item.enabled);

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Contact Us</h1>
                <p className="text-slate-600">We're here to help! Get in touch with our support team.</p>
              </div>
            </div>
            
            {/* Admin Controls */}
            <div className="flex items-center space-x-2">
              {!isAuthenticated ? (
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  title="Admin Login"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                    Admin Mode
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Admin Login Form */}
          {isAdminMode && !isAuthenticated && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <form onSubmit={handleAdminLogin} className="flex items-center space-x-4">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Admin password"
                  className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminMode(false)}
                  className="px-4 py-2 bg-slate-300 hover:bg-slate-400 text-slate-700 text-sm rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="grid  grid-cols-1 lg:grid-cols-2 gap-6">
         

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Get in touch</h2>
                {isAuthenticated && (
                  <button
                    onClick={() => setEditingItem(editingItem ? null : 'all')}
                    className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                      editingItem ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    {editingItem ? 'Cancel Edit' : 'Edit Info'}
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {enabledContactInfo.map((item, index) => (
                  <ContactInfoItem
                    key={item.id || index}
                    item={item}
                    isEditing={isAuthenticated && editingItem === item.id}
                    onEdit={() => setEditingItem(item.id)}
                    onSave={handleSaveContactInfo}
                    onCancel={() => setEditingItem(null)}
                  />
                ))}
                
                {/* Show disabled items in admin mode */}
                {isAuthenticated && contactInfo.filter(item => !item.enabled).map((item, index) => (
                  <div key={`disabled-${item.id || index}`} className="opacity-50">
                    <ContactInfoItem
                      item={item}
                      isEditing={editingItem === item.id}
                      onEdit={() => setEditingItem(item.id)}
                      onSave={handleSaveContactInfo}
                      onCancel={() => setEditingItem(null)}
                      isDisabled={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Popup */}
      <Popup
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        type={notification.type}
        size="sm"
      >
        <div className="p-6">
          <p className="text-gray-700 text-lg">{notification.message}</p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={closeNotification}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </Popup>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        type={confirmDialog.type}
      />
    </>
  );
};

// Contact Info Item Component
const ContactInfoItem = ({ item, isEditing, onEdit, onSave, onCancel, isDisabled = false }) => {
  const [editData, setEditData] = useState({ ...item });

  useEffect(() => {
    setEditData({ ...item });
  }, [item]);

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="bg-slate-50 rounded-lg p-4 border-2 border-blue-200">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Details</label>
              <input
                type="text"
                value={editData.details}
                onChange={(e) => handleChange('details', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <input
              type="text"
              value={editData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`enabled-${item.id}`}
                checked={editData.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`enabled-${item.id}`} className="text-sm font-medium text-slate-700">
                Enabled
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between group">
      <div className="flex items-start space-x-4 flex-1">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
          {item.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-800">{item.title}</h3>
          <p className="text-slate-700 font-medium">{item.details}</p>
          <p className="text-slate-600 text-sm">{item.description}</p>
          {isDisabled && (
            <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
              Disabled
            </span>
          )}
        </div>
      </div>
      {!isEditing && onEdit && (
        <button
          onClick={onEdit}
          className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-100 hover:bg-blue-200 text-blue-600 px-2 py-1 rounded-lg text-sm font-medium"
        >
          Edit
        </button>
      )}
    </div>
  );
};

export default ContactUs;