
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { User, UserRole, DashboardStats, AttendanceRecord, LeaveRequest } from '../types.ts';
import { api } from '../services/api.ts';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const employees = await api.getEmployees();
        const attendance = await api.getAttendance();
        const leaves = await api.getLeaves();
        
        const today = new Date().toISOString().split('T')[0];
        const presentToday = attendance.filter(a => a.date === today).length;
        const leavesPending = leaves.filter(l => l.status === 'PENDING').length;

        setStats({
          totalEmployees: employees.length,
          presentToday,
          onLeaveToday: 0,
          pendingLeaves: leavesPending
        });

        setRecentAttendance(attendance.slice(-5).reverse());
        setPendingLeaves(leaves.filter(l => l.status === 'PENDING').slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 88 },
    { name: 'Thu', attendance: 95 },
    { name: 'Fri', attendance: 90 },
  ];

  const pieData = [
    { name: 'Engineering', value: 45, color: '#714B67' },
    { name: 'Sales', value: 25, color: '#017E84' },
    { name: 'Marketing', value: 15, color: '#FBBF24' },
    { name: 'HR', value: 15, color: '#EF4444' },
  ];

  if (loading) return <div className="flex items-center justify-center h-full text-mutedText p-20 animate-pulse">Loading dashboard insights...</div>;

  return (
    <div className="space-y-8 animate-fadeIn">
      <section>
        <h1 className="text-2xl font-bold text-mainText">Welcome back, {user.firstName}!</h1>
        <p className="text-mutedText">Here's what's happening at Dayflow today.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: stats?.totalEmployees, color: 'border-blue-500', icon: '👥' },
          { label: 'Present Today', value: stats?.presentToday, color: 'border-green-500', icon: '✅' },
          { label: 'Pending Leaves', value: stats?.pendingLeaves, color: 'border-yellow-500', icon: '🏖️' },
          { label: 'New Alerts', value: 3, color: 'border-purple-500', icon: '📬' },
        ].map((stat, i) => (
          <div key={i} className={`bg-white p-6 rounded-custom border-l-4 ${stat.color} custom-shadow flex items-center justify-between`}>
            <div>
              <p className="text-xs font-semibold text-mutedText uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-mainText mt-1">{stat.value}</h3>
            </div>
            <span className="text-3xl">{stat.icon}</span>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-custom custom-shadow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-mainText">Weekly Attendance Trends</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#8f8f8f'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#8f8f8f'}} />
                <Tooltip cursor={{ fill: '#F7F8FA' }} />
                <Bar dataKey="attendance" fill="#714B67" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-custom custom-shadow">
          <h3 className="font-bold text-mainText mb-6">Departments</h3>
          <div className="h-64 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
