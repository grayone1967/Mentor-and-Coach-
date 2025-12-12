import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Filter, 
  Download, 
  X, 
  MessageSquare, 
  User, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  MoreHorizontal,
  Send,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Alert } from '../types';

// Mock Data
const mockAlerts: Alert[] = [
  {
    id: '1',
    clientId: 'c1',
    clientName: 'Sarah Jenkins',
    clientAvatar: 'https://i.pravatar.cc/150?u=1',
    courseName: 'Mindset Mastery',
    week: 'Week 4',
    severity: 'Critical',
    issue: 'Severe distress language detected',
    timestamp: '2 hours ago',
    context: 'Client used language indicating severe emotional distress in journal entry regarding "Loss and Grief". Keywords detected: "hopeless", "giving up".',
    status: 'Pending',
    suggestedActions: [
      'Send supportive message immediately',
      'Review recent journal entries for pattern',
      'Consider offering a 1:1 crisis session'
    ]
  },
  {
    id: '2',
    clientId: 'c2',
    clientName: 'Mike Thompson',
    clientAvatar: 'https://i.pravatar.cc/150?u=2',
    courseName: 'Focus Builder',
    week: 'Week 2',
    severity: 'Warning',
    issue: 'No activity for 7 days',
    timestamp: '1 day ago',
    context: 'Client has not logged in or completed any tasks for 7 consecutive days. Previous engagement was high.',
    status: 'Pending',
    suggestedActions: [
      'Send check-in message',
      'Verify if notification settings are enabled'
    ]
  },
  {
    id: '3',
    clientId: 'c3',
    clientName: 'Jessica Bloom',
    clientAvatar: 'https://i.pravatar.cc/150?u=3',
    courseName: 'Financial Freedom',
    week: 'Week 1',
    severity: 'Warning',
    issue: 'Skipped 3 consecutive lessons',
    timestamp: '2 days ago',
    context: 'Client marked 3 lessons as skipped without viewing content.',
    status: 'Pending',
    suggestedActions: [
      'Ask for feedback on course difficulty',
      'Remind about the importance of foundational lessons'
    ]
  },
  {
    id: '4',
    clientId: 'c4',
    clientName: 'David Ross',
    clientAvatar: 'https://i.pravatar.cc/150?u=4',
    courseName: 'Mindset Mastery',
    week: 'Week 6',
    severity: 'Resolved',
    issue: 'Negative sentiment in AI chat',
    timestamp: '5 days ago',
    context: 'Expressed frustration with AI coach responses.',
    status: 'Resolved',
    suggestedActions: []
  }
];

const RedFlagMonitoring: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Critical' | 'Warning' | 'Resolved'>('Critical');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [internalNote, setInternalNote] = useState('');

  // Filter alerts based on active tab
  const filteredAlerts = mockAlerts.filter(alert => {
    if (activeTab === 'Resolved') return alert.severity === 'Resolved' || alert.status === 'Resolved';
    return alert.severity === activeTab && alert.status !== 'Resolved';
  });

  const getCounts = () => {
    const critical = mockAlerts.filter(a => a.severity === 'Critical' && a.status !== 'Resolved').length;
    const warning = mockAlerts.filter(a => a.severity === 'Warning' && a.status !== 'Resolved').length;
    const resolved = mockAlerts.filter(a => a.status === 'Resolved' || a.severity === 'Resolved').length;
    return { critical, warning, resolved };
  };

  const counts = getCounts();

  const handleResolve = (e: React.MouseEvent, alertId: string) => {
     e.stopPropagation();
     // In a real app, update state/backend
     alert("Alert marked as resolved");
     if(selectedAlert?.id === alertId) setSelectedAlert(null);
  };

  return (
    <div className="space-y-6 animate-fade-in relative pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Red Flags & Alerts
              <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
           </h1>
           <p className="text-gray-500 mt-1">Monitor critical client signals and activity alerts.</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-bold text-sm text-gray-600 hover:bg-stone-50 transition-colors">
              <Filter size={16}/> Filter
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full font-bold text-sm text-gray-600 hover:bg-stone-50 transition-colors">
              <Download size={16}/> Export
           </button>
        </div>
      </div>

      {/* Tabs / Priority Queue */}
      <div className="bg-white p-2 rounded-[24px] border border-stone-100 inline-flex gap-2 shadow-sm">
         <button 
           onClick={() => setActiveTab('Critical')}
           className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
             activeTab === 'Critical' 
             ? 'bg-red-50 text-red-700 shadow-sm ring-1 ring-red-200' 
             : 'text-gray-500 hover:bg-gray-50'
           }`}
         >
           <ShieldAlert size={18} className={activeTab === 'Critical' ? 'text-red-600' : 'text-gray-400'}/>
           Critical ({counts.critical})
         </button>
         <button 
           onClick={() => setActiveTab('Warning')}
           className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
             activeTab === 'Warning' 
             ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
             : 'text-gray-500 hover:bg-gray-50'
           }`}
         >
           <AlertTriangle size={18} className={activeTab === 'Warning' ? 'text-amber-600' : 'text-gray-400'}/>
           Warnings ({counts.warning})
         </button>
         <button 
           onClick={() => setActiveTab('Resolved')}
           className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all ${
             activeTab === 'Resolved' 
             ? 'bg-gray-100 text-gray-700 shadow-sm ring-1 ring-gray-200' 
             : 'text-gray-500 hover:bg-gray-50'
           }`}
         >
           <CheckCircle size={18} className={activeTab === 'Resolved' ? 'text-gray-600' : 'text-gray-400'}/>
           Resolved ({counts.resolved})
         </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
         {filteredAlerts.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200">
                 <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                     <CheckCircle size={32}/>
                 </div>
                 <h3 className="font-bold text-gray-900 text-lg">All Clear</h3>
                 <p className="text-gray-500">No {activeTab.toLowerCase()} alerts to review.</p>
             </div>
         ) : (
             filteredAlerts.map(alert => (
               <div 
                 key={alert.id}
                 onClick={() => setSelectedAlert(alert)}
                 className={`group p-6 rounded-[32px] border-2 transition-all cursor-pointer relative bg-white hover:shadow-lg ${
                   alert.severity === 'Critical' ? 'border-red-100 hover:border-red-300' :
                   alert.severity === 'Warning' ? 'border-amber-100 hover:border-amber-300' :
                   'border-stone-100 hover:border-stone-300'
                 }`}
               >
                  <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                     <div className="flex items-start gap-4">
                        <div className="relative">
                           <img src={alert.clientAvatar} alt={alert.clientName} className="w-14 h-14 rounded-2xl object-cover" />
                           <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                             alert.severity === 'Critical' ? 'bg-red-500 text-white' :
                             alert.severity === 'Warning' ? 'bg-amber-500 text-white' :
                             'bg-gray-400 text-white'
                           }`}>
                             {alert.severity === 'Critical' ? <ShieldAlert size={12}/> : alert.severity === 'Warning' ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                           </div>
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              {alert.severity === 'Critical' && <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Critical Alert</span>}
                              {alert.severity === 'Warning' && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Warning</span>}
                              {alert.severity === 'Resolved' && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Resolved</span>}
                              <span className="text-gray-400 text-xs flex items-center gap-1"><Clock size={12}/> Triggered {alert.timestamp}</span>
                           </div>
                           <h3 className="text-lg font-bold text-gray-900 mb-1">{alert.issue}</h3>
                           <p className="text-sm text-gray-500 flex items-center gap-2">
                              <span className="font-medium text-gray-900">{alert.clientName}</span> • {alert.courseName} <span className="bg-stone-100 px-2 rounded text-xs text-gray-600">{alert.week}</span>
                           </p>
                        </div>
                     </div>

                     <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                         <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 hover:bg-stone-50 text-gray-700 rounded-xl font-bold text-sm transition-colors">Review</button>
                         {alert.status !== 'Resolved' && (
                             <button onClick={(e) => handleResolve(e, alert.id)} className="px-4 py-3 bg-white border border-gray-200 hover:bg-green-50 hover:text-green-600 text-gray-400 rounded-xl transition-colors" title="Mark Resolved">
                                 <CheckCircle size={20}/>
                             </button>
                         )}
                         <button className="px-4 py-3 bg-white border border-gray-200 hover:bg-stone-50 text-gray-400 rounded-xl transition-colors">
                            <MoreHorizontal size={20}/>
                         </button>
                     </div>
                  </div>
               </div>
             ))
         )}
      </div>

      {/* DETAIL MODAL */}
      {selectedAlert && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                 
                 {/* Modal Header */}
                 <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-stone-50">
                     <div className="flex items-center gap-3">
                         <div className={`p-2 rounded-xl ${
                             selectedAlert.severity === 'Critical' ? 'bg-red-100 text-red-600' :
                             selectedAlert.severity === 'Warning' ? 'bg-amber-100 text-amber-600' :
                             'bg-gray-100 text-gray-600'
                         }`}>
                             {selectedAlert.severity === 'Critical' ? <ShieldAlert size={24}/> : <AlertTriangle size={24}/>}
                         </div>
                         <div>
                             <h3 className="font-bold text-gray-900 text-lg">Alert Details</h3>
                             <p className="text-xs text-gray-500 flex items-center gap-1">
                                 ID: #{selectedAlert.id} • <Clock size={12}/> {selectedAlert.timestamp}
                             </p>
                         </div>
                     </div>
                     <button onClick={() => setSelectedAlert(null)} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                         <X size={24}/>
                     </button>
                 </div>

                 {/* Modal Content */}
                 <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                     
                     {/* Client Info Bar */}
                     <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                         <img src={selectedAlert.clientAvatar} alt={selectedAlert.clientName} className="w-12 h-12 rounded-full" />
                         <div className="flex-1">
                             <h4 className="font-bold text-gray-900">{selectedAlert.clientName}</h4>
                             <p className="text-xs text-gray-500">{selectedAlert.courseName} • <span className="font-medium text-gray-700">{selectedAlert.week}</span></p>
                         </div>
                         <button className="text-sm font-bold text-gray-900 hover:text-yellow-600 flex items-center gap-1">
                             View Profile <ChevronRight size={16}/>
                         </button>
                     </div>

                     {/* Issue Context */}
                     <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Context & Triggers</h4>
                         <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 text-gray-800 leading-relaxed text-sm">
                             <p className="font-medium mb-2">{selectedAlert.issue}</p>
                             <p className="text-gray-600">{selectedAlert.context}</p>
                         </div>
                     </div>

                     {/* Suggested Actions */}
                     {selectedAlert.suggestedActions.length > 0 && (
                         <div>
                             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Actions</h4>
                             <div className="space-y-2">
                                 {selectedAlert.suggestedActions.map((action, idx) => (
                                     <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-yellow-400 hover:bg-yellow-50/50 transition-colors cursor-pointer group">
                                         <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-yellow-400 group-hover:text-yellow-400">
                                             <ArrowRight size={14}/>
                                         </div>
                                         <span className="text-sm font-medium text-gray-700">{action}</span>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     )}

                     {/* Action Buttons Grid */}
                     <div className="grid grid-cols-2 gap-4">
                         <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all gap-2 text-gray-600 hover:text-gray-900">
                             <FileText size={20}/>
                             <span className="font-bold text-xs">View Journal</span>
                         </button>
                         <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all gap-2 text-gray-600 hover:text-gray-900">
                             <MessageSquare size={20}/>
                             <span className="font-bold text-xs">Pre-written Msg</span>
                         </button>
                     </div>

                     {/* Internal Notes */}
                     <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Internal Notes</h4>
                         <textarea 
                             value={internalNote}
                             onChange={(e) => setInternalNote(e.target.value)}
                             placeholder="Add notes about this incident..."
                             className="w-full p-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm min-h-[100px] resize-none"
                         />
                     </div>
                 </div>

                 {/* Footer Actions */}
                 <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                     <button className="text-red-500 font-bold text-sm hover:underline">Escalate Issue</button>
                     <div className="flex gap-3">
                         <button 
                             onClick={() => alert("Simulating message send...")}
                             className="px-6 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold text-sm hover:bg-stone-50 flex items-center gap-2"
                         >
                             <Send size={16}/> Message
                         </button>
                         <button 
                             onClick={(e) => handleResolve(e, selectedAlert.id)}
                             className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black flex items-center gap-2"
                         >
                             <CheckCircle size={16}/> Mark Reviewed
                         </button>
                     </div>
                 </div>
             </div>
         </div>
      )}
    </div>
  );
};

export default RedFlagMonitoring;