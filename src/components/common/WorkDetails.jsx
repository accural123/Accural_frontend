import React from 'react';
import { FormField } from "./FormField";
import { Building, User, DollarSign } from 'lucide-react';

const WorkDetails = ({ 
  formData, 
  onChange, 
  errors = {}, 
  disabled = false,
  title = "Work Details",
  showScheme = true,
  contractorLabel = "Name of the Contractor",
  contractorFieldName = "nameOfContractor"
}) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
        <Building className="h-5 w-5 mr-2 text-blue-500" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showScheme && (
          <FormField
            label="Name of the Scheme"
            name="nameOfScheme"
            value={formData.nameOfScheme || ''}
            onChange={onChange}
            error={errors.nameOfScheme}
            placeholder="Enter scheme name"
            disabled={disabled}
          />
        )}
        
        <FormField
          label="Name of the Work"
          name="nameOfWork"
          value={formData.nameOfWork || ''}
          onChange={onChange}
          error={errors.nameOfWork}
          placeholder="Enter work description"
          disabled={disabled}
        />
        
        <FormField
          label={contractorLabel}
          name={contractorFieldName}
          value={formData[contractorFieldName] || ''}
          onChange={onChange}
          error={errors[contractorFieldName]}
          placeholder={contractorLabel.includes('Contractor') ? 'Enter contractor name' : 'Enter supplier name'}
          disabled={disabled}
          icon={User}
        />
        
        <FormField
          label="Estimate Value (₹)"
          name="estimateValue"
          value={formData.estimateValue || ''}
          onChange={onChange}
          error={errors.estimateValue}
          placeholder="0.00"
          disabled={disabled}
          icon={DollarSign}
        />
        
        <FormField
          label="Value of Work Done (₹)"
          name="valueOfWorkDone"
          value={formData.valueOfWorkDone || ''}
          onChange={onChange}
          error={errors.valueOfWorkDone}
          placeholder="0.00"
          disabled={disabled}
          icon={DollarSign}
        />
        
        <FormField
          label="Amount (₹)"
          name="workAmount"
          value={formData.workAmount || ''}
          onChange={onChange}
          error={errors.workAmount}
          placeholder="0.00"
          disabled={disabled}
          icon={DollarSign}
        />
      </div>
    </div>
  );
};

export default WorkDetails;