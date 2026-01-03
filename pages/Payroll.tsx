
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface PayrollProps {
  user: User;
}

const Payroll: React.FC<PayrollProps> = ({ user }) => {
  const [selectedMonth, setSelectedMonth] = useState('October 2024');

  const slips = [
    { month: 'October 2024', base: user.salary / 12, allowance: 500, deduction: 150, status: 'PAID', date: 'Oct 31, 2024' },
    { month: 'September 2024', base: user.salary / 12, allowance: 500, deduction: 150, status: 'PAID', date: 'Sep 30, 2024' },
    { month: 'August 2024', base: user.salary / 12, allowance: 500, deduction: 150, status: 'PAID', date: 'Aug 31, 2024' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-mainText">Payroll & Compensation</h1>
          <p className="text-mutedText">View your salary slips and benefits summary.</p>
        </div>
        {user.role === UserRole.ADMIN && (
          <button className="bg-primary text-white px-6 py-3 rounded-custom font-semibold">Generate Monthly Payroll</button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Salary Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-custom custom-shadow text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💰</span>
            </div>
            <h3 className="text-mutedText font-semibold uppercase text-xs tracking-widest">Annual CTC</h3>
            <p className="text-4xl font-bold text-primary mt-2">${user.salary.toLocaleString()}</p>
            <div className="mt-8 pt-8 border-t border-borders space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-mutedText">Monthly Gross</span>
                <span className="font-bold">${(user.salary / 12).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-mutedText">Tax Deductions</span>
                <span className="font-bold text-red-500">-$450.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-mutedText">Take Home (Est.)</span>
                <span className="font-bold text-secondary">${(user.salary / 12 - 450).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-secondary text-white p-8 rounded-custom shadow-lg">
            <h4 className="font-bold mb-2">Banking Information</h4>
            <p className="text-xs opacity-70 mb-4">Salary is credited to the account below by the 1st of every month.</p>
            <div className="space-y-2 text-sm">
              <p><span className="opacity-60">Bank:</span> Chase Bank N.A.</p>
              <p><span className="opacity-60">Account:</span> **** 9012</p>
              <p><span className="opacity-60">IFSC:</span> CHAS0001092</p>
            </div>
          </div>
        </div>

        {/* History / Slips */}
        <div className="lg:col-span-2 bg-white rounded-custom custom-shadow flex flex-col">
          <div className="p-6 border-b border-borders bg-softBg flex justify-between items-center">
            <h3 className="font-bold text-mainText">Payslip History</h3>
            <select className="bg-white border border-borders text-sm px-3 py-1 rounded outline-none" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
              <option>2024</option>
              <option>2023</option>
            </select>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-mutedText text-[10px] uppercase tracking-widest border-b border-borders">
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4">Basic Pay</th>
                  <th className="px-6 py-4">Allowances</th>
                  <th className="px-6 py-4">Net Salary</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borders">
                {slips.map((slip, i) => (
                  <tr key={i} className="hover:bg-softBg transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-mainText text-sm">{slip.month}</p>
                      <p className="text-[10px] text-mutedText">Paid on {slip.date}</p>
                    </td>
                    <td className="px-6 py-5 text-sm">${slip.base.toFixed(2)}</td>
                    <td className="px-6 py-5 text-sm text-secondary">+${slip.allowance}</td>
                    <td className="px-6 py-5 text-sm font-bold text-mainText">${(slip.base + slip.allowance - slip.deduction).toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">{slip.status}</span>
                    </td>
                    <td className="px-6 py-5">
                      <button className="text-primary font-bold text-xs hover:underline flex items-center space-x-1">
                        <span>⬇️ Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-yellow-50 text-yellow-800 text-xs border-t border-yellow-100 italic">
            Note: For discrepancies in payslips, please contact the HR department via ticketing system.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
