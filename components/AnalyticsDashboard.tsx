import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  Download, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  BarChart2,
  PieChart,
  Eye,
  Star,
  Clock
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart 
} from 'recharts';
import { MetricCardProps } from '../types';

// --- Types ---

interface AnalyticsMetricCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

// --- Mock Data ---

const engagementData = [
  { date: 'Mon', activeUsers: 145, tasksCompleted: 320, messagesSent: 85 },
  { date: 'Tue', activeUsers: 168, tasksCompleted: 410, messagesSent: 120 },
  { date: 'Wed', activeUsers: 182, tasksCompleted: 380, messagesSent: 150 },
  { date: 'Thu', activeUsers: 195, tasksCompleted: 450, messagesSent: 180 },
  { date: 'Fri', activeUsers: 178, tasksCompleted: 390, messagesSent: 140 },
  { date: 'Sat', activeUsers: 120, tasksCompleted: 210, messagesSent: 60 },
  { date: 'Sun', activeUsers: 110, tasksCompleted: 180, messagesSent: 45 },
];

const coursePerformanceData = [
  { name: 'Mindset Mastery', enrollments: 120, completion: 78, revenue: 12500 },
  { name: 'Career Accel.', enrollments: 85, completion: 65, revenue: 8200 },
  { name: 'Fin. Freedom', enrollments: 150, completion: 45, revenue: 18000 },
  { name: 'Wellness 101', enrollments: 60, completion: 92, revenue: 3000 },
];

const dropOffData = [
  { week: 'Week 1', retention: 100 },
  { week: 'Week 2', retention: 85 },
  { week: 'Week 3', retention: 72 },
  { week: 'Week 4', retention: 65 },
  { week: 'Week 5', retention: 58 },
  { week: 'Week 6', retention: 52 },
  { week: 'Week 7', retention: 48 },
  { week: 'Week 8', retention: 45 },
];

const resourceUsageData = [
  { id: 1, name: 'Morning Grounding Audio', type: 'Audio', views: 452, avgTime: '10:15', rating: 4.8 },
  { id: 2, name: 'Core Values Workbook', type: 'PDF', views: 320, avgTime: '25:00', rating: 4.9 },
  { id: 3, name: 'Anxiety Release Video', type: 'Video', views: 289, avgTime: '12:30', rating: 4.7 },
  { id: 4, name: 'Sleep Hygiene Guide', type: 'Text', views: 150, avgTime: '05:45', rating: 4.2 },
  { id: 5, name: 'Goal Setting Template', type: 'PDF', views: 120, avgTime: '15:20', rating: 4.5 },
];

// --- Sub-Components ---

const AnalyticsMetricCard: React.FC<AnalyticsMetricCardProps> = ({ label, value, trend, trendUp, icon }) => (
  <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-2xl bg-stone-50 text-gray-700">
        {icon}
      </div>
      <div className={`flex items-center text-sm font-bold ${trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'} px-2 py-1 rounded-full`}>
        {trendUp ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
        {trend}
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-xs text-gray-400 mt-2">vs last period</p>
  </div>
);

const ChartCard: React.FC<{ 
    title: string; 
    children: React.ReactNode; 
    action?: React.ReactNode; 
    className?: string;
}> = ({ title, children, action, className }) => (
    <div className={`bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm ${className}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
            <div className="flex gap-2">
                {action}
                <button className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-stone-50">
                    <Download size={18}/>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-stone-50">
                    <MoreHorizontal size={18}/>
                </button>
            </div>
        </div>
        {children}
    </div>
);

// --- Main Component ---

const AnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [courseMetric, setCourseMetric] = useState<'enrollments' | 'revenue' | 'completion'>('enrollments');

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
           <p className="text-gray-500 mt-1">Track growth, engagement, and content performance.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
            <Calendar size={16} className="text-gray-500"/>
            <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 cursor-pointer"
            >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>Custom Range</option>
            </select>
        </div>
      </div>

      {/* 1. Top Metrics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsMetricCard 
          label="Total Users" 
          value="245" 
          trend="12%" 
          trendUp={true} 
          icon={<Users size={20}/>} 
        />
        <AnalyticsMetricCard 
          label="Active Users" 
          value="178" 
          trend="8%" 
          trendUp={true} 
          icon={<Activity size={20}/>} 
        />
        <AnalyticsMetricCard 
          label="Avg Engagement" 
          value="72%" 
          trend="5%" 
          trendUp={true} 
          icon={<TrendingUp size={20}/>} 
        />
        <AnalyticsMetricCard 
          label="Completion Rate" 
          value="68%" 
          trend="2%" 
          trendUp={false} 
          icon={<CheckCircle size={20}/>} 
        />
      </div>

      {/* 2. Main Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
         <ChartCard title="Engagement Over Time">
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e5e5', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                            itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle"/>
                        <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#1a1a1a" strokeWidth={3} dot={{r: 4, fill: '#1a1a1a'}} activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="tasksCompleted" name="Tasks Completed" stroke="#facc15" strokeWidth={3} dot={{r: 4, fill: '#facc15'}} />
                        <Line type="monotone" dataKey="messagesSent" name="Messages Sent" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} />
                    </LineChart>
                </ResponsiveContainer>
             </div>
         </ChartCard>
      </div>

      {/* 3. Main Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Course Performance */}
         <ChartCard 
            title="Course Performance"
            action={
                <div className="flex bg-stone-100 rounded-lg p-1">
                    {(['enrollments', 'revenue', 'completion'] as const).map(m => (
                        <button 
                            key={m}
                            onClick={() => setCourseMetric(m)}
                            className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition-all ${courseMetric === m ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            }
         >
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={coursePerformanceData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 500}} />
                        <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                            dataKey={courseMetric} 
                            fill={courseMetric === 'revenue' ? '#10b981' : courseMetric === 'completion' ? '#3b82f6' : '#facc15'} 
                            radius={[0, 4, 4, 0]} 
                            barSize={32}
                            name={courseMetric === 'revenue' ? 'Revenue ($)' : courseMetric === 'completion' ? 'Completion (%)' : 'Enrollments'}
                        />
                    </BarChart>
                </ResponsiveContainer>
             </div>
         </ChartCard>

         {/* Drop-off Analysis */}
         <ChartCard title="Drop-off Analysis">
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dropOffData}>
                        <defs>
                            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} unit="%" />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Area type="monotone" dataKey="retention" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
                    </AreaChart>
                </ResponsiveContainer>
             </div>
         </ChartCard>

      </div>

      {/* 4. Resource Usage Table */}
      <ChartCard title="Top Resource Usage">
          <div className="overflow-x-auto">
              <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                          <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Material Name</th>
                          <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                          <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Access Count</th>
                          <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Time</th>
                          <th className="text-right py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                      {resourceUsageData.map((resource) => (
                          <tr key={resource.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-4 px-4">
                                  <span className="font-bold text-gray-900">{resource.name}</span>
                              </td>
                              <td className="py-4 px-4">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold ${
                                      resource.type === 'Audio' ? 'bg-blue-100 text-blue-700' :
                                      resource.type === 'Video' ? 'bg-purple-100 text-purple-700' :
                                      'bg-gray-100 text-gray-700'
                                  }`}>
                                      {resource.type}
                                  </span>
                              </td>
                              <td className="py-4 px-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                      <Eye size={16} className="text-gray-400"/> {resource.views}
                                  </div>
                              </td>
                              <td className="py-4 px-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                      <Clock size={16} className="text-gray-400"/> {resource.avgTime}
                                  </div>
                              </td>
                              <td className="py-4 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                                      <Star size={14} className="text-yellow-400 fill-yellow-400"/> {resource.rating}
                                  </div>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <div className="mt-4 text-center">
              <button className="text-sm font-bold text-gray-500 hover:text-gray-900">View All Resources</button>
          </div>
      </ChartCard>

    </div>
  );
};

export default AnalyticsDashboard;
