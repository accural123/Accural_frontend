// ===== Updated src/components/common/index.js =====
/**
 * Complete barrel export with all components
 */

// Import all components
import Toast from './Toast';
import ToastContainer from './ToastContainer';
import BalanceStatus from './BalanceStatus';
import EmptyState from './EmptyState';
import EntriesSection from './EntriesSection';
import ErrorDisplay from './ErrorDisplay';
import FormField from './FormField';
import Header from './Header';
import ModernVoucherRow from './ModernVoucherRow';
import RadioGroup from './RadioGroup';
import SearchableRecords from './SearchableRecords';
import SubmitButton from './SubmitButton';

// Export as both named and default for maximum compatibility
export { default as Toast } from './Toast';
export { default as ToastContainer } from './ToastContainer';
export { default as BalanceStatus } from './BalanceStatus';
export { default as EmptyState } from './EmptyState';
export { default as EntriesSection } from './EntriesSection';
export { default as ErrorDisplay } from './ErrorDisplay';
export { default as FormField } from './FormField';
export { default as Header } from './Header';
export { default as ModernVoucherRow } from './ModernVoucherRow';
export { default as RadioGroup } from './RadioGroup';
export { default as SearchableRecords } from './SearchableRecords';
export { default as SubmitButton } from './SubmitButton';

// Named exports for destructuring
export { 
  Toast, 
  ToastContainer, 
  BalanceStatus, 
  EmptyState, 
  EntriesSection, 
  ErrorDisplay, 
  FormField, 
  Header, 
  ModernVoucherRow, 
  RadioGroup, 
  SearchableRecords, 
  SubmitButton 
};