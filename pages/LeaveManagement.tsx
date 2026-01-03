
import React, { useState, useEffect } from 'react';
import { User, UserRole, LeaveRequest, LeaveStatus } from '../types';
import { api } from '../services/api';

interface LeaveProps {
  user: User;
}

const LeaveManagement: React.FC<LeaveProps> = ({ user }) => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'Annual' as const,
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, [user.id, user.role]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaves(user.role === UserRole.ADMIN ? undefined : user.id);
      // Ensure we have a fresh copy of the array and reverse it for newest first
      setLeaves([...data].reverse());
    } catch (err) {
      console.error('Error fetching leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.applyLeave({
        ...formData,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`
      });
      setIsModalOpen(false);
      setFormData({ type: 'Annual', startDate: '', endDate: '', reason: '' });
      await fetchLeaves();
    } catch (err: any) {
      alert(err.message || 'Error applying for leave');
    }
  };

  const handleUpdateStatus = async (id: string, status: LeaveStatus) => {
    const comment = prompt('Optional comment for this decision:');
    setActionLoadingId(id);
    try {
      await api.updateLeaveStatus(id, status, comment || undefined);
      // Immediate state refresh
      await fetchLeaves();
    } catch (err: any) {
      alert(err.message || 'Error updating leave status');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-mainText">Leave Management</h1>
          <p className="text-mutedText">Request time off or manage employee leaves.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-6 py-3 rounded-custom font-semibold hover:opacity-90 transition-all flex items-center space-x-2 shadow-lg shadow-primary/20"
        >
          <span>+ Apply for Leave</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Annual Leave', value: '12 Days Left', color: 'bg-white border-blue-500 text-blue-700' },
          { label: 'Sick Leave', value: '5 Days Left', color: 'bg-white border-green-500 text-green-700' },
          { label: 'Unpaid Leave', value: 'Unlimited', color: 'bg-white border-gray-400 text-gray-700' },
        ].map((card, i) => (
          <div key={i} className={`p-6 rounded-custom custom-shadow border-l-4 ${card.color}`}>
            <p className="text-[10px] uppercase font-bold tracking-widest text-mutedText">{card.label}</p>
            <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-custom custom-shadow overflow-hidden border border-borders">
        <div className="p-6 border-b border-borders bg-softBg flex items-center justify-between">
          <h3 className="font-bold text-mainText">
            {user.role === UserRole.ADMIN ? 'Team Leave Requests' : 'My Requests History'}
          </h3>
          {loading && <span className="text-xs text-primary animate-pulse font-medium">Updating list...</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-mutedText text-[10px] uppercase tracking-wider border-b border-borders">
                <th className="px-6 py-4 font-bold">Employee</th>
                <th className="px-6 py-4 font-bold">Type</th>
                <th className="px-6 py-4 font-bold">Duration</th>
                <th className="px-6 py-4 font-bold">Reason</th>
                <th className="px-6 py-4 font-bold">Status</th>
                {user.role === UserRole.ADMIN && <th className="px-6 py-4 font-bold text-center">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-borders">
              {leaves.length > 0 ? leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-softBg transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs uppercase">
                        {leave.userName.charAt(0)}
                      </div>
                      <span className="font-semibold text-mainText text-sm">{leave.userName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-mutedText">{leave.type}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-mainText">{leave.startDate}</p>
                    <p className="text-[10px] text-mutedText">to {leave.endDate}</p>
                  </td>
                  <td className="px-6 py-4 text-xs max-w-xs truncate text-mutedText italic">"{leave.reason}"</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                      leave.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-700 border border-green-200' :
                      leave.status === LeaveStatus.REJECTED ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      {leave.status}
                    </span>
                    {leave.adminComment && (
                      <p className="text-[9px] text-mutedText mt-1 truncate max-w-[120px]">Note: {leave.adminComment}</p>
                    )}
                  </td>
                  {user.role === UserRole.ADMIN && (
                    <td className="px-6 py-4">
                      {leave.status === LeaveStatus.PENDING ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleUpdateStatus(leave.id, LeaveStatus.APPROVED)} 
                            disabled={actionLoadingId === leave.id}
                            className="text-[10px] bg-secondary text-white px-3 py-1.5 rounded-custom font-bold hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {actionLoadingId === leave.id ? '...' : 'Approve'}
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(leave.id, LeaveStatus.REJECTED)} 
                            disabled={actionLoadingId === leave.id}
                            className="text-[10px] bg-red-500 text-white px-3 py-1.5 rounded-custom font-bold hover:opacity-90 transition-all disabled:opacity-50"
                          >
                            {actionLoadingId === leave.id ? '...' : 'Reject'}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <span className="text-[10px] text-mutedText font-medium italic">Decision Finalized</span>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={user.role === UserRole.ADMIN ? 6 : 5} className="text-center py-20 text-mutedText italic text-sm">
                    {loading ? 'Fetching records...' : 'No leave requests found in the system.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-custom overflow-hidden animate-slideUp shadow-2xl">
            <div className="p-6 bg-primary text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">New Leave Application</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-2xl hover:rotate-90 transition-transform">&times;</button>
            </div>
            <form onSubmit={handleApply} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1">Leave Category</label>
                <select 
                  className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none focus:bg-white focus:ring-2 ring-primary/5 transition-all"
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as any})}
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1">Starts On</label>
                  <input 
                    type="date" required className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none focus:bg-white focus:ring-2 ring-primary/5 transition-all"
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1">Ends On</label>
                  <input 
                    type="date" required className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none focus:bg-white focus:ring-2 ring-primary/5 transition-all"
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-mutedText uppercase mb-1 ml-1">Reason for Absence</label>
                <textarea 
                  required rows={3} className="w-full bg-softBg border border-borders p-3 rounded-custom outline-none resize-none focus:bg-white focus:ring-2 ring-primary/5 transition-all"
                  value={formData.reason}
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  placeholder="Tell us why you need time off..."
                ></textarea>
              </div>
              <div className="pt-4 flex space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 border border-borders py-3 rounded-custom text-mutedText font-bold text-sm hover:bg-softBg transition-all">Cancel</button>
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-custom font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-95 transition-all">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
