
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  ShieldAlert, 
  FileText, 
  Settings, 
  DollarSign, 
  BarChart2, 
  LogOut, 
  Search, 
  Bell, 
  CheckCircle, 
  XCircle, 
  MoreVertical, 
  AlertTriangle, 
  Filter, 
  Download, 
  Bot, 
  Plus, 
  Edit2, 
  Trash2, 
  MessageSquare, 
  Sparkles, 
  Play, 
  X, 
  ArrowLeft, 
  Ban, 
  Flag, 
  Clock, 
  CreditCard,
  Activity,
  FolderOpen,
  Eye,
  Star,
  Music,
  Video,
  Globe,
  TrendingDown,
  TrendingUp,
  Server,
  User,
  Gavel,
  Shield,
  FileCheck,
  Database,
  AlertOctagon,
  ChevronRight,
  ClipboardList,
  RefreshCw,
  Mail,
  PauseCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line, ComposedChart, PieChart, Pie, Cell 
} from 'recharts';
import { SuperAdminViewState, AdminPractitioner, ModerationItem, MetricCardProps, Persona, EndUser, Material, MaterialType } from '../types';

const MetricCard: React.FC<MetricCardProps> = ({ label, value, trend, trendUp, icon }) => (
  <div className="bg-white/60 backdrop-blur-xl p-6 rounded-[32px] border border-white shadow-sm hover:shadow-md transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-stone-100 text-stone-600`}>
        {icon}
      </div>
      <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-green-600' : 'text-red-500'}`}>
        {trend}
      </div>
    </div>
    <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
  </div>
);

// --- Mock Data ---

const practitionersData: AdminPractitioner[] = [
  { id: '1', name: 'John Smith', avatar: 'https://i.pravatar.cc/150?u=10', businessName: 'Mindset Coaching Ltd', niche: 'Career', coursesCount: 3, clientsCount: 45, status: 'Pending', joinedDate: 'Dec 9, 2025', revenue: '$0' },
  { id: '2', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?u=11', businessName: 'Wellness Hub', niche: 'Health', coursesCount: 5, clientsCount: 120, status: 'Active', joinedDate: 'Nov 15, 2025', revenue: '$12,500' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=12', businessName: 'Focus Flow', niche: 'Productivity', coursesCount: 1, clientsCount: 10, status: 'Suspended', joinedDate: 'Oct 2, 2025', revenue: '$1,200' },
  { id: '4', name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?u=13', businessName: 'Life Path', niche: 'Life Coach', coursesCount: 8, clientsCount: 230, status: 'Active', joinedDate: 'Sep 10, 2025', revenue: '$45,000' },
];

const mockEndUsers: EndUser[] = [
  { 
    id: 'u1', name: 'Alice Walker', email: 'alice@example.com', avatar: 'https://i.pravatar.cc/150?u=u1', 
    practitionerName: 'Sarah Wilson', courseName: 'Mindset Mastery', progress: 45, lastActive: '2h ago', status: 'Active', 
    registrationDate: 'Oct 12, 2025',
    paymentHistory: [{ id: 'inv1', date: 'Oct 12, 2025', amount: '$49.00', invoiceId: 'INV-001' }],
    supportTickets: []
  },
  { 
    id: 'u2', name: 'Bob Harris', email: 'bob@example.com', avatar: 'https://i.pravatar.cc/150?u=u2', 
    practitionerName: 'Emma Davis', courseName: 'Life Path 101', progress: 12, lastActive: '5d ago', status: 'Churned', 
    registrationDate: 'Sep 01, 2025',
    paymentHistory: [{ id: 'inv2', date: 'Sep 01, 2025', amount: '$49.00', invoiceId: 'INV-002' }],
    supportTickets: [{ id: 't1', subject: 'Refund Request', status: 'Closed', date: 'Sep 20, 2025' }]
  },
  { 
    id: 'u3', name: 'Charlie Kim', email: 'charlie@example.com', avatar: 'https://i.pravatar.cc/150?u=u3', 
    practitionerName: 'Sarah Wilson', courseName: 'Wellness Hub', progress: 88, lastActive: '10m ago', status: 'Active', 
    registrationDate: 'Nov 01, 2025',
    paymentHistory: [{ id: 'inv3', date: 'Nov 01, 2025', amount: '$99.00', invoiceId: 'INV-003' }],
    supportTickets: [{ id: 't2', subject: 'Login Issues', status: 'Resolved', date: 'Nov 02, 2025' }]
  },
  { 
    id: 'u4', name: 'David Lee', email: 'david@example.com', avatar: 'https://i.pravatar.cc/150?u=u4', 
    practitionerName: 'Mike Johnson', courseName: 'Focus Flow', progress: 0, lastActive: '2w ago', status: 'Flagged', 
    registrationDate: 'Oct 15, 2025',
    paymentHistory: [],
    supportTickets: [{ id: 't3', subject: 'Inappropriate Content Report', status: 'Open', date: 'Dec 01, 2025' }]
  },
];

const mockGlobalLibrary: Material[] = [
  { id: 'm1', title: 'Guided Morning Meditation', type: 'Audio', category: ['Meditation', 'Grounding'], duration: '10:30', source: 'Global', usageCount: 450, dateAdded: 'Dec 10, 2025', status: 'Pending', uploadedBy: 'Jane Doe', isFeatured: false, description: 'A calm start to the day.' },
  { id: 'm2', title: 'Stress Relief Yoga Flow', type: 'Video', category: ['Yoga', 'Stress'], duration: '25:00', source: 'Global', usageCount: 1200, dateAdded: 'Dec 08, 2025', status: 'Approved', uploadedBy: 'Wellness Hub', isFeatured: true, description: 'Gentle flow for beginners.' },
  { id: 'm3', title: 'Sleep Hygiene Checklist', type: 'PDF', category: ['Sleep', 'Health'], duration: '', source: 'Global', usageCount: 340, dateAdded: 'Dec 05, 2025', status: 'Pending', uploadedBy: 'Mike Johnson', isFeatured: false, description: '10 steps to better sleep.' },
  { id: 'm4', title: 'Anxiety SOS', type: 'Audio', category: ['Anxiety', 'Emergency'], duration: '03:00', source: 'Global', usageCount: 89, dateAdded: 'Dec 11, 2025', status: 'Rejected', uploadedBy: 'New Coach', isFeatured: false, description: 'Quick breathing exercise.' },
];

const moderationQueue: ModerationItem[] = [
  { id: '1', severity: 'High', type: 'Video', reason: 'Inappropriate content', reportedBy: 'Auto-moderation', target: 'John Doe', timestamp: '2 hours ago', status: 'Pending' },
  { id: '2', severity: 'Medium', type: 'Message', reason: 'Harassment report', reportedBy: 'Sarah J.', target: 'Practitioner X', timestamp: '1 day ago', status: 'Pending' },
  { id: '3', severity: 'Low', type: 'Content', reason: 'Copyright flag', reportedBy: 'System', target: 'Wellness Hub', timestamp: '2 days ago', status: 'Resolved' },
];

const moderationLogs = [
   { id: 'l1', timestamp: 'Dec 10, 14:30', type: 'Message', flaggedBy: 'AI Sentinel', severity: 'Medium', status: 'Auto-Hidden', action: 'Hidden' },
   { id: 'l2', timestamp: 'Dec 10, 12:15', type: 'Video', flaggedBy: 'User Report', severity: 'High', status: 'Reviewed', action: 'Removed' },
   { id: 'l3', timestamp: 'Dec 09, 09:45', type: 'Comment', flaggedBy: 'AI Sentinel', severity: 'Low', status: 'Dismissed', action: 'None' },
];

const mockGdprRequests = [
   { id: '1234', user: 'John Smith', email: 'john@example.com', date: 'Dec 5, 2025', status: 'Pending', type: 'Export' },
   { id: '1235', user: 'Maria Garcia', email: 'maria@example.com', date: 'Dec 8, 2025', status: 'Pending', type: 'Deletion' },
   { id: '1230', user: 'Robert Chen', email: 'robert@example.com', date: 'Nov 30, 2025', status: 'Completed', type: 'Export' },
];

const mockPersonas: Persona[] = [
  {
    id: '1',
    name: 'Atlas',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Atlas',
    tags: ['Productivity', 'Focus'],
    toneStyle: ['Direct', 'Analytical', 'Data-driven'],
    responseStyle: 'Concise',
    systemPrompt: 'You are Atlas, a productivity expert AI...',
    examplePhrases: ['Let\'s look at the data.', 'Efficiency is key.'],
    activeUsers: 1240
  },
  {
    id: '2',
    name: 'Serena',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Serena',
    tags: ['Mindset', 'Anxiety'],
    toneStyle: ['Empathetic', 'Gentle', 'Supportive'],
    responseStyle: 'Conversational',
    systemPrompt: 'You are Serena, a compassionate listener...',
    examplePhrases: ['Take a deep breath.', 'It is okay to feel this way.'],
    activeUsers: 850
  }
];

const chartData = [
  { name: 'Mon', revenue: 4000, active: 2400 },
  { name: 'Tue', revenue: 3000, active: 1398 },
  { name: 'Wed', revenue: 2000, active: 9800 },
  { name: 'Thu', revenue: 2780, active: 3908 },
  { name: 'Fri', revenue: 1890, active: 4800 },
  { name: 'Sat', revenue: 2390, active: 3800 },
  { name: 'Sun', revenue: 3490, active: 4300 },
];

// Finance Data
const mockPayouts = [
    { id: 'p1', practitioner: 'Emma Davis', amount: '$4,250.00', period: 'Nov 1-30', status: 'Scheduled', scheduledDate: 'Dec 15, 2025' },
    { id: 'p2', practitioner: 'Sarah Wilson', amount: '$12,890.00', period: 'Nov 1-30', status: 'Processing', scheduledDate: 'Dec 12, 2025' },
    { id: 'p3', practitioner: 'Mike Johnson', amount: '$850.00', period: 'Oct 1-31', status: 'Completed', scheduledDate: 'Nov 15, 2025' },
    { id: 'p4', practitioner: 'John Smith', amount: '$120.00', period: 'Nov 1-30', status: 'On Hold', scheduledDate: 'TBD' },
    { id: 'p5', practitioner: 'New Coach Inc.', amount: '$45.00', period: 'Nov 1-30', status: 'Failed', scheduledDate: 'Dec 10, 2025' },
];

const mockFailedPayments = [
    { id: 'f1', user: 'Sarah J.', amount: '$49.00', reason: 'Card Declined', date: '2 hours ago' },
    { id: 'f2', user: 'Mike T.', amount: '$99.00', reason: 'Expired Card', date: '1 day ago' },
    { id: 'f3', user: 'Lisa K.', amount: '$149.00', reason: 'Insufficient Funds', date: '2 days ago' },
];

const financeAnalyticsData = {
    revenueByCategory: [
        { name: 'Mindset', value: 45000 },
        { name: 'Health', value: 32000 },
        { name: 'Business', value: 28000 },
        { name: 'Career', value: 15000 },
    ],
    revenueByPractitioner: [
        { name: 'Emma D.', revenue: 45000 },
        { name: 'Sarah W.', revenue: 38000 },
        { name: 'Mike J.', revenue: 15000 },
        { name: 'John S.', revenue: 8000 },
    ],
    subVsOneTime: [
        { name: 'Jan', subscription: 24000, oneTime: 12000 },
        { name: 'Feb', subscription: 26000, oneTime: 14000 },
        { name: 'Mar', subscription: 28000, oneTime: 11000 },
    ],
    refundTrends: [
        { name: 'W1', rate: 2.1 },
        { name: 'W2', rate: 1.8 },
        { name: 'W3', rate: 2.4 },
        { name: 'W4', rate: 1.5 },
    ]
};

const COLORS = ['#facc15', '#1a1a1a', '#9ca3af', '#e5e7eb'];

// Detail Mock Data (Practitioner)
const mockPractitionerDetails = {
  courses: [
    { id: 1, title: 'Introduction to Mindfulness', students: 45, status: 'Published', revenue: '$4,500' },
    { id: 2, title: 'Advanced CBT Techniques', students: 12, status: 'Draft', revenue: '$0' },
    { id: 3, title: 'Stress Management 101', students: 89, status: 'Published', revenue: '$8,900' },
  ],
  clients: [
    { id: 1, name: 'Alice Cooper', joined: 'Oct 12, 2025', status: 'Active', progress: 65 },
    { id: 2, name: 'Bob Dylan', joined: 'Oct 15, 2025', status: 'Inactive', progress: 12 },
    { id: 3, name: 'Charlie Watts', joined: 'Nov 01, 2025', status: 'Active', progress: 88 },
  ],
  revenueLog: [
    { id: 1, date: 'Dec 01, 2025', amount: '$450.00', type: 'Payout', status: 'Completed' },
    { id: 2, date: 'Nov 01, 2025', amount: '$1,250.00', type: 'Payout', status: 'Completed' },
    { id: 3, date: 'Oct 01, 2025', amount: '$980.00', type: 'Payout', status: 'Completed' },
  ],
  activityLog: [
    { id: 1, action: 'Updated course "Mindfulness"', date: '2 hours ago' },
    { id: 2, action: 'Replied to message from Alice', date: '5 hours ago' },
    { id: 3, action: 'Logged in', date: '1 day ago' },
  ],
  reportedContent: [
    { id: 1, type: 'Message', reason: 'Inappropriate language', date: 'Nov 20, 2025', status: 'Resolved' }
  ]
};

// Analytics Data
const analyticsData = {
  userGrowth: [
    { date: 'Week 1', newSignups: 150, activeUsers: 1200, churnedUsers: 20 },
    { date: 'Week 2', newSignups: 200, activeUsers: 1350, churnedUsers: 25 },
    { date: 'Week 3', newSignups: 180, activeUsers: 1500, churnedUsers: 15 },
    { date: 'Week 4', newSignups: 250, activeUsers: 1700, churnedUsers: 30 },
    { date: 'Week 5', newSignups: 300, activeUsers: 1950, churnedUsers: 35 },
  ],
  practitionerActivity: [
    { tier: 'Enterprise', courseCreation: 15, clientAcquisition: 450 },
    { tier: 'Pro', courseCreation: 45, clientAcquisition: 800 },
    { tier: 'Starter', courseCreation: 120, clientAcquisition: 300 },
    { tier: 'Free', courseCreation: 200, clientAcquisition: 150 },
  ],
  platformHealth: [
    { time: '00:00', apiRequests: 4500, errorRate: 0.1, responseTime: 120 },
    { time: '04:00', apiRequests: 3200, errorRate: 0.05, responseTime: 110 },
    { time: '08:00', apiRequests: 8500, errorRate: 0.2, responseTime: 145 },
    { time: '12:00', apiRequests: 12000, errorRate: 0.3, responseTime: 160 },
    { time: '16:00', apiRequests: 10500, errorRate: 0.25, responseTime: 155 },
    { time: '20:00', apiRequests: 7800, errorRate: 0.15, responseTime: 130 },
  ],
  revenueMetrics: [
    { date: 'Sep', gross: 45000, net: 38000, failed: 1200 },
    { date: 'Oct', gross: 52000, net: 44000, failed: 900 },
    { date: 'Nov', gross: 48000, net: 41000, failed: 1500 },
    { date: 'Dec', gross: 61000, net: 52000, failed: 1100 },
  ]
};

interface SuperAdminDashboardProps {
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const [activeView, setActiveView] = useState<SuperAdminViewState>(SuperAdminViewState.DASHBOARD);
  
  // Practitioner State
  const [selectedPractitioner, setSelectedPractitioner] = useState<AdminPractitioner | null>(null);
  const [detailTab, setDetailTab] = useState<'Overview' | 'Courses' | 'Clients' | 'Revenue' | 'Activity' | 'Reports'>('Overview');
  
  // User Management State
  const [selectedUser, setSelectedUser] = useState<EndUser | null>(null);

  // Library Management State
  const [libraryFilter, setLibraryFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [selectedMaterialForReview, setSelectedMaterialForReview] = useState<Material | null>(null);

  // Moderation State
  const [moderationTab, setModerationTab] = useState<'Queue' | 'Logs'>('Queue');
  const [selectedModerationItem, setSelectedModerationItem] = useState<ModerationItem | null>(null);

  // Compliance State
  const [complianceTab, setComplianceTab] = useState<'Dashboard' | 'T&C' | 'GDPR'>('Dashboard');
  const [selectedGdprRequest, setSelectedGdprRequest] = useState<any | null>(null);

  // Finance State
  const [financeTab, setFinanceTab] = useState<'Overview' | 'Payouts' | 'Failed' | 'Analytics'>('Overview');

  // Persona Management State
  const [personas, setPersonas] = useState<Persona[]>(mockPersonas);
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [editingPersona, setEditingPersona] = useState<Partial<Persona> | null>(null);
  const [testChatMessages, setTestChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [testChatInput, setTestChatInput] = useState('');

  // Analytics State
  const [analyticsRange, setAnalyticsRange] = useState('30 Days');
  const [analyticsPractitionerFilter, setAnalyticsPractitionerFilter] = useState('All');
  const [analyticsCategoryFilter, setAnalyticsCategoryFilter] = useState('All');

  // --- Handlers: Persona ---
  const handleOpenPersonaModal = (persona?: Persona) => {
    if (persona) {
      setEditingPersona({...persona});
      setTestChatMessages([{ role: 'ai', text: `Hello, I am ${persona.name}. How can I assist you today?` }]);
    } else {
      setEditingPersona({
        name: '',
        tags: [],
        toneStyle: [],
        responseStyle: 'Conversational',
        systemPrompt: '',
        examplePhrases: []
      });
      setTestChatMessages([{ role: 'ai', text: "Hello! Configure my settings and I'll adapt my personality." }]);
    }
    setIsPersonaModalOpen(true);
  };

  const handleSavePersona = () => {
    if (!editingPersona?.name) return;
    
    if (editingPersona.id) {
      // Update existing
      setPersonas(prev => prev.map(p => p.id === editingPersona.id ? editingPersona as Persona : p));
    } else {
      // Create new
      const newPersona: Persona = {
        ...editingPersona as Persona,
        id: Math.random().toString(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${editingPersona.name}`,
        activeUsers: 0
      };
      setPersonas(prev => [...prev, newPersona]);
    }
    setIsPersonaModalOpen(false);
  };

  const handleTestChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testChatInput.trim()) return;
    
    const newMessages = [...testChatMessages, { role: 'user' as const, text: testChatInput }];
    setTestChatMessages(newMessages);
    setTestChatInput('');

    setTimeout(() => {
      let response = "I'm not fully configured yet.";
      const name = editingPersona?.name || 'AI';
      const tone = editingPersona?.toneStyle?.join(', ') || 'neutral';
      
      if (editingPersona?.responseStyle === 'Concise') {
        response = `[${name} | ${tone}]: Here is the answer.`;
      } else {
        response = `[${name} | ${tone}]: This is a simulated response demonstrating my configured tone and style. I am following the system prompt: "${editingPersona?.systemPrompt?.substring(0, 20)}..."`;
      }
      
      setTestChatMessages([...newMessages, { role: 'ai', text: response }]);
    }, 1000);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
       const val = e.currentTarget.value;
       setEditingPersona(prev => ({
         ...prev,
         tags: [...(prev?.tags || []), val]
       }));
       e.currentTarget.value = '';
    }
  };

  // --- Handlers: Library Approval ---
  const handleMaterialDecision = (status: 'Approved' | 'Rejected' | 'Featured') => {
    // In real app, update backend
    alert(`Material marked as ${status}`);
    setSelectedMaterialForReview(null);
  };

  // --- Renderers ---

  const renderPractitionerDetail = () => {
    if (!selectedPractitioner) return null;
    // ... (Existing render code, reusing logic from before)
    return (
        <div className="space-y-6 animate-fade-in">
          {/* Navigation */}
          <button 
            onClick={() => setSelectedPractitioner(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft size={20} /> Back to Practitioners
          </button>
  
          {/* Header Section */}
          <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex items-start gap-6">
                <img src={selectedPractitioner.avatar} alt={selectedPractitioner.name} className="w-24 h-24 rounded-full border-4 border-stone-50" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedPractitioner.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={16} /> Business: {selectedPractitioner.businessName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} /> Niche: {selectedPractitioner.niche}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} /> Joined: {selectedPractitioner.joinedDate}
                    </span>
                  </div>
                  <div className="mt-4">
                    {selectedPractitioner.status === 'Active' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>}
                    {selectedPractitioner.status === 'Pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending Review</span>}
                    {selectedPractitioner.status === 'Suspended' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Suspended</span>}
                  </div>
                </div>
              </div>
  
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {selectedPractitioner.status === 'Pending' ? (
                  <>
                    <button className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 flex items-center justify-center gap-2">
                      <XCircle size={18} /> Reject
                    </button>
                    <button className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 flex items-center justify-center gap-2 shadow-sm">
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2">
                       View Application
                    </button>
                  </>
                ) : (
                  <>
                    <button className="px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-stone-50 flex items-center justify-center gap-2">
                      <MessageSquare size={18} /> Message
                    </button>
                    <button className="px-4 py-3 bg-white border border-gray-200 text-red-600 rounded-xl font-bold hover:bg-red-50 flex items-center justify-center gap-2">
                      <Ban size={18} /> Suspend
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
  
          {/* Tabs Navigation */}
          <div className="flex overflow-x-auto pb-2 no-scrollbar border-b border-gray-200">
            {[
              { id: 'Overview', icon: <BarChart2 size={16}/> },
              { id: 'Courses', icon: <BookOpen size={16}/> },
              { id: 'Clients', icon: <Users size={16}/> },
              { id: 'Revenue', icon: <DollarSign size={16}/> },
              { id: 'Activity', icon: <Activity size={16}/> },
              { id: 'Reports', icon: <Flag size={16}/> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDetailTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-all border-b-2 ${
                  detailTab === tab.id 
                  ? 'border-yellow-400 text-gray-900' 
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.icon}
                {tab.id === 'Reports' ? 'Reported Content' : tab.id === 'Activity' ? 'Activity Log' : tab.id}
                {tab.id === 'Reports' && mockPractitionerDetails.reportedContent.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px]">
                    {mockPractitionerDetails.reportedContent.length}
                  </span>
                )}
              </button>
            ))}
          </div>
  
          {/* Tab Content */}
          <div className="animate-fade-in">
            {detailTab === 'Overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-bold mb-2">Total Revenue</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPractitioner.revenue}</div>
                  <div className="text-green-500 text-xs font-bold mt-1">+12% vs last month</div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-bold mb-2">Active Courses</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPractitioner.coursesCount}</div>
                  <div className="text-gray-400 text-xs font-bold mt-1">Across {selectedPractitioner.niche}</div>
                </div>
                <div className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm">
                  <div className="text-gray-500 text-sm font-bold mb-2">Total Clients</div>
                  <div className="text-2xl font-bold text-gray-900">{selectedPractitioner.clientsCount}</div>
                  <div className="text-green-500 text-xs font-bold mt-1">+5 new this week</div>
                </div>
                
                <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-[24px] border border-stone-100 shadow-sm">
                   <h3 className="font-bold text-gray-900 mb-4">Application Details</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div>
                         <span className="block text-gray-400 font-bold text-xs uppercase mb-1">Email Address</span>
                         <span className="block text-gray-900 font-medium">john.smith@example.com</span>
                      </div>
                      <div>
                         <span className="block text-gray-400 font-bold text-xs uppercase mb-1">Phone Number</span>
                         <span className="block text-gray-900 font-medium">+1 (555) 123-4567</span>
                      </div>
                      <div className="md:col-span-2">
                         <span className="block text-gray-400 font-bold text-xs uppercase mb-1">Bio / Statement</span>
                         <p className="text-gray-700 leading-relaxed">
                            Experienced career coach with over 10 years of helping professionals transition into leadership roles. 
                            Specializing in tech and creative industries. Looking to use Crextio to scale my group coaching programs.
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            )}
            
            {/* Reuse simple table renderers for other tabs to save space/code duplication */}
            {detailTab !== 'Overview' && (
                <div className="bg-white p-8 rounded-[24px] border border-stone-100 text-center text-gray-400">
                    Detailed View for {detailTab} populated from mock data.
                </div>
            )}
          </div>
        </div>
      );
  };

  const renderUserDetail = () => {
    if (!selectedUser) return null;
    return (
      <div className="space-y-6 animate-fade-in">
        <button 
            onClick={() => setSelectedUser(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-medium"
        >
            <ArrowLeft size={20} /> Back to Users
        </button>

        <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex items-center gap-6">
                    <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 rounded-full border-4 border-stone-50"/>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{selectedUser.name}</h1>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><BookOpen size={16}/> Course: {selectedUser.courseName}</span>
                            <span className="flex items-center gap-1"><Users size={16}/> Practitioner: {selectedUser.practitionerName}</span>
                            <span className="flex items-center gap-1"><Clock size={16}/> Registered: {selectedUser.registrationDate}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center gap-2"><MessageSquare size={16}/> Message</button>
                    <button className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center gap-2"><Download size={16}/> Export Data</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 flex items-center gap-2"><Ban size={16}/> Suspend</button>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="p-4 bg-stone-50 rounded-2xl">
                     <div className="text-xs font-bold text-gray-500 uppercase">Progress</div>
                     <div className="text-2xl font-bold text-gray-900 mt-1">{selectedUser.progress}%</div>
                     <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{width: `${selectedUser.progress}%`}}></div>
                     </div>
                 </div>
                 <div className="p-4 bg-stone-50 rounded-2xl">
                     <div className="text-xs font-bold text-gray-500 uppercase">Status</div>
                     <div className={`text-lg font-bold mt-1 ${
                         selectedUser.status === 'Active' ? 'text-green-600' : 
                         selectedUser.status === 'Churned' ? 'text-gray-500' : 'text-red-500'
                     }`}>
                         {selectedUser.status}
                     </div>
                 </div>
                 <div className="p-4 bg-stone-50 rounded-2xl">
                     <div className="text-xs font-bold text-gray-500 uppercase">Last Active</div>
                     <div className="text-lg font-bold text-gray-900 mt-1">{selectedUser.lastActive}</div>
                 </div>
                 <div className="p-4 bg-stone-50 rounded-2xl">
                     <div className="text-xs font-bold text-gray-500 uppercase">Total Spend</div>
                     <div className="text-lg font-bold text-gray-900 mt-1">
                        ${selectedUser.paymentHistory.reduce((acc, curr) => acc + parseFloat(curr.amount.replace('$','')), 0).toFixed(2)}
                     </div>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment History */}
            <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
                 <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2"><CreditCard size={20}/> Payment History</h3>
                 {selectedUser.paymentHistory.length > 0 ? (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-stone-50 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Invoice</th>
                                <th className="px-4 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {selectedUser.paymentHistory.map(pay => (
                                <tr key={pay.id}>
                                    <td className="px-4 py-3">{pay.date}</td>
                                    <td className="px-4 py-3">{pay.invoiceId}</td>
                                    <td className="px-4 py-3 font-bold">{pay.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <div className="text-center text-gray-400 py-8">No payments found.</div>
                 )}
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
                 <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2"><Flag size={20}/> Support Tickets</h3>
                 {selectedUser.supportTickets.length > 0 ? (
                     <div className="space-y-4">
                        {selectedUser.supportTickets.map(ticket => (
                            <div key={ticket.id} className="p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-gray-900">{ticket.subject}</div>
                                    <div className="text-xs text-gray-500">{ticket.date} • ID: {ticket.id}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    ticket.status === 'Open' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                                }`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                     </div>
                 ) : (
                    <div className="text-center text-gray-400 py-8">No support tickets found.</div>
                 )}
            </div>
        </div>
      </div>
    );
  };

  const renderUserManagement = () => {
    if (selectedUser) return renderUserDetail();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
                      <Filter size={16}/> Filters
                   </button>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">User</th>
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Practitioner & Course</th>
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Progress</th>
                            <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mockEndUsers.map(user => (
                            <tr key={user.id} onClick={() => setSelectedUser(user)} className="hover:bg-gray-50/50 transition-colors cursor-pointer">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full"/>
                                        <div>
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="text-sm font-medium text-gray-900">{user.courseName}</div>
                                    <div className="text-xs text-gray-500">via {user.practitionerName}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                        <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: `${user.progress}%`}}></div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{user.progress}% • Active {user.lastActive}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        user.status === 'Active' ? 'bg-green-100 text-green-700' : 
                                        user.status === 'Churned' ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-gray-900"><MoreVertical size={16}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  const renderLibraryManagement = () => {
    const filteredLibrary = mockGlobalLibrary.filter(m => {
        if (libraryFilter === 'All') return true;
        return m.status === libraryFilter;
    });

    const ApprovalModal = () => {
        if (!selectedMaterialForReview) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[32px] w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
                    {/* Left: Preview */}
                    <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center relative">
                        {selectedMaterialForReview.type === 'Video' ? <Video size={64} className="text-white opacity-50"/> :
                         selectedMaterialForReview.type === 'Audio' ? <Music size={64} className="text-white opacity-50"/> :
                         <FileText size={64} className="text-white opacity-50"/>}
                        <div className="absolute bottom-6 left-6 right-6">
                             <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                 <h3 className="text-white font-bold">{selectedMaterialForReview.title}</h3>
                                 <p className="text-gray-300 text-sm">{selectedMaterialForReview.duration} • {selectedMaterialForReview.type}</p>
                             </div>
                        </div>
                    </div>
                    
                    {/* Right: Controls */}
                    <div className="w-full md:w-1/2 flex flex-col bg-white">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">Review Material</h3>
                            <button onClick={() => setSelectedMaterialForReview(null)} className="text-gray-400 hover:text-gray-900"><X size={24}/></button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto flex-1 space-y-6">
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Metadata</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between"><span className="text-gray-500">Uploaded By:</span> <span className="font-medium">{selectedMaterialForReview.uploadedBy}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Date:</span> <span className="font-medium">{selectedMaterialForReview.dateAdded}</span></div>
                                    <div className="flex justify-between"><span className="text-gray-500">Category:</span> <span className="font-medium">{selectedMaterialForReview.category.join(', ')}</span></div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quality Check</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">Appropriate content</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">High quality audio/video</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">Correctly categorized</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">No copyright infringement</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Internal Notes</h4>
                                <textarea className="w-full p-3 rounded-xl bg-stone-50 border-none text-sm h-24 resize-none" placeholder="Add notes for the team or uploader..."></textarea>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                            <button onClick={() => handleMaterialDecision('Rejected')} className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors">Reject</button>
                            <button onClick={() => handleMaterialDecision('Approved')} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors">Approve</button>
                            <button onClick={() => handleMaterialDecision('Featured')} className="flex-1 py-3 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors flex items-center justify-center gap-1"><Star size={16}/> Feature</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {selectedMaterialForReview && <ApprovalModal />}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Global Library</h2>
                <div className="bg-white border border-gray-200 p-1 rounded-full flex gap-1">
                    {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
                        <button 
                            key={status}
                            onClick={() => setLibraryFilter(status as any)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                libraryFilter === status 
                                ? 'bg-gray-900 text-white shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            {status === 'Pending' ? `Pending (${mockGlobalLibrary.filter(m => m.status === 'Pending').length})` : status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredLibrary.map(item => (
                     <div key={item.id} className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-sm hover:shadow-lg transition-all relative">
                         <div className="flex justify-between items-start mb-4">
                             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                 item.type === 'Audio' ? 'bg-blue-50 text-blue-500' : 
                                 item.type === 'Video' ? 'bg-purple-50 text-purple-500' : 'bg-red-50 text-red-500'
                             }`}>
                                 {item.type === 'Audio' ? <Music size={20}/> : item.type === 'Video' ? <Video size={20}/> : <FileText size={20}/>}
                             </div>
                             <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                 item.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                 item.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                             }`}>
                                 {item.status}
                             </div>
                         </div>
                         <h3 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
                         <div className="text-xs text-gray-500 mb-4">Uploaded by <span className="font-bold text-gray-700">{item.uploadedBy}</span></div>
                         
                         <div className="flex gap-2 mb-4">
                            {item.category.map(c => (
                                <span key={c} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-lg text-[10px] font-bold">{c}</span>
                            ))}
                         </div>

                         {item.status === 'Pending' ? (
                             <div className="flex gap-2">
                                 <button 
                                    onClick={() => setSelectedMaterialForReview(item)}
                                    className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                                 >
                                     Review
                                 </button>
                             </div>
                         ) : (
                             <div className="flex gap-2">
                                 <button className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-stone-50 transition-colors">Details</button>
                                 {item.isFeatured && (
                                     <button className="px-3 py-2 bg-yellow-400 text-gray-900 rounded-xl hover:bg-yellow-300" title="Featured Content">
                                         <Star size={16} fill="currentColor"/>
                                     </button>
                                 )}
                             </div>
                         )}
                     </div>
                 ))}
            </div>
        </div>
    );
  };

  const renderModeration = () => {
    return (
       <div className="space-y-6 animate-fade-in relative">
          <div className="flex justify-between items-center">
             <div>
                <h2 className="text-2xl font-bold text-gray-900">Moderation & Safety</h2>
                <p className="text-gray-500 text-sm mt-1">Review flagged content and monitor AI safety logs.</p>
             </div>
             <div className="bg-white border border-gray-200 p-1 rounded-full flex gap-1">
                <button 
                   onClick={() => setModerationTab('Queue')}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${moderationTab === 'Queue' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                   Queue ({moderationQueue.filter(m => m.status === 'Pending').length})
                </button>
                <button 
                   onClick={() => setModerationTab('Logs')}
                   className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${moderationTab === 'Logs' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                   AI Logs
                </button>
             </div>
          </div>

          {moderationTab === 'Queue' && (
             <div className="grid grid-cols-1 gap-4">
                 <div className="flex gap-2 mb-2">
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">High Priority (12)</span>
                    <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">Medium (23)</span>
                    <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-100">Low (8)</span>
                 </div>
                 
                 {moderationQueue.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-[24px] border border-stone-100 shadow-sm flex flex-col md:flex-row items-start justify-between gap-4">
                       <div className="flex items-start gap-4">
                          <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                             item.severity === 'High' ? 'bg-red-100 text-red-600' : 
                             item.severity === 'Medium' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                             <ShieldAlert size={20}/>
                          </div>
                          <div>
                             <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                   item.severity === 'High' ? 'bg-red-50 text-red-700' : 
                                   item.severity === 'Medium' ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-700'
                                }`}>
                                   {item.severity} Priority
                                </span>
                                <span className="text-xs text-gray-400 font-medium">• {item.timestamp}</span>
                             </div>
                             <h3 className="text-lg font-bold text-gray-900">{item.type} Flagged: {item.reason}</h3>
                             <p className="text-sm text-gray-500">
                                Reported by <span className="font-bold text-gray-700">{item.reportedBy}</span> against <span className="font-bold text-gray-700">{item.target}</span>
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-2 w-full md:w-auto">
                          <button 
                             onClick={() => setSelectedModerationItem(item)}
                             className="flex-1 md:flex-none px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
                          >
                             Review
                          </button>
                          <button className="flex-1 md:flex-none px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                             Auto-Approve
                          </button>
                          <button className="px-4 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors">
                             <Trash2 size={18}/>
                          </button>
                       </div>
                    </div>
                 ))}
             </div>
          )}

          {moderationTab === 'Logs' && (
             <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                   <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                         <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Timestamp</th>
                         <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Type</th>
                         <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Flagged By</th>
                         <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Severity</th>
                         <th className="px-6 py-4 font-bold text-gray-500 uppercase text-xs">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {moderationLogs.map(log => (
                         <tr key={log.id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4 font-medium text-gray-900">{log.timestamp}</td>
                            <td className="px-6 py-4">{log.type}</td>
                            <td className="px-6 py-4">{log.flaggedBy}</td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-xs font-bold ${
                                  log.severity === 'High' ? 'bg-red-100 text-red-700' :
                                  log.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
                               }`}>
                                  {log.severity}
                               </span>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-700">{log.action}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          )}

          {/* Review Modal */}
          {selectedModerationItem && (
             <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in">
                   {/* Left: Content Preview */}
                   <div className="w-full md:w-1/2 bg-gray-900 flex items-center justify-center relative p-8">
                       <div className="text-center">
                          {selectedModerationItem.type === 'Video' ? <Video size={64} className="text-white opacity-50 mx-auto mb-4"/> : 
                           selectedModerationItem.type === 'Message' ? <MessageSquare size={64} className="text-white opacity-50 mx-auto mb-4"/> :
                           <FileText size={64} className="text-white opacity-50 mx-auto mb-4"/>}
                          <p className="text-gray-300 font-medium">Content Preview Unavailable</p>
                          <p className="text-gray-500 text-sm mt-2">ID: {selectedModerationItem.id}</p>
                       </div>
                   </div>

                   {/* Right: Controls */}
                   <div className="w-full md:w-1/2 flex flex-col bg-white">
                       <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="text-xl font-bold text-gray-900">Review Flagged Content</h3>
                          <button onClick={() => setSelectedModerationItem(null)} className="text-gray-400 hover:text-gray-900"><X size={24}/></button>
                       </div>

                       <div className="p-8 overflow-y-auto flex-1 space-y-6">
                           <div className="space-y-2 text-sm bg-stone-50 p-4 rounded-xl border border-stone-100">
                               <div className="flex justify-between"><span className="text-gray-500">Flag Reason:</span> <span className="font-bold text-red-600">{selectedModerationItem.reason}</span></div>
                               <div className="flex justify-between"><span className="text-gray-500">Uploader:</span> <span className="font-medium text-gray-900">{selectedModerationItem.target}</span></div>
                               <div className="flex justify-between"><span className="text-gray-500">Flagged By:</span> <span className="font-medium text-gray-900">{selectedModerationItem.reportedBy}</span></div>
                           </div>

                           <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                               <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                  <Sparkles size={12}/> AI Analysis
                               </h4>
                               <p className="text-sm text-indigo-900 leading-relaxed">
                                  "Content appears to contain advice that may exceed the practitioner's scope of practice. High probability of medical terminology usage."
                               </p>
                           </div>

                           <div>
                               <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Action Options</h4>
                               <div className="space-y-3">
                                   <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-stone-50 cursor-pointer">
                                       <input type="radio" name="action" className="w-4 h-4 text-green-600 focus:ring-green-500"/>
                                       <span className="text-sm font-bold text-gray-700">Approve - No issue found</span>
                                   </label>
                                   <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-stone-50 cursor-pointer">
                                       <input type="radio" name="action" className="w-4 h-4 text-yellow-500 focus:ring-yellow-400"/>
                                       <span className="text-sm font-bold text-gray-700">Approve with Warning</span>
                                   </label>
                                   <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-stone-50 cursor-pointer">
                                       <input type="radio" name="action" className="w-4 h-4 text-red-600 focus:ring-red-500"/>
                                       <span className="text-sm font-bold text-gray-700">Reject - Remove Content</span>
                                   </label>
                               </div>
                           </div>
                           
                           <div>
                               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Admin Notes</label>
                               <textarea className="w-full p-3 rounded-xl bg-stone-50 border-none text-sm h-20 resize-none" placeholder="Add justification..."></textarea>
                           </div>
                       </div>

                       <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                           <button onClick={() => setSelectedModerationItem(null)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-white hover:text-gray-900 transition-colors">Cancel</button>
                           <button onClick={() => {alert("Decision saved"); setSelectedModerationItem(null);}} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors">Save Decision</button>
                       </div>
                   </div>
                </div>
             </div>
          )}
       </div>
    );
  };

  const renderCompliance = () => {
    // --- Sub-Views for Compliance ---
    
    // 1. T&C Generator
    if (complianceTab === 'T&C') {
        return (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                <button onClick={() => setComplianceTab('Dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-4">
                    <ArrowLeft size={20}/> Back to Compliance
                </button>
                
                <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <FileCheck className="text-green-600"/> Terms & Conditions Generator
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Platform Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Crextio"/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400" placeholder="Crextio Ltd."/>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Jurisdiction</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400">
                                    <option>United States (Delaware)</option>
                                    <option>United Kingdom</option>
                                    <option>European Union (GDPR Compliant)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Service Type</label>
                                <input type="text" className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400" placeholder="SaaS Platform"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Include Sections</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['User Responsibilities', 'Payment Terms', 'Intellectual Property', 'Limitation of Liability', 'Termination', 'Dispute Resolution'].map(sec => (
                                    <label key={sec} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl cursor-pointer hover:bg-stone-100">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">{sec}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-stone-50">Preview</button>
                            <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black flex items-center gap-2">
                                <Sparkles size={16}/> Generate Document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 2. GDPR Data Export
    if (complianceTab === 'GDPR' && selectedGdprRequest) {
        return (
            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
                <button onClick={() => { setComplianceTab('Dashboard'); setSelectedGdprRequest(null); }} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-4">
                    <ArrowLeft size={20}/> Back to Dashboard
                </button>

                <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Data Export Request #{selectedGdprRequest.id}</h2>
                            <p className="text-gray-500 mt-1">Requested on {selectedGdprRequest.date} by {selectedGdprRequest.email}</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Pending</span>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">User Details</h4>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">JS</div>
                                <div>
                                    <p className="font-bold text-gray-900">{selectedGdprRequest.user}</p>
                                    <p className="text-xs text-gray-500">ID: user_123456</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3">Data to Include</label>
                            <div className="space-y-2">
                                {['Profile Information', 'Course Enrollment Data', 'Journal Entries', 'AI Conversation Logs', 'Payment History', 'Messages'].map(item => (
                                    <label key={item} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-yellow-400">
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-yellow-400 rounded focus:ring-yellow-400 border-gray-300"/>
                                        <span className="text-sm font-medium text-gray-700">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-stone-50">Notify User</button>
                            <button className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black flex items-center gap-2">
                                <Download size={16}/> Generate Export Package
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 3. Main Dashboard
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Compliance Centre</h2>
                <p className="text-gray-500 mt-1">Manage legal templates, data requests, and regulatory compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Templates Card */}
                <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                        <FileText size={24}/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Templates & Policies</h3>
                    <div className="space-y-2 flex-1 mb-6">
                         <button 
                            onClick={() => setComplianceTab('T&C')}
                            className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group"
                         >
                            Terms & Conditions Generator <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                         </button>
                         <button className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group">
                            Privacy Policy Builder <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                         </button>
                         <button className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group">
                            Practitioner Agreement <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity"/>
                         </button>
                    </div>
                </div>

                {/* GDPR Card */}
                <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                        <Database size={24}/>
                    </div>
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold text-gray-900">GDPR Management</h3>
                         <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">2 Pending</span>
                    </div>
                    
                    <div className="space-y-3 flex-1 mb-6">
                        {mockGdprRequests.slice(0, 3).map(req => (
                            <div 
                                key={req.id} 
                                onClick={() => { setSelectedGdprRequest(req); setComplianceTab('GDPR'); }}
                                className="p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-purple-200 cursor-pointer transition-colors"
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-900">{req.type} Request</span>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{req.status}</span>
                                </div>
                                <p className="text-xs text-gray-500">{req.user} • {req.date}</p>
                            </div>
                        ))}
                    </div>
                    <button className="w-full py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-bold hover:bg-purple-100">View All Requests</button>
                </div>

                {/* Disclaimers Card */}
                <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex flex-col">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                        <AlertOctagon size={24}/>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Disclaimers & Safety</h3>
                    <div className="space-y-2 flex-1 mb-6">
                        <button className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group">
                            Standard Platform Disclaimer <ClipboardList size={16} className="text-gray-400"/>
                         </button>
                         <button className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group">
                            Crisis Resource Links <ClipboardList size={16} className="text-gray-400"/>
                         </button>
                         <button className="w-full text-left text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-stone-50 p-2 rounded-lg flex justify-between items-center group">
                            Professional Boundaries <ClipboardList size={16} className="text-gray-400"/>
                         </button>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-xl text-xs text-orange-800 leading-relaxed font-medium">
                        Ensure all practitioners have accepted the latest Crisis Response Protocol (v2.4).
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderFinance = () => {
    return (
        <div className="space-y-6 animate-fade-in pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
                  <p className="text-gray-500 mt-1">Manage payouts, revenue, and platform fees.</p>
               </div>
               
               <div className="bg-white border border-gray-200 p-1 rounded-full flex gap-1 shadow-sm">
                  {['Overview', 'Payouts', 'Failed', 'Analytics'].map(tab => (
                     <button 
                        key={tab}
                        onClick={() => setFinanceTab(tab as any)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${financeTab === tab ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                     >
                        {tab === 'Failed' ? 'Failed Payments' : tab}
                     </button>
                  ))}
               </div>
            </div>

            {financeTab === 'Overview' && (
               <div className="animate-fade-in space-y-6">
                   {/* Overview Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100">
                         <p className="text-sm text-gray-500 font-medium">Gross Revenue</p>
                         <h3 className="text-3xl font-bold text-gray-900 mt-1">$125,400</h3>
                         <span className="inline-block mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12% vs last mo</span>
                      </div>
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100">
                         <p className="text-sm text-gray-500 font-medium">Practitioner Payouts</p>
                         <h3 className="text-3xl font-bold text-gray-900 mt-1">$98,500</h3>
                         <span className="inline-block mt-2 text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">78% of Revenue</span>
                      </div>
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100">
                         <p className="text-sm text-gray-500 font-medium">Platform Fees</p>
                         <h3 className="text-3xl font-bold text-green-600 mt-1">$26,900</h3>
                         <span className="inline-block mt-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Net Profit</span>
                      </div>
                      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-stone-100">
                         <p className="text-sm text-gray-500 font-medium">Pending Payouts</p>
                         <h3 className="text-3xl font-bold text-yellow-500 mt-1">$12,300</h3>
                         <span className="inline-block mt-2 text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full">Due in 7 days</span>
                      </div>
                   </div>

                   {/* Summary Chart */}
                   <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">Revenue Trend</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#9ca3af', fontSize: 12}} dy={10} />
                               <YAxis axisLine={false} tickLine={false} tick={{fill:'#9ca3af', fontSize: 12}} />
                               <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', color: '#fff' }} />
                               <Legend />
                               <Bar dataKey="revenue" fill="#1a1a1a" radius={[4,4,0,0]} name="Gross Revenue" barSize={40}/>
                               <Bar dataKey="active" fill="#facc15" radius={[4,4,0,0]} name="Payouts" barSize={40} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>
               </div>
            )}

            {financeTab === 'Payouts' && (
               <div className="animate-fade-in bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Practitioner</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Period</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Scheduled Date</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {mockPayouts.map(p => (
                           <tr key={p.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4 font-bold text-gray-900">{p.practitioner}</td>
                              <td className="px-6 py-4 font-medium">{p.amount}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{p.period}</td>
                              <td className="px-6 py-4">
                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                     p.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                     p.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                                     p.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                     p.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                     'bg-gray-100 text-gray-700'
                                 }`}>
                                    {p.status}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{p.scheduledDate}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    {p.status === 'Scheduled' && (
                                       <button className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Process Now">
                                          <Play size={16} fill="currentColor"/>
                                       </button>
                                    )}
                                    {p.status === 'Scheduled' && (
                                       <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full" title="Hold Payout">
                                          <PauseCircle size={16}/>
                                       </button>
                                    )}
                                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full" title="Download Invoice">
                                       <Download size={16}/>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {financeTab === 'Failed' && (
               <div className="animate-fade-in bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900">Failed Payments</h3>
                      <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900">
                          <Download size={16}/> Export List
                      </button>
                  </div>
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Reason</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                           <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {mockFailedPayments.map(fp => (
                           <tr key={fp.id} className="hover:bg-red-50/10">
                              <td className="px-6 py-4 font-bold text-gray-900">{fp.user}</td>
                              <td className="px-6 py-4 font-medium text-red-600">{fp.amount}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{fp.reason}</td>
                              <td className="px-6 py-4 text-sm text-gray-400">{fp.date}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button className="px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1">
                                       <RefreshCw size={12}/> Retry
                                    </button>
                                    <button className="px-3 py-1 bg-white border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-1">
                                       <Mail size={12}/> Email
                                    </button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {financeTab === 'Analytics' && (
               <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Revenue by Practitioner */}
                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">Top Revenue by Practitioner</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeAnalyticsData.revenueByPractitioner} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 700}} />
                                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px' }}/>
                                <Bar dataKey="revenue" fill="#1a1a1a" radius={[0, 4, 4, 0]} barSize={24} name="Revenue ($)" />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Revenue by Category */}
                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">Revenue by Category</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                   data={financeAnalyticsData.revenueByCategory} 
                                   cx="50%" 
                                   cy="50%" 
                                   innerRadius={60} 
                                   outerRadius={100} 
                                   paddingAngle={5} 
                                   dataKey="value"
                                >
                                   {financeAnalyticsData.revenueByCategory.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                   ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px' }}/>
                                <Legend verticalAlign="middle" align="right" layout="vertical"/>
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Subscription vs One-Time */}
                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">Subscription vs. One-Time</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={financeAnalyticsData.subVsOneTime}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px' }} />
                                <Legend />
                                <Bar dataKey="subscription" fill="#1a1a1a" stackId="a" name="Subscription" />
                                <Bar dataKey="oneTime" fill="#facc15" stackId="a" name="One-Time" radius={[4,4,0,0]} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                  </div>

                  {/* Refund Rate Trends */}
                  <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-6">Refund Rate Trends (%)</h3>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={financeAnalyticsData.refundTrends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                         </ResponsiveContainer>
                      </div>
                  </div>
               </div>
            )}
        </div>
    );
  };

  const renderSystemAnalytics = () => {
    return (
      <div className="space-y-8 animate-fade-in pb-10">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h1 className="text-3xl font-bold text-gray-900">System-Wide Analytics</h1>
               <p className="text-gray-500 mt-1">Comprehensive platform performance and health metrics.</p>
            </div>
            <div className="flex flex-wrap gap-2">
               <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <Clock size={16} className="text-gray-400"/>
                  <select 
                    value={analyticsRange} 
                    onChange={e => setAnalyticsRange(e.target.value)} 
                    className="text-sm font-bold bg-transparent border-none outline-none text-gray-700"
                  >
                     <option>7 Days</option>
                     <option>30 Days</option>
                     <option>90 Days</option>
                     <option>1 Year</option>
                  </select>
               </div>
               <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <User size={16} className="text-gray-400"/>
                  <select 
                    value={analyticsPractitionerFilter} 
                    onChange={e => setAnalyticsPractitionerFilter(e.target.value)} 
                    className="text-sm font-bold bg-transparent border-none outline-none text-gray-700 max-w-[120px]"
                  >
                     <option>All Practitioners</option>
                     <option>Enterprise Only</option>
                     <option>Active Only</option>
                  </select>
               </div>
               <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
                  <Globe size={16} className="text-gray-400"/>
                  <select 
                    value={analyticsCategoryFilter} 
                    onChange={e => setAnalyticsCategoryFilter(e.target.value)} 
                    className="text-sm font-bold bg-transparent border-none outline-none text-gray-700 max-w-[120px]"
                  >
                     <option>All Categories</option>
                     <option>Mindfulness</option>
                     <option>Business</option>
                     <option>Health</option>
                  </select>
               </div>
               <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm shadow hover:bg-black transition-colors">
                  <Download size={16}/> Export
               </button>
            </div>
         </div>

         {/* Top-Level Metrics */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard label="Total Users" value="12,450" trend="+8% mo" trendUp={true} icon={<Users size={20}/>} />
            <MetricCard label="Active Users" value="8,230" trend="+5% mo" trendUp={true} icon={<Activity size={20}/>} />
            <MetricCard label="Courses Created" value="340" trend="+12 this week" trendUp={true} icon={<BookOpen size={20}/>} />
            <MetricCard label="Revenue MTD" value="$45.2K" trend="+15% vs last" trendUp={true} icon={<DollarSign size={20}/>} />
            <MetricCard label="Churn Rate" value="4.2%" trend="-0.5% improvement" trendUp={true} icon={<TrendingDown size={20}/>} />
         </div>

         {/* Charts Row 1 */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth */}
            <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-6 text-lg">User Growth & Retention</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={analyticsData.userGrowth}>
                        <defs>
                           <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Legend />
                        <Area type="monotone" dataKey="activeUsers" name="Active Users" stroke="#10b981" strokeWidth={3} fill="url(#colorActive)" />
                        <Area type="monotone" dataKey="newSignups" name="New Signups" stroke="#3b82f6" strokeWidth={3} fill="none" />
                        <Area type="monotone" dataKey="churnedUsers" name="Churned" stroke="#ef4444" strokeWidth={3} fill="none" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Practitioner Activity */}
            <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-6 text-lg">Practitioner Performance by Tier</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={analyticsData.practitionerActivity} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                        <XAxis type="number" hide />
                        <YAxis dataKey="tier" type="category" width={80} axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 700}} />
                        <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px' }}/>
                        <Legend />
                        <Bar dataKey="clientAcquisition" name="Client Acquisition" fill="#1a1a1a" radius={[0, 4, 4, 0]} barSize={20} />
                        <Bar dataKey="courseCreation" name="Courses Created" fill="#facc15" radius={[0, 4, 4, 0]} barSize={20} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Charts Row 2 */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform Health */}
            <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     <Server size={18}/> Platform Health
                  </h3>
                  <div className="flex gap-2">
                     <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        <CheckCircle size={12}/> 99.98% Uptime
                     </span>
                  </div>
               </div>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <ComposedChart data={analyticsData.platformHealth}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px' }} />
                        <Legend />
                        <Area yAxisId="left" type="monotone" dataKey="apiRequests" name="API Requests" fill="#e0e7ff" stroke="#6366f1" />
                        <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Response Time (ms)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                        <Line yAxisId="right" type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="#ef4444" strokeWidth={2} dot={false} />
                     </ComposedChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Revenue Metrics */}
            <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
               <h3 className="font-bold text-gray-900 mb-6 text-lg">Financial Overview</h3>
               <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={analyticsData.revenueMetrics}>
                        <defs>
                           <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#facc15" stopOpacity={0.4}/>
                              <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                        <Tooltip contentStyle={{ borderRadius: '12px', backgroundColor: '#1a1a1a', color: 'white' }} itemStyle={{color: 'white'}} />
                        <Legend />
                        <Area type="monotone" dataKey="gross" name="Gross Revenue" stroke="#1a1a1a" strokeWidth={3} fill="url(#colorGross)" />
                        <Area type="monotone" dataKey="net" name="Net Revenue" stroke="#facc15" strokeWidth={3} fill="url(#colorNet)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeView) {
      case SuperAdminViewState.DASHBOARD:
        // ... (Existing Dashboard render)
        return (
          <div className="space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard label="Total Practitioners" value="3,450" trend="+12 this week" trendUp={true} icon={<Users size={20}/>} />
                <MetricCard label="Total End Users" value="85.2k" trend="+5.4% growth" trendUp={true} icon={<Users size={20}/>} />
                <MetricCard label="System Health" value="99.9%" trend="All systems go" trendUp={true} icon={<Settings size={20}/>} />
                <MetricCard label="Monthly Revenue" value="$425k" trend="+12% vs last mo" trendUp={true} icon={<DollarSign size={20}/>} />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Main Chart */}
                 <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Activity</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                          <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderRadius: '12px', border: 'none', color: '#fff' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#ca8a04" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                          <Area type="monotone" dataKey="active" stroke="#9ca3af" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Recent Alerts */}
                 <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
                     <h3 className="text-xl font-bold text-gray-900 mb-6">System Alerts</h3>
                     <div className="space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
                           <ShieldAlert className="text-red-500 mt-1" size={20} />
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">High Load Warning</h4>
                              <p className="text-xs text-gray-500 mt-1">API latency spike detected in US-East region.</p>
                           </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
                           <AlertTriangle className="text-yellow-600 mt-1" size={20} />
                           <div>
                              <h4 className="font-bold text-gray-900 text-sm">Compliance Update</h4>
                              <p className="text-xs text-gray-500 mt-1">GDPR export requests pending (5).</p>
                           </div>
                        </div>
                     </div>
                 </div>
             </div>
          </div>
        );
      
      case SuperAdminViewState.PRACTITIONERS:
        if (selectedPractitioner) {
          return renderPractitionerDetail();
        }
        return (
          <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Practitioner Management</h2>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-full bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400" />
                   </div>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:bg-gray-50">
                      <Filter size={16}/> Filter
                   </button>
                </div>
             </div>

             <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Practitioner</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Business</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Stats</th>
                      <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {practitionersData.map(p => (
                      <tr 
                        key={p.id} 
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPractitioner(p)}
                      >
                         <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                             <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full" />
                             <div>
                               <div className="font-bold text-gray-900">{p.name}</div>
                               <div className="text-xs text-gray-500">{p.joinedDate}</div>
                             </div>
                           </div>
                         </td>
                         <td className="py-4 px-6">
                            <div className="text-sm font-medium text-gray-900">{p.businessName}</div>
                            <div className="text-xs text-gray-500">{p.niche}</div>
                         </td>
                         <td className="py-4 px-6">
                            <div className="text-xs text-gray-500">
                               <span className="font-bold text-gray-900">{p.coursesCount}</span> Courses • <span className="font-bold text-gray-900">{p.clientsCount}</span> Clients
                            </div>
                         </td>
                         <td className="py-4 px-6">
                           {p.status === 'Active' && <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</span>}
                           {p.status === 'Pending' && <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Pending Review</span>}
                           {p.status === 'Suspended' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Suspended</span>}
                         </td>
                         <td className="py-4 px-6 text-right">
                            {p.status === 'Pending' ? (
                               <div className="flex justify-end gap-2">
                                  <button onClick={(e) => {e.stopPropagation();}} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"><CheckCircle size={16}/></button>
                                  <button onClick={(e) => {e.stopPropagation();}} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100"><XCircle size={16}/></button>
                               </div>
                            ) : (
                              <button onClick={(e) => {e.stopPropagation();}} className="p-2 text-gray-400 hover:text-gray-900"><MoreVertical size={16}/></button>
                            )}
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        );

      case SuperAdminViewState.USERS:
          return renderUserManagement();

      case SuperAdminViewState.LIBRARY:
          return renderLibraryManagement();
      
      case SuperAdminViewState.ANALYTICS:
          return renderSystemAnalytics();

      case SuperAdminViewState.PERSONAS:
        // ... (Existing Personas render)
        return (
            <div className="space-y-6 animate-fade-in">
               <div className="flex justify-between items-center">
                  <div>
                     <h2 className="text-2xl font-bold text-gray-900">AI Coach Personas</h2>
                     <p className="text-sm text-gray-500">Create and manage the personalities for your AI agents.</p>
                  </div>
                  <button 
                    onClick={() => handleOpenPersonaModal()}
                    className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                  >
                      <Plus size={18} /> Create Persona
                  </button>
               </div>
  
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {personas.map(persona => (
                     <div key={persona.id} className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-stone-100 rounded-2xl flex items-center justify-center p-1">
                                 <img src={persona.avatar} alt={persona.name} className="w-full h-full rounded-xl" />
                              </div>
                              <div>
                                 <h3 className="font-bold text-gray-900 text-lg">{persona.name}</h3>
                                 <p className="text-xs text-gray-500">Used by {persona.activeUsers} students</p>
                              </div>
                           </div>
                           <div className="flex gap-1">
                              <button onClick={() => handleOpenPersonaModal(persona)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-stone-50"><Edit2 size={16}/></button>
                              <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"><Trash2 size={16}/></button>
                           </div>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                           {persona.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-600 rounded-lg text-xs font-bold">{tag}</span>
                           ))}
                        </div>
  
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Tone</span>
                              <span className="font-medium text-gray-900 text-right">{persona.toneStyle.slice(0, 2).join(', ')}</span>
                           </div>
                           <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Style</span>
                              <span className="font-medium text-gray-900">{persona.responseStyle}</span>
                           </div>
                        </div>
  
                        <div className="pt-4 border-t border-gray-100">
                           <button onClick={() => handleOpenPersonaModal(persona)} className="w-full py-2 bg-stone-50 hover:bg-stone-100 rounded-xl text-sm font-bold text-gray-600 flex items-center justify-center gap-2">
                              <MessageSquare size={16}/> Test Conversation
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
  
               {/* Modal */}
               {isPersonaModalOpen && editingPersona && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                     <div className="bg-white rounded-[32px] w-full max-w-6xl h-[85vh] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-fade-in">
                        
                        {/* Left: Configuration */}
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-gray-100">
                           <div className="flex justify-between items-center mb-6">
                              <h2 className="text-2xl font-bold text-gray-900">Configure Persona</h2>
                           </div>
  
                           <div className="space-y-6">
                              {/* Basic Identity */}
                              <div className="bg-stone-50 p-6 rounded-[24px]">
                                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Identity</h3>
                                 <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1">
                                        <div className="w-24 h-24 bg-white rounded-2xl mx-auto flex items-center justify-center border border-gray-200 text-gray-400 mb-2">
                                            {editingPersona.name ? 
                                              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${editingPersona.name}`} className="w-full h-full rounded-2xl"/> 
                                              : <Bot size={32}/>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-span-2 space-y-4">
                                        <div>
                                           <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                           <input 
                                              value={editingPersona.name} 
                                              onChange={e => setEditingPersona({...editingPersona, name: e.target.value})}
                                              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none" 
                                              placeholder="e.g. Atlas"
                                            />
                                        </div>
                                        <div>
                                           <label className="block text-sm font-bold text-gray-700 mb-1">Tags (Courses)</label>
                                           <input 
                                              onKeyDown={handleAddTag}
                                              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none" 
                                              placeholder="Type tag & enter..."
                                            />
                                            <div className="flex flex-wrap gap-1 mt-2">
                                               {editingPersona.tags?.map(t => (
                                                  <span key={t} className="px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold">{t}</span>
                                               ))}
                                            </div>
                                        </div>
                                    </div>
                                 </div>
                              </div>
  
                              {/* Personality Settings */}
                              <div className="bg-stone-50 p-6 rounded-[24px]">
                                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Personality</h3>
                                 
                                 <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Tone Style</label>
                                    <div className="flex flex-wrap gap-2">
                                       {['Empathetic', 'Direct', 'Analytical', 'Humorous', 'Formal', 'Coaching'].map(tone => (
                                          <button 
                                            key={tone}
                                            onClick={() => {
                                              const current = editingPersona.toneStyle || [];
                                              const newVal = current.includes(tone) ? current.filter(t => t !== tone) : [...current, tone];
                                              setEditingPersona({...editingPersona, toneStyle: newVal});
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                               editingPersona.toneStyle?.includes(tone) 
                                               ? 'bg-gray-900 text-white border-gray-900' 
                                               : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                            }`}
                                          >
                                             {tone}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
  
                                 <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Response Style</label>
                                    <div className="grid grid-cols-2 gap-3">
                                       {['Concise', 'Detailed', 'Conversational', 'Socratic'].map(style => (
                                          <button 
                                            key={style}
                                            onClick={() => setEditingPersona({...editingPersona, responseStyle: style as any})}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                                               editingPersona.responseStyle === style 
                                               ? 'bg-yellow-400 text-gray-900 border-yellow-400' 
                                               : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                            }`}
                                          >
                                             {style}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </div>
  
                              {/* Advanced Prompting */}
                              <div className="bg-stone-50 p-6 rounded-[24px]">
                                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Bot size={16}/> System Intelligence
                                 </h3>
                                 
                                 <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-2">System Prompt</label>
                                    <textarea 
                                       value={editingPersona.systemPrompt}
                                       onChange={e => setEditingPersona({...editingPersona, systemPrompt: e.target.value})}
                                       className="w-full px-4 py-3 rounded-xl bg-gray-900 text-green-400 font-mono text-xs leading-relaxed border-none focus:ring-2 focus:ring-yellow-400 outline-none h-48"
                                       placeholder="You are an AI coach designed to..."
                                    />
                                 </div>
  
                                 <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Example Phrases</label>
                                    <textarea 
                                       value={editingPersona.examplePhrases?.join('\n')}
                                       onChange={e => setEditingPersona({...editingPersona, examplePhrases: e.target.value.split('\n')})}
                                       className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-yellow-400 outline-none h-24"
                                       placeholder="Enter one phrase per line..."
                                    />
                                 </div>
                              </div>
  
                              {/* Actions */}
                              <div className="flex gap-4 pt-4">
                                 <button onClick={() => setIsPersonaModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-stone-50">Cancel</button>
                                 <button onClick={handleSavePersona} className="flex-1 bg-gray-900 text-white rounded-xl font-bold py-3 hover:bg-black transition-colors">Save Persona</button>
                              </div>
                           </div>
                        </div>
  
                        {/* Right: Test Chat */}
                        <div className="w-full md:w-[450px] bg-stone-100 flex flex-col h-full border-l border-gray-200">
                           <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center">
                              <div>
                                 <h3 className="font-bold text-gray-900">Preview & Test</h3>
                                 <p className="text-xs text-gray-500">Chat with {editingPersona.name || 'your persona'}</p>
                              </div>
                              <button onClick={() => setIsPersonaModalOpen(false)} className="md:hidden p-2 text-gray-500"><X size={20}/></button>
                           </div>
  
                           <div className="flex-1 p-6 overflow-y-auto space-y-4">
                              {testChatMessages.map((msg, idx) => (
                                 <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    {msg.role === 'ai' && (
                                       <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center mr-2 flex-shrink-0 text-xs font-bold">
                                          AI
                                       </div>
                                    )}
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                       msg.role === 'user' 
                                       ? 'bg-gray-900 text-white rounded-tr-none' 
                                       : 'bg-white text-gray-800 shadow-sm rounded-tl-none'
                                    }`}>
                                       {msg.text}
                                    </div>
                                 </div>
                              ))}
                           </div>
  
                           <div className="p-4 bg-white border-t border-gray-200">
                              <form onSubmit={handleTestChatSend} className="relative">
                                 <input 
                                   value={testChatInput}
                                   onChange={e => setTestChatInput(e.target.value)}
                                   className="w-full pl-4 pr-12 py-3 bg-stone-100 rounded-xl border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
                                   placeholder="Type a message..."
                                 />
                                 <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-yellow-400 rounded-lg hover:bg-yellow-300 text-gray-900 transition-colors">
                                    <Play size={14} fill="currentColor"/>
                                 </button>
                              </form>
                           </div>
                        </div>
  
                     </div>
                  </div>
               )}
            </div>
          );

      case SuperAdminViewState.MODERATION:
         return renderModeration();
         
      case SuperAdminViewState.COMPLIANCE:
         return renderCompliance();

      case SuperAdminViewState.FINANCE:
        return renderFinance();

      default:
        return <div className="p-10 text-center text-gray-500">Coming Soon</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans text-primary overflow-hidden selection:bg-yellow-200 animate-fade-in">
       {/* Admin Sidebar */}
       <aside className="w-72 hidden lg:flex flex-col p-6 h-screen sticky top-0 bg-[#0f0f0f] text-white">
          <div className="mb-10 px-4">
             <div className="text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">Super Admin</div>
             <h1 className="text-2xl font-bold tracking-tight">Crextio Portal</h1>
          </div>
          
          <nav className="flex-1 space-y-2">
             <button
               onClick={() => setActiveView(SuperAdminViewState.DASHBOARD)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.DASHBOARD ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <LayoutDashboard size={20} /> <span className="font-medium text-sm">Dashboard</span>
             </button>
             <button
               onClick={() => {
                  setActiveView(SuperAdminViewState.PRACTITIONERS);
                  setSelectedPractitioner(null);
               }}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.PRACTITIONERS ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Users size={20} /> <span className="font-medium text-sm">Practitioners</span>
             </button>
             <button
               onClick={() => {
                   setActiveView(SuperAdminViewState.USERS);
                   setSelectedUser(null);
               }}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.USERS ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Users size={20} /> <span className="font-medium text-sm">End Users</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.ANALYTICS)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.ANALYTICS ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <BarChart2 size={20} /> <span className="font-medium text-sm">Analytics</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.LIBRARY)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.LIBRARY ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <FolderOpen size={20} /> <span className="font-medium text-sm">Global Library</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.PERSONAS)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.PERSONAS ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Bot size={20} /> <span className="font-medium text-sm">AI Personas</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.MODERATION)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.MODERATION ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <ShieldAlert size={20} /> <span className="font-medium text-sm">Moderation</span>
               <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.FINANCE)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.FINANCE ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <DollarSign size={20} /> <span className="font-medium text-sm">Finance</span>
             </button>
             <button
               onClick={() => setActiveView(SuperAdminViewState.COMPLIANCE)}
               className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${activeView === SuperAdminViewState.COMPLIANCE ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
             >
               <Gavel size={20} /> <span className="font-medium text-sm">Compliance</span>
             </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-800">
             <div className="flex items-center gap-3 px-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">SA</div>
                <div>
                   <p className="text-sm font-bold">Super Admin</p>
                   <p className="text-xs text-gray-400">System Owner</p>
                </div>
             </div>
             <button 
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-sm font-medium"
             >
                <LogOut size={16} /> Logout System
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 h-screen overflow-y-auto overflow-x-hidden relative scroll-smooth no-scrollbar">
          {/* Admin Header */}
          <header className="sticky top-0 z-20 px-8 py-6 bg-stone-50/90 backdrop-blur-md flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-900 lg:hidden">Portal</h2>
             <div className="ml-auto flex items-center gap-4">
                <div className="hidden md:flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                   <Search size={16} className="text-gray-400 mr-2" />
                   <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-64" />
                </div>
                <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600 relative">
                   <Bell size={20} />
                   <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
             </div>
          </header>

          <div className="px-8 pb-12 pt-2 max-w-[1600px] mx-auto">
             {renderContent()}
          </div>
       </main>
    </div>
  );
};

export default SuperAdminDashboard;
