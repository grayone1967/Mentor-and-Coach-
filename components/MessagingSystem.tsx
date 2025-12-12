
import React, { useState } from 'react';
import {
  Search,
  Plus,
  Inbox,
  Send,
  Archive,
  MoreVertical,
  Paperclip,
  Smile,
  X,
  ChevronLeft,
  Check,
  CheckCheck
} from 'lucide-react';

// --- Types for Messaging ---
interface Message {
  id: string;
  senderId: string;
  senderType: 'practitioner' | 'client';
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  courseName: string;
  folder: 'inbox' | 'sent' | 'archived';
  unreadCount: number;
  messages: Message[];
  lastMessageTime: string;
}

// --- Mock Data ---
const mockConversations: Conversation[] = [
  {
    id: 'c1',
    clientId: '1',
    clientName: 'Sarah Jenkins',
    clientAvatar: 'https://i.pravatar.cc/150?u=1',
    courseName: 'Mindset Mastery',
    folder: 'inbox',
    unreadCount: 2,
    lastMessageTime: '10:30 AM',
    messages: [
      { id: 'm1', senderId: '1', senderType: 'client', text: 'Hi! I was struggling a bit with the Week 4 exercises. Can you give me some tips on how to handle the anxiety triggers?', timestamp: '10:15 AM', read: true },
      { id: 'm2', senderId: 'me', senderType: 'practitioner', text: 'Hey Sarah! Absolutely. Remember to use the breathing technique we practiced. Start small.', timestamp: '10:20 AM', read: true },
      { id: 'm3', senderId: '1', senderType: 'client', text: 'That helps, thank you! I will try it tonight.', timestamp: '10:25 AM', read: false },
      { id: 'm4', senderId: '1', senderType: 'client', text: 'Also, when is our next live session?', timestamp: '10:30 AM', read: false },
    ]
  },
  {
    id: 'c2',
    clientId: '2',
    clientName: 'Michael Chen',
    clientAvatar: 'https://i.pravatar.cc/150?u=2',
    courseName: 'Career Acceleration',
    folder: 'inbox',
    unreadCount: 0,
    lastMessageTime: 'Yesterday',
    messages: [
      { id: 'm1', senderId: 'me', senderType: 'practitioner', text: 'Great progress on your resume update, Michael.', timestamp: 'Yesterday', read: true },
      { id: 'm2', senderId: '2', senderType: 'client', text: 'Thanks! I feel much more confident applying now.', timestamp: 'Yesterday', read: true },
    ]
  },
  {
    id: 'c3',
    clientId: '3',
    clientName: 'Jessica Bloom',
    clientAvatar: 'https://i.pravatar.cc/150?u=3',
    courseName: 'Financial Freedom',
    folder: 'archived',
    unreadCount: 0,
    lastMessageTime: 'Oct 12',
    messages: [
      { id: 'm1', senderId: '3', senderType: 'client', text: 'I completed the budget worksheet.', timestamp: 'Oct 12', read: true },
    ]
  },
  {
    id: 'c4',
    clientId: '4',
    clientName: 'David Ross',
    clientAvatar: 'https://i.pravatar.cc/150?u=4',
    courseName: 'Mindset Mastery',
    folder: 'sent',
    unreadCount: 0,
    lastMessageTime: 'Oct 10',
    messages: [
        { id: 'm1', senderId: 'me', senderType: 'practitioner', text: 'Just checking in, haven\'t seen you active lately.', timestamp: 'Oct 10', read: true },
    ]
  }
];

const MessagingSystem: React.FC = () => {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'archived'>('inbox');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  // Compose State
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const filteredConversations = mockConversations.filter(c => c.folder === activeFolder);
  const selectedConversation = mockConversations.find(c => c.id === selectedConversationId);

  // Helper to get unread count for folder
  const getFolderCount = (folder: 'inbox' | 'sent' | 'archived') => {
    if (folder === 'inbox') return mockConversations.filter(c => c.folder === 'inbox' && c.unreadCount > 0).length;
    return 0;
  };

  const handleSendMessage = () => {
    if (!replyText.trim() || !selectedConversation) return;
    // In a real app, you would push to the backend
    const newMessage: Message = {
      id: Math.random().toString(),
      senderId: 'me',
      senderType: 'practitioner',
      text: replyText,
      timestamp: 'Just now',
      read: false
    };
    selectedConversation.messages.push(newMessage);
    selectedConversation.lastMessageTime = 'Just now';
    selectedConversation.folder = 'sent'; // Move to sent logically if it was a new thread, but here we just append
    setReplyText('');
  };

  const handleComposeSubmit = () => {
      // Logic to create new conversation
      setIsComposeOpen(false);
      setComposeTo('');
      setComposeSubject('');
      setComposeBody('');
      alert("Message sent! (Simulation)");
  };

  return (
    <div className="flex h-[calc(100vh-100px)] rounded-[32px] overflow-hidden bg-white border border-stone-100 shadow-sm animate-fade-in relative">
      
      {/* 1. LEFT PANEL: FOLDERS */}
      <div className="w-64 bg-stone-50 border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6">
           <button 
             onClick={() => setIsComposeOpen(true)}
             className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
           >
             <Plus size={18} /> New Message
           </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
           <button 
             onClick={() => setActiveFolder('inbox')}
             className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeFolder === 'inbox' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <div className="flex items-center gap-3"><Inbox size={18} /> Inbox</div>
             {getFolderCount('inbox') > 0 && <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full text-xs">{getFolderCount('inbox')}</span>}
           </button>
           <button 
             onClick={() => setActiveFolder('sent')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeFolder === 'sent' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <Send size={18} /> Sent
           </button>
           <button 
             onClick={() => setActiveFolder('archived')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${activeFolder === 'archived' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:bg-gray-100'}`}
           >
             <Archive size={18} /> Archived
           </button>
        </nav>
      </div>

      {/* 2. MIDDLE PANEL: CONVERSATION LIST */}
      <div className={`${selectedConversationId ? 'hidden lg:flex' : 'flex'} w-full lg:w-96 bg-white border-r border-gray-200 flex-col`}>
         <div className="p-4 border-b border-gray-100">
             <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                 <input type="text" placeholder="Search messages..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm" />
             </div>
         </div>
         
         <div className="flex-1 overflow-y-auto custom-scrollbar">
             {filteredConversations.map(conv => (
                 <div 
                   key={conv.id} 
                   onClick={() => setSelectedConversationId(conv.id)}
                   className={`p-4 border-b border-gray-50 hover:bg-stone-50 cursor-pointer transition-colors ${selectedConversationId === conv.id ? 'bg-stone-50 border-l-4 border-l-yellow-400' : 'border-l-4 border-l-transparent'}`}
                 >
                     <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-3">
                           <img src={conv.clientAvatar} alt={conv.clientName} className="w-10 h-10 rounded-full bg-gray-200" />
                           <div className="overflow-hidden">
                              <h4 className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{conv.clientName}</h4>
                              <p className="text-xs text-yellow-600 font-bold truncate">{conv.courseName}</p>
                           </div>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">{conv.lastMessageTime}</span>
                     </div>
                     <div className="pl-13 mt-1 flex justify-between items-end gap-2">
                        <p className={`text-xs line-clamp-2 ${conv.unreadCount > 0 ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>
                           {conv.messages[conv.messages.length - 1].text}
                        </p>
                        {conv.unreadCount > 0 && (
                            <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                {conv.unreadCount}
                            </span>
                        )}
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* 3. RIGHT PANEL: MESSAGE THREAD */}
      <div className={`${!selectedConversationId ? 'hidden lg:flex' : 'flex'} flex-1 flex-col bg-stone-50`}>
         {selectedConversation ? (
             <>
                {/* Header */}
                <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                   <div className="flex items-center gap-4">
                      <button className="lg:hidden text-gray-500" onClick={() => setSelectedConversationId(null)}>
                         <ChevronLeft size={24}/>
                      </button>
                      <img src={selectedConversation.clientAvatar} alt={selectedConversation.clientName} className="w-10 h-10 rounded-full border border-gray-100" />
                      <div>
                         <h3 className="font-bold text-gray-900">{selectedConversation.clientName}</h3>
                         <p className="text-xs text-gray-500">{selectedConversation.courseName}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:bg-stone-50 rounded-full"><Search size={20}/></button>
                      <button className="p-2 text-gray-400 hover:bg-stone-50 rounded-full"><MoreVertical size={20}/></button>
                   </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                   {selectedConversation.messages.map((msg, idx) => (
                      <div key={msg.id} className={`flex flex-col ${msg.senderType === 'practitioner' ? 'items-end' : 'items-start'}`}>
                         <div className={`max-w-[70%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative group ${
                             msg.senderType === 'practitioner' 
                             ? 'bg-blue-600 text-white rounded-br-none' 
                             : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                         }`}>
                             {msg.text}
                             
                             {/* Timestamp Tooltip */}
                             <div className={`absolute bottom-0 ${msg.senderType === 'practitioner' ? '-left-14' : '-right-14'} opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-400 py-2`}>
                                {msg.timestamp}
                             </div>
                         </div>
                         {msg.senderType === 'practitioner' && (
                             <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                {msg.read ? <CheckCheck size={12}/> : <Check size={12}/>}
                                {msg.read ? 'Read' : 'Delivered'}
                             </div>
                         )}
                      </div>
                   ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                   <div className="flex flex-col gap-2 bg-stone-50 p-2 rounded-[24px] border border-gray-200 focus-within:border-yellow-400 focus-within:ring-1 focus-within:ring-yellow-400 transition-all">
                      <textarea 
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type a reply..."
                        className="w-full bg-transparent border-none outline-none text-sm px-4 py-2 min-h-[60px] resize-none"
                      />
                      <div className="flex justify-between items-center px-2 pb-1">
                         <div className="flex gap-1">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"><Paperclip size={18}/></button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full"><Smile size={18}/></button>
                         </div>
                         <button 
                           onClick={handleSendMessage}
                           disabled={!replyText.trim()}
                           className="bg-gray-900 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                         >
                            Send <Send size={14}/>
                         </button>
                      </div>
                   </div>
                </div>
             </>
         ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                 <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                     <Inbox size={40} />
                 </div>
                 <p className="font-bold text-gray-900">No Conversation Selected</p>
                 <p className="text-sm">Choose a thread from the list or start a new one.</p>
             </div>
         )}
      </div>

      {/* COMPOSE MODAL */}
      {isComposeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
             <div className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl flex flex-col animate-scale-in overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                   <h3 className="font-bold text-gray-900">New Message</h3>
                   <button onClick={() => setIsComposeOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
                </div>
                
                <div className="p-6 space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">To:</label>
                      <select 
                        value={composeTo}
                        onChange={e => setComposeTo(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                      >
                         <option value="">Select a Client...</option>
                         <option value="1">Sarah Jenkins</option>
                         <option value="2">Michael Chen</option>
                         <option value="3">Jessica Bloom</option>
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject:</label>
                      <input 
                        type="text" 
                        value={composeSubject}
                        onChange={e => setComposeSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none"
                      />
                   </div>

                   <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400">
                       <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex gap-2">
                           <button className="p-1 text-gray-500 hover:bg-gray-200 rounded"><span className="font-bold font-serif">B</span></button>
                           <button className="p-1 text-gray-500 hover:bg-gray-200 rounded"><span className="italic font-serif">I</span></button>
                           <button className="p-1 text-gray-500 hover:bg-gray-200 rounded"><span className="underline font-serif">U</span></button>
                       </div>
                       <textarea 
                          value={composeBody}
                          onChange={e => setComposeBody(e.target.value)}
                          className="w-full p-4 h-40 resize-none outline-none text-sm"
                          placeholder="Write your message..."
                       />
                   </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                   <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"><Paperclip size={18}/></button>
                      <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"><Smile size={18}/></button>
                   </div>
                   <div className="flex gap-3">
                      <button onClick={() => setIsComposeOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-900">Cancel</button>
                      <button onClick={handleComposeSubmit} className="px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black">Send Message</button>
                   </div>
                </div>
             </div>
          </div>
      )}

    </div>
  );
};

export default MessagingSystem;
