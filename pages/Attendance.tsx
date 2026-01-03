
import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../types.ts';
import { api } from '../services/api.ts';

interface AttendanceProps {
  user: User;
}

const Attendance: React.FC<AttendanceProps> = ({ user }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, [user.id]);

  const fetchRecords = async () => {
    try {
      const data = await api.getAttendance(user.id);
      setRecords([...data].reverse());
      
      const today = new Date().toISOString().split('T')[0];
      const todayRec = data.find(r => r.date === today);
      if (todayRec) setTodayRecord(todayRec);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setProcessing(true);
    try {
      await api.checkIn(user.id);
      await fetchRecords();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setProcessing(true);
    try {
      await api.checkOut(user.id);
      await fetchRecords();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center p-20 text-mutedText animate-pulse">Loading records...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-custom custom-shadow flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h1 className="text-2xl font-bold text-mainText">Time Tracking</h1>
          <p className="text-mutedText">Log your presence and track work hours.</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="text-3xl font-mono font-bold text-mainText mb-4">
            {new Date().toLocaleTimeString()}
          </div>
          {!todayRecord ? (
            <button 
              onClick={handleCheckIn}
              disabled={processing}
              className="w-48 bg-primary text-white py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {processing ? '...' : 'CHECK IN'}
            </button>
          ) : !todayRecord.checkOut ? (
            <button 
              onClick={handleCheckOut}
              disabled={processing}
              className="w-48 bg-secondary text-white py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-all disabled:opacity-50"
            >
              {processing ? '...' : 'CHECK OUT'}
            </button>
          ) : (
            <div className="w-48 bg-green-100 text-green-700 py-4 rounded-full font-bold text-center border border-green-200">
              SHIFT DONE
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-custom custom-shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-softBg text-mutedText text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Check In</th>
              <th className="px-6 py-4">Check Out</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borders">
            {records.length > 0 ? records.map((record) => (
              <tr key={record.id} className="hover:bg-softBg/50 transition-colors">
                <td className="px-6 py-4 font-medium text-mainText">{record.date}</td>
                <td className="px-6 py-4 font-mono text-sm">{record.checkIn}</td>
                <td className="px-6 py-4 font-mono text-sm">{record.checkOut || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {record.status}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-mutedText italic">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
