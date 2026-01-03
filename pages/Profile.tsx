
import React, { useState } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

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
               {isEditing ? 'Cancel Editing' : 'Edit Profile'}
             </button>
          </div>
        </div>

        <div className="pt-20 px-8 pb-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold text-mainText">{user.firstName} {user.lastName}</h2>
              <p className="text-lg text-secondary font-medium">{user.designation}</p>
              <div className="flex items-center space-x-4 mt-2 text-mutedText text-sm">
                 <span className="flex items-center">🏢 {user.department}</span>
                 <span className="flex items-center">📍 HQ, New York</span>
                 <span className="flex items-center">📅 Joined {user.joiningDate}</span>
              </div>
            </div>
            <div className="text-right">
               <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{user.role}</span>
               <p className="mt-2 text-xs text-mutedText font-bold">Employee ID: {user.employeeId}</p>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-borders pb-2">Personal Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-mutedText uppercase mb-1">First Name</label>
                  {isEditing ? (
                    <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  ) : <p className="font-semibold">{user.firstName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-mutedText uppercase mb-1">Last Name</label>
                  {isEditing ? (
                    <input className="w-full bg-softBg border border-borders p-2 rounded" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  ) : <p className="font-semibold">{user.lastName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-mutedText uppercase mb-1">Email Address</label>
                  <p className="font-semibold">{user.email}</p>
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
                  <label className="block text-xs font-bold text-mutedText uppercase mb-1">Reporting Manager</label>
                  <p className="font-semibold">Sarah Jenkins (Engineering VP)</p>
                </div>
              </div>
            </div>
          </div>

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
