
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
  BookOpen,
  Search
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
                                                <p className="text-xs text-gray-500 truncate">{m.category.join(', ')}</p>
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
    onComplete: () => void,
    courseId?: string | null,
    initialData?: Course | null
}> = ({ availableMaterials, onComplete, courseId, initialData }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        category: string;
        durationValue: number;
        image: string;
        tags: string[];
    }>({
        title: initialData?.title || '',
        description: initialData?.description || '',
        category: initialData?.category || 'Mindset',
        durationValue: initialData?.durationValue || 4,
        image: initialData?.image || '',
        tags: initialData?.tags || []
    });
    
    const [tagInput, setTagInput] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
    const [materialSearch, setMaterialSearch] = useState('');

    useEffect(() => {
        if (courseId && initialData) {
            // Already initialized via useState, but good to be safe if props change
            setFormData({
                title: initialData.title,
                description: initialData.description || '',
                category: initialData.category,
                durationValue: initialData.durationValue || 4,
                image: initialData.image,
                tags: initialData.tags || []
            });
        }
    }, [courseId, initialData]);

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
    };

    const toggleMaterialSelection = (id: string) => {
        const newSet = new Set(selectedMaterials);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedMaterials(newSet);
    };

    const filteredMaterials = availableMaterials.filter(m => 
        m.title.toLowerCase().includes(materialSearch.toLowerCase()) ||
        m.category.some(c => c.toLowerCase().includes(materialSearch.toLowerCase()))
    );

    const handleAction = async () => {
        if (!formData.title) return alert("Please enter a course title");
        
        setIsLoading(true);
        try {
            const session = await authService.getSession();
            if (session?.user) {
                if (courseId) {
                    // UPDATE MODE
                    await courseService.updateCourseDetails(courseId, { ...formData, durationUnit: 'Weeks' });
                    // Note: Materials updating logic isn't in updateCourseDetails, assumed handled in Stage 4 for existing courses
                    alert("Course details updated.");
                } else {
                    // CREATE MODE
                    await courseService.createCourse(
                        session.user.id, 
                        { ...formData, durationUnit: 'Weeks' },
                        Array.from(selectedMaterials)
                    );
                }
                onComplete();
            }
        } catch (e: any) { 
            console.error(e); 
            alert(`Failed to ${courseId ? 'update' : 'create'} course: ${e.message}`); 
        } finally { 
            setIsLoading(false); 
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[32px] text-white shadow-lg">
                 <h3 className="font-bold text-2xl mb-2 flex items-center gap-2">
                     <FileText size={24} className="text-yellow-400"/> Course Essentials
                 </h3>
                 <p className="text-gray-300 opacity-90">{courseId ? 'Edit the core identity of your course.' : 'Start by defining the core identity of your new course.'}</p>
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

                {/* NEW: Tags Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Tags</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-red-500"><X size={14}/></button>
                            </span>
                        ))}
                    </div>
                    <input 
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="w-full px-4 py-3 rounded-xl bg-stone-50 border-none focus:ring-2 focus:ring-yellow-400 outline-none text-gray-900"
                        placeholder="Type a tag and press Enter..."
                    />
                </div>
            </div>

            {/* Materials Selector - Only show in CREATE mode to keep edit clean (or if needed) */}
            {!courseId && (
                <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <FolderOpen size={20} className="text-blue-500"/> Attach Core Materials
                        </h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                value={materialSearch}
                                onChange={(e) => setMaterialSearch(e.target.value)}
                                type="text" 
                                placeholder="Search library..." 
                                className="pl-10 pr-4 py-2 rounded-full bg-stone-50 border-none text-sm focus:ring-2 focus:ring-yellow-400 outline-none w-48"
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        {filteredMaterials.length > 0 ? filteredMaterials.map(mat => (
                            <div 
                                key={mat.id} 
                                onClick={() => toggleMaterialSelection(mat.id)}
                                className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                    selectedMaterials.has(mat.id) 
                                    ? 'border-yellow-400 bg-yellow-50' 
                                    : 'border-stone-100 hover:border-stone-200'
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedMaterials.has(mat.id) ? 'border-yellow-500 bg-yellow-400' : 'border-gray-300 bg-white'
                                }`}>
                                    {selectedMaterials.has(mat.id) && <CheckCircle size={14} className="text-gray-900"/>}
                                </div>
                                
                                <div className={`p-2 rounded-lg ${
                                    mat.type === 'Audio' ? 'bg-blue-50 text-blue-600' :
                                    mat.type === 'Video' ? 'bg-purple-50 text-purple-600' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                    {mat.type === 'Audio' ? <Music size={16}/> : mat.type === 'Video' ? <Video size={16}/> : <FileText size={16}/>}
                                </div>
                                
                                <div className="flex-1">
                                    <p className="font-bold text-gray-900 text-sm">{mat.title}</p>
                                    <p className="text-xs text-gray-500">{mat.category.join(', ')}</p>
                                </div>
                                
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-1 rounded border border-gray-100 text-gray-500">
                                    {mat.type}
                                </span>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 text-sm">No materials found.</div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 text-center">Selected materials will be available in the course structure editor.</p>
                </div>
            )}

            <div className="flex justify-end pt-4">
                <button 
                    onClick={handleAction}
                    disabled={isLoading}
                    className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg flex items-center gap-2"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20}/> : <ArrowRight size={20}/>}
                    {isLoading ? (courseId ? 'Saving...' : 'Creating...') : (courseId ? 'Save Changes' : 'Create & Continue')}
                </button>
            </div>
        </div>
    );
};

// --- STAGE 2: AI COURSE ARCHITECT ---

const Stage2AIChat: React.FC<{ 
    courseId: string;
    contextData: any;
    availableMaterials: Material[];
    onComplete: () => void;
}> = ({ courseId, contextData, availableMaterials, onComplete }) => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const chatSessionRef = useRef<Chat | null>(null);
    const hasInitializedRef = useRef(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const initChat = async () => {
            setIsGenerating(true);
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
                
                const materialsList = availableMaterials.map(m => 
                    `- ${m.title} (${m.type}): ${m.description || 'No description'} [Tags: ${m.category.join(', ')}]`
                ).join('\n');

                const systemPrompt = `
SYSTEM PROMPT — COURSE CO-CREATION GUIDE (Simplified + Structured)

You are an AI Course Architect.
Your job is to guide the practitioner through creating a course based on their uploaded materials and a short set of structured questions.

CONTEXT:
Course Title: ${contextData?.title}
Description: ${contextData?.description}
Duration: ${contextData?.durationValue} Weeks

AVAILABLE MATERIALS:
${materialsList}

Do NOT output JSON until the final confirmation.

🎯 CONVERSATION FLOW (STRICT)

1️⃣ Course Duration
Ask: "Great! Let’s start designing your course. How many weeks should this course run for?"

2️⃣ Target Audience Profile
Ask: "Who is the ideal client for this course? Please describe their role, age range, challenges, and goals."

3️⃣ Desired Final Outcome
Ask: "What is the single transformation or measurable outcome a student should achieve by the end of this course?"

4️⃣ High-Level Learning Progression
Ask: "Please outline a simple week-by-week theme or focus area."

5️⃣ Task Category Requirements
Ask: "What task types would you like to include? Choose ONLY from: Lesson, Daily Check-in, Journaling, Reflection, AI Conversation."

🛠️ GENERATING THE COURSE STRUCTURE
After all questions are answered, say:
“Great. I’m ready to generate the complete course structure.
Would you like me to send it to your Course Builder now?”

Wait for user confirmation.

📦 FINAL OUTPUT REQUIREMENT (ON CONFIRMATION)
Output ONLY the JSON object.
Format:
{
  "courseId": "${courseId}",
  "weeks": [
    {
      "weekNumber": 1,
      "title": "",
      "overview": "",
      "objectives": [],
      "tasks": [
        {
          "title": "",
          "type": "",
          "description": "",
          "objective": "",
          "context": "",
          "coachNotes": "",
          "aiInstructions": ""
        }
      ]
    }
  ]
}
`;

                const chat = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: systemPrompt,
                    }
                });
                
                chatSessionRef.current = chat;

                const response = await chat.sendMessage({ message: "Start the course creation guide." });
                setMessages([{ role: 'model', text: response.text || '' }]);

            } catch (error) {
                console.error("Chat init error", error);
                setMessages([{ role: 'model', text: "Error connecting to AI Architect. Please try again." }]);
            } finally {
                setIsGenerating(false);
            }
        };

        initChat();
    }, [courseId, contextData, availableMaterials]);

    const handleSend = async () => {
        if (!input.trim() || !chatSessionRef.current) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsGenerating(true);

        try {
            const result = await chatSessionRef.current.sendMessage({ message: userMsg });
            const responseText = result.text || '';
            
            const jsonStartIndex = responseText.indexOf('{');
            const jsonEndIndex = responseText.lastIndexOf('}');
            
            let isJson = false;
            
            if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
                const potentialJson = responseText.substring(jsonStartIndex, jsonEndIndex + 1);
                
                try {
                    const parsed = JSON.parse(potentialJson);
                    
                    const normalizedWeeks = (parsed.weeks || []).map((week: any) => ({
                        id: Math.random().toString(),
                        weekNumber: week.weekNumber || week.week_number || 0,
                        title: week.title || `Week ${week.weekNumber || week.week_number}`,
                        overview: week.overview || '',
                        objectives: week.objectives || [],
                        tasks: (week.tasks || []).map((task: any) => ({
                            id: Math.random().toString(),
                            title: task.title || task.task_title || 'Untitled Task',
                            type: task.type || task.task_type || 'Lesson',
                            description: task.description || '',
                            objective: task.objective || task.task_objective || '',
                            context: task.context || task.task_context || '',
                            coachNotes: task.coachNotes || task.coach_notes || '',
                            aiInstructions: task.aiInstructions || task.ai_instructions || ''
                        }))
                    }));

                    if (normalizedWeeks.length > 0) {
                        isJson = true;
                        
                        await courseService.saveCourseStructure(courseId, normalizedWeeks);
                        
                        setMessages(prev => [...prev, { 
                            role: 'model', 
                            text: "Your course structure is being created. You’ll return to the course editor shortly." 
                        }]);

                        setTimeout(() => {
                            courseService.updateCourseStage(courseId, 3).then(() => {
                                onComplete();
                            });
                        }, 2500);
                    }
                } catch (e) {
                    console.error("JSON Parse Error:", e);
                }
            } 
            
            if (!isJson) {
                setMessages(prev => [...prev, { role: 'model', text: responseText }]);
            }

        } catch (error) {
            console.error("Chat error", error);
            setMessages(prev => [...prev, { role: 'model', text: "I encountered an error. Please try again." }]);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-3xl mx-auto">
            <div className="flex-1 flex flex-col bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden relative">
                <div className="p-4 bg-gray-900 text-white font-bold flex items-center justify-center gap-2 shrink-0">
                    <Sparkles size={18} className="text-yellow-400"/> AI Course Architect
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50 custom-scrollbar">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3 shrink-0 text-yellow-400 mt-1">
                                    <Bot size={16}/>
                                </div>
                            )}
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                ? 'bg-gray-900 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex justify-start">
                            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3 shrink-0 text-yellow-400 mt-1">
                                <Bot size={16}/>
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                    <div className="relative max-w-2xl mx-auto">
                        <input 
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your answer..."
                            disabled={isGenerating}
                            className="w-full pl-6 pr-14 py-4 rounded-full bg-stone-50 border border-stone-200 outline-none text-sm focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all shadow-sm"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isGenerating}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gray-900 text-white rounded-full hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={16}/>
                        </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        AI can make mistakes. Review generated structure in the next step.
                    </p>
                </div>
            </div>
        </div>
    );
};

// --- STAGE 3: STRUCTURE EDITOR ---

const Stage3Structure: React.FC<{
    courseId: string;
    onComplete: () => void;
    availableMaterials?: Material[];
    isPublished?: boolean;
}> = ({ courseId, onComplete, availableMaterials = [], isPublished }) => {
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
    const [editingTask, setEditingTask] = useState<{task: Task, weekId: string} | null>(null);
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
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
            if (!isPublished) {
                await courseService.updateCourseStage(courseId, 4);
            }
            onComplete();
            if (isPublished) alert("Structure saved.");
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
            {deleteItem && (
                <DeleteConfirmationModal
                    title={`Delete ${deleteItem.type}?`}
                    itemTitle={deleteItem.title}
                    itemType={deleteItem.type}
                    impact={{ clients: 0, completions: 0, resources: 0 }}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteItem(null)}
                />
            )}
            {editingTask && (
                <TaskEditorModal 
                    task={editingTask.task} 
                    availableMaterials={availableMaterials}
                    onSave={handleTaskSave} 
                    onClose={() => setEditingTask(null)}
                />
            )}
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
                    <button onClick={handleSaveAll} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-lg">
                        <Save size={18}/> {isPublished ? 'Save Changes' : 'Save & Continue'}
                    </button>
                </div>
            </div>
            <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
                <div className="w-1/3 flex flex-col bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
                    <div className="p-4 bg-stone-50 border-b border-stone-100 font-bold text-gray-500 text-xs uppercase tracking-wider flex justify-between">
                        <span>Weeks List</span>
                        <span>{weeks.length} Weeks</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {weeks.map((week, idx) => (
                            <div key={week.id} onClick={() => setSelectedWeekId(week.id)} className={`group p-4 rounded-xl border-2 transition-all cursor-pointer relative ${selectedWeekId === week.id ? 'border-yellow-400 bg-yellow-50 shadow-sm' : 'border-transparent hover:border-gray-200 hover:bg-stone-50'}`}>
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
                                <div className="mt-2 text-[10px] text-gray-400 font-medium">{week.tasks.length} tasks</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col bg-white rounded-[24px] border border-stone-200 shadow-sm overflow-hidden">
                    {selectedWeek ? (
                        <>
                            <div className="p-6 border-b border-stone-100 bg-stone-50">
                                <div className="flex justify-between items-start mb-4">
                                    <input value={selectedWeek.title} onChange={(e) => { const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, title: e.target.value} : w); setWeeks(updated); }} className="text-2xl font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 placeholder-gray-300 w-full" placeholder="Week Title" />
                                </div>
                                <div className="space-y-4">
                                    <textarea value={selectedWeek.overview} onChange={(e) => { const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, overview: e.target.value} : w); setWeeks(updated); }} className="w-full bg-white p-3 rounded-xl border border-gray-200 text-sm text-gray-600 focus:ring-2 focus:ring-yellow-400 outline-none resize-none h-20" placeholder="Enter a brief overview for this week..." />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900">Tasks ({selectedWeek.tasks.length})</h3>
                                    <button onClick={() => { const newTask: Task = { id: Math.random().toString(), title: 'New Task', type: 'Lesson', description: '', objective: '' }; const updated = weeks.map(w => w.id === selectedWeek.id ? {...w, tasks: [...w.tasks, newTask]} : w); setWeeks(updated); setEditingTask({ task: newTask, weekId: selectedWeek.id }); }} className="text-xs font-bold bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black flex items-center gap-1">
                                        <Plus size={12}/> Add Task
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {selectedWeek.tasks.map((task, tIdx) => {
                                        const isExpanded = expandedTasks.has(task.id);
                                        return (
                                            <div key={task.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-gray-300 transition-colors group">
                                                <div className="p-3 bg-white flex items-center gap-3">
                                                    <div className="cursor-grab text-gray-300 hover:text-gray-500"><GripVertical size={16}/></div>
                                                    <div className={`p-2 rounded-lg ${task.type === 'Lesson' ? 'bg-blue-50 text-blue-600' : task.type === 'Reflection' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                                                        {task.type === 'Lesson' ? <BookOpen size={16}/> : task.type === 'Reflection' ? <Sparkles size={16}/> : <FileText size={16}/>}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-gray-900 text-sm truncate">{task.title}</h4>
                                                        <p className="text-xs text-gray-500 truncate">{task.type}</p>
                                                    </div>
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
                                                        <button onClick={() => setEditingTask({ task, weekId: selectedWeek.id })} className="w-full mt-3 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
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

// --- STAGE 4: MATERIALS ---

const Stage4Materials: React.FC<{ courseId: string; availableMaterials: Material[]; onComplete: () => void; isPublished?: boolean }> = ({ courseId, availableMaterials, onComplete, isPublished }) => {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => { courseService.getCourseMaterials(courseId).then(ids => setSelectedIds(new Set(ids))); }, [courseId]);
    const toggleSelection = (id: string) => { const newSet = new Set(selectedIds); if (newSet.has(id)) newSet.delete(id); else newSet.add(id); setSelectedIds(newSet); };
    const handleSave = async () => { setIsSaving(true); try { for (const mat of availableMaterials) { await courseService.toggleCourseMaterial(courseId, mat.id, selectedIds.has(mat.id)); } if(!isPublished) await courseService.updateCourseStage(courseId, 5); onComplete(); if(isPublished) alert("Materials updated."); } catch (e) { console.error(e); } finally { setIsSaving(false); } };
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div><h2 className="text-3xl font-bold text-gray-900">Attach Materials</h2><p className="text-gray-500">Select resources from your library to include in this course.</p></div>
                <button onClick={handleSave} disabled={isSaving} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors">{isSaving ? 'Saving...' : (isPublished ? 'Save Changes' : 'Save & Continue')}</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableMaterials.map(mat => (
                    <div key={mat.id} onClick={() => toggleSelection(mat.id)} className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${selectedIds.has(mat.id) ? 'border-yellow-400 bg-yellow-50/20 shadow-md' : 'border-stone-100 bg-white hover:border-gray-200'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mat.type === 'Audio' ? 'bg-blue-100 text-blue-600' : mat.type === 'Video' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>{mat.type === 'Audio' ? <Music size={18}/> : mat.type === 'Video' ? <Video size={18}/> : <FileText size={18}/>}</div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedIds.has(mat.id) ? 'bg-yellow-400 border-yellow-400 text-white' : 'border-gray-300'}`}>{selectedIds.has(mat.id) && <CheckCircle size={14} fill="currentColor" className="text-gray-900"/>}</div>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{mat.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2">{mat.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- STAGE 5: PERSONAS ---

const Stage5Personas: React.FC<{ courseId: string; onComplete: () => void; isPublished?: boolean }> = ({ courseId, onComplete, isPublished }) => {
    const [personas, setPersonas] = useState<Persona[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const session = await authService.getSession();
                if (!session?.user) return;

                const [allPersonas, existingIds] = await Promise.all([
                    courseService.getAvailablePersonas(session.user.id),
                    courseService.getCoursePersonaIds(courseId)
                ]);

                setPersonas(allPersonas);
                setSelectedIds(new Set(existingIds));
            } catch (e) {
                console.error("Failed to load personas", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [courseId]);

    const togglePersona = async (personaId: string) => {
        const newSet = new Set(selectedIds);
        const isSelected = newSet.has(personaId);

        if (isSelected) {
            newSet.delete(personaId);
        } else {
            if (newSet.size >= 4) {
                alert("You can select up to 4 personas.");
                return;
            }
            newSet.add(personaId);
        }
        
        setSelectedIds(newSet); // Optimistic Update

        try {
             // Instant Save Logic
             await courseService.toggleCoursePersona(courseId, personaId, !isSelected);
        } catch(e) {
            console.error("Failed to toggle persona", e);
            // Revert state if failed
            if (isSelected) newSet.add(personaId); else newSet.delete(personaId);
            setSelectedIds(new Set(newSet));
        }
    };

    const handleContinue = async () => {
        setIsSaving(true);
        try {
            if(!isPublished) await courseService.updateCourseStage(courseId, 6);
            onComplete();
            if(isPublished) alert("Coaches updated.");
        } catch (e) {
            console.error(e);
            alert("Failed to save progress.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gray-900" size={32}/></div>;
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Assign AI Coaches</h2>
                    <p className="text-gray-500 mt-1">Select up to 4 AI personas to guide students through this course.</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">{selectedIds.size} / 4 Selected</span>
                    <button 
                        onClick={handleContinue} 
                        disabled={isSaving} 
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : (isPublished ? 'Save Changes' : 'Save & Continue')}
                    </button>
                </div>
            </div>

            {personas.length === 0 ? (
                <div className="text-center py-20 bg-stone-50 rounded-[32px] border border-dashed border-gray-200">
                    <Bot size={48} className="mx-auto text-gray-300 mb-4"/>
                    <h3 className="text-xl font-bold text-gray-900">No Personas Found</h3>
                    <p className="text-gray-500 mb-6">You haven't created any AI personas yet.</p>
                    <button className="text-yellow-600 font-bold hover:underline">Go to AI Personas to create one</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personas.map(persona => {
                        const isSelected = selectedIds.has(persona.id);
                        return (
                            <div 
                                key={persona.id} 
                                onClick={() => togglePersona(persona.id)} 
                                className={`relative p-6 rounded-[32px] border-2 cursor-pointer transition-all hover:shadow-lg ${
                                    isSelected 
                                    ? 'border-yellow-400 bg-yellow-50/30 shadow-md transform scale-[1.02]' 
                                    : 'border-stone-100 bg-white hover:border-gray-200'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-2xl bg-stone-100 p-1">
                                            <img src={persona.avatar} alt={persona.name} className="w-full h-full rounded-xl object-cover bg-white"/>
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -top-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-sm border-2 border-white animate-scale-in">
                                                <CheckCircle size={14} fill="currentColor"/>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${isSelected ? 'bg-yellow-400 text-gray-900' : 'bg-stone-100 text-gray-500'}`}>
                                        {isSelected ? 'Selected' : 'Select'}
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{persona.name}</h3>
                                
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {persona.tags?.slice(0, 3).map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-white border border-gray-100 rounded-md text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-gray-100/50">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Tone</span>
                                        <span className="font-bold text-gray-700">{persona.toneStyle?.slice(0,2).join(', ') || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-gray-400">Style</span>
                                        <span className="font-bold text-gray-700">{persona.responseStyle}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- STAGE 6: PRICING ---

const Stage6Pricing: React.FC<{ courseId: string, currentCourse: Course, onComplete: () => void, isPublished?: boolean }> = ({ courseId, currentCourse, onComplete, isPublished }) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [settings, setSettings] = useState({ pricingModel: currentCourse.pricingModel || 'Free', price: currentCourse.price || 0, trialEnabled: currentCourse.trialEnabled || false, trialDays: currentCourse.trialDays || 7, maxEnrollments: currentCourse.maxEnrollments || 0, startDate: currentCourse.startDate || '', publicationStatus: currentCourse.status === 'Published' ? 'Published' : 'Draft' });
    const handleChange = (field: string, value: any) => { setSettings(prev => ({ ...prev, [field]: value })); };
    const handleSave = async () => { setIsPublishing(true); try { await courseService.publishCourse(courseId, { pricingModel: settings.pricingModel as any, price: isNaN(settings.price) ? 0 : settings.price, trialEnabled: settings.trialEnabled, trialDays: isNaN(settings.trialDays) ? 0 : settings.trialDays, maxEnrollments: isNaN(settings.maxEnrollments) ? 0 : settings.maxEnrollments, startDate: settings.startDate, status: settings.publicationStatus as any }); onComplete(); if(isPublished) alert("Settings updated."); } catch (error: any) { console.error("Failed to update course settings:", error); alert(`Failed to save settings: ${error?.message}`); } finally { setIsPublishing(false); } };
    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
             <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-[32px] text-white shadow-lg"><h3 className="font-bold text-2xl mb-2 flex items-center gap-2"><Globe size={24} className="text-yellow-400"/> Pricing & Publication</h3><p className="text-gray-300 opacity-90">Finalize how students access your course and set it live.</p></div>
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6"><h4 className="font-bold text-gray-900 text-lg flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">1</span> Pricing Model</h4><div className="space-y-3"><label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'Free' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}><input type="radio" name="pricingModel" value="Free" checked={settings.pricingModel === 'Free'} onChange={() => handleChange('pricingModel', 'Free')} className="w-5 h-5 text-green-600 focus:ring-green-500"/><div className="ml-4"><span className="block font-bold text-gray-900">Free Access</span><span className="text-xs text-gray-500">Available to all students without payment.</span></div></label><label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'OneTime' ? 'border-yellow-400 bg-yellow-50' : 'border-gray-100 hover:border-gray-200'}`}><input type="radio" name="pricingModel" value="OneTime" checked={settings.pricingModel === 'OneTime'} onChange={() => handleChange('pricingModel', 'OneTime')} className="w-5 h-5 text-yellow-500 focus:ring-yellow-400"/><div className="ml-4 flex-1"><span className="block font-bold text-gray-900">One-Time Payment</span><span className="text-xs text-gray-500">Students pay once for lifetime access.</span></div>{settings.pricingModel === 'OneTime' && (<div className="w-32"><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" value={settings.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)} className="w-full pl-8 pr-3 py-2 rounded-lg border border-yellow-300 bg-white text-gray-900 focus:ring-2 focus:ring-yellow-400 outline-none text-sm font-bold" placeholder="0.00"/></div></div>)}</label><label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.pricingModel === 'Subscription' ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}><input type="radio" name="pricingModel" value="Subscription" checked={settings.pricingModel === 'Subscription'} onChange={() => handleChange('pricingModel', 'Subscription')} className="w-5 h-5 text-blue-500 focus:ring-blue-400"/><div className="ml-4 flex-1"><span className="block font-bold text-gray-900">Monthly Subscription</span><span className="text-xs text-gray-500">Recurring revenue model.</span></div>{settings.pricingModel === 'Subscription' && (<div className="w-32"><div className="relative"><DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" value={settings.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)} className="w-full pl-8 pr-3 py-2 rounded-lg border border-blue-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-400 outline-none text-sm font-bold" placeholder="0.00"/></div></div>)}</label></div></div>
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6"><h4 className="font-bold text-gray-900 text-lg flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">2</span> Trial Period</h4><div className="flex items-center gap-4 p-4 rounded-xl bg-stone-50 border border-stone-100"><input type="checkbox" checked={settings.trialEnabled} onChange={(e) => handleChange('trialEnabled', e.target.checked)} className="w-5 h-5 text-gray-900 rounded focus:ring-gray-900 border-gray-300"/><div className="flex-1"><span className="block font-bold text-gray-900 text-sm">Offer a free trial period</span><span className="text-xs text-gray-500">Allow students to access content before billing.</span></div>{settings.trialEnabled && (<div className="flex items-center gap-2"><input type="number" value={settings.trialDays || ''} onChange={(e) => handleChange('trialDays', parseInt(e.target.value) || 0)} className="w-20 px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none text-sm font-bold text-center"/><span className="text-sm font-medium text-gray-600">Days</span></div>)}</div></div>
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6"><h4 className="font-bold text-gray-900 text-lg flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">3</span> Enrollment Settings</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Max Enrollments (Optional)</label><div className="relative"><Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="number" value={settings.maxEnrollments || ''} onChange={(e) => handleChange('maxEnrollments', parseInt(e.target.value) || 0)} placeholder="Unlimited" className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 text-gray-900 border-none outline-none focus:ring-2 focus:ring-yellow-400"/></div></div><div><label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Start Date (Optional)</label><div className="relative"><Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/><input type="date" value={settings.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl bg-stone-50 border-none outline-none focus:ring-2 focus:ring-yellow-400 text-gray-600"/></div></div></div></div>
             <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm space-y-6"><h4 className="font-bold text-gray-900 text-lg flex items-center gap-2"><span className="w-6 h-6 rounded-full bg-stone-100 text-stone-600 text-xs flex items-center justify-center">4</span> Publication Status</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.publicationStatus === 'Draft' ? 'border-gray-400 bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}><input type="radio" name="publicationStatus" value="Draft" checked={settings.publicationStatus === 'Draft'} onChange={() => handleChange('publicationStatus', 'Draft')} className="w-5 h-5 text-gray-600 focus:ring-gray-500"/><div className="ml-3"><span className="block font-bold text-gray-900 flex items-center gap-2"><Lock size={14}/> Save as Draft</span><span className="text-xs text-gray-500">Only visible to you.</span></div></label><label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${settings.publicationStatus === 'Published' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}><input type="radio" name="publicationStatus" value="Published" checked={settings.publicationStatus === 'Published'} onChange={() => handleChange('publicationStatus', 'Published')} className="w-5 h-5 text-green-600 focus:ring-green-500"/><div className="ml-3"><span className="block font-bold text-gray-900 flex items-center gap-2"><Globe size={14}/> Publish Now</span><span className="text-xs text-gray-500">Live for enrollment.</span></div></label></div></div>
             <div className="flex justify-end pt-6"><button onClick={handleSave} disabled={isPublishing} className={`px-10 py-4 rounded-2xl font-bold text-lg transition-all flex items-center gap-2 shadow-lg ${settings.publicationStatus === 'Published' ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200' : 'bg-gray-900 hover:bg-black text-white'}`}>{isPublishing ? <Loader2 className="animate-spin" size={20}/> : (settings.publicationStatus === 'Published' ? <Globe size={20}/> : <Save size={20}/>)}{isPublished ? 'Update Settings' : (settings.publicationStatus === 'Published' ? 'Publish Course' : 'Save Draft')}</button></div>
        </div>
    );
};

// --- MAIN WRAPPER ---

const CourseManager: React.FC<CourseManagerProps> = ({ 
  onBack, 
  availableMaterials = [], 
  onNavigateToLibrary,
  initialMode = 'LIST'
}) => {
  const [currentView, setCurrentView] = useState<StageView>(initialMode === 'CREATE_FLOW' ? 'STAGE_1' : 'LIST');
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [activeCourseData, setActiveCourseData] = useState<Course | null>(null);

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
    
    // Check for Published Edit Mode (Stage 10)
    if (course.creationStage === 10) {
        setCurrentView('STAGE_1');
        return;
    }

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
                              6: 'border-green-400 bg-green-50/10 hover:border-green-500',
                              10: 'border-green-500 bg-white hover:border-green-600'
                          };
                          
                          const displayLabel = {
                            1: 'Step 1: Details Saved',
                            2: 'Step 2: AI Structure',
                            3: 'Step 3: Structure Set',
                            4: 'Step 4: Materials',
                            5: 'Step 5: Personas',
                            6: 'Ready to Publish',
                            10: 'Live'
                          }[course.creationStage] || 'Draft';

                          return (
                              <div 
                                  key={course.id} 
                                  onClick={() => handleCourseClick(course)}
                                  className={`group bg-white rounded-[32px] p-6 border-2 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative ${stageColors[course.creationStage as keyof typeof stageColors] || 'border-gray-200'}`}
                              >
                                  <div className="flex justify-between items-start mb-4">
                                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white border shadow-sm ${
                                          course.creationStage === 10 ? 'text-green-600 border-green-200' : 'text-gray-600 border-gray-200'
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
                                      {course.creationStage < 10 && (
                                          <span className="flex items-center gap-1 text-sm font-bold text-gray-900 group-hover:translate-x-1 transition-transform">
                                              Continue <ArrowRight size={16}/>
                                          </span>
                                      )}
                                      {course.creationStage === 10 && (
                                          <span className="flex items-center gap-1 text-sm font-bold text-green-600 group-hover:translate-x-1 transition-transform">
                                              Edit Content <ArrowRight size={16}/>
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

  const StageWrapper = ({ title, stage, children, noPadding = false, isPublished = false }: React.PropsWithChildren<{ title: string, stage: number, noPadding?: boolean, isPublished?: boolean }>) => (
      <div className={`bg-white/90 backdrop-blur-xl min-h-screen rounded-[40px] border border-white shadow-lg animate-fade-in relative flex flex-col ${noPadding ? '' : 'p-8'}`}>
          {!noPadding && (
            <div className="flex justify-between items-center mb-8 shrink-0">
                <div>
                    <button onClick={returnToDashboard} className="text-sm text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-1 font-medium">
                        <ChevronDown size={16} className="rotate-90" /> Back to Manage Courses
                    </button>
                    <h2 className="text-3xl font-bold text-gray-900">{isPublished ? `Editing: ${activeCourseData?.title}` : title}</h2>
                    
                    {!isPublished ? (
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
                    ) : (
                        // Published Navigation Menu
                        <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { view: 'STAGE_1', label: 'Details' },
                                { view: 'STAGE_3', label: 'Structure' },
                                { view: 'STAGE_4', label: 'Materials' },
                                { view: 'STAGE_5', label: 'Coaches' },
                                { view: 'STAGE_6', label: 'Pricing' }
                            ].map(item => (
                                <button 
                                    key={item.view}
                                    onClick={() => setCurrentView(item.view as StageView)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                                        currentView === item.view 
                                        ? 'bg-gray-900 text-white shadow-sm' 
                                        : 'bg-stone-100 text-gray-600 hover:bg-stone-200'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          )}
          <div className={`flex-1 overflow-y-auto custom-scrollbar ${noPadding ? '' : 'pb-10'}`}>
              {children}
          </div>
      </div>
  );

  const isPublishedEdit = activeCourseData?.creationStage === 10;

  return (
      <>
          {currentView === 'STAGE_1' && (
              <StageWrapper title="Stage 1: Course Details" stage={1} isPublished={isPublishedEdit}>
                  <Stage1Details 
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                      courseId={isPublishedEdit ? activeCourseId : null}
                      initialData={isPublishedEdit ? activeCourseData : null}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_2' && activeCourseId && (
              <StageWrapper title="Stage 2: AI Course Architect" stage={2} isPublished={isPublishedEdit}>
                  <Stage2AIChat 
                      courseId={activeCourseId}
                      contextData={activeCourseData}
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_3' && activeCourseId && (
               <StageWrapper title="Stage 3: Curriculum Structure" stage={3} isPublished={isPublishedEdit}>
                   <Stage3Structure 
                       courseId={activeCourseId} 
                       onComplete={returnToDashboard} 
                       availableMaterials={availableMaterials}
                       isPublished={isPublishedEdit}
                   />
               </StageWrapper>
          )}

          {currentView === 'STAGE_4' && activeCourseId && (
              <StageWrapper title="Stage 4: Course Materials" stage={4} isPublished={isPublishedEdit}>
                  <Stage4Materials 
                      courseId={activeCourseId}
                      availableMaterials={availableMaterials}
                      onComplete={returnToDashboard}
                      isPublished={isPublishedEdit}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_5' && activeCourseId && (
              <StageWrapper title="Stage 5: Assign AI Coaches" stage={5} isPublished={isPublishedEdit}>
                  <Stage5Personas 
                      courseId={activeCourseId}
                      onComplete={returnToDashboard}
                      isPublished={isPublishedEdit}
                  />
              </StageWrapper>
          )}

          {currentView === 'STAGE_6' && activeCourseId && activeCourseData && (
              <StageWrapper title="Stage 6: Pricing & Publication" stage={6} isPublished={isPublishedEdit}>
                  <Stage6Pricing 
                      courseId={activeCourseId}
                      currentCourse={activeCourseData}
                      onComplete={returnToDashboard}
                      isPublished={isPublishedEdit}
                  />
              </StageWrapper>
          )}

          {currentView === 'OVERVIEW' && activeCourseData && (
               <StageWrapper title="Course Overview" stage={6} isPublished={false}>
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
