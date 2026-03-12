# Backend Integration Guide: Workspace Filtering

To support the frontend workspace selection (Institution and Funds), the backend must implement the following scoping logic:

### 1. Global Filtering (GET Requests)
Every data-listing endpoint (Vouchers, Reports, Registers, Statements) now sends the following query parameters. The backend must use these to filter database queries:
- `institutionId`: Filter records by the selected institution.
- `fundIds[]`: Filter records to only those belonging to the selected fund(s).

**Example:**
`GET /api/bank-payments?institutionId=INST001&fundIds=1&fundIds=2`

### 2. Data Association (POST/PUT Requests)
Every creation or update request now includes `institutionId` in the body. The backend must ensure new records are correctly associated with this institution.
- **Field**: `institutionId` (String/UUID)

### 3. Key Modules Affected
- **Transactions**: Bank Payment, Bank Receipt, Inter-Bank Transfer, Journal Voucher, Daily Collection.
- **Masters**: Investment, Loan, SFC Grant, Institution, Ledger, Employee.
- **Outputs**: All Datewise/Monthwise/Yearwise Reports, 24+ Register Types, and 38+ Financial Statements.

### 4. Full Documentation
The complete set of updated payloads and endpoint requirements can be found in the project root:
[service_payloads_final.md](file:///d:/Accrual/accrual/service_payloads_final.md)
