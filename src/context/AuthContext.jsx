
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        loading: true,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has completed workspace selection
  const hasWorkspaceSelection = () => {
    const userSession = localStorage.getItem('userSession');
    return userSession !== null;
  };

  // Navigation logic after workspace selection
  const navigateToWorkspace = (userRole) => {
    const from = location.state?.from?.pathname || '/';
    
    switch (userRole) {
      case 'Administrator':
        navigate('/admin/users', { replace: true });
        break;
      case 'Data Entry Clerk':
        navigate('/', { replace: true });
        // navigate('/transaction/daily-collection', { replace: true });
        break;
      case 'Accountant':
        navigate('/', { replace: true });
        break;
      default:
        navigate(from === '/login' ? '/' : from, { replace: true });
    }
  };

  // Navigation logic based on authentication state
  const handlePostLoginNavigation = (user) => {
    // Always go to workspace selection first after login
    // unless user is Administrator (they might not need workspace selection)
    if (user.role === 'Administrator') {
      // Check if admin has workspace selection, if not redirect there
      if (!hasWorkspaceSelection()) {
        navigate('/select-workspace', { 
          state: { userId: user.id },
          replace: true 
        });
      } else {
        navigate('/admin/users', { replace: true });
      }
    } else {
      // Non-admin users always go through workspace selection
      navigate('/select-workspace', { 
        state: { userId: user.id },
        replace: true 
      });
    }
  };

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userStr = localStorage.getItem('currentUser');
        const loginTime = localStorage.getItem('loginTime');
        
        if (isAuthenticated && userStr && loginTime) {
          // Check if session is still valid (24 hours)
          const loginDate = new Date(loginTime);
          const now = new Date();
          const timeDiff = now.getTime() - loginDate.getTime();
          const hoursDiff = timeDiff / (1000 * 3600);
          
          if (hoursDiff < 24) {
            const user = JSON.parse(userStr);
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: user
            });
            
            // Handle navigation based on current location and workspace selection status
            if (location.pathname === '/login') {
              handlePostLoginNavigation(user);
            } else if (location.pathname === '/' || location.pathname.startsWith('/transaction') || 
                      location.pathname.startsWith('/reports') || location.pathname.startsWith('/admin')) {
              // Check if user has workspace selection for main app routes
              if (!hasWorkspaceSelection() && user.role !== 'Administrator') {
                navigate('/select-workspace', { 
                  state: { userId: user.id },
                  replace: true 
                });
              }
            }
          } else {
            // Session expired
            logout();
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, [location.pathname]);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const result = await authService.login(credentials);

      if (result.success && result.data) {
        const user = result.data.user;

        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loginTime', new Date().toISOString());

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: user
        });

        handlePostLoginNavigation(user);

        return { success: true, user };
      } else {
        throw new Error(result.message || 'Invalid username or password');
      }
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = async () => {
    try { await authService.logout(); } catch (_) {}
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    localStorage.removeItem('userSession');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    navigate('/login', { replace: true });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Function to check if user has specific role
  const hasRole = (requiredRole) => {
    return state.user?.role === requiredRole;
  };

  // Function to check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Function to complete workspace selection and navigate to appropriate dashboard
  const completeWorkspaceSelection = async (sessionData) => {
    try {
      // Notify backend about workspace selection and handle token swap
      const result = await authService.selectWorkspace({
        institutionId: sessionData.selectedInstitution.id,
        fundIds: sessionData.selectedFunds.map(f => f.id)
      });

      // Store the workspace selection
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      
      // If backend returned updated user data, update state
      if (result.success && result.data?.user) {
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: result.data.user
        });
        localStorage.setItem('currentUser', JSON.stringify(result.data.user));
      }
      
      // Navigate based on user role after workspace selection
      if (state.user) {
        navigateToWorkspace(state.user.role);
      }
    } catch (error) {
      console.error('Failed to notify backend about workspace selection:', error);
      // Still proceed with local session even if backend call fails
      localStorage.setItem('userSession', JSON.stringify(sessionData));
      if (state.user) {
        navigateToWorkspace(state.user.role);
      }
    }
  };

  // Function to get current workspace selection
  const getWorkspaceSelection = () => {
    const userSession = localStorage.getItem('userSession');
    return userSession ? JSON.parse(userSession) : null;
  };

  // Context value
  const value = {
    ...state,
    login,
    logout,
    clearError,
    hasRole,
    hasAnyRole,
    completeWorkspaceSelection,
    getWorkspaceSelection,
    hasWorkspaceSelection // Return the function, not the result
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AUTH_ACTIONS };