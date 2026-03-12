import React from 'react';
import AdvanceDeposits from './AdvanceDeposits';


const AdvanceRegister = () => {
  return (
    <AdvanceDeposits
      registerType="Advance Register"
      defaultRegisterType="Advance Register"
      showLedgerField={true}
      title="Advance Register"
      description="Manage advance payments and records"
    />
  );
};

export default AdvanceRegister;