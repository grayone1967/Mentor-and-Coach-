import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  AlertCircle, 
  ArrowLeft,
  ChevronDown, 
  ChevronUp,
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Download,
  MessageSquare,
  Activity,
  Calendar,
  FileText,
  Flag,
  Sparkles
} from 'lucide-react';
import { Client } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, BarChart, Bar 
} from 'recharts';

// Mock Data for List View
const clients: Client[] = [
  { id: '1', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=1', course: 'Mindset Mastery', progress: 45, streak: 12, lastActive: '2h ago', status: 'Critical' },
  { id: '2', name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=2', course: 'Career Acceleration', progress: 78, streak: 5, lastActive: '1d ago', status: 'Active' },
  { id: '3', name: 'Jessica Bloom', avatar: 'https://i.pravatar.cc/150?u=3', course: 'Financial Freedom', progress: 12, streak: 0, lastActive: '5d ago', status: 'Warning' },
  { id: '4', name: 'David Ross', avatar: 'https://i.pravatar.cc/150?u=4', course: 'Mindset Mastery', progress: 90, streak: 21, lastActive: '10m ago', status: 'Active' },
  { id: '5', name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=5', course: 'Career Acceleration', progress: 34, streak: 2, lastActive: '3h ago', status: 'Active' },
];

// Mock Data for Detail View
const mockProgressData = [
  { week: 'W1', score: 100 },
  { week: 'W2', score: 100 },
  { week: 'W3', score: 90 },
  { week: 'W4', score: 85 },
  { week: 'W5', score: 60 },
  { week: 'W6', score: 45 },
];

const mockMoodData = [
  { day: 'Mon', mood: 8, confidence: 7 },
  { day: 'Tue', mood: 6, confidence: 6 },
  { day: 'Wed', mood: 7, confidence: 8 },
  { day: 'Thu', mood: 9, confidence: 9 },
  { day: 'Fri', mood: 5, confidence: 6 },
  { day: 'Sat', mood: 7, confidence: 8 },
  { day: 'Sun', mood: 8, confidence: 8 },
];

const mockWeeks = [
  { 
    id: 1, 
    title: 'Week 1: Foundations', 
    status: 'Completed', 
    progress: 100, 
    timeSpent: '4h 30m', 
    engagement: 95, 
    tasks: [
      { title: 'Welcome Survey', completed: true },
      { title: 'Goal Setting Workbook', completed: true },
      { title: 'Intro Video: The Why', completed: true }
    ]
  },
  { 
    id: 2, 
    title: 'Week 2: Self Discovery', 
    status: 'Completed', 
    progress: 100, 
    timeSpent: '3h 15m', 
    engagement: 88, 
    tasks: [
      { title: 'Journal Entry: Core Values', completed: true },
      { title: 'Assessment: Strengths', completed: true },
      { title: 'Video: Understanding Ego', completed: true }
    ]
  },
  { 
    id: 3, 
    title: 'Week 3: Breaking Patterns', 
    status: 'In Progress', 
    progress: 45, 
    timeSpent: '1h 45m', 
    engagement: 60, 
    tasks: [
      { title: 'Exercise: Pattern Recognition', completed: true },
      { title: 'Journal Entry: Triggers', completed: false },
      { title: 'Live Session Recording', completed: false }
    ]
  },
  { 
    id: 4, 
    title: 'Week 4: Emotional Regulation', 
    status: 'Locked', 
    progress: 0, 
    timeSpent: '0m', 
    engagement: 0, 
    tasks: [
      { title: 'Video: The Nervous System', completed: false },
      { title: 'Breathing Techniques', completed: false },
      { title: 'Daily Check-in', completed: false }
    ]
  }
];

const mockJournalEntries = [
  { id: 1, date: 'Oct 14, 2025', mood: 'Happy', title: 'Breakthrough moment', preview: 'Today I finally understood what was holding me back in my career conversations. I realized that...' },
  { id: 2, date: 'Oct 12, 2025', mood: 'Neutral', title: 'Reflecting on the week', preview: 'It was a slow week. I struggled to keep up with the daily tasks but I managed to finish the main...' },
  { id: 3, date: 'Oct 09, 2025', mood: 'Sad', title: 'Feeling overwhelmed', preview: 'There is so much going on right now. The exercises are helping but I feel like I am falling behind...' },
];

const ClientManager: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [expandedWeek, setExpandedWeek] = useState<number | null>(3); // Default open active week

  // --- DETAIL VIEW ---
  if (selectedClient) {
    return (
      <div className="animate-fade-in space-y-6 pb-10">
        {/* Navigation Back */}
        <button 
          onClick={() => setSelectedClient(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium mb-2"
        >
          <ArrowLeft size={20} /> Back to Students
        </button>

        {/* Header Section */}
        <div className="bg-white rounded-[32px] p-8 border border-white shadow-sm relative overflow-hidden">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
              <div className="flex items-center gap-6">
                 <div className="relative">
                    <img src={selectedClient.avatar} alt={selectedClient.name} className="w-20 h-20 rounded-full border-4 border-stone-50" />
                    <span className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white ${selectedClient.status === 'Active' ? 'bg-green-500' : selectedClient.status === 'Warning' ? 'bg-orange-500' : 'bg-red-500'}`}></span>
                 </div>
                 <div>
                    <h1 className="text-3xl font-bold text-gray-900">{selectedClient.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                       <span className="flex items-center gap-1 bg-stone-100 px-3 py-1 rounded-full text-gray-700 font-medium">
                          <Clock size={14}/> Enrolled: {selectedClient.course}
                       </span>
                       <span className="flex items-center gap-1">
                          <Activity size={16} className="text-yellow-500"/> Week 6 of 12
                       </span>
                       <span className="flex items-center gap-1">
                          <TrendingUp size={16} className="text-green-500"/> Streak: {selectedClient.streak} Days
                       </span>
                    </div>
                 </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                 <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">
                    <Mail size={18}/> Message
                 </button>
                 <button 
                    onClick={() => setActiveTab('Journal')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-stone-50 transition-colors"
                 >
                    <FileText size={18}/> Journal
                 </button>
                 <button className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-stone-50 transition-colors">
                    <MoreHorizontal size={20}/>
                 </button>
              </div>
           </div>

           {/* Progress Bar Header */}
           <div className="mt-8">
              <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                 <span>Course Progress</span>
                 <span className="text-gray-900">{selectedClient.progress}%</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-400 rounded-full transition-all duration-1000" style={{ width: `${selectedClient.progress}%` }}></div>
              </div>
           </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto pb-2 no-scrollbar border-b border-gray-200/60">
           {['Overview', 'Progress', 'Insights', 'Journal', 'Conversations', 'Red Flags'].map(tab => (
              <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab 
                    ? 'border-yellow-400 text-gray-900' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                 }`}
              >
                 {tab}
                 {tab === 'Red Flags' && selectedClient.status === 'Critical' && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px]">1</span>
                 )}
              </button>
           ))}
        </div>

        {/* TAB CONTENT */}
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'Overview' && (
           <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Left Column: Charts */}
                 <div className="lg:col-span-2 space-y-6">
                    {/* Completion Chart */}
                    <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                       <h3 className="font-bold text-gray-900 mb-6 text-lg">Weekly Completion Rate</h3>
                       <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={mockProgressData}>
                                <defs>
                                   <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                                   </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Area type="monotone" dataKey="score" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                             </AreaChart>
                          </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Mood & Confidence Split */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
                          <h3 className="font-bold text-gray-900 mb-4">Mood Trends</h3>
                          <div className="h-[180px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={mockMoodData}>
                                   <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                   <Tooltip />
                                </LineChart>
                             </ResponsiveContainer>
                          </div>
                       </div>
                       <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
                          <h3 className="font-bold text-gray-900 mb-4">Confidence Score</h3>
                          <div className="h-[180px]">
                             <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockMoodData}>
                                   <Bar dataKey="confidence" fill="#facc15" radius={[4,4,0,0]} />
                                   <Tooltip />
                                </BarChart>
                             </ResponsiveContainer>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Right Column: Activity & Stats */}
                 <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
                       <h3 className="font-bold text-gray-900 mb-4">Recent Activity</h3>
                       <div className="space-y-4">
                          <div className="flex items-start gap-3">
                             <div className="mt-1 p-2 bg-green-100 text-green-600 rounded-full"><CheckCircle size={14}/></div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">Completed Week 3 Assessment</p>
                                <p className="text-xs text-gray-500">2 hours ago</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-3">
                             <div className="mt-1 p-2 bg-blue-100 text-blue-600 rounded-full"><FileText size={14}/></div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">Added Journal Entry</p>
                                <p className="text-xs text-gray-500">Yesterday</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-3">
                             <div className="mt-1 p-2 bg-red-100 text-red-600 rounded-full"><XCircle size={14}/></div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">Missed Daily Check-in</p>
                                <p className="text-xs text-gray-500">2 days ago</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-[32px] border border-stone-100">
                       <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
                       <div className="space-y-3">
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200">
                             <span className="text-sm text-gray-500">Journals</span>
                             <span className="font-bold text-gray-900">12 Entries</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200">
                             <span className="text-sm text-gray-500">Time Spent</span>
                             <span className="font-bold text-gray-900">14h 20m</span>
                          </div>
                          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200">
                             <span className="text-sm text-gray-500">Avg Mood</span>
                             <span className="font-bold text-gray-900 flex items-center gap-1"><Smile size={14} className="text-yellow-500"/> 7.5/10</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* --- PROGRESS TAB --- */}
        {activeTab === 'Progress' && (
           <div className="space-y-4 animate-fade-in max-w-4xl">
              {mockWeeks.map((week) => (
                 <div key={week.id} className="bg-white rounded-[24px] border border-stone-100 shadow-sm overflow-hidden">
                    <div 
                       onClick={() => setExpandedWeek(expandedWeek === week.id ? null : week.id)}
                       className="p-6 flex items-center justify-between cursor-pointer hover:bg-stone-50 transition-colors"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                             week.status === 'Completed' ? 'bg-green-100 text-green-700' :
                             week.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                             'bg-gray-100 text-gray-400'
                          }`}>
                             {week.status === 'Completed' ? <CheckCircle size={16}/> : week.id}
                          </div>
                          <div>
                             <h3 className="font-bold text-gray-900">{week.title}</h3>
                             <p className="text-xs text-gray-500">{week.progress}% Completed • {week.timeSpent}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Engagement</span>
                             <div className={`text-sm font-bold ${week.engagement > 80 ? 'text-green-500' : week.engagement > 50 ? 'text-yellow-500' : 'text-gray-400'}`}>
                                {week.engagement}%
                             </div>
                          </div>
                          {expandedWeek === week.id ? <ChevronUp size={20} className="text-gray-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                       </div>
                    </div>
                    
                    {expandedWeek === week.id && (
                       <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                          <div className="mt-4 space-y-3">
                             {week.tasks.map((task, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
                                   <div className="flex items-center gap-3">
                                      {task.completed 
                                         ? <CheckCircle size={18} className="text-green-500"/> 
                                         : <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300"></div>
                                      }
                                      <span className={`text-sm font-medium ${task.completed ? 'text-gray-900' : 'text-gray-500'}`}>{task.title}</span>
                                   </div>
                                   {task.completed && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Done</span>}
                                </div>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              ))}
           </div>
        )}

        {/* --- INSIGHTS TAB --- */}
        {activeTab === 'Insights' && (
           <div className="space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg">
                  <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="text-yellow-400" size={24}/> 
                        <h3 className="text-xl font-bold">AI Summary</h3>
                     </div>
                     <p className="text-indigo-100 leading-relaxed mb-6 max-w-2xl">
                        {selectedClient.name} is showing <span className="text-white font-bold">consistent improvement</span> in mood regulation. 
                        Key themes from recent journals involve "work-life balance" and "morning routine". 
                        Struggling slightly with Week 3 exercises regarding trigger identification. 
                        <br/><br/>
                        <span className="text-yellow-400 font-bold">Recommendation:</span> Send a supportive message acknowledging their progress on the values assessment.
                     </p>
                     <div className="flex gap-3">
                        <button className="bg-white text-indigo-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors">Generate Full Report</button>
                        <button className="bg-indigo-800 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-indigo-700 transition-colors">Copy to Notes</button>
                     </div>
                  </div>
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-50 -translate-y-1/2 translate-x-1/4"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Mood History</h3>
                        <select className="bg-stone-50 border-none rounded-lg text-xs font-bold text-gray-600 px-3 py-1 outline-none">
                           <option>Last 7 Days</option>
                           <option>Last 30 Days</option>
                        </select>
                     </div>
                     <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={mockMoodData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                              <Tooltip contentStyle={{ borderRadius: '12px' }} />
                              <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 text-lg">Focus & Engagement</h3>
                        <span className="text-green-500 text-sm font-bold flex items-center gap-1"><TrendingUp size={16}/> +12%</span>
                     </div>
                     <div className="space-y-6">
                        {[
                           { label: 'Video Watch Rate', val: 92, color: 'bg-blue-500' },
                           { label: 'Task Completion', val: 78, color: 'bg-green-500' },
                           { label: 'Journal Frequency', val: 45, color: 'bg-yellow-500' },
                           { label: 'Community Interaction', val: 15, color: 'bg-red-400' },
                        ].map((metric, i) => (
                           <div key={i}>
                              <div className="flex justify-between text-sm mb-2">
                                 <span className="font-medium text-gray-700">{metric.label}</span>
                                 <span className="font-bold text-gray-900">{metric.val}%</span>
                              </div>
                              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                                 <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.val}%` }}></div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
              </div>
           </div>
        )}

        {/* --- JOURNAL TAB --- */}
        {activeTab === 'Journal' && (
           <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search entries..." className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64" />
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-bold text-sm text-gray-600 hover:bg-stone-50">
                    <Download size={16}/> Export All
                 </button>
              </div>

              <div className="space-y-4">
                 {mockJournalEntries.map(entry => (
                    <div key={entry.id} className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                entry.mood === 'Happy' ? 'bg-green-100 text-green-600' : 
                                entry.mood === 'Sad' ? 'bg-blue-100 text-blue-600' : 
                                'bg-gray-100 text-gray-600'
                             }`}>
                                {entry.mood === 'Happy' ? <Smile size={20}/> : entry.mood === 'Sad' ? <Frown size={20}/> : <Meh size={20}/>}
                             </div>
                             <div>
                                <h3 className="font-bold text-gray-900">{entry.title}</h3>
                                <p className="text-xs text-gray-500">{entry.date}</p>
                             </div>
                          </div>
                          <button className="text-xs font-bold text-gray-400 group-hover:text-yellow-500 transition-colors">Read Full</button>
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed pl-13">
                          {entry.preview}
                       </p>
                    </div>
                 ))}
              </div>
           </div>
        )}
        
        {/* Placeholders for other tabs */}
        {(activeTab === 'Conversations' || activeTab === 'Red Flags') && (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                 {activeTab === 'Conversations' ? <MessageSquare size={32}/> : <Flag size={32}/>}
              </div>
              <h3 className="font-bold text-gray-900 text-lg">No Data Available</h3>
              <p className="text-gray-500 text-sm">This section is currently empty for {selectedClient.name}.</p>
           </div>
        )}

      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 mt-1">Monitor progress and handle alerts.</p>
        </div>
        <div className="flex gap-3">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input type="text" placeholder="Search students..." className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-64" />
             </div>
             <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600">
                 <Filter size={20} />
             </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white shadow-sm overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {clients.map(client => (
                    <tr 
                      key={client.id} 
                      onClick={() => setSelectedClient(client)}
                      className="hover:bg-white transition-colors cursor-pointer group"
                    >
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                                <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">{client.name}</div>
                                    <div className="text-xs text-gray-500">Active {client.lastActive}</div>
                                </div>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                            <span className="text-sm text-gray-700 font-medium">{client.course}</span>
                        </td>
                        <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${client.progress}%` }}></div>
                                </div>
                                <span className="text-xs font-bold text-gray-600">{client.progress}%</span>
                            </div>
                        </td>
                        <td className="py-4 px-6">
                             {client.status === 'Critical' && (
                                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
                                     <AlertCircle size={12} /> Distress
                                 </span>
                             )}
                             {client.status === 'Warning' && (
                                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-600">
                                     <AlertCircle size={12} /> Inactive
                                 </span>
                             )}
                             {client.status === 'Active' && (
                                 <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                     Active
                                 </span>
                             )}
                        </td>
                        <td className="py-4 px-6 text-right">
                             <div className="flex items-center justify-end gap-2">
                                 <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900">
                                     <Mail size={18} />
                                 </button>
                                 <button onClick={(e) => e.stopPropagation()} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900">
                                     <MoreHorizontal size={18} />
                                 </button>
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManager;