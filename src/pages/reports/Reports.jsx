
import React, { useState } from 'react';
import { Card } from "../../components/common/Card";
import { FormField } from "../../components/common/FormField";
const reportTypes = {
  'Datewise': [
    'Receipt & Expenditure Details'
  ],
  'Monthwise': [
    'Receipt & Expenditure Monthwise Abstract',
    'BRV Datewise Reports',
    'ADBRV Datewise Reports',
    'BPV Datewise Reports',
    'EJV Datewise Reports',
    'PJV Datewise Reports',
    'CJV Datewise Reports',
    'FAJV Datewise Reports',
    'GJV Datewise Reports',
    'Codewise Dr and Cr Details - Income',
    'Codewise Dr and Cr Details - Expenditure',
    'Receipt & Expenditure – Bank Codewise Abstract',
    'Receipt & Expenditure – Monthwise Abstract'
  ],
  'Yearwise': [
    'Property Tax (Yearwise Balance)',
    'Property Tax With Library Amount',
    'Profession Tax',
    'D&O Licence Fees',
    'M.D.R',
    'Water Charges',
    'SWM Amount',
    'UGD Charges'
  ]
};

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: ''
  });


  const handleGenerateReport = () => {
    if (!selectedReportType || !selectedReport) {
      alert('Please select report type and report name');
      return;
    }

    const reportData = {
      type: selectedReportType,
      report: selectedReport,
      dateRange,
      generatedAt: new Date().toLocaleString()
    };

    console.log('Generating report:', reportData);
    alert(`Report "${selectedReport}" generated successfully!`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card title="Reports Generation">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Report Type"
              type="select"
              value={selectedReportType}
              onChange={(e) => {
                setSelectedReportType(e.target.value);
                setSelectedReport('');
              }}
              options={Object.keys(reportTypes).map(type => ({
                value: type,
                label: type + ' Report'
              }))}
            />
            
            {selectedReportType && (
              <FormField
                label="Select Report"
                type="select"
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                options={reportTypes[selectedReportType].map(report => ({
                  value: report,
                  label: report
                }))}
              />
            )}
          </div>

          {selectedReportType === 'Datewise' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="From Date"
                type="date"
                value={dateRange.fromDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, fromDate: e.target.value }))}
              />
              
              <FormField
                label="To Date"
                type="date"
                value={dateRange.toDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, toDate: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Generate Report
            </button>
          </div>
        </div>
      </Card>

      {/* Quick Access Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Quick Reports">
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
              📊 Daily Collection Summary
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
              🏦 Bank Balance Report
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
              📈 Monthly Income Statement
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
              📉 Monthly Expenditure Report
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
export default Reports
