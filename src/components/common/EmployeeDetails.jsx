import React from 'react';
import { FormField } from "./FormField";
import { User, Users, Calendar, DollarSign } from 'lucide-react';

const EmployeeDetails = ({ 
  formData, 
  onChange, 
  errors = {}, 
  disabled = false,
  title = "Employee Details" 
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
        <User className="h-5 w-5 mr-2 text-orange-500" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField
          label="Name of the Employee"
          name="nameOfEmployee"
          value={formData.nameOfEmployee || ''}
          onChange={onChange}
          error={errors.nameOfEmployee}
          placeholder="Enter employee name"
          disabled={disabled}
          icon={User}
        />
        
        <FormField
          label="Designation"
          name="designation"
          value={formData.designation || ''}
          onChange={onChange}
          error={errors.designation}
          placeholder="Enter designation"
          disabled={disabled}
        />
        
        <FormField
          label="Section"
          name="section"
          value={formData.section || ''}
          onChange={onChange}
          error={errors.section}
          placeholder="Enter section/department"
          disabled={disabled}
          icon={Users}
        />
        
        <FormField
          label="Month & Year"
          name="monthYear"
          type="month"
          value={formData.monthYear || ''}
          onChange={onChange}
          error={errors.monthYear}
          disabled={disabled}
          icon={Calendar}
        />
        
        <FormField
          label="Amount (₹)"
          name="employeeAmount"
          value={formData.employeeAmount || ''}
          onChange={onChange}
          error={errors.employeeAmount}
          placeholder="0.00"
          disabled={disabled}
          icon={DollarSign}
          
        />
      </div>
    </div>
  );
};

export default EmployeeDetails;