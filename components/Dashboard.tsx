import React from 'react';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal,
  PlayCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MetricCardProps } from '../types';

const data = [
  { name: 'Mon', hours: 4.5 },
  { name: 'Tue', hours: 5.2 },
  { name: 'Wed', hours: 3.8 },
  { name: 'Thu', hours: 6.1 },
  { name: 'Fri', hours: 5.5 },
  { name: 'Sat', hours: 4.0 },
  { name: 'Sun', hours: 3.2 },
];

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, trendUp, icon }) => (
  <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${trendUp ? 'bg-yellow-100 text-yellow-700' : 'bg-stone-100 text-stone-600'}`}>
        {icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        {trendUp ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
        {trend}
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
  </div>
);

interface DashboardProps {
  userName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userName }) => {
  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userName || 'Practitioner'}</h1>
          <p className="text-gray-500 mt-1">Here is what's happening with your students today.</p>
        </div>
        <div className="flex gap-3">
            <button className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
                Oct 2025
            </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Active Students" 
          value="78" 
          trend="+12% this week" 
          trendUp={true} 
          icon={<Users size={20} />} 
        />
        <MetricCard 
          label="Course Hirings" 
          value="56" 
          trend="+5% this week" 
          trendUp={true} 
          icon={<BookOpen size={20} />} 
        />
        <MetricCard 
          label="Unread Messages" 
          value="12" 
          trend="Action required" 
          trendUp={false} 
          icon={<MessageSquare size={20} />} 
        />
        <MetricCard 
          label="Total Revenue" 
          value="$12.4k" 
          trend="+18% vs last month" 
          trendUp={true} 
          icon={<DollarSign size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Engagement Overview</h3>
              <p className="text-sm text-gray-500">Average daily active time per student</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#ca8a04" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Tracker Widget */}
        <div className="bg-[#fffbeb] p-8 rounded-[32px] border border-yellow-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
               <PlayCircle size={100} className="text-yellow-600" />
           </div>
           <h3 className="text-xl font-bold text-gray-900 mb-2">Time Tracker</h3>
           <div className="flex flex-col items-center justify-center py-6">
                <div className="w-40 h-40 rounded-full border-8 border-yellow-200 border-t-yellow-500 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">02:35</span>
                </div>
                <p className="text-sm text-gray-500 mt-4">Working on Content</p>
           </div>
           <div className="flex gap-4 justify-center">
               <button className="bg-white p-4 rounded-full shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-3 h-3 bg-gray-900 rounded-[1px]"></div>
               </button>
               <button className="bg-gray-900 p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow text-white">
                   <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.5 5.20096C11.1667 5.58586 11.1667 6.54811 10.5 6.93301L3 11.2631C2.33333 11.648 1.5 11.1669 1.5 10.3971L1.5 1.73686C1.5 0.967059 2.33333 0.485934 3 0.870834L10.5 5.20096Z" fill="currentColor"/>
                   </svg>
               </button>
           </div>
        </div>
      </div>

      {/* Red Flags / Alerts */}
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] border border-white shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Attention Needed</h3>
        <div className="space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-stone-100 hover:border-stone-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className={`w-2 h-12 rounded-full ${i === 1 ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
                        <div>
                            <h4 className="font-bold text-gray-900">Sarah Jenkins</h4>
                            <p className="text-sm text-gray-500">Mindset Mastery • Week 4</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${i === 1 ? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-700'}`}>
                            {i === 1 ? 'Distress Signals' : 'Low Activity'}
                        </span>
                        <button className="text-sm font-medium text-gray-900 underline decoration-gray-300 hover:decoration-gray-900">Review</button>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;