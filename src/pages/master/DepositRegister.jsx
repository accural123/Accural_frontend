import React from 'react';
import AdvanceDeposits from './AdvanceDeposits';


const DepositRegister = () => {
  return (
    <AdvanceDeposits
      registerType="Deposit Register"
      defaultRegisterType="Deposit Register"
      showLedgerField={false} // Deposit register doesn't need ledger field
      title="Deposit Register"
      description="Manage deposit records and receipts"
    />
  );
};

export default DepositRegister;