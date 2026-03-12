# Service JSON Payloads Documentation

This document provides sample JSON payloads for each component in the system. Mandatory fields are marked (**\***).

---

## Global Configuration

### Base URL
```
https://accural.onrender.com/api
```
All endpoints below are relative to this base URL.

### Authentication
Every request (except login) must include this header:
```
Authorization: Bearer <jwt_token>
```
The token is obtained from the login response and stored as `authToken` in the client.

### Standard Response Envelope
All API responses return this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```
- `success` — `true` or `false`
- `data` — the actual payload (object or array)
- `message` — human-readable status or error description

### Standard Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Error description here"
}
```

| HTTP Status | Meaning                        |
|-------------|-------------------------------|
| 200         | Success                        |
| 201         | Created successfully           |
| 400         | Validation error / Bad request |
| 401         | Unauthorized (invalid/missing token) |
| 403         | Forbidden (insufficient permission) |
| 404         | Record not found               |
| 500         | Internal server error          |

### Standard CRUD Endpoints Pattern
For most services, the pattern is:
| Operation   | Method | Endpoint              |
|-------------|--------|-----------------------|
| List all    | GET    | `/resource`           |
| Get one     | GET    | `/resource/:id`       |
| Create      | POST   | `/resource`           |
| Update      | PUT    | `/resource/:id`       |
| Delete      | DELETE | `/resource/:id`       |
| Search      | GET    | `/resource/search?q=` |

---

## Global Workspace Scoping (NEW)

To support the institution and fund-based workspace selection, **every** data-retrieval and data-submission request now includes scoping parameters.

### 1. Data Retrieval (Filtering)
All `GET` endpoints for lists, reports, registers, and statements now include these query parameters:
- `institutionId`: (String/UUID) The ID of the currently selected institution.
- `fundIds[]`: (Array) A list of selected fund IDs.

**Example Request:**
`GET /api/bank-payments?institutionId=INST001&fundIds=1&fundIds=2`

### 2. Data Submission (Association)
All `POST` (Create) and `PUT` (Update) endpoints now include the `institutionId` in the JSON body to correctly associate the record.

**Common Payload Addition:**
```json
{
  "institutionId": "INST-001",
  ...rest of the data
}
```

---

---

## 1. Institution Creation
**File:** [InstitutionCreation.jsx](file:///d:/Accrual/accrual/src/pages/master/InstitutionCreation.jsx)
**Service:** `institutionService`
**Endpoint:** `/institutions`

### [FETCH] GET `/institutions`
Query parameters (all optional):
```
GET /institutions
GET /institutions?q=searchterm
GET /institutions?page=1&limit=20
```
Response `data` is an array of institution objects.

### [GET ONE] GET `/institutions/:id`
Returns a single institution object.

### [CREATE] POST `/institutions`
```json
{
  "institutionId*": "INST-001",
  "institutionName*": "Global Education Institute",
  "mailingName": "GEI Main Campus",
  "address*": "123 Academic Way, City, State",
  "state*": "Tamil Nadu",
  "country*": "India",
  "pincode*": "600001",
  "localBodyType*": "municipal_corporation",
  "telephone": "044-23456789",
  "alternateTelephone": "",
  "mobileNo*": "9876543210",
  "alternateMobileNo": "",
  "email*": "info@gei.edu",
  "panNo*": "ABCDE1234F",
  "gstNo": "33ABCDE1234F1Z5"
}
```

---

## 2. Group Creation
**File:** [GroupCreation.jsx](file:///d:/Accrual/accrual/src/pages/master/GroupCreation.jsx)
**Service:** `groupService`
**Endpoint:** `/groups`

### [FETCH] GET `/groups`
```
GET /groups
GET /groups?q=searchterm
GET /groups?mainGroup=Assets
```
Special fetch endpoints:
- `GET /groups/by-main-group?mainGroup=Assets` — groups under a specific main group
- `GET /groups/main-groups-summary` — summary of all main groups

### [GET ONE] GET `/groups/:id`

### [CREATE] POST `/groups`
Regular Group Payload:
```json
{
  "groupCode*": "CURR_ASSETS",
  "groupName*": "Current Assets",
  "underMainGroup*": "Assets",
  "description": "Group for current assets",
  "isMainGroup": false,
  "isSubGroup": false
}
```

### [CREATE] Sub Group Payload
```json
{
  "groupCode*": "CASH_HAND",
  "groupName*": "Cash in Hand",
  "underMainGroup*": "Assets",
  "underGroup*": "Current Assets",
  "description": "Sub-group for cash balances",
  "isMainGroup": false,
  "isSubGroup*": true 
}
```
> [!NOTE]
> For a Sub Group, `isSubGroup` must be `true`, and `underGroup` should specify the parent group name.

---

## 3. Master Ledger Creation
**File:** [MasterLedgerCreation.jsx](file:///d:/Accrual/accrual/src/pages/master/MasterLedgerCreation.jsx)
**Service:** `ledgerService`
**Endpoint:** `/ledgers`

### [FETCH] GET `/ledgers`
```
GET /ledgers
GET /ledgers?q=searchterm
GET /ledgers?underGroup=Bank Account
```

### [GET ONE] GET `/ledgers/:id`

### [CREATE] POST `/ledgers`
Payload (Bank Account Example):
```json
{
  "ledgerCode*": "SBI_123",
  "ledgerName*": "SBI Main Account",
  "underGroup*": "Bank Account",
  "institutionId*": "INST-001",
  "fundId*": "FUND-001",
  "accountHoldersName*": "Municipal Commissioner",
  "accountNo*": "12345678901",
  "ifscCode*": "SBIN0001234",
  "bankName*": "State Bank of India",
  "branchName*": "Main Branch",
  "nameOfScheme": "General Fund"
}
```


---

## 4. Employee Creation
**File:** [EmployeeCreation.jsx](file:///d:/Accrual/accrual/src/pages/master/EmployeeCreation.jsx)
**Service:** `employeeService`
**Endpoint:** `/employees`

### [FETCH] GET `/employees`
```
GET /employees
GET /employees?q=searchterm
GET /employees?section=finance
GET /employees?fundType=1
```

### [GET ONE] GET `/employees/:id`

### [CREATE] POST `/employees`
```json
{
  "empId*": "EMP101",
  "employeeName*": "John Doe",
  "designation*": "Accountant",
  "section*": "finance",
  "fundType*": "1",
  "pfCpsNo*": "PF123456"
}
```

---

## 5. Voucher Type Creation
**File:** [VoucherTypeCreation.jsx](file:///d:/Accrual/accrual/src/pages/master/VoucherTypeCreation.jsx)
**Service:** `voucherTypeService`
**Endpoint:** `/voucher-types`

### [FETCH] GET `/voucher-types`
```
GET /voucher-types
GET /voucher-types?q=searchterm
```

### [GET ONE] GET `/voucher-types/:id`

### [CREATE] POST `/voucher-types`
```json
{
  "voucherName*": "Payment Voucher",
  "alias*": "PV",
  "selectTypeOfVoucher*": "Payment",
  "abbreviation": "PAY",
  "numberingMethod": "Auto",
  "startingNumber": "1",
  "prefix": "PV-",
  "suffix": "/2024",
  "isActive": true,
  "description": "General payment voucher for daily operations"
}
```


---

## 6. Opening Balance
**File:** [OpeningBalance.jsx](file:///d:/Accrual/accrual/src/pages/master/OpeningBalance.jsx)
**Service:** `openingBalanceService`
**Endpoint:** `/opening-balances`

### [FETCH] GET `/opening-balances`
```
GET /opening-balances
GET /opening-balances?q=searchterm
GET /opening-balances/summary
```

### [GET ONE] GET `/opening-balances/:id`

### [CREATE] POST `/opening-balances`
```json
{
  "entries*": [
    {
      "ledgerCode*": "1001",
      "ledgerHead*": "Cash in Hand",
      "type*": "Debit",
      "amount*": 50000.0
    }
  ],
  "debitTotal*": 50000.0,
  "creditTotal*": 0.0,
  "isBalanced": false,
  "difference": 50000.0,
  "balanceStatus": "Unbalanced",
  "description": "Opening Balance Setup",
  "status": "Active"
}
```

---

## 7. Yearwise Balance
**File:** [YearwiseBalance.jsx](file:///d:/Accrual/accrual/src/pages/master/YearwiseBalance.jsx)
**Service:** `yearwiseBalanceService`
**Endpoint:** `/yearwise-balance`

### [FETCH] GET `/yearwise-balance`
```
GET /yearwise-balance
GET /yearwise-balance?q=searchterm
GET /yearwise-balance?fundType=Educational Fund
GET /yearwise-balance/analytics
GET /yearwise-balance/collection-trends
GET /yearwise-balance/outstanding-balances
```

### [GET ONE] GET `/yearwise-balance/:id`

### [CREATE] POST `/yearwise-balance`
```json
{
  "fundType*": "Educational Fund",
  "taxType*": "Property Tax",
  "balanceData*": [
    {
      "year*": "2023-2024",
      "demand*": 10000.0,
      "collection": 8000.0,
      "balance": 2000.0
    }
  ],
  "totalDemand": 10000.0,
  "totalCollection": 8000.0,
  "totalBalance": 2000.0,
  "collectionEfficiency": 80.0,
  "yearsCount": 1
}
```

---

## 8. MDR Details
**File:** [MDRDetails.jsx](file:///d:/Accrual/accrual/src/pages/master/MDRDetails.jsx)
**Service:** `mdrService`
**Endpoint:** `/mdr`

### [FETCH] GET `/mdr`
```
GET /mdr
GET /mdr?q=searchterm
GET /mdr?financialYear=2024-25
GET /mdr/summary
GET /mdr/upcoming-renewals?days=90
GET /mdr/revenue-projections
```

### [GET ONE] GET `/mdr/:id`

### [CREATE] POST `/mdr`
```json
{
  "leaseNo*": "L-2024-001",
  "assessmentNo*": "MDR-001",
  "financialYear*": "2024-25",
  "ledgerCode*": "L001",
  "ledgerName*": "Market Fee Ledger",
  "leasePropertyDetails*": "Shop No 12, Main Market",
  "leasePeriod*": "11 Months",
  "leaseFromDate*": "2024-04-01",
  "leaseToDate*": "2025-02-28",
  "nextRenewalDate": "2025-03-01",
  "lesseeName*": "John Smith",
  "lesseeAddress*": "123 Market Road, City",
  "depositAmount*": 50000.0,
  "depositChallanDetails": "CH-998877",
  "monthlyInstallment*": 5000.0,
  "totalDemandPerYear*": 55000.0,
  "gstPercentage": 18.0,
  "ITPercentage": 2.0,
  "gstReceivable": 9900.0,
  "itReceivable": 1100.0
}
```

---

## 9. Payable Details
**File:** [PayableDetails.jsx](file:///d:/Accrual/accrual/src/pages/master/PayableDetails.jsx)
**Service:** `payableService`
**Endpoint:** `/payables`

### [FETCH] GET `/payables`
```
GET /payables
GET /payables?q=searchterm
GET /payables?financialYear=2024-25&status=Pending
GET /payables/summary
GET /payables/overdue
GET /payables/analytics/dashboard
GET /payables/analytics/compliance?financialYear=2024-25
```

### [GET ONE] GET `/payables/:id`

### [UPDATE STATUS] POST `/payables/:id/update-status`
```json
{ "status": "Paid" }
```

### [CREATE] POST `/payables`
```json
{
  "financialYear*": "2024-25",
  "fundType*": "Educational Fund",
  "ledgerCode*": "L1001",
  "ledgerName*": "Electricity Charges",
  "againstLedgerCode*": "A2001",
  "againstLedgerName*": "Bank Account",
  "transactionType*": "Debit",
  "voucherNo": "V-123",
  "voucherDate": "2024-05-15",
  "voucherType*": "BPV",
  "amount*": 25000.0,
  "description": "Payment for April bill",
  "challanNo": "V-123",
  "challanDate": "2024-05-15",
  "challanType": "BPV",
  "name": "Installation of LED lamps",
  "nameOfScheme": "City Lights Project",
  "nameOfWork": "Installation of LED lamps",
  "nameOfContractor": "Secure Power Ltd",
  "nameOfSupplier": "Bulb Corp",
  "estimateValue": 100000.0,
  "valueOfWorkDone": 25000.0,
  "workAmount": 25000.0,
  "nameOfEmployee": "John Doe",
  "designation": "Technician",
  "section": "Maintenance",
  "monthYear": "April 2024",
  "employeeAmount": 25000.0,
  "status": "Pending",
  "employeeEntries": []
}
```

---

## 10. Advance & Deposit Registers
**File:** [AdvanceDeposits.jsx](file:///d:/Accrual/accrual/src/pages/master/AdvanceDeposits.jsx) (Used by [AdvanceRegister.jsx](file:///d:/Accrual/accrual/src/pages/master/AdvanceRegister.jsx) and [DepositRegister.jsx](file:///d:/Accrual/accrual/src/pages/master/DepositRegister.jsx))
**Service:** `advanceDepositService`
**Endpoint:** `/advance-deposits`

### [FETCH] GET `/advance-deposits`
```
GET /advance-deposits
GET /advance-deposits?q=searchterm
GET /advance-deposits?financialYear=2024-25
GET /advance-deposits?registerType=Advance Register
GET /advance-deposits/summary?financialYear=2024-25
GET /advance-deposits/by-financial-year?financialYear=2024-25
```

### [GET ONE] GET `/advance-deposits/:id`

### [CREATE] POST `/advance-deposits`
```json
{
  "registerType*": "Advance Register",
  "financialYear*": "2024-25",
  "ledgerCode*": "ADV-001",
  "ledgerName*": "Staff Advance",
  "transactionType*": "Debit",
  "advDepNo": "AD-123",
  "voucherNo": "V-789",
  "voucherDate": "2024-04-10",
  "voucherType": "Payment",
  "amount*": 25000.0,
  "nameDesignation*": "John Smith - Senior Clerk",
  "description": "Advance for house rent",
  "status": "Active",
  "nameOfScheme": "Scheme X",
  "nameOfWork": "Work Y",
  "nameOfContractor": "Contractor Z",
  "nameOfSupplier": "Supplier S",
  "estimateValue": 100000.0,
  "valueOfWorkDone": 50000.0,
  "workAmount": 25000.0,
  "nameOfEmployee": "John Smith",
  "designation": "Senior Clerk",
  "section": "Accounts",
  "monthYear": "April 2024",
  "employeeAmount": 25000.0
}
```

### [CREATE] Deposit Register Payload
```json
{
  "registerType*": "Deposit Register",
  "financialYear*": "2024-25",
  "ledgerCode*": "DEP-001",
  "ledgerName*": "Security Deposit Ledger",
  "transactionType*": "Receipt",
  "advDepNo": "DEP-123",
  "voucherNo": "V-555",
  "voucherDate": "2024-04-10",
  "voucherType": "Receipt",
  "amount*": 50000.0,
  "nameDesignation*": "ABC Construction Ltd",
  "description": "Security deposit for tender #45",
  "status": "Active",
  "nameOfScheme": "Main Road Project",
  "nameOfWork": "Paving works",
  "nameOfContractor": "ABC Construction Ltd",
  "nameOfSupplier": "",
  "estimateValue": 500000.0,
  "valueOfWorkDone": 0.0,
  "workAmount": 50000.0,
  "nameOfEmployee": "",
  "designation": "",
  "section": "",
  "monthYear": "",
  "employeeAmount": 0.0
}
```

---

## 11. Auto GJV Configuration
**File:** [AutoGJV.jsx](file:///d:/Accrual/accrual/src/pages/master/AutoGJV.jsx)
**Service:** `autoGjvService`
**Endpoint:** `/auto-gjv`

### [FETCH] GET `/auto-gjv`
```
GET /auto-gjv
GET /auto-gjv?q=searchterm&gjvType=Grant GJV
GET /auto-gjv/dashboard-stats
GET /auto-gjv/:id/execution-history
```

### [EXECUTE] POST `/auto-gjv/:id/execute`
Triggers immediate execution of a GJV config. No body required.

### [TOGGLE STATUS] POST `/auto-gjv/:id/toggle-status`
Toggles Active/Inactive. No body required.

### [GET ONE] GET `/auto-gjv/:id`

### [CREATE] POST `/auto-gjv`
Configuration Payload:
```json
{
  "gjvType*": "Grant GJV",
  "entries*": [
    {
      "particulars*": "Monthly Grant Recognition",
      "debitAccount*": "110-001",
      "debitAccountName": "Grant Receivable",
      "creditAccount*": "410-005",
      "creditAccountName": "Grant Income",
      "amount*": 150000.0,
      "frequency*": "Monthly",
      "effectiveDate*": "2024-04-01",
      "description": "Auto-recognize grant income",
      "gjvType": "Grant GJV"
    }
  ],
  "totalEntries": 1,
  "status": "Active",
  "description": "Auto GJV configuration for Grant GJV"
}
```

---

## 12. Fund Creation (Admin)
**File:** [FundCreation.jsx](file:///d:/Accrual/accrual/src/pages/admin/FundCreation.jsx)
**Service:** `fundService`
**Endpoint:** `/funds`

### [FETCH] GET `/funds`
```
GET /funds
```
Returns all funds. No filter params (simple list).

### [GET ONE] GET `/funds/:id`

### [CREATE] POST `/funds`
```json
{ "fundName*": "Educational Fund" }
```

### [UPDATE] PUT `/funds/:id`
```json
{ "fundName": "Updated Fund Name" }
```

### [DELETE] DELETE `/funds/:id`

---

## 13. Bank Account / Accounts
**Service:** `accountService`
**Endpoint:** `/accounts`

> Used internally by `DataContext` to fetch bank accounts: `GET /accounts/by-type?accountType=Bank`

### [FETCH] GET `/accounts`
```
GET /accounts
GET /accounts?q=searchterm
GET /accounts?accountType=Bank
GET /accounts/by-type?accountType=Bank
GET /accounts/by-group?groupName=Bank Account
GET /accounts/by-code/:code
GET /accounts/validate-code?code=LC001&excludeId=5
```

### [GET ONE] GET `/accounts/:id`

### [CREATE] POST `/accounts`
```json
{
  "ledgerCode*": "LC001",
  "ledgerName*": "SBI Current A/c",
  "underGroup*": "Bank Account",
  "accountHoldersName": "Municipal Corporation",
  "accountNo": "1234567890",
  "ifscCode": "SBIN0001234",
  "bankName": "State Bank of India",
  "branchName": "Main Branch",
  "nameOfScheme": "General Fund"
}
```

---

## 14. Transactions (General)
**Service:** `transactionService`
**Endpoint:** `/transactions`

> Used by Dashboard to get recent transaction summaries.

### [FETCH] GET `/transactions`
```
GET /transactions
GET /transactions?q=searchterm
GET /transactions?accountCode=3059
GET /transactions/by-account?accountCode=3059
```

### [GET ONE] GET `/transactions/:id`

---

## 15. Reports
**Service:** `reportService`
**Endpoint:** `/reports`

### [FETCH] Report endpoints
```
GET /reports/trial-balance?fromDate=2024-04-01&toDate=2025-03-31
GET /reports/balance-sheet?date=2025-03-31
GET /reports/income-statement?fromDate=2024-04-01&toDate=2025-03-31
GET /reports/cash-flow?fromDate=2024-04-01&toDate=2025-03-31
GET /reports/account-ledger/:accountCode?fromDate=2024-04-01&toDate=2025-03-31
```
> **Confirm with backend:** exact endpoint paths for datewise, monthwise, yearwise, and statement reports.

---

## 16. Audit Trail
**Service:** `auditTrailService`
**Endpoint:** `/audit-trail`

### [FETCH] GET `/audit-trail`
```
GET /audit-trail
GET /audit-trail?q=searchterm
GET /audit-trail/stats
```

### [LOG] POST `/audit-trail`
```json
{
  "action": "CREATE",
  "resource": "Institution",
  "resourceId": "INST-001",
  "userId": 2,
  "details": "Created new institution",
  "timestamp": "2024-04-10T10:30:00Z"
}
```

---

## 17. Investment Details
**File:** [InvestmentDetails.jsx](file:///d:/Accrual/accrual/src/pages/transaction/InvestmentDetails.jsx)
**Service:** `investmentService`
**Endpoint:** `/investments`

### [FETCH] GET `/investments`
```
GET /investments
GET /investments?q=searchterm
GET /investments/by-status?status=live
GET /investments/by-financial-year?year=2024-25
GET /investments/statistics
```

### [GET ONE] GET `/investments/:id`

### [CREATE] POST `/investments`
```json
{
  "investmentSerialNumber*": "INV-2024-001",
  "investmentFileNumber*": "FILE-8899",
  "financialYear*": "2024-25",
  "fundType*": "general_fund",
  "fundName*": "General Operating Fund",
  "voucherNo*": "V-1122",
  "voucherDate*": "2024-04-10",
  "voucherType*": "payment",
  "bankLedgerCode": "3060",
  "bankAccountNumber*": "9876543210",
  "investmentAgainstLedgerCode": "INV-1001",
  "nameOfBank*": "State Bank of India",
  "investorName*": "Town Panchayat Commissioner",
  "investmentAmount*": 100000.0,
  "rateOfInterest*": 7.5,
  "interestPayoutOption*": "compound",
  "bondFdNumber": "FD-776655",
  "investmentDate*": "2024-04-10",
  "investmentPeriodFrom*": "2024-04-10",
  "investmentPeriodTo*": "2025-04-10",
  "nextRenewalDate": "2025-04-11",
  "principleAmount": 100000.0,
  "interestAmount": 7500.0,
  "maturityValue": 107500.0,
  "investmentMaturityDate": "2025-04-10",
  "preMaturity": "no",
  "investmentStatus*": "live",
  "remarks": "Locked for 1 year"
}
```

---

## 18. Loan Details
**File:** [LoanDetails.jsx](file:///d:/Accrual/accrual/src/pages/transaction/LoanDetails.jsx)
**Service:** `loanService`
**Endpoint:** `/loans`

### [FETCH] GET `/loans`
```
GET /loans
GET /loans?q=searchterm
GET /loans/by-status?status=live
GET /loans/by-type?type=interest_loan
GET /loans/statistics
```

### [GET ONE] GET `/loans/:id`

### [CREATE] POST `/loans`
```json
{
  "loanSerialNumber*": "LOAN-2024-001",
  "loanFileNumber*": "FILE-5544",
  "financialYear*": "2024-25",
  "fundType*": "general_fund",
  "fundName*": "General Operating Fund",
  "voucherNo*": "V-9988",
  "voucherDate*": "2024-04-10",
  "voucherType*": "payment",
  "bankLedgerCode": "3060",
  "bankAccountNumber": "9876543210",
  "loanAgainstLedgerCode": "LOAN-5001",
  "loanSanctionOrderDetails": "Order No: SAN/2024/005 dated 01-04-2024",
  "loanSanctionDate": "2024-04-01",
  "loanType*": "interest_loan",
  "nameOfScheme": "Urban Development Scheme",
  "nameOfWork": "Paving Main Road",
  "loanReceivedFrom": "HUDCO",
  "overallLoanAmount*": 1000000.0,
  "overallInterestAmount": 150000.0,
  "rateOfInterest": 8.5,
  "loanPeriodYears": 5,
  "loanPeriodMonths": 0,
  "loanPayoutOption": "monthly",
  "principleInstallment": 16666.67,
  "interestInstallment": 2500.0,
  "noOfInstallments": 60,
  "installmentStartDate": "2024-05-01",
  "installmentEndDate": "2029-04-01",
  "loanClosedDate": "",
  "principleAmountWaiver": "no",
  "penalty": "no",
  "penaltyRateOfInterest": 0.0,
  "purposeOfLoan": "Infrastructure development",
  "loanStatus*": "live",
  "remarks": "Project #456"
}
```

---

## 19. SFC & Duty Grant Details
**File:** [SFCGrantDetails.jsx](file:///d:/Accrual/accrual/src/pages/transaction/SFCGrantDetails.jsx)
**Service:** `sfcGrantService`
**Endpoint:** `/sfc-grants`

### [FETCH] GET `/sfc-grants`
```
GET /sfc-grants
GET /sfc-grants?q=searchterm
GET /sfc-grants/by-financial-year?year=2024-25
GET /sfc-grants/by-fund-type?fundType=sfc_fund
GET /sfc-grants/by-voucher-type?voucherType=BRV
GET /sfc-grants/by-date-range?startDate=2024-04-01&endDate=2025-03-31
GET /sfc-grants/monthly-summary?year=2024-25
GET /sfc-grants/statistics
```

### [GET ONE] GET `/sfc-grants/:id`

### [CREATE] POST `/sfc-grants`
```json
{
  "financialYear*": "2024-25",
  "fundType*": "sfc_fund",
  "fundName*": "SFC Grant Fund",
  "voucherNo*": "V-5544",
  "voucherDate*": "2024-04-10",
  "voucherType*": "BRV",
  "transactionType*": "ecs",
  "transactionDate*": "2024-04-10",
  "referenceNoAndDate": "REF-776655 dated 10-04-2024",
  "year": "2024",
  "periodOf": "April 2024",
  "grossAmount*": 250000.0,
  "deductionAmount": 10000.0,
  "netAmount": 240000.0,
  "adjustmentDate": "2024-04-10",
  "remarks": "April installment received"
}
```

---

## 20. Doubtful Collection Form (Special Form for JV)
**File:** [DoubtfulCollectionForm.jsx](file:///d:/Accrual/accrual/src/pages/transaction/DoubtfulCollectionForm.jsx)
**Service:** Used within [JournalVoucher.jsx](file:///d:/Accrual/accrual/src/pages/transaction/JournalVoucher.jsx)

### [SAVE] Payload
```json
{
  "type": "doubtfulCollection",
  "ledgerCode": "1001",
  "ledgerName": "Property Tax",
  "entries": [
    {
      "id": 1,
      "description": "Property Tax Prior year Doubtful Collection",
      "amount": 5000.0,
      "year": "2024-25"
    }
  ],
  "total": 5000.0,
  "journalNo": "JV/2024/001",
  "journalDate": "2024-04-10"
}
```

---

## 21. Prior Year Income Form (Special Form for JV)
**File:** [PriorYearIncomeForm.jsx](file:///d:/Accrual/accrual/src/pages/transaction/PriorYearIncomeForm.jsx)
**Service:** Used within [JournalVoucher.jsx](file:///d:/Accrual/accrual/src/pages/transaction/JournalVoucher.jsx)

### [SAVE] Payload
```json
{
  "type": "priorYearIncome",
  "ledgerCode": "2005",
  "ledgerName": "Water Charges",
  "entries": [
    {
      "id": 1,
      "description": "Prior Year Water Charges Income",
      "amount": 2500.0,
      "year": "2023-24"
    }
  ],
  "total": 2500.0,
  "journalNo": "JV/2024/002",
  "journalDate": "2024-04-10"
}
```

---

## 22. Fund Creation
> **See Section 12** — moved to master section for consistency.

---

## 23. Journal Voucher
**File:** [JournalVoucher.jsx](file:///d:/Accrual/accrual/src/pages/transaction/JournalVoucher.jsx)
**Service:** `createVoucherService('/journal-vouchers')`
**Endpoint:** `/journal-vouchers`

### [FETCH] GET `/journal-vouchers`
```
GET /journal-vouchers
GET /journal-vouchers?fundType=General Fund&fromDate=2024-04-01&toDate=2025-03-31
```

### [GET ONE] GET `/journal-vouchers/:id`

### [UPDATE] PUT `/journal-vouchers/:id`
Same payload as [SAVE] below.

### [DELETE] DELETE `/journal-vouchers/:id`

### [SAVE] POST `/journal-vouchers`
```json
{
  "journalType*": "Adjustment",
  "journalNo*": "JV/2024/005",
  "journalDate*": "2024-04-10",
  "fundType*": "General Fund",
  "description": "Adjustment entry for April",
  "nameOfScheme": "City Scheme",
  "nameOfWork": "Road Repair",
  "estimateValue": 500000.0,
  "nameOfContractor": "ABC Construction",
  "nameOfSupplier": "",
  "valueOfWorkDone": 100000.0,
  "workAmount": 100000.0,
  "nameOfEmployee": "",
  "designation": "",
  "section": "",
  "monthYear": "",
  "employeeAmount": 0.0,
  "employeeEntries": [
    {
      "nameOfEmployee": "John Doe",
      "designation": "Clerk",
      "section": "Accounts",
      "monthYear": "April 2024",
      "employeeAmount": "5000",
      "id": 1699999999999
    }
  ],
  "debitEntries*": [
    {
      "ledgerCode": "2002",
      "ledgerName": "Office Expenses",
      "amount": 25000.0,
      "hasDetailedForm": false,
      "detailType": null
    }
  ],
  "creditEntries*": [
    {
      "ledgerCode": "3059",
      "ledgerName": "Cash",
      "amount": 25000.0,
      "hasDetailedForm": false,
      "detailType": null
    }
  ],
  "specialFormData": {},
  "debitTotal": 25000.0,
  "creditTotal": 25000.0,
  "entryCount": 2,
  "balanced": true
}
```

---

## 24. Add Reconciliation
**File:** [AddReconciliation.jsx](file:///d:/Accrual/accrual/src/pages/reconciliation/AddReconciliation.jsx)
**Service:** `reconciliationService`
**Endpoint:** `/bank-reconciliation`

### [FETCH] GET `/bank-reconciliation`
```
GET /bank-reconciliation
GET /bank-reconciliation?fundType=General Fund&month=April&bankCode=3062
```

### [GET ONE] GET `/bank-reconciliation/:id`

### [SAVE] Payload
```json
{
  "grantCode": "SFC",
  "grantNature": "STATE FINANCE COMMISSION GRANT",
  "sanctionOrderNo": "SO/2024/001",
  "sanctionDate": "2024-04-10",
  "receiptDate": "2024-04-15",
  "grossAmount": 500000.0,
  "deductionAmount": 50000.0,
  "netAmount": 450000.0,
  "description": "First installment of SFC Grant for 2024-25",
  "deductions": [
    {
      "id": 1,
      "deductionType": "TDS",
      "amount": "25000"
    },
    {
      "id": 2,
      "deductionType": "Administrative Charges",
      "amount": "25000"
    }
  ]
}
```

---

## Add Reconciliation / Bank Reconciliation

### Component Reference
[AddReconciliation.jsx](file:///d:/Accrual/accrual/src/pages/reconciliation/AddReconciliation.jsx)
`reconciliationService` -> `/bank-reconciliation` endpoint

### Form State Mapping -> Payload keys
*   `formData.fundType` -> `fundType`
*   `formData.month` -> `month`
*   `formData.bankCode` -> `bankCode`
*   `formData.debitCredit` -> `debitCredit`
*   `formData.voucherType` -> `voucherType`
*   `formData.transactionType` -> `transactionType`
*   `reconciliationEntries` array elements -> `entries` array elements (with `crAmount` mapped as float)

**Note:** The UI uses the form structure for saving "Historical Reconicliations". 

### [SAVE] Payload
```json
{
  "fundType": "General Fund",
  "month": "April",
  "bankCode": "3062",
  "debitCredit": "Both",
  "voucherType": "All",
  "transactionType": "All",
  "reconciliationType": "Historical",
  "entries": [
    {
      "id": 1,
      "bankCode": "3062",
      "type": "BPV",
      "voucherNo": "9",
      "date": "2022-06-01",
      "chequeNo": "042712",
      "crAmount": 9940.00,
      "bankDate": "",
      "isNew": false
    },
    {
      "id": 2,
      "bankCode": "3062",
      "type": "BPV",
      "voucherNo": "10",
      "date": "2022-07-01",
      "chequeNo": "042716",
      "crAmount": 8000.00,
      "bankDate": "",
      "isNew": false
    }
  ],
  "totalAmount": 17940.00,
  "entriesCount": 2
}
```
### [CREATE] Payload
```json
{
  "reconciliationTitle*": "March 2024 SBI Reconciliation",
  "reconciliationDate*": "2024-04-10",
  "bankLedgerCode*": "3060",
  "reconciliationType*": "Monthly",
  "period": "March 2024",
  "description": "Monthly bank reconciliation for SBI principal account",
  "debitEntries*": [
    {
      "ledgerCode*": "1001",
      "ledgerName": "Cash in Hand",
      "amount*": 5000.0,
      "reconciled*": true,
      "bankDate": "2024-04-05",
      "remarks": "Cash deposit verified"
    }
  ],
  "creditEntries*": [
    {
      "ledgerCode*": "2001",
      "ledgerName": "Accounts Payable",
      "amount*": 2500.0,
      "reconciled*": false,
      "bankDate": "",
      "remarks": "Cheque not yet cleared"
    }
  ],
  "debitTotal": 5000.0,
  "creditTotal": 2500.0,
  "totalDifference": 2500.0,
  "totalReconciledCount": 1,
  "totalPendingCount": 1,
  "totalEntries": 2,
  "isBalanced": false,
  "reconciliationPercentage": 50,
  "reconciliationStatus*": "Partially Reconciled"
}
```

---

## 25. GST Returns (Generation Request)
**File:** `GSTReturns.jsx`
**Action:** Generate Return

### [GENERATE] Payload
```json
{
  "selectedPeriod*": "2024-03",
  "selectedReturn*": "gstr1"
}
```



---

## 26. Bank Payment Voucher
**File:** [BankPayment.jsx](file:///d:/Accrual/accrual/src/pages/transaction/BankPayment.jsx)
**Service:** `createVoucherService('/bank-payments')`
**Endpoint:** `/bank-payments`

### [FETCH] GET `/bank-payments`
```
GET /bank-payments
GET /bank-payments?fundType=General Fund&fromDate=2024-04-01&toDate=2025-03-31
```

### [GET ONE] GET `/bank-payments/:id`

### [UPDATE] PUT `/bank-payments/:id`
Same payload as [SAVE] below.

### [DELETE] DELETE `/bank-payments/:id`

### [SAVE] POST `/bank-payments`
```json
{
  "bpvType": "BPV",
  "bpvNo": "BPV-001",
  "bpvDate": "2024-04-10",
  "inFavourOf": "John Doe",
  "description": "Payment for office supplies",
  "dateOfEncashment": "",
  "modeOfTransaction": "Cash",
  "fundType": "General Fund",
  "depositorName": "",
  "chequeNo": "",
  "chequeDate": "",
  "bankName": "",
  "chequeAmount": "",
  "purposeOfPayment": "",
  "transactionId": "",
  "payeeName": "",
  "transferAmount": "",
  "purpose": "",
  "ecsTransactionId": "",
  "ecsPayeeName": "",
  "ecsAmount": "",
  "ecsPurpose": "",
  "debitEntries": [
    {
      "ledgerCode": "2002",
      "ledgerName": "Office Expenses",
      "amount": 5000.0
    }
  ],
  "creditEntries": [
    {
      "ledgerCode": "3059",
      "ledgerName": "Cash",
      "amount": 5000.0
    }
  ],
  "debitTotal": 5000.0,
  "creditTotal": 5000.0,
  "entryCount": 2,
  "balanced": true
}
```

---

## 27. Bank Receipt Voucher
**File:** [BankReceipt.jsx](file:///d:/Accrual/accrual/src/pages/transaction/BankReceipt.jsx)
**Service:** `createVoucherService('/bank-receipts')`
**Endpoint:** `/bank-receipts`

### [FETCH] GET `/bank-receipts`
```
GET /bank-receipts
GET /bank-receipts?fundType=General Fund&fromDate=2024-04-01&toDate=2025-03-31
```

### [GET ONE] GET `/bank-receipts/:id`

### [UPDATE] PUT `/bank-receipts/:id`
Same payload as [SAVE] below.

### [DELETE] DELETE `/bank-receipts/:id`

### [SAVE] POST `/bank-receipts`
```json
{
  "brvType": "BRV",
  "brvNo": "BRV-001",
  "brvDate": "2024-04-10",
  "fromWhom": "Jane Smith",
  "description": "Receipt of property tax",
  "dateOfRealization": "",
  "natureOfTransaction": "Cash",
  "fundType": "General Fund",
  "transactionId": "",
  "transferMode": "",
  "senderBank": "",
  "receiverBank": "",
  "onlineAmount": "",
  "onlinePurpose": "",
  "chequeEntries": [
    {
      "depositorName": "Jane Smith",
      "chequeNumber": "123456",
      "chequeDate": "2024-04-10",
      "bankName": "Bank of Baroda",
      "chequeAmount": 10000.0,
      "purposeOfDeposit": "Property Tax"
    }
  ],
  "ecsEntries": [
    {
      "ecsTransactionId": "ECS-9876",
      "ecsDepositorName": "Jane Smith",
      "ecsAmount": 10000.0,
      "ecsPurpose": "Property Tax"
    }
  ],
  "debitEntries": [
    {
      "ledgerCode": "3059",
      "ledgerName": "Cash",
      "amount": 10000.0
    }
  ],
  "creditEntries": [
    {
      "ledgerCode": "1001",
      "ledgerName": "Property Tax",
      "challanNo": "CH-12345",
      "amount": 10000.0
    }
  ],
  "debitTotal": 10000.0,
  "creditTotal": 10000.0,
  "entryCount": 2,
  "balanced": true
}
```

---

## 28. Daily Collection
**File:** [DailyCollection.jsx](file:///d:/Accrual/accrual/src/pages/transaction/DailyCollection.jsx)
**Service:** `createVoucherService('/daily-collections')` and `dailyCollectionService`
**Endpoint:** `/daily-collections`

### [FETCH] GET `/daily-collections`
```
GET /daily-collections
GET /daily-collections?fromDate=2024-04-01&toDate=2024-04-30
GET /daily-collections/by-date-range?startDate=2024-04-01&endDate=2024-04-30
GET /daily-collections/by-month?month=4&year=2024
GET /daily-collections/summary?date=2024-04-10
GET /daily-collections/stats
```

### [GET ONE] GET `/daily-collections/:id`

### [UPDATE] PUT `/daily-collections/:id`

### [DELETE] DELETE `/daily-collections/:id`

### [SAVE] POST `/daily-collections`
```json
{
  "collectionDate": "2024-04-10",
  "entries": [
    {
      "type": "debit",
      "ledgerCode": "3059",
      "ledgerName": "Cash",
      "amount": 15000.0,
      "challanNo": ""
    },
    {
      "type": "credit",
      "ledgerCode": "1001",
      "ledgerName": "Property Tax",
      "amount": 10000.0,
      "challanNo": "CH-123"
    },
    {
      "type": "credit",
      "ledgerCode": "1002",
      "ledgerName": "Water Charges",
      "amount": 5000.0,
      "challanNo": "CH-124"
    }
  ],
  "fromWhom": "Various Citizens",
  "purpose": "Daily tax collections",
  "debitTotal": 15000.0,
  "creditTotal": 15000.0,
  "entryCount": 3
}
```

---

## 29. Inter Bank Transfer
**File:** [InterBankTransfer.jsx](file:///d:/Accrual/accrual/src/pages/transaction/InterBankTransfer.jsx)
**Service:** `createVoucherService('/inter-bank-transfers')`
**Endpoint:** `/inter-bank-transfers`

### [FETCH] GET `/inter-bank-transfers`
```
GET /inter-bank-transfers
GET /inter-bank-transfers?fromDate=2024-04-01&toDate=2025-03-31
```

### [GET ONE] GET `/inter-bank-transfers/:id`

### [UPDATE] PUT `/inter-bank-transfers/:id`

### [DELETE] DELETE `/inter-bank-transfers/:id`

### [SAVE] POST `/inter-bank-transfers`
```json
{
  "ibtNo": "IBT-001",
  "ibtDate": "2024-04-10",
  "modeOfTransaction": "Cheque / DD",
  "chequeNo": "004562",
  "chequeDate": "2024-04-10",
  "description": "Transfer from SBI to Canara Bank",
  "debitEntries": [
    {
      "ledgerCode": "3061",
      "ledgerName": "Canara Bank - Savings A/c",
      "amount": 50000.0
    }
  ],
  "creditEntries": [
    {
      "ledgerCode": "3060",
      "ledgerName": "State Bank of India - Current A/c",
      "amount": 50000.0
    }
  ],
  "debitTotal": 50000.0,
  "creditTotal": 50000.0,
  "entryCount": 2
}
```

---

## 30. Admin System Settings
**File:** [admin/Admin.jsx](file:///d:/Accrual/accrual/src/pages/admin/Admin.jsx)
**Service:** N/A — currently using local state only
> **Action needed:** Decide with backend if settings should be persisted. If yes, backend needs a `POST /settings` or `PUT /settings` endpoint.
**Suggested Endpoint:** `/settings`

### [SAVE] Payload (System Settings)
```json
{
  "institutionName": "Municipal Corporation",
  "financialYear": "2024-25",
  "backupEnabled": true,
  "autoBackupInterval": "Daily",
  "sessionTimeout": 30,
  "maxLoginAttempts": 3,
  "passwordPolicy": "Enabled",
  "auditingEnabled": true
}
```

---

## 31. Admin User Management
**File:** [admin/Admin.jsx](file:///d:/Accrual/accrual/src/pages/admin/Admin.jsx)
**Service:** `authService` (user management)
> **Action needed:** Backend needs endpoints for listing users, creating users, and updating roles.
**Suggested Endpoints:** `GET /auth/users`, `POST /auth/users`, `PUT /auth/users/:id`

### [SAVE] Payload (New User / Edit User)
```json
{
  "name": "New User Name",
  "username": "newuser",
  "email": "user@example.com",
  "role": "Accountant"
}
```

---

## 32. Fund Institution Allocation
**File:** [admin/FundInstitutionAllocation.jsx](file:///d:/Accrual/accrual/src/pages/admin/FundInstitutionAllocation.jsx)
**Service:** `fundAllocationService`
**Endpoint:** `/fund-allocations`
> **Action needed:** Backend must confirm `/fund-allocations` endpoint exists. Frontend already calls it.

### [FETCH] GET `/fund-allocations`
```
GET /fund-allocations
GET /fund-allocations?userId=2
```

### [GET ONE] GET `/fund-allocations/:id`

### [SAVE] Payload
```json
{
  "id": 1712345678901,
  "userId": 2,
  "fundIds": [1, 2],
  "institutionIds": [1, 3],
  "permissions": {
    "canCreate": true,
    "canEdit": true,
    "canDelete": false,
    "canView": true
  },
  "validFrom": "2024-03-01",
  "validTo": "2024-12-31",
  "status": "Active",
  "createdAt": "2024-03-01",
  "createdBy": "admin"
}
```

---

## 33. Ledger Creation (Admin)
**File:** [admin/LedgerCreation.jsx](file:///d:/Accrual/accrual/src/pages/admin/LedgerCreation.jsx)
**Service:** `ledgerService`
**Endpoint:** `/ledgers`
> Same as Section 3. See Section 3 for FETCH/GET endpoints.

### [SAVE] Payload (Basic Ledger)
```json
{
  "ledgerCode": "LC001",
  "ledgerName": "Cash Account",
  "underGroup": "Cash",
  "accountHoldersName": "",
  "accountNo": "",
  "ifscCode": "",
  "bankName": "",
  "branchName": "",
  "nameOfScheme": ""
}
```

### [SAVE] Payload (Bank Account Ledger)
```json
{
  "ledgerCode": "LC002",
  "ledgerName": "SBI Current A/c",
  "underGroup": "Bank Account",
  "accountHoldersName": "Municipal Corporation",
  "accountNo": "1234567890",
  "ifscCode": "SBIN0001234",
  "bankName": "State Bank of India",
  "branchName": "Main Branch",
  "nameOfScheme": "General Fund"
}
```

---

## 34. Authentication
**Service:** `authService`
**Endpoint:** `/auth`

### [LOGIN] POST `/auth/login`
Request:
```json
{
  "username*": "admin",
  "password*": "password123"
}
```
Response `data`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```
> The `token` is stored as `authToken` in localStorage and sent as `Authorization: Bearer <token>` on every subsequent request.

### [LOGOUT] POST `/auth/logout`
No body required. Invalidates the token on the server.

### [GET CURRENT USER] GET `/auth/me`
Returns the currently logged-in user object.

### [GET ALL USERS] GET `/auth/users`
Admin only. Returns list of all users.

### [CREATE USER] POST `/auth/users`
```json
{
  "name*": "New User",
  "username*": "newuser",
  "email*": "user@example.com",
  "password*": "initialPassword123",
  "role*": "Accountant"
}
```

### [UPDATE USER] PUT `/auth/users/:id`
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "role": "Accountant"
}
```

---

## Backend Checklist — Confirm with Friend

These items need confirmation before frontend can fully work:

| # | Item | Status |
|---|------|--------|
| 1 | CORS configured for frontend domain | Confirm |
| 2 | `/fund-allocations` endpoint exists | Confirm |
| 3 | Bank account fetch: `GET /accounts/by-type?accountType=Bank` — does `accountType=Bank` match your DB value? | Confirm |
| 4 | Report endpoints — what are the actual paths? (e.g. `/reports/receipt-expenditure`?) | Confirm |
| 5 | Register endpoints (cheque register, DCB register etc.) — what are the paths? | Confirm |
| 6 | Statement endpoints — what are the paths? | Confirm |
| 7 | Does login return `{ success, data: { token, user }, message }` envelope? | Confirm |
| 8 | Is JWT token expiry handled? What happens when token expires — does backend return 401? | Confirm |
| 9 | Do all list endpoints support `?q=` for search? | Confirm |
| 10 | Do list endpoints support pagination? If yes, what params: `page`, `limit`, `offset`? | Confirm |
| 11 | Does `/auth/users` endpoint exist for admin user management? | Confirm |
| 12 | Does `/settings` endpoint exist for system settings? | Confirm |
