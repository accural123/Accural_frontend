// // components/EntriesSection.jsx
// import React from "react";
// import { Plus, Trash2 } from "lucide-react";
// import { FormField } from "../common/FormField"; // adjust path as per your project

// const EntriesSection = ({
//   title,
//   icon: Icon,
//   iconColor,
//   bgColor,
//   borderColor,
//   textColor,
//   buttonColor,
//   hoverButtonColor,
//   entries,
//   addEntry,
//   removeEntry,
//   handleChange,
//   total,
//   sampleLedgers,
// }) => {
//   return (
//     <div className="space-y-4">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <Icon className={`h-5 w-5 ${iconColor}`} />
//           <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
//         </div>
//         <button
//           type="button"
//           onClick={addEntry}
//           className={`${buttonColor} ${hoverButtonColor} text-white px-3 py-2 rounded-md flex items-center space-x-1 text-sm`}
//           title={`Add ${title}`}
//         >
//           <Plus className="w-4 h-4" />
//           <span>Add</span>
//         </button>
//       </div>

//       {/* Entries */}
//       <div className="space-y-3">
//         {entries.map((entry, index) => (
//           <div
//             key={entry.id}
//             className={`p-4 ${bgColor} rounded-lg border ${borderColor} space-y-3`}
//           >
//             <div className="flex items-center justify-between">
//               <span className={`text-sm font-medium ${textColor}`}>
//                 {title} #{index + 1}
//               </span>
//               {entries.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeEntry(entry.id)}
//                   className={`${textColor} hover:text-black p-1`}
//                   title="Remove Entry"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>
//               )}
//             </div>

//             {/* Ledger Code */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Ledger Code
//               </label>
//               <select
//                 value={entry.ledgerCode}
//                 onChange={(e) =>
//                   handleChange(entry.id, "ledgerCode", e.target.value)
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
//                 required
//               >
//                 <option value="">Select Code</option>
//                 {sampleLedgers.map((ledger) => (
//                   <option key={ledger.code} value={ledger.code}>
//                     {ledger.code} - {ledger.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Ledger Head */}
//             <FormField
//               label="Ledger Head"
//               value={entry.ledgerName}
//               onChange={(e) =>
//                 handleChange(entry.id, "ledgerName", e.target.value)
//               }
//               disabled
//               placeholder="Auto-filled"
//             />

//             {/* Amount */}
//             <FormField
//               label="Amount (₹)"
//               type="number"
//               step="0.01"
//               min="0"
//               value={entry.amount}
//               onChange={(e) =>
//                 handleChange(entry.id, "amount", e.target.value)
//               }
//               placeholder="0.00"
//               required
//             />
//           </div>
//         ))}
//       </div>

//       {/* Total */}
//       <div className={`${bgColor} border ${borderColor} rounded-lg p-3`}>
//         <div className="flex items-center justify-between">
//           <span className={`text-sm font-medium ${textColor}`}>{title} Total:</span>
//           <span className={`text-lg font-bold ${textColor}`}>
//             ₹{total.toLocaleString("en-IN", {
//               minimumFractionDigits: 2,
//               maximumFractionDigits: 2,
//             })}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EntriesSection;
import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FormField } from './FormField';

export const EntriesSection = ({ 
  title, 
  icon: Icon, 
  iconColor,
  bgColor,
  borderColor,
  textColor,
  buttonColor,
  hoverButtonColor,
  entries, 
  addEntry, 
  removeEntry, 
  handleChange, 
  total, 
  sampleLedgers,
  showChallanNo = false
}) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button
        type="button"
        onClick={addEntry}
        className={`${buttonColor} ${hoverButtonColor} text-white px-3 py-2 rounded-md flex items-center space-x-1 text-sm`}
        title={`Add ${title.split(' ')[0]} Entry`}
      >
        <Plus className="w-4 h-4" />
        <span>Add</span>
      </button>
    </div>
    
    <div className="space-y-3">
      {entries.map((entry, index) => (
        <div key={entry.id} className={`p-4 ${bgColor} rounded-lg border ${borderColor} space-y-3`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${textColor}`}>
              {title.split(' ')[0]} Entry #{index + 1}
            </span>
            {entries.length > 1 && (
              <button
                type="button"
                onClick={() => removeEntry(entry.id)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ledger Code</label>
            <select
              value={entry.ledgerCode}
              onChange={(e) => handleChange(entry.id, 'ledgerCode', e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${title.split(' ')[0].toLowerCase()}-500`}
              required
            >
              <option value="">Select Code</option>
              {sampleLedgers.map((ledger) => (
                <option key={ledger.code} value={ledger.code}>
                  {ledger.code} - {ledger.name}
                </option>
              ))}
            </select>
          </div>
          
          <FormField
            label="Ledger Head"
            value={entry.ledgerName}
            onChange={(e) => handleChange(entry.id, 'ledgerName', e.target.value)}
            disabled
            placeholder="Auto-filled"
          />
          
          {/* {showChallanNo && (
            <FormField
              label="Challan No"
              value={entry.challanNo || ''}
              onChange={(e) => handleChange(entry.id, 'challanNo', e.target.value)}
              placeholder="Optional"
            />
          )} */}
          
          <FormField
            label="Amount (₹)"
            type="number"
            step="0.01"
            min="0"
            value={entry.amount}
            onChange={(e) => handleChange(entry.id, 'amount', e.target.value)}
            placeholder="0.00"
            required
          />
        </div>
      ))}
    </div>
    
    <div className={`${bgColor} border ${borderColor} rounded-lg p-3`}>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${textColor}`}>{title.split(' ')[0]} Total:</span>
        <span className={`text-lg font-bold ${textColor}`}>
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  </div>
);
export default EntriesSection;