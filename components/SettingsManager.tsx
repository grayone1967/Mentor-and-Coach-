
import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Mail, 
  Lock, 
  Trash2, 
  Camera, 
  Palette, 
  Bell, 
  CreditCard, 
  Shield, 
  Sliders, 
  Save, 
  CheckCircle, 
  Download, 
  ExternalLink,
  Smartphone,
  Check
} from 'lucide-react';

const SettingsManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Branding' | 'Notifications' | 'Billing' | 'Security' | 'Preferences'>('Profile');
  const [isSaving, setIsSaving] = useState(false);

  // --- MOCK STATE ---
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: 'Lora Piterson',
    email: 'lora@crextio.com',
    businessName: 'Mindful Growth Coaching',
    bio: 'Certified life coach specializing in mindfulness and career transitions.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
  });

  // Branding State
  const [brandingData, setBrandingData] = useState({
    primaryColor: '#facc15',
    secondaryColor: '#1a1a1a',
    font: 'Plus Jakarta Sans',
    logo: ''
  });

  // Notifications State
  const [notifications, setNotifications] = useState({
    email_enrollment: true,
    email_completion: true,
    email_redflag: true, // Always true visually, maybe disabled
    email_message: true,
    email_summary: false,
    email_payment: true,
    app_message: true,
    app_task: false,
    app_milestone: true
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In real app, toast success here
    }, 1000);
  };

  const tabs = [
    { id: 'Profile', icon: <User size={18}/> },
    { id: 'Branding', icon: <Palette size={18}/> },
    { id: 'Notifications', icon: <Bell size={18}/> },
    { id: 'Billing', icon: <CreditCard size={18}/> },
    { id: 'Security', icon: <Shield size={18}/> },
    { id: 'Preferences', icon: <Sliders size={18}/> },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
           <p className="text-gray-500 mt-1">Manage your account, preferences, and billing.</p>
        </div>
        <button 
           onClick={handleSave}
           disabled={isSaving}
           className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-colors flex items-center gap-2 disabled:opacity-70"
        >
           {isSaving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
         {/* Navigation Tabs */}
         <div className="w-full lg:w-64 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
            {tabs.map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                     activeTab === tab.id 
                     ? 'bg-white shadow-md text-gray-900 border border-gray-100' 
                     : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                  }`}
               >
                  {tab.icon}
                  {tab.id}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="flex-1 bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm min-h-[500px]">
            
            {/* --- PROFILE TAB --- */}
            {activeTab === 'Profile' && (
               <div className="max-w-2xl space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                  
                  {/* Photo */}
                  <div className="flex items-center gap-6">
                     <div className="relative group cursor-pointer">
                        <img src={profileData.avatar} alt="Profile" className="w-24 h-24 rounded-full border-4 border-stone-50 shadow-sm" />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <Camera size={24} className="text-white"/>
                        </div>
                     </div>
                     <div>
                        <button className="px-4 py-2 bg-stone-100 rounded-xl text-sm font-bold text-gray-700 hover:bg-stone-200 transition-colors">Change Photo</button>
                        <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max 1MB.</p>
                     </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                           <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input 
                              value={profileData.name}
                              onChange={e => setProfileData({...profileData, name: e.target.value})}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 font-medium"
                           />
                        </div>
                     </div>
                     
                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input 
                              value={profileData.email}
                              onChange={e => setProfileData({...profileData, email: e.target.value})}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 font-medium"
                           />
                        </div>
                     </div>

                     <div className="col-span-2 md:col-span-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Name</label>
                        <div className="relative">
                           <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input 
                              value={profileData.businessName}
                              onChange={e => setProfileData({...profileData, businessName: e.target.value})}
                              className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 font-medium"
                           />
                        </div>
                     </div>

                     <div className="col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio</label>
                        <textarea 
                           value={profileData.bio}
                           onChange={e => setProfileData({...profileData, bio: e.target.value})}
                           className="w-full p-4 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 font-medium h-32 resize-none"
                        />
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 space-y-4">
                     <button className="flex items-center gap-2 text-gray-600 font-bold hover:text-gray-900">
                        <Lock size={18} /> Change Password
                     </button>
                     <button className="flex items-center gap-2 text-red-500 font-bold hover:text-red-700">
                        <Trash2 size={18} /> Delete Account
                     </button>
                  </div>
               </div>
            )}

            {/* --- BRANDING TAB --- */}
            {activeTab === 'Branding' && (
               <div className="flex flex-col xl:flex-row gap-10 animate-fade-in">
                  <div className="flex-1 space-y-8">
                     <h2 className="text-2xl font-bold text-gray-900 mb-6">Brand Customization</h2>
                     
                     {/* Logo */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Logo</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-400 hover:bg-yellow-50 transition-colors">
                           {brandingData.logo ? (
                              <img src={brandingData.logo} alt="Logo" className="h-12 object-contain" />
                           ) : (
                              <div className="text-gray-400">
                                 <UploadIcon />
                                 <span className="text-sm font-bold block mt-2">Upload Logo</span>
                                 <span className="text-xs mt-1 block">Recommended: 200x60px</span>
                              </div>
                           )}
                        </div>
                     </div>

                     {/* Colors */}
                     <div className="grid grid-cols-2 gap-6">
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Primary Color</label>
                           <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl">
                              <input 
                                 type="color" 
                                 value={brandingData.primaryColor}
                                 onChange={e => setBrandingData({...brandingData, primaryColor: e.target.value})}
                                 className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                              />
                              <span className="font-mono text-sm font-bold text-gray-600 uppercase">{brandingData.primaryColor}</span>
                           </div>
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secondary Color</label>
                           <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl">
                              <input 
                                 type="color" 
                                 value={brandingData.secondaryColor}
                                 onChange={e => setBrandingData({...brandingData, secondaryColor: e.target.value})}
                                 className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                              />
                              <span className="font-mono text-sm font-bold text-gray-600 uppercase">{brandingData.secondaryColor}</span>
                           </div>
                        </div>
                     </div>

                     {/* Font */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Font Family</label>
                        <select 
                           value={brandingData.font}
                           onChange={e => setBrandingData({...brandingData, font: e.target.value})}
                           className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900 font-medium"
                        >
                           <option value="Plus Jakarta Sans">Plus Jakarta Sans (Default)</option>
                           <option value="Inter">Inter</option>
                           <option value="Roboto">Roboto</option>
                           <option value="Merriweather">Merriweather</option>
                        </select>
                     </div>
                  </div>

                  {/* Preview */}
                  <div className="w-full xl:w-80">
                     <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Preview</label>
                     <div className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden relative">
                         {/* Fake Mobile Header */}
                         <div className="h-14 flex items-center justify-between px-4" style={{ backgroundColor: brandingData.primaryColor }}>
                             <div className="w-20 h-4 bg-white/30 rounded"></div>
                             <div className="w-8 h-8 bg-white/30 rounded-full"></div>
                         </div>
                         {/* Fake Body */}
                         <div className="p-6 space-y-4 bg-stone-50 h-64">
                             <div className="h-24 bg-white rounded-2xl shadow-sm p-4 flex gap-3">
                                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                                <div className="flex-1 space-y-2">
                                   <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
                                   <div className="w-1/2 h-2 bg-gray-100 rounded"></div>
                                </div>
                             </div>
                             <button className="w-full py-3 rounded-xl font-bold text-white shadow-sm" style={{ backgroundColor: brandingData.secondaryColor }}>
                                 Start Session
                             </button>
                         </div>
                     </div>
                     <p className="text-xs text-center text-gray-400 mt-4">How your course appears to clients.</p>
                  </div>
               </div>
            )}

            {/* --- NOTIFICATIONS TAB --- */}
            {activeTab === 'Notifications' && (
               <div className="max-w-2xl space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h2>

                  {/* Email Section */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Mail size={16}/> Email Notifications</h3>
                     <div className="bg-stone-50 rounded-2xl p-6 space-y-4">
                        <Toggle 
                           label="New Client Enrollment" 
                           checked={notifications.email_enrollment} 
                           onChange={() => setNotifications({...notifications, email_enrollment: !notifications.email_enrollment})} 
                        />
                        <Toggle 
                           label="Client Completes Course" 
                           checked={notifications.email_completion} 
                           onChange={() => setNotifications({...notifications, email_completion: !notifications.email_completion})} 
                        />
                         <Toggle 
                           label="Red Flag Alerts" 
                           checked={true} 
                           onChange={() => {}} 
                           disabled={true}
                           helper="Critical alerts are always enabled."
                        />
                        <Toggle 
                           label="New Messages" 
                           checked={notifications.email_message} 
                           onChange={() => setNotifications({...notifications, email_message: !notifications.email_message})} 
                        />
                        <Toggle 
                           label="Weekly Summary Report" 
                           checked={notifications.email_summary} 
                           onChange={() => setNotifications({...notifications, email_summary: !notifications.email_summary})} 
                        />
                        <Toggle 
                           label="Payment Notifications" 
                           checked={notifications.email_payment} 
                           onChange={() => setNotifications({...notifications, email_payment: !notifications.email_payment})} 
                        />
                     </div>
                  </div>

                  {/* App Section */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Smartphone size={16}/> In-App Notifications</h3>
                     <div className="bg-stone-50 rounded-2xl p-6 space-y-4">
                        <Toggle 
                           label="Real-time Message Alerts" 
                           checked={notifications.app_message} 
                           onChange={() => setNotifications({...notifications, app_message: !notifications.app_message})} 
                        />
                         <Toggle 
                           label="Task Completion Alerts" 
                           checked={notifications.app_task} 
                           onChange={() => setNotifications({...notifications, app_task: !notifications.app_task})} 
                        />
                        <Toggle 
                           label="Client Milestone Alerts" 
                           checked={notifications.app_milestone} 
                           onChange={() => setNotifications({...notifications, app_milestone: !notifications.app_milestone})} 
                        />
                     </div>
                  </div>
               </div>
            )}

            {/* --- BILLING TAB --- */}
            {activeTab === 'Billing' && (
               <div className="space-y-8 animate-fade-in">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing & Payouts</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Current Plan */}
                     <div className="bg-gray-900 text-white p-8 rounded-[24px] shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <h3 className="text-lg font-medium text-gray-300 mb-2">Current Plan</h3>
                        <div className="text-3xl font-bold mb-4">Professional Plan</div>
                        <div className="text-2xl font-bold text-yellow-400 mb-6">$49<span className="text-sm text-gray-400 font-medium">/month</span></div>
                        <div className="space-y-2 mb-8">
                           <div className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-400"/> Unlimited Clients</div>
                           <div className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-400"/> AI Course Builder</div>
                           <div className="flex items-center gap-2 text-sm"><CheckCircle size={14} className="text-green-400"/> Advanced Analytics</div>
                        </div>
                        <button className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-colors">Manage Subscription</button>
                     </div>

                     {/* Payment Method */}
                     <div className="bg-white border border-gray-200 p-8 rounded-[24px] shadow-sm flex flex-col justify-between">
                        <div>
                           <h3 className="text-lg font-bold text-gray-900 mb-6">Payment Method</h3>
                           <div className="flex items-center gap-4 mb-4">
                              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                                 <div className="w-6 h-4 bg-gray-800 rounded-sm"></div>
                              </div>
                              <div>
                                 <p className="font-bold text-gray-900">Visa ending in 4242</p>
                                 <p className="text-sm text-gray-500">Expires 12/28</p>
                              </div>
                           </div>
                           <button className="text-sm font-bold text-blue-600 hover:underline">Update Payment Method</button>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100 mt-6">
                           <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Settings</h3>
                           <button className="w-full py-3 border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-stone-50 flex items-center justify-center gap-2">
                              <ExternalLink size={16}/> Connect Stripe
                           </button>
                        </div>
                     </div>
                  </div>

                  {/* Invoice History */}
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-4">Billing History</h3>
                     <div className="bg-stone-50 rounded-[24px] overflow-hidden border border-stone-100">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-stone-100 text-gray-500 font-bold uppercase text-xs">
                              <tr>
                                 <th className="px-6 py-4">Date</th>
                                 <th className="px-6 py-4">Invoice #</th>
                                 <th className="px-6 py-4">Amount</th>
                                 <th className="px-6 py-4">Status</th>
                                 <th className="px-6 py-4 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-200">
                              {[1, 2, 3].map(i => (
                                 <tr key={i} className="hover:bg-white/50">
                                    <td className="px-6 py-4 font-medium text-gray-900">Oct 01, 2025</td>
                                    <td className="px-6 py-4 text-gray-500">INV-2025-00{i}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">$49.00</td>
                                    <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Paid</span></td>
                                    <td className="px-6 py-4 text-right">
                                       <button className="text-gray-400 hover:text-gray-900"><Download size={16}/></button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
               </div>
            )}

            {/* Placeholders for Security & Preferences */}
            {(activeTab === 'Security' || activeTab === 'Preferences') && (
               <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                     {activeTab === 'Security' ? <Shield size={40}/> : <Sliders size={40}/>}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{activeTab} Settings</h3>
                  <p className="text-gray-500">This section is coming soon.</p>
               </div>
            )}

         </div>
      </div>
    </div>
  );
};

// Helper Components

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void; disabled?: boolean; helper?: string }> = ({ label, checked, onChange, disabled, helper }) => (
   <div className={`flex items-start justify-between ${disabled ? 'opacity-70' : ''}`}>
      <div>
         <span className="font-bold text-gray-700 text-sm">{label}</span>
         {helper && <p className="text-xs text-gray-400 mt-1">{helper}</p>}
      </div>
      <button 
         onClick={onChange}
         disabled={disabled}
         className={`w-12 h-6 rounded-full p-1 transition-colors relative ${checked ? 'bg-yellow-400' : 'bg-gray-200'}`}
      >
         <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : ''}`} />
      </button>
   </div>
);

const UploadIcon = () => (
   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L12 3L7 8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 3V15" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
   </svg>
);

export default SettingsManager;
