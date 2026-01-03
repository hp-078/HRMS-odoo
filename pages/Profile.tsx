
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'salary'>('profile');

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await api.updateEmployee(user.id, formData);
      onUpdate(updated);
      setIsEditing(false);
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-custom custom-shadow overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-primary relative">
          <div className="absolute -bottom-16 left-8 p-1 bg-white rounded-full">
             <img 
               src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&size=128&background=714B67&color=fff`} 
               className="w-32 h-32 rounded-full" alt="Profile" 
             />
          </div>
          <div className="absolute bottom-4 right-8">
             <button 
               onClick={() => setIsEditing(!isEditing)}
               className="bg-white text-primary px-4 py-2 rounded-custom font-bold text-sm shadow hover:bg-softBg"
             >
               {isEditing ? 'Cancel Editing' : `Edit ${isEmployee ? 'Name' : 'Profile'}`}
             </button>
          </div>
        </div>

        <div className="pt-20 px-8 pb-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-mainText">{user.firstName} {user.lastName}</h2>
              <p className="text-lg text-secondary font-medium">{user.designation}</p>
              <div className="flex items-center space-x-4 mt-2 text-mutedText text-sm">
                 <span className="flex items-center">🏢 {user.department}</span>
                 <span className="flex items-center">📍 {user.workingAddress || 'HQ, New York'}</span>
                 <span className="flex items-center">📅 Joined {user.joiningDate}</span>
              </div>
            </div>
            <div className="text-right">
               <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{user.role}</span>
               <p className="mt-2 text-xs text-mutedText font-bold">Employee ID: {user.employeeId}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-borders mb-8">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-2 font-bold text-sm transition-colors ${
                  activeTab === 'profile' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-mutedText hover:text-mainText'
                }`}
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveTab('salary')}
                className={`pb-3 px-2 font-bold text-sm transition-colors ${
                  activeTab === 'salary' 
                    ? 'border-b-2 border-primary text-primary' 
                    : 'text-mutedText hover:text-mainText'
                }`}
              >
                {/* Salary Info */}
              </button>
            </div>
          </div>

          {activeTab === 'profile' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-borders pb-2">Personal Information</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">First Name</label>
                    <p className="font-semibold">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Last Name</label>
                    <p className="font-semibold">{user.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Email Address</label>
                    <p className="font-semibold text-mutedText">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Date of Birth</label>
                    {isEditing ? (
                      <input type="date" className="w-full bg-softBg border border-borders p-2 rounded" value={formData.dateOfBirth || ''} onChange={e => setFormData({...formData, dateOfBirth: e.target.value})} />
                    ) : <p className="font-semibold">{user.dateOfBirth || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Nationality</label>
                    {isEditing ? (
                      <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.nationality || ''} onChange={e => setFormData({...formData, nationality: e.target.value})} placeholder="Enter nationality" />
                    ) : <p className="font-semibold">{user.nationality || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Personal Email</label>
                    {isEditing ? (
                      <input type="email" className="w-full bg-softBg border border-borders p-2 rounded" value={formData.personalEmail || ''} onChange={e => setFormData({...formData, personalEmail: e.target.value})} placeholder="Enter personal email" />
                    ) : <p className="font-semibold">{user.personalEmail || 'Not provided'}</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-borders pb-2">Professional Details</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Department</label>
                    <p className="font-semibold">{user.department}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Designation</label>
                    <p className="font-semibold">{user.designation}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Working Address</label>
                    {isEditing ? (
                      <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.workingAddress || ''} onChange={e => setFormData({...formData, workingAddress: e.target.value})} placeholder="Enter working address" />
                    ) : <p className="font-semibold">{user.workingAddress || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Bank Name</label>
                    {isEditing ? (
                      <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.bankName || ''} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="Enter bank name" />
                    ) : <p className="font-semibold">{user.bankName || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Bank Account</label>
                    {isEditing ? (
                      <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.bankAccount || ''} onChange={e => setFormData({...formData, bankAccount: e.target.value})} placeholder="Enter bank account" />
                    ) : <p className="font-semibold">{user.bankAccount || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Gender</label>
                    {isEditing ? (
                      <select className="w-full bg-softBg border border-borders p-2 rounded" value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : <p className="font-semibold">{user.gender || 'Not provided'}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-mutedText uppercase mb-1">Marital Status</label>
                    {isEditing ? (
                      <select className="w-full bg-softBg border border-borders p-2 rounded" value={formData.maritalStatus || ''} onChange={e => setFormData({...formData, maritalStatus: e.target.value})}>
                        <option value="">Select status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    ) : <p className="font-semibold">{user.maritalStatus || 'Not provided'}</p>}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-custom p-6">
                <h4 className="font-bold text-amber-900 mb-3">Important</h4>
                <div className="text-sm text-amber-800 space-y-2">
                  <p>The Salary Information tab allows users to define and manage all salary-related fields for an employee, including wage types, working schedules, salary components, benefits. Salary components should be calculated automatically based on the defined wage.</p>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Wage Type</li>
                    <li>Fixed wage</li>
                    <li>Salary Components</li>
                  </ul>
                  <p className="mt-3">Section where users can define salary structure components:</p>
                  <p>Basic component should include: Basic, House Rent Allowance, Standard Allowance, Performance Bonus, Leave Travel Allowance, Fixed Allowance</p>
                  <p className="mt-3 font-semibold">Computation Type: Fixed Amount or Percentage of wage</p>
                  <p>Value that can be (e.g. set to 40% of Basic for HRA / Standard allowance: % 0.2%: Performing above $13.2% Leave Travel allowance $133.2%, Fixed Allowance % varies – in this case component)</p>
                  <p className="mt-3 font-semibold">Tax Deductions</p>
                  <p>Professional Tax</p>
                  <p className="mt-3">This level of all components should not exceed the defined wage.</p>
                  <p className="mt-3 font-semibold">Automatic Calculation:</p>
                  <p>The system should calculate each component amount based on the employee's defined wage.</p>
                  <p className="mt-3 font-semibold">Example:</p>
                  <p>If wage = ₹50,000 and Base = 80% of wage, then Base = ₹40,000.</p>
                  <p>If HRA = 80% of Base, then HRA = ₹12,800.</p>
                  <p className="mt-3">Each field for configuration (e.g. PF rate 12%)</p>
                  <p>and Professional Tax 200</p>
                </div>
              </div>

              {user.salaryInfo ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-softBg border border-borders rounded-custom p-6">
                      <label className="block text-xs font-bold text-mutedText uppercase mb-2">Monthly Wage</label>
                      <p className="text-3xl font-bold text-mainText">₹{user.salaryInfo.monthlyWage.toLocaleString()}</p>
                      <p className="text-sm text-mutedText mt-1">/ Month</p>
                      <p className="text-xs text-mutedText mt-2">{user.salaryInfo.workingDaysPerWeek || 5} of working days in a week</p>
                    </div>
                    <div className="bg-softBg border border-borders rounded-custom p-6">
                      <label className="block text-xs font-bold text-mutedText uppercase mb-2">Yearly Wage</label>
                      <p className="text-3xl font-bold text-mainText">₹{user.salaryInfo.yearlyWage.toLocaleString()}</p>
                      <p className="text-sm text-mutedText mt-1">/ Yearly</p>
                      <p className="text-xs text-mutedText mt-2">Gross Time</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-borders pb-2 mb-4">Salary Components</h4>
                    <div className="space-y-3">
                      {user.salaryInfo.components?.map((component, index) => (
                        <div key={index} className="flex justify-between items-center bg-softBg border border-borders rounded p-4">
                          <div className="flex-1">
                            <p className="font-semibold text-mainText">{component.name}</p>
                            <p className="text-xs text-mutedText">{component.percentage}% of base salary</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-mainText">₹{component.amount.toLocaleString()}</p>
                            <p className="text-xs text-mutedText">P / {component.period}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-custom p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-green-900">Product Fixed (PF) Contribution</p>
                      <p className="font-bold text-green-900">₹{((user.salaryInfo.monthlyWage || 0) * 0.12).toFixed(2)} / month</p>
                    </div>
                    <p className="text-xs text-green-700 mt-1">12% of base salary</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-custom p-4">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-blue-900">Tax Deductions</p>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-800">Professional Tax</span>
                        <span className="font-semibold text-blue-900">₹200.00 / month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-softBg rounded-custom">
                  <p className="text-mutedText">No salary information available</p>
                </div>
              )}
            </div>
          )}

          {isEditing && (
            <div className="mt-12 pt-8 border-t border-borders flex justify-end">
              <button 
                onClick={handleSave}
                disabled={loading}
                className="bg-secondary text-white px-8 py-3 rounded-custom font-bold shadow-lg hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-red-50 p-6 rounded-custom border border-red-100">
         <h4 className="font-bold text-red-800 mb-2">Danger Zone</h4>
         <p className="text-sm text-red-700 mb-4">Requesting account deactivation is permanent. All pending payroll and leave will be settled during clearance.</p>
         <button className="text-red-700 text-sm font-bold underline">Request Account Deactivation</button>
      </div>
    </div>
  );
};

export default Profile;
