// Mock Institution Service
export const institutionService = {
  getAll: async (params = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      return {
        success: true,
        data: institutions,
        message: 'Institutions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch institutions'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      const institution = institutions.find(inst => inst.id === id);
      
      if (institution) {
        return {
          success: true,
          data: institution,
          message: 'Institution retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Institution not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch institution'
      };
    }
  },

  create: async (institutionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      const newInstitution = {
        ...institutionData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      institutions.push(newInstitution);
      localStorage.setItem('institutions', JSON.stringify(institutions));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('institutionsUpdated', { 
        detail: institutions 
      }));
      
      return {
        success: true,
        data: newInstitution,
        message: 'Institution created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create institution'
      };
    }
  },

  update: async (id, institutionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      const index = institutions.findIndex(inst => inst.id === id);
      
      if (index !== -1) {
        institutions[index] = {
          ...institutions[index],
          ...institutionData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('institutions', JSON.stringify(institutions));
        
        window.dispatchEvent(new CustomEvent('institutionsUpdated', { 
          detail: institutions 
        }));
        
        return {
          success: true,
          data: institutions[index],
          message: 'Institution updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Institution not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update institution'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      const filteredInstitutions = institutions.filter(inst => inst.id !== id);
      
      if (institutions.length !== filteredInstitutions.length) {
        localStorage.setItem('institutions', JSON.stringify(filteredInstitutions));
        
        window.dispatchEvent(new CustomEvent('institutionsUpdated', { 
          detail: filteredInstitutions 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Institution deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Institution not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete institution'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const institutions = JSON.parse(localStorage.getItem('institutions') || '[]');
      const filtered = institutions.filter(inst =>
        inst.institutionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.mailingName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  }
};

// Mock Ledger Service
export const ledgerService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      return {
        success: true,
        data: ledgers,
        message: 'Ledgers retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch ledgers'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      const ledger = ledgers.find(led => led.id === id);
      
      if (ledger) {
        return {
          success: true,
          data: ledger,
          message: 'Ledger retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Ledger not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch ledger'
      };
    }
  },

  create: async (ledgerData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      const newLedger = {
        ...ledgerData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      ledgers.push(newLedger);
      localStorage.setItem('ledgers', JSON.stringify(ledgers));
      
      window.dispatchEvent(new CustomEvent('ledgersUpdated', { 
        detail: ledgers 
      }));
      
      return {
        success: true,
        data: newLedger,
        message: 'Ledger created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create ledger'
      };
    }
  },

  update: async (id, ledgerData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      const index = ledgers.findIndex(led => led.id === id);
      
      if (index !== -1) {
        ledgers[index] = {
          ...ledgers[index],
          ...ledgerData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('ledgers', JSON.stringify(ledgers));
        
        window.dispatchEvent(new CustomEvent('ledgersUpdated', { 
          detail: ledgers 
        }));
        
        return {
          success: true,
          data: ledgers[index],
          message: 'Ledger updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Ledger not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update ledger'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      const filteredLedgers = ledgers.filter(led => led.id !== id);
      
      if (ledgers.length !== filteredLedgers.length) {
        localStorage.setItem('ledgers', JSON.stringify(filteredLedgers));
        
        window.dispatchEvent(new CustomEvent('ledgersUpdated', { 
          detail: filteredLedgers 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Ledger deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Ledger not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete ledger'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const ledgers = JSON.parse(localStorage.getItem('ledgers') || '[]');
      const filtered = ledgers.filter(led =>
        led.ledgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        led.underGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        led.bankName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  }
};
// Mock Group Service
export const groupService = {
  getAll: async (params = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      return {
        success: true,
        data: groups,
        message: 'Groups retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch groups'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const group = groups.find(grp => grp.id === id);
      
      if (group) {
        return {
          success: true,
          data: group,
          message: 'Group retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Group not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch group'
      };
    }
  },

  create: async (groupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      
      // Check if group name already exists under the same main group
      const existingGroup = groups.find(grp => 
        grp.groupName.toLowerCase() === groupData.groupName.toLowerCase() &&
        grp.underMainGroup === groupData.underMainGroup
      );
      
      if (existingGroup) {
        return {
          success: false,
          data: null,
          message: 'Group name already exists under this main group'
        };
      }
      
      const newGroup = {
        ...groupData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        groupCode: `GRP${String(Date.now()).slice(-6)}` // Generate group code
      };
      
      groups.push(newGroup);
      localStorage.setItem('groups', JSON.stringify(groups));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('groupsUpdated', { 
        detail: groups 
      }));
      
      return {
        success: true,
        data: newGroup,
        message: 'Group created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create group'
      };
    }
  },

  update: async (id, groupData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const index = groups.findIndex(grp => grp.id === id);
      
      if (index !== -1) {
        // Check if updated group name already exists under the same main group (excluding current group)
        const existingGroup = groups.find(grp => 
          grp.id !== id &&
          grp.groupName.toLowerCase() === groupData.groupName.toLowerCase() &&
          grp.underMainGroup === groupData.underMainGroup
        );
        
        if (existingGroup) {
          return {
            success: false,
            data: null,
            message: 'Group name already exists under this main group'
          };
        }
        
        groups[index] = {
          ...groups[index],
          ...groupData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('groups', JSON.stringify(groups));
        
        window.dispatchEvent(new CustomEvent('groupsUpdated', { 
          detail: groups 
        }));
        
        return {
          success: true,
          data: groups[index],
          message: 'Group updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Group not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update group'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const groupToDelete = groups.find(grp => grp.id === id);
      
      if (!groupToDelete) {
        return {
          success: false,
          data: null,
          message: 'Group not found'
        };
      }
      
      // Check if group has any ledgers associated (you might want to implement this check)
      // For now, we'll allow deletion but you can add validation here
      
      const filteredGroups = groups.filter(grp => grp.id !== id);
      
      if (groups.length !== filteredGroups.length) {
        localStorage.setItem('groups', JSON.stringify(filteredGroups));
        
        window.dispatchEvent(new CustomEvent('groupsUpdated', { 
          detail: filteredGroups 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Group deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Group not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete group'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const filtered = groups.filter(grp =>
        grp.groupName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grp.underMainGroup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grp.groupCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Get groups by main group (useful for dropdown population)
  getByMainGroup: async (mainGroup) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const filtered = groups.filter(grp => grp.underMainGroup === mainGroup);
      
      return {
        success: true,
        data: filtered,
        message: 'Groups retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch groups by main group'
      };
    }
  },

  // Get all main groups with their sub-groups count
  getMainGroupsSummary: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const mainGroups = ['Assets', 'Liabilities', 'Income', 'Expenditure'];
      
      const summary = mainGroups.map(mainGroup => {
        const subGroups = groups.filter(grp => grp.underMainGroup === mainGroup);
        return {
          mainGroup,
          count: subGroups.length,
          subGroups: subGroups.map(grp => ({
            id: grp.id,
            groupName: grp.groupName,
            groupCode: grp.groupCode,
            status: grp.status
          }))
        };
      });
      
      return {
        success: true,
        data: summary,
        message: 'Main groups summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch main groups summary'
      };
    }
  },

  // Bulk operations
  bulkDelete: async (ids) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const filteredGroups = groups.filter(grp => !ids.includes(grp.id));
      
      const deletedCount = groups.length - filteredGroups.length;
      
      if (deletedCount > 0) {
        localStorage.setItem('groups', JSON.stringify(filteredGroups));
        
        window.dispatchEvent(new CustomEvent('groupsUpdated', { 
          detail: filteredGroups 
        }));
        
        return {
          success: true,
          data: { deletedCount },
          message: `${deletedCount} group(s) deleted successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'No groups were deleted'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete groups'
      };
    }
  },

  // Validate group name uniqueness
  validateGroupName: async (groupName, underMainGroup, excludeId = null) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const groups = JSON.parse(localStorage.getItem('groups') || '[]');
      const existingGroup = groups.find(grp => 
        grp.groupName.toLowerCase() === groupName.toLowerCase() &&
        grp.underMainGroup === underMainGroup &&
        grp.id !== excludeId
      );
      
      return {
        success: true,
        data: { isUnique: !existingGroup },
        message: existingGroup ? 'Group name already exists' : 'Group name is available'
      };
    } catch (error) {
      return {
        success: false,
        data: { isUnique: false },
        message: 'Failed to validate group name'
      };
    }
  }
};
export const fundService = {
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const funds = JSON.parse(localStorage.getItem('funds') || '[]');
      return {
        success: true,
        data: funds,
        message: 'Funds retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch funds'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const funds = JSON.parse(localStorage.getItem('funds') || '[]');
      const fund = funds.find(f => f.id === id);

      if (fund) {
        return {
          success: true,
          data: fund,
          message: 'Fund retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Fund not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch fund'
      };
    }
  },

  create: async (fundData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const funds = JSON.parse(localStorage.getItem('funds') || '[]');
      const newFund = {
        ...fundData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };

      funds.push(newFund);
      localStorage.setItem('funds', JSON.stringify(funds));

      window.dispatchEvent(new CustomEvent('fundsUpdated', {
        detail: funds
      }));

      return {
        success: true,
        data: newFund,
        message: 'Fund created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create fund'
      };
    }
  },

  update: async (id, fundData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const funds = JSON.parse(localStorage.getItem('funds') || '[]');
      const index = funds.findIndex(f => f.id === id);

      if (index !== -1) {
        funds[index] = {
          ...funds[index],
          ...fundData,
          id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };

        localStorage.setItem('funds', JSON.stringify(funds));

        window.dispatchEvent(new CustomEvent('fundsUpdated', {
          detail: funds
        }));

        return {
          success: true,
          data: funds[index],
          message: 'Fund updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Fund not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update fund'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const funds = JSON.parse(localStorage.getItem('funds') || '[]');
      const filteredFunds = funds.filter(f => f.id !== id);

      if (funds.length !== filteredFunds.length) {
        localStorage.setItem('funds', JSON.stringify(filteredFunds));

        window.dispatchEvent(new CustomEvent('fundsUpdated', {
          detail: filteredFunds
        }));

        return {
          success: true,
          data: null,
          message: 'Fund deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Fund not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete fund'
      };
    }
  }
};


// Helper function to seed initial data (call this once during app initialization)
export const seedGroupData = () => {
  const existingGroups = JSON.parse(localStorage.getItem('groups') || '[]');
  
  if (existingGroups.length === 0) {
    const initialGroups = [
      {
        id: 1,
        groupName: 'Current Assets',
        underMainGroup: 'Assets',
        description: 'Assets that can be converted to cash within one year',
        status: 'Active',
        groupCode: 'GRP001',
        createdDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 2,
        groupName: 'Fixed Assets',
        underMainGroup: 'Assets',
        description: 'Long-term assets used in business operations',
        status: 'Active',
        groupCode: 'GRP002',
        createdDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 3,
        groupName: 'Current Liabilities',
        underMainGroup: 'Liabilities',
        description: 'Debts or obligations due within one year',
        status: 'Active',
        groupCode: 'GRP003',
        createdDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 4,
        groupName: 'Sales Revenue',
        underMainGroup: 'Income',
        description: 'Revenue generated from primary business activities',
        status: 'Active',
        groupCode: 'GRP004',
        createdDate: new Date().toISOString().split('T')[0]
      },
      {
        id: 5,
        groupName: 'Operating Expenses',
        underMainGroup: 'Expenditure',
        description: 'Expenses incurred in normal business operations',
        status: 'Active',
        groupCode: 'GRP005',
        createdDate: new Date().toISOString().split('T')[0]
      }
    ];
    
    localStorage.setItem('groups', JSON.stringify(initialGroups));
    console.log('Initial group data seeded');
  }
};

// Mock Voucher Service
export const voucherTypeService = {
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      return {
        success: true,
        data: vouchers,
        message: 'Vouchers retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch vouchers',
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      const voucher = vouchers.find(v => v.id === id);

      if (voucher) {
        return {
          success: true,
          data: voucher,
          message: 'Voucher retrieved successfully',
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Voucher not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch voucher',
      };
    }
  },

  create: async (voucherData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      const newVoucher = {
        ...voucherData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };

      vouchers.push(newVoucher);
      localStorage.setItem('vouchers', JSON.stringify(vouchers));

      window.dispatchEvent(new CustomEvent('vouchersUpdated', {
        detail: vouchers,
      }));

      return {
        success: true,
        data: newVoucher,
        message: 'Voucher created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create voucher',
      };
    }
  },

  update: async (id, voucherData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      const index = vouchers.findIndex(v => v.id === id);

      if (index !== -1) {
        vouchers[index] = {
          ...vouchers[index],
          ...voucherData,
          id,
          lastUpdated: new Date().toISOString().split('T')[0],
        };

        localStorage.setItem('vouchers', JSON.stringify(vouchers));

        window.dispatchEvent(new CustomEvent('vouchersUpdated', {
          detail: vouchers,
        }));

        return {
          success: true,
          data: vouchers[index],
          message: 'Voucher updated successfully',
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Voucher not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update voucher',
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      const filtered = vouchers.filter(v => v.id !== id);

      if (filtered.length !== vouchers.length) {
        localStorage.setItem('vouchers', JSON.stringify(filtered));

        window.dispatchEvent(new CustomEvent('vouchersUpdated', {
          detail: filtered,
        }));

        return {
          success: true,
          data: null,
          message: 'Voucher deleted successfully',
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Voucher not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete voucher',
      };
    }
  },

  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));

      const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
      const filtered = vouchers.filter(v =>
        v.voucherNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.voucherType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.partyName?.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed',
      };
    }
  }
};
// Mock Opening Balance Service
export const openingBalanceService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      return {
        success: true,
        data: openingBalances,
        message: 'Opening balances retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch opening balances'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const openingBalance = openingBalances.find(ob => ob.id === id);
      
      if (openingBalance) {
        return {
          success: true,
          data: openingBalance,
          message: 'Opening balance retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Opening balance not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch opening balance'
      };
    }
  },

  create: async (openingBalanceData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const newOpeningBalance = {
        ...openingBalanceData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: 'Active'
      };
      
      openingBalances.push(newOpeningBalance);
      localStorage.setItem('openingBalances', JSON.stringify(openingBalances));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Opening Balance',
        action: 'CREATE',
        description: `Opening balance created: ${newOpeningBalance.description}`,
        userName: 'Current User',
        details: {
          recordId: newOpeningBalance.id,
          totalEntries: newOpeningBalance.entries?.length || 0,
          debitTotal: newOpeningBalance.debitTotal,
          creditTotal: newOpeningBalance.creditTotal
        }
      });
      
      window.dispatchEvent(new CustomEvent('openingBalancesUpdated', { 
        detail: openingBalances 
      }));
      
      return {
        success: true,
        data: newOpeningBalance,
        message: 'Opening balance created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create opening balance'
      };
    }
  },

  update: async (id, openingBalanceData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const index = openingBalances.findIndex(ob => ob.id === id);
      
      if (index !== -1) {
        const oldData = { ...openingBalances[index] };
        openingBalances[index] = {
          ...openingBalances[index],
          ...openingBalanceData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('openingBalances', JSON.stringify(openingBalances));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Opening Balance',
          action: 'UPDATE',
          description: `Opening balance updated: ${openingBalances[index].description}`,
          userName: 'Current User',
          details: {
            recordId: id,
            oldData: { debitTotal: oldData.debitTotal, creditTotal: oldData.creditTotal },
            newData: { debitTotal: openingBalances[index].debitTotal, creditTotal: openingBalances[index].creditTotal }
          }
        });
        
        window.dispatchEvent(new CustomEvent('openingBalancesUpdated', { 
          detail: openingBalances 
        }));
        
        return {
          success: true,
          data: openingBalances[index],
          message: 'Opening balance updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Opening balance not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update opening balance'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const recordToDelete = openingBalances.find(ob => ob.id === id);
      const filteredOpeningBalances = openingBalances.filter(ob => ob.id !== id);
      
      if (openingBalances.length !== filteredOpeningBalances.length) {
        localStorage.setItem('openingBalances', JSON.stringify(filteredOpeningBalances));
        
        // Log audit trail
        if (recordToDelete) {
          await auditTrailService.log({
            module: 'Opening Balance',
            action: 'DELETE',
            description: `Opening balance deleted: ${recordToDelete.description}`,
            userName: 'Current User',
            details: {
              recordId: id,
              deletedData: {
                description: recordToDelete.description,
                totalEntries: recordToDelete.entries?.length || 0,
                debitTotal: recordToDelete.debitTotal,
                creditTotal: recordToDelete.creditTotal
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('openingBalancesUpdated', { 
          detail: filteredOpeningBalances 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Opening balance deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Opening balance not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete opening balance'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const filtered = openingBalances.filter(ob =>
        ob.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ob.entries?.some(entry => 
          entry.accountCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.accountHead?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  getSummary: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      
      const summary = {
        totalOpeningBalances: openingBalances.length,
        totalDebitAmount: 0,
        totalCreditAmount: 0,
        balancedEntries: 0,
        unbalancedEntries: 0,
        latestBalance: null
      };
      
      openingBalances.forEach(ob => {
        summary.totalDebitAmount += ob.debitTotal || 0;
        summary.totalCreditAmount += ob.creditTotal || 0;
        
        if (ob.debitTotal === ob.creditTotal) {
          summary.balancedEntries++;
        } else {
          summary.unbalancedEntries++;
        }
      });
      
      // Get latest opening balance
      if (openingBalances.length > 0) {
        summary.latestBalance = openingBalances
          .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];
      }
      
      return {
        success: true,
        data: summary,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get summary'
      };
    }
  }
};

// Mock Account Service
export const accountService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      
      if (accounts.length === 0) {
        accounts = getSampleAccounts();
        localStorage.setItem('accounts', JSON.stringify(accounts));
      }
      
      // Apply filters if provided
      let filtered = accounts;
      if (params.group) {
        filtered = filtered.filter(acc => acc.group === params.group);
      }
      if (params.type) {
        filtered = filtered.filter(acc => acc.type === params.type);
      }
      if (params.status) {
        filtered = filtered.filter(acc => acc.status === params.status);
      }
      
      return {
        success: true,
        data: filtered,
        message: 'Accounts retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch accounts'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const account = accounts.find(acc => acc.id === id);
      
      if (account) {
        return {
          success: true,
          data: account,
          message: 'Account retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Account not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch account'
      };
    }
  },

  getByCode: async (code) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const account = accounts.find(acc => acc.code === code);
      
      if (account) {
        return {
          success: true,
          data: account,
          message: 'Account retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Account not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch account'
      };
    }
  },

  create: async (accountData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      
      // Check if account code already exists
      const existingAccount = accounts.find(acc => acc.code === accountData.code);
      if (existingAccount) {
        return {
          success: false,
          data: null,
          message: 'Account code already exists'
        };
      }
      
      const newAccount = {
        ...accountData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      accounts.push(newAccount);
      localStorage.setItem('accounts', JSON.stringify(accounts));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Accounts',
        action: 'CREATE',
        description: `Account created: ${newAccount.code} - ${newAccount.name}`,
        userName: 'Current User',
        details: { accountCode: newAccount.code, accountName: newAccount.name, group: newAccount.group }
      });
      
      window.dispatchEvent(new CustomEvent('accountsUpdated', { 
        detail: accounts 
      }));
      
      return {
        success: true,
        data: newAccount,
        message: 'Account created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create account'
      };
    }
  },

  update: async (id, accountData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const index = accounts.findIndex(acc => acc.id === id);
      
      if (index !== -1) {
        // Check if updated code already exists (excluding current account)
        const existingAccount = accounts.find(acc => 
          acc.code === accountData.code && acc.id !== id
        );
        if (existingAccount) {
          return {
            success: false,
            data: null,
            message: 'Account code already exists'
          };
        }
        
        const oldData = { ...accounts[index] };
        accounts[index] = {
          ...accounts[index],
          ...accountData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Accounts',
          action: 'UPDATE',
          description: `Account updated: ${accounts[index].code} - ${accounts[index].name}`,
          userName: 'Current User',
          details: {
            accountId: id,
            oldData: { code: oldData.code, name: oldData.name, group: oldData.group },
            newData: { code: accounts[index].code, name: accounts[index].name, group: accounts[index].group }
          }
        });
        
        window.dispatchEvent(new CustomEvent('accountsUpdated', { 
          detail: accounts 
        }));
        
        return {
          success: true,
          data: accounts[index],
          message: 'Account updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Account not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update account'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const accountToDelete = accounts.find(acc => acc.id === id);
      const filteredAccounts = accounts.filter(acc => acc.id !== id);
      
      if (accounts.length !== filteredAccounts.length) {
        localStorage.setItem('accounts', JSON.stringify(filteredAccounts));
        
        // Log audit trail
        if (accountToDelete) {
          await auditTrailService.log({
            module: 'Accounts',
            action: 'DELETE',
            description: `Account deleted: ${accountToDelete.code} - ${accountToDelete.name}`,
            userName: 'Current User',
            details: {
              accountId: id,
              deletedData: { code: accountToDelete.code, name: accountToDelete.name, group: accountToDelete.group }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('accountsUpdated', { 
          detail: filteredAccounts 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Account deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Account not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete account'
      };
    }
  },

  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const filtered = accounts.filter(acc =>
        acc.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acc.group?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  getByGroup: async (groupName) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const filtered = accounts.filter(acc => acc.group === groupName);
      
      return {
        success: true,
        data: filtered,
        message: 'Accounts retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch accounts by group'
      };
    }
  },

  getByType: async (accountType) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const filtered = accounts.filter(acc => acc.type === accountType);
      
      return {
        success: true,
        data: filtered,
        message: 'Accounts retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch accounts by type'
      };
    }
  },

  validateCode: async (code, excludeId = null) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const existingAccount = accounts.find(acc => 
        acc.code === code && acc.id !== excludeId
      );
      
      return {
        success: true,
        data: { isUnique: !existingAccount },
        message: existingAccount ? 'Account code already exists' : 'Account code is available'
      };
    } catch (error) {
      return {
        success: false,
        data: { isUnique: false },
        message: 'Failed to validate account code'
      };
    }
  }
};

// Mock Transaction Service
export const transactionService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      let filtered = transactions;
      if (params.fromDate) {
        filtered = filtered.filter(t => t.date >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(t => t.date <= params.toDate);
      }
      if (params.accountCode) {
        filtered = filtered.filter(t => 
          t.entries.some(entry => entry.accountCode === params.accountCode)
        );
      }
      if (params.status) {
        filtered = filtered.filter(t => t.status === params.status);
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.date) - new Date(a.date)),
        message: 'Transactions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch transactions'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const transaction = transactions.find(t => t.id === id);
      
      if (transaction) {
        return {
          success: true,
          data: transaction,
          message: 'Transaction retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Transaction not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch transaction'
      };
    }
  },

  create: async (transactionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Generate transaction number
      const transactionNumber = `TXN${String(transactions.length + 1).padStart(3, '0')}`;
      
      const newTransaction = {
        ...transactionData,
        id: Date.now(),
        transactionNumber,
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: 'Posted'
      };
      
      transactions.push(newTransaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Transactions',
        action: 'CREATE',
        description: `Transaction created: ${newTransaction.transactionNumber} - ${newTransaction.description}`,
        userName: 'Current User',
        details: {
          transactionNumber: newTransaction.transactionNumber,
          amount: newTransaction.totalAmount,
          entriesCount: newTransaction.entries?.length || 0
        }
      });
      
      window.dispatchEvent(new CustomEvent('transactionsUpdated', { 
        detail: transactions 
      }));
      
      return {
        success: true,
        data: newTransaction,
        message: 'Transaction created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create transaction'
      };
    }
  },

  update: async (id, transactionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const index = transactions.findIndex(t => t.id === id);
      
      if (index !== -1) {
        const oldData = { ...transactions[index] };
        transactions[index] = {
          ...transactions[index],
          ...transactionData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Transactions',
          action: 'UPDATE',
          description: `Transaction updated: ${transactions[index].transactionNumber}`,
          userName: 'Current User',
          details: {
            transactionId: id,
            transactionNumber: transactions[index].transactionNumber,
            oldAmount: oldData.totalAmount,
            newAmount: transactions[index].totalAmount
          }
        });
        
        window.dispatchEvent(new CustomEvent('transactionsUpdated', { 
          detail: transactions 
        }));
        
        return {
          success: true,
          data: transactions[index],
          message: 'Transaction updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Transaction not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update transaction'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const transactionToDelete = transactions.find(t => t.id === id);
      const filteredTransactions = transactions.filter(t => t.id !== id);
      
      if (transactions.length !== filteredTransactions.length) {
        localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
        
        // Log audit trail
        if (transactionToDelete) {
          await auditTrailService.log({
            module: 'Transactions',
            action: 'DELETE',
            description: `Transaction deleted: ${transactionToDelete.transactionNumber}`,
            userName: 'Current User',
            details: {
              transactionId: id,
              transactionNumber: transactionToDelete.transactionNumber,
              amount: transactionToDelete.totalAmount,
              description: transactionToDelete.description
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('transactionsUpdated', { 
          detail: filteredTransactions 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Transaction deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Transaction not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete transaction'
      };
    }
  },

  getByAccountCode: async (accountCode) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const filtered = transactions.filter(t => 
        t.entries.some(entry => entry.accountCode === accountCode)
      );
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.date) - new Date(a.date)),
        message: 'Account transactions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch account transactions'
      };
    }
  },

  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const filtered = transactions.filter(t =>
        t.transactionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.entries?.some(entry => 
          entry.accountCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.accountHead?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  }
};

// Mock Report Service
export const reportService = {
  getTrialBalance: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Get latest opening balance
      const latestOpeningBalance = openingBalances
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];
      
      const trialBalanceData = accounts.map(account => {
        // Get opening balance for this account
        const openingEntry = latestOpeningBalance?.entries?.find(
          entry => entry.accountCode === account.code
        );
        
        let debitBalance = 0;
        let creditBalance = 0;
        
        if (openingEntry) {
          if (openingEntry.type === 'Debit') {
            debitBalance = openingEntry.amount;
          } else {
            creditBalance = openingEntry.amount;
          }
        }
        
        // Add transaction amounts
        transactions.forEach(transaction => {
          // Filter by date if provided
          if (params.fromDate && transaction.date < params.fromDate) return;
          if (params.toDate && transaction.date > params.toDate) return;
          
          transaction.entries?.forEach(entry => {
            if (entry.accountCode === account.code) {
              if (entry.type === 'Debit') {
                debitBalance += entry.amount || 0;
              } else {
                creditBalance += entry.amount || 0;
              }
            }
          });
        });
        
        return {
          accountCode: account.code,
          accountName: account.name,
          accountGroup: account.group,
          accountType: account.type,
          debitBalance,
          creditBalance,
          netBalance: debitBalance - creditBalance
        };
      });
      
      // Filter out accounts with zero balances unless requested
      const filteredData = params.includeZeroBalances 
        ? trialBalanceData 
        : trialBalanceData.filter(item => item.debitBalance > 0 || item.creditBalance > 0);
      
      const totalDebits = filteredData.reduce((sum, item) => sum + item.debitBalance, 0);
      const totalCredits = filteredData.reduce((sum, item) => sum + item.creditBalance, 0);
      
      return {
        success: true,
        data: {
          accounts: filteredData,
          totalDebits,
          totalCredits,
          difference: totalDebits - totalCredits,
          isBalanced: Math.abs(totalDebits - totalCredits) < 0.01,
          generatedDate: new Date().toISOString().split('T')[0],
          parameters: params
        },
        message: 'Trial balance generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate trial balance'
      };
    }
  },

  getBalanceSheet: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const trialBalanceResult = await reportService.getTrialBalance(params);
      
      if (!trialBalanceResult.success) {
        return {
          success: false,
          data: null,
          message: 'Failed to generate balance sheet'
        };
      }
      
      const accounts = trialBalanceResult.data.accounts;
      
      // Categorize accounts
      const assets = accounts.filter(acc => 
        acc.accountType === 'Asset' || acc.accountGroup.includes('Assets') || acc.accountGroup === 'Investments'
      );
      const liabilities = accounts.filter(acc => 
        acc.accountType === 'Liability' || acc.accountGroup.includes('Liabilities')
      );
      const capital = accounts.filter(acc => 
        acc.accountType === 'Capital' || acc.accountGroup === 'Capital'
      );
      
      // Calculate totals (considering normal balance sides)
      const totalAssets = assets.reduce((sum, acc) => {
        return sum + (acc.netBalance > 0 ? acc.netBalance : 0);
      }, 0);
      
      const totalLiabilities = liabilities.reduce((sum, acc) => {
        return sum + (acc.netBalance < 0 ? Math.abs(acc.netBalance) : 0);
      }, 0);
      
      const totalCapital = capital.reduce((sum, acc) => {
        return sum + (acc.netBalance < 0 ? Math.abs(acc.netBalance) : 0);
      }, 0);
      
      return {
        success: true,
        data: {
          assets: assets.filter(acc => acc.netBalance !== 0),
          liabilities: liabilities.filter(acc => acc.netBalance !== 0),
          capital: capital.filter(acc => acc.netBalance !== 0),
          totalAssets,
          totalLiabilities,
          totalCapital,
          totalLiabilitiesAndCapital: totalLiabilities + totalCapital,
          isBalanced: Math.abs(totalAssets - (totalLiabilities + totalCapital)) < 1,
          generatedDate: new Date().toISOString().split('T')[0],
          parameters: params
        },
        message: 'Balance sheet generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate balance sheet'
      };
    }
  },

  getIncomeStatement: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
      
      const trialBalanceResult = await reportService.getTrialBalance(params);
      
      if (!trialBalanceResult.success) {
        return {
          success: false,
          data: null,
          message: 'Failed to generate income statement'
        };
      }
      
      const accounts = trialBalanceResult.data.accounts;
      
      // Categorize income and expense accounts
      const incomeAccounts = accounts.filter(acc => 
        acc.accountType === 'Income' || acc.accountGroup.includes('Income')
      );
      const expenseAccounts = accounts.filter(acc => 
        acc.accountType === 'Expense' || acc.accountGroup.includes('Expense')
      );
      
      const totalIncome = incomeAccounts.reduce((sum, acc) => {
        return sum + (acc.creditBalance || 0);
      }, 0);
      
      const totalExpenses = expenseAccounts.reduce((sum, acc) => {
        return sum + (acc.debitBalance || 0);
      }, 0);
      
      const netIncome = totalIncome - totalExpenses;
      
      return {
        success: true,
        data: {
          incomeAccounts: incomeAccounts.filter(acc => acc.creditBalance > 0),
          expenseAccounts: expenseAccounts.filter(acc => acc.debitBalance > 0),
          totalIncome,
          totalExpenses,
          netIncome,
          isProfit: netIncome > 0,
          generatedDate: new Date().toISOString().split('T')[0],
          parameters: params
        },
        message: 'Income statement generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate income statement'
      };
    }
  },

  getCashFlow: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      // Filter transactions by date range
      let filteredTransactions = transactions;
      if (params.fromDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date >= params.fromDate);
      }
      if (params.toDate) {
        filteredTransactions = filteredTransactions.filter(t => t.date <= params.toDate);
      }
      
      // Get cash accounts (simplified - codes starting with 1000-1019)
      const cashAccounts = ['1000', '1010', '1011', '1012'];
      
      let cashInflows = 0;
      let cashOutflows = 0;
      const cashFlowItems = [];
      
      filteredTransactions.forEach(transaction => {
        transaction.entries?.forEach(entry => {
          if (cashAccounts.includes(entry.accountCode)) {
            const item = {
              date: transaction.date,
              description: transaction.description,
              reference: transaction.reference,
              accountCode: entry.accountCode,
              accountHead: entry.accountHead,
              amount: entry.amount,
              type: entry.type
            };
            
            if (entry.type === 'Debit') {
              cashInflows += entry.amount;
              item.flowType = 'Inflow';
            } else {
              cashOutflows += entry.amount;
              item.flowType = 'Outflow';
            }
            
            cashFlowItems.push(item);
          }
        });
      });
      
      const netCashFlow = cashInflows - cashOutflows;
      
      return {
        success: true,
        data: {
          cashFlowItems: cashFlowItems.sort((a, b) => new Date(b.date) - new Date(a.date)),
          totalInflows: cashInflows,
          totalOutflows: cashOutflows,
          netCashFlow,
          isPositive: netCashFlow > 0,
          generatedDate: new Date().toISOString().split('T')[0],
          parameters: params
        },
        message: 'Cash flow statement generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate cash flow statement'
      };
    }
  },

  getAccountLedger: async (accountCode, params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      const openingBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      
      const account = accounts.find(acc => acc.code === accountCode);
      if (!account) {
        return {
          success: false,
          data: null,
          message: 'Account not found'
        };
      }
      
      // Get opening balance
      const latestOpeningBalance = openingBalances
        .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];
      
      const openingEntry = latestOpeningBalance?.entries?.find(
        entry => entry.accountCode === accountCode
      );
      
      let openingBalance = 0;
      if (openingEntry) {
        openingBalance = openingEntry.type === 'Debit' ? openingEntry.amount : -openingEntry.amount;
      }
      
      // Get all transactions for this account
      const ledgerEntries = [];
      let runningBalance = openingBalance;
      
      transactions.forEach(transaction => {
        // Filter by date if provided
        if (params.fromDate && transaction.date < params.fromDate) return;
        if (params.toDate && transaction.date > params.toDate) return;
        
        transaction.entries?.forEach(entry => {
          if (entry.accountCode === accountCode) {
            const amount = entry.type === 'Debit' ? entry.amount : -entry.amount;
            runningBalance += amount;
            
            ledgerEntries.push({
              date: transaction.date,
              transactionNumber: transaction.transactionNumber,
              description: transaction.description,
              reference: transaction.reference,
              debitAmount: entry.type === 'Debit' ? entry.amount : 0,
              creditAmount: entry.type === 'Credit' ? entry.amount : 0,
              balance: runningBalance
            });
          }
        });
      });
      
      return {
        success: true,
        data: {
          account,
          openingBalance,
          closingBalance: runningBalance,
          entries: ledgerEntries.sort((a, b) => new Date(a.date) - new Date(b.date)),
          totalDebits: ledgerEntries.reduce((sum, entry) => sum + entry.debitAmount, 0),
          totalCredits: ledgerEntries.reduce((sum, entry) => sum + entry.creditAmount, 0),
          generatedDate: new Date().toISOString().split('T')[0],
          parameters: params
        },
        message: 'Account ledger generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate account ledger'
      };
    }
  }
};

// Mock Audit Trail Service
export const auditTrailService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      
      let filtered = auditTrail;
      if (params.fromDate) {
        filtered = filtered.filter(entry => entry.date >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(entry => entry.date <= params.toDate);
      }
      if (params.action) {
        filtered = filtered.filter(entry => entry.action === params.action);
      }
      if (params.module) {
        filtered = filtered.filter(entry => entry.module === params.module);
      }
      if (params.userName) {
        filtered = filtered.filter(entry => 
          entry.userName?.toLowerCase().includes(params.userName.toLowerCase())
        );
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        message: 'Audit trail retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch audit trail'
      };
    }
  },

  log: async (auditData) => {
    try {
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        ...auditData
      };
      
      auditTrail.push(newEntry);
      
      // Keep only last 1000 entries to prevent storage overflow
      if (auditTrail.length > 1000) {
        auditTrail.splice(0, auditTrail.length - 1000);
      }
      
      localStorage.setItem('auditTrail', JSON.stringify(auditTrail));
      
      return {
        success: true,
        data: newEntry,
        message: 'Audit entry logged successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to log audit entry'
      };
    }
  },

  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      const filtered = auditTrail.filter(entry =>
        entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.userName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  getStats: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      
      const stats = {
        totalEntries: auditTrail.length,
        todayEntries: auditTrail.filter(entry => entry.date === new Date().toISOString().split('T')[0]).length,
        moduleStats: {},
        actionStats: {},
        userStats: {}
      };
      
      auditTrail.forEach(entry => {
        // Module statistics
        stats.moduleStats[entry.module] = (stats.moduleStats[entry.module] || 0) + 1;
        
        // Action statistics
        stats.actionStats[entry.action] = (stats.actionStats[entry.action] || 0) + 1;
        
        // User statistics
        stats.userStats[entry.userName] = (stats.userStats[entry.userName] || 0) + 1;
      });
      
      return {
        success: true,
        data: stats,
        message: 'Audit statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get audit statistics'
      };
    }
  }
};

// Helper function to generate comprehensive sample accounts
const getSampleAccounts = () => {
  return [
    // ASSETS - Current Assets
    { id: 1, code: '1000', name: 'Cash in Hand', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 2, code: '1010', name: 'Cash at Bank - SBI Main', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 3, code: '1011', name: 'Cash at Bank - HDFC Current', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 4, code: '1012', name: 'Cash at Bank - ICICI Savings', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 5, code: '1013', name: 'Cash at Bank - Axis Bank', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 6, code: '1020', name: 'Sundry Debtors', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 7, code: '1021', name: 'Bills Receivable', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 8, code: '1022', name: 'Advance Recoverable', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 9, code: '1030', name: 'Advance to Contractors', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 10, code: '1031', name: 'Advance to Employees', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 11, code: '1032', name: 'Advance to Suppliers', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 12, code: '1040', name: 'Inventory - Raw Materials', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 13, code: '1041', name: 'Inventory - Finished Goods', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 14, code: '1042', name: 'Inventory - Work in Progress', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 15, code: '1050', name: 'Prepaid Expenses', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 16, code: '1051', name: 'Prepaid Insurance', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 17, code: '1052', name: 'Prepaid Rent', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 18, code: '1060', name: 'TDS Receivable', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 19, code: '1061', name: 'GST Input Credit', group: 'Current Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },

    // ASSETS - Fixed Assets
    { id: 20, code: '2000', name: 'Land and Building', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 21, code: '2001', name: 'Land', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 22, code: '2002', name: 'Building', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 23, code: '2010', name: 'Plant and Machinery', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 24, code: '2020', name: 'Office Equipment', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 25, code: '2030', name: 'Furniture and Fixtures', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 26, code: '2040', name: 'Vehicles', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 27, code: '2050', name: 'Computer Equipment', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 28, code: '2060', name: 'Books and Library', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 29, code: '2070', name: 'Laboratory Equipment', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Debit', status: 'Active' },

    // ASSETS - Accumulated Depreciation (Contra Assets)
    { id: 30, code: '2500', name: 'Accumulated Depreciation - Building', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Credit', status: 'Active' },
    { id: 31, code: '2510', name: 'Accumulated Depreciation - Plant & Machinery', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Credit', status: 'Active' },
    { id: 32, code: '2520', name: 'Accumulated Depreciation - Office Equipment', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Credit', status: 'Active' },
    { id: 33, code: '2530', name: 'Accumulated Depreciation - Furniture', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Credit', status: 'Active' },
    { id: 34, code: '2540', name: 'Accumulated Depreciation - Vehicles', group: 'Fixed Assets', type: 'Asset', normalBalance: 'Credit', status: 'Active' },

    // ASSETS - Investments
    { id: 35, code: '2800', name: 'Long Term Investments', group: 'Investments', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 36, code: '2810', name: 'Short Term Investments', group: 'Investments', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 37, code: '2820', name: 'Government Securities', group: 'Investments', type: 'Asset', normalBalance: 'Debit', status: 'Active' },
    { id: 38, code: '2830', name: 'Fixed Deposits', group: 'Investments', type: 'Asset', normalBalance: 'Debit', status: 'Active' },

    // LIABILITIES - Current Liabilities
    { id: 39, code: '3000', name: 'Sundry Creditors', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 40, code: '3010', name: 'Bills Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 41, code: '3020', name: 'Bank Overdraft', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 42, code: '3030', name: 'Outstanding Expenses', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 43, code: '3040', name: 'Advance from Customers', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 44, code: '3050', name: 'TDS Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 45, code: '3051', name: 'GST Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 46, code: '3052', name: 'Professional Tax Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 47, code: '3053', name: 'ESI Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 48, code: '3054', name: 'PF Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 49, code: '3060', name: 'Salary Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 50, code: '3070', name: 'Interest Payable', group: 'Current Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },

    // LIABILITIES - Long Term Liabilities
    { id: 51, code: '3100', name: 'Bank Loans', group: 'Long Term Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 52, code: '3110', name: 'Term Loans', group: 'Long Term Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 53, code: '3120', name: 'Mortgage Loans', group: 'Long Term Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 54, code: '3130', name: 'Debentures', group: 'Long Term Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },
    { id: 55, code: '3140', name: 'Long Term Borrowings', group: 'Long Term Liabilities', type: 'Liability', normalBalance: 'Credit', status: 'Active' },

    // CAPITAL AND RESERVES
    { id: 56, code: '4000', name: 'Capital Fund', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 57, code: '4010', name: 'Reserve Fund', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 58, code: '4020', name: 'Building Fund', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 59, code: '4030', name: 'Equipment Fund', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 60, code: '4040', name: 'Retained Earnings', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 61, code: '4050', name: 'Current Year Surplus/Deficit', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },
    { id: 62, code: '4060', name: 'Depreciation Fund', group: 'Capital', type: 'Capital', normalBalance: 'Credit', status: 'Active' },

    // INCOME ACCOUNTS
    { id: 63, code: '5000', name: 'Donation Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 64, code: '5010', name: 'Grant Income - Government', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 65, code: '5011', name: 'Grant Income - Foreign', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 66, code: '5012', name: 'Grant Income - Domestic', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 67, code: '5020', name: 'Fee Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 68, code: '5021', name: 'Training Fee Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 69, code: '5022', name: 'Consultation Fee Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 70, code: '5030', name: 'Interest Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 71, code: '5031', name: 'Interest on Fixed Deposits', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 72, code: '5032', name: 'Interest on Savings Account', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 73, code: '5040', name: 'Other Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 74, code: '5050', name: 'Rental Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 75, code: '5060', name: 'Dividend Income', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },
    { id: 76, code: '5070', name: 'Capital Gains', group: 'Income', type: 'Income', normalBalance: 'Credit', status: 'Active' },

    // EXPENSE ACCOUNTS - Administrative
    { id: 77, code: '6000', name: 'Administrative Expenses', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 78, code: '6010', name: 'Staff Salaries', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 79, code: '6011', name: 'Employee Benefits', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 80, code: '6012', name: 'Provident Fund Contribution', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 81, code: '6013', name: 'ESI Contribution', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 82, code: '6020', name: 'Office Rent', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 83, code: '6030', name: 'Electricity Charges', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 84, code: '6031', name: 'Water Charges', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 85, code: '6040', name: 'Telephone Expenses', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 86, code: '6041', name: 'Internet Charges', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 87, code: '6050', name: 'Printing and Stationery', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 88, code: '6060', name: 'Travel and Conveyance', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 89, code: '6061', name: 'Vehicle Maintenance', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 90, code: '6062', name: 'Fuel Expenses', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 91, code: '6070', name: 'Professional Fees', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 92, code: '6071', name: 'Legal Fees', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 93, code: '6080', name: 'Audit Fees', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 94, code: '6090', name: 'Bank Charges', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 95, code: '6091', name: 'Bank Interest', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 96, code: '6100', name: 'Insurance Premium', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 97, code: '6110', name: 'Depreciation', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 98, code: '6120', name: 'Repair and Maintenance', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 99, code: '6121', name: 'Office Maintenance', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 100, code: '6122', name: 'Equipment Maintenance', group: 'Operating Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },

    // EXPENSE ACCOUNTS - Program Related
    { id: 101, code: '6200', name: 'Program Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 102, code: '6210', name: 'Training Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 103, code: '6220', name: 'Workshop Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 104, code: '6230', name: 'Event Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 105, code: '6240', name: 'Research Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 106, code: '6250', name: 'Publication Expenses', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 107, code: '6260', name: 'Material Distribution', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 108, code: '6270', name: 'Beneficiary Support', group: 'Program Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },

    // EXPENSE ACCOUNTS - Other
    { id: 109, code: '6300', name: 'Marketing Expenses', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 110, code: '6310', name: 'Advertisement Expenses', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 111, code: '6320', name: 'Donation Given', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 112, code: '6330', name: 'Bad Debts', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 113, code: '6340', name: 'Loss on Sale of Assets', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' },
    { id: 114, code: '6350', name: 'Miscellaneous Expenses', group: 'Other Expenses', type: 'Expense', normalBalance: 'Debit', status: 'Active' }
  ];
};

// Enhanced data seeding function
export const seedAllData = () => {
  console.log('Starting comprehensive data seeding...');
  
  // Seed accounts if not exists
  const existingAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  if (existingAccounts.length === 0) {
    const accounts = getSampleAccounts();
    localStorage.setItem('accounts', JSON.stringify(accounts));
    console.log(`✅ Sample accounts seeded: ${accounts.length} accounts`);
  } else {
    console.log(`ℹ️ Accounts already exist: ${existingAccounts.length} accounts`);
  }
  
  // Seed opening balances if not exists
  const existingOpeningBalances = JSON.parse(localStorage.getItem('openingBalances') || '[]');
  if (existingOpeningBalances.length === 0) {
    const sampleOpeningBalances = [
      {
        id: 1,
        description: 'Opening Balance - Financial Year 2024-25',
        entries: [
          { id: 1, accountCode: '1000', accountHead: 'Cash in Hand', type: 'Debit', amount: 50000 },
          { id: 2, accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Debit', amount: 500000 },
          { id: 3, accountCode: '1011', accountHead: 'Cash at Bank - HDFC Current', type: 'Debit', amount: 350000 },
          { id: 4, accountCode: '1012', accountHead: 'Cash at Bank - ICICI Savings', type: 'Debit', amount: 200000 },
          { id: 5, accountCode: '2000', accountHead: 'Land and Building', type: 'Debit', amount: 5000000 },
          { id: 6, accountCode: '2010', accountHead: 'Plant and Machinery', type: 'Debit', amount: 800000 },
          { id: 7, accountCode: '2020', accountHead: 'Office Equipment', type: 'Debit', amount: 150000 },
          { id: 8, accountCode: '2030', accountHead: 'Furniture and Fixtures', type: 'Debit', amount: 120000 },
          { id: 9, accountCode: '2050', accountHead: 'Computer Equipment', type: 'Debit', amount: 80000 },
          { id: 10, accountCode: '1020', accountHead: 'Sundry Debtors', type: 'Debit', amount: 125000 },
          { id: 11, accountCode: '1040', accountHead: 'Inventory - Raw Materials', type: 'Debit', amount: 90000 },
          { id: 12, accountCode: '1050', accountHead: 'Prepaid Expenses', type: 'Debit', amount: 25000 },
          { id: 13, accountCode: '2830', accountHead: 'Fixed Deposits', type: 'Debit', amount: 1000000 },
          
          // Credit Entries
          { id: 14, accountCode: '4000', accountHead: 'Capital Fund', type: 'Credit', amount: 6000000 },
          { id: 15, accountCode: '4010', accountHead: 'Reserve Fund', type: 'Credit', amount: 1500000 },
          { id: 16, accountCode: '4020', accountHead: 'Building Fund', type: 'Credit', amount: 500000 },
          { id: 17, accountCode: '3000', accountHead: 'Sundry Creditors', type: 'Credit', amount: 85000 },
          { id: 18, accountCode: '3100', accountHead: 'Bank Loans', type: 'Credit', amount: 400000 },
          { id: 19, accountCode: '3050', accountHead: 'TDS Payable', type: 'Credit', amount: 15000 },
          { id: 20, accountCode: '3051', accountHead: 'GST Payable', type: 'Credit', amount: 25000 },
          { id: 21, accountCode: '2500', accountHead: 'Accumulated Depreciation - Building', type: 'Credit', amount: 500000 },
          { id: 22, accountCode: '2510', accountHead: 'Accumulated Depreciation - Plant & Machinery', type: 'Credit', amount: 200000 },
          { id: 23, accountCode: '2520', accountHead: 'Accumulated Depreciation - Office Equipment', type: 'Credit', amount: 60000 }
        ],
        debitTotal: 8490000,
        creditTotal: 8490000,
        status: 'Active',
        createdDate: '2024-04-01',
        createdTime: '10:30:00'
      },
      {
        id: 2,
        description: 'Opening Balance - Previous Year Reference (2023-24)',
        entries: [
          { id: 24, accountCode: '1000', accountHead: 'Cash in Hand', type: 'Debit', amount: 45000 },
          { id: 25, accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Debit', amount: 420000 },
          { id: 26, accountCode: '1011', accountHead: 'Cash at Bank - HDFC Current', type: 'Debit', amount: 280000 },
          { id: 27, accountCode: '2000', accountHead: 'Land and Building', type: 'Debit', amount: 5000000 },
          { id: 28, accountCode: '2010', accountHead: 'Plant and Machinery', type: 'Debit', amount: 750000 },
          { id: 29, accountCode: '1020', accountHead: 'Sundry Debtors', type: 'Debit', amount: 95000 },
          { id: 30, accountCode: '4000', accountHead: 'Capital Fund', type: 'Credit', amount: 5500000 },
          { id: 31, accountCode: '4010', accountHead: 'Reserve Fund', type: 'Credit', amount: 900000 },
          { id: 32, accountCode: '3000', accountHead: 'Sundry Creditors', type: 'Credit', amount: 65000 },
          { id: 33, accountCode: '3100', accountHead: 'Bank Loans', type: 'Credit', amount: 525000 },
          { id: 34, accountCode: '2500', accountHead: 'Accumulated Depreciation - Building', type: 'Credit', amount: 400000 },
          { id: 35, accountCode: '2510', accountHead: 'Accumulated Depreciation - Plant & Machinery', type: 'Credit', amount: 100000 }
        ],
        debitTotal: 6590000,
        creditTotal: 6590000,
        status: 'Active',
        createdDate: '2023-04-01',
        createdTime: '09:15:00'
      }
    ];
    
    localStorage.setItem('openingBalances', JSON.stringify(sampleOpeningBalances));
    console.log(`✅ Sample opening balances seeded: ${sampleOpeningBalances.length} records`);
  } else {
    console.log(`ℹ️ Opening balances already exist: ${existingOpeningBalances.length} records`);
  }
  
  // Seed sample transactions
  const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  if (existingTransactions.length === 0) {
    const sampleTransactions = [
      {
        id: 1,
        transactionNumber: 'TXN001',
        date: '2024-04-15',
        description: 'Office rent payment for April 2024',
        reference: 'RENT-APR-2024',
        entries: [
          { accountCode: '6020', accountHead: 'Office Rent', type: 'Debit', amount: 35000 },
          { accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Credit', amount: 35000 }
        ],
        totalAmount: 35000,
        status: 'Posted',
        createdDate: '2024-04-15',
        createdTime: '14:30:00'
      },
      {
        id: 2,
        transactionNumber: 'TXN002',
        date: '2024-04-20',
        description: 'Donation received from ABC Foundation',
        reference: 'DON-ABC-001',
        entries: [
          { accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Debit', amount: 250000 },
          { accountCode: '5000', accountHead: 'Donation Income', type: 'Credit', amount: 250000 }
        ],
        totalAmount: 250000,
        status: 'Posted',
        createdDate: '2024-04-20',
        createdTime: '11:45:00'
      },
      {
        id: 3,
        transactionNumber: 'TXN003',
        date: '2024-04-25',
        description: 'Staff salary payment for April 2024',
        reference: 'SAL-APR-2024',
        entries: [
          { accountCode: '6010', accountHead: 'Staff Salaries', type: 'Debit', amount: 180000 },
          { accountCode: '3050', accountHead: 'TDS Payable', type: 'Credit', amount: 18000 },
          { accountCode: '3054', accountHead: 'PF Payable', type: 'Credit', amount: 21600 },
          { accountCode: '1011', accountHead: 'Cash at Bank - HDFC Current', type: 'Credit', amount: 140400 }
        ],
        totalAmount: 180000,
        status: 'Posted',
        createdDate: '2024-04-25',
        createdTime: '16:20:00'
      },
      {
        id: 4,
        transactionNumber: 'TXN004',
        date: '2024-04-28',
        description: 'Training program expenses for community workshop',
        reference: 'TRN-WS-001',
        entries: [
          { accountCode: '6210', accountHead: 'Training Expenses', type: 'Debit', amount: 45000 },
          { accountCode: '1012', accountHead: 'Cash at Bank - ICICI Savings', type: 'Credit', amount: 45000 }
        ],
        totalAmount: 45000,
        status: 'Posted',
        createdDate: '2024-04-28',
        createdTime: '13:15:00'
      },
      {
        id: 5,
        transactionNumber: 'TXN005',
        date: '2024-05-02',
        description: 'Grant received from Government of India',
        reference: 'GRN-GOI-2024',
        entries: [
          { accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Debit', amount: 500000 },
          { accountCode: '5010', accountHead: 'Grant Income - Government', type: 'Credit', amount: 500000 }
        ],
        totalAmount: 500000,
        status: 'Posted',
        createdDate: '2024-05-02',
        createdTime: '10:00:00'
      },
      {
        id: 6,
        transactionNumber: 'TXN006',
        date: '2024-05-05',
        description: 'Office equipment purchase',
        reference: 'EQP-PUR-001',
        entries: [
          { accountCode: '2020', accountHead: 'Office Equipment', type: 'Debit', amount: 75000 },
          { accountCode: '3051', accountHead: 'GST Payable', type: 'Debit', amount: 13500 },
          { accountCode: '3000', accountHead: 'Sundry Creditors', type: 'Credit', amount: 88500 }
        ],
        totalAmount: 88500,
        status: 'Posted',
        createdDate: '2024-05-05',
        createdTime: '15:45:00'
      },
      {
        id: 7,
        transactionNumber: 'TXN007',
        date: '2024-05-08',
        description: 'Electricity bill payment',
        reference: 'ELEC-MAY-2024',
        entries: [
          { accountCode: '6030', accountHead: 'Electricity Charges', type: 'Debit', amount: 12500 },
          { accountCode: '1011', accountHead: 'Cash at Bank - HDFC Current', type: 'Credit', amount: 12500 }
        ],
        totalAmount: 12500,
        status: 'Posted',
        createdDate: '2024-05-08',
        createdTime: '12:30:00'
      },
      {
        id: 8,
        transactionNumber: 'TXN008',
        date: '2024-05-10',
        description: 'Interest received on fixed deposits',
        reference: 'INT-FD-Q1-2024',
        entries: [
          { accountCode: '1010', accountHead: 'Cash at Bank - SBI Main', type: 'Debit', amount: 25000 },
          { accountCode: '5031', accountHead: 'Interest on Fixed Deposits', type: 'Credit', amount: 25000 }
        ],
        totalAmount: 25000,
        status: 'Posted',
        createdDate: '2024-05-10',
        createdTime: '09:20:00'
      }
    ];
    
    localStorage.setItem('transactions', JSON.stringify(sampleTransactions));
    console.log(`✅ Sample transactions seeded: ${sampleTransactions.length} transactions`);
  } else {
    console.log(`ℹ️ Transactions already exist: ${existingTransactions.length} transactions`);
  }
  
  // Seed initial audit trail
  const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
  if (existingAuditTrail.length === 0) {
    const sampleAuditTrail = [
      {
        id: 1,
        timestamp: new Date('2024-04-01T10:30:00').toISOString(),
        date: '2024-04-01',
        time: '10:30:00',
        module: 'Opening Balance',
        action: 'CREATE',
        description: 'Opening balance created for Financial Year 2024-25',
        userName: 'System Admin',
        details: { recordId: 1, totalEntries: 23, debitTotal: 8490000, creditTotal: 8490000 }
      },
      {
        id: 2,
        timestamp: new Date('2024-04-01T11:00:00').toISOString(),
        date: '2024-04-01',
        time: '11:00:00',
        module: 'Accounts',
        action: 'BULK_CREATE',
        description: 'Chart of accounts initialized with 114 accounts',
        userName: 'System Admin',
        details: { totalAccounts: 114, categories: ['Assets', 'Liabilities', 'Capital', 'Income', 'Expenses'] }
      },
      {
        id: 3,
        timestamp: new Date('2024-04-15T14:30:00').toISOString(),
        date: '2024-04-15',
        time: '14:30:00',
        module: 'Transactions',
        action: 'CREATE',
        description: 'Transaction created: TXN001 - Office rent payment',
        userName: 'Accounts User',
        details: { transactionNumber: 'TXN001', amount: 35000 }
      },
      {
        id: 4,
        timestamp: new Date('2024-04-20T11:45:00').toISOString(),
        date: '2024-04-20',
        time: '11:45:00',
        module: 'Transactions',
        action: 'CREATE',
        description: 'Transaction created: TXN002 - Donation received from ABC Foundation',
        userName: 'Accounts User',
        details: { transactionNumber: 'TXN002', amount: 250000 }
      },
      {
        id: 5,
        timestamp: new Date('2024-04-25T16:20:00').toISOString(),
        date: '2024-04-25',
        time: '16:20:00',
        module: 'Transactions',
        action: 'CREATE',
        description: 'Transaction created: TXN003 - Staff salary payment',
        userName: 'HR User',
        details: { transactionNumber: 'TXN003', amount: 180000 }
      },
      {
        id: 6,
        timestamp: new Date('2024-05-01T09:00:00').toISOString(),
        date: '2024-05-01',
        time: '09:00:00',
        module: 'Reports',
        action: 'GENERATE',
        description: 'Trial balance generated for April 2024',
        userName: 'Finance Manager',
        details: { reportType: 'Trial Balance', period: 'April 2024' }
      },
      {
        id: 7,
        timestamp: new Date('2024-05-02T10:00:00').toISOString(),
        date: '2024-05-02',
        time: '10:00:00',
        module: 'Transactions',
        action: 'CREATE',
        description: 'Transaction created: TXN005 - Government grant received',
        userName: 'Accounts User',
        details: { transactionNumber: 'TXN005', amount: 500000 }
      },
      {
        id: 8,
        timestamp: new Date('2024-05-10T09:20:00').toISOString(),
        date: '2024-05-10',
        time: '09:20:00',
        module: 'Transactions',
        action: 'CREATE',
        description: 'Transaction created: TXN008 - Interest received on FD',
        userName: 'Accounts User',
        details: { transactionNumber: 'TXN008', amount: 25000 }
      }
    ];
    
    localStorage.setItem('auditTrail', JSON.stringify(sampleAuditTrail));
    console.log(`✅ Sample audit trail seeded: ${sampleAuditTrail.length} entries`);
  } else {
    console.log(`ℹ️ Audit trail already exists: ${existingAuditTrail.length} entries`);
  }
  
  console.log('🎉 All sample data seeding completed successfully!');
  console.log('📊 Data Summary:');
  console.log(`   • Accounts: ${JSON.parse(localStorage.getItem('accounts') || '[]').length}`);
  console.log(`   • Opening Balances: ${JSON.parse(localStorage.getItem('openingBalances') || '[]').length}`);
  console.log(`   • Transactions: ${JSON.parse(localStorage.getItem('transactions') || '[]').length}`);
  console.log(`   • Audit Entries: ${JSON.parse(localStorage.getItem('auditTrail') || '[]').length}`);
  
  return {
    success: true,
    message: 'All sample data seeded successfully',
    data: {
      accounts: JSON.parse(localStorage.getItem('accounts') || '[]').length,
      openingBalances: JSON.parse(localStorage.getItem('openingBalances') || '[]').length,
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]').length,
      auditEntries: JSON.parse(localStorage.getItem('auditTrail') || '[]').length
    }
  };
};

// Utility function to clear all data (useful for testing)
export const clearAllData = () => {
  const keys = ['accounts', 'openingBalances', 'transactions', 'auditTrail'];
  keys.forEach(key => localStorage.removeItem(key));
  console.log('🧹 All data cleared from localStorage');
  return { success: true, message: 'All data cleared successfully' };
};

// Utility function to export data (for backup)
export const exportData = () => {
  const data = {
    accounts: JSON.parse(localStorage.getItem('accounts') || '[]'),
    openingBalances: JSON.parse(localStorage.getItem('openingBalances') || '[]'),
    transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
    auditTrail: JSON.parse(localStorage.getItem('auditTrail') || '[]'),
    exportDate: new Date().toISOString(),
    version: '1.0.0'
  };
  
  return {
    success: true,
    data,
    message: 'Data exported successfully'
  };
};

// Utility function to import data (for restore)
export const importData = (importedData) => {
  try {
    if (importedData.accounts) localStorage.setItem('accounts', JSON.stringify(importedData.accounts));
    if (importedData.openingBalances) localStorage.setItem('openingBalances', JSON.stringify(importedData.openingBalances));
    if (importedData.transactions) localStorage.setItem('transactions', JSON.stringify(importedData.transactions));
    if (importedData.auditTrail) localStorage.setItem('auditTrail', JSON.stringify(importedData.auditTrail));
    
    // Trigger update events
    window.dispatchEvent(new CustomEvent('dataImported', { detail: importedData }));
    
    console.log('📥 Data imported successfully');
    return { success: true, message: 'Data imported successfully' };
  } catch (error) {
    console.error('❌ Error importing data:', error);
    return { success: false, message: 'Failed to import data' };
  }
};

// Mock Auto GJV Service
export const autoGjvService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      
      // Apply filters if provided
      let filtered = autoGjvConfigs;
      if (params.gjvType) {
        filtered = filtered.filter(config => config.gjvType === params.gjvType);
      }
      if (params.status) {
        filtered = filtered.filter(config => config.status === params.status);
      }
      if (params.fromDate) {
        filtered = filtered.filter(config => config.createdDate >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(config => config.createdDate <= params.toDate);
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: 'Auto GJV configurations retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch Auto GJV configurations'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const config = autoGjvConfigs.find(cfg => cfg.id === id);
      
      if (config) {
        return {
          success: true,
          data: config,
          message: 'Auto GJV configuration retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Auto GJV configuration not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch Auto GJV configuration'
      };
    }
  },

  create: async (configData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      
      // Check if configuration with same GJV type already exists
      const existingConfig = autoGjvConfigs.find(config => 
        config.gjvType === configData.gjvType && config.status === 'Active'
      );
      
      if (existingConfig) {
        return {
          success: false,
          data: null,
          message: `Active configuration for ${configData.gjvType} already exists. Please deactivate it first.`
        };
      }
      
      const newConfig = {
        ...configData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: 'Active',
        lastExecuted: null,
        nextExecution: calculateNextExecution(configData.entries)
      };
      
      autoGjvConfigs.push(newConfig);
      localStorage.setItem('autoGjvConfigs', JSON.stringify(autoGjvConfigs));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Auto GJV',
        action: 'CREATE',
        description: `Auto GJV configuration created: ${newConfig.gjvType}`,
        userName: 'Current User',
        details: {
          configId: newConfig.id,
          gjvType: newConfig.gjvType,
          totalEntries: newConfig.totalEntries,
          status: newConfig.status
        }
      });
      
      window.dispatchEvent(new CustomEvent('autoGjvConfigsUpdated', { 
        detail: autoGjvConfigs 
      }));
      
      return {
        success: true,
        data: newConfig,
        message: 'Auto GJV configuration created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create Auto GJV configuration'
      };
    }
  },

  update: async (id, configData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const index = autoGjvConfigs.findIndex(cfg => cfg.id === id);
      
      if (index !== -1) {
        // Check if updated GJV type conflicts with existing active configurations
        const existingConfig = autoGjvConfigs.find(config => 
          config.gjvType === configData.gjvType && 
          config.status === 'Active' && 
          config.id !== id
        );
        
        if (existingConfig) {
          return {
            success: false,
            data: null,
            message: `Active configuration for ${configData.gjvType} already exists`
          };
        }
        
        const oldData = { ...autoGjvConfigs[index] };
        autoGjvConfigs[index] = {
          ...autoGjvConfigs[index],
          ...configData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0],
          nextExecution: calculateNextExecution(configData.entries)
        };
        
        localStorage.setItem('autoGjvConfigs', JSON.stringify(autoGjvConfigs));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Auto GJV',
          action: 'UPDATE',
          description: `Auto GJV configuration updated: ${autoGjvConfigs[index].gjvType}`,
          userName: 'Current User',
          details: {
            configId: id,
            oldData: { gjvType: oldData.gjvType, status: oldData.status },
            newData: { gjvType: autoGjvConfigs[index].gjvType, status: autoGjvConfigs[index].status }
          }
        });
        
        window.dispatchEvent(new CustomEvent('autoGjvConfigsUpdated', { 
          detail: autoGjvConfigs 
        }));
        
        return {
          success: true,
          data: autoGjvConfigs[index],
          message: 'Auto GJV configuration updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Auto GJV configuration not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update Auto GJV configuration'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const configToDelete = autoGjvConfigs.find(cfg => cfg.id === id);
      const filteredConfigs = autoGjvConfigs.filter(cfg => cfg.id !== id);
      
      if (autoGjvConfigs.length !== filteredConfigs.length) {
        localStorage.setItem('autoGjvConfigs', JSON.stringify(filteredConfigs));
        
        // Log audit trail
        if (configToDelete) {
          await auditTrailService.log({
            module: 'Auto GJV',
            action: 'DELETE',
            description: `Auto GJV configuration deleted: ${configToDelete.gjvType}`,
            userName: 'Current User',
            details: {
              configId: id,
              deletedData: {
                gjvType: configToDelete.gjvType,
                totalEntries: configToDelete.totalEntries,
                status: configToDelete.status
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('autoGjvConfigsUpdated', { 
          detail: filteredConfigs 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Auto GJV configuration deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Auto GJV configuration not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete Auto GJV configuration'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const filtered = autoGjvConfigs.filter(config =>
        config.gjvType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        config.entries?.some(entry => 
          entry.particulars?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.debitAccountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.creditAccountName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Execute auto GJV (simulate the automated process)
  executeAutoGJV: async (configId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const config = autoGjvConfigs.find(cfg => cfg.id === configId);
      
      if (!config) {
        return {
          success: false,
          data: null,
          message: 'Configuration not found'
        };
      }
      
      if (config.status !== 'Active') {
        return {
          success: false,
          data: null,
          message: 'Configuration is not active'
        };
      }
      
      // Create transactions for each entry in the configuration
      const transactions = [];
      const transactionService = (await import('./mockServices')).transactionService;
      
      for (const entry of config.entries) {
        const transactionData = {
          date: new Date().toISOString().split('T')[0],
          description: `Auto GJV: ${entry.particulars}`,
          reference: `AUTO-${config.gjvType.replace(/\s+/g, '-').toUpperCase()}-${Date.now()}`,
          entries: [
            {
              accountCode: entry.debitAccount,
              accountHead: entry.debitAccountName,
              type: 'Debit',
              amount: entry.amount
            },
            {
              accountCode: entry.creditAccount,
              accountHead: entry.creditAccountName,
              type: 'Credit',
              amount: entry.amount
            }
          ],
          totalAmount: entry.amount,
          source: 'Auto GJV',
          autoGjvConfigId: configId
        };
        
        const result = await transactionService.create(transactionData);
        if (result.success) {
          transactions.push(result.data);
        }
      }
      
      // Update configuration with last execution details
      const configIndex = autoGjvConfigs.findIndex(cfg => cfg.id === configId);
      if (configIndex !== -1) {
        autoGjvConfigs[configIndex].lastExecuted = new Date().toISOString();
        autoGjvConfigs[configIndex].nextExecution = calculateNextExecution(config.entries);
        autoGjvConfigs[configIndex].executionCount = (autoGjvConfigs[configIndex].executionCount || 0) + 1;
        
        localStorage.setItem('autoGjvConfigs', JSON.stringify(autoGjvConfigs));
      }
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Auto GJV',
        action: 'EXECUTE',
        description: `Auto GJV executed: ${config.gjvType} - ${transactions.length} transactions created`,
        userName: 'System',
        details: {
          configId: configId,
          gjvType: config.gjvType,
          transactionsCreated: transactions.length,
          totalAmount: transactions.reduce((sum, t) => sum + t.totalAmount, 0)
        }
      });
      
      return {
        success: true,
        data: {
          config: autoGjvConfigs[configIndex],
          transactions,
          executionDate: new Date().toISOString(),
          transactionsCreated: transactions.length
        },
        message: `Auto GJV executed successfully. ${transactions.length} transactions created.`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to execute Auto GJV'
      };
    }
  },

  // Toggle configuration status (Active/Inactive)
  toggleStatus: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const index = autoGjvConfigs.findIndex(cfg => cfg.id === id);
      
      if (index !== -1) {
        const oldStatus = autoGjvConfigs[index].status;
        autoGjvConfigs[index].status = oldStatus === 'Active' ? 'Inactive' : 'Active';
        autoGjvConfigs[index].statusChangedDate = new Date().toISOString().split('T')[0];
        
        localStorage.setItem('autoGjvConfigs', JSON.stringify(autoGjvConfigs));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Auto GJV',
          action: 'STATUS_CHANGE',
          description: `Auto GJV status changed: ${autoGjvConfigs[index].gjvType} - ${oldStatus} to ${autoGjvConfigs[index].status}`,
          userName: 'Current User',
          details: {
            configId: id,
            gjvType: autoGjvConfigs[index].gjvType,
            oldStatus,
            newStatus: autoGjvConfigs[index].status
          }
        });
        
        window.dispatchEvent(new CustomEvent('autoGjvConfigsUpdated', { 
          detail: autoGjvConfigs 
        }));
        
        return {
          success: true,
          data: autoGjvConfigs[index],
          message: `Configuration ${autoGjvConfigs[index].status.toLowerCase()} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Configuration not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to toggle configuration status'
      };
    }
  },

  // Get execution history for a configuration
  getExecutionHistory: async (configId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      const executions = auditTrail.filter(entry => 
        entry.module === 'Auto GJV' && 
        entry.action === 'EXECUTE' && 
        entry.details?.configId === configId
      );
      
      return {
        success: true,
        data: executions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        message: 'Execution history retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch execution history'
      };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const autoGjvConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      
      const stats = {
        totalConfigurations: autoGjvConfigs.length,
        activeConfigurations: autoGjvConfigs.filter(cfg => cfg.status === 'Active').length,
        inactiveConfigurations: autoGjvConfigs.filter(cfg => cfg.status === 'Inactive').length,
        totalExecutions: auditTrail.filter(entry => 
          entry.module === 'Auto GJV' && entry.action === 'EXECUTE'
        ).length,
        executionsToday: auditTrail.filter(entry => 
          entry.module === 'Auto GJV' && 
          entry.action === 'EXECUTE' && 
          entry.date === new Date().toISOString().split('T')[0]
        ).length,
        configurationsByType: {},
        upcomingExecutions: []
      };
      
      // Group configurations by type
      autoGjvConfigs.forEach(config => {
        stats.configurationsByType[config.gjvType] = 
          (stats.configurationsByType[config.gjvType] || 0) + 1;
      });
      
      // Get upcoming executions (next 7 days)
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      stats.upcomingExecutions = autoGjvConfigs
        .filter(config => 
          config.status === 'Active' && 
          config.nextExecution &&
          new Date(config.nextExecution) >= today &&
          new Date(config.nextExecution) <= nextWeek
        )
        .map(config => ({
          id: config.id,
          gjvType: config.gjvType,
          nextExecution: config.nextExecution,
          totalEntries: config.totalEntries
        }))
        .sort((a, b) => new Date(a.nextExecution) - new Date(b.nextExecution));
      
      return {
        success: true,
        data: stats,
        message: 'Dashboard statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch dashboard statistics'
      };
    }
  }
};

// Mock Auto GJV Execution Service
export const autoGjvExecutionService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      const executions = auditTrail.filter(entry => 
        entry.module === 'Auto GJV' && entry.action === 'EXECUTE'
      );
      
      // Apply filters
      let filtered = executions;
      if (params.fromDate) {
        filtered = filtered.filter(exec => exec.date >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(exec => exec.date <= params.toDate);
      }
      if (params.gjvType) {
        filtered = filtered.filter(exec => exec.details?.gjvType === params.gjvType);
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        message: 'Auto GJV executions retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch Auto GJV executions'
      };
    }
  },

  getExecutionDetails: async (executionId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const auditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
      const execution = auditTrail.find(entry => entry.id === executionId);
      
      if (execution) {
        // Get related transactions if available
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        const relatedTransactions = transactions.filter(txn => 
          txn.source === 'Auto GJV' && 
          txn.autoGjvConfigId === execution.details?.configId &&
          txn.createdDate === execution.date
        );
        
        return {
          success: true,
          data: {
            execution,
            relatedTransactions
          },
          message: 'Execution details retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Execution not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch execution details'
      };
    }
  }
};

// Helper function to calculate next execution date
const calculateNextExecution = (entries) => {
  if (!entries || entries.length === 0) return null;
  
  // Use the most frequent frequency from entries
  const frequencies = entries.map(entry => entry.frequency);
  const mostCommonFrequency = frequencies.sort((a, b) =>
    frequencies.filter(v => v === a).length - frequencies.filter(v => v === b).length
  ).pop();
  
  const today = new Date();
  let nextDate = new Date(today);
  
  switch (mostCommonFrequency) {
    case 'Daily':
      nextDate.setDate(today.getDate() + 1);
      break;
    case 'Weekly':
      nextDate.setDate(today.getDate() + 7);
      break;
    case 'Monthly':
      nextDate.setMonth(today.getMonth() + 1);
      break;
    case 'Quarterly':
      nextDate.setMonth(today.getMonth() + 3);
      break;
    case 'Half-Yearly':
      nextDate.setMonth(today.getMonth() + 6);
      break;
    case 'Yearly':
      nextDate.setFullYear(today.getFullYear() + 1);
      break;
    case 'One-time':
      return null; // No next execution for one-time entries
    default:
      nextDate.setMonth(today.getMonth() + 1); // Default to monthly
  }
  
  return nextDate.toISOString().split('T')[0];
};

// Sample data seeding function
export const seedAutoGjvData = () => {
  const existingConfigs = JSON.parse(localStorage.getItem('autoGjvConfigs') || '[]');
  
  if (existingConfigs.length === 0) {
    const sampleConfigs = [
      {
        id: 1,
        gjvType: 'Depreciation GJV',
        description: 'Auto GJV configuration for Depreciation GJV',
        entries: [
          {
            id: 1,
            particulars: 'Monthly Depreciation - Building',
            debitAccount: '6110',
            debitAccountName: 'Depreciation',
            creditAccount: '2500',
            creditAccountName: 'Accumulated Depreciation - Building',
            amount: 8333.33,
            frequency: 'Monthly',
            effectiveDate: '2024-04-01',
            description: 'Monthly depreciation for building (₹1,00,000 annual depreciation)'
          },
          {
            id: 2,
            particulars: 'Monthly Depreciation - Plant & Machinery',
            debitAccount: '6110',
            debitAccountName: 'Depreciation',
            creditAccount: '2510',
            creditAccountName: 'Accumulated Depreciation - Plant & Machinery',
            amount: 6666.67,
            frequency: 'Monthly',
            effectiveDate: '2024-04-01',
            description: 'Monthly depreciation for plant & machinery (₹80,000 annual depreciation)'
          },
          {
            id: 3,
            particulars: 'Monthly Depreciation - Office Equipment',
            debitAccount: '6110',
            debitAccountName: 'Depreciation',
            creditAccount: '2520',
            creditAccountName: 'Accumulated Depreciation - Office Equipment',
            amount: 2500.00,
            frequency: 'Monthly',
            effectiveDate: '2024-04-01',
            description: 'Monthly depreciation for office equipment (₹30,000 annual depreciation)'
          }
        ],
        totalEntries: 3,
        status: 'Active',
        createdDate: '2024-04-01',
        createdTime: '09:00:00',
        lastExecuted: '2024-05-01T09:00:00.000Z',
        nextExecution: '2024-06-01',
        executionCount: 2
      },
      {
        id: 2,
        gjvType: 'Interest Accrual GJV',
        description: 'Auto GJV configuration for Interest Accrual GJV',
        entries: [
          {
            id: 4,
            particulars: 'Monthly Interest Accrual on Fixed Deposits',
            debitAccount: '1061',
            debitAccountName: 'Interest Receivable',
            creditAccount: '5031',
            creditAccountName: 'Interest on Fixed Deposits',
            amount: 8333.33,
            frequency: 'Monthly',
            effectiveDate: '2024-04-01',
            description: 'Monthly interest accrual on fixed deposits @ 10% per annum'
          }
        ],
        totalEntries: 1,
        status: 'Active',
        createdDate: '2024-04-15',
        createdTime: '14:30:00',
        lastExecuted: '2024-05-15T14:30:00.000Z',
        nextExecution: '2024-06-15',
        executionCount: 1
      },
      {
        id: 3,
        gjvType: 'Doubtful Collection GJV',
        description: 'Auto GJV configuration for Doubtful Collection GJV',
        entries: [
          {
            id: 5,
            particulars: 'Provision for Doubtful Debts',
            debitAccount: '6330',
            debitAccountName: 'Bad Debts',
            creditAccount: '1025',
            creditAccountName: 'Provision for Doubtful Debts',
            amount: 2500.00,
            frequency: 'Quarterly',
            effectiveDate: '2024-04-01',
            description: 'Quarterly provision for doubtful debts @ 2% of debtors balance'
          }
        ],
        totalEntries: 1,
        status: 'Active',
        createdDate: '2024-04-20',
        createdTime: '11:00:00',
        lastExecuted: null,
        nextExecution: '2024-07-01',
        executionCount: 0
      },
      {
        id: 4,
        gjvType: 'Grant GJV',
        description: 'Auto GJV configuration for Grant GJV',
        entries: [
          {
            id: 6,
            particulars: 'Monthly Grant Utilization Recognition',
            debitAccount: '3200',
            debitAccountName: 'Unspent Grant Liability',
            creditAccount: '5010',
            creditAccountName: 'Grant Income - Government',
            amount: 50000.00,
            frequency: 'Monthly',
            effectiveDate: '2024-04-01',
            description: 'Monthly recognition of grant utilization as per project milestones'
          }
        ],
        totalEntries: 1,
        status: 'Inactive',
        createdDate: '2024-03-15',
        createdTime: '16:45:00',
        lastExecuted: '2024-04-15T16:45:00.000Z',
        nextExecution: null,
        executionCount: 1,
        statusChangedDate: '2024-04-30'
      }
    ];
    
    localStorage.setItem('autoGjvConfigs', JSON.stringify(sampleConfigs));
    console.log('✅ Sample Auto GJV configurations seeded:', sampleConfigs.length, 'configurations');
    
    // Seed some execution history in audit trail
    const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    const executionAudits = [
      {
        id: Date.now() + 1,
        timestamp: new Date('2024-05-01T09:00:00').toISOString(),
        date: '2024-05-01',
        time: '09:00:00',
        module: 'Auto GJV',
        action: 'EXECUTE',
        description: 'Auto GJV executed: Depreciation GJV - 3 transactions created',
        userName: 'System',
        details: {
          configId: 1,
          gjvType: 'Depreciation GJV',
          transactionsCreated: 3,
          totalAmount: 17500.00
        }
      },
      {
        id: Date.now() + 2,
        timestamp: new Date('2024-05-15T14:30:00').toISOString(),
        date: '2024-05-15',
        time: '14:30:00',
        module: 'Auto GJV',
        action: 'EXECUTE',
        description: 'Auto GJV executed: Interest Accrual GJV - 1 transactions created',
        userName: 'System',
        details: {
          configId: 2,
          gjvType: 'Interest Accrual GJV',
          transactionsCreated: 1,
          totalAmount: 8333.33
        }
      },
      {
        id: Date.now() + 3,
        timestamp: new Date('2024-04-15T16:45:00').toISOString(),
        date: '2024-04-15',
        time: '16:45:00',
        module: 'Auto GJV',
        action: 'EXECUTE',
        description: 'Auto GJV executed: Grant GJV - 1 transactions created',
        userName: 'System',
        details: {
          configId: 4,
          gjvType: 'Grant GJV',
          transactionsCreated: 1,
          totalAmount: 50000.00
        }
      }
    ];
    
    const updatedAuditTrail = [...existingAuditTrail, ...executionAudits];
    localStorage.setItem('auditTrail', JSON.stringify(updatedAuditTrail));
    console.log('✅ Sample Auto GJV execution history seeded:', executionAudits.length, 'executions');
  } else {
    console.log(`ℹ️ Auto GJV configurations already exist: ${existingConfigs.length} configurations`);
  }
};

// Utility function to clear Auto GJV data
export const clearAutoGjvData = () => {
  localStorage.removeItem('autoGjvConfigs');
  console.log('🧹 Auto GJV data cleared from localStorage');
  return { success: true, message: 'Auto GJV data cleared successfully' };
};

// Auto-seed data when module is imported (uncomment to enable)
// console.log('🌱 Auto-seeding Auto GJV data...');
// seedAutoGjvData();

// Mock Advance & Deposit Service
export const advanceDepositService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      
      // Apply filters if provided
      let filtered = records;
      if (params.registerType) {
        filtered = filtered.filter(record => record.registerType === params.registerType);
      }
      if (params.financialYear) {
        filtered = filtered.filter(record => record.financialYear === params.financialYear);
      }
      if (params.status) {
        filtered = filtered.filter(record => record.status === params.status);
      }
      if (params.fromDate) {
        filtered = filtered.filter(record => record.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(record => record.challanDate <= params.toDate);
      }
      if (params.minAmount) {
        filtered = filtered.filter(record => record.amount >= params.minAmount);
      }
      if (params.maxAmount) {
        filtered = filtered.filter(record => record.amount <= params.maxAmount);
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: 'Records retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch records'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const record = records.find(rec => rec.id === id);
      
      if (record) {
        return {
          success: true,
          data: record,
          message: 'Record retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch record'
      };
    }
  },

  create: async (recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      
      // Check for duplicate challan number if provided
      if (recordData.challanNo) {
        const existingRecord = records.find(record => 
          record.challanNo === recordData.challanNo && 
          record.registerType === recordData.registerType
        );
        
        if (existingRecord) {
          return {
            success: false,
            data: null,
            message: `Challan number ${recordData.challanNo} already exists for ${recordData.registerType}`
          };
        }
      }
      
      const newRecord = {
        ...recordData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: recordData.status || 'Active',
        recordNumber: generateRecordNumber(recordData.registerType, records.length + 1)
      };
      
      records.push(newRecord);
      localStorage.setItem('advanceDepositRecords', JSON.stringify(records));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Advance & Deposits',
        action: 'CREATE',
        description: `${recordData.registerType} record created: ${newRecord.recordNumber} - ${recordData.name}`,
        userName: 'Current User',
        details: {
          recordId: newRecord.id,
          recordNumber: newRecord.recordNumber,
          registerType: recordData.registerType,
          amount: recordData.amount,
          name: recordData.name,
          challanNo: recordData.challanNo
        }
      });
      
      window.dispatchEvent(new CustomEvent('advanceDepositRecordsUpdated', { 
        detail: records 
      }));
      
      return {
        success: true,
        data: newRecord,
        message: `${recordData.registerType} record created successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create record'
      };
    }
  },

  update: async (id, recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        // Check for duplicate challan number if changed
        if (recordData.challanNo && recordData.challanNo !== records[index].challanNo) {
          const existingRecord = records.find(record => 
            record.challanNo === recordData.challanNo && 
            record.registerType === recordData.registerType &&
            record.id !== id
          );
          
          if (existingRecord) {
            return {
              success: false,
              data: null,
              message: `Challan number ${recordData.challanNo} already exists for ${recordData.registerType}`
            };
          }
        }
        
        const oldData = { ...records[index] };
        records[index] = {
          ...records[index],
          ...recordData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('advanceDepositRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Advance & Deposits',
          action: 'UPDATE',
          description: `${recordData.registerType} record updated: ${records[index].recordNumber} - ${recordData.name}`,
          userName: 'Current User',
          details: {
            recordId: id,
            recordNumber: records[index].recordNumber,
            oldData: {
              amount: oldData.amount,
              name: oldData.name,
              status: oldData.status
            },
            newData: {
              amount: recordData.amount,
              name: recordData.name,
              status: recordData.status
            }
          }
        });
        
        window.dispatchEvent(new CustomEvent('advanceDepositRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: `${recordData.registerType} record updated successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update record'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const recordToDelete = records.find(rec => rec.id === id);
      const filteredRecords = records.filter(rec => rec.id !== id);
      
      if (records.length !== filteredRecords.length) {
        localStorage.setItem('advanceDepositRecords', JSON.stringify(filteredRecords));
        
        // Log audit trail
        if (recordToDelete) {
          await auditTrailService.log({
            module: 'Advance & Deposits',
            action: 'DELETE',
            description: `${recordToDelete.registerType} record deleted: ${recordToDelete.recordNumber} - ${recordToDelete.name}`,
            userName: 'Current User',
            details: {
              recordId: id,
              deletedData: {
                recordNumber: recordToDelete.recordNumber,
                registerType: recordToDelete.registerType,
                amount: recordToDelete.amount,
                name: recordToDelete.name,
                challanNo: recordToDelete.challanNo
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('advanceDepositRecordsUpdated', { 
          detail: filteredRecords 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Record deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete record'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const filtered = records.filter(record =>
        record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.challanNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.narration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Get summary statistics
  getSummary: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      
      // Apply date filter if provided
      let filteredRecords = records;
      if (params.fromDate) {
        filteredRecords = filteredRecords.filter(record => record.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        filteredRecords = filteredRecords.filter(record => record.challanDate <= params.toDate);
      }
      
      const summary = {
        totalRecords: filteredRecords.length,
        advanceRecords: filteredRecords.filter(r => r.registerType === 'Advance Register').length,
        depositRecords: filteredRecords.filter(r => r.registerType === 'Deposit Register').length,
        activeRecords: filteredRecords.filter(r => r.status === 'Active').length,
        inactiveRecords: filteredRecords.filter(r => r.status === 'Inactive').length,
        totalAdvanceAmount: filteredRecords
          .filter(r => r.registerType === 'Advance Register')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        totalDepositAmount: filteredRecords
          .filter(r => r.registerType === 'Deposit Register')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        totalAmount: filteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
        financialYearBreakdown: {},
        transactionTypeBreakdown: {},
        monthlyTrend: {}
      };
      
      // Financial year breakdown
      filteredRecords.forEach(record => {
        const fy = record.financialYear;
        if (!summary.financialYearBreakdown[fy]) {
          summary.financialYearBreakdown[fy] = {
            count: 0,
            amount: 0,
            advance: { count: 0, amount: 0 },
            deposit: { count: 0, amount: 0 }
          };
        }
        summary.financialYearBreakdown[fy].count++;
        summary.financialYearBreakdown[fy].amount += record.amount || 0;
        
        if (record.registerType === 'Advance Register') {
          summary.financialYearBreakdown[fy].advance.count++;
          summary.financialYearBreakdown[fy].advance.amount += record.amount || 0;
        } else {
          summary.financialYearBreakdown[fy].deposit.count++;
          summary.financialYearBreakdown[fy].deposit.amount += record.amount || 0;
        }
      });
      
      // Transaction type breakdown for deposits
      filteredRecords
        .filter(r => r.registerType === 'Deposit Register')
        .forEach(record => {
          const type = record.transactionType;
          if (!summary.transactionTypeBreakdown[type]) {
            summary.transactionTypeBreakdown[type] = { count: 0, amount: 0 };
          }
          summary.transactionTypeBreakdown[type].count++;
          summary.transactionTypeBreakdown[type].amount += record.amount || 0;
        });
      
      // Monthly trend (last 12 months)
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM format
      }).reverse();
      
      last12Months.forEach(month => {
        const monthRecords = filteredRecords.filter(record => 
          record.challanDate?.startsWith(month)
        );
        summary.monthlyTrend[month] = {
          count: monthRecords.length,
          amount: monthRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
          advance: {
            count: monthRecords.filter(r => r.registerType === 'Advance Register').length,
            amount: monthRecords
              .filter(r => r.registerType === 'Advance Register')
              .reduce((sum, r) => sum + (r.amount || 0), 0)
          },
          deposit: {
            count: monthRecords.filter(r => r.registerType === 'Deposit Register').length,
            amount: monthRecords
              .filter(r => r.registerType === 'Deposit Register')
              .reduce((sum, r) => sum + (r.amount || 0), 0)
          }
        };
      });
      
      return {
        success: true,
        data: summary,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get summary'
      };
    }
  },

  // Get records by financial year
  getByFinancialYear: async (financialYear) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const filtered = records.filter(record => record.financialYear === financialYear);
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.challanDate) - new Date(a.challanDate)),
        message: `Records for ${financialYear} retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch records by financial year'
      };
    }
  },

  // Toggle record status
  toggleStatus: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        const oldStatus = records[index].status;
        records[index].status = oldStatus === 'Active' ? 'Inactive' : 'Active';
        records[index].statusChangedDate = new Date().toISOString().split('T')[0];
        
        localStorage.setItem('advanceDepositRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Advance & Deposits',
          action: 'STATUS_CHANGE',
          description: `Record status changed: ${records[index].recordNumber} - ${oldStatus} to ${records[index].status}`,
          userName: 'Current User',
          details: {
            recordId: id,
            recordNumber: records[index].recordNumber,
            name: records[index].name,
            oldStatus,
            newStatus: records[index].status
          }
        });
        
        window.dispatchEvent(new CustomEvent('advanceDepositRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: `Record ${records[index].status.toLowerCase()} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to toggle record status'
      };
    }
  },

  // Bulk operations
  bulkDelete: async (ids) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      const recordsToDelete = records.filter(rec => ids.includes(rec.id));
      const filteredRecords = records.filter(rec => !ids.includes(rec.id));
      
      const deletedCount = records.length - filteredRecords.length;
      
      if (deletedCount > 0) {
        localStorage.setItem('advanceDepositRecords', JSON.stringify(filteredRecords));
        
        // Log audit trail for bulk delete
        await auditTrailService.log({
          module: 'Advance & Deposits',
          action: 'BULK_DELETE',
          description: `Bulk delete operation: ${deletedCount} record(s) deleted`,
          userName: 'Current User',
          details: {
            deletedCount,
            deletedRecords: recordsToDelete.map(rec => ({
              id: rec.id,
              recordNumber: rec.recordNumber,
              name: rec.name,
              amount: rec.amount
            }))
          }
        });
        
        window.dispatchEvent(new CustomEvent('advanceDepositRecordsUpdated', { 
          detail: filteredRecords 
        }));
        
        return {
          success: true,
          data: { deletedCount },
          message: `${deletedCount} record(s) deleted successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'No records were deleted'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete records'
      };
    }
  },

  // Export data to CSV format
  exportData: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let records = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
      
      // Apply filters if provided
      if (params.registerType) {
        records = records.filter(rec => rec.registerType === params.registerType);
      }
      if (params.financialYear) {
        records = records.filter(rec => rec.financialYear === params.financialYear);
      }
      if (params.fromDate) {
        records = records.filter(rec => rec.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        records = records.filter(rec => rec.challanDate <= params.toDate);
      }
      
      // Convert to CSV format
      const csvHeaders = [
        'Record Number',
        'Register Type',
        'Financial Year',
        'Ledger Code',
        'Ledger Head',
        'Transaction Type',
        'Challan Date',
        'Challan No',
        'Amount',
        'Name',
        'Narration',
        'Status',
        'Created Date'
      ];
      
      const csvData = records.map(record => [
        record.recordNumber || '',
        record.registerType || '',
        record.financialYear || '',
        record.ledgerCode || '',
        record.ledgerName || '',
        record.transactionType || '',
        record.challanDate || '',
        record.challanNo || '',
        record.amount || 0,
        record.name || '',
        record.narration || '',
        record.status || '',
        record.createdDate || ''
      ]);
      
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return {
        success: true,
        data: {
          content: csvContent,
          filename: `advance_deposit_records_${new Date().toISOString().split('T')[0]}.csv`,
          recordCount: records.length
        },
        message: `Export prepared successfully (${records.length} records)`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to export data'
      };
    }
  }
};

// Helper function to generate record numbers
const generateRecordNumber = (registerType, sequence) => {
  const prefix = registerType === 'Advance Register' ? 'ADV' : 'DEP';
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `${prefix}${year}${month}${seq}`;
};

// Sample data seeding function
export const seedAdvanceDepositData = () => {
  const existingRecords = JSON.parse(localStorage.getItem('advanceDepositRecords') || '[]');
  
  if (existingRecords.length === 0) {
    const sampleRecords = [
      {
        id: 1,
        recordNumber: 'ADV240501',
        registerType: 'Advance Register',
        financialYear: '2024-25',
        ledgerCode: '1030',
        ledgerName: 'Advance to Contractors',
        challanDate: '2024-05-01',
        challanNo: 'CH001',
        amount: 50000,
        name: 'ABC Construction Company',
        narration: 'Advance payment for building construction work as per contract dated 15-04-2024',
        status: 'Active',
        createdDate: '2024-05-01',
        createdTime: '10:30:00'
      },
      {
        id: 2,
        recordNumber: 'ADV240502',
        registerType: 'Advance Register',
        financialYear: '2024-25',
        ledgerCode: '1031',
        ledgerName: 'Advance to Employees',
        challanDate: '2024-05-02',
        challanNo: 'CH002',
        amount: 15000,
        name: 'Rajesh Kumar (EMP001)',
        narration: 'Advance salary payment for medical emergency',
        status: 'Active',
        createdDate: '2024-05-02',
        createdTime: '14:15:00'
      },
      {
        id: 3,
        recordNumber: 'DEP240503',
        registerType: 'Deposit Register',
        financialYear: '2024-25',
        transactionType: 'Security Deposit',
        challanDate: '2024-05-03',
        challanNo: 'CH003',
        amount: 25000,
        name: 'XYZ Suppliers Pvt Ltd',
        narration: 'Security deposit received for supply contract of office furniture',
        status: 'Active',
        createdDate: '2024-05-03',
        createdTime: '11:45:00'
      },
      {
        id: 4,
        recordNumber: 'DEP240504',
        registerType: 'Deposit Register',
        financialYear: '2024-25',
        transactionType: 'Earnest Money',
        challanDate: '2024-05-04',
        challanNo: 'CH004',
        amount: 100000,
        name: 'PQR Engineering Solutions',
        narration: 'Earnest money deposit for tender participation - Project ABC',
        status: 'Active',
        createdDate: '2024-05-04',
        createdTime: '09:20:00'
      },
      {
        id: 5,
        recordNumber: 'ADV240505',
        registerType: 'Advance Register',
        financialYear: '2024-25',
        ledgerCode: '1032',
        ledgerName: 'Advance to Suppliers',
        challanDate: '2024-05-05',
        challanNo: 'CH005',
        amount: 75000,
        name: 'Modern Office Equipment Co.',
        narration: 'Advance payment for computer equipment purchase order PO/2024/001',
        status: 'Active',
        createdDate: '2024-05-05',
        createdTime: '16:30:00'
      },
      {
        id: 6,
        recordNumber: 'DEP240506',
        registerType: 'Deposit Register',
        financialYear: '2024-25',
        transactionType: 'Performance Guarantee',
        challanDate: '2024-05-06',
        challanNo: 'CH006',
        amount: 200000,
        name: 'Elite Construction Ltd',
        narration: 'Performance guarantee for construction of new office building',
        status: 'Active',
        createdDate: '2024-05-06',
        createdTime: '12:00:00'
      },
      {
        id: 7,
        recordNumber: 'DEP240507',
        registerType: 'Deposit Register',
        financialYear: '2024-25',
        transactionType: 'Fixed Deposit',
        challanDate: '2024-05-07',
        challanNo: 'FD001',
        amount: 500000,
        name: 'State Bank of India',
        narration: 'Fixed deposit opened for 12 months at 7.5% interest rate',
        status: 'Active',
        createdDate: '2024-05-07',
        createdTime: '10:45:00'
      },
      {
        id: 8,
        recordNumber: 'ADV240508',
        registerType: 'Advance Register',
        financialYear: '2024-25',
        ledgerCode: '1031',
        ledgerName: 'Advance to Employees',
        challanDate: '2024-05-08',
        challanNo: 'CH008',
        amount: 8000,
        name: 'Priya Sharma (EMP002)',
        narration: 'Travel advance for official trip to Mumbai',
        status: 'Active',
        createdDate: '2024-05-08',
        createdTime: '13:15:00'
      },
      {
        id: 9,
        recordNumber: 'DEP240509',
        registerType: 'Deposit Register',
        financialYear: '2024-25',
        transactionType: 'Retention Money',
        challanDate: '2024-05-09',
        challanNo: 'CH009',
        amount: 35000,
        name: 'ABC Construction Company',
        narration: 'Retention money for completed phase 1 of building construction',
        status: 'Active',
        createdDate: '2024-05-09',
        createdTime: '15:20:00'
      },
      {
        id: 10,
        recordNumber: 'DEP240510',
        registerType: 'Deposit Register',
        financialYear: '2023-24',
        transactionType: 'EMD Refund',
        challanDate: '2024-05-10',
        challanNo: 'CH010',
        amount: 50000,
        name: 'Tech Solutions India',
        narration: 'EMD refund for unsuccessful tender participation',
        status: 'Inactive',
        createdDate: '2024-05-10',
        createdTime: '11:30:00',
        statusChangedDate: '2024-05-15'
      }
    ];
    
    localStorage.setItem('advanceDepositRecords', JSON.stringify(sampleRecords));
    console.log('✅ Sample Advance & Deposit records seeded:', sampleRecords.length, 'records');
    
    // Add some audit trail entries
    const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    const auditEntries = [
      {
        id: Date.now() + 1000,
        timestamp: new Date('2024-05-01T10:30:00').toISOString(),
        date: '2024-05-01',
        time: '10:30:00',
        module: 'Advance & Deposits',
        action: 'CREATE',
        description: 'Advance Register record created: ADV240501 - ABC Construction Company',
        userName: 'Accounts User',
        details: {
          recordId: 1,
          recordNumber: 'ADV240501',
          registerType: 'Advance Register',
          amount: 50000,
          name: 'ABC Construction Company'
        }
      },
      {
        id: Date.now() + 1001,
        timestamp: new Date('2024-05-03T11:45:00').toISOString(),
        date: '2024-05-03',
        time: '11:45:00',
        module: 'Advance & Deposits',
        action: 'CREATE',
        description: 'Deposit Register record created: DEP240503 - XYZ Suppliers Pvt Ltd',
        userName: 'Accounts User',
        details: {
          recordId: 3,
          recordNumber: 'DEP240503',
          registerType: 'Deposit Register',
          amount: 25000,
          name: 'XYZ Suppliers Pvt Ltd'
        }
      },
      {
        id: Date.now() + 1002,
        timestamp: new Date('2024-05-15T16:20:00').toISOString(),
        date: '2024-05-15',
        time: '16:20:00',
        module: 'Advance & Deposits',
        action: 'STATUS_CHANGE',
        description: 'Record status changed: DEP240510 - Active to Inactive',
        userName: 'Finance Manager',
        details: {
          recordId: 10,
          recordNumber: 'DEP240510',
          name: 'Tech Solutions India',
          oldStatus: 'Active',
          newStatus: 'Inactive'
        }
      }
    ];
    
    const updatedAuditTrail = [...existingAuditTrail, ...auditEntries];
    localStorage.setItem('auditTrail', JSON.stringify(updatedAuditTrail));
    console.log('✅ Sample Advance & Deposit audit entries seeded:', auditEntries.length, 'entries');
  } else {
    console.log(`ℹ️ Advance & Deposit records already exist: ${existingRecords.length} records`);
  }
};

// Utility function to clear Advance & Deposit data
export const clearAdvanceDepositData = () => {
  localStorage.removeItem('advanceDepositRecords');
  console.log('🧹 Advance & Deposit data cleared from localStorage');
  return { success: true, message: 'Advance & Deposit data cleared successfully' };
};

// Auto-seed data when module is imported (uncomment to enable)
// console.log('🌱 Auto-seeding Advance & Deposit data...');
// seedAdvanceDepositData();

// Mock MDR Service
export const mdrService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      
      // Apply filters if provided
      let filtered = records;
      if (params.financialYear) {
        filtered = filtered.filter(record => record.financialYear === params.financialYear);
      }
      if (params.status) {
        filtered = filtered.filter(record => record.status === params.status);
      }
      if (params.fromDate) {
        filtered = filtered.filter(record => record.nextRenewalDate >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(record => record.nextRenewalDate <= params.toDate);
      }
      if (params.minAmount) {
        filtered = filtered.filter(record => record.monthlyInstallment >= params.minAmount);
      }
      if (params.maxAmount) {
        filtered = filtered.filter(record => record.monthlyInstallment <= params.maxAmount);
      }
      if (params.lesseeName) {
        filtered = filtered.filter(record => 
          record.lesseeName?.toLowerCase().includes(params.lesseeName.toLowerCase())
        );
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: 'MDR records retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch MDR records'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const record = records.find(rec => rec.id === id);
      
      if (record) {
        return {
          success: true,
          data: record,
          message: 'MDR record retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'MDR record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch MDR record'
      };
    }
  },

  create: async (recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      
      // Check for duplicate assessment number in same financial year
      const existingRecord = records.find(record => 
        record.assessmentNo === recordData.assessmentNo && 
        record.financialYear === recordData.financialYear
      );
      
      if (existingRecord) {
        return {
          success: false,
          data: null,
          message: `Assessment number ${recordData.assessmentNo} already exists for financial year ${recordData.financialYear}`
        };
      }
      
      const newRecord = {
        ...recordData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: recordData.status || 'Active',
        recordNumber: generateMDRNumber(recordData.assessmentNo, records.length + 1)
      };
      
      records.push(newRecord);
      localStorage.setItem('mdrRecords', JSON.stringify(records));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'MDR Details',
        action: 'CREATE',
        description: `MDR record created: ${newRecord.recordNumber} - ${recordData.lesseeName}`,
        userName: 'Current User',
        details: {
          recordId: newRecord.id,
          recordNumber: newRecord.recordNumber,
          assessmentNo: recordData.assessmentNo,
          lesseeName: recordData.lesseeName,
          monthlyInstallment: recordData.monthlyInstallment,
          totalDemandPerYear: recordData.totalDemandPerYear
        }
      });
      
      window.dispatchEvent(new CustomEvent('mdrRecordsUpdated', { 
        detail: records 
      }));
      
      return {
        success: true,
        data: newRecord,
        message: 'MDR record created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create MDR record'
      };
    }
  },

  update: async (id, recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        // Check for duplicate assessment number if changed
        if (recordData.assessmentNo !== records[index].assessmentNo || 
            recordData.financialYear !== records[index].financialYear) {
          const existingRecord = records.find(record => 
            record.assessmentNo === recordData.assessmentNo && 
            record.financialYear === recordData.financialYear &&
            record.id !== id
          );
          
          if (existingRecord) {
            return {
              success: false,
              data: null,
              message: `Assessment number ${recordData.assessmentNo} already exists for financial year ${recordData.financialYear}`
            };
          }
        }
        
        const oldData = { ...records[index] };
        records[index] = {
          ...records[index],
          ...recordData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('mdrRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'MDR Details',
          action: 'UPDATE',
          description: `MDR record updated: ${records[index].recordNumber} - ${recordData.lesseeName}`,
          userName: 'Current User',
          details: {
            recordId: id,
            recordNumber: records[index].recordNumber,
            oldData: {
              lesseeName: oldData.lesseeName,
              monthlyInstallment: oldData.monthlyInstallment,
              status: oldData.status
            },
            newData: {
              lesseeName: recordData.lesseeName,
              monthlyInstallment: recordData.monthlyInstallment,
              status: recordData.status
            }
          }
        });
        
        window.dispatchEvent(new CustomEvent('mdrRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: 'MDR record updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'MDR record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update MDR record'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const recordToDelete = records.find(rec => rec.id === id);
      const filteredRecords = records.filter(rec => rec.id !== id);
      
      if (records.length !== filteredRecords.length) {
        localStorage.setItem('mdrRecords', JSON.stringify(filteredRecords));
        
        // Log audit trail
        if (recordToDelete) {
          await auditTrailService.log({
            module: 'MDR Details',
            action: 'DELETE',
            description: `MDR record deleted: ${recordToDelete.recordNumber} - ${recordToDelete.lesseeName}`,
            userName: 'Current User',
            details: {
              recordId: id,
              deletedData: {
                recordNumber: recordToDelete.recordNumber,
                assessmentNo: recordToDelete.assessmentNo,
                lesseeName: recordToDelete.lesseeName,
                monthlyInstallment: recordToDelete.monthlyInstallment,
                totalDemandPerYear: recordToDelete.totalDemandPerYear
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('mdrRecordsUpdated', { 
          detail: filteredRecords 
        }));
        
        return {
          success: true,
          data: null,
          message: 'MDR record deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'MDR record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete MDR record'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const filtered = records.filter(record =>
        record.assessmentNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.lesseeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.leasePropertyDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.lesseeAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Get summary statistics
  getSummary: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      
      // Apply date filter if provided
      let filteredRecords = records;
      if (params.fromDate) {
        filteredRecords = filteredRecords.filter(record => record.createdDate >= params.fromDate);
      }
      if (params.toDate) {
        filteredRecords = filteredRecords.filter(record => record.createdDate <= params.toDate);
      }
      
      const summary = {
        totalRecords: filteredRecords.length,
        activeLeases: filteredRecords.filter(r => r.status === 'Active').length,
        inactiveLeases: filteredRecords.filter(r => r.status === 'Inactive').length,
        totalMonthlyRevenue: filteredRecords
          .filter(r => r.status === 'Active')
          .reduce((sum, r) => sum + (r.monthlyInstallment || 0), 0),
        totalYearlyRevenue: filteredRecords
          .filter(r => r.status === 'Active')
          .reduce((sum, r) => sum + (r.totalDemandPerYear || 0), 0),
        totalDeposits: filteredRecords.reduce((sum, r) => sum + (r.depositAmount || 0), 0),
        totalGSTReceivable: filteredRecords.reduce((sum, r) => sum + (r.gstReceivable || 0), 0),
        totalITReceivable: filteredRecords.reduce((sum, r) => sum + (r.itReceivable || 0), 0),
        financialYearBreakdown: {},
        leasePeriodBreakdown: {},
        upcomingRenewals: [],
        revenueByProperty: {},
        averageMonthlyRent: 0
      };
      
      // Calculate average monthly rent
      if (summary.activeLeases > 0) {
        summary.averageMonthlyRent = summary.totalMonthlyRevenue / summary.activeLeases;
      }
      
      // Financial year breakdown
      filteredRecords.forEach(record => {
        const fy = record.financialYear;
        if (!summary.financialYearBreakdown[fy]) {
          summary.financialYearBreakdown[fy] = {
            count: 0,
            monthlyRevenue: 0,
            yearlyRevenue: 0,
            deposits: 0
          };
        }
        summary.financialYearBreakdown[fy].count++;
        summary.financialYearBreakdown[fy].monthlyRevenue += record.monthlyInstallment || 0;
        summary.financialYearBreakdown[fy].yearlyRevenue += record.totalDemandPerYear || 0;
        summary.financialYearBreakdown[fy].deposits += record.depositAmount || 0;
      });
      
      // Lease period breakdown
      filteredRecords.forEach(record => {
        const period = record.leasePeriod || 'Not specified';
        if (!summary.leasePeriodBreakdown[period]) {
          summary.leasePeriodBreakdown[period] = { count: 0, revenue: 0 };
        }
        summary.leasePeriodBreakdown[period].count++;
        summary.leasePeriodBreakdown[period].revenue += record.monthlyInstallment || 0;
      });
      
      // Upcoming renewals (next 90 days)
      const today = new Date();
      const next90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
      
      summary.upcomingRenewals = filteredRecords
        .filter(record => 
          record.status === 'Active' && 
          record.nextRenewalDate &&
          new Date(record.nextRenewalDate) >= today &&
          new Date(record.nextRenewalDate) <= next90Days
        )
        .map(record => ({
          id: record.id,
          assessmentNo: record.assessmentNo,
          lesseeName: record.lesseeName,
          nextRenewalDate: record.nextRenewalDate,
          monthlyInstallment: record.monthlyInstallment,
          leasePropertyDetails: record.leasePropertyDetails
        }))
        .sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate));
      
      // Revenue by property type (simplified categorization)
      filteredRecords.forEach(record => {
        // Simple categorization based on property details keywords
        let propertyType = 'Others';
        const details = record.leasePropertyDetails?.toLowerCase() || '';
        
        if (details.includes('shop') || details.includes('commercial')) {
          propertyType = 'Commercial Shops';
        } else if (details.includes('office')) {
          propertyType = 'Office Spaces';
        } else if (details.includes('warehouse') || details.includes('godown')) {
          propertyType = 'Warehouses';
        } else if (details.includes('land') || details.includes('plot')) {
          propertyType = 'Land/Plots';
        }
        
        if (!summary.revenueByProperty[propertyType]) {
          summary.revenueByProperty[propertyType] = { count: 0, revenue: 0 };
        }
        summary.revenueByProperty[propertyType].count++;
        summary.revenueByProperty[propertyType].revenue += record.monthlyInstallment || 0;
      });
      
      return {
        success: true,
        data: summary,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get summary'
      };
    }
  },

  // Get records by financial year
  getByFinancialYear: async (financialYear) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const filtered = records.filter(record => record.financialYear === financialYear);
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: `MDR records for ${financialYear} retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch records by financial year'
      };
    }
  },

  // Get upcoming renewals
  getUpcomingRenewals: async (days = 90) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const today = new Date();
      const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const upcomingRenewals = records.filter(record => 
        record.status === 'Active' && 
        record.nextRenewalDate &&
        new Date(record.nextRenewalDate) >= today &&
        new Date(record.nextRenewalDate) <= futureDate
      ).sort((a, b) => new Date(a.nextRenewalDate) - new Date(b.nextRenewalDate));
      
      return {
        success: true,
        data: upcomingRenewals,
        message: `Upcoming renewals for next ${days} days retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch upcoming renewals'
      };
    }
  },

  // Toggle record status
  toggleStatus: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        const oldStatus = records[index].status;
        records[index].status = oldStatus === 'Active' ? 'Inactive' : 'Active';
        records[index].statusChangedDate = new Date().toISOString().split('T')[0];
        
        localStorage.setItem('mdrRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'MDR Details',
          action: 'STATUS_CHANGE',
          description: `MDR record status changed: ${records[index].recordNumber} - ${oldStatus} to ${records[index].status}`,
          userName: 'Current User',
          details: {
            recordId: id,
            recordNumber: records[index].recordNumber,
            lesseeName: records[index].lesseeName,
            oldStatus,
            newStatus: records[index].status
          }
        });
        
        window.dispatchEvent(new CustomEvent('mdrRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: `MDR record ${records[index].status.toLowerCase()} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'MDR record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to toggle record status'
      };
    }
  },

  // Calculate revenue projections
  getRevenueProjections: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const activeRecords = records.filter(r => r.status === 'Active');
      
      const projections = {
        currentMonth: 0,
        currentQuarter: 0,
        currentYear: 0,
        nextYear: 0,
        monthlyBreakdown: {},
        quarterlyBreakdown: {},
        yearlyTrend: {}
      };
      
      // Calculate current totals
      projections.currentMonth = activeRecords.reduce((sum, r) => sum + (r.monthlyInstallment || 0), 0);
      projections.currentQuarter = projections.currentMonth * 3;
      projections.currentYear = activeRecords.reduce((sum, r) => sum + (r.totalDemandPerYear || 0), 0);
      projections.nextYear = projections.currentYear; // Assuming same rates
      
      // Monthly breakdown for next 12 months
      for (let i = 0; i < 12; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() + i);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        projections.monthlyBreakdown[monthKey] = projections.currentMonth;
      }
      
      // Quarterly breakdown
      const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
      quarters.forEach(quarter => {
        projections.quarterlyBreakdown[quarter] = projections.currentQuarter;
      });
      
      // Yearly trend (current and next 3 years)
      for (let i = 0; i < 4; i++) {
        const year = new Date().getFullYear() + i;
        projections.yearlyTrend[year] = projections.currentYear;
      }
      
      return {
        success: true,
        data: projections,
        message: 'Revenue projections calculated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to calculate revenue projections'
      };
    }
  },

  // Export data to CSV format
  exportData: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      
      // Apply filters if provided
      if (params.financialYear) {
        records = records.filter(rec => rec.financialYear === params.financialYear);
      }
      if (params.status) {
        records = records.filter(rec => rec.status === params.status);
      }
      if (params.fromDate) {
        records = records.filter(rec => rec.createdDate >= params.fromDate);
      }
      if (params.toDate) {
        records = records.filter(rec => rec.createdDate <= params.toDate);
      }
      
      // Convert to CSV format
      const csvHeaders = [
        'Record Number',
        'Assessment No',
        'Financial Year',
        'Ledger Code',
        'Ledger Head',
        'Lease Property Details',
        'Lease Period',
        'Next Renewal Date',
        'Lessee Name',
        'Lessee Address',
        'Deposit Amount',
        'Monthly Installment',
        'Total Demand Per Year',
        'GST Receivable',
        'IT Receivable',
        'Deposit Challan Details',
        'Status',
        'Created Date'
      ];
      
      const csvData = records.map(record => [
        record.recordNumber || '',
        record.assessmentNo || '',
        record.financialYear || '',
        record.ledgerCode || '',
        record.ledgerName || '',
        record.leasePropertyDetails || '',
        record.leasePeriod || '',
        record.nextRenewalDate || '',
        record.lesseeName || '',
        record.lesseeAddress || '',
        record.depositAmount || 0,
        record.monthlyInstallment || 0,
        record.totalDemandPerYear || 0,
        record.gstReceivable || 0,
        record.itReceivable || 0,
        record.depositChallanDetails || '',
        record.status || '',
        record.createdDate || ''
      ]);
      
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return {
        success: true,
        data: {
          content: csvContent,
          filename: `mdr_records_${new Date().toISOString().split('T')[0]}.csv`,
          recordCount: records.length
        },
        message: `Export prepared successfully (${records.length} records)`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to export data'
      };
    }
  }
};

// Helper function to generate MDR record numbers
const generateMDRNumber = (assessmentNo, sequence) => {
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `MDR${year}${month}${seq}`;
};

// Sample data seeding function
export const seedMDRData = () => {
  const existingRecords = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
  
  if (existingRecords.length === 0) {
    const sampleRecords = [
      {
        id: 1,
        recordNumber: 'MDR240501',
        assessmentNo: 'ASS001/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Commercial shop located at Main Market, Ground Floor, Area: 500 sq ft',
        leasePeriod: '3 years',
        nextRenewalDate: '2025-03-31',
        lesseeName: 'Rajesh Trading Company',
        lesseeAddress: '123, Business Street, Commercial Area, City - 400001',
        depositAmount: 150000,
        depositChallanDetails: 'Challan No: CH001, Date: 01-04-2024, Bank: SBI Main Branch',
        monthlyInstallment: 25000,
        totalDemandPerYear: 300000,
        gstReceivable: 45000,
        itReceivable: 30000,
        status: 'Active',
        createdDate: '2024-04-01',
        createdTime: '10:30:00'
      },
      {
        id: 2,
        recordNumber: 'MDR240502',
        assessmentNo: 'ASS002/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Office space in IT Complex, 2nd Floor, Area: 1200 sq ft, with parking',
        leasePeriod: '5 years',
        nextRenewalDate: '2026-06-30',
        lesseeName: 'TechSolutions Pvt Ltd',
        lesseeAddress: '45, Tech Park, Software City, Bangalore - 560001',
        depositAmount: 400000,
        depositChallanDetails: 'Challan No: CH002, Date: 15-04-2024, Bank: HDFC Corporate Branch',
        monthlyInstallment: 80000,
        totalDemandPerYear: 960000,
        gstReceivable: 144000,
        itReceivable: 96000,
        status: 'Active',
        createdDate: '2024-04-15',
        createdTime: '14:20:00'
      },
      {
        id: 3,
        recordNumber: 'MDR240503',
        assessmentNo: 'ASS003/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Warehouse facility with loading dock, Area: 5000 sq ft, Industrial Area',
        leasePeriod: '10 years',
        nextRenewalDate: '2027-12-31',
        lesseeName: 'Global Logistics Ltd',
        lesseeAddress: '78, Industrial Estate, Warehouse District, Mumbai - 400070',
        depositAmount: 600000,
        depositChallanDetails: 'Challan No: CH003, Date: 20-04-2024, Bank: ICICI Business Banking',
        monthlyInstallment: 60000,
        totalDemandPerYear: 720000,
        gstReceivable: 108000,
        itReceivable: 72000,
        status: 'Active',
        createdDate: '2024-04-20',
        createdTime: '11:15:00'
      },
      {
        id: 4,
        recordNumber: 'MDR240504',
        assessmentNo: 'ASS004/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Restaurant space in Food Court, Ground Floor, Area: 800 sq ft, Kitchen included',
        leasePeriod: '2 years',
        nextRenewalDate: '2025-08-15',
        lesseeName: 'Spice Garden Restaurant',
        lesseeAddress: '12, Food Court Complex, Mall Road, Delhi - 110001',
        depositAmount: 200000,
        depositChallanDetails: 'Challan No: CH004, Date: 25-04-2024, Bank: Axis Bank',
        monthlyInstallment: 45000,
        totalDemandPerYear: 540000,
        gstReceivable: 81000,
        itReceivable: 54000,
        status: 'Active',
        createdDate: '2024-04-25',
        createdTime: '16:45:00'
      },
      {
        id: 5,
        recordNumber: 'MDR240505',
        assessmentNo: 'ASS005/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Medical clinic space with separate entrance, 1st Floor, Area: 600 sq ft',
        leasePeriod: '1 year',
        nextRenewalDate: '2025-05-10',
        lesseeName: 'Dr. Sharma Medical Clinic',
        lesseeAddress: '34, Medical Complex, Healthcare Avenue, Chennai - 600001',
        depositAmount: 100000,
        depositChallanDetails: 'Challan No: CH005, Date: 05-05-2024, Bank: SBI Healthcare Branch',
        monthlyInstallment: 35000,
        totalDemandPerYear: 420000,
        gstReceivable: 63000,
        itReceivable: 42000,
        status: 'Active',
        createdDate: '2024-05-05',
        createdTime: '09:30:00'
      },
      {
        id: 6,
        recordNumber: 'MDR240506',
        assessmentNo: 'ASS006/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Retail showroom in prime location, Ground Floor, Area: 1500 sq ft, Display windows',
        leasePeriod: '5 years',
        nextRenewalDate: '2026-09-30',
        lesseeName: 'Fashion Point Retail',
        lesseeAddress: '67, Shopping District, Fashion Street, Pune - 411001',
        depositAmount: 500000,
        depositChallanDetails: 'Challan No: CH006, Date: 10-05-2024, Bank: HDFC Main Branch',
        monthlyInstallment: 75000,
        totalDemandPerYear: 900000,
        gstReceivable: 135000,
        itReceivable: 90000,
        status: 'Active',
        createdDate: '2024-05-10',
        createdTime: '13:20:00'
      },
      {
        id: 7,
        recordNumber: 'MDR240507',
        assessmentNo: 'ASS007/2023',
        financialYear: '2023-24',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Small kiosk in transportation hub, Area: 100 sq ft, High footfall location',
        leasePeriod: '11 months',
        nextRenewalDate: '2024-06-30',
        lesseeName: 'Quick Snacks Corner',
        lesseeAddress: '89, Bus Terminal Complex, Transport Nagar, Jaipur - 302001',
        depositAmount: 50000,
        depositChallanDetails: 'Challan No: CH007, Date: 15-05-2024, Bank: PNB Transport Branch',
        monthlyInstallment: 15000,
        totalDemandPerYear: 180000,
        gstReceivable: 27000,
        itReceivable: 18000,
        status: 'Inactive',
        createdDate: '2023-07-15',
        createdTime: '12:00:00',
        statusChangedDate: '2024-05-15'
      },
      {
        id: 8,
        recordNumber: 'MDR240508',
        assessmentNo: 'ASS008/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Pharmacy space with storage room, Ground Floor, Area: 400 sq ft, Near hospital',
        leasePeriod: '3 years',
        nextRenewalDate: '2025-12-31',
        lesseeName: 'HealthCare Pharmacy',
        lesseeAddress: '23, Hospital Road, Medical District, Hyderabad - 500001',
        depositAmount: 120000,
        depositChallanDetails: 'Challan No: CH008, Date: 20-05-2024, Bank: Canara Bank Medical Branch',
        monthlyInstallment: 30000,
        totalDemandPerYear: 360000,
        gstReceivable: 54000,
        itReceivable: 36000,
        status: 'Active',
        createdDate: '2024-05-20',
        createdTime: '15:10:00'
      },
      {
        id: 9,
        recordNumber: 'MDR240509',
        assessmentNo: 'ASS009/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Educational center with multiple rooms, 1st Floor, Area: 2000 sq ft, Classroom setup',
        leasePeriod: '5 years',
        nextRenewalDate: '2026-03-31',
        lesseeName: 'Bright Future Academy',
        lesseeAddress: '56, Education Hub, Academic Zone, Kolkata - 700001',
        depositAmount: 300000,
        depositChallanDetails: 'Challan No: CH009, Date: 25-05-2024, Bank: Bank of Baroda Education Branch',
        monthlyInstallment: 50000,
        totalDemandPerYear: 600000,
        gstReceivable: 90000,
        itReceivable: 60000,
        status: 'Active',
        createdDate: '2024-05-25',
        createdTime: '10:45:00'
      },
      {
        id: 10,
        recordNumber: 'MDR240510',
        assessmentNo: 'ASS010/2024',
        financialYear: '2024-25',
        ledgerCode: '5050',
        ledgerName: 'Rental Income',
        leasePropertyDetails: 'Automobile service center with lift facility, Ground Floor, Area: 3000 sq ft',
        leasePeriod: '10 years',
        nextRenewalDate: '2028-12-31',
        lesseeName: 'Elite Auto Services',
        lesseeAddress: '90, Auto Hub, Service Road, Gurgaon - 122001',
        depositAmount: 800000,
        depositChallanDetails: 'Challan No: CH010, Date: 30-05-2024, Bank: ICICI Auto Finance Branch',
        monthlyInstallment: 100000,
        totalDemandPerYear: 1200000,
        gstReceivable: 180000,
        itReceivable: 120000,
        status: 'Active',
        createdDate: '2024-05-30',
        createdTime: '14:30:00'
      }
    ];
    
    localStorage.setItem('mdrRecords', JSON.stringify(sampleRecords));
    console.log('✅ Sample MDR records seeded:', sampleRecords.length, 'records');
    
    // Add some audit trail entries
    const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    const auditEntries = [
      {
        id: Date.now() + 2000,
        timestamp: new Date('2024-04-01T10:30:00').toISOString(),
        date: '2024-04-01',
        time: '10:30:00',
        module: 'MDR Details',
        action: 'CREATE',
        description: 'MDR record created: MDR240501 - Rajesh Trading Company',
        userName: 'Property Manager',
        details: {
          recordId: 1,
          recordNumber: 'MDR240501',
          assessmentNo: 'ASS001/2024',
          lesseeName: 'Rajesh Trading Company',
          monthlyInstallment: 25000,
          totalDemandPerYear: 300000
        }
      },
      {
        id: Date.now() + 2001,
        timestamp: new Date('2024-04-15T14:20:00').toISOString(),
        date: '2024-04-15',
        time: '14:20:00',
        module: 'MDR Details',
        action: 'CREATE',
        description: 'MDR record created: MDR240502 - TechSolutions Pvt Ltd',
        userName: 'Property Manager',
        details: {
          recordId: 2,
          recordNumber: 'MDR240502',
          assessmentNo: 'ASS002/2024',
          lesseeName: 'TechSolutions Pvt Ltd',
          monthlyInstallment: 80000,
          totalDemandPerYear: 960000
        }
      },
      {
        id: Date.now() + 2002,
        timestamp: new Date('2024-05-15T16:00:00').toISOString(),
        date: '2024-05-15',
        time: '16:00:00',
        module: 'MDR Details',
        action: 'STATUS_CHANGE',
        description: 'MDR record status changed: MDR240507 - Active to Inactive',
        userName: 'Finance Manager',
        details: {
          recordId: 7,
          recordNumber: 'MDR240507',
          lesseeName: 'Quick Snacks Corner',
          oldStatus: 'Active',
          newStatus: 'Inactive'
        }
      },
      {
        id: Date.now() + 2003,
        timestamp: new Date('2024-05-30T14:30:00').toISOString(),
        date: '2024-05-30',
        time: '14:30:00',
        module: 'MDR Details',
        action: 'CREATE',
        description: 'MDR record created: MDR240510 - Elite Auto Services',
        userName: 'Property Manager',
        details: {
          recordId: 10,
          recordNumber: 'MDR240510',
          assessmentNo: 'ASS010/2024',
          lesseeName: 'Elite Auto Services',
          monthlyInstallment: 100000,
          totalDemandPerYear: 1200000
        }
      }
    ];
    
    const updatedAuditTrail = [...existingAuditTrail, ...auditEntries];
    localStorage.setItem('auditTrail', JSON.stringify(updatedAuditTrail));
    console.log('✅ Sample MDR audit entries seeded:', auditEntries.length, 'entries');
  } else {
    console.log(`ℹ️ MDR records already exist: ${existingRecords.length} records`);
  }
};

// Utility function to clear MDR data
export const clearMDRData = () => {
  localStorage.removeItem('mdrRecords');
  console.log('🧹 MDR data cleared from localStorage');
  return { success: true, message: 'MDR data cleared successfully' };
};

// MDR Revenue Analytics Service
export const mdrAnalyticsService = {
  getRevenueAnalytics: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const records = JSON.parse(localStorage.getItem('mdrRecords') || '[]');
      const activeRecords = records.filter(r => r.status === 'Active');
      
      const analytics = {
        totalProperties: activeRecords.length,
        totalMonthlyRevenue: activeRecords.reduce((sum, r) => sum + (r.monthlyInstallment || 0), 0),
        totalYearlyRevenue: activeRecords.reduce((sum, r) => sum + (r.totalDemandPerYear || 0), 0),
        averageRentPerSqFt: 0,
        occupancyRate: 0,
        revenueGrowth: {
          monthlyGrowth: 0,
          yearlyGrowth: 0
        },
        topPerformingProperties: [],
        revenueByCategory: {},
        geographicalDistribution: {},
        leaseExpiryAnalysis: {
          expiring30Days: 0,
          expiring90Days: 0,
          expiring365Days: 0
        },
        riskAnalysis: {
          highRiskProperties: [],
          mediumRiskProperties: [],
          lowRiskProperties: []
        }
      };
      
      // Calculate occupancy rate (assuming 100 total available properties)
      analytics.occupancyRate = (activeRecords.length / 100) * 100;
      
      // Top performing properties by revenue
      analytics.topPerformingProperties = activeRecords
        .sort((a, b) => (b.monthlyInstallment || 0) - (a.monthlyInstallment || 0))
        .slice(0, 5)
        .map(record => ({
          assessmentNo: record.assessmentNo,
          lesseeName: record.lesseeName,
          monthlyRevenue: record.monthlyInstallment,
          propertyType: extractPropertyType(record.leasePropertyDetails)
        }));
      
      // Revenue by category
      activeRecords.forEach(record => {
        const category = extractPropertyType(record.leasePropertyDetails);
        if (!analytics.revenueByCategory[category]) {
          analytics.revenueByCategory[category] = { count: 0, revenue: 0 };
        }
        analytics.revenueByCategory[category].count++;
        analytics.revenueByCategory[category].revenue += record.monthlyInstallment || 0;
      });
      
      // Lease expiry analysis
      const today = new Date();
      activeRecords.forEach(record => {
        if (record.nextRenewalDate) {
          const renewalDate = new Date(record.nextRenewalDate);
          const daysUntilExpiry = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            analytics.leaseExpiryAnalysis.expiring30Days++;
          } else if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
            analytics.leaseExpiryAnalysis.expiring90Days++;
          } else if (daysUntilExpiry <= 365 && daysUntilExpiry > 0) {
            analytics.leaseExpiryAnalysis.expiring365Days++;
          }
        }
      });
      
      // Risk analysis based on various factors
      activeRecords.forEach(record => {
        let riskScore = 0;
        
        // Factor 1: Lease expiry proximity
        if (record.nextRenewalDate) {
          const renewalDate = new Date(record.nextRenewalDate);
          const daysUntilExpiry = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
          if (daysUntilExpiry <= 30) riskScore += 3;
          else if (daysUntilExpiry <= 90) riskScore += 2;
          else if (daysUntilExpiry <= 180) riskScore += 1;
        }
        
        // Factor 2: Revenue size (higher revenue = higher risk if lost)
        if ((record.monthlyInstallment || 0) > 50000) riskScore += 2;
        else if ((record.monthlyInstallment || 0) > 25000) riskScore += 1;
        
        // Factor 3: Lease duration (shorter = higher risk)
        if (record.leasePeriod === '11 months' || record.leasePeriod === '1 year') riskScore += 2;
        else if (record.leasePeriod === '2 years') riskScore += 1;
        
        const riskProperty = {
          assessmentNo: record.assessmentNo,
          lesseeName: record.lesseeName,
          monthlyRevenue: record.monthlyInstallment,
          nextRenewalDate: record.nextRenewalDate,
          riskScore
        };
        
        if (riskScore >= 5) {
          analytics.riskAnalysis.highRiskProperties.push(riskProperty);
        } else if (riskScore >= 3) {
          analytics.riskAnalysis.mediumRiskProperties.push(riskProperty);
        } else {
          analytics.riskAnalysis.lowRiskProperties.push(riskProperty);
        }
      });
      
      return {
        success: true,
        data: analytics,
        message: 'Revenue analytics generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate revenue analytics'
      };
    }
  }
};

// Helper function to extract property type from description
const extractPropertyType = (description) => {
  if (!description) return 'Others';
  
  const desc = description.toLowerCase();
  if (desc.includes('shop') || desc.includes('retail')) return 'Retail';
  if (desc.includes('office')) return 'Office';
  if (desc.includes('warehouse') || desc.includes('godown')) return 'Warehouse';
  if (desc.includes('restaurant') || desc.includes('food')) return 'Food & Beverage';
  if (desc.includes('medical') || desc.includes('clinic') || desc.includes('pharmacy')) return 'Healthcare';
  if (desc.includes('education') || desc.includes('academy') || desc.includes('school')) return 'Education';
  if (desc.includes('auto') || desc.includes('service center')) return 'Automotive';
  if (desc.includes('kiosk')) return 'Kiosk';
  return 'Others';
};

// Auto-seed data when module is imported (uncomment to enable)
// console.log('🌱 Auto-seeding MDR data...');
// seedMDRData();

// Mock Payable Service
export const payableService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      
      // Apply filters if provided
      let filtered = records;
      if (params.financialYear) {
        filtered = filtered.filter(record => record.financialYear === params.financialYear);
      }
      if (params.status) {
        filtered = filtered.filter(record => record.status === params.status);
      }
      if (params.transactionType) {
        filtered = filtered.filter(record => record.transactionType === params.transactionType);
      }
      if (params.fromDate) {
        filtered = filtered.filter(record => record.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        filtered = filtered.filter(record => record.challanDate <= params.toDate);
      }
      if (params.minAmount) {
        filtered = filtered.filter(record => record.amount >= params.minAmount);
      }
      if (params.maxAmount) {
        filtered = filtered.filter(record => record.amount <= params.maxAmount);
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: 'Payable records retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch payable records'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const record = records.find(rec => rec.id === id);
      
      if (record) {
        return {
          success: true,
          data: record,
          message: 'Payable record retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch payable record'
      };
    }
  },

  create: async (recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      
      // Check for duplicate challan number if provided
      if (recordData.challanNo) {
        const existingRecord = records.find(record => 
          record.challanNo === recordData.challanNo && 
          record.transactionType === recordData.transactionType
        );
        
        if (existingRecord) {
          return {
            success: false,
            data: null,
            message: `Challan number ${recordData.challanNo} already exists for ${recordData.transactionType}`
          };
        }
      }
      
      const newRecord = {
        ...recordData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        status: recordData.status || 'Pending',
        payableNumber: generatePayableNumber(recordData.transactionType, records.length + 1)
      };
      
      // Auto-update status based on due date
      if (newRecord.dueDate && newRecord.status === 'Pending') {
        const today = new Date();
        const dueDate = new Date(newRecord.dueDate);
        if (dueDate < today) {
          newRecord.status = 'Overdue';
        }
      }
      
      records.push(newRecord);
      localStorage.setItem('payableRecords', JSON.stringify(records));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Payables',
        action: 'CREATE',
        description: `Payable record created: ${newRecord.payableNumber} - ${recordData.transactionType} - ${recordData.name}`,
        userName: 'Current User',
        details: {
          recordId: newRecord.id,
          payableNumber: newRecord.payableNumber,
          transactionType: recordData.transactionType,
          amount: recordData.amount,
          name: recordData.name,
          challanNo: recordData.challanNo,
          status: newRecord.status
        }
      });
      
      window.dispatchEvent(new CustomEvent('payableRecordsUpdated', { 
        detail: records 
      }));
      
      return {
        success: true,
        data: newRecord,
        message: 'Payable record created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create payable record'
      };
    }
  },

  update: async (id, recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        // Check for duplicate challan number if changed
        if (recordData.challanNo && recordData.challanNo !== records[index].challanNo) {
          const existingRecord = records.find(record => 
            record.challanNo === recordData.challanNo && 
            record.transactionType === recordData.transactionType &&
            record.id !== id
          );
          
          if (existingRecord) {
            return {
              success: false,
              data: null,
              message: `Challan number ${recordData.challanNo} already exists for ${recordData.transactionType}`
            };
          }
        }
        
        const oldData = { ...records[index] };
        records[index] = {
          ...records[index],
          ...recordData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        // Auto-update status based on due date if still pending
        if (records[index].dueDate && records[index].status === 'Pending') {
          const today = new Date();
          const dueDate = new Date(records[index].dueDate);
          if (dueDate < today) {
            records[index].status = 'Overdue';
          }
        }
        
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Payables',
          action: 'UPDATE',
          description: `Payable record updated: ${records[index].payableNumber} - ${recordData.transactionType} - ${recordData.name}`,
          userName: 'Current User',
          details: {
            recordId: id,
            payableNumber: records[index].payableNumber,
            oldData: {
              amount: oldData.amount,
              status: oldData.status,
              name: oldData.name
            },
            newData: {
              amount: recordData.amount,
              status: records[index].status,
              name: recordData.name
            }
          }
        });
        
        window.dispatchEvent(new CustomEvent('payableRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: 'Payable record updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update payable record'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const recordToDelete = records.find(rec => rec.id === id);
      const filteredRecords = records.filter(rec => rec.id !== id);
      
      if (records.length !== filteredRecords.length) {
        localStorage.setItem('payableRecords', JSON.stringify(filteredRecords));
        
        // Log audit trail
        if (recordToDelete) {
          await auditTrailService.log({
            module: 'Payables',
            action: 'DELETE',
            description: `Payable record deleted: ${recordToDelete.payableNumber} - ${recordToDelete.transactionType} - ${recordToDelete.name}`,
            userName: 'Current User',
            details: {
              recordId: id,
              deletedData: {
                payableNumber: recordToDelete.payableNumber,
                transactionType: recordToDelete.transactionType,
                amount: recordToDelete.amount,
                name: recordToDelete.name,
                challanNo: recordToDelete.challanNo,
                status: recordToDelete.status
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('payableRecordsUpdated', { 
          detail: filteredRecords 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Payable record deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete payable record'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const filtered = records.filter(record =>
        record.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.challanNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.ledgerCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.narration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.payableNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Update status of a payable record
  updateStatus: async (id, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        const oldStatus = records[index].status;
        records[index].status = newStatus;
        records[index].statusUpdatedDate = new Date().toISOString().split('T')[0];
        
        // If status is changed to 'Paid', set payment date
        if (newStatus === 'Paid') {
          records[index].paidDate = new Date().toISOString().split('T')[0];
        }
        
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Payables',
          action: 'STATUS_CHANGE',
          description: `Payable status changed: ${records[index].payableNumber} - ${oldStatus} to ${newStatus}`,
          userName: 'Current User',
          details: {
            recordId: id,
            payableNumber: records[index].payableNumber,
            transactionType: records[index].transactionType,
            amount: records[index].amount,
            oldStatus,
            newStatus
          }
        });
        
        window.dispatchEvent(new CustomEvent('payableRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: `Status updated to ${newStatus} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update status'
      };
    }
  },

  // Get summary statistics
  getSummary: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      
      // Apply date filter if provided
      let filteredRecords = records;
      if (params.fromDate) {
        filteredRecords = filteredRecords.filter(record => record.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        filteredRecords = filteredRecords.filter(record => record.challanDate <= params.toDate);
      }
      
      const summary = {
        totalRecords: filteredRecords.length,
        totalAmount: filteredRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
        pendingCount: filteredRecords.filter(r => r.status === 'Pending').length,
        pendingAmount: filteredRecords
          .filter(r => r.status === 'Pending')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        paidCount: filteredRecords.filter(r => r.status === 'Paid').length,
        paidAmount: filteredRecords
          .filter(r => r.status === 'Paid')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        overdueCount: filteredRecords.filter(r => r.status === 'Overdue').length,
        overdueAmount: filteredRecords
          .filter(r => r.status === 'Overdue')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        cancelledCount: filteredRecords.filter(r => r.status === 'Cancelled').length,
        cancelledAmount: filteredRecords
          .filter(r => r.status === 'Cancelled')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        transactionTypeBreakdown: {},
        financialYearBreakdown: {},
        upcomingDueDates: [],
        monthlyTrend: {}
      };
      
      // Transaction type breakdown
      filteredRecords.forEach(record => {
        const type = record.transactionType;
        if (!summary.transactionTypeBreakdown[type]) {
          summary.transactionTypeBreakdown[type] = {
            count: 0,
            amount: 0,
            pending: 0,
            paid: 0,
            overdue: 0
          };
        }
        summary.transactionTypeBreakdown[type].count++;
        summary.transactionTypeBreakdown[type].amount += record.amount || 0;
        
        if (record.status === 'Pending') summary.transactionTypeBreakdown[type].pending++;
        else if (record.status === 'Paid') summary.transactionTypeBreakdown[type].paid++;
        else if (record.status === 'Overdue') summary.transactionTypeBreakdown[type].overdue++;
      });
      
      // Financial year breakdown
      filteredRecords.forEach(record => {
        const fy = record.financialYear;
        if (!summary.financialYearBreakdown[fy]) {
          summary.financialYearBreakdown[fy] = {
            count: 0,
            amount: 0,
            pending: 0,
            paid: 0,
            overdue: 0
          };
        }
        summary.financialYearBreakdown[fy].count++;
        summary.financialYearBreakdown[fy].amount += record.amount || 0;
        
        if (record.status === 'Pending') summary.financialYearBreakdown[fy].pending++;
        else if (record.status === 'Paid') summary.financialYearBreakdown[fy].paid++;
        else if (record.status === 'Overdue') summary.financialYearBreakdown[fy].overdue++;
      });
      
      // Upcoming due dates (next 30 days)
      const today = new Date();
      const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      summary.upcomingDueDates = filteredRecords
        .filter(record => 
          (record.status === 'Pending' || record.status === 'Overdue') && 
          record.dueDate &&
          new Date(record.dueDate) >= today &&
          new Date(record.dueDate) <= next30Days
        )
        .map(record => ({
          id: record.id,
          payableNumber: record.payableNumber,
          transactionType: record.transactionType,
          name: record.name,
          amount: record.amount,
          dueDate: record.dueDate,
          daysUntilDue: Math.ceil((new Date(record.dueDate) - today) / (1000 * 60 * 60 * 24))
        }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      
      // Monthly trend (last 12 months)
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM format
      }).reverse();
      
      last12Months.forEach(month => {
        const monthRecords = filteredRecords.filter(record => 
          record.challanDate?.startsWith(month)
        );
        summary.monthlyTrend[month] = {
          count: monthRecords.length,
          amount: monthRecords.reduce((sum, r) => sum + (r.amount || 0), 0),
          pending: monthRecords.filter(r => r.status === 'Pending').length,
          paid: monthRecords.filter(r => r.status === 'Paid').length,
          overdue: monthRecords.filter(r => r.status === 'Overdue').length
        };
      });
      
      return {
        success: true,
        data: summary,
        message: 'Summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get summary'
      };
    }
  },

  // Get overdue payables
  getOverduePayables: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const today = new Date();
      
      // Auto-update overdue status
      let updated = false;
      records.forEach(record => {
        if (record.status === 'Pending' && record.dueDate) {
          const dueDate = new Date(record.dueDate);
          if (dueDate < today) {
            record.status = 'Overdue';
            updated = true;
          }
        }
      });
      
      if (updated) {
        localStorage.setItem('payableRecords', JSON.stringify(records));
      }
      
      const overdueRecords = records.filter(record => record.status === 'Overdue');
      
      return {
        success: true,
        data: overdueRecords.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
        message: 'Overdue payables retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch overdue payables'
      };
    }
  },

  // Bulk status update
  bulkUpdateStatus: async (ids, newStatus) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      let updatedCount = 0;
      
      records.forEach(record => {
        if (ids.includes(record.id)) {
          record.status = newStatus;
          record.statusUpdatedDate = new Date().toISOString().split('T')[0];
          if (newStatus === 'Paid') {
            record.paidDate = new Date().toISOString().split('T')[0];
          }
          updatedCount++;
        }
      });
      
      if (updatedCount > 0) {
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail for bulk update
        await auditTrailService.log({
          module: 'Payables',
          action: 'BULK_STATUS_UPDATE',
          description: `Bulk status update: ${updatedCount} record(s) updated to ${newStatus}`,
          userName: 'Current User',
          details: {
            updatedCount,
            newStatus,
            recordIds: ids
          }
        });
        
        window.dispatchEvent(new CustomEvent('payableRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: { updatedCount },
          message: `${updatedCount} record(s) updated to ${newStatus} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'No records were updated'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update records'
      };
    }
  },

  // Export data to CSV format
  exportData: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      
      // Apply filters if provided
      if (params.status) {
        records = records.filter(rec => rec.status === params.status);
      }
      if (params.transactionType) {
        records = records.filter(rec => rec.transactionType === params.transactionType);
      }
      if (params.financialYear) {
        records = records.filter(rec => rec.financialYear === params.financialYear);
      }
      if (params.fromDate) {
        records = records.filter(rec => rec.challanDate >= params.fromDate);
      }
      if (params.toDate) {
        records = records.filter(rec => rec.challanDate <= params.toDate);
      }
      
      // Convert to CSV format
      const csvHeaders = [
        'Payable Number',
        'Financial Year',
        'Transaction Type',
        'Ledger Code',
        'Ledger Head',
        'Challan No',
        'Challan Date',
        'Due Date',
        'Amount',
        'Name',
        'Status',
        'Paid Date',
        'Narration',
        'Created Date'
      ];
      
      const csvData = records.map(record => [
        record.payableNumber || '',
        record.financialYear || '',
        record.transactionType || '',
        record.ledgerCode || '',
        record.ledgerName || '',
        record.challanNo || '',
        record.challanDate || '',
        record.dueDate || '',
        record.amount || 0,
        record.name || '',
        record.status || '',
        record.paidDate || '',
        record.narration || '',
        record.createdDate || ''
      ]);
      
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return {
        success: true,
        data: {
          content: csvContent,
          filename: `payable_records_${new Date().toISOString().split('T')[0]}.csv`,
          recordCount: records.length
        },
        message: `Export prepared successfully (${records.length} records)`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to export data'
      };
    }
  }
};

// Helper function to generate payable numbers
const generatePayableNumber = (transactionType, sequence) => {
  const typePrefix = {
    'GST': 'GST',
    'Income Tax': 'ITX',
    'TDS': 'TDS',
    'Professional Tax': 'PTX',
    'ESI': 'ESI',
    'PF': 'PF',
    'LWF': 'LWF',
    'CPS': 'CPS',
    'Property Tax': 'PTY',
    'Trade License': 'TRD',
    'Utility Bills': 'UTL',
    'Vendor Payment': 'VND',
    'Other': 'OTH'
  };
  
  const prefix = typePrefix[transactionType] || 'PAY';
  const year = new Date().getFullYear().toString().slice(-2);
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = String(sequence).padStart(4, '0');
  return `${prefix}${year}${month}${seq}`;
};

// Sample data seeding function
export const seedPayableData = () => {
  const existingRecords = JSON.parse(localStorage.getItem('payableRecords') || '[]');
  
  if (existingRecords.length === 0) {
    const sampleRecords = [
      {
        id: 1,
        payableNumber: 'GST240501',
        financialYear: '2024-25',
        ledgerCode: '3051',
        ledgerName: 'GST Payable',
        transactionType: 'GST',
        challanNo: 'GST001',
        challanDate: '2024-05-15',
        dueDate: '2024-05-30',
        amount: 18000,
        name: 'ESIC Corporation',
        narration: 'ESI contribution for employees - April 2024',
        status: 'Pending',
        createdDate: '2024-05-15',
        createdTime: '16:45:00'
      },
      {
        id: 5,
        payableNumber: 'PF240505',
        financialYear: '2024-25',
        ledgerCode: '3054',
        ledgerName: 'PF Payable',
        transactionType: 'PF',
        challanNo: 'PF005',
        challanDate: '2024-05-15',
        dueDate: '2024-05-30',
        amount: 45000,
        name: 'EPFO',
        narration: 'Provident Fund contribution for employees - April 2024',
        status: 'Pending',
        createdDate: '2024-05-15',
        createdTime: '17:00:00'
      },
      {
        id: 6,
        payableNumber: 'PTX240506',
        financialYear: '2024-25',
        ledgerCode: '3052',
        ledgerName: 'Professional Tax Payable',
        transactionType: 'Professional Tax',
        challanNo: 'PT006',
        challanDate: '2024-04-30',
        dueDate: '2024-05-15',
        amount: 12000,
        name: 'State Government',
        narration: 'Professional tax for all employees - April 2024',
        status: 'Overdue',
        createdDate: '2024-04-30',
        createdTime: '12:30:00'
      },
      {
        id: 7,
        payableNumber: 'LWF240507',
        financialYear: '2024-25',
        ledgerCode: '3055',
        ledgerName: 'Labour Welfare Fund Payable',
        transactionType: 'LWF',
        challanNo: 'LWF007',
        challanDate: '2024-05-20',
        dueDate: '2024-06-05',
        amount: 5000,
        name: 'Labour Department',
        narration: 'Labour Welfare Fund contribution - April 2024',
        status: 'Pending',
        createdDate: '2024-05-20',
        createdTime: '09:15:00'
      },
      {
        id: 8,
        payableNumber: 'UTL240508',
        financialYear: '2024-25',
        ledgerCode: '3030',
        ledgerName: 'Outstanding Expenses',
        transactionType: 'Utility Bills',
        challanNo: 'EB008',
        challanDate: '2024-05-22',
        dueDate: '2024-06-07',
        amount: 28000,
        name: 'State Electricity Board',
        narration: 'Electricity bill for office premises - April 2024',
        status: 'Pending',
        createdDate: '2024-05-22',
        createdTime: '13:45:00'
      },
      {
        id: 9,
        payableNumber: 'VND240509',
        financialYear: '2024-25',
        ledgerCode: '3000',
        ledgerName: 'Sundry Creditors',
        transactionType: 'Vendor Payment',
        challanNo: 'VND009',
        challanDate: '2024-05-25',
        dueDate: '2024-06-10',
        amount: 150000,
        name: 'ABC Suppliers Pvt Ltd',
        narration: 'Payment for office furniture and equipment supply',
        status: 'Pending',
        createdDate: '2024-05-25',
        createdTime: '15:30:00'
      },
      {
        id: 10,
        payableNumber: 'PTY240510',
        financialYear: '2024-25',
        ledgerCode: '3070',
        ledgerName: 'Property Tax Payable',
        transactionType: 'Property Tax',
        challanNo: 'PT010',
        challanDate: '2024-04-01',
        dueDate: '2024-04-30',
        amount: 85000,
        name: 'Municipal Corporation',
        narration: 'Property tax for office building - FY 2024-25',
        status: 'Overdue',
        createdDate: '2024-04-01',
        createdTime: '10:00:00'
      },
      {
        id: 11,
        payableNumber: 'TRD240511',
        financialYear: '2024-25',
        ledgerCode: '3080',
        ledgerName: 'License Fees Payable',
        transactionType: 'Trade License',
        challanNo: 'TL011',
        challanDate: '2024-05-28',
        dueDate: '2024-06-15',
        amount: 25000,
        name: 'Municipal Corporation',
        narration: 'Trade license renewal fee - FY 2024-25',
        status: 'Pending',
        createdDate: '2024-05-28',
        createdTime: '11:20:00'
      },
      {
        id: 12,
        payableNumber: 'CPS240512',
        financialYear: '2024-25',
        ledgerCode: '3056',
        ledgerName: 'CPS Payable',
        transactionType: 'CPS',
        challanNo: 'CPS012',
        challanDate: '2024-05-30',
        dueDate: '2024-06-15',
        amount: 22000,
        name: 'CPS Authority',
        narration: 'Contributory Pension Scheme payment - April 2024',
        status: 'Pending',
        createdDate: '2024-05-30',
        createdTime: '14:10:00'
      }
    ];
    
    localStorage.setItem('payableRecords', JSON.stringify(sampleRecords));
    console.log('✅ Sample payable records seeded:', sampleRecords.length, 'records');
    
    // Add some audit trail entries
    const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    const auditEntries = [
      {
        id: Date.now() + 3000,
        timestamp: new Date('2024-05-01T10:30:00').toISOString(),
        date: '2024-05-01',
        time: '10:30:00',
        module: 'Payables',
        action: 'CREATE',
        description: 'Payable record created: GST240501 - GST - GST Department',
        userName: 'Accounts User',
        details: {
          recordId: 1,
          payableNumber: 'GST240501',
          transactionType: 'GST',
          amount: 125000,
          name: 'GST Department',
          status: 'Paid'
        }
      },
      {
        id: Date.now() + 3001,
        timestamp: new Date('2024-05-18T15:30:00').toISOString(),
        date: '2024-05-18',
        time: '15:30:00',
        module: 'Payables',
        action: 'STATUS_CHANGE',
        description: 'Payable status changed: GST240501 - Pending to Paid',
        userName: 'Finance Manager',
        details: {
          recordId: 1,
          payableNumber: 'GST240501',
          transactionType: 'GST',
          amount: 125000,
          oldStatus: 'Pending',
          newStatus: 'Paid'
        }
      },
      {
        id: Date.now() + 3002,
        timestamp: new Date('2024-05-25T15:30:00').toISOString(),
        date: '2024-05-25',
        time: '15:30:00',
        module: 'Payables',
        action: 'CREATE',
        description: 'Payable record created: VND240509 - Vendor Payment - ABC Suppliers Pvt Ltd',
        userName: 'Purchase User',
        details: {
          recordId: 9,
          payableNumber: 'VND240509',
          transactionType: 'Vendor Payment',
          amount: 150000,
          name: 'ABC Suppliers Pvt Ltd',
          status: 'Pending'
        }
      },
      {
        id: Date.now() + 3003,
        timestamp: new Date('2024-05-30T09:00:00').toISOString(),
        date: '2024-05-30',
        time: '09:00:00',
        module: 'Payables',
        action: 'BULK_STATUS_UPDATE',
        description: 'Bulk status update: 2 record(s) updated to Overdue',
        userName: 'System',
        details: {
          updatedCount: 2,
          newStatus: 'Overdue',
          recordIds: [6, 10]
        }
      }
    ];
    
    const updatedAuditTrail = [...existingAuditTrail, ...auditEntries];
    localStorage.setItem('auditTrail', JSON.stringify(updatedAuditTrail));
    console.log('✅ Sample payable audit entries seeded:', auditEntries.length, 'entries');
  } else {
    console.log(`ℹ️ Payable records already exist: ${existingRecords.length} records`);
  }
};

// Payable Analytics Service
export const payableAnalyticsService = {
  getDashboardMetrics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const today = new Date();
      
      const metrics = {
        totalPayables: records.length,
        totalAmount: records.reduce((sum, r) => sum + (r.amount || 0), 0),
        pendingAmount: records
          .filter(r => r.status === 'Pending')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        overdueAmount: records
          .filter(r => r.status === 'Overdue')
          .reduce((sum, r) => sum + (r.amount || 0), 0),
        paidThisMonth: 0,
        dueThisWeek: 0,
        cashFlowProjection: [],
        complianceRisk: {
          high: 0,
          medium: 0,
          low: 0
        },
        vendorAnalysis: {},
        taxCompliance: {
          gst: { pending: 0, amount: 0 },
          tds: { pending: 0, amount: 0 },
          esi: { pending: 0, amount: 0 },
          pf: { pending: 0, amount: 0 }
        }
      };
      
      // Calculate paid this month
      const currentMonth = today.toISOString().slice(0, 7);
      metrics.paidThisMonth = records
        .filter(r => r.status === 'Paid' && r.paidDate?.startsWith(currentMonth))
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      // Calculate due this week
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      metrics.dueThisWeek = records
        .filter(r => 
          (r.status === 'Pending' || r.status === 'Overdue') &&
          r.dueDate &&
          new Date(r.dueDate) >= today &&
          new Date(r.dueDate) <= nextWeek
        )
        .reduce((sum, r) => sum + (r.amount || 0), 0);
      
      // Cash flow projection (next 12 weeks)
      for (let i = 0; i < 12; i++) {
        const weekStart = new Date(today.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        const weeklyPayables = records
          .filter(r => 
            (r.status === 'Pending' || r.status === 'Overdue') &&
            r.dueDate &&
            new Date(r.dueDate) >= weekStart &&
            new Date(r.dueDate) <= weekEnd
          )
          .reduce((sum, r) => sum + (r.amount || 0), 0);
        
        metrics.cashFlowProjection.push({
          week: `Week ${i + 1}`,
          date: weekStart.toISOString().split('T')[0],
          amount: weeklyPayables
        });
      }
      
      // Compliance risk analysis
      records.forEach(record => {
        if (record.status === 'Pending' || record.status === 'Overdue') {
          const dueDate = new Date(record.dueDate);
          const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
          
          if (daysUntilDue < 0 || record.status === 'Overdue') {
            metrics.complianceRisk.high++;
          } else if (daysUntilDue <= 7) {
            metrics.complianceRisk.medium++;
          } else {
            metrics.complianceRisk.low++;
          }
        }
      });
      
      // Vendor analysis
      records.forEach(record => {
        const vendor = record.name;
        if (!metrics.vendorAnalysis[vendor]) {
          metrics.vendorAnalysis[vendor] = {
            totalAmount: 0,
            pendingAmount: 0,
            count: 0,
            avgPaymentTime: 0
          };
        }
        metrics.vendorAnalysis[vendor].totalAmount += record.amount || 0;
        metrics.vendorAnalysis[vendor].count++;
        
        if (record.status === 'Pending' || record.status === 'Overdue') {
          metrics.vendorAnalysis[vendor].pendingAmount += record.amount || 0;
        }
      });
      
      // Tax compliance tracking
      const taxTypes = ['GST', 'TDS', 'ESI', 'PF'];
      taxTypes.forEach(taxType => {
        const taxRecords = records.filter(r => r.transactionType === taxType);
        const pendingTax = taxRecords.filter(r => r.status === 'Pending' || r.status === 'Overdue');
        
        const key = taxType.toLowerCase();
        if (metrics.taxCompliance[key]) {
          metrics.taxCompliance[key].pending = pendingTax.length;
          metrics.taxCompliance[key].amount = pendingTax.reduce((sum, r) => sum + (r.amount || 0), 0);
        }
      });
      
      return {
        success: true,
        data: metrics,
        message: 'Dashboard metrics generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate dashboard metrics'
      };
    }
  },

  getComplianceReport: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const today = new Date();
      
      const report = {
        totalCompliance: 0,
        onTimePayments: 0,
        latePayments: 0,
        complianceByType: {},
        riskFactors: [],
        recommendations: [],
        monthlyCompliance: {}
      };
      
      // Calculate compliance metrics
      const duedRecords = records.filter(r => r.dueDate);
      report.totalCompliance = duedRecords.length;
      
      duedRecords.forEach(record => {
        const dueDate = new Date(record.dueDate);
        const paidDate = record.paidDate ? new Date(record.paidDate) : null;
        
        if (record.status === 'Paid') {
          if (paidDate && paidDate <= dueDate) {
            report.onTimePayments++;
          } else {
            report.latePayments++;
          }
        } else if (record.status === 'Overdue') {
          report.latePayments++;
        }
      });
      
      // Compliance by transaction type
      const transactionTypes = [...new Set(records.map(r => r.transactionType))];
      transactionTypes.forEach(type => {
        const typeRecords = records.filter(r => r.transactionType === type && r.dueDate);
        const onTime = typeRecords.filter(r => {
          if (r.status === 'Paid' && r.paidDate) {
            return new Date(r.paidDate) <= new Date(r.dueDate);
          }
          return false;
        }).length;
        
        report.complianceByType[type] = {
          total: typeRecords.length,
          onTime,
          compliance: typeRecords.length > 0 ? (onTime / typeRecords.length) * 100 : 0
        };
      });
      
      // Generate recommendations based on compliance data
      if (report.latePayments > report.onTimePayments) {
        report.recommendations.push('Consider implementing automated payment reminders');
        report.recommendations.push('Review cash flow management processes');
      }
      
      Object.entries(report.complianceByType).forEach(([type, data]) => {
        if (data.compliance < 80) {
          report.recommendations.push(`Improve ${type} payment scheduling (${data.compliance.toFixed(1)}% compliance)`);
        }
      });
      
      return {
        success: true,
        data: report,
        message: 'Compliance report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate compliance report'
      };
    }
  }
};

// Utility function to clear payable data
export const clearPayableData = () => {
  localStorage.removeItem('payableRecords');
  console.log('🧹 Payable data cleared from localStorage');
  return { success: true, message: 'Payable data cleared successfully' };
};

// Mock Payable Reminder Service
export const payableReminderService = {
  getDueReminders: async (days = 7) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const today = new Date();
      const targetDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
      
      const dueReminders = records
        .filter(record => 
          (record.status === 'Pending' || record.status === 'Overdue') &&
          record.dueDate &&
          new Date(record.dueDate) >= today &&
          new Date(record.dueDate) <= targetDate
        )
        .map(record => ({
          ...record,
          daysUntilDue: Math.ceil((new Date(record.dueDate) - today) / (1000 * 60 * 60 * 24)),
          priority: calculatePriority(record, today)
        }))
        .sort((a, b) => a.daysUntilDue - b.daysUntilDue);
      
      return {
        success: true,
        data: dueReminders,
        message: `Due reminders for next ${days} days retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch due reminders'
      };
    }
  },

  sendReminder: async (payableId, reminderType = 'email') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const record = records.find(r => r.id === payableId);
      
      if (!record) {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
      
      // Simulate sending reminder
      const reminderData = {
        id: Date.now(),
        payableId: payableId,
        payableNumber: record.payableNumber,
        reminderType,
        sentDate: new Date().toISOString().split('T')[0],
        sentTime: new Date().toLocaleTimeString(),
        recipient: record.name,
        amount: record.amount,
        dueDate: record.dueDate,
        status: 'Sent'
      };
      
      // Store reminder history
      const reminders = JSON.parse(localStorage.getItem('payableReminders') || '[]');
      reminders.push(reminderData);
      localStorage.setItem('payableReminders', JSON.stringify(reminders));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Payables',
        action: 'REMINDER_SENT',
        description: `Payment reminder sent: ${record.payableNumber} - ${reminderType} to ${record.name}`,
        userName: 'Current User',
        details: {
          payableId: payableId,
          payableNumber: record.payableNumber,
          reminderType,
          recipient: record.name,
          amount: record.amount,
          dueDate: record.dueDate
        }
      });
      
      return {
        success: true,
        data: reminderData,
        message: `${reminderType} reminder sent successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to send reminder'
      };
    }
  },

  getReminderHistory: async (payableId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const reminders = JSON.parse(localStorage.getItem('payableReminders') || '[]');
      const history = reminders.filter(r => r.payableId === payableId);
      
      return {
        success: true,
        data: history.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate)),
        message: 'Reminder history retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch reminder history'
      };
    }
  }
};

// Mock Payable Approval Service
export const payableApprovalService = {
  submitForApproval: async (payableId, approver) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const index = records.findIndex(r => r.id === payableId);
      
      if (index !== -1) {
        records[index].approvalStatus = 'Pending Approval';
        records[index].submittedForApproval = new Date().toISOString().split('T')[0];
        records[index].approver = approver;
        records[index].submittedBy = 'Current User';
        
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Payables',
          action: 'SUBMIT_APPROVAL',
          description: `Payable submitted for approval: ${records[index].payableNumber} to ${approver}`,
          userName: 'Current User',
          details: {
            payableId: payableId,
            payableNumber: records[index].payableNumber,
            approver: approver,
            amount: records[index].amount
          }
        });
        
        return {
          success: true,
          data: records[index],
          message: 'Payable submitted for approval successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to submit for approval'
      };
    }
  },

  approvePayable: async (payableId, approverComments = '') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const index = records.findIndex(r => r.id === payableId);
      
      if (index !== -1) {
        records[index].approvalStatus = 'Approved';
        records[index].approvedDate = new Date().toISOString().split('T')[0];
        records[index].approverComments = approverComments;
        records[index].approvedBy = 'Current User';
        
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Payables',
          action: 'APPROVE',
          description: `Payable approved: ${records[index].payableNumber}`,
          userName: 'Current User',
          details: {
            payableId: payableId,
            payableNumber: records[index].payableNumber,
            amount: records[index].amount,
            approverComments: approverComments
          }
        });
        
        return {
          success: true,
          data: records[index],
          message: 'Payable approved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to approve payable'
      };
    }
  },

  rejectPayable: async (payableId, rejectionReason) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const index = records.findIndex(r => r.id === payableId);
      
      if (index !== -1) {
        records[index].approvalStatus = 'Rejected';
        records[index].rejectedDate = new Date().toISOString().split('T')[0];
        records[index].rejectionReason = rejectionReason;
        records[index].rejectedBy = 'Current User';
        
        localStorage.setItem('payableRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Payables',
          action: 'REJECT',
          description: `Payable rejected: ${records[index].payableNumber} - ${rejectionReason}`,
          userName: 'Current User',
          details: {
            payableId: payableId,
            payableNumber: records[index].payableNumber,
            amount: records[index].amount,
            rejectionReason: rejectionReason
          }
        });
        
        return {
          success: true,
          data: records[index],
          message: 'Payable rejected successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Payable record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to reject payable'
      };
    }
  },

  getPendingApprovals: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const pendingApprovals = records.filter(r => r.approvalStatus === 'Pending Approval');
      
      return {
        success: true,
        data: pendingApprovals.sort((a, b) => new Date(a.submittedForApproval) - new Date(b.submittedForApproval)),
        message: 'Pending approvals retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch pending approvals'
      };
    }
  }
};

// Mock Payable Recurring Service
export const payableRecurringService = {
  createRecurringPayable: async (payableData, recurrencePattern) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const recurringPayables = JSON.parse(localStorage.getItem('recurringPayables') || '[]');
      
      const newRecurringPayable = {
        id: Date.now(),
        ...payableData,
        recurrencePattern, // { frequency: 'Monthly', interval: 1, endDate: '2025-12-31' }
        isActive: true,
        nextDueDate: calculateNextDueDate(new Date(), recurrencePattern),
        createdDate: new Date().toISOString().split('T')[0],
        lastExecuted: null,
        executionCount: 0
      };
      
      recurringPayables.push(newRecurringPayable);
      localStorage.setItem('recurringPayables', JSON.stringify(recurringPayables));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Payables',
        action: 'CREATE_RECURRING',
        description: `Recurring payable created: ${newRecurringPayable.transactionType} - ${recurrencePattern.frequency}`,
        userName: 'Current User',
        details: {
          recurringId: newRecurringPayable.id,
          transactionType: newRecurringPayable.transactionType,
          amount: newRecurringPayable.amount,
          frequency: recurrencePattern.frequency,
          nextDueDate: newRecurringPayable.nextDueDate
        }
      });
      
      return {
        success: true,
        data: newRecurringPayable,
        message: 'Recurring payable created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create recurring payable'
      };
    }
  },

  executeRecurringPayables: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const recurringPayables = JSON.parse(localStorage.getItem('recurringPayables') || '[]');
      const today = new Date();
      const executedPayables = [];
      
      for (const recurring of recurringPayables) {
        if (recurring.isActive && recurring.nextDueDate && new Date(recurring.nextDueDate) <= today) {
          // Create a new payable record
          const newPayableData = {
            ...recurring,
            id: undefined, // Will be auto-generated
            challanDate: today.toISOString().split('T')[0],
            dueDate: recurring.nextDueDate,
            status: 'Pending',
            isRecurring: true,
            recurringParentId: recurring.id
          };
          
          const result = await payableService.create(newPayableData);
          if (result.success) {
            executedPayables.push(result.data);
            
            // Update recurring payable
            recurring.lastExecuted = today.toISOString().split('T')[0];
            recurring.executionCount++;
            recurring.nextDueDate = calculateNextDueDate(new Date(recurring.nextDueDate), recurring.recurrencePattern);
            
            // Check if recurring should end
            if (recurring.recurrencePattern.endDate && 
                new Date(recurring.nextDueDate) > new Date(recurring.recurrencePattern.endDate)) {
              recurring.isActive = false;
            }
          }
        }
      }
      
      localStorage.setItem('recurringPayables', JSON.stringify(recurringPayables));
      
      // Log audit trail
      if (executedPayables.length > 0) {
        await auditTrailService.log({
          module: 'Payables',
          action: 'EXECUTE_RECURRING',
          description: `Recurring payables executed: ${executedPayables.length} payable(s) created`,
          userName: 'System',
          details: {
            executedCount: executedPayables.length,
            totalAmount: executedPayables.reduce((sum, p) => sum + p.amount, 0)
          }
        });
      }
      
      return {
        success: true,
        data: executedPayables,
        message: `${executedPayables.length} recurring payable(s) executed successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to execute recurring payables'
      };
    }
  },

  getRecurringPayables: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const recurringPayables = JSON.parse(localStorage.getItem('recurringPayables') || '[]');
      
      return {
        success: true,
        data: recurringPayables.sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate)),
        message: 'Recurring payables retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch recurring payables'
      };
    }
  },

  toggleRecurringStatus: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const recurringPayables = JSON.parse(localStorage.getItem('recurringPayables') || '[]');
      const index = recurringPayables.findIndex(r => r.id === id);
      
      if (index !== -1) {
        recurringPayables[index].isActive = !recurringPayables[index].isActive;
        localStorage.setItem('recurringPayables', JSON.stringify(recurringPayables));
        
        const status = recurringPayables[index].isActive ? 'activated' : 'deactivated';
        
        return {
          success: true,
          data: recurringPayables[index],
          message: `Recurring payable ${status} successfully`
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Recurring payable not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to toggle recurring status'
      };
    }
  }
};

// Mock Payable Integration Service (for external systems)
export const payableIntegrationService = {
  syncWithBankingSystem: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const approvedPayables = records.filter(r => 
        r.status === 'Pending' && 
        r.approvalStatus === 'Approved'
      );
      
      // Simulate banking system sync
      const syncResults = approvedPayables.map(payable => ({
        payableId: payable.id,
        payableNumber: payable.payableNumber,
        amount: payable.amount,
        bankReference: `BANK${Date.now()}${Math.floor(Math.random() * 1000)}`,
        syncStatus: Math.random() > 0.1 ? 'Success' : 'Failed', // 90% success rate
        syncDate: new Date().toISOString().split('T')[0]
      }));
      
      // Update successful syncs
      const successfulSyncs = syncResults.filter(s => s.syncStatus === 'Success');
      successfulSyncs.forEach(sync => {
        const payableIndex = records.findIndex(r => r.id === sync.payableId);
        if (payableIndex !== -1) {
          records[payableIndex].bankReference = sync.bankReference;
          records[payableIndex].syncedToBanking = true;
          records[payableIndex].syncDate = sync.syncDate;
        }
      });
      
      localStorage.setItem('payableRecords', JSON.stringify(records));
      
      return {
        success: true,
        data: {
          totalSynced: approvedPayables.length,
          successful: successfulSyncs.length,
          failed: syncResults.filter(s => s.syncStatus === 'Failed').length,
          syncResults
        },
        message: `Banking sync completed: ${successfulSyncs.length}/${approvedPayables.length} successful`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Banking sync failed'
      };
    }
  },

  syncWithAccountingSystem: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const paidPayables = records.filter(r => r.status === 'Paid' && !r.syncedToAccounting);
      
      // Simulate accounting system sync
      paidPayables.forEach(payable => {
        payable.syncedToAccounting = true;
        payable.accountingSyncDate = new Date().toISOString().split('T')[0];
        payable.journalReference = `JE${Date.now()}${payable.id}`;
      });
      
      localStorage.setItem('payableRecords', JSON.stringify(records));
      
      return {
        success: true,
        data: {
          syncedCount: paidPayables.length,
          totalAmount: paidPayables.reduce((sum, p) => sum + p.amount, 0)
        },
        message: `${paidPayables.length} paid payable(s) synced to accounting system`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Accounting sync failed'
      };
    }
  },

  generateTaxReports: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const records = JSON.parse(localStorage.getItem('payableRecords') || '[]');
      const { fromDate, toDate, taxType } = params;
      
      let filteredRecords = records.filter(r => r.status === 'Paid');
      
      if (fromDate) {
        filteredRecords = filteredRecords.filter(r => r.paidDate >= fromDate);
      }
      if (toDate) {
        filteredRecords = filteredRecords.filter(r => r.paidDate <= toDate);
      }
      if (taxType) {
        filteredRecords = filteredRecords.filter(r => r.transactionType === taxType);
      }
      
      const taxReport = {
        reportType: taxType || 'All Tax Types',
        reportPeriod: `${fromDate || 'Beginning'} to ${toDate || 'Current Date'}`,
        totalRecords: filteredRecords.length,
        totalAmount: filteredRecords.reduce((sum, r) => sum + r.amount, 0),
        breakdown: {},
        monthlyBreakdown: {},
        complianceStatus: 'Good' // Simplified
      };
      
      // Group by transaction type
      filteredRecords.forEach(record => {
        const type = record.transactionType;
        if (!taxReport.breakdown[type]) {
          taxReport.breakdown[type] = { count: 0, amount: 0 };
        }
        taxReport.breakdown[type].count++;
        taxReport.breakdown[type].amount += record.amount;
      });
      
      return {
        success: true,
        data: taxReport,
        message: 'Tax report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate tax report'
      };
    }
  }
};

// Helper functions
const calculatePriority = (record, today) => {
  const dueDate = new Date(record.dueDate);
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) return 'Critical';
  if (daysUntilDue <= 2) return 'High';
  if (daysUntilDue <= 7) return 'Medium';
  return 'Low';
};

const calculateNextDueDate = (currentDate, pattern) => {
  const nextDate = new Date(currentDate);
  
  switch (pattern.frequency) {
    case 'Daily':
      nextDate.setDate(nextDate.getDate() + (pattern.interval || 1));
      break;
    case 'Weekly':
      nextDate.setDate(nextDate.getDate() + 7 * (pattern.interval || 1));
      break;
    case 'Monthly':
      nextDate.setMonth(nextDate.getMonth() + (pattern.interval || 1));
      break;
    case 'Quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3 * (pattern.interval || 1));
      break;
    case 'Yearly':
      nextDate.setFullYear(nextDate.getFullYear() + (pattern.interval || 1));
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1); // Default to monthly
  }
  
  return nextDate.toISOString().split('T')[0];
};

// Comprehensive data seeding with advanced features
export const seedCompletePayableData = () => {
  // Seed main payable records
  seedPayableData();
  
  // Seed recurring payables
  const existingRecurring = JSON.parse(localStorage.getItem('recurringPayables') || '[]');
  if (existingRecurring.length === 0) {
    const recurringPayables = [
      {
        id: 1001,
        financialYear: '2024-25',
        ledgerCode: '3051',
        ledgerName: 'GST Payable',
        transactionType: 'GST',
        amount: 125000,
        name: 'GST Department',
        narration: 'Monthly GST payment',
        recurrencePattern: { frequency: 'Monthly', interval: 1, endDate: '2025-03-31' },
        isActive: true,
        nextDueDate: '2024-06-20',
        createdDate: '2024-04-01',
        lastExecuted: '2024-05-20',
        executionCount: 2
      },
      {
        id: 1002,
        financialYear: '2024-25',
        ledgerCode: '3053',
        ledgerName: 'ESI Payable',
        transactionType: 'ESI',
        amount: 18000,
        name: 'ESIC Corporation',
        narration: 'Monthly ESI contribution',
        recurrencePattern: { frequency: 'Monthly', interval: 1, endDate: '2025-03-31' },
        isActive: true,
        nextDueDate: '2024-06-15',
        createdDate: '2024-04-01',
        lastExecuted: '2024-05-15',
        executionCount: 2
      },
      {
        id: 1003,
        financialYear: '2024-25',
        ledgerCode: '3054',
        ledgerName: 'PF Payable',
        transactionType: 'PF',
        amount: 45000,
        name: 'EPFO',
        narration: 'Monthly PF contribution',
        recurrencePattern: { frequency: 'Monthly', interval: 1, endDate: '2025-03-31' },
        isActive: true,
        nextDueDate: '2024-06-15',
        createdDate: '2024-04-01',
        lastExecuted: '2024-05-15',
        executionCount: 2
      }
    ];
    
    localStorage.setItem('recurringPayables', JSON.stringify(recurringPayables));
    console.log('✅ Sample recurring payables seeded:', recurringPayables.length, 'recurring setups');
  }
  
  // Seed reminder history
  const existingReminders = JSON.parse(localStorage.getItem('payableReminders') || '[]');
  if (existingReminders.length === 0) {
    const reminderHistory = [
      {
        id: 2001,
        payableId: 6,
        payableNumber: 'PTX240506',
        reminderType: 'email',
        sentDate: '2024-05-14',
        sentTime: '09:00:00',
        recipient: 'State Government',
        amount: 12000,
        dueDate: '2024-05-15',
        status: 'Sent'
      },
      {
        id: 2002,
        payableId: 10,
        payableNumber: 'PTY240510',
        reminderType: 'sms',
        sentDate: '2024-04-28',
        sentTime: '10:30:00',
        recipient: 'Municipal Corporation',
        amount: 85000,
        dueDate: '2024-04-30',
        status: 'Sent'
      }
    ];
    
    localStorage.setItem('payableReminders', JSON.stringify(reminderHistory));
    console.log('✅ Sample reminder history seeded:', reminderHistory.length, 'reminders');
  }
  
  console.log('🎉 Complete payable data seeding finished successfully!');
  console.log('📊 Payable System Summary:');
  console.log(`   • Payable Records: ${JSON.parse(localStorage.getItem('payableRecords') || '[]').length}`);
  console.log(`   • Recurring Setups: ${JSON.parse(localStorage.getItem('recurringPayables') || '[]').length}`);
  console.log(`   • Reminder History: ${JSON.parse(localStorage.getItem('payableReminders') || '[]').length}`);
  
  return {
    success: true,
    message: 'Complete payable data seeded successfully',
    data: {
      payableRecords: JSON.parse(localStorage.getItem('payableRecords') || '[]').length,
      recurringPayables: JSON.parse(localStorage.getItem('recurringPayables') || '[]').length,
      reminderHistory: JSON.parse(localStorage.getItem('payableReminders') || '[]').length
    }
  };
};

// Auto-seed complete data when module is imported (uncomment to enable)
// console.log('🌱 Auto-seeding complete Payable data...');
// seedCompletePayableData();024-05-01',
// Mock Yearwise Balance Service
export const yearwiseBalanceService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      // Apply filters if provided
      let filtered = records;
      if (params.taxType) {
        filtered = filtered.filter(record => record.taxType === params.taxType);
      }
      if (params.fromYear) {
        filtered = filtered.filter(record => 
          record.balanceData?.some(entry => entry.year >= params.fromYear)
        );
      }
      if (params.toYear) {
        filtered = filtered.filter(record => 
          record.balanceData?.some(entry => entry.year <= params.toYear)
        );
      }
      if (params.minEfficiency) {
        filtered = filtered.filter(record => 
          record.collectionEfficiency >= params.minEfficiency
        );
      }
      if (params.maxEfficiency) {
        filtered = filtered.filter(record => 
          record.collectionEfficiency <= params.maxEfficiency
        );
      }
      
      return {
        success: true,
        data: filtered.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
        message: 'Yearwise balance records retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch yearwise balance records'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      const record = records.find(rec => rec.id === id);
      
      if (record) {
        return {
          success: true,
          data: record,
          message: 'Yearwise balance record retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Yearwise balance record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch yearwise balance record'
      };
    }
  },

  create: async (recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      // Check for duplicate tax type (only one record per tax type allowed)
      const existingRecord = records.find(record => 
        record.taxType === recordData.taxType
      );
      
      if (existingRecord) {
        return {
          success: false,
          data: null,
          message: `Yearwise balance for ${recordData.taxType} already exists. Please update the existing record.`
        };
      }
      
      const newRecord = {
        ...recordData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toLocaleTimeString(),
        recordNumber: generateYearwiseBalanceNumber(recordData.taxType, records.length + 1)
      };
      
      records.push(newRecord);
      localStorage.setItem('yearwiseBalanceRecords', JSON.stringify(records));
      
      // Log audit trail
      await auditTrailService.log({
        module: 'Yearwise Balance',
        action: 'CREATE',
        description: `Yearwise balance created: ${newRecord.recordNumber} - ${recordData.taxType}`,
        userName: 'Current User',
        details: {
          recordId: newRecord.id,
          recordNumber: newRecord.recordNumber,
          taxType: recordData.taxType,
          yearsCount: recordData.yearsCount,
          totalDemand: recordData.totalDemand,
          totalCollection: recordData.totalCollection,
          collectionEfficiency: recordData.collectionEfficiency
        }
      });
      
      window.dispatchEvent(new CustomEvent('yearwiseBalanceRecordsUpdated', { 
        detail: records 
      }));
      
      return {
        success: true,
        data: newRecord,
        message: 'Yearwise balance record created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create yearwise balance record'
      };
    }
  },

  update: async (id, recordData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      const index = records.findIndex(rec => rec.id === id);
      
      if (index !== -1) {
        // Check for duplicate tax type if changed
        if (recordData.taxType !== records[index].taxType) {
          const existingRecord = records.find(record => 
            record.taxType === recordData.taxType && record.id !== id
          );
          
          if (existingRecord) {
            return {
              success: false,
              data: null,
              message: `Yearwise balance for ${recordData.taxType} already exists`
            };
          }
        }
        
        const oldData = { ...records[index] };
        records[index] = {
          ...records[index],
          ...recordData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('yearwiseBalanceRecords', JSON.stringify(records));
        
        // Log audit trail
        await auditTrailService.log({
          module: 'Yearwise Balance',
          action: 'UPDATE',
          description: `Yearwise balance updated: ${records[index].recordNumber} - ${recordData.taxType}`,
          userName: 'Current User',
          details: {
            recordId: id,
            recordNumber: records[index].recordNumber,
            oldData: {
              taxType: oldData.taxType,
              totalDemand: oldData.totalDemand,
              totalCollection: oldData.totalCollection,
              collectionEfficiency: oldData.collectionEfficiency
            },
            newData: {
              taxType: recordData.taxType,
              totalDemand: recordData.totalDemand,
              totalCollection: recordData.totalCollection,
              collectionEfficiency: recordData.collectionEfficiency
            }
          }
        });
        
        window.dispatchEvent(new CustomEvent('yearwiseBalanceRecordsUpdated', { 
          detail: records 
        }));
        
        return {
          success: true,
          data: records[index],
          message: 'Yearwise balance record updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Yearwise balance record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update yearwise balance record'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      const recordToDelete = records.find(rec => rec.id === id);
      const filteredRecords = records.filter(rec => rec.id !== id);
      
      if (records.length !== filteredRecords.length) {
        localStorage.setItem('yearwiseBalanceRecords', JSON.stringify(filteredRecords));
        
        // Log audit trail
        if (recordToDelete) {
          await auditTrailService.log({
            module: 'Yearwise Balance',
            action: 'DELETE',
            description: `Yearwise balance deleted: ${recordToDelete.recordNumber} - ${recordToDelete.taxType}`,
            userName: 'Current User',
            details: {
              recordId: id,
              deletedData: {
                recordNumber: recordToDelete.recordNumber,
                taxType: recordToDelete.taxType,
                yearsCount: recordToDelete.yearsCount,
                totalDemand: recordToDelete.totalDemand,
                totalCollection: recordToDelete.totalCollection,
                collectionEfficiency: recordToDelete.collectionEfficiency
              }
            }
          });
        }
        
        window.dispatchEvent(new CustomEvent('yearwiseBalanceRecordsUpdated', { 
          detail: filteredRecords 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Yearwise balance record deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Yearwise balance record not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete yearwise balance record'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      const filtered = records.filter(record =>
        record.taxType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.balanceData?.some(entry => 
          entry.year?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Get analytics and summary
  getAnalytics: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      const analytics = {
        totalTaxTypes: records.length,
        overallDemand: records.reduce((sum, r) => sum + (r.totalDemand || 0), 0),
        overallCollection: records.reduce((sum, r) => sum + (r.totalCollection || 0), 0),
        overallBalance: records.reduce((sum, r) => sum + (r.totalBalance || 0), 0),
        averageCollectionEfficiency: 0,
        taxTypePerformance: {},
        yearlyTrends: {},
        collectionEfficiencyRanges: {
          excellent: 0, // >= 90%
          good: 0,      // 70-89%
          average: 0,   // 50-69%
          poor: 0       // < 50%
        },
        topPerformingTaxTypes: [],
        underPerformingTaxTypes: [],
        totalYearsCovered: 0,
        oldestYear: null,
        newestYear: null
      };
      
      // Calculate average collection efficiency
      if (records.length > 0) {
        analytics.averageCollectionEfficiency = 
          records.reduce((sum, r) => sum + (r.collectionEfficiency || 0), 0) / records.length;
      }
      
      // Tax type performance analysis
      records.forEach(record => {
        analytics.taxTypePerformance[record.taxType] = {
          demand: record.totalDemand || 0,
          collection: record.totalCollection || 0,
          balance: record.totalBalance || 0,
          efficiency: record.collectionEfficiency || 0,
          yearsCount: record.yearsCount || 0
        };
        
        // Categorize by efficiency
        const efficiency = record.collectionEfficiency || 0;
        if (efficiency >= 90) {
          analytics.collectionEfficiencyRanges.excellent++;
        } else if (efficiency >= 70) {
          analytics.collectionEfficiencyRanges.good++;
        } else if (efficiency >= 50) {
          analytics.collectionEfficiencyRanges.average++;
        } else {
          analytics.collectionEfficiencyRanges.poor++;
        }
        
        // Count total years and find date ranges
        if (record.balanceData && record.balanceData.length > 0) {
          analytics.totalYearsCovered += record.balanceData.length;
          
          record.balanceData.forEach(entry => {
            const year = entry.year;
            if (!analytics.oldestYear || year < analytics.oldestYear) {
              analytics.oldestYear = year;
            }
            if (!analytics.newestYear || year > analytics.newestYear) {
              analytics.newestYear = year;
            }
            
            // Yearly trends
            if (!analytics.yearlyTrends[year]) {
              analytics.yearlyTrends[year] = {
                totalDemand: 0,
                totalCollection: 0,
                totalBalance: 0,
                taxTypesCount: 0
              };
            }
            analytics.yearlyTrends[year].totalDemand += entry.demand || 0;
            analytics.yearlyTrends[year].totalCollection += entry.collection || 0;
            analytics.yearlyTrends[year].totalBalance += entry.balance || 0;
            analytics.yearlyTrends[year].taxTypesCount++;
          });
        }
      });
      
      // Top and under-performing tax types
      const sortedByEfficiency = records
        .map(r => ({
          taxType: r.taxType,
          efficiency: r.collectionEfficiency || 0,
          totalDemand: r.totalDemand || 0,
          totalCollection: r.totalCollection || 0,
          totalBalance: r.totalBalance || 0
        }))
        .sort((a, b) => b.efficiency - a.efficiency);
      
      analytics.topPerformingTaxTypes = sortedByEfficiency.slice(0, 3);
      analytics.underPerformingTaxTypes = sortedByEfficiency.slice(-3).reverse();
      
      return {
        success: true,
        data: analytics,
        message: 'Analytics generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate analytics'
      };
    }
  },

  // Get collection trends over time
  getCollectionTrends: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      const trends = {
        yearlyTrends: {},
        taxTypeTrends: {},
        collectionGrowth: {},
        demandGrowth: {},
        efficiencyTrends: {}
      };
      
      // Process each record's balance data
      records.forEach(record => {
        const taxType = record.taxType;
        
        if (!trends.taxTypeTrends[taxType]) {
          trends.taxTypeTrends[taxType] = [];
        }
        
        if (record.balanceData) {
          record.balanceData.forEach(entry => {
            const year = entry.year;
            
            // Yearly aggregated trends
            if (!trends.yearlyTrends[year]) {
              trends.yearlyTrends[year] = {
                totalDemand: 0,
                totalCollection: 0,
                totalBalance: 0,
                averageEfficiency: 0,
                taxTypesCount: 0
              };
            }
            
            trends.yearlyTrends[year].totalDemand += entry.demand || 0;
            trends.yearlyTrends[year].totalCollection += entry.collection || 0;
            trends.yearlyTrends[year].totalBalance += entry.balance || 0;
            trends.yearlyTrends[year].taxTypesCount++;
            
            // Tax type specific trends
            trends.taxTypeTrends[taxType].push({
              year: year,
              demand: entry.demand || 0,
              collection: entry.collection || 0,
              balance: entry.balance || 0,
              efficiency: entry.demand > 0 ? (entry.collection / entry.demand) * 100 : 0
            });
          });
        }
      });
      
      // Calculate average efficiency for each year
      Object.keys(trends.yearlyTrends).forEach(year => {
        const yearData = trends.yearlyTrends[year];
        if (yearData.totalDemand > 0) {
          yearData.averageEfficiency = (yearData.totalCollection / yearData.totalDemand) * 100;
        }
      });
      
      // Calculate growth rates
      const sortedYears = Object.keys(trends.yearlyTrends).sort();
      for (let i = 1; i < sortedYears.length; i++) {
        const currentYear = sortedYears[i];
        const previousYear = sortedYears[i - 1];
        
        const currentData = trends.yearlyTrends[currentYear];
        const previousData = trends.yearlyTrends[previousYear];
        
        trends.collectionGrowth[currentYear] = previousData.totalCollection > 0 
          ? ((currentData.totalCollection - previousData.totalCollection) / previousData.totalCollection) * 100
          : 0;
          
        trends.demandGrowth[currentYear] = previousData.totalDemand > 0 
          ? ((currentData.totalDemand - previousData.totalDemand) / previousData.totalDemand) * 100
          : 0;
          
        trends.efficiencyTrends[currentYear] = currentData.averageEfficiency - previousData.averageEfficiency;
      }
      
      return {
        success: true,
        data: trends,
        message: 'Collection trends retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to get collection trends'
      };
    }
  },

  // Get outstanding balances report
  getOutstandingBalances: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      const outstandingReport = {
        totalOutstanding: 0,
        taxTypeBreakdown: {},
        yearWiseOutstanding: {},
        criticalOutstanding: [], // > 5 years old
        recentOutstanding: [],   // <= 2 years old
        recoveryPotential: {
          high: [],    // Efficiency > 70%
          medium: [],  // Efficiency 40-70%
          low: []      // Efficiency < 40%
        }
      };
      
      const currentYear = new Date().getFullYear();
      
      records.forEach(record => {
        const taxType = record.taxType;
        let taxTypeOutstanding = 0;
        
        if (!outstandingReport.taxTypeBreakdown[taxType]) {
          outstandingReport.taxTypeBreakdown[taxType] = {
            totalBalance: 0,
            totalDemand: 0,
            efficiency: record.collectionEfficiency || 0,
            yearCount: 0
          };
        }
        
        if (record.balanceData) {
          record.balanceData.forEach(entry => {
            const balance = entry.balance || 0;
            const year = entry.year;
            const yearInt = parseInt(year.split('-')[0]);
            const ageInYears = currentYear - yearInt;
            
            if (balance > 0) {
              taxTypeOutstanding += balance;
              outstandingReport.totalOutstanding += balance;
              
              // Year-wise outstanding
              if (!outstandingReport.yearWiseOutstanding[year]) {
                outstandingReport.yearWiseOutstanding[year] = 0;
              }
              outstandingReport.yearWiseOutstanding[year] += balance;
              
              // Categorize by age
              const outstandingEntry = {
                taxType,
                year,
                balance,
                demand: entry.demand || 0,
                collection: entry.collection || 0,
                ageInYears
              };
              
              if (ageInYears > 5) {
                outstandingReport.criticalOutstanding.push(outstandingEntry);
              } else if (ageInYears <= 2) {
                outstandingReport.recentOutstanding.push(outstandingEntry);
              }
            }
          });
        }
        
        // Update tax type breakdown
        outstandingReport.taxTypeBreakdown[taxType].totalBalance = taxTypeOutstanding;
        outstandingReport.taxTypeBreakdown[taxType].totalDemand = record.totalDemand || 0;
        outstandingReport.taxTypeBreakdown[taxType].yearCount = record.yearsCount || 0;
        
        // Categorize recovery potential
        const efficiency = record.collectionEfficiency || 0;
        const recoveryEntry = {
          taxType,
          totalBalance: taxTypeOutstanding,
          totalDemand: record.totalDemand || 0,
          efficiency,
          yearsCount: record.yearsCount || 0
        };
        
        if (efficiency > 70) {
          outstandingReport.recoveryPotential.high.push(recoveryEntry);
        } else if (efficiency >= 40) {
          outstandingReport.recoveryPotential.medium.push(recoveryEntry);
        } else {
          outstandingReport.recoveryPotential.low.push(recoveryEntry);
        }
      });
      
      // Sort outstanding lists
      outstandingReport.criticalOutstanding.sort((a, b) => b.balance - a.balance);
      outstandingReport.recentOutstanding.sort((a, b) => b.balance - a.balance);
      
      return {
        success: true,
        data: outstandingReport,
        message: 'Outstanding balances report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate outstanding balances report'
      };
    }
  },

  // Export data to CSV format
  exportData: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      // Apply filters if provided
      if (params.taxType) {
        records = records.filter(rec => rec.taxType === params.taxType);
      }
      
      // Flatten the data for CSV export
      const csvData = [];
      records.forEach(record => {
        if (record.balanceData) {
          record.balanceData.forEach(entry => {
            csvData.push({
              recordNumber: record.recordNumber || '',
              taxType: record.taxType || '',
              year: entry.year || '',
              demand: entry.demand || 0,
              collection: entry.collection || 0,
              balance: entry.balance || 0,
              collectionPercentage: entry.demand > 0 ? ((entry.collection / entry.demand) * 100).toFixed(2) : 0,
              overallEfficiency: record.collectionEfficiency?.toFixed(2) || 0,
              createdDate: record.createdDate || ''
            });
          });
        }
      });
      
      // Convert to CSV format
      const csvHeaders = [
        'Record Number',
        'Tax Type',
        'Year',
        'Demand',
        'Collection',
        'Balance',
        'Collection %',
        'Overall Efficiency %',
        'Created Date'
      ];
      
      const csvRows = csvData.map(row => [
        row.recordNumber,
        row.taxType,
        row.year,
        row.demand,
        row.collection,
        row.balance,
        row.collectionPercentage,
        row.overallEfficiency,
        row.createdDate
      ]);
      
      const csvContent = [csvHeaders, ...csvRows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      return {
        success: true,
        data: {
          content: csvContent,
          filename: `yearwise_balance_${new Date().toISOString().split('T')[0]}.csv`,
          recordCount: csvData.length
        },
        message: `Export prepared successfully (${csvData.length} entries)`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to export data'
      };
    }
  }
};

// Helper function to generate yearwise balance record numbers
const generateYearwiseBalanceNumber = (taxType, sequence) => {
  const typeCode = {
    'Property Tax': 'PT',
    'Water Charges': 'WC',
    'Profession Tax': 'PFT',
    'MDR': 'MDR',
    'SWM User Charges': 'SWM',
    'UGD User Charges': 'UGD',
    'Trade License Fee': 'TLF',
    'Building Plan Approval Fee': 'BPA'
  };
  
  const prefix = typeCode[taxType] || 'YWB';
  const year = new Date().getFullYear().toString().slice(-2);
  const seq = String(sequence).padStart(3, '0');
  return `${prefix}${year}${seq}`;
};

// Sample data seeding function
export const seedYearwiseBalanceData = () => {
  const existingRecords = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
  
  if (existingRecords.length === 0) {
    const sampleRecords = [
      {
        id: 1,
        recordNumber: 'PT24001',
        taxType: 'Property Tax',
        balanceData: [
          { id: 1, slNo: 1, year: '2019-2020', demand: 2500000, collection: 2000000, balance: 500000 },
          { id: 2, slNo: 2, year: '2020-2021', demand: 2800000, collection: 2300000, balance: 500000 },
          { id: 3, slNo: 3, year: '2021-2022', demand: 3200000, collection: 2900000, balance: 300000 },
          { id: 4, slNo: 4, year: '2022-2023', demand: 3500000, collection: 3200000, balance: 300000 },
          { id: 5, slNo: 5, year: '2023-2024', demand: 3800000, collection: 3600000, balance: 200000 }
        ],
        totalDemand: 16800000,
        totalCollection: 14000000,
        totalBalance: 2800000,
        collectionEfficiency: 83.33,
        yearsCount: 5,
        createdDate: '2024-04-01',
        createdTime: '10:30:00'
      },
      {
        id: 2,
        recordNumber: 'WC24002',
        taxType: 'Water Charges',
        balanceData: [
          { id: 6, slNo: 1, year: '2020-2021', demand: 800000, collection: 650000, balance: 150000 },
          { id: 7, slNo: 2, year: '2021-2022', demand: 900000, collection: 750000, balance: 150000 },
          { id: 8, slNo: 3, year: '2022-2023', demand: 1000000, collection: 850000, balance: 150000 },
          { id: 9, slNo: 4, year: '2023-2024', demand: 1100000, collection: 950000, balance: 150000 }
        ],
        totalDemand: 3800000,
        totalCollection: 3200000,
        totalBalance: 600000,
        collectionEfficiency: 84.21,
        yearsCount: 4,
        createdDate: '2024-04-02',
        createdTime: '11:15:00'
      },
      {
        id: 3,
        recordNumber: 'MDR24003',
        taxType: 'MDR',
        balanceData: [
          { id: 10, slNo: 1, year: '2021-2022', demand: 1200000, collection: 1100000, balance: 100000 },
          { id: 11, slNo: 2, year: '2022-2023', demand: 1400000, collection: 1350000, balance: 50000 },
          { id: 12, slNo: 3, year: '2023-2024', demand: 1600000, collection: 1550000, balance: 50000 }
        ],
        totalDemand: 4200000,
        totalCollection: 4000000,
        totalBalance: 200000,
        collectionEfficiency: 95.24,
        yearsCount: 3,
        createdDate: '2024-04-03',
        createdTime: '14:20:00'
      },
      {
        id: 4,
        recordNumber: 'PFT24004',
        taxType: 'Profession Tax',
        balanceData: [
          { id: 13, slNo: 1, year: '2020-2021', demand: 500000, collection: 300000, balance: 200000 },
          { id: 14, slNo: 2, year: '2021-2022', demand: 600000, collection: 400000, balance: 200000 },
          { id: 15, slNo: 3, year: '2022-2023', demand: 700000, collection: 500000, balance: 200000 },
          { id: 16, slNo: 4, year: '2023-2024', demand: 800000, collection: 600000, balance: 200000 }
        ],
        totalDemand: 2600000,
        totalCollection: 1800000,
        totalBalance: 800000,
        collectionEfficiency: 69.23,
        yearsCount: 4,
        createdDate: '2024-04-04',
        createdTime: '09:45:00'
      },
      {
        id: 5,
        recordNumber: 'SWM24005',
        taxType: 'SWM User Charges',
        balanceData: [
          { id: 17, slNo: 1, year: '2022-2023', demand: 400000, collection: 320000, balance: 80000 },
          { id: 18, slNo: 2, year: '2023-2024', demand: 450000, collection: 380000, balance: 70000 }
        ],
        totalDemand: 850000,
        totalCollection: 700000,
        totalBalance: 150000,
        collectionEfficiency: 82.35,
        yearsCount: 2,
        createdDate: '2024-04-05',
        createdTime: '16:30:00'
      },
      {
        id: 6,
        recordNumber: 'UGD24006',
        taxType: 'UGD User Charges',
        balanceData: [
          { id: 19, slNo: 1, year: '2021-2022', demand: 300000, collection: 180000, balance: 120000 },
          { id: 20, slNo: 2, year: '2022-2023', demand: 350000, collection: 220000, balance: 130000 },
          { id: 21, slNo: 3, year: '2023-2024', demand: 400000, collection: 260000, balance: 140000 }
        ],
        totalDemand: 1050000,
        totalCollection: 660000,
        totalBalance: 390000,
        collectionEfficiency: 62.86,
        yearsCount: 3,
        createdDate: '2024-04-06',
        createdTime: '12:00:00'
      }
    ];
    
    localStorage.setItem('yearwiseBalanceRecords', JSON.stringify(sampleRecords));
    console.log('✅ Sample Yearwise Balance records seeded:', sampleRecords.length, 'records');
    
    // Add some audit trail entries
    const existingAuditTrail = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    const auditEntries = [
      {
        id: Date.now() + 3000,
        timestamp: new Date('2024-04-01T10:30:00').toISOString(),
        date: '2024-04-01',
        time: '10:30:00',
        module: 'Yearwise Balance',
        action: 'CREATE',
        description: 'Yearwise balance created: PT24001 - Property Tax',
        userName: 'Tax Administrator',
        details: {
          recordId: 1,
          recordNumber: 'PT24001',
          taxType: 'Property Tax',
          yearsCount: 5,
          totalDemand: 16800000,
          totalCollection: 14000000,
          collectionEfficiency: 83.33
        }
      },
      {
        id: Date.now() + 3001,
        timestamp: new Date('2024-04-03T14:20:00').toISOString(),
        date: '2024-04-03',
        time: '14:20:00',
        module: 'Yearwise Balance',
        action: 'CREATE',
        description: 'Yearwise balance created: MDR24003 - MDR',
        userName: 'Revenue Officer',
        details: {
          recordId: 3,
          recordNumber: 'MDR24003',
          taxType: 'MDR',
          yearsCount: 3,
          totalDemand: 4200000,
          totalCollection: 4000000,
          collectionEfficiency: 95.24
        }
      },
      {
        id: Date.now() + 3002,
        timestamp: new Date('2024-04-04T09:45:00').toISOString(),
        date: '2024-04-04',
        time: '09:45:00',
        module: 'Yearwise Balance',
        action: 'CREATE',
        description: 'Yearwise balance created: PFT24004 - Profession Tax',
        userName: 'Tax Administrator',
        details: {
          recordId: 4,
          recordNumber: 'PFT24004',
          taxType: 'Profession Tax',
          yearsCount: 4,
          totalDemand: 2600000,
          totalCollection: 1800000,
          collectionEfficiency: 69.23
        }
      }
    ];
    
    const updatedAuditTrail = [...existingAuditTrail, ...auditEntries];
    localStorage.setItem('auditTrail', JSON.stringify(updatedAuditTrail));
    console.log('✅ Sample Yearwise Balance audit entries seeded:', auditEntries.length, 'entries');
  } else {
    console.log(`ℹ️ Yearwise Balance records already exist: ${existingRecords.length} records`);
  }
};

// Yearwise Balance Analytics Service
export const yearwiseBalanceAnalyticsService = {
  getDashboardMetrics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      const metrics = {
        totalTaxTypes: records.length,
        totalDemand: records.reduce((sum, r) => sum + (r.totalDemand || 0), 0),
        totalCollection: records.reduce((sum, r) => sum + (r.totalCollection || 0), 0),
        totalOutstanding: records.reduce((sum, r) => sum + (r.totalBalance || 0), 0),
        averageEfficiency: 0,
        bestPerformingTax: null,
        worstPerformingTax: null,
        collectionTrend: 'stable', // up, down, stable
        recentCollectionGrowth: 0,
        criticalTaxTypes: [], // Efficiency < 50%
        excellentTaxTypes: [], // Efficiency >= 90%
        yearRange: { oldest: null, newest: null },
        monthlyProjections: {}
      };
      
      if (records.length > 0) {
        // Calculate average efficiency
        metrics.averageEfficiency = records.reduce((sum, r) => sum + (r.collectionEfficiency || 0), 0) / records.length;
        
        // Find best and worst performing tax types
        const sortedByEfficiency = [...records].sort((a, b) => (b.collectionEfficiency || 0) - (a.collectionEfficiency || 0));
        metrics.bestPerformingTax = sortedByEfficiency[0];
        metrics.worstPerformingTax = sortedByEfficiency[sortedByEfficiency.length - 1];
        
        // Categorize tax types by performance
        records.forEach(record => {
          const efficiency = record.collectionEfficiency || 0;
          if (efficiency < 50) {
            metrics.criticalTaxTypes.push(record);
          } else if (efficiency >= 90) {
            metrics.excellentTaxTypes.push(record);
          }
        });
        
        // Calculate year range
        let allYears = [];
        records.forEach(record => {
          if (record.balanceData) {
            record.balanceData.forEach(entry => {
              if (entry.year) allYears.push(entry.year);
            });
          }
        });
        
        if (allYears.length > 0) {
          allYears.sort();
          metrics.yearRange.oldest = allYears[0];
          metrics.yearRange.newest = allYears[allYears.length - 1];
        }
        
        // Simple trend analysis (comparing last 2 years if available)
        const currentYear = new Date().getFullYear();
        const lastYear = currentYear - 1;
        const previousYear = currentYear - 2;
        
        let currentYearCollection = 0;
        let lastYearCollection = 0;
        
        records.forEach(record => {
          if (record.balanceData) {
            record.balanceData.forEach(entry => {
              const entryYear = parseInt(entry.year.split('-')[0]);
              if (entryYear === lastYear) {
                currentYearCollection += entry.collection || 0;
              } else if (entryYear === previousYear) {
                lastYearCollection += entry.collection || 0;
              }
            });
          }
        });
        
        if (lastYearCollection > 0) {
          metrics.recentCollectionGrowth = ((currentYearCollection - lastYearCollection) / lastYearCollection) * 100;
          if (metrics.recentCollectionGrowth > 5) {
            metrics.collectionTrend = 'up';
          } else if (metrics.recentCollectionGrowth < -5) {
            metrics.collectionTrend = 'down';
          }
        }
        
        // Monthly projections based on historical data
        const monthlyAverage = metrics.totalCollection / 12; // Simple approximation
        for (let i = 1; i <= 12; i++) {
          const month = String(i).padStart(2, '0');
          metrics.monthlyProjections[month] = monthlyAverage;
        }
      }
      
      return {
        success: true,
        data: metrics,
        message: 'Dashboard metrics generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate dashboard metrics'
      };
    }
  },

  getCollectionEfficiencyReport: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const records = JSON.parse(localStorage.getItem('yearwiseBalanceRecords') || '[]');
      
      const report = {
        overallEfficiency: 0,
        taxTypeRanking: [],
        efficiencyDistribution: {
          excellent: [], // >= 90%
          good: [],      // 70-89%
          average: [],   // 50-69%
          poor: [],      // 30-49%
          critical: []   // < 30%
        },
        yearlyEfficiencyTrend: {},
        improvementOpportunities: [],
        benchmarkComparison: {
          aboveBenchmark: [],
          belowBenchmark: []
        }
      };
      
      const benchmark = 75; // 75% efficiency benchmark
      
      if (records.length > 0) {
        // Calculate overall efficiency
        const totalDemand = records.reduce((sum, r) => sum + (r.totalDemand || 0), 0);
        const totalCollection = records.reduce((sum, r) => sum + (r.totalCollection || 0), 0);
        report.overallEfficiency = totalDemand > 0 ? (totalCollection / totalDemand) * 100 : 0;
        
        // Tax type ranking by efficiency
        report.taxTypeRanking = records
          .map(record => ({
            taxType: record.taxType,
            efficiency: record.collectionEfficiency || 0,
            totalDemand: record.totalDemand || 0,
            totalCollection: record.totalCollection || 0,
            totalBalance: record.totalBalance || 0,
            yearsCount: record.yearsCount || 0
          }))
          .sort((a, b) => b.efficiency - a.efficiency);
        
        // Efficiency distribution
        records.forEach(record => {
          const efficiency = record.collectionEfficiency || 0;
          const taxData = {
            taxType: record.taxType,
            efficiency,
            totalBalance: record.totalBalance || 0,
            recommendedActions: generateRecommendations(efficiency, record.totalBalance)
          };
          
          if (efficiency >= 90) {
            report.efficiencyDistribution.excellent.push(taxData);
          } else if (efficiency >= 70) {
            report.efficiencyDistribution.good.push(taxData);
          } else if (efficiency >= 50) {
            report.efficiencyDistribution.average.push(taxData);
          } else if (efficiency >= 30) {
            report.efficiencyDistribution.poor.push(taxData);
          } else {
            report.efficiencyDistribution.critical.push(taxData);
          }
          
          // Benchmark comparison
          if (efficiency >= benchmark) {
            report.benchmarkComparison.aboveBenchmark.push(taxData);
          } else {
            report.benchmarkComparison.belowBenchmark.push(taxData);
          }
          
          // Improvement opportunities
          if (efficiency < benchmark) {
            const potentialImprovement = (benchmark - efficiency) / 100 * (record.totalDemand || 0);
            report.improvementOpportunities.push({
              taxType: record.taxType,
              currentEfficiency: efficiency,
              targetEfficiency: benchmark,
              potentialAdditionalCollection: potentialImprovement,
              priority: efficiency < 50 ? 'High' : efficiency < 70 ? 'Medium' : 'Low'
            });
          }
        });
        
        // Yearly efficiency trends
        const yearlyData = {};
        records.forEach(record => {
          if (record.balanceData) {
            record.balanceData.forEach(entry => {
              const year = entry.year;
              if (!yearlyData[year]) {
                yearlyData[year] = { totalDemand: 0, totalCollection: 0 };
              }
              yearlyData[year].totalDemand += entry.demand || 0;
              yearlyData[year].totalCollection += entry.collection || 0;
            });
          }
        });
        
        Object.keys(yearlyData).forEach(year => {
          const data = yearlyData[year];
          report.yearlyEfficiencyTrend[year] = data.totalDemand > 0 
            ? (data.totalCollection / data.totalDemand) * 100 
            : 0;
        });
        
        // Sort improvement opportunities by priority and potential
        report.improvementOpportunities.sort((a, b) => {
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
          if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }
          return b.potentialAdditionalCollection - a.potentialAdditionalCollection;
        });
      }
      
      return {
        success: true,
        data: report,
        message: 'Collection efficiency report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate collection efficiency report'
      };
    }
  }
};

// Helper function to generate recommendations based on efficiency and balance
const generateRecommendations = (efficiency, balance) => {
  const recommendations = [];
  
  if (efficiency < 30) {
    recommendations.push('Urgent review of collection processes required');
    recommendations.push('Consider outsourcing collection to specialized agencies');
    recommendations.push('Implement strict enforcement measures');
  } else if (efficiency < 50) {
    recommendations.push('Enhance collection monitoring systems');
    recommendations.push('Increase field collection activities');
    recommendations.push('Review and update penalty structures');
  } else if (efficiency < 70) {
    recommendations.push('Implement automated reminder systems');
    recommendations.push('Offer convenient payment options');
    recommendations.push('Conduct taxpayer awareness campaigns');
  } else if (efficiency < 90) {
    recommendations.push('Fine-tune existing collection processes');
    recommendations.push('Identify and address specific collection gaps');
  } else {
    recommendations.push('Maintain current excellent practices');
    recommendations.push('Share best practices with other tax types');
  }
  
  if (balance > 1000000) {
    recommendations.push('High balance amount requires special attention');
    recommendations.push('Consider settlement schemes for large defaulters');
  }
  
  return recommendations;
};

// Utility function to clear Yearwise Balance data
export const clearYearwiseBalanceData = () => {
  localStorage.removeItem('yearwiseBalanceRecords');
  console.log('🧹 Yearwise Balance data cleared from localStorage');
  return { success: true, message: 'Yearwise Balance data cleared successfully' };
};

// Auto-seed data when module is imported (uncomment to enable)
// console.log('🌱 Auto-seeding Yearwise Balance data...');
// seedYearwiseBalanceData();
export const dailyCollectionService = {
  getAll: async (params = {}) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      return {
        success: true,
        data: collections,
        message: 'Daily collections retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch daily collections'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const collection = collections.find(coll => coll.id === id);
      
      if (collection) {
        return {
          success: true,
          data: collection,
          message: 'Daily collection retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Daily collection not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch daily collection'
      };
    }
  },

  create: async (collectionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const newCollection = {
        ...collectionData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        createdTime: new Date().toISOString(),
        status: 'Active',
        mrNumber: `MR-${Date.now()}`, // Money Receipt Number
        balanced: Math.abs(collectionData.debitTotal - collectionData.creditTotal) < 0.01
      };
      
      collections.push(newCollection);
      localStorage.setItem('dailyCollections', JSON.stringify(collections));
      
      // Trigger update event
      window.dispatchEvent(new CustomEvent('dailyCollectionsUpdated', { 
        detail: collections 
      }));
      
      return {
        success: true,
        data: newCollection,
        message: 'Daily collection created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create daily collection'
      };
    }
  },

  update: async (id, collectionData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const index = collections.findIndex(coll => coll.id === id);
      
      if (index !== -1) {
        collections[index] = {
          ...collections[index],
          ...collectionData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0],
          balanced: Math.abs(collectionData.debitTotal - collectionData.creditTotal) < 0.01
        };
        
        localStorage.setItem('dailyCollections', JSON.stringify(collections));
        
        window.dispatchEvent(new CustomEvent('dailyCollectionsUpdated', { 
          detail: collections 
        }));
        
        return {
          success: true,
          data: collections[index],
          message: 'Daily collection updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Daily collection not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update daily collection'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const filteredCollections = collections.filter(coll => coll.id !== id);
      
      if (collections.length !== filteredCollections.length) {
        localStorage.setItem('dailyCollections', JSON.stringify(filteredCollections));
        
        window.dispatchEvent(new CustomEvent('dailyCollectionsUpdated', { 
          detail: filteredCollections 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Daily collection deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Daily collection not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete daily collection'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const filtered = collections.filter(coll =>
        coll.collectionDate?.includes(searchTerm) ||
        coll.fromWhom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coll.narration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coll.mrNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coll.entries?.some(entry => 
          entry.ledgerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.ledgerCode?.includes(searchTerm) ||
          entry.challanNo?.includes(searchTerm)
        )
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  getStats: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      
      const stats = {
        totalRecords: collections.length,
        totalDebitAmount: collections.reduce((sum, coll) => sum + (coll.debitTotal || 0), 0),
        totalCreditAmount: collections.reduce((sum, coll) => sum + (coll.creditTotal || 0), 0),
        balancedRecords: collections.filter(coll => coll.balanced).length,
        unbalancedRecords: collections.filter(coll => !coll.balanced).length,
        thisMonthRecords: collections.filter(coll => {
          const collDate = new Date(coll.collectionDate);
          const now = new Date();
          return collDate.getMonth() === now.getMonth() && collDate.getFullYear() === now.getFullYear();
        }).length,
        todayRecords: collections.filter(coll => coll.collectionDate === new Date().toISOString().split('T')[0]).length
      };
      
      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch statistics'
      };
    }
  },

  getByDateRange: async (startDate, endDate) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const filtered = collections.filter(coll => {
        const collDate = coll.collectionDate;
        return collDate >= startDate && collDate <= endDate;
      });
      
      return {
        success: true,
        data: filtered,
        message: 'Date range collections retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch collections by date range'
      };
    }
  },

  getByMonth: async (month, year) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const filtered = collections.filter(coll => {
        const collDate = new Date(coll.collectionDate);
        return collDate.getMonth() === (month - 1) && collDate.getFullYear() === year;
      });
      
      return {
        success: true,
        data: filtered,
        message: 'Monthly collections retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch monthly collections'
      };
    }
  },

  getSummary: async (date) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      const dayCollections = collections.filter(coll => coll.collectionDate === date);
      
      const summary = {
        date: date,
        totalRecords: dayCollections.length,
        totalDebit: dayCollections.reduce((sum, coll) => sum + (coll.debitTotal || 0), 0),
        totalCredit: dayCollections.reduce((sum, coll) => sum + (coll.creditTotal || 0), 0),
        totalEntries: dayCollections.reduce((sum, coll) => sum + (coll.entryCount || 0), 0),
        balancedRecords: dayCollections.filter(coll => coll.balanced).length,
        collections: dayCollections
      };
      
      return {
        success: true,
        data: summary,
        message: 'Daily summary retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch daily summary'
      };
    }
  },

  validateEntries: async (entries) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const debitTotal = entries.filter(e => e.type === 'debit').reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = entries.filter(e => e.type === 'credit').reduce((sum, e) => sum + e.amount, 0);
      const isBalanced = Math.abs(debitTotal - creditTotal) < 0.01;
      
      const validation = {
        isValid: isBalanced,
        debitTotal,
        creditTotal,
        difference: debitTotal - creditTotal,
        errors: []
      };
      
      if (!isBalanced) {
        validation.errors.push('Debit and Credit totals do not match');
      }
      
      if (entries.length === 0) {
        validation.errors.push('No entries provided');
        validation.isValid = false;
      }
      
      return {
        success: true,
        data: validation,
        message: 'Validation completed'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Validation failed'
      };
    }
  },

  getLedgerCodes: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Sample ledger codes - in real app, this would come from ledger service
      const ledgerCodes = [
        { code: '3059', name: 'Cash', type: 'Asset' },
        { code: '3060', name: 'State Bank of India', type: 'Asset' },
        { code: '3061', name: 'Canara Bank', type: 'Asset' },
        { code: '3062', name: 'Union Bank of India', type: 'Asset' },
        { code: '1001', name: 'Property Tax', type: 'Income' },
        { code: '1002', name: 'Water Charges', type: 'Income' },
        { code: '1003', name: 'Profession Tax', type: 'Income' },
        { code: '1004', name: 'Market Development Revenue', type: 'Income' },
        { code: '1005', name: 'SWM User Charges', type: 'Income' },
        { code: '1006', name: 'UGD User Charges', type: 'Income' },
        { code: '1007', name: 'Trade License Fee', type: 'Income' },
        { code: '1008', name: 'Building Plan Approval Fee', type: 'Income' },
        { code: '2001', name: 'Salary', type: 'Expense' },
        { code: '2002', name: 'Office Expenses', type: 'Expense' },
        { code: '2003', name: 'Maintenance Expenses', type: 'Expense' },
        { code: '2004', name: 'Electricity Charges', type: 'Expense' },
        { code: '2005', name: 'Telephone Charges', type: 'Expense' },
        { code: '4001', name: 'Advance to Contractors', type: 'Advance' },
        { code: '4002', name: 'Advance to Suppliers', type: 'Advance' },
        { code: '5001', name: 'Security Deposits', type: 'Deposit' },
        { code: '5002', name: 'Tender Deposits', type: 'Deposit' }
      ];
      
      return {
        success: true,
        data: ledgerCodes,
        message: 'Ledger codes retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch ledger codes'
      };
    }
  },

  getReport: async (reportType, params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const collections = JSON.parse(localStorage.getItem('dailyCollections') || '[]');
      let reportData = [];
      
      switch (reportType) {
        case 'daily':
          reportData = collections.filter(coll => 
            coll.collectionDate === params.date
          );
          break;
        case 'monthly':
          reportData = collections.filter(coll => {
            const collDate = new Date(coll.collectionDate);
            return collDate.getMonth() === (params.month - 1) && 
                   collDate.getFullYear() === params.year;
          });
          break;
        case 'ledger-wise':
          // Group by ledger codes
          const ledgerGroups = {};
          collections.forEach(coll => {
            coll.entries?.forEach(entry => {
              if (!ledgerGroups[entry.ledgerCode]) {
                ledgerGroups[entry.ledgerCode] = {
                  ledgerCode: entry.ledgerCode,
                  ledgerName: entry.ledgerName,
                  totalDebit: 0,
                  totalCredit: 0,
                  entries: []
                };
              }
              
              if (entry.type === 'debit') {
                ledgerGroups[entry.ledgerCode].totalDebit += entry.amount;
              } else {
                ledgerGroups[entry.ledgerCode].totalCredit += entry.amount;
              }
              
              ledgerGroups[entry.ledgerCode].entries.push({
                ...entry,
                collectionDate: coll.collectionDate,
                mrNumber: coll.mrNumber
              });
            });
          });
          reportData = Object.values(ledgerGroups);
          break;
        default:
          reportData = collections;
      }
      
      return {
        success: true,
        data: {
          reportType,
          params,
          data: reportData,
          generatedAt: new Date().toISOString(),
          totalRecords: reportData.length
        },
        message: 'Report generated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to generate report'
      };
    }
  }
};

// Mock Investment Service
// File: src/services/mockServices.js (add this to your existing mockServices file)

// Mock investment data
let mockInvestments = [
  {
    id: 1,
    investmentSerialNumber: 'INV-2024-001',
    investmentFileNumber: 'FN-2024-INV-001',
    financialYear: '2024-25',
    fundType: 'general_fund',
    fundName: 'General Development Fund',
    voucherNo: 'VCH-001',
    voucherDate: '2024-03-15',
    voucherType: 'payment',
    bankLedgerCode: 'BLC-001',
    bankAccountNumber: '1234567890',
    investmentAgainstLedgerCode: 'ILC-001',
    nameOfBank: 'State Bank of India',
    investorName: 'Municipal Corporation Delhi',
    investmentAmount: '1000000',
    rateOfInterest: '7.5',
    interestPayoutOption: 'quarterly',
    bondFdNumber: 'FD-12345',
    investmentDate: '2024-03-15',
    investmentPeriodFrom: '2024-03-15',
    investmentPeriodTo: '2025-03-15',
    nextRenewalDate: '2025-03-15',
    principleAmount: '1000000',
    interestAmount: '75000',
    maturityValue: '1075000',
    investmentMaturityDate: '2025-03-15',
    preMaturity: 'no',
    investmentStatus: 'live',
    remarks: 'Fixed deposit for infrastructure development',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 2,
    investmentSerialNumber: 'INV-2024-002',
    investmentFileNumber: 'FN-2024-INV-002',
    financialYear: '2024-25',
    fundType: 'infrastructure_fund',
    fundName: 'Infrastructure Development Fund',
    voucherNo: 'VCH-002',
    voucherDate: '2024-04-10',
    voucherType: 'payment',
    bankLedgerCode: 'BLC-002',
    bankAccountNumber: '0987654321',
    investmentAgainstLedgerCode: 'ILC-002',
    nameOfBank: 'HDFC Bank',
    investorName: 'Pune Municipal Corporation',
    investmentAmount: '2500000',
    rateOfInterest: '8.2',
    interestPayoutOption: 'half_yearly',
    bondFdNumber: 'FD-54321',
    investmentDate: '2024-04-10',
    investmentPeriodFrom: '2024-04-10',
    investmentPeriodTo: '2026-04-10',
    nextRenewalDate: '2026-04-10',
    principleAmount: '2500000',
    interestAmount: '410000',
    maturityValue: '2910000',
    investmentMaturityDate: '2026-04-10',
    preMaturity: 'yes',
    investmentStatus: 'live',
    remarks: 'Long-term investment for road development projects',
    createdAt: '2024-04-10T11:30:00Z',
    updatedAt: '2024-04-10T11:30:00Z'
  },
  {
    id: 3,
    investmentSerialNumber: 'INV-2023-015',
    investmentFileNumber: 'FN-2023-INV-015',
    financialYear: '2023-24',
    fundType: 'social_welfare_fund',
    fundName: 'Social Welfare Schemes Fund',
    voucherNo: 'VCH-015',
    voucherDate: '2023-12-20',
    voucherType: 'payment',
    bankLedgerCode: 'BLC-003',
    bankAccountNumber: '5555666677',
    investmentAgainstLedgerCode: 'ILC-003',
    nameOfBank: 'Punjab National Bank',
    investorName: 'Chennai Municipal Corporation',
    investmentAmount: '500000',
    rateOfInterest: '6.8',
    interestPayoutOption: 'annually',
    bondFdNumber: 'FD-99999',
    investmentDate: '2023-12-20',
    investmentPeriodFrom: '2023-12-20',
    investmentPeriodTo: '2024-12-20',
    nextRenewalDate: '2024-12-20',
    principleAmount: '500000',
    interestAmount: '34000',
    maturityValue: '534000',
    investmentMaturityDate: '2024-12-20',
    preMaturity: 'no',
    investmentStatus: 'closed',
    remarks: 'Investment completed and matured on schedule',
    createdAt: '2023-12-20T09:15:00Z',
    updatedAt: '2024-12-21T14:00:00Z'
  }
];

// Investment service functions
export const investmentService = {
  // Get all investments
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      return {
        success: true,
        data: mockInvestments,
        message: 'Investments retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve investments'
      };
    }
  },

  // Get investment by ID
  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const investment = mockInvestments.find(inv => inv.id === parseInt(id));
      
      if (investment) {
        return {
          success: true,
          data: investment,
          message: 'Investment retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Investment not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve investment'
      };
    }
  },

  // Create new investment
  create: async (investmentData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate validation
      if (!investmentData.investmentSerialNumber || !investmentData.fundName) {
        return {
          success: false,
          data: null,
          message: 'Required fields are missing'
        };
      }

      const newInvestment = {
        id: Math.max(...mockInvestments.map(inv => inv.id), 0) + 1,
        ...investmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockInvestments.push(newInvestment);
      
      return {
        success: true,
        data: newInvestment,
        message: 'Investment created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create investment'
      };
    }
  },

  // Update investment
  update: async (id, investmentData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const investmentIndex = mockInvestments.findIndex(inv => inv.id === parseInt(id));
      
      if (investmentIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Investment not found'
        };
      }

      const updatedInvestment = {
        ...mockInvestments[investmentIndex],
        ...investmentData,
        id: parseInt(id),
        updatedAt: new Date().toISOString()
      };

      mockInvestments[investmentIndex] = updatedInvestment;
      
      return {
        success: true,
        data: updatedInvestment,
        message: 'Investment updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update investment'
      };
    }
  },

  // Delete investment
  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const investmentIndex = mockInvestments.findIndex(inv => inv.id === parseInt(id));
      
      if (investmentIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Investment not found'
        };
      }

      const deletedInvestment = mockInvestments[investmentIndex];
      mockInvestments.splice(investmentIndex, 1);
      
      return {
        success: true,
        data: deletedInvestment,
        message: 'Investment deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete investment'
      };
    }
  },

  // Search investments
  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredInvestments = mockInvestments.filter(investment =>
        investment.investmentSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.investorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.nameOfBank?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredInvestments,
        message: `Found ${filteredInvestments.length} investments`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Search failed'
      };
    }
  },

  // Get investments by status
  getByStatus: async (status) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredInvestments = mockInvestments.filter(investment =>
        investment.investmentStatus === status
      );
      
      return {
        success: true,
        data: filteredInvestments,
        message: `Found ${filteredInvestments.length} investments with status: ${status}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter investments by status'
      };
    }
  },

  // Get investments by financial year
  getByFinancialYear: async (year) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredInvestments = mockInvestments.filter(investment =>
        investment.financialYear === year
      );
      
      return {
        success: true,
        data: filteredInvestments,
        message: `Found ${filteredInvestments.length} investments for FY: ${year}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter investments by financial year'
      };
    }
  },

  // Get investment statistics
  getStatistics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const totalInvestments = mockInvestments.length;
      const liveInvestments = mockInvestments.filter(inv => inv.investmentStatus === 'live').length;
      const closedInvestments = mockInvestments.filter(inv => inv.investmentStatus === 'closed').length;
      const partiallyClosedInvestments = mockInvestments.filter(inv => inv.investmentStatus === 'partially_closed').length;
      
      const totalInvestmentAmount = mockInvestments.reduce((sum, inv) => 
        sum + parseFloat(inv.investmentAmount || 0), 0
      );
      
      const totalMaturityValue = mockInvestments.reduce((sum, inv) => 
        sum + parseFloat(inv.maturityValue || 0), 0
      );
      
      return {
        success: true,
        data: {
          totalInvestments,
          liveInvestments,
          closedInvestments,
          partiallyClosedInvestments,
          totalInvestmentAmount,
          totalMaturityValue,
          averageInterestRate: mockInvestments.reduce((sum, inv) => 
            sum + parseFloat(inv.rateOfInterest || 0), 0
          ) / totalInvestments
        },
        message: 'Investment statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve investment statistics'
      };
    }
  }
};
// Mock Loan Service
// File: src/services/mockServices.js (add this to your existing mockServices file)

// Mock loan data
let mockLoans = [
  {
    id: 1,
    loanSerialNumber: 'LOAN-2024-001',
    loanFileNumber: 'LN-2024-001',
    financialYear: '2024-25',
    fundType: 'infrastructure_fund',
    fundName: 'Infrastructure Development Fund',
    voucherNo: 'VCH-LOAN-001',
    voucherDate: '2024-03-15',
    voucherType: 'payment',
    bankLedgerCode: 'BLC-LOAN-001',
    bankAccountNumber: '1234567890',
    loanAgainstLedgerCode: 'LAG-001',
    loanSanctionOrderDetails: 'Government Order No. GO-123/2024 dated 15-03-2024 for infrastructure development loan',
    loanSanctionDate: '2024-03-15',
    loanType: 'interest_loan',
    nameOfScheme: 'Smart City Development Scheme',
    nameOfWork: 'Road Infrastructure Development Phase-I',
    loanReceivedFrom: 'State Finance Commission',
    overallLoanAmount: '5000000',
    overallInterestAmount: '1250000',
    rateOfInterest: '5.5',
    loanPeriodYears: '10',
    loanPeriodMonths: '0',
    loanPayoutOption: 'monthly',
    principleInstallment: '41666.67',
    interestInstallment: '10416.67',
    noOfInstallments: '120',
    installmentStartDate: '2024-04-01',
    installmentEndDate: '2034-03-31',
    loanClosedDate: '',
    principleAmountWaiver: 'no',
    penalty: 'yes',
    penaltyRateOfInterest: '2.0',
    purposeOfLoan: 'Infrastructure development and road construction under Smart City Mission',
    loanStatus: 'live',
    remarks: 'Loan sanctioned for 10 years with monthly installments',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 2,
    loanSerialNumber: 'LOAN-2024-002',
    loanFileNumber: 'LN-2024-002',
    financialYear: '2024-25',
    fundType: 'social_welfare_fund',
    fundName: 'Social Welfare Development Fund',
    voucherNo: 'VCH-LOAN-002',
    voucherDate: '2024-05-20',
    voucherType: 'receipt',
    bankLedgerCode: 'BLC-LOAN-002',
    bankAccountNumber: '0987654321',
    loanAgainstLedgerCode: 'LAG-002',
    loanSanctionOrderDetails: 'Municipal Resolution No. MR-456/2024 for welfare scheme loan',
    loanSanctionDate: '2024-05-20',
    loanType: 'interest_free_loan',
    nameOfScheme: 'Housing for All Scheme',
    nameOfWork: 'Low-cost Housing Construction',
    loanReceivedFrom: 'Central Government',
    overallLoanAmount: '2000000',
    overallInterestAmount: '0',
    rateOfInterest: '0',
    loanPeriodYears: '5',
    loanPeriodMonths: '0',
    loanPayoutOption: 'quarterly',
    principleInstallment: '100000',
    interestInstallment: '0',
    noOfInstallments: '20',
    installmentStartDate: '2024-06-01',
    installmentEndDate: '2029-05-31',
    loanClosedDate: '',
    principleAmountWaiver: 'yes',
    penalty: 'no',
    penaltyRateOfInterest: '0',
    purposeOfLoan: 'Construction of affordable housing units for economically weaker sections',
    loanStatus: 'live',
    remarks: 'Interest-free loan with quarterly installments, partial waiver available',
    createdAt: '2024-05-20T11:30:00Z',
    updatedAt: '2024-05-20T11:30:00Z'
  },
  {
    id: 3,
    loanSerialNumber: 'LOAN-2023-015',
    loanFileNumber: 'LN-2023-015',
    financialYear: '2023-24',
    fundType: 'general_fund',
    fundName: 'General Development Fund',
    voucherNo: 'VCH-LOAN-015',
    voucherDate: '2023-10-10',
    voucherType: 'payment',
    bankLedgerCode: 'BLC-LOAN-003',
    bankAccountNumber: '5555666677',
    loanAgainstLedgerCode: 'LAG-003',
    loanSanctionOrderDetails: 'Bank Loan Agreement No. BLA-789/2023 for municipal operations',
    loanSanctionDate: '2023-10-10',
    loanType: 'interest_loan',
    nameOfScheme: 'Municipal Operations Support',
    nameOfWork: 'Equipment Purchase and Maintenance',
    loanReceivedFrom: 'State Bank of India',
    overallLoanAmount: '1000000',
    overallInterestAmount: '150000',
    rateOfInterest: '7.2',
    loanPeriodYears: '3',
    loanPeriodMonths: '0',
    loanPayoutOption: 'monthly',
    principleInstallment: '27777.78',
    interestInstallment: '4166.67',
    noOfInstallments: '36',
    installmentStartDate: '2023-11-01',
    installmentEndDate: '2026-10-31',
    loanClosedDate: '2024-08-15',
    principleAmountWaiver: 'no',
    penalty: 'no',
    penaltyRateOfInterest: '0',
    purposeOfLoan: 'Purchase of municipal equipment and machinery for operational efficiency',
    loanStatus: 'closed',
    remarks: 'Loan closed before maturity date with full settlement',
    createdAt: '2023-10-10T09:15:00Z',
    updatedAt: '2024-08-15T14:30:00Z'
  }
];

// Loan service functions
export const loanService = {
  // Get all loans
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockLoans,
        message: 'Loans retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve loans'
      };
    }
  },

  // Get loan by ID
  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const loan = mockLoans.find(loan => loan.id === parseInt(id));
      
      if (loan) {
        return {
          success: true,
          data: loan,
          message: 'Loan retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Loan not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve loan'
      };
    }
  },

  // Create new loan
  create: async (loanData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!loanData.loanSerialNumber || !loanData.fundName) {
        return {
          success: false,
          data: null,
          message: 'Required fields are missing'
        };
      }

      const newLoan = {
        id: Math.max(...mockLoans.map(loan => loan.id), 0) + 1,
        ...loanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockLoans.push(newLoan);
      
      return {
        success: true,
        data: newLoan,
        message: 'Loan created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create loan'
      };
    }
  },

  // Update loan
  update: async (id, loanData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const loanIndex = mockLoans.findIndex(loan => loan.id === parseInt(id));
      
      if (loanIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Loan not found'
        };
      }

      const updatedLoan = {
        ...mockLoans[loanIndex],
        ...loanData,
        id: parseInt(id),
        updatedAt: new Date().toISOString()
      };

      mockLoans[loanIndex] = updatedLoan;
      
      return {
        success: true,
        data: updatedLoan,
        message: 'Loan updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update loan'
      };
    }
  },

  // Delete loan
  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loanIndex = mockLoans.findIndex(loan => loan.id === parseInt(id));
      
      if (loanIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'Loan not found'
        };
      }

      const deletedLoan = mockLoans[loanIndex];
      mockLoans.splice(loanIndex, 1);
      
      return {
        success: true,
        data: deletedLoan,
        message: 'Loan deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete loan'
      };
    }
  },

  // Search loans
  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredLoans = mockLoans.filter(loan =>
        loan.loanSerialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanReceivedFrom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.nameOfScheme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredLoans,
        message: `Found ${filteredLoans.length} loans`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Search failed'
      };
    }
  },

  // Get loans by status
  getByStatus: async (status) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredLoans = mockLoans.filter(loan => loan.loanStatus === status);
      
      return {
        success: true,
        data: filteredLoans,
        message: `Found ${filteredLoans.length} loans with status: ${status}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter loans by status'
      };
    }
  },

  // Get loans by type
  getByType: async (type) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredLoans = mockLoans.filter(loan => loan.loanType === type);
      
      return {
        success: true,
        data: filteredLoans,
        message: `Found ${filteredLoans.length} ${type} loans`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter loans by type'
      };
    }
  },

  // Get loan statistics
  getStatistics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const totalLoans = mockLoans.length;
      const liveLoans = mockLoans.filter(loan => loan.loanStatus === 'live').length;
      const closedLoans = mockLoans.filter(loan => loan.loanStatus === 'closed').length;
      const partiallyClosedLoans = mockLoans.filter(loan => loan.loanStatus === 'partially_closed').length;
      
      const interestLoans = mockLoans.filter(loan => loan.loanType === 'interest_loan').length;
      const interestFreeLoans = mockLoans.filter(loan => loan.loanType === 'interest_free_loan').length;
      
      const totalLoanAmount = mockLoans.reduce((sum, loan) => 
        sum + parseFloat(loan.overallLoanAmount || 0), 0
      );
      
      const totalInterestAmount = mockLoans.reduce((sum, loan) => 
        sum + parseFloat(loan.overallInterestAmount || 0), 0
      );
      
      return {
        success: true,
        data: {
          totalLoans,
          liveLoans,
          closedLoans,
          partiallyClosedLoans,
          interestLoans,
          interestFreeLoans,
          totalLoanAmount,
          totalInterestAmount,
          averageInterestRate: mockLoans
            .filter(loan => loan.loanType === 'interest_loan')
            .reduce((sum, loan) => sum + parseFloat(loan.rateOfInterest || 0), 0) / interestLoans || 0
        },
        message: 'Loan statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve loan statistics'
      };
    }
  }
};
export const employeeService = {
  getAll: async (params = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      return {
        success: true,
        data: employees,
        message: 'Employees retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch employees'
      };
    }
  },

  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const employee = employees.find(emp => emp.id === id);
      
      if (employee) {
        return {
          success: true,
          data: employee,
          message: 'Employee retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Employee not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch employee'
      };
    }
  },

  create: async (employeeData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      
      // Check for duplicate employee ID
      const existingEmployee = employees.find(emp => emp.empId === employeeData.empId);
      if (existingEmployee) {
        return {
          success: false,
          data: null,
          message: 'Employee ID already exists'
        };
      }
      
      const newEmployee = {
        ...employeeData,
        id: Date.now(),
        createdDate: new Date().toISOString().split('T')[0],
        status: 'Active'
      };
      
      employees.push(newEmployee);
      localStorage.setItem('employees', JSON.stringify(employees));
      
      window.dispatchEvent(new CustomEvent('employeesUpdated', { 
        detail: employees 
      }));
      
      return {
        success: true,
        data: newEmployee,
        message: 'Employee created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create employee'
      };
    }
  },

  update: async (id, employeeData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const index = employees.findIndex(emp => emp.id === id);
      
      if (index !== -1) {
        // Check for duplicate employee ID (excluding current employee)
        const existingEmployee = employees.find(emp => 
          emp.empId === employeeData.empId && emp.id !== id
        );
        if (existingEmployee) {
          return {
            success: false,
            data: null,
            message: 'Employee ID already exists'
          };
        }
        
        employees[index] = {
          ...employees[index],
          ...employeeData,
          id: id,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
        
        localStorage.setItem('employees', JSON.stringify(employees));
        
        window.dispatchEvent(new CustomEvent('employeesUpdated', { 
          detail: employees 
        }));
        
        return {
          success: true,
          data: employees[index],
          message: 'Employee updated successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Employee not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update employee'
      };
    }
  },

  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const filteredEmployees = employees.filter(emp => emp.id !== id);
      
      if (employees.length !== filteredEmployees.length) {
        localStorage.setItem('employees', JSON.stringify(filteredEmployees));
        
        window.dispatchEvent(new CustomEvent('employeesUpdated', { 
          detail: filteredEmployees 
        }));
        
        return {
          success: true,
          data: null,
          message: 'Employee deleted successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'Employee not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete employee'
      };
    }
  },

  search: async (searchTerm, filters = {}) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const filtered = employees.filter(emp =>
        emp.empId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.section?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.pfCpsNo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filtered,
        message: 'Search completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Search failed'
      };
    }
  },

  // Additional methods specific to employee management
  getBySection: async (section) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const filtered = employees.filter(emp => emp.section === section);
      
      return {
        success: true,
        data: filtered,
        message: 'Employees by section retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch employees by section'
      };
    }
  },

  getByFundType: async (fundType) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const filtered = employees.filter(emp => emp.fundType === fundType);
      
      return {
        success: true,
        data: filtered,
        message: 'Employees by fund type retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to fetch employees by fund type'
      };
    }
  },

  validateEmpId: async (empId, excludeId = null) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const existing = employees.find(emp => 
        emp.empId === empId && (excludeId === null || emp.id !== excludeId)
      );
      
      return {
        success: true,
        data: { isValid: !existing, exists: !!existing },
        message: existing ? 'Employee ID already exists' : 'Employee ID is available'
      };
    } catch (error) {
      return {
        success: false,
        data: { isValid: false, exists: false },
        message: 'Validation failed'
      };
    }
  },

  // Bulk operations
  bulkCreate: async (employeesData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      const newEmployees = [];
      const errors = [];
      
      for (const employeeData of employeesData) {
        // Check for duplicate employee ID
        const existingEmployee = employees.find(emp => emp.empId === employeeData.empId) ||
                               newEmployees.find(emp => emp.empId === employeeData.empId);
        
        if (existingEmployee) {
          errors.push({
            empId: employeeData.empId,
            error: 'Employee ID already exists'
          });
          continue;
        }
        
        const newEmployee = {
          ...employeeData,
          id: Date.now() + Math.random(),
          createdDate: new Date().toISOString().split('T')[0],
          status: 'Active'
        };
        
        newEmployees.push(newEmployee);
      }
      
      employees.push(...newEmployees);
      localStorage.setItem('employees', JSON.stringify(employees));
      
      window.dispatchEvent(new CustomEvent('employeesUpdated', { 
        detail: employees 
      }));
      
      return {
        success: true,
        data: {
          created: newEmployees,
          errors: errors,
          totalCreated: newEmployees.length,
          totalErrors: errors.length
        },
        message: `Bulk create completed. ${newEmployees.length} employees created, ${errors.length} errors.`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Bulk create failed'
      };
    }
  },

  // Statistics
  getStatistics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const employees = JSON.parse(localStorage.getItem('employees') || '[]');
      
      const stats = {
        total: employees.length,
        active: employees.filter(emp => emp.status === 'Active').length,
        inactive: employees.filter(emp => emp.status === 'Inactive').length,
        bySections: {},
        byFundTypes: {},
        recentlyAdded: employees.filter(emp => {
          const createdDate = new Date(emp.createdDate);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdDate >= thirtyDaysAgo;
        }).length
      };
      
      // Group by sections
      employees.forEach(emp => {
        stats.bySections[emp.section] = (stats.bySections[emp.section] || 0) + 1;
      });
      
      // Group by fund types
      employees.forEach(emp => {
        stats.byFundTypes[emp.fundType] = (stats.byFundTypes[emp.fundType] || 0) + 1;
      });
      
      return {
        success: true,
        data: stats,
        message: 'Statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to fetch statistics'
      };
    }
  }}
// Mock SFC Grant Service
// File: src/services/mockServices.js (add this to your existing mockServices file)

// Mock SFC grant data
let mockSFCGrants = [
  {
    id: 1,
    financialYear: '2024-25',
    fundType: 'sfc_fund',
    fundName: 'State Finance Commission Grant Fund',
    voucherNo: 'SFC-BRV-2024-001',
    voucherDate: '2024-04-15',
    voucherType: 'BRV',
    transactionType: 'cheque',
    transactionDate: '2024-04-15',
    referenceNoAndDate: 'SFC/Grant/2024/001 dated 10-04-2024',
    year: '2024',
    periodOf: 'Quarter 1 (Apr-Jun 2024)',
    grossAmount: '2500000.00',
    deductionAmount: '125000.00',
    netAmount: '2375000.00',
    adjustmentDate: '2024-04-20',
    remarks: 'SFC grant for infrastructure development - Q1 release with 5% administrative charges deducted',
    createdAt: '2024-04-15T10:30:00Z',
    updatedAt: '2024-04-20T14:15:00Z'
  },
  {
    id: 2,
    financialYear: '2024-25',
    fundType: 'property_transfer_fund',
    fundName: 'Property Transfer Duty Collection Fund',
    voucherNo: 'PTD-GJV-2024-002',
    voucherDate: '2024-05-10',
    voucherType: 'GJV',
    transactionType: 'dd',
    transactionDate: '2024-05-10',
    referenceNoAndDate: 'RTO/PTD/2024/REF-456 dated 05-05-2024',
    year: '2024',
    periodOf: 'Month of April 2024',
    grossAmount: '850000.00',
    deductionAmount: '42500.00',
    netAmount: '807500.00',
    adjustmentDate: '2024-05-15',
    remarks: 'Duty on transfer of property collected in April 2024, service charges deducted as per agreement',
    createdAt: '2024-05-10T09:45:00Z',
    updatedAt: '2024-05-15T16:20:00Z'
  },
  {
    id: 3,
    financialYear: '2023-24',
    fundType: 'sfc_fund',
    fundName: 'State Finance Commission Supplementary Grant',
    voucherNo: 'SFC-ADBRV-2024-003',
    voucherDate: '2024-03-20',
    voucherType: 'ADBRV',
    transactionType: 'ecs',
    transactionDate: '2024-03-20',
    referenceNoAndDate: 'SFC/SUPP/2023-24/789 dated 15-03-2024',
    year: '2024',
    periodOf: 'Supplementary Grant FY 2023-24',
    grossAmount: '1200000.00',
    deductionAmount: '0.00',
    netAmount: '1200000.00',
    adjustmentDate: '2024-03-25',
    remarks: 'Supplementary grant for FY 2023-24 without any deductions, released through ECS',
    createdAt: '2024-03-20T11:00:00Z',
    updatedAt: '2024-03-25T10:30:00Z'
  },
  {
    id: 4,
    financialYear: '2024-25',
    fundType: 'development_fund',
    fundName: 'Urban Development Grant Fund',
    voucherNo: 'UDG-PJV-2024-004',
    voucherDate: '2024-06-01',
    voucherType: 'PJV',
    transactionType: 'cash',
    transactionDate: '2024-06-01',
    referenceNoAndDate: 'UDD/Grant/2024/UDG-101 dated 28-05-2024',
    year: '2024',
    periodOf: 'Special Development Project - Phase 1',
    grossAmount: '500000.00',
    deductionAmount: '25000.00',
    netAmount: '475000.00',
    adjustmentDate: '',
    remarks: 'Urban development grant for special projects, processing fee deducted',
    createdAt: '2024-06-01T08:15:00Z',
    updatedAt: '2024-06-01T08:15:00Z'
  },
  {
    id: 5,
    financialYear: '2024-25',
    fundType: 'property_transfer_fund',
    fundName: 'Stamp Duty and Registration Fund',
    voucherNo: 'SDR-CJV-2024-005',
    voucherDate: '2024-07-12',
    voucherType: 'CJV',
    transactionType: 'others',
    transactionDate: '2024-07-12',
    referenceNoAndDate: 'SDR/COLL/2024/July/REF-890 dated 08-07-2024',
    year: '2024',
    periodOf: 'July 2024 Collections',
    grossAmount: '675000.00',
    deductionAmount: '33750.00',
    netAmount: '641250.00',
    adjustmentDate: '2024-07-18',
    remarks: 'Stamp duty and registration fee collections for July 2024 with standard deductions',
    createdAt: '2024-07-12T13:20:00Z',
    updatedAt: '2024-07-18T15:45:00Z'
  }
];

// SFC Grant service functions
export const sfcGrantService = {
  // Get all grants
  getAll: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        data: mockSFCGrants,
        message: 'SFC grants retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve SFC grants'
      };
    }
  },

  // Get grant by ID
  getById: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const grant = mockSFCGrants.find(grant => grant.id === parseInt(id));
      
      if (grant) {
        return {
          success: true,
          data: grant,
          message: 'SFC grant retrieved successfully'
        };
      } else {
        return {
          success: false,
          data: null,
          message: 'SFC grant not found'
        };
      }
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve SFC grant'
      };
    }
  },

  // Create new grant
  create: async (grantData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!grantData.voucherNo || !grantData.fundName || !grantData.grossAmount) {
        return {
          success: false,
          data: null,
          message: 'Required fields are missing'
        };
      }

      // Calculate net amount if not provided
      const grossAmount = parseFloat(grantData.grossAmount) || 0;
      const deductionAmount = parseFloat(grantData.deductionAmount) || 0;
      const netAmount = grossAmount - deductionAmount;

      const newGrant = {
        id: Math.max(...mockSFCGrants.map(grant => grant.id), 0) + 1,
        ...grantData,
        netAmount: netAmount.toFixed(2),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      mockSFCGrants.push(newGrant);
      
      return {
        success: true,
        data: newGrant,
        message: 'SFC grant created successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create SFC grant'
      };
    }
  },

  // Update grant
  update: async (id, grantData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const grantIndex = mockSFCGrants.findIndex(grant => grant.id === parseInt(id));
      
      if (grantIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'SFC grant not found'
        };
      }

      // Recalculate net amount
      const grossAmount = parseFloat(grantData.grossAmount) || 0;
      const deductionAmount = parseFloat(grantData.deductionAmount) || 0;
      const netAmount = grossAmount - deductionAmount;

      const updatedGrant = {
        ...mockSFCGrants[grantIndex],
        ...grantData,
        id: parseInt(id),
        netAmount: netAmount.toFixed(2),
        updatedAt: new Date().toISOString()
      };

      mockSFCGrants[grantIndex] = updatedGrant;
      
      return {
        success: true,
        data: updatedGrant,
        message: 'SFC grant updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update SFC grant'
      };
    }
  },

  // Delete grant
  delete: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const grantIndex = mockSFCGrants.findIndex(grant => grant.id === parseInt(id));
      
      if (grantIndex === -1) {
        return {
          success: false,
          data: null,
          message: 'SFC grant not found'
        };
      }

      const deletedGrant = mockSFCGrants[grantIndex];
      mockSFCGrants.splice(grantIndex, 1);
      
      return {
        success: true,
        data: deletedGrant,
        message: 'SFC grant deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to delete SFC grant'
      };
    }
  },

  // Search grants
  search: async (searchTerm) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredGrants = mockSFCGrants.filter(grant =>
        grant.voucherNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.fundName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.referenceNoAndDate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.voucherType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredGrants,
        message: `Found ${filteredGrants.length} SFC grants`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Search failed'
      };
    }
  },

  // Get grants by financial year
  getByFinancialYear: async (year) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredGrants = mockSFCGrants.filter(grant => grant.financialYear === year);
      
      return {
        success: true,
        data: filteredGrants,
        message: `Found ${filteredGrants.length} grants for FY: ${year}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter grants by financial year'
      };
    }
  },

  // Get grants by fund type
  getByFundType: async (fundType) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredGrants = mockSFCGrants.filter(grant => grant.fundType === fundType);
      
      return {
        success: true,
        data: filteredGrants,
        message: `Found ${filteredGrants.length} grants for fund type: ${fundType}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter grants by fund type'
      };
    }
  },

  // Get grants by voucher type
  getByVoucherType: async (voucherType) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const filteredGrants = mockSFCGrants.filter(grant => grant.voucherType === voucherType);
      
      return {
        success: true,
        data: filteredGrants,
        message: `Found ${filteredGrants.length} grants for voucher type: ${voucherType}`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter grants by voucher type'
      };
    }
  },

  // Get grant statistics
  getStatistics: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const totalGrants = mockSFCGrants.length;
      
      const totalGrossAmount = mockSFCGrants.reduce((sum, grant) => 
        sum + parseFloat(grant.grossAmount || 0), 0
      );
      
      const totalDeductionAmount = mockSFCGrants.reduce((sum, grant) => 
        sum + parseFloat(grant.deductionAmount || 0), 0
      );
      
      const totalNetAmount = mockSFCGrants.reduce((sum, grant) => 
        sum + parseFloat(grant.netAmount || 0), 0
      );

      // Group by fund type
      const fundTypeStats = mockSFCGrants.reduce((acc, grant) => {
        const type = grant.fundType;
        if (!acc[type]) {
          acc[type] = { count: 0, totalAmount: 0 };
        }
        acc[type].count++;
        acc[type].totalAmount += parseFloat(grant.netAmount || 0);
        return acc;
      }, {});

      // Group by voucher type
      const voucherTypeStats = mockSFCGrants.reduce((acc, grant) => {
        const type = grant.voucherType;
        if (!acc[type]) {
          acc[type] = { count: 0, totalAmount: 0 };
        }
        acc[type].count++;
        acc[type].totalAmount += parseFloat(grant.netAmount || 0);
        return acc;
      }, {});

      // Group by transaction type
      const transactionTypeStats = mockSFCGrants.reduce((acc, grant) => {
        const type = grant.transactionType;
        if (!acc[type]) {
          acc[type] = { count: 0, totalAmount: 0 };
        }
        acc[type].count++;
        acc[type].totalAmount += parseFloat(grant.netAmount || 0);
        return acc;
      }, {});
      
      return {
        success: true,
        data: {
          totalGrants,
          totalGrossAmount,
          totalDeductionAmount,
          totalNetAmount,
          averageGrantAmount: totalNetAmount / totalGrants,
          averageDeductionPercentage: (totalDeductionAmount / totalGrossAmount) * 100,
          fundTypeStats,
          voucherTypeStats,
          transactionTypeStats
        },
        message: 'SFC grant statistics retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve SFC grant statistics'
      };
    }
  },

  // Get grants by date range
  getByDateRange: async (startDate, endDate) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const filteredGrants = mockSFCGrants.filter(grant => {
        const grantDate = new Date(grant.voucherDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return grantDate >= start && grantDate <= end;
      });
      
      return {
        success: true,
        data: filteredGrants,
        message: `Found ${filteredGrants.length} grants in the specified date range`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to filter grants by date range'
      };
    }
  },

  // Get monthly summary
  getMonthlySummary: async (year) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const yearGrants = mockSFCGrants.filter(grant => 
        grant.year === year.toString()
      );
      
      const monthlySummary = yearGrants.reduce((acc, grant) => {
        const month = new Date(grant.voucherDate).getMonth();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthKey = monthNames[month];
        
        if (!acc[monthKey]) {
          acc[monthKey] = {
            count: 0,
            grossAmount: 0,
            deductionAmount: 0,
            netAmount: 0
          };
        }
        
        acc[monthKey].count++;
        acc[monthKey].grossAmount += parseFloat(grant.grossAmount || 0);
        acc[monthKey].deductionAmount += parseFloat(grant.deductionAmount || 0);
        acc[monthKey].netAmount += parseFloat(grant.netAmount || 0);
        
        return acc;
      }, {});
      
      return {
        success: true,
        data: monthlySummary,
        message: `Monthly summary for year ${year} retrieved successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve monthly summary'
      };
    }
  },

  // Bulk update grants
  bulkUpdate: async (ids, updateData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedGrants = [];
      
      ids.forEach(id => {
        const grantIndex = mockSFCGrants.findIndex(grant => grant.id === parseInt(id));
        if (grantIndex !== -1) {
          // Recalculate net amount if gross or deduction amount is being updated
          let netAmount = mockSFCGrants[grantIndex].netAmount;
          if (updateData.grossAmount || updateData.deductionAmount) {
            const gross = parseFloat(updateData.grossAmount || mockSFCGrants[grantIndex].grossAmount);
            const deduction = parseFloat(updateData.deductionAmount || mockSFCGrants[grantIndex].deductionAmount);
            netAmount = (gross - deduction).toFixed(2);
          }
          
          mockSFCGrants[grantIndex] = {
            ...mockSFCGrants[grantIndex],
            ...updateData,
            netAmount,
            updatedAt: new Date().toISOString()
          };
          updatedGrants.push(mockSFCGrants[grantIndex]);
        }
      });
      
      return {
        success: true,
        data: updatedGrants,
        message: `${updatedGrants.length} grants updated successfully`
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Bulk update failed'
      };
    }
  }
};
