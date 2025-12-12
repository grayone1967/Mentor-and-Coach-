
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  Trash2, 
  Users, 
  Image as ImageIcon, 
  X,
  FileText,
  MessageSquare,
  CheckCircle,
  Video,
  Music,
  AlignLeft,
  Bot,
  Globe,
  Edit2,
  FolderOpen,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Send,
  Clock,
  Layout,
  DollarSign,
  Save,
  GripVertical,
  MoreVertical,
  Copy,
  Eye,
  AlertCircle,
  Calendar,
  Lock,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Course, Week, Task, Persona, Material, TaskType } from '../types';
import { courseService } from '../services/courseService';
import { authService } from '../services/authService';
import { supabase } from '../services/supabaseClient';

interface CourseManagerProps {
  onBack: () => void;
  availableMaterials?: Material[];
  onNavigateToLibrary: (courseId?: string) => void;
  initialMode?: 'LIST' | 'CREATE_FLOW';
}

type StageView = 'LIST' | 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4' | 'STAGE_5' | 'STAGE_6' | 'OVERVIEW';

// --- HELPER COMPONENTS ---

const DeleteConfirmationModal: React.FC<{
    title: string;
    itemTitle: string;
    itemType: 'Task' | 'Week';
    impact: { clients: number; completions: number; resources: number };
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ title, itemTitle, itemType, impact, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-[24px] w-full max-w-md shadow-2xl flex flex-col overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50">
                <div className="flex items-center gap-2 text-red-600 font-bold">
                    <AlertTriangle size={24}/>
                    <h3>{title}</h3>
                </div>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-900"><X size={20}/></button>
            </div>
            
            <div className="p-6">
                <p className="text-gray-600 mb-4">
                    You are about to delete {itemType.toLowerCase()}: <br/>
                    <span className="font-bold text-gray-900 block mt-1 text-lg">"{itemTitle}"</span>
                </p>
                
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Impact Analysis</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {impact.clients} enrolled clients have this {itemType.toLowerCase()}
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {impact.completions} clients have completed it
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            {impact.resources} linked resources will be unlinked
                        </li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-3 italic">Progress data will be retained for reporting purposes.</p>
                </div>

                <p className="text-sm font-bold text-red-600">⚠️ This action cannot be undone.</p>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
                <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={onConfirm} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Delete {itemType}</button>
            </div>
        </div>
    </div>
);

const TaskEditorModal: React.FC<{
    task: Task;
    availableMaterials: Material[];
    onSave: (updatedTask: Task) => void;
    onClose: () => void;
}> = ({ task, availableMaterials, onSave, onClose }) => {
    const [editedTask, setEditedTask] = useState<Task>({ ...task });
    const [activeTab, setActiveTab] = useState<'Basic' | 'AI' | 'Resources'>('Basic');

    // Simulate adding/removing resources (local state for now)
    const toggleResource = (resourceId: string) => {
        // In a real implementation, Task would have a list of resource IDs
        // For now, we simulate via a mocked property or just UI toggle
        console.log("Toggle resource", resourceId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-[32px] w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-stone-50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Edit Task: {task.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">Configure content, AI instructions, and resources.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => onSave(editedTask)} className="bg-gray-900 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg">
                            Save Changes
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-200 transition-colors">
                            <X size={24}/>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-8 border-b border-gray-100 flex gap-6">
                    {['Basic', 'AI', 'Resources'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`py-4 text-sm font-bold border-b-2 transition-all ${
                                activeTab === tab 
                                ? 'border-yellow-400 text-gray-900' 
                                : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {tab === 'Basic' ? 'Basic Info' : tab === 'AI' ? 'AI Configuration' : 'Resources'}
                        </button>
                    ))}
                </div>
                
                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white">
                    {activeTab === 'Basic' && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title*</label>
                                <input 
                                    value={editedTask.title}
                                    onChange={e => setEditedTask({...editedTask, title: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-gray-900 text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Type*</label>
                                    <select 
                                        value={editedTask.type}
                                        onChange={e => setEditedTask({...editedTask, type: e.target.value as TaskType})}
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-gray-900"
                                    >
                                        <option value="Lesson">Lesson</option>
                                        <option value="Daily Check-in">Daily Check-in</option>
                                        <option value="Journaling">Journaling</option>
                                        <option value="Reflection">Reflection</option>
                                        <option value="AI Conversation">AI Conversation</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Estimated Duration</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="e.g., 10 mins"
                                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-gray-900"
                                        />
                                        <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    value={editedTask.description}
                                    onChange={e => setEditedTask({...editedTask, description: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none min-h-[150px] resize-none text-gray-700 leading-relaxed"
                                    placeholder="Describe the task for the student..."
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'AI' && (
                        <div className="space-y-6">
                            <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
                                <h4 className="text-sm font-bold text-yellow-800 mb-4 flex items-center gap-2">
                                    <Bot size={18}/> AI Coach Context
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-yellow-800/70 uppercase tracking-wider mb-2">Task Objective</label>
                                        <input 
                                            value={editedTask.objective || ''}
                                            onChange={e => setEditedTask({...editedTask, objective: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm"
                                            placeholder="What is the specific goal of this interaction?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-yellow-800/70 uppercase tracking-wider mb-2">Context for AI</label>
                                        <textarea 
                                            value={editedTask.context || ''}
                                            onChange={e => setEditedTask({...editedTask, context: e.target.value})}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-yellow-200 focus:ring-2 focus:ring-yellow-400 outline-none text-sm h-24 resize-none"
                                            placeholder="What should the AI know about the user's progress or previous tasks?"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Coach Notes (Internal)</label>
                                    <textarea 
                                        value={editedTask.coachNotes || ''}
                                        onChange={e => setEditedTask({...editedTask, coachNotes: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-sm h-40 resize-none"
                                        placeholder="Internal notes about the tone or approach..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">System Instructions</label>
                                    <textarea 
                                        value={editedTask.aiInstructions || ''}
                                        onChange={e => setEditedTask({...editedTask, aiInstructions: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 text-green-400 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-xs font-mono h-40 resize-none"
                                        placeholder="You are a supportive coach. Ask the user..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Resources' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-gray-900">Linked Resources</h4>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-stone-200">Upload New</button>
                                    <button className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-bold text-gray-600 hover:bg-stone-200">Browse Library</button>
                                </div>
                            </div>

                            {/* Mock Linked List */}
                            <div className="space-y-2">
                                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Music size={18}/></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Morning Meditation.mp3</p>
                                            <p className="text-xs text-gray-500">Audio • 10 mins</p>
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-xs font-bold">Unlink</button>
                                </div>
                                <div className="p-4 rounded-xl border border-gray-200 flex items-center justify-between bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-600 rounded-lg"><FileText size={18}/></div>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">Journal Prompts.pdf</p>
                                            <p className="text-xs text-gray-500">PDF • 2 pages</p>
                                        </div>
                                    </div>
                                    <button className="text-red-500 hover:text-red-700 text-xs font-bold">Unlink</button>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-gray-900 mb-4">Recommended from Library</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {availableMaterials.slice(0, 4).map(m => (
                                        <div key={m.id} className="p-3 rounded-xl border border-gray-100 bg-stone-50 hover:bg-white hover:shadow-sm transition-all cursor-pointer flex items-center gap-3 group">
                                            <div className="p-2 bg-white rounded-lg text-gray-400 group-hover:text-yellow-500">
                                                {m.type === 'Audio' ? <Music size={16}/> : <FileText size={16}/>}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-bold text-xs text-gray-900 truncate">{m.title}</p>
                                                <p className="text-[10px] text-gray-500 truncate">{m.category.join(', ')}</p>
                                            </div>
                                            <Plus size={16} className="text-gray-400 hover:text-green-500"/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- STAGE COMPONENTS ---

const Stage1Details: React.FC<{ 
    availableMaterials: Material[], 
    onComplete: () => void 
}> = ({ availableMaterials, onComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Mindset',
        durationValue: 4,
        image: ''
    });

    const handleCreate = async () => {
        if (!formData.title) return alert("Please enter a course title");
        
        setIsLoading(true);
        try {
            const session = await authService.getSession();
            if (session?.user) {
                // Create course in DB
                await courseService.createCourse(session.user.id, { 
                    ...formData, 
                    durationUnit: 'Weeks' 
                });
                onComplete();
            }
        } catch (e: any) { 
            console.error(e); 
            alert(`Failed to create course: ${e.message}`); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[32px] text-white shadow-lg">
                 <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
                     <FileText size={24} className="text-yellow-400"/> Course Essentials
                 </h3>
                 <p className="text-gray-300 opacity-90">Start by defining the core identity of your new course.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Course Title</label>
                    <input 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-xl font-bold text-gray-900 placeholder-gray-300"
                        placeholder="e.g., Mindset Mastery 101"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                    <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none h-32 resize-none text-gray-700"
                        placeholder="What will students learn in this course?"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                        <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none font-medium text-gray-900"
                        >
                            <option>Mindset</option>
                            <option>Career</option>
                            <option>Health</option>
                            <option>Relationships</option>
                            <option>Finance</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (Weeks)</label>
                        <input 
                            type="number"
                            value={formData.durationValue}
                            onChange={e => setFormData({...formData, durationValue: parseInt(e.target.value) || 4})}
                            className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none font-bold text-gray-900"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleCreate}
                    disabled={isLoading}
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20}/> : <ArrowRight size={20}/>}
                    {isLoading ? 'Creating...' : 'Create & Continue'}
                </button>
            </div>
        </div>
    );
};

const Stage2AIChat: React.FC<{ 
    courseId: string;
    contextData: any;
    availableMaterials: Material[];
    onComplete: () => void;
}> = ({ courseId, contextData, availableMaterials, onComplete }) => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
        { role: 'model', text: `Hi! I'm your Course Architect. I see we're building "${contextData?.title || 'a new course'}". Describe your target audience and key learning outcomes, and I'll generate a weekly structure for you.` }
    ]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedStructure, setGeneratedStructure] = useState<Week[] | null>(null);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsGenerating(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            const prompt = `
                Act as an expert instructional designer. 
                Context: Creating a course titled "${contextData?.title}" about "${contextData?.description}".
                Duration: ${contextData?.durationValue || 4} weeks.
                User Request: ${userMsg}
                
                Generate a structured course outline in JSON format.
                The response must be a JSON object with a property "weeks" which is an array of objects.
                Each week object must have:
                - weekNumber (integer)
                - title (string)
                - overview (string)
                - objectives (array of strings)
                - tasks (array of objects with: title, type (Lesson, Reflection, Journaling, Daily Check-in, AI Conversation), description, objective)
            `;

            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json'
                }
            });

            const responseText = result.text || '{}';
            const structure = JSON.parse(responseText);
            
            if (structure.weeks) {
                setGeneratedStructure(structure.weeks);
                setMessages(prev => [...prev, { role: 'model', text: "I've generated a course structure based on your requirements. Review it below, or tell me what changes you'd like to make." }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: "I couldn't generate a valid structure. Please try again with more specific details." }]);
            }

        } catch (error) {
            console.error("AI Generation Error:", error);
            setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error generating the structure. Please try again." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveAndContinue = async () => {
        if (!generatedStructure) return;
        setIsGenerating(true);
        try {
            await courseService.saveCourseStructure(courseId, generatedStructure);
            await courseService.updateCourseStage(courseId, 3);
            onComplete();
        } catch (error) {
            console.error("Save Error:", error);
            alert("Failed to save structure.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-200px)] max-w-5xl mx-auto gap-6">
            <div className="flex-1 flex gap-6 min-h-0">
                {/* Chat Column */}
                <div className="w-1/3 flex flex-col bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
                    <div className="p-4 bg-gray-900 text-white font-bold flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-400"/> AI Architect
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-white ml-8 shadow-sm text-gray-800' : 'bg-blue-50 mr-8 text-blue-900'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isGenerating && <div className="text-center text-xs text-gray-400 animate-pulse">Thinking...</div>}
                    </div>
                    <div className="p-3 bg-white border-t border-gray-100">
                        <div className="relative">
                            <input 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Describe your course..."
                                className="w-full pl-4 pr-12 py-3 rounded-xl bg-stone-100 border-none outline-none text-sm focus:ring-2 focus:ring-yellow-400"
                            />
                            <button onClick={handleSend} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-lg hover:bg-black">
                                <Send size={14}/>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="flex-1 bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Structure Preview</h3>
                        {generatedStructure && (
                            <button 
                                onClick={handleSaveAndContinue}
                                className="bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <CheckCircle size={16}/> Approve & Save
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-stone-50">
                        {generatedStructure ? (
                            generatedStructure.map((week, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                    <h4 className="font-bold text-gray-900 mb-1">Week {week.weekNumber}: {week.title}</h4>
                                    <p className="text-sm text-gray-500 mb-3">{week.overview}</p>
                                    <div className="space-y-2">
                                        {week.tasks.map((task, tIdx) => (
                                            <div key={tIdx} className="flex items-center gap-2 text-xs bg-stone-50 p-2 rounded-lg border border-stone-100">
                                                <span className="font-bold text-gray-700">{task.type}:</span> {task.title}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Bot size={48} className="mb-4 opacity-20"/>
                                <p>Chat with the AI to generate your course structure.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Stage3Structure: React.FC<{
    courseId: string;
    onComplete: () => void;
    availableMaterials?: Material[];
}> = ({ courseId, onComplete, availableMaterials = [] }) => {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Editor State
    const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<{task: Task, weekId: string} | null>(null);
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    
    // Deletion State
    const [deleteItem, setDeleteItem] = useState<{ type: 'Task' | 'Week', id: string, title: string, weekId?: string } | null>(null);

    useEffect(() => {
        loadStructure();
    }, [courseId]);

    const loadStructure = async () => {
        try {
            const courses = await courseService.getCourses((await authService.getSession())?.user.id || '');
            const course = courses.find(c => c.id === courseId);
            if (course && course.weeks && course.weeks.length > 0) {
                setWeeks(course.weeks);
                setSelectedWeekId(course.weeks[0].id);
            }
        } catch (e) {
            console.error("Failed to load structure", e);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskSave = (updatedTask: Task) => {
        if (!editingTask) return;
        const updatedWeeks = weeks.map(week => {
            if (week.id === editingTask.weekId) {
                return {
                    ...week,
                    tasks: week.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
                };
            }
            return week;
        });
        setWeeks(updatedWeeks);
        setEditingTask(null);
    };

    const handleSaveAll = async () => {
        setLoading(true);
        try {
            await courseService.saveCourseStructure(courseId, weeks);
            await courseService.updateCourseStage(courseId, 4);
            onComplete();
        } catch (e) {
            console.error(e);
            alert("Failed to save structure");
        } finally {
            setLoading(false);
        }
    };

    const handleMoveWeek = (index: number, direction: 'up' | 'down') => {
        const newWeeks = [...weeks];
        if (direction === 'up' && index > 0) {
            [newWeeks[index], newWeeks[index - 1]] = [newWeeks[index - 1], newWeeks[index]];
        } else if (direction === 'down' && index < newWeeks.length - 1) {
            [newWeeks[index], newWeeks[index + 1]] = [newWeeks[index + 1], newWeeks[index]];
        }
        // Update week numbers
        newWeeks.forEach((w, i) => w.weekNumber = i + 1);
        setWeeks(newWeeks);
    };

    const handleMoveTask = (weekId: string, taskIndex: number, direction: 'up' | 'down') => {
        const updatedWeeks = weeks.map(week => {
            if (week.id === weekId) {
                const newTasks = [...week.tasks];
                if (direction === 'up' && taskIndex > 0) {
                    [newTasks[taskIndex], newTasks[taskIndex - 1]] = [newTasks[taskIndex - 1], newTasks[taskIndex]];
                } else if (direction === 'down' && taskIndex < newTasks.length - 1) {
                    [newTasks[taskIndex], newTasks[taskIndex + 1]] = [newTasks[taskIndex + 1], newTasks[taskIndex]];
                }
                return { ...week, tasks: newTasks };
            }
            return week;
        });
        setWeeks(updatedWeeks);
    };

    const confirmDelete = () => {
        if (!deleteItem) return;
        
        if (deleteItem.type === 'Week') {
            const newWeeks = weeks.filter(w => w.id !== deleteItem.id);
            newWeeks.forEach((w, i) => w.weekNumber = i + 1);
            setWeeks(newWeeks);
            if (selectedWeekId === deleteItem.id) setSelectedWeekId(newWeeks[0]?.id || null);
        } else {
            const updatedWeeks = weeks.map(week => {
                if (week.id === deleteItem.weekId) {
                    return { ...week, tasks: week.tasks.filter(t => t.id !== deleteItem.id) };
                }
                return week;
            });
            setWeeks(updatedWeeks);
        }
        setDeleteItem(null);
    };

    const toggleTaskExpand = (taskId: string) => {
        const newSet = new Set(expandedTasks);
        if (newSet.has(taskId)) newSet.delete(taskId);
        else newSet.add(taskId);
        setExpandedTasks(newSet);
    };

    const selectedWeek = weeks.find(w => w.id === selectedWeekId);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin"/></div>;

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
            {/* Delete Modal */}
            {deleteItem && (
                <DeleteConfirmationModal
                    title={`Delete ${deleteItem.type}?`}
                    itemTitle={deleteItem.title}
                    itemType={deleteItem.type}
                    impact={{
                        clients: Math.floor(Math.random() * 50), // Mock data
                        completions: Math.floor(Math.random() * 100),
                        resources: Math.floor(Math.random() * 5)
                    }}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteItem(null)}
                />
            )}

            {/* Task Editor Modal */}
            {editingTask && (
                <TaskEditorModal 
                    task={editingTask.task} 
                    availableMaterials={availableMaterials}
                    onSave={handleTaskSave} 
                    onClose={() => setEditingTask(null)}
                />
            )}

            {/* Main Editor Header */}
            <div className="flex justify-between items-center mb-6 shrink-0 px-1">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Course Structure</h2>
                    <p className="text-gray-500">Design your curriculum week by week.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => {
                        const newWeek: Week = {
                            id: Math.random().toString(),
                            weekNumber: weeks.length + 1,
                            title: 'New Week',
                            overview: '',
                            objectives: [],
                            tasks: []
                        };
                        setWeeks([...weeks, newWeek]);
                        setSelectedWeekId(newWeek.id);
                    }} className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-stone-50 flex items-center gap-2">
                        <Plus size={16}/> Add Week
                    </button>
                    <button 
                        onClick={handleSaveAll}
                        className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg"
                    >
                        <Save size={18}/> Save & Continue
                    </button>
                </div>
            </div>

            {/* Two-Column Editor Layout */}
            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                
                {/* LEFT: Weeks List */}
                <div className="w-1/3 flex flex-col bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-stone-50 border-b border-stone-100 font-bold text-gray-500 text-xs uppercase tracking-wider flex justify-between">
                        <span>Weeks List</span>
                        <span>{weeks.length} Weeks</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {weeks.map((week, idx) => (
                            <div 
                                key={week.id}
                                onClick={() => setSelectedWeekId(week.id)}
                                className={`group p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                                    selectedWeekId === week.id 
                                    ? 'border-yellow-400 bg-yellow-50 shadow-sm' 
                                    : 'border-transparent hover:border-gray-200 hover:bg-stone-50'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <GripVertical size={16} className="text-gray-300 group-hover:text-gray-400 cursor-grab"/>
                                        <span className={`text-xs font-bold uppercase ${selectedWeekId === week.id ? 'text-yellow-700' : 'text-gray-400'}`}>Week {week.weekNumber}</span>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveWeek(idx, 'up'); }} disabled={idx === 0} className="p-1 hover:bg-white rounded text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowUp size={14}/></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleMoveWeek(idx, 'down'); }} disabled={idx === weeks.length - 1} className="p-1 hover:bg-white rounded text-gray-400 hover:text-gray-900 disabled:opacity-30"><ArrowDown size={14}/></button>
                                        <button onClick={(e) => { e.stopPropagation(); setDeleteItem({ type: 'Week', id: week.id, title: week.title }); }} className="p-1 hover:bg-white rounded text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                                <h3 className="font-bold text-gray-900 text-sm mb-1">{week.title}</h3>
                                <p className="text-xs text-gray-500 truncate">{week.overview || 'No overview'}</p>
                                <div className="mt-2 text-[10px] text-gray-400 font-medium">
                                    {week.tasks.length} tasks
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Week Detail & Tasks */}
                <div className="flex-1 flex flex-col bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
                    {selectedWeek ? (
                        <>
                            {/* Week Metadata Editor */}
                            <div className="p-6 border-b border-stone-100 bg-stone-50">
                                <div className="flex justify-between items-start mb-4">
                                    <input 
                                        value={selectedWeek.title}
                                        onChange={(e) => {
                                            const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, title: e.target.value} : w);
                                            setWeeks(updated);
                                        }}
                                        className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 w-full"
                                        placeholder="Week Title"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <textarea 
                                        value={selectedWeek.overview}
                                        onChange={(e) => {
                                            const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, overview: e.target.value} : w);
                                            setWeeks(updated);
                                        }}
                                        className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none resize-none h-20"
                                        placeholder="Enter a brief overview for this week..."
                                    />
                                    {/* Objectives could be a list builder, keeping simple for now */}
                                </div>
                            </div>

                            {/* Task List */}
                            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Tasks ({selectedWeek.tasks.length})</h3>
                                    <button 
                                        onClick={() => {
                                            const newTask: Task = {
                                                id: Math.random().toString(),
                                                title: 'New Task',
                                                type: 'Lesson',
                                                description: '',
                                                objective: ''
                                            };
                                            const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, tasks: [...w.tasks, newTask]} : w);
                                            setWeeks(updated);
                                            setEditingTask({ task: newTask, weekId: selectedWeek.id });
                                        }}
                                        className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black flex items-center gap-1"
                                    >
                                        <Plus size={12}/> Add Task
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {selectedWeek.tasks.map((task, tIdx) => {
                                        const isExpanded = expandedTasks.has(task.id);
                                        return (
                                            <div key={task.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors group">
                                                {/* Task Header */}
                                                <div className="p-3 bg-white flex items-center gap-3">
                                                    <div className="cursor-grab text-gray-300 hover:text-gray-500"><GripVertical size={16}/></div>
                                                    
                                                    {/* Task Type Icon */}
                                                    <div className={`p-2 rounded-lg ${
                                                        task.type === 'Lesson' ? 'bg-blue-50 text-blue-600' :
                                                        task.type === 'Reflection' ? 'bg-purple-50 text-purple-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {task.type === 'Lesson' ? <BookOpen size={16}/> : task.type === 'Reflection' ? <Sparkles size={16}/> : <FileText size={16}/>}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-sm truncate">{task.title}</h4>
                                                        <p className="text-xs text-gray-500 truncate">{task.type}</p>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => handleMoveTask(selectedWeek.id, tIdx, 'up')} disabled={tIdx === 0} className="p-1.5 hover:bg-stone-100 rounded text-gray-400 hover:text-gray-900"><ArrowUp size={14}/></button>
                                                        <button onClick={() => handleMoveTask(selectedWeek.id, tIdx, 'down')} disabled={tIdx === selectedWeek.tasks.length - 1} className="p-1.5 hover:bg-stone-100 rounded text-gray-400 hover:text-gray-900"><ArrowDown size={14}/></button>
                                                        <button onClick={() => setEditingTask({ task, weekId: selectedWeek.id })} className="p-1.5 hover:bg-stone-100 rounded text-gray-400 hover:text-gray-900"><Edit2 size={14}/></button>
                                                        <button onClick={() => setDeleteItem({ type: 'Task', id: task.id, title: task.title, weekId: selectedWeek.id })} className="p-1.5 hover:bg-stone-100 rounded text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                                    </div>

                                                    <button onClick={() => toggleTaskExpand(task.id)} className="p-1 text-gray-400 hover:text-gray-600">
                                                        {isExpanded ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
                                                    </button>
                                                </div>

                                                {/* Expanded Content */}
                                                {isExpanded && (
                                                    <div className="px-12 pb-4 pt-0 bg-white">
                                                        <div className="pt-3 border-t border-gray-50 grid grid-cols-2 gap-4">
                                                            <div className="bg-stone-50 p-3 rounded-lg">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase">AI Instructions</span>
                                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.aiInstructions || 'Not configured'}</p>
                                                            </div>
                                                            <div className="bg-stone-50 p-3 rounded-lg">
                                                                <span className="text-[10px] font-bold text-gray-400 uppercase">Description</span>
                                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{task.description || 'No description'}</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => setEditingTask({ task, weekId: selectedWeek.id })}
                                                            className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                                        >
                                                            <Edit2 size={12}/> Open Full Editor
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-stone-50">
                            <Layout size={48} className="mb-4 opacity-20"/>
                            <p className="font-medium">Select a week to edit details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Stage4Materials: React.FC<{
    courseId: string;
    availableMaterials: Material[];
    onComplete: () => void;
}> = ({ courseId, availableMaterials, onComplete }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // Load existing selections
        courseService.getCourseMaterials(courseId).then(ids => setSelectedIds(new Set(ids)));
    }, [courseId]);

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Sync all changes (simplified: re-save all checked)
            for (const mat of availableMaterials) {
                await courseService.toggleCourseMaterial(courseId, mat.id, selectedIds.has(mat.id));
            }
            await courseService.updateCourseStage(courseId, 5);
            onComplete();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Attach Materials</h2>
                    <p className="text-gray-500">Select resources from your library to include in this course.</p>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                >
                    {isSaving ? 'Saving...' : 'Save & Continue'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMaterials.map(mat => (
                    <div 
                        key={mat.id}
                        onClick={() => toggleSelection(mat.id)}
                        className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${
                            selectedIds.has(mat.id) 
                            ? 'border-yellow-400 bg-yellow-50/20 shadow-md' 
                            : 'border-stone-100 bg-white hover:border-gray-200'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                mat.type === 'Audio' ? 'bg-blue-100 text-blue-600' :
                                mat.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                            }`}>
                                {mat.type === 'Audio' ? <Music size={18}/> : mat.type === 'Video' ? <Video size={18}/> : <FileText size={18}/>}
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                selectedIds.has(mat.id) ? 'bg-yellow-400 border-yellow-400 text-white' : 'border-gray-300'
                            }`}>
                                {selectedIds.has(mat.id) && <CheckCircle size={14} fill="currentColor" className="text-gray-900"/>}
                            </div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{mat.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{mat.description}</p>
                    </div>
                ))}
                
                <div className="border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center p-6 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors cursor-pointer min-h-[180px]">
                    <Plus size={32} className="mb-2"/>
                    <span className="font-bold text-sm">Upload New Material</span>
                </div>
            </div>
        </div>
    );
};

const Stage5Personas: React.FC<{
    courseId: string;
    onComplete: () => void;
}> = ({ courseId, onComplete }) => {
    // Mock personas for selection
    const personas = [
        { id: '1', name: 'Atlas', role: 'Productivity Coach', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Atlas' },
        { id: '2', name: 'Serena', role: 'Mindfulness Guide', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Serena' },
        { id: '3', name: 'Kai', role: 'Career Strategist', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Kai' }
    ];
    const [selectedPersona, setSelectedPersona] = useState<string | null>(null);

    const handleSave = async () => {
        if (selectedPersona) {
            await courseService.toggleCoursePersona(courseId, selectedPersona, true);
        }
        await courseService.updateCourseStage(courseId, 6);
        onComplete();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Assign a Course Guide</h2>
                <p className="text-gray-500 mt-2">Choose an AI persona to support students through this journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {personas.map(persona => (
                    <div 
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.id)}
                        className={`relative p-8 rounded-[32px] border-2 cursor-pointer transition-all flex flex-col items-center text-center ${
                            selectedPersona === persona.id 
                            ? 'border-yellow-400 bg-white shadow-xl scale-105 z-10' 
                            : 'border-stone-100 bg-white/50 hover:border-gray-200 hover:scale-105'
                        }`}
                    >
                        <img src={persona.avatar} alt={persona.name} className="w-24 h-24 rounded-2xl mb-6 bg-stone-50"/>
                        <h3 className="text-xl font-bold text-gray-900">{persona.name}</h3>
                        <p className="text-sm text-gray-500 mb-6">{persona.role}</p>
                        
                        <div className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${
                            selectedPersona === persona.id ? 'bg-yellow-400 text-gray-900' : 'bg-stone-100 text-gray-400'
                        }`}>
                            {selectedPersona === persona.id ? 'Selected' : 'Select'}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <button 
                    onClick={handleSave}
                    disabled={!selectedPersona}
                    className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Pricing
                </button>
            </div>
        </div>
    );
};

// --- STAGE 6: PRICING & PUBLICATION (FIXED ERROR HANDLING & STYLING) ---

const Stage6Pricing: React.FC<{ 
    courseId: string, 
    currentCourse: Course, 
    onComplete: () => void 
}> = ({ courseId, currentCourse, onComplete }) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [settings, setSettings] = useState({
        pricingModel: currentCourse.pricingModel || 'Free',
        price: currentCourse.price || 0,
        trialEnabled: currentCourse.trialEnabled || false,
        trialDays: currentCourse.trialDays || 7,
        maxEnrollments: currentCourse.maxEnrollments || 0,
        startDate: currentCourse.startDate || '',
        publicationStatus: currentCourse.status === 'Published' ? 'Published' : 'Draft'
    });

    const handleChange = (field: string, value: any) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsPublishing(true);
        try {
            await courseService.publishCourse(courseId, {
                pricingModel: settings.pricingModel as any,
                // Sanitize numeric inputs to avoid NaN being sent to API
                price: isNaN(settings.price) ? 0 : settings.price,
                trialEnabled: settings.trialEnabled,
                trialDays: isNaN(settings.trialDays) ? 0 : settings.trialDays,
                maxEnrollments: isNaN(settings.maxEnrollments) ? 0 : settings.maxEnrollments,
                startDate: settings.startDate,
                status: settings.publicationStatus as any
            });
            onComplete();
        } catch (error: any) {
            console.error("Failed to update course settings:", error);
            // FIX: Extract message instead of stringifying the entire object into [object Object]
            const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
            alert(`Failed to save settings: ${errorMessage}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
             
             {/* Header */}
             <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[32px] text-white shadow-lg">
                 <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
                     <Globe size={24} className="text-yellow-400"/> Pricing & Publication
                 </h3>
                 <p className="text-gray-300 opacity-90">Finalize how students access your course and set it live.</p>
             </div>

             {/* 1. Pricing Model */}
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                 <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">1</span>
                     Pricing Model
                 </h4>
                 
                 <div className="space-y-3">
                     {/* Free */}
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'Free' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                         <input 
                            type="radio" 
                            name="pricingModel" 
                            value="Free"
                            checked={settings.pricingModel === 'Free'}
                            onChange={() => handleChange('pricingModel', 'Free')}
                            className="w-5 h-5 text-green-600 focus:ring-green-500"
                         />
                         <div className="ml-4">
                             <span className="block font-bold text-gray-900">Free Access</span>
                             <span className="text-xs text-gray-500">Available to all students without payment.</span>
                         </div>
                     </label>

                     {/* One Time */}
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'OneTime' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}`}>
                         <input 
                            type="radio" 
                            name="pricingModel" 
                            value="OneTime"
                            checked={settings.pricingModel === 'OneTime'}
                            onChange={() => handleChange('pricingModel', 'OneTime')}
                            className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"
                         />
                         <div className="ml-4 flex-1">
                             <span className="block font-bold text-gray-900">One-Time Payment</span>
                             <span className="text-xs text-gray-500">Students pay once for lifetime access.</span>
                         </div>
                         {settings.pricingModel === 'OneTime' && (
                             <div className="w-32">
                                 <div className="relative">
                                     <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                     <input 
                                        type="number" 
                                        value={settings.price || ''}
                                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-bold"
                                        placeholder="0.00"
                                     />
                                 </div>
                             </div>
                         )}
                     </label>

                     {/* Subscription */}
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'Subscription' ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                         <input 
                            type="radio" 
                            name="pricingModel" 
                            value="Subscription"
                            checked={settings.pricingModel === 'Subscription'}
                            onChange={() => handleChange('pricingModel', 'Subscription')}
                            className="w-5 h-5 text-blue-500 focus:ring-blue-400"
                         />
                         <div className="ml-4 flex-1">
                             <span className="block font-bold text-gray-900">Monthly Subscription</span>
                             <span className="text-xs text-gray-500">Recurring revenue model.</span>
                         </div>
                         {settings.pricingModel === 'Subscription' && (
                             <div className="w-32">
                                 <div className="relative">
                                     <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                     <input 
                                        type="number" 
                                        value={settings.price || ''}
                                        onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-blue-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold"
                                        placeholder="0.00"
                                     />
                                 </div>
                             </div>
                         )}
                     </label>
                 </div>
             </div>

             {/* 2. Trial Period */}
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                 <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">2</span>
                     Trial Period
                 </h4>
                 
                 <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100">
                     <input 
                        type="checkbox" 
                        checked={settings.trialEnabled}
                        onChange={(e) => handleChange('trialEnabled', e.target.checked)}
                        className="w-5 h-5 text-gray-900 rounded focus:ring-gray-900 border-gray-300"
                     />
                     <div className="flex-1">
                         <span className="block font-bold text-gray-900 text-sm">Offer a free trial period</span>
                         <span className="text-xs text-gray-500">Allow students to access content before billing.</span>
                     </div>
                     
                     {settings.trialEnabled && (
                         <div className="flex items-center gap-2">
                             <input 
                                type="number" 
                                value={settings.trialDays || ''}
                                onChange={(e) => handleChange('trialDays', parseInt(e.target.value) || 0)}
                                className="w-20 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none text-sm font-bold text-center"
                             />
                             <span className="text-sm font-medium text-gray-600">Days</span>
                         </div>
                     )}
                 </div>
             </div>

             {/* 3. Enrollment Settings */}
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                 <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">3</span>
                     Enrollment Settings
                 </h4>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Enrollments (Optional)</label>
                         <div className="relative">
                             <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                             <input 
                                type="number"
                                value={settings.maxEnrollments || ''}
                                onChange={(e) => handleChange('maxEnrollments', parseInt(e.target.value) || 0)}
                                placeholder="Unlimited"
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 text-gray-900 border-none outline-none focus:ring-2 focus:ring-yellow-400"
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date (Optional)</label>
                         <div className="relative">
                             <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                             <input 
                                type="date"
                                value={settings.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"
                             />
                         </div>
                     </div>
                 </div>
             </div>

             {/* 4. Publication Status */}
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                 <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                     <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">4</span>
                     Publication Status
                 </h4>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.publicationStatus === 'Draft' ? 'border-gray-400 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}>
                         <input 
                            type="radio" 
                            name="publicationStatus" 
                            value="Draft"
                            checked={settings.publicationStatus === 'Draft'}
                            onChange={() => handleChange('publicationStatus', 'Draft')}
                            className="w-5 h-5 text-gray-600 focus:ring-gray-500"
                         />
                         <div className="ml-3">
                             <span className="block font-bold text-gray-900 flex items-center gap-2"><Lock size={14}/> Save as Draft</span>
                             <span className="text-xs text-gray-500">Only visible to you.</span>
                         </div>
                     </label>

                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.publicationStatus === 'Published' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                         <input 
                            type="radio" 
                            name="publicationStatus" 
                            value="Published"
                            checked={settings.publicationStatus === 'Published'}
                            onChange={() => handleChange('publicationStatus', 'Published')}
                            className="w-5 h-5 text-green-600 focus:ring-green-500"
                         />
                         <div className="ml-3">
                             <span className="block font-bold text-gray-900 flex items-center gap-2"><Globe size={14}/> Publish Now</span>
                             <span className="text-xs text-gray-500">Live for enrollment.</span>
                         </div>
                     </label>
                 </div>
             </div>

             <div className="flex justify-end pt-6">
                <button 
                    onClick={handleSave}
                    disabled={isPublishing}
                    className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg ${
                        settings.publicationStatus === 'Published' 
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' 
                        : 'bg-gray-900 hover:bg-black text-white'
                    }`}
                >
                    {isPublishing ? <Loader2 className="animate-spin" size={20}/> : (settings.publicationStatus === 'Published' ? <Globe size={20}/> : <Save size={20}/>)}
                    {settings.publicationStatus === 'Published' ? 'Publish Course' : 'Save Draft'}
                </button>
            </div>
        </div>
    );
};

const CourseManager: React.FC<CourseManagerProps> = ({ 
  onBack, 
  availableMaterials = [], 
  onNavigateToLibrary,
  initialMode = 'LIST'
}) => {
  const [currentView, setCurrentView] = useState<StageView>(initialMode === 'CREATE_FLOW' ? 'STAGE_1' : 'LIST');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Active Course State (The one being edited/managed)
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeCourseData, setActiveCourseData] = useState<Course | null>(null);

  // Load Courses on Mount or List View
  useEffect(() => {
    if (currentView === 'LIST') {
      fetchCourses();
    }
  }, [currentView]);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const session = await authService.getSession();
      if (session?.user) {
        const data = await courseService.getCourses(session.user.id);
        setCourses(data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCreate = () => {
    setActiveCourseId(null);
    setActiveCourseData(null);
    setCurrentView('STAGE_1');
  };

  const handleCourseClick = (course: Course) => {
    setActiveCourseId(course.id);
    setActiveCourseData(course);
    
    // Stage Mapping logic aligned with user request:
    switch (course.creationStage) {
        case 1: setCurrentView('STAGE_2'); break;
        case 2: setCurrentView('STAGE_3'); break; 
        case 3: setCurrentView('STAGE_3'); break; 
        case 4: setCurrentView('STAGE_4'); break; 
        case 5: setCurrentView('STAGE_5'); break; 
        case 6: setCurrentView('STAGE_6'); break; 
        default: 
            if (course.status === 'Published') {
                setCurrentView('OVERVIEW');
            } else {
                setCurrentView('STAGE_3'); 
            }
            break;
    }
  };

  const returnToDashboard = () => {
    setCurrentView('LIST');
    fetchCourses();
  };

  // --- RENDER ROUTER ---

  if (currentView === 'LIST') {
      return (
          <div className="space-y-8 animate-fade-in pb-10">
              <div className="flex justify-between items-center">
                  <div>
                      <h1 className="text-3xl font-bold text-gray-900">Manage Courses</h1>
                      <p className="text-gray-500 mt-1">View status and continue development.</p>
                  </div>
                  <button 
                      onClick={handleStartCreate}
                      className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-black transition-colors flex items-center gap-2"
                  >
                      <Plus size={18} /> New Course
                  </button>
              </div>

              {isLoading ? (
                  <div className="flex justify-center py-20">
                      <Loader2 size={32} className="text-gray-900 animate-spin" />
                  </div>
              ) : courses.length === 0 ? (
                  <div className="text-center py-20 bg-white/50 rounded-[32px] border border-dashed border-gray-200">
                      <h3 className="font-bold text-gray-900">No Courses Yet</h3>
                      <p className="text-gray-500 mb-4">Start by creating your first course structure.</p>
                      <button onClick={handleStartCreate} className="text-yellow-600 font-bold hover:underline">Create Now</button>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {courses.map(course => {
                          const stageColors = {
                              1: 'border-gray-300 hover:border-gray-400',
                              2: 'border-amber-400 bg-amber-50/10 hover:border-amber-500',
                              3: 'border-blue-400 bg-blue-50/10 hover:border-blue-500',
                              4: 'border-purple-400 bg-purple-50/10 hover:border-purple-500',
                              5: 'border-pink-400 bg-pink-50/10 hover:border-pink-500',
                              6: 'border-green-400 bg-green-50/10 hover:border-green-500'
                          };
                          
                          const displayLabel = {
                            1: 'Step 1: Details Saved',
                            2: 'Step 2: AI Structure',
                            3: 'Step 3: Structure Set',
                            4: 'Step 4: Materials',
                            5: 'Step 5: Personas',
                            6: 'Published'
                          }[course.creationStage] || 'Draft';

                          return (
                              <div 
                                  key={course.id} 
                                  onClick={() => handleCourseClick(course)}
                                  className={`group bg-white rounded-[32px] p-6 border-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative ${stageColors[course.creationStage as keyof typeof stageColors] || 'border-gray-200'}`}
                              >
                                  <div className="flex justify-between items-start mb-4">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border shadow-sm ${
                                          course.creationStage === 6 ? 'text-green-600 border-green-200' : 'text-gray-600 border-gray-200'
                                      }`}>
                                          {displayLabel}
                                      </span>
                                      <div className="p-2 bg-stone-50 rounded-full text-gray-400 group-hover:text-gray-900 group-hover:bg-yellow-400 transition-colors">
                                          <Edit2 size={16}/>
                                      </div>
                                  </div>
                                  
                                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">{course.description || 'No description provided.'}</p>
                                  
                                  <div className="flex items-center gap-4 text-xs text-gray-400">
                                      <span className="flex items-center gap-1"><Clock size={12}/> {course.duration}</span>
                                      <span className="flex items-center gap-1"><Users size={12}/> {course.enrolled || 0} Students</span>
                                      <span className="flex items-center gap-1"><Layout size={12}/> {course.weeks?.length || 0} Weeks</span>
                                  </div>

                                  <div className="mt-4 pt-4 border-t border-gray-100/50 flex items-center justify-between">
                                      <span className="text-xs font-bold text-gray-400">Last updated today</span>
                                      {course.creationStage < 6 && (
                                          <span className="flex items-center gap-1 text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                              Continue <ArrowRight size={16}/>
                                          </span>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              )}
          </div>
      );
  }

  // Common Wrapper for Stages
  const StageWrapper = ({ title, stage, children, noPadding = false }: React.PropsWithChildren<{ title: string, stage: number, noPadding?: boolean }>) => (
      <div className={`bg-white/90 backdrop-blur-xl min-h-screen rounded-[40px] border border-white shadow-lg animate-fade-in relative flex flex-col ${noPadding ? '' : 'p-8'}`}>
          {!noPadding && (
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <button onClick={returnToDashboard} className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-1 font-medium">
                        <ChevronDown size={16} className="rotate-90" /> Back to Manage Courses
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                    
                    {/* Progress Bar */}
                    <div className="flex gap-2 mt-4">
                        {[1, 2, 3, 4, 5, 6].map(s => (
                            <div 
                                key={s} 
                                className={`h-1.5 w-12 rounded-full transition-colors ${
                                    s <= stage 
                                    ? (stage === 6 && s === 6 ? 'bg-green-500' : 'bg-yellow-400') 
                                    : 'bg-gray-200'
                                }`} 
                            />
                        ))}
                    </div>
                </div>
            </div>
          )}
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${noPadding ? '' : 'pb-10'}`}>
              {children}
          </div>
      </div>
  );

  return (
      <>
          {currentView === 'STAGE_1' && (
              <StageWrapper title="Stage 1: Course Details" stage={1}>
                  <Stage1Details 
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_2' && activeCourseId && (
              <StageWrapper title="Stage 2: AI Course Architect" stage={2}>
                  <Stage2AIChat 
                      courseId={activeCourseId}
                      contextData={activeCourseData}
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_3' && activeCourseId && (
               <StageWrapper title="Stage 3: Curriculum Structure" stage={3}>
                   <Stage3Structure 
                       courseId={activeCourseId} 
                       onComplete={returnToDashboard} 
                       availableMaterials={availableMaterials}
                   />
               </StageWrapper>
          )}

          {currentView === 'STAGE_4' && activeCourseId && (
              <StageWrapper title="Stage 4: Course Materials" stage={4}>
                  <Stage4Materials 
                      courseId={activeCourseId}
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_5' && activeCourseId && (
              <StageWrapper title="Stage 5: Assign AI Coaches" stage={5}>
                  <Stage5Personas 
                      courseId={activeCourseId}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_6' && activeCourseId && activeCourseData && (
              <StageWrapper title="Stage 6: Pricing & Publication" stage={6}>
                  <Stage6Pricing 
                      courseId={activeCourseId}
                      currentCourse={activeCourseData}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'OVERVIEW' && activeCourseData && (
               <StageWrapper title="Course Overview" stage={6}>
                   <div className="text-center py-20">
                       <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                           <CheckCircle size={40}/>
                       </div>
                       <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeCourseData.title} is Published!</h2>
                       <p className="text-gray-500 mb-8 max-w-md mx-auto">Your course is live and available for enrollment. You can now monitor student progress from the dashboard.</p>
                       
                       <div className="flex justify-center gap-4">
                           <button onClick={() => setCurrentView('STAGE_3')} className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-stone-50">
                               Edit Structure
                           </button>
                           <button onClick={returnToDashboard} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black">
                               Back to Courses
                           </button>
                       </div>
                   </div>
               </StageWrapper>
          )}
      </>
  );
};

export default CourseManager;
