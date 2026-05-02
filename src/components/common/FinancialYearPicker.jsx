import React, { useState, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

const FinancialYearPicker = ({ label = 'Financial Year', value, onChange, required, error }) => {
  const [open, setOpen] = useState(false);
  const [decadeStart, setDecadeStart] = useState(() => Math.floor(new Date().getFullYear() / 12) * 12);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const select = (year) => {
    onChange(`${year}-${(year + 1).toString().slice(-2)}`);
    setOpen(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col gap-1 relative" ref={ref}>
      {label && (
        <label className="text-sm font-medium text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 w-full px-3 py-2.5 border rounded-lg text-sm bg-white text-left transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300
          ${error ? 'border-red-400' : 'border-slate-300 hover:border-purple-400'}`}
      >
        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
        <span className={value ? 'text-slate-900' : 'text-slate-400'}>
          {value || 'Select Financial Year'}
        </span>
      </button>
      {error && <p className="text-xs text-red-500">{error}</p>}

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg p-4 w-72">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setDecadeStart(d => d - 12)}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-lg font-bold leading-none"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-slate-700">
              {decadeStart} – {decadeStart + 11}
            </span>
            <button
              type="button"
              onClick={() => setDecadeStart(d => d + 12)}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-600 text-lg font-bold leading-none"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 12 }, (_, i) => decadeStart + i).map(year => {
              const fy = `${year}-${(year + 1).toString().slice(-2)}`;
              const isSelected = value === fy;
              const isCurrent = year === currentYear;
              return (
                <button
                  key={year}
                  type="button"
                  onClick={() => select(year)}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors
                    ${isSelected
                      ? 'bg-purple-600 text-white shadow-sm'
                      : isCurrent
                        ? 'border border-purple-400 text-purple-600 hover:bg-purple-50'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                >
                  {fy}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialYearPicker;
